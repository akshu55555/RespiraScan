import {DoctorModel} from "../db.js";


const signup=async(req,res)=>{
    console.log("you have entered signup")
    // const category=req.body.category;

                    //it is a doctor
        const {NMC_id,name,email,contact,password}=req.body;
        
        if(!NMC_id){
           return res.status(402).json({message:"ID not verified "});
        }   

        const sign=await DoctorModel.create({
            NMC_id,name,email,contact,password
          
        })
        return res.status(202).json("doctor table updated!");
        
}         
 

export default signup;