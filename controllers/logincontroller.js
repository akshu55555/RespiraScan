import {DoctorModel} from '../config/db.js';

const signup=async(req,res)=>{
    const category=req.body;

    if(category===1)   {        //it is a doctor
        const {id,name,email,contact,location}=req.body;

        if(!id){
           return res.status(402).json({message:"ID not verified "});
        }

        const sign=await DoctorModel.create({
            attributes:[id,name,email,contact,location],
            where:{
                NMC_id:id
            }
        })
        
    }         
    else if(category===2){      //it is a patient

    }
}

const login=async(req,res) =>{

}