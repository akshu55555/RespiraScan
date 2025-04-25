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
import previous from './controllers/previouscontroller.js';
import view from './controllers/viewcontroller.js';
import { ReportModel } from './db.js';
import patient_view from './controllers/patientviewcontroller.js';
import change from './controllers/changedoctorcontroller.js';
import getreports from './controllers/getreportsforpatientcontroller.js';

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
if (!fs.existsSync('visualizations')) {
    fs.mkdirSync('visualizations');
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Function to run Python prediction (for pneumonia)
function predictImage(imagePath) {
    return new Promise((resolve, reject) => {
        console.log(`Running pneumonia prediction on: ${imagePath}`);

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

// Function to run Python prediction (for tuberculosis)
function predictTuberculosisImage(imagePath) {
    return new Promise((resolve, reject) => {
        console.log(`Running tuberculosis prediction on: ${imagePath}`);

        // Check if file exists
        if (!fs.existsSync(imagePath)) {
            return reject(`File not found: ${imagePath}`);
        }

        const python = spawn('python', ['predict2.py', imagePath]); // Use predict2.py

        let stdout = '';
        let stderr = '';

        python.stdout.on('data', (data) => {
            stdout += data.toString();
            console.log("Python stdout (TB):", data.toString().trim());
        });

        python.stderr.on('data', (data) => {
            stderr += data.toString();
            console.log("Python stderr (TB):", data.toString().trim());
        });

        python.on('close', (code) => {
            console.log(`Python process exited with code ${code} (TB)`);

            if (code === 0) {
                try {
                    // Give a moment for streams to finish and log the raw output
                    setTimeout(() => {
                        console.log("📦 Raw Python stdout (TB):", stdout.trim());

                        try {
                            const output = JSON.parse(stdout.trim());
                            resolve(output);
                        } catch (err) {
                            reject(`Failed to parse JSON (TB): ${err.message}, Raw output: ${stdout.trim()}`);
                        }
                    }, 100);
                } catch (err) {
                    reject(`Error in timeout handler (TB): ${err.message}`);
                }
            } else {
                console.error(`Python script failed with code ${code} (TB)`);
                reject(`Python script error (TB): ${stderr}`);
            }
        });

        python.on('error', (err) => {
            reject(`Failed to start Python process (TB): ${err.message}`);
        });
    });
}


// Routes
app.get('/', (req, res) => res.status(200).json("HELLO"));

app.use('/signupdoctor', signup);
app.use('/signuppatient', signup2);
app.use('/logindoc', logindoc);
app.use('/loginpatient', loginpatient);
app.use('/previous-reports',previous);
app.use('/view-report',view);
app.use('/patient-view',patient_view);
app.use('/changedoc',change);
app.use('/get-reports',getreports);
app.post("/logout", (req, res) => {
    console.log("User logged out successfully");
    res.status(200).json({ message: "Logged out" });
});

// Upload + Predict route for pneumonia
let final_result;
app.post('/pneumonia', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        console.log("File uploaded for pneumonia:", req.file);
        const imagePath = req.file.path;

        // Run prediction
        const result = await predictImage(imagePath);

        // Store result for report generation
        final_result = result;

        console.log("Pneumonia prediction result:", result);
        res.json(result);
    } catch (err) {
        console.error('❌ Pneumonia prediction failed:', err);
        res.status(500).json({ error: 'Pneumonia prediction failed', details: err.toString() });
    }
    // Don't delete the file here since we'll need it for visualization
});

// Upload + Predict route for tuberculosis
app.post('/tuberculosis', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        console.log("File uploaded for tuberculosis:", req.file);
        const imagePath = req.file.path;

        // Run prediction for tuberculosis
        const result = await predictTuberculosisImage(imagePath); // Use the tuberculosis prediction function

        // Store result for report generation
        final_result = result;

        console.log("Tuberculosis prediction result:", result);
        res.json(result);
    } catch (err) {
        console.error('❌ Tuberculosis prediction failed:', err);
        res.status(500).json({ error: 'Tuberculosis prediction failed', details: err.toString() });
    }
    // Don't delete the file here since we'll need it for visualization
});


app.post('/report', async (req, res) => {
  try {
      const { id: patientId, NMC_id: doctorNmcId } = req.body;

      if (!patientId || !doctorNmcId) {
          return res.status(400).json({ error: "Patient ID and Doctor NMC ID are required" });
      }

      // Fetch patient information
      const patient = await PatientModel.findOne({ where: { id: patientId } });
      if (!patient) {
          return res.status(404).json({ error: "Patient not found" });
      }

      // Fetch doctor information
      const doctor = await DoctorModel.findOne({ where: { NMC_id: doctorNmcId } });
      if (!doctor) {
          return res.status(404).json({ error: "Doctor not found" });
      }
      console.log("patient", patient);
      console.log("doctor", doctor);
      // Use the final_result that was stored from prediction
      if (!final_result) {
          return res.status(400).json({ error: "No diagnosis result found. Please upload an image first." });
      }

      // Generate a unique filename for the PDF
      const reportFilename = `RespiraScan_Report_${patientId}_${Date.now()}.pdf`;
      const reportPath = path.join('C:', 'Users', 'shilpa', 'OneDrive', 'Desktop', 'RespiraScan', 'RespiraScan', 'backendpbl', 'reports', reportFilename);
      // Create the PDF document
      const doc = new PDFDocument({ margin: 50 });

      // Pipe the PDF to a writable stream
      const writeStream = fs.createWriteStream(reportPath);
      doc.pipe(writeStream);

      // Define logo path and size
      const logoPath = path.join(__dirname, '..', 'public', 'images', 'respira_logo.png');
      const logoSize = 60; // Increased from 36 to 60

      // Function to add the logo at the top left corner
      const addLogo = () => {
          try {
              // Position logo at top left (50 from left, 50 from top)
              // Make it square and larger
              doc.image(logoPath, 50, 50, { width: logoSize, height: logoSize });
          } catch (error) {
              console.error('Error adding logo:', error);
          }
      };

      // Add the logo at the beginning of the document
      addLogo();

      // Function to add a heading
      const addHeading = (text) => {
          doc.fillColor('black')
              .fontSize(16)
              .font('Helvetica-Bold')
              .text(text, 50, doc.y)
              .moveDown(0.7);
      };

      // PDF content generation
      // Position the title to align with the logo vertically
      const titleY = 50 + (logoSize / 2) - (25 / 2); // Center align with logo
      
      doc.fontSize(25)
          .font('Helvetica-Bold')
          .text('RespiraScan Medical Report', 50 + logoSize + 20, titleY, { align: 'left' }) // Positioned to right of logo
          .moveDown(1.5); // Adjusted spacing

      // Add current date
      const currentDate = new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
      });
      doc.fontSize(12)
          .font('Helvetica')
          .text(`Report Date: ${currentDate}`, { align: 'right' })
          .moveDown(1);

      // Draw a horizontal line
      doc.moveTo(50, doc.y)
          .lineTo(doc.page.width - 50, doc.y)
          .stroke()
          .moveDown(1);


      // Patient information section
      addHeading('Patient Information');

      doc.fontSize(12)
          .font('Helvetica')
          .text(`Patient ID: ${patient.id}`, 50, doc.y) // Position the text
          .text(`Name: ${patient.name}`, 50, doc.y)
          .text(`Email: ${patient.email}`, 50, doc.y)
          .text(`Age: ${patient.age || 'Not provided'}`, 50, doc.y)
          .text(`Sex: ${patient.sex || 'Not provided'}`, 50, doc.y)
          .moveDown(1);

      // Doctor information section
      addHeading('Doctor Information');

      doc.fontSize(12)
          .font('Helvetica')
          .text(`Doctor Name: ${doctor.name}`, 50, doc.y)
          .text(`NMC ID: ${doctor.NMC_id}`, 50, doc.y)
          .text(`Email: ${doctor.email}`, 50, doc.y)
          .moveDown(1);

      // Diagnosis results section
      addHeading('Diagnosis Results');

      doc.fontSize(12)
          .font('Helvetica')
          .text(`Diagnosis: ${final_result.label}`, 50, doc.y)
          .text(`Confidence: ${(final_result.confidence * 100).toFixed(2)}%`, 50, doc.y)
          .moveDown(0.5);

      // Recommendations section
      addHeading('Recommendations:');

      doc.fontSize(12)
          .font('Helvetica')
          .text('1. Maintain good respiratory hygiene practices.', 50, doc.y)
          .text('2. Schedule regular check-ups with your healthcare provider.', 50, doc.y)
          .text('3. Report any new or worsening symptoms promptly.', 50, doc.y)
          .moveDown(1);

      // Specific recommendations based on the disease
      if (final_result.label.toLowerCase().includes('pneumonia')) {
          // Overwrite the default recommendations
          doc.fontSize(12)
              .font('Helvetica')
              .text('1. Rest and adequate hydration are essential.', 50, doc.y)
              .text('2. Follow the prescribed antibiotic regimen completely.', 50, doc.y)
              .text('3. Schedule a follow-up X-ray to confirm resolution.', 50, doc.y)
              .text('4. Consult with your doctor before resuming physical activities.', 50, doc.y)
              .moveDown(1);
      } else if (final_result.label.toLowerCase().includes('tuberculosis')) {
          // Overwrite the default recommendations
          doc.fontSize(12)
              .font('Helvetica')
              .text('1. Complete the full course of prescribed TB medications.', 50, doc.y)
              .text('2. Attend all scheduled follow-up appointments.', 50, doc.y)
              .text('3. Follow infection control measures to prevent transmission.', 50, doc.y)
              .text('4. Report any adverse medication reactions to your healthcare provider.', 50, doc.y)
              .moveDown(1);
      }

      // Disclaimer
      doc.fontSize(10)
          .font('Helvetica-Oblique')
          .text('Disclaimer: This is an AI-assisted diagnosis and should be confirmed by a healthcare professional. ' +
              'The results provided are not a substitute for professional medical advice, diagnosis, or treatment.', {
              align: 'justify',
              indent: 50
          })
          .moveDown(2);

      // Footer with signature line
      doc.fontSize(12)
          .font('Helvetica')
          .text('____________________________', { align: 'right' })
          .moveDown(0.5)
          .text(`Dr. ${doctor.name}`, { align: 'right' })
          .moveDown(0.2)
          .text(`NMC ID: ${doctor.NMC_id}`, { align: 'right' });

      // Finalize the PDF
      doc.end();

      // Wait for PDF creation to complete
      writeStream.on('finish', async () => {
          try {
              // Create a record in the ReportModel with more complete information
              const newReport = await ReportModel.create({
                  patient_id: patient.id,
                  reportPath: reportFilename,   // Just the filename for storage efficiency
                  diagnosis: final_result.label,

              });

              // Send the PDF as a response
              res.setHeader('Content-Type', 'application/pdf');
              res.setHeader('Content-Disposition', `inline; filename="${reportFilename}"`);

              // Stream the file to the response
              fs.createReadStream(reportPath).pipe(res);
          } catch (err) {
              console.error('Error saving report to database:', err);
              res.status(500).json({ error: 'Failed to save report' });
          }
      });

      writeStream.on('error', (err) => {
          console.error('Error creating PDF:', err);
          res.status(500).json({ error: 'PDF generation failed' });
      });

  } catch (err) {
      console.error('Report generation error:', err);
      res.status(500).json({ error: 'Report generation failed', details: err.toString() });
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