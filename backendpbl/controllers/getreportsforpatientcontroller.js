import { ReportModel } from "../db.js";
import { PatientModel } from "../db.js";
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const getreports = async (req, res) => {
    try {
        console.log("entered getreports");
        const authHeader = req.headers['authorization'];
        const token = authHeader.split(' ')[1];
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
                
            }catch(err){
                console.log("error retrieving token");
                return res.status(400).json(err);
            }
        
            const email=payload.email;
            console.log("email", email);
            const getpatient=await PatientModel.findOne({
            attributes:['id'],
            where:{
                email:email
            }
        })
        
        const patientId=getpatient.id;
        console.log("getpatientid",patientId);
        const report = await ReportModel.findOne({
            attributes: ['reportPath'],
            where: {
                patient_id: patientId
            }
        });
        console.log("got report path!");
        if (!report || !report.reportPath) {
            return res.status(404).json({ message: "Report not found" });
        }
        
        console.log("report path", report.reportPath);
        
        // Construct the full path to the PDF file
        const fullPath = path.join(
            'C:',
            'Users',
            'shilpa',
            'OneDrive',
            'Desktop',
            'RespiraScan',
            'RespiraScan',
            'backendpbl',
            'reports',
            report.reportPath
        );
        
        // Check if file exists
        if (!fs.existsSync(fullPath)) {
            return res.status(404).json({ message: "Report file not found" });
        }
        
        // Send the file
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${path.basename(report.reportPath)}`);
        
        const fileStream = fs.createReadStream(fullPath);
        fileStream.pipe(res);
        
    } catch (error) {
        console.error("Error retrieving report:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export default getreports;