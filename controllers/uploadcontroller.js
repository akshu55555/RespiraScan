import multer from "multer";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Configure Multer Storage
const storage = multer.diskStorage({
  destination: "uploads/", // Save files in "uploads" folder
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  }
});

const upload = multer({ storage });

// Prediction Handler
const predict = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imagePath = path.resolve(req.file.path); // Full path of uploaded file
  console.log(`Processing file: ${imagePath}`);

  // Run Python script
  const pythonProcess = spawn('python', [path.join(__dirname, 'model.py'), imagePath]);


  let resultData = "";
  
  pythonProcess.stdout.on("data", (data) => {
    resultData += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Error from Python: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    console.log(`Python process exited with code: ${code}`);
    console.log(`Raw Python output: ${resultData}`);
    
    if (code === 0) {
      try {
        // Extract the last line of the output which should contain the JSON
        const lines = resultData.trim().split('\n');
        const lastLine = lines[lines.length - 1];
        const parsedData = JSON.parse(lastLine);
        res.json(parsedData);
      } catch (error) {
        console.error(`JSON parsing error: ${error.message}`);
        res.status(500).json({ error: "Invalid response from predict.py", details: resultData });
      }
    } else {
      res.status(500).json({ error: "Prediction failed", code });
    }
  });
};

// Export Middleware
export default [upload.single("file"), predict];
