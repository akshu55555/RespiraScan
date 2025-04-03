import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  }
});

const upload = multer({ storage: storage });

// Prediction Handler
const predict = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imagePath = path.resolve(req.file.path); // Full path of uploaded file
    console.log(`Processing file: ${imagePath}`);

    // Spawn Python child process
    const pythonProcess = spawn("python", ["predict.py", imagePath]);

    let resultData = "";

    // Capture output
    pythonProcess.stdout.on("data", (data) => {
      resultData += data.toString();
    });

    // Capture errors
    pythonProcess.stderr.on("data", (data) => {
      console.error(`Error from Python: ${data}`);
    });

    // On process exit, return response
    pythonProcess.on("close", (code) => {
      if (code === 0) {
        try {
          const prediction = JSON.parse(resultData);
          res.json(prediction);
        } catch (error) {
          res.status(500).json({ error: "Invalid JSON response from predict.py" });
        }
      } else {
        res.status(500).json({ error: "Prediction failed" });
      }

      // Cleanup: Remove uploaded image
//       fs.unlink(imagePath, (err) => {
//         if (err) console.error("Failed to delete temp file:", err);
//       });
    });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

// Export as Middleware for `index.js`
export default [upload.single("file"), predict];
