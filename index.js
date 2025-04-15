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

// Function to run Grad-CAM visualization
function runGradCAM(imagePath) {
    return new Promise((resolve, reject) => {
        console.log(`Running Grad-CAM on: ${imagePath}`);

        // Check if file exists
        if (!fs.existsSync(imagePath)) {
            return reject(`File not found: ${imagePath}`);
        }

        const python = spawn('python', ['gradcam.py', imagePath]);

        let stdout = '';
        let stderr = '';

        python.stdout.on('data', (data) => {
            stdout += data.toString();
            console.log("Grad-CAM stdout:", data.toString().trim());
        });

        python.stderr.on('data', (data) => {
            stderr += data.toString();
            console.log("Grad-CAM stderr:", data.toString().trim());
        });

        python.on('close', (code) => {
            console.log(`Grad-CAM process exited with code ${code}`);

            if (code === 0) {
                try {
                    // Give a moment for streams to finish
                    setTimeout(() => {
                        console.log("📦 Raw Grad-CAM stdout:", stdout.trim());

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
                console.error(`Grad-CAM script failed with code ${code}`);
                reject(`Grad-CAM script error: ${stderr}`);
            }
        });

        python.on('error', (err) => {
            reject(`Failed to start Grad-CAM process: ${err.message}`);
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
app.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
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

// New route for Grad-CAM visualization
// app.post('/visual', upload.single('image'), async (req, res) => {
//     try {
//         // Use existing image path if provided
//         let imagePath;

//         if (req.body.imagePath && fs.existsSync(req.body.imagePath)) {
//             // Use image path from request
//             imagePath = req.body.imagePath;
//         } else if (req.file) {
//             // Use newly uploaded file
//             imagePath = req.file.path;
//         } else {
//             return res.status(400).json({ error: "No image provided" });
//         }

//         console.log("Running Grad-CAM visualization on:", imagePath);

//         const result = await runGradCAM(imagePath);
//         console.log("Grad-CAM result:", result);

//         res.json(result);
//     } catch (err) {
//         console.error('❌ Grad-CAM visualization failed:', err);
//         res.status(500).json({ error: 'Visualization failed', details: err.toString() });
//     } finally {
//         // Clean up only if a new file was uploaded
//         if (req.file) {
//             fs.unlink(req.file.path, (err) => {
//                 if (err) console.error('Error deleting uploaded file:', err);
//             });
//         }
//     }
// });

// // Serve visualization images
// app.use('/visualizations', express.static('visualizations'));

// Report generation route
// app.post('/report', async (req, res) => {
//     try {
//         console.log("entered report");
//         const { id, NMC_id } = req.body;
//         console.log("patient id", id);
//         const patient = await PatientModel.findByPk(id);
//         if (!patient) return res.status(404).json({ error: "Patient not found" });

//         const doctorInfo = await DoctorModel.findOne({
//             attributes: ['NMC_id', 'name', 'contact'],
//             where: { NMC_id: NMC_id }
//         });
//         if (!doctorInfo) return res.status(404).json({ error: "Doctor not found" });
//         console.log(doctorInfo.name);

//         const doc = new PDFDocument({
//             size: 'A4',
//             margins: { top: 40, bottom: 40, left: 40, right: 40 }, // Adjust margins for symmetry
//             background: '#e0f2f7' // Light blue background
//         });
//         const pdfPath = `reports/${Date.now()}_report.pdf`;
//         const writeStream = fs.createWriteStream(pdfPath);
//         doc.pipe(writeStream);

//         const greenColor = '#4caf50'; // Green color for lines
//         const labelWidth = 150; // Define a fixed width for labels
//         const valueX = labelWidth + 10; // X-coordinate for values

//         // --- Header ---
//         const logoPath = path.join(__dirname, 'public', 'images', 'respira_logo.png'); // Replace with your actual logo path
//         try {
//             doc.image(logoPath, 40, 40, { width: 70, align: 'left' }); // Adjust position and size, align left
//         } catch (err) {
//             console.error("Error loading logo:", err);
//         }
//         doc.fontSize(26).font('Helvetica-Bold').fillColor('#2196f3').text('RespiraScan', 120, 45, { align: 'left' }); // Bold, blue software name
//         doc.fontSize(16).fillColor('#757575').text('Diagnosis Report', 120, 75, { align: 'left' }); // Gray subtitle
//         doc.strokeColor(greenColor)
//             .lineWidth(1.5)
//             .moveTo(40, 115)
//             .lineTo(560, 115)
//             .stroke();
//         doc.moveDown(1.5);

//         // --- Doctor Information ---
//         doc.fontSize(18).font('Helvetica-Bold').fillColor('#3f51b5').text('Doctor Information', 40, doc.y); // Bold, indigo heading
//         doc.moveDown(0.7);
//         doc.fontSize(14).fillColor('#212121').text(`Doctor Name:`, 80, doc.y, { width: labelWidth, align: 'left' });
//         doc.fontSize(14).fillColor('#424242').text(`${doctorInfo.name}`, valueX, doc.y, { align: 'left' });
//         doc.moveDown(0.5);
//         doc.fontSize(14).fillColor('#212121').text(`Doctor Contact:`, 80, doc.y, { width: labelWidth, align: 'left' });
//         doc.fontSize(14).fillColor('#424242').text(`${doctorInfo.contact}`, valueX, doc.y, { align: 'left' });
//         doc.moveDown(1);
//         doc.strokeColor(greenColor)
//             .lineWidth(0.8)
//             .moveTo(40, doc.y)
//             .lineTo(560, doc.y)
//             .stroke();
//         doc.moveDown(1.5);

//         // --- Patient Information ---
//         doc.fontSize(18).font('Helvetica-Bold').fillColor('#3f51b5').text('Patient Information', 40, doc.y); // Bold, indigo heading
//         doc.moveDown(0.7);
//         doc.fontSize(14).fillColor('#212121').text(`Patient Name:`, 50, doc.y, { width: labelWidth, align: 'left' });
//         doc.fontSize(14).fillColor('#424242').text(`${patient.name}`, valueX, doc.y, { align: 'left' });
//         doc.moveDown(0.5);
//         doc.fontSize(14).fillColor('#212121').text(`Patient ID:`, 50, doc.y, { width: labelWidth, align: 'left' });
//         doc.fontSize(14).fillColor('#424242').text(`${patient.id}`, valueX, doc.y, { align: 'left' });
//         doc.moveDown(0.5);
//         doc.fontSize(14).fillColor('#212121').text(`Sex:`, 50, doc.y, { width: labelWidth, align: 'left' });
//         doc.fontSize(14).fillColor('#424242').text(`${patient.sex}`, valueX, doc.y, { align: 'left' });
//         doc.moveDown(0.5);
//         doc.fontSize(14).fillColor('#212121').text(`Email:`, 50, doc.y, { width: labelWidth, align: 'left' });
//         doc.fontSize(14).fillColor('#424242').text(`${patient.email}`, valueX, doc.y, { align: 'left' });
//         doc.moveDown(0.5);

//       // Check if visualization exists and add it to the report
//       if (final_result.visualizations && final_result.visualizations.overlay) {
//           try {
//               const overlayPath = final_result.visualizations.overlay;
//               if (fs.existsSync(overlayPath)) {
//                   doc.fontSize(16).fillColor('#3f51b5').text('Visualization:', 40, doc.y, { align: 'left' });
//                   doc.moveDown(0.5);
//                   doc.image(overlayPath, {
//                       fit: [480, 300],
//                       align: 'center'
//                   });
//                   doc.moveDown(1);
//                   doc.fontSize(12).fillColor('#757575').text('Heatmap shows areas of the image most influential in the diagnosis', { align: 'center' });
//                   doc.moveDown(1);
//               }
//           } catch (err) {
//               console.error("Error adding visualization to report:", err);
//           }
//       }

//       // --- Footer ---
//       const reportDate = new Date().toLocaleString();
//       doc.strokeColor(greenColor)
//          .lineWidth(1.5)
//          .moveTo(40, doc.page.height - 60)
//          .lineTo(560, doc.page.height - 60)
//          .stroke();
//       doc.fontSize(12).fillColor('#757575').text(`Report Date: ${reportDate}`, 40, doc.page.height - 45, { align: 'left' });
//       doc.fontSize(12).fillColor('#757575').text('Prediction is model based and thus can be inaccurate', 40, doc.page.height - 30, { align: 'left' });
//       doc.fontSize(12).fillColor('#757575').text(`Page 1`, doc.page.width - 80, doc.page.height - 45, { align: 'right' });

//       doc.end();
//       console.log("pdf generated");
//       try {
//           await ReportModel.create({
//               patient_id: patient.id,
//               reportPath: pdfPath,
//               diagnosis: final_result.label,
//           });
//           console.log("Report created successfully");
//       } catch (err) {
//           console.error("Error creating report:", err.message);
//           console.error(err.stack);
//       }

//       writeStream.on('finish', () => {
//           res.download(pdfPath, 'RespiraScan_Report.pdf', (err) => {
//               if (err) console.error("Download error:", err);
//               // Clean up files
//               if (fs.existsSync(pdfPath)) {
//                   fs.unlinkSync(pdfPath);
//               }
//           });
//       });

//   } catch (err) {
//       console.error("❌ Report generation error:", err);
//       res.status(500).json({ error: "Internal server error", details: err.toString() });
//   }
// });
// app.post('/report', async (req, res) => {
//   try {
//       console.log("entered report");
//       const { id, NMC_id } = req.body;
//       console.log("patient id", id);
      
//       // Validate inputs
//       if (!id || !NMC_id) {
//           return res.status(400).json({ error: "Patient ID and Doctor NMC ID are required" });
//       }

//       const patient = await PatientModel.findByPk(id);
//       if (!patient) return res.status(404).json({ error: "Patient not found" });

//       const doctorInfo = await DoctorModel.findOne({
//           attributes: ['NMC_id', 'name', 'contact'],
//           where: { NMC_id: NMC_id }
//       });
//       if (!doctorInfo) return res.status(404).json({ error: "Doctor not found" });
//       console.log(doctorInfo.name);

//       // Ensure reports directory exists
//       const reportsDir = path.join(__dirname, 'reports');
//       if (!fs.existsSync(reportsDir)) {
//           fs.mkdirSync(reportsDir, { recursive: true });
//       }

//       const doc = new PDFDocument({
//           size: 'A4',
//           margins: { top: 40, bottom: 40, left: 40, right: 40 },
//           background: '#e0f2f7'
//       });

//       const pdfFilename = `${Date.now()}_report.pdf`;
//       const pdfPath = path.join(reportsDir, pdfFilename);
//       const writeStream = fs.createWriteStream(pdfPath);
//       doc.pipe(writeStream);

//       // --- Header ---
//       doc.fontSize(26).font('Helvetica-Bold').fillColor('#2196f3').text('RespiraScan', 120, 45, { align: 'left' });
//       doc.fontSize(16).fillColor('#757575').text('Diagnosis Report', 120, 75, { align: 'left' });
//       doc.strokeColor('#4caf50')
//           .lineWidth(1.5)
//           .moveTo(40, 115)
//           .lineTo(560, 115)
//           .stroke();
//       doc.moveDown(1.5);

//       // --- Doctor Information ---
//       doc.fontSize(18).font('Helvetica-Bold').fillColor('#3f51b5').text('Doctor Information', 40, doc.y);
//       doc.moveDown(0.7);
//       doc.fontSize(14).text(`Doctor Name: ${doctorInfo.name}`, 50, doc.y);
//       doc.moveDown(0.5);
//       doc.fontSize(14).text(`Doctor Contact: ${doctorInfo.contact}`, 50, doc.y);
//       doc.moveDown(1);
//       doc.strokeColor('#4caf50')
//           .lineWidth(0.8)
//           .moveTo(40, doc.y)
//           .lineTo(560, doc.y)
//           .stroke();
//       doc.moveDown(1.5);

//       // --- Patient Information ---
//       doc.fontSize(18).font('Helvetica-Bold').fillColor('#3f51b5').text('Patient Information', 40, doc.y);
//       doc.moveDown(0.7);
//       doc.fontSize(14).text(`Patient Name: ${patient.name}`, 50, doc.y);
//       doc.moveDown(0.5);
//       doc.fontSize(14).text(`Patient ID: ${patient.id}`, 50, doc.y);
//       doc.moveDown(0.5);
//       doc.fontSize(14).text(`Sex: ${patient.sex}`, 50, doc.y);
//       doc.moveDown(0.5);
//       doc.fontSize(14).text(`Email: ${patient.email}`, 50, doc.y);
//       doc.moveDown(0.5);

//       // --- Diagnosis Information ---
//       if (final_result) {
//           doc.fontSize(18).font('Helvetica-Bold').fillColor('#3f51b5').text('Diagnosis Results', 40, doc.y);
//           doc.moveDown(0.7);
//           doc.fontSize(14).text(`Diagnosis: ${final_result.label || 'N/A'}`, 50, doc.y);
//           doc.moveDown(0.5);
//           doc.fontSize(14).text(`Confidence: ${final_result.confidence ? (final_result.confidence * 100).toFixed(2) + '%' : 'N/A'}`, 50, doc.y);
//           doc.moveDown(1);
//       }

//       // --- Footer ---
//       const reportDate = new Date().toLocaleString();
//       doc.strokeColor('#4caf50')
//          .lineWidth(1.5)
//          .moveTo(40, doc.page.height - 60)
//          .lineTo(560, doc.page.height - 60)
//          .stroke();
//       doc.fontSize(12).fillColor('#757575').text(`Report Date: ${reportDate}`, 40, doc.page.height - 45, { align: 'left' });
//       doc.fontSize(12).fillColor('#757575').text('Prediction is model based and thus can be inaccurate', 40, doc.page.height - 30, { align: 'left' });

//       doc.end();

//       writeStream.on('finish', async () => {
//           try {
//               await ReportModel.create({
//                   patient_id: patient.id,
//                   reportPath: pdfPath,
//                   diagnosis: final_result?.label || 'Unknown',
//               });
//               console.log("Report created successfully");

//               // Send the PDF as response
//               res.setHeader('Content-Type', 'application/pdf');
//               res.setHeader('Content-Disposition', `attachment; filename=RespiraScan_Report_${patient.id}.pdf`);
              
//               const fileStream = fs.createReadStream(pdfPath);
//               fileStream.pipe(res);
              
//               fileStream.on('end', () => {
//                   // Clean up the file after sending
//                   fs.unlink(pdfPath, (err) => {
//                       if (err) console.error("Error deleting temporary PDF:", err);
//                   });
//               });
//           } catch (err) {
//               console.error("Error creating report:", err);
//               res.status(500).json({ error: "Failed to create report record" });
//           }
//       });

//       writeStream.on('error', (err) => {
//           console.error("PDF write stream error:", err);
//           res.status(500).json({ error: "PDF generation failed" });
//       });

//   } catch (err) {
//       console.error("❌ Report generation error:", err);
//       res.status(500).json({ error: "Internal server error", details: err.message });
//   }
// });
// app.post('/report', async (req, res) => {
//   try {
//       console.log("entered report");
//       const { id, NMC_id } = req.body;
//       console.log("patient id", id);
      
//       // Validate inputs
//       if (!id || !NMC_id) {
//           return res.status(400).json({ error: "Patient ID and Doctor NMC ID are required" });
//       }

//       const patient = await PatientModel.findByPk(id);
//       if (!patient) return res.status(404).json({ error: "Patient not found" });

//       const doctorInfo = await DoctorModel.findOne({
//           attributes: ['NMC_id', 'name', 'contact'],
//           where: { NMC_id: NMC_id }
//       });
//       if (!doctorInfo) return res.status(404).json({ error: "Doctor not found" });

//       // Ensure reports directory exists
//       const reportsDir = path.join(__dirname, 'reports');
//       if (!fs.existsSync(reportsDir)) {
//           fs.mkdirSync(reportsDir, { recursive: true });
//       }

//       const pdfFilename = `${Date.now()}_report.pdf`;
//       const pdfPath = path.join(reportsDir, pdfFilename);

//       // Create a promise to handle PDF generation
//       const pdfGenerated = new Promise((resolve, reject) => {
//           const doc = new PDFDocument({
//               size: 'A4',
//               margins: { top: 40, bottom: 40, left: 40, right: 40 },
//               background: '#e0f2f7'
//           });

//           const writeStream = fs.createWriteStream(pdfPath);
//           doc.pipe(writeStream);

//           // --- Header ---
//           doc.fontSize(26).font('Helvetica-Bold').fillColor('#2196f3').text('RespiraScan', 120, 45, { align: 'left' });
//           doc.fontSize(16).fillColor('#757575').text('Diagnosis Report', 120, 75, { align: 'left' });
//           doc.strokeColor('#4caf50')
//               .lineWidth(1.5)
//               .moveTo(40, 115)
//               .lineTo(560, 115)
//               .stroke();
//           doc.moveDown(1.5);

//           // --- Doctor Information ---
//           doc.fontSize(18).font('Helvetica-Bold').fillColor('#3f51b5').text('Doctor Information', 40, doc.y);
//           doc.moveDown(0.7);
//           doc.fontSize(14).text(`Doctor Name: ${doctorInfo.name}`, 50, doc.y);
//           doc.moveDown(0.5);
//           doc.fontSize(14).text(`Doctor Contact: ${doctorInfo.contact}`, 50, doc.y);
//           doc.moveDown(1);
//           doc.strokeColor('#4caf50')
//               .lineWidth(0.8)
//               .moveTo(40, doc.y)
//               .lineTo(560, doc.y)
//               .stroke();
//           doc.moveDown(1.5);

//           // --- Patient Information ---
//           doc.fontSize(18).font('Helvetica-Bold').fillColor('#3f51b5').text('Patient Information', 40, doc.y);
//           doc.moveDown(0.7);
//           doc.fontSize(14).text(`Patient Name: ${patient.name}`, 50, doc.y);
//           doc.moveDown(0.5);
//           doc.fontSize(14).text(`Patient ID: ${patient.id}`, 50, doc.y);
//           doc.moveDown(0.5);
//           doc.fontSize(14).text(`Sex: ${patient.sex}`, 50, doc.y);
//           doc.moveDown(0.5);
//           doc.fontSize(14).text(`Email: ${patient.email}`, 50, doc.y);
//           doc.moveDown(0.5);

//           // --- Diagnosis Information ---
//           if (final_result) {
//               doc.fontSize(18).font('Helvetica-Bold').fillColor('#3f51b5').text('Diagnosis Results', 40, doc.y);
//               doc.moveDown(0.7);
//               doc.fontSize(14).text(`Diagnosis: ${final_result.label || 'N/A'}`, 50, doc.y);
//               doc.moveDown(0.5);
//               doc.fontSize(14).text(`Confidence: ${final_result.confidence ? (final_result.confidence * 100).toFixed(2) + '%' : 'N/A'}`, 50, doc.y);
//               doc.moveDown(1);
//           }

//           // --- Footer ---
//           const reportDate = new Date().toLocaleString();
//           doc.strokeColor('#4caf50')
//              .lineWidth(1.5)
//              .moveTo(40, doc.page.height - 60)
//              .lineTo(560, doc.page.height - 60)
//              .stroke();
//           doc.fontSize(12).fillColor('#757575').text(`Report Date: ${reportDate}`, 40, doc.page.height - 45, { align: 'left' });
//           doc.fontSize(12).fillColor('#757575').text('Prediction is model based and thus can be inaccurate', 40, doc.page.height - 30, { align: 'left' });

//           writeStream.on('finish', () => {
//               resolve(pdfPath);
//           });

//           writeStream.on('error', (err) => {
//               reject(err);
//           });

//           doc.end();
//       });

//       // Wait for PDF to be fully generated
//       await pdfGenerated;

//       // Create report record in database
//       await ReportModel.create({
//           patient_id: patient.id,
//           reportPath: pdfPath,
//           diagnosis: final_result?.label || 'Unknown',
//       });

//       // Send the PDF as response
//       res.setHeader('Content-Type', 'application/pdf');
//       res.setHeader('Content-Disposition', `attachment; filename=RespiraScan_Report_${patient.id}.pdf`);
      
//       const fileStream = fs.createReadStream(pdfPath);
//       fileStream.pipe(res);
      
//       fileStream.on('close', () => {
//           // Clean up the file after sending
//           fs.unlink(pdfPath, (err) => {
//               if (err) console.error("Error deleting temporary PDF:", err);
//           });
//       });

//   } catch (err) {
//       console.error("❌ Report generation error:", err);
//       res.status(500).json({ error: "Internal server error", details: err.message });
//   }
// });
app.post('/report', async (req, res) => {
  try {
      console.log("Starting report generation...");
      const { id, NMC_id } = req.body;
      
      // Validate inputs
      if (!id || !NMC_id) {
          return res.status(400).json({ error: "Patient ID and Doctor NMC ID are required" });
      }

      const patient = await PatientModel.findByPk(id);
      if (!patient) return res.status(404).json({ error: "Patient not found" });

      const doctorInfo = await DoctorModel.findOne({
          where: { NMC_id: NMC_id }
      });
      if (!doctorInfo) return res.status(404).json({ error: "Doctor not found" });

      // Create a temporary directory that's not synced by OneDrive
      const tempDir = path.join(os.tmpdir(), 'respirascan-reports');
      if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
      }

      const pdfFilename = `report_${Date.now()}_${patient.id}.pdf`;
      const pdfPath = path.join(tempDir, pdfFilename);

      // Generate PDF directly to memory first
      const doc = new PDFDocument();
      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      
      // Build PDF content
      doc.fontSize(20).text('RespiraScan Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(16).text(`Patient: ${patient.name} (ID: ${patient.id})`);
      // Add all your other report content here...

      doc.end(); // Finalize the PDF

      // Wait for PDF to finish generating
      await new Promise((resolve) => doc.on('end', resolve));

      // Combine chunks into a Buffer
      const pdfBuffer = Buffer.concat(chunks);

      // Option 1: Send directly to client without saving
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${pdfFilename}`);
      res.send(pdfBuffer);

      // Option 2: If you need to save it temporarily
      fs.writeFile(pdfPath, pdfBuffer, async (err) => {
          if (err) {
              console.error("Failed to save PDF temporarily:", err);
              return;
          }
          
          try {
              await ReportModel.create({
                  patient_id: patient.id,
                  reportPath: pdfPath,
                  diagnosis: final_result?.label || 'Unknown',
              });
              
              // Schedule cleanup after 1 hour (adjust as needed)
              setTimeout(() => {
                  fs.unlink(pdfPath, (err) => {
                      if (err) console.error("Cleanup error:", err);
                  });
              }, 3600000);
          } catch (dbErr) {
              console.error("Database error:", dbErr);
          }
      });

  } catch (err) {
      console.error("Report generation failed:", err);
      res.status(500).json({ error: "Report generation failed" });
  }
});
// Enhanced endpoint to generate report with visualization
// app.post('/enhanced-report', async (req, res) => {
//     try {
//         const { id, NMC_id, imagePath } = req.body;
        
//         // If explicit path provided, use it
//         let imgPath = imagePath;
        
//         // If no path, use the last uploaded image
//         if (!imgPath && lastUploadedImagePath && fs.existsSync(lastUploadedImagePath)) {
//             imgPath = lastUploadedImagePath;
//         }
        
//         if (!imgPath || !fs.existsSync(imgPath)) {
//             return res.status(400).json({ error: "No valid image available. Please upload an image first." });
//         }
        
//         // Generate Grad-CAM visualizations first
//         const visualResult = await runGradCAM(imgPath);
        
//         // Combine with existing prediction result
//         final_result = {
//             ...final_result,
//             visualizations: visualResult.visualizations
//         };
        
//         // Now generate the report with visualizations
//         // Forward to the report endpoint
//         req.body = { id, NMC_id };
//         app._router.handle(req, res, () => {});
        
//     } catch (err) {
//         console.error("❌ Enhanced report generation error:", err);
//         res.status(500).json({ error: "Internal server error", details: err.toString() });
//     }
// });

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