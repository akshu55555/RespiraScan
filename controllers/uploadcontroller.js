import multer from "multer";
import path from "path";

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: "uploads/", // Save files in "uploads" folder
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  }
});

const upload = multer({ storage });

// Export the Multer middleware for single file upload named 'image'
export default upload.single("image");