// index.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import sequelize from "./db.js";
import fs from 'fs';
import { spawn } from 'child_process';
import path from 'path';
import PDFDocument from 'pdfkit';
import PatientModel from "./db.js";

// Controllers
import signup from "./controllers/signupcontrollerd.js";
import signup2 from "./controllers/signupcontrollerp.js";
import logindoc from "./controllers/logincontrollerd.js";
import loginpatient from './controllers/logincontrollerp.js';

dotenv.config();
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json({ strict: false }));
app.use(express.urlencoded({ extended: true }));

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

// Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Upload + Predict route
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const imagePath = req.file.path;
        const result = await predictImage(imagePath);
        res.json(result);
    } catch (err) {
        console.error('❌ Prediction failed:', err);
        res.status(500).json({ error: 'Prediction failed', details: err });
    } finally {
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
        const patientId = req.body.patientId;

        const patient = await Patient.findByPk(patientId);
        if (!patient) return res.status(404).json({ error: "Patient not found" });

        const result = await predictImage(imagePath);

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
        res.status(500).json({ error: "Internal server error", details: err.message });
    }
});

// Python prediction
function predictImage(imagePath) {
    return new Promise((resolve, reject) => {
        const python = spawn('python', ['predict.py', imagePath]);

        let stdout = '';
        let stderr = '';

        python.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        python.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        python.on('close', (code) => {
            if (code === 0) {
                try {
                    console.log("📦 Raw Python Output:", stdout);

                    const output = JSON.parse(stdout.trim());
                    resolve(output);
                } catch (err) {
                    reject(`Failed to parse JSON: ${err.message}`);
                }
            } else {
                reject(stderr || 'Unknown error from Python script');
            }
        });

        python.on('error', (err) => {
            reject(`Failed to start Python process: ${err.message}`);
        });
    });
}

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
