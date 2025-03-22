import { PatientModel } from "../db.js";
import jwt from 'jsonwebtoken';

const loginpatient=async(req,res)=>{

    const{email,password}=req.body;

    const patient=await PatientModel.findOne({
            attributes:["email","password"],
            where:{
                email:req.body.email,
            }
    })
    if(password!=patient.password){
        return res.status(402).json("password is incorrect");
    }
    let token;
    try{

        token=jwt.sign({email:patient.email, password:patient.password},
            "your_secret_key",
            {expiresIn:"1hr"}
        )
        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "Strict" });
        console.log("login successful");
        res.json({ message: "Login successful" });

    }catch(err){
        res.status(402).json("error generating token!")
    }
}
export default loginpatient;