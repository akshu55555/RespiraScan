import {DoctorModel, PatientModel} from '../config/db.js';

const signup=async(req,res)=>{
    const category=req.body;

    if(category===1)   {        //it is a doctor
        const {id,name,email,contact,location}=req.body;

        if(!id){
           return res.status(402).json({message:"ID not verified "});
        }

        const sign=await DoctorModel.create({
            attributes:[id,name,email,contact,location],
          
        })
        
    }         
    else if(category===2){      //it is a patient
        const{name,email,phone,pass,age,sex,bg , weight ,height}=req.body;

        if(!password){
            return res.status(402).json({message:"password mandatory!"});
        }

        const login=await PatientModel.create({
            attributes:[name,email,phone,pass,age,sex,bg,weight,height],
            
        })
    }
}

const login=async(req,res) =>{
    const {category}=req.body;    //doctor account already existing

    if(category===1){    //doctor login
        const{email , password}=req.body;

        const doctor=await PatientModel.findOne({
            attributes:[email,password],
            where:{
                email:email,
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
            
        }catch(err){
            return res.status(403).json({message:"error generating token"})
        }


    }

}