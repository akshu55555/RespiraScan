import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import sequelize, { PatientModel } from "./db.js";
import fs from 'fs';
import { spawn } from 'child_process';
import path from 'path';
import PDFDocument from 'pdfkit';

// Controllers
import signup from "./controllers/signupcontrollerd.js";
import signup2 from "./controllers/signupcontrollerp.js";
import logindoc from "./controllers/logincontrollerd.js";
import loginpatient from './controllers/logincontrollerp.js';
import { ReportModel } from './db.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json({ strict: false }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin:"*",
  methods: "GET,POST,PUT,DELETE",
  credentials:true,
}));

// Ensure directories exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}
if (!fs.existsSync('reports')) {
  fs.mkdirSync('reports');
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
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

// Routes
app.get('/', (req, res) => res.status(200).json("HELLO"));

app.use('/signupdoctor', signup);
app.use('/signuppatient', signup2);
app.use('/logindoc', logindoc);
app.use('/loginpatient', loginpatient);

app.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
});

// Upload + Predict route
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        console.log("File uploaded:", req.file);
        const imagePath = req.file.path;
        
        const result = await predictImage(imagePath);
        console.log("Prediction result:", result);
        res.json(result);
    } catch (err) {
        console.error('❌ Prediction failed:', err);
        res.status(500).json({ error: 'Prediction failed', details: err.toString() });
    } finally {
        // Optionally clean up the file after processing
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting uploaded file:', err);
            });
        }
    }
});

// Report generation route
app.post('/report', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const imagePath = req.file.path;
        const id = req.body.id;

        const patient = await PatientModel.findByPk(id);
        if (!patient) return res.status(404).json({ error: "Patient not found" });

        const result = await predictImage(imagePath);

        const doc = new PDFDocument();
        const pdfPath = `reports/${Date.now()}_report.pdf`;
        const writeStream = fs.createWriteStream(pdfPath);
        doc.pipe(writeStream);

        doc.fontSize(20).text(' RespiraScan Diagnosis Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(14).text(`Patient Name: ${patient.name}`);
        doc.text(`Patient ID: ${patient.id}`);
        doc.text(`Name: ${patient.name}`);
        doc.text(`Sex: ${patient.sex}`);
        doc.text(`email: ${patient.email}`);
        doc.text(`age: ${patient.age}`);
        doc.text(`blood-group: ${patient.bg}`);
        doc.text(`weight: ${patient.weight}`);
        doc.text(`height: ${patient.height}`);
        doc.text(`Diagnosis: ${result.label}`);
        doc.text(`Confidence: ${(result.confidence * 100).toFixed(2)}%`);
        doc.moveDown().text(`Report Date: ${new Date().toLocaleString()}`);
        doc.moveDown();
        doc.moveDown();
        doc.moveDown();
        doc.moveDown();
        doc.moveDown();
        doc.moveDown();
        doc.moveDown();
        doc.moveDown();
        doc.moveDown();
        doc.moveDown();
        doc.text(`Prediction is model based and thus can be innacurate`);
        doc.end();

        try {
          await ReportModel.create({
            patient_id: patient.id,
            reportPath: pdfPath,
            diagnosis: result.label,
          });
          console.log("Report created successfully");
        } catch(err) {
          console.error("Error creating report:", err.message);
          console.error(err.stack);  // This will show the full error stack trace
        }
        
        writeStream.on('finish', () => {
            res.download(pdfPath, 'RespiraScan_Report.pdf', (err) => {
                if (err) console.error("Download error:", err);
                // Clean up files
                fs.unlinkSync(imagePath);
                fs.unlinkSync(pdfPath);
            });
        });

    } catch (err) {
        console.error("❌ Report generation error:", err);
        res.status(500).json({ error: "Internal server error", details: err.toString() });
    }
});

// Database connection and server start
sequelize.authenticate()
    .then(() => {
        console.log("✅ Database connected successfully!");

        const server = app.listen(PORT, () => {
            console.log(`✅ Server running on port ${server.address().port}`);
            console.log("You have reached RespiraScan server! Happy health!");
        });
    })
    .catch((err) => {
        console.error("❌ Database connection failed:", err);
    });