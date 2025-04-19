import { PatientModel } from "../db.js";
import jwt from 'jsonwebtoken';
const change=async(req , res)=>{
    console.log("entered");
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];
    const {newDoctorId}=req.body;
    console.log("new id",newDoctorId);
    if(!token){
        console.log("no token found!");
        return res.status(400).json("no token found!");
    }
    let payload;
    try{
        payload=jwt.verify(token,"your_secret_key");
        
        if(!payload){
            console.log("error getting payload!");
            return res.status(401).json("error getting payload");
        }
        console.log(payload.email);
        const email=payload.email;
        const [changedoc]=await PatientModel.update(
            {doc_id:newDoctorId},
           {where:{
            email:email
        }}
        )
      
        if(changedoc){
            console.log("doc id updated successfully!");
            return res.status(200).json({ message: `doc_id updated successfully to ${newDoctorId}` })
        }

    }catch(err){
        console.log("error retrieving token");
        return res.status(400).json(err);
    }
    
}
export default change;