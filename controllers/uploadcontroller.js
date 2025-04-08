import multer from "multer";
import path from "path";
import fs from 'fs';
import { spawn } from 'child_process';
import PDFDocument from 'pdfkit';
import { PatientModel } from "../db.js";

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: "uploads/", // Save files in "uploads" folder
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  }
});

const upload = multer({ storage });

// Function to run Python prediction - IMPROVED VERSION
function predictImage(imagePath) {
  return new Promise((resolve, reject) => {
    console.log(`Running prediction on: ${imagePath}`);
    
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      return reject(`File not found: ${imagePath}`);
    }
    
    const python = spawn('python', ['predict.py', imagePath]);
    
    let stdout = '';
    let stderr = '';

    python.stdout.on('data', (data) => {
      stdout += data.toString();
      console.log("Python stdout:", data.toString().trim());
    });

    python.stderr.on('data', (data) => {
      stderr += data.toString();
      console.log("Python stderr:", data.toString().trim());
    });

    python.on('close', (code) => {
      console.log(`Python process exited with code ${code}`);
      
      if (code === 0) {
        try {
          // Give a moment for streams to finish and log the raw output
          setTimeout(() => {
            console.log("📦 Raw Python stdout:", stdout.trim());
            
            try {
              const output = JSON.parse(stdout.trim());
              resolve(output);
            } catch (err) {
              reject(`Failed to parse JSON: ${err.message}, Raw output: ${stdout.trim()}`);
            }
          }, 100);
        } catch (err) {
          reject(`Error in timeout handler: ${err.message}`);
        }
      } else {
        console.error(`Python script failed with code ${code}`);
        reject(`Python script error: ${stderr}`);
      }
    });

    python.on('error', (err) => {
      reject(`Failed to start Python process: ${err.message}`);
    });
  });
}

// Controller function for image upload and prediction
const handleImageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imagePath = req.file.path;
    console.log("Processing uploaded file:", imagePath);
    
    const result = await predictImage(imagePath);
    console.log("Prediction completed successfully:", result);
    res.json(result);
  } catch (err) {
    console.error('❌ Prediction failed:', err);
    res.status(500).json({ error: 'Prediction failed', details: err.toString() });
  } finally {
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting uploaded file:', err);
      });
    }
  }
};

// Controller function for report generation
const generateReport = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const imagePath = req.file.path;
    const patientId = req.body.patientId;

    const patient = await PatientModel.findByPk(patientId);
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    const result = await predictImage(imagePath);

    // Make sure the reports directory exists
    if (!fs.existsSync('reports')) {
      fs.mkdirSync('reports');
    }

    const doc = new PDFDocument();
    const pdfPath = `reports/${Date.now()}_report.pdf`;
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    doc.fontSize(20).text('🩺 RespiraScan Diagnosis Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Patient Name: ${patient.name}`);
    doc.text(`Patient ID: ${patient.id}`);
    doc.text(`Age: ${patient.age}`);
    doc.text(`Gender: ${patient.gender}`);
    doc.text(`Diagnosis: ${result.label}`);
    doc.text(`Confidence: ${(result.confidence * 100).toFixed(2)}%`);
    doc.moveDown().text(`Report Date: ${new Date().toLocaleString()}`);
    doc.end();

    writeStream.on('finish', () => {
      res.download(pdfPath, 'RespiraScan_Report.pdf', (err) => {
        if (err) console.error("Download error:", err);
        fs.unlinkSync(imagePath);
        fs.unlinkSync(pdfPath);
      });
    });

  } catch (err) {
    console.error("❌ Report generation error:", err);
    res.status(500).json({ error: "Internal server error", details: err.toString() });
  }
};

export { upload, handleImageUpload, generateReport };