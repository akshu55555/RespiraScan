import {DoctorModel} from '../db.js';
import jwt from 'jsonwebtoken';

const logindoc=async(req,res) =>{
    
        const{email,password}=req.body;
        const doctor=await DoctorModel.findOne({
            attributes:["email","password"],
            where:{
                email:req.body.email,
            }
        })

        if(password!=doctor.password){
                return res.status(402).json({message:"password incorrect!"});
        }
        let token;
        try{

            token = jwt.sign(
                {email:doctor.email , password:doctor.password },
                "your_secret_key",
                {expiresIn:'1h'}
            )
            res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "Strict" });
            console.log("login successful");
            res.json({ message: "Login successful" });

        }catch(err){
            return res.status(403).json({message:"error generating token"})
        }


    }

export default logindoc;