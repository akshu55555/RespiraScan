import { PatientModel } from "../db.js";
import jwt from 'jsonwebtoken';

const patient_view = async (req, res) => {
  
  console.log("Patient view endpoint called");
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];
 
    try {
    const payload = jwt.verify(token, "your_secret_key");
    const email = payload.email;
    console.log("Decoded email from token:", email);
    
    const getpatient = await PatientModel.findOne({
      attributes: ["id", "name", "email", "age", "sex", "bg", "height", "weight", "doc_id"],
      where: {
        email: email
      }
    });
    console.log("getpatient",getpatient);
    
    if (!getpatient) {
      console.log("Patient not found for email:", email);
      return res.status(404).json({ message: "Patient not found" });  
    }
    
    console.log("Patient found:", getpatient.id);
    return res.status(200).json({
      patient_details: getpatient
    });
    
  } catch (err) {
    console.log("Token verification or database error:", err.message);
    return res.status(401).json({ message: 'Authentication failed' });
  }
};
export default patient_view;