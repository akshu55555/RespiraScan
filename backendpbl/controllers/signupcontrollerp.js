import { where } from "sequelize";
import {DoctorModel, PatientModel} from "../db.js";

const signup2=async(req,res)=>{
    console.log("entered signup");
    const{name,email,phone,pass,age,sex,bg , weight ,height,doc_id}=req.body;

    if(!pass){
        return res.status(402).json({message:"password mandatory!"});
    }

    const sign = await PatientModel.create({            //creating table patients
        name, email, phone, pass, age, sex, bg, weight, height, doc_id
    });
    console.log(req.body.name);
    const patient=await PatientModel.findOne({      //retrieving that patient id and doctor id
        attributes:["id","doc_id"],
        where:{
            name:req.body.name
        }
    })
    console.log("patient.id",patient.id);
   

    try{
        const doctor_id=patient.doc_id;
        console.log("doctor_id",doctor_id);
        const doc=await DoctorModel.findOne({
        attributes:["NMC_id","patients"],
        where:{
            NMC_id:doctor_id,
        }
        })
        if (!doc) {
            console.log("Doctor not found! NMC_id:", doctor_id);
            return res.status(404).json({ message: "Doctor ID does not exist!" });
        }
        
        console.log("NMC_id",doc.NMC_id);
        console.log("created doc!");
        let list_of_patients = Array.isArray(doc.patients) ? doc.patients : [];   //i am taking patient_id array from doctor model
        list_of_patients.push(patient.id);   //i am pushing the patient id array in list of patients
        console.log("list",list_of_patients);


        const [updatedCount] = await DoctorModel.update(
            { patients: list_of_patients },
            { where: { NMC_id: doctor_id } }
        );
        
console.log("doctor table updated")
return res.status(200).json("sign up successful");
}catch(err){
        return res.status(401).json("the doctor id does not exist!")
    }
    
}

export default signup2;