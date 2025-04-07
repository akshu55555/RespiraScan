// index.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import sequelize from "./db.js";

// Controllers
import signup from "./controllers/signupcontrollerd.js";
import signup2 from "./controllers/signupcontrollerp.js";
import logindoc from "./controllers/logincontrollerd.js";
import loginpatient from './controllers/logincontrollerp.js';
// import uploadMiddleware from './controllers/uploadcontroller.js'; // Remove this import

import { spawn } from 'child_process';
import path from 'path';

dotenv.config();
const app = express();
const PORT = 5003;

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json({ strict: false }));
app.use(express.urlencoded({ extended: true }));

// Database connection (as before)
console.log(process.env.DB_USER);
sequelize
    .authenticate()
    .then(() => {
        console.log("✅ Database connected successfully!");
        app.listen(PORT, () => {
            console.log("You have reached respirascan server! Happy health!");
        });
    })
    .catch((err) => {
        console.error(" Database connection failed:", err);
    });

// Routes (as before)
app.get('/', (req, res) => {
    return res.status(200).json("HELLO");
});

app.use('/signupdoctor', signup);
app.use('/signuppatient', signup2);
app.use('/logindoc', logindoc);
app.use('/loginpatient', loginpatient);

app.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
});

// Multer upload
const upload = multer({ dest: 'uploads/' });

// Upload and Predict Route
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const imagePath = req.file.path;
        const result = await predictImage(imagePath);
        res.json(result);
    } catch (err) {
        console.error('Prediction failed:', err);
        res.status(500).json({ error: 'Prediction failed', details: err });
    } finally {
        // Optionally, you can delete the uploaded file after processing
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting uploaded file:', err);
            });
        }
    }
});

// Python child process function
function predictImage(imagePath) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', ['predict.py', imagePath]);

        pythonProcess.stdout.on('data', (data) => {
            const output = data.toString().trim();
            const [label, confidence] = output.split(',');
            resolve({ label, confidence: parseFloat(confidence) });
        });

        pythonProcess.stderr.on('data', (err) => {
            reject(`Error from Python: ${err.toString()}`);
        });

        pythonProcess.on('error', (err) => {
            reject(`Failed to start subprocess: ${err}`);
        });
    });
}

app.listen(PORT, () => { // Ensure the server starts here if database connection fails
    console.log("You have reached respirascan server! Happy health!");
});