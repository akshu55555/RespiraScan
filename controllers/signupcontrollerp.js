import {PatientModel} from "../db.js";

const signup2=async(req,res)=>{
    
    const{name,email,phone,pass,age,sex,bg , weight ,height}=req.body;

    if(!pass){
        return res.status(402).json({message:"password mandatory!"});
    }

    const sign=await PatientModel.create({
        attributes:[name,email,phone,pass,age,sex,bg,weight,height],
    })
    
}
export default signup2;