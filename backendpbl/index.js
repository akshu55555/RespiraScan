import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import sequelize, { DoctorModel, PatientModel } from "./db.js";
import fs from 'fs';
import { spawn } from 'child_process';
import path from 'path';
import PDFDocument from 'pdfkit';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);   //for pdf generation
const __dirname = path.dirname(__filename);
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
let final_result;
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        console.log("File uploaded:", req.file);
        const imagePath = req.file.path;
        
        const result = await predictImage(imagePath);
        final_result=result;
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
app.post('/report', async (req, res) => {
  try {
      console.log("entered report");
      const { id, NMC_id } = req.body;
      console.log("patient id", id);
      const patient = await PatientModel.findByPk(id);
      if (!patient) return res.status(404).json({ error: "Patient not found" });

      const doctorInfo = await DoctorModel.findOne({
          attributes: ['NMC_id', 'name', 'contact'],
          where: { NMC_id: NMC_id }
      });
      if (!doctorInfo) return res.status(404).json({ error: "Doctor not found" });
      console.log(doctorInfo.name);

      const doc = new PDFDocument({
          size: 'A4',
          margins: { top: 40, bottom: 40, left: 40, right: 40 }, // Adjust margins for symmetry
          background: '#e0f2f7' // Light blue background
      });
      const pdfPath = `reports/${Date.now()}_report.pdf`;
      const writeStream = fs.createWriteStream(pdfPath);
      doc.pipe(writeStream);

      const greenColor = '#4caf50'; // Green color for lines
      const labelWidth = 150; // Define a fixed width for labels
      const valueX = labelWidth + 10; // X-coordinate for values

      // --- Header ---
      const logoPath = path.join(__dirname, 'public', 'images', 'respira_logo.png'); // Replace with your actual logo path
      try {
          doc.image(logoPath, 40, 40, { width: 70, align: 'left' }); // Adjust position and size, align left
      } catch (err) {
          console.error("Error loading logo:", err);
      }
      doc.fontSize(26).font('Helvetica-Bold').fillColor('#2196f3').text('RespiraScan', 120, 45, { align: 'left' }); // Bold, blue software name
      doc.fontSize(16).fillColor('#757575').text('Diagnosis Report', 120, 75, { align: 'left' }); // Gray subtitle
      doc.strokeColor(greenColor)
         .lineWidth(1.5)
         .moveTo(40, 115)
         .lineTo(560, 115)
         .stroke();
      doc.moveDown(1.5);

      // --- Doctor Information ---
      doc.fontSize(18).font('Helvetica-Bold').fillColor('#3f51b5').text('Doctor Information', 40, doc.y); // Bold, indigo heading
      doc.moveDown(0.7);
      doc.fontSize(14).fillColor('#212121').text(`Doctor Name:`, 50, doc.y, { width: labelWidth, align: 'left' });
      doc.fontSize(14).fillColor('#424242').text(`${doctorInfo.name}`, valueX, doc.y, { align: 'left' });
      doc.moveDown(0.5);
      doc.fontSize(14).fillColor('#212121').text(`Doctor Contact:`, 50, doc.y, { width: labelWidth, align: 'left' });
      doc.fontSize(14).fillColor('#424242').text(`${doctorInfo.contact}`, valueX, doc.y, { align: 'left' });
      doc.moveDown(1);
      doc.strokeColor(greenColor)
         .lineWidth(0.8)
         .moveTo(40, doc.y)
         .lineTo(560, doc.y)
         .stroke();
      doc.moveDown(1.5);

      // --- Patient Information ---
      doc.fontSize(18).font('Helvetica-Bold').fillColor('#3f51b5').text('Patient Information', 40, doc.y); // Bold, indigo heading
      doc.moveDown(0.7);
      doc.fontSize(14).fillColor('#212121').text(`Patient Name:`, 50, doc.y, { width: labelWidth, align: 'left' });
      doc.fontSize(14).fillColor('#424242').text(`${patient.name}`, valueX, doc.y, { align: 'left' });
      doc.moveDown(0.5);
      doc.fontSize(14).fillColor('#212121').text(`Patient ID:`, 50, doc.y, { width: labelWidth, align: 'left' });
      doc.fontSize(14).fillColor('#424242').text(`${patient.id}`, valueX, doc.y, { align: 'left' });
      doc.moveDown(0.5);
      doc.fontSize(14).fillColor('#212121').text(`Sex:`, 50, doc.y, { width: labelWidth, align: 'left' });
      doc.fontSize(14).fillColor('#424242').text(`${patient.sex}`, valueX, doc.y, { align: 'left' });
      doc.moveDown(0.5);
      doc.fontSize(14).fillColor('#212121').text(`Email:`, 50, doc.y, { width: labelWidth, align: 'left' });
      doc.fontSize(14).fillColor('#424242').text(`${patient.email}`, valueX, doc.y, { align: 'left' });
      doc.moveDown(0.5);
      doc.fontSize(14).fillColor('#212121').text(`Age:`, 50, doc.y, { width: labelWidth, align: 'left' });
      doc.fontSize(14).fillColor('#424242').text(`${patient.age}`, valueX, doc.y, { align: 'left' });
      doc.moveDown(0.5);
      doc.fontSize(14).fillColor('#212121').text(`Blood Group:`, 50, doc.y, { width: labelWidth, align: 'left' });
      doc.fontSize(14).fillColor('#424242').text(`${patient.bg}`, valueX, doc.y, { align: 'left' });
      doc.moveDown(0.5);
      doc.fontSize(14).fillColor('#212121').text(`Weight:`, 50, doc.y, { width: labelWidth, align: 'left' });
      doc.fontSize(14).fillColor('#424242').text(`${patient.weight}`, valueX, doc.y, { align: 'left' });
      doc.moveDown(0.5);
      doc.fontSize(14).fillColor('#212121').text(`Height:`, 50, doc.y, { width: labelWidth, align: 'left' });
      doc.fontSize(14).fillColor('#424242').text(`${patient.height}`, valueX, doc.y, { align: 'left' });
      doc.moveDown(1);
      doc.strokeColor(greenColor)
         .lineWidth(0.8)
         .moveTo(40, doc.y)
         .lineTo(560, doc.y)
         .stroke();
      doc.moveDown(1.5);

      // --- Diagnosis ---
      doc.fontSize(18).font('Helvetica-Bold').fillColor('#3f51b5').text('Diagnosis', 40, doc.y); // Bold, indigo heading
      doc.moveDown(0.7);
      doc.fontSize(14).fillColor('#212121').text(`Diagnosis:`, 50, doc.y, { width: labelWidth, align: 'left' });
      doc.fontSize(14).fillColor('#2e7d32').font('Helvetica-Bold').text(`${final_result.label}`, valueX, doc.y, { align: 'left' }); // Bold green diagnosis
      doc.moveDown(0.5);
      doc.fontSize(14).fillColor('#212121').text(`Confidence:`, 50, doc.y, { width: labelWidth, align: 'left' });
      doc.fontSize(14).fillColor('#2e7d32').font('Helvetica-Bold').text(`${(final_result.confidence * 100).toFixed(2)}%`, valueX, doc.y, { align: 'left' }); // Bold green confidence
      doc.moveDown(2);

      // --- Footer ---
      const reportDate = new Date().toLocaleString();
      doc.strokeColor(greenColor)
         .lineWidth(1.5)
         .moveTo(40, doc.page.height - 60)
         .lineTo(560, doc.page.height - 60)
         .stroke();
      doc.fontSize(12).fillColor('#757575').text(`Report Date: ${reportDate}`, 40, doc.page.height - 45, { align: 'left' });
      doc.fontSize(12).fillColor('#757575').text('Prediction is model based and thus can be inaccurate', 40, doc.page.height - 30, { align: 'left' });
      doc.fontSize(12).fillColor('#757575').text(`Page 1`, doc.page.width - 80, doc.page.height - 45, { align: 'right' });

      doc.end();
      console.log("pdf generated");
      try {
          await ReportModel.create({
              patient_id: patient.id,
              reportPath: pdfPath,
              diagnosis: final_result.label,
          });
          console.log("Report created successfully");
      } catch (err) {
          console.error("Error creating report:", err.message);
          console.error(err.stack);
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