    import { DoctorModel } from "../db.js";
    import jwt from 'jsonwebtoken';

    const logindoc=async(req,res)=>{
        console.log("entered login");
        const{email,password}=req.body;

        const doctor=await DoctorModel.findOne({
                attributes:["email","password"],
                where:{
                    email:email,
                }
        })
        
        if(password!=doctor.password){
            return res.status(402).json("password is incorrect");
        }
        let token;
        try{

            token=jwt.sign({email:doctor.email, password:doctor.password},
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
    export default logindoc;