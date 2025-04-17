import { PatientModel } from "../db.js";
import jwt from 'jsonwebtoken';

const patient_view = async (req, res) => {
  console.log("veda manus");
  
  // Get token from cookies instead of Authorization header
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ message: 'Token missing or invalid' });
  }
  
  const secretKey = 'your_secret_key'; // Replace with your actual key
  let payload;
  
  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    console.log("Token verification error:", err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
  
  const email = payload.email;
  console.log("email", email);
  
  try {
    const getpatient = await PatientModel.findOne({
      attributes: ["id", "name", "email", "age", "sex", "bg", "height", "weight", "doc_id"],
      where: {
        email: email
      }
    });
    
    console.log("getpatient", getpatient);
    
    if (!getpatient) {
      return res.status(404).json({ message: "Patient not found" });  
    }
    
    return res.json({
      patient_details: getpatient
    });
    
  } catch (err) {
    console.log("error getting patient details", err);
    return res.status(500).json({ message: "Error getting patient" });
  }
};

export default patient_view;