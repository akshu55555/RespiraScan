import { ReportModel } from "../db.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const view = async (req, res) => {
    console.log("entered view prev reports", req.body);
    const { reportId } = req.body;

    if (!reportId) {
        return res.status(400).json({ error: "Report ID is required" });
    }

    try {
        const viewreport = await ReportModel.findOne({
            where: {
                id: reportId
            }
        });

        if (!viewreport) {
            return res.status(404).json({ error: "Report not found" });
        }

        // Get the stored path and normalize it
        let storedPath = viewreport.reportPath;
        console.log("Original stored path:", storedPath);
        
        // Remove any leading 'reports/' or 'reports\' from the path
        storedPath = storedPath.replace(/^reports[\/\\]/, '');
        console.log("Normalized path:", storedPath);

        // Construct the full reports directory path
        const reportsDir = path.join(
            'C:',
            'Users',
            'shilpa',
            'OneDrive',
            'Desktop',
            'RespiraScan',
            'RespiraScan',
            'backendpbl',
            'reports'
        );
        
        // Construct the full path to the report
        const reportPath = path.join(reportsDir, storedPath);
        
        console.log("Looking for PDF at:", reportPath);
        
        if (!fs.existsSync(reportPath)) {
            console.error("PDF file not found at expected location");
            return res.status(404).json({ 
                error: "PDF file not found",
                expectedPath: reportPath
            });
        }

        // Set the Content-Type header to application/pdf
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${path.basename(storedPath)}"`);

        // Create a readable stream from the PDF file and pipe it to the response
        const fileStream = fs.createReadStream(reportPath);
        fileStream.pipe(res);

        // Handle errors during file streaming
        fileStream.on('error', (err) => {
            console.error("Error streaming PDF:", err);
            if (!res.headersSent) {
                res.status(500).send("Error serving the PDF file.");
            }
        });

    } catch (error) {
        console.error("Error fetching report:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: "Internal server error" });
        }
    }
};

export default view;