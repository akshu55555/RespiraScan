import { PatientModel } from "../db.js";
import jwt from 'jsonwebtoken';

const loginpatient=async(req,res)=>{

    const{email,pass}=req.body;

    const patient=await PatientModel.findOne({
            attributes:["email","pass"],
            where:{
                email:email,
            }
    })
    if(!patient){
        console.log("Error retrieving patient");
        return res.status(401).json("patient not found");
    }
    if(pass!=patient.pass){
        return res.status(402).json("password is incorrect");
    }
    let token;
    try{

        token = jwt.sign(
            { email: patient.email, password: patient.pass },
            "your_secret_key",
            { expiresIn: "24h" } 
          );
       
        console.log("login successful");
        return res.status(200).json({ message: "Login successful",token:token });

    }catch(err){
        res.status(402).json("error generating token!")
    }
}
export default loginpatient;