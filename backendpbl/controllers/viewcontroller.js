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

        // Get the stored path
        const storedPath = viewreport.reportPath;
        console.log("Stored PDF path:", storedPath);
        
        // Get current file's directory in ES modules
        const currentFilePath = fileURLToPath(import.meta.url);
        const currentDir = path.dirname(currentFilePath);
        
        // Try multiple potential paths
        const potentialPaths = [
            storedPath,                                      // Original stored path
            path.resolve(process.cwd(), storedPath),         // Relative to CWD
            path.resolve(currentDir, '..', storedPath),      // One directory up from controller
            path.resolve(currentDir, '..', '..', storedPath), // Two directories up
            path.join(process.cwd(), storedPath) // Just use the filename
        ];
        
        console.log("Checking these potential paths:");
        potentialPaths.forEach(p => console.log("- " + p));
        
        // Try each path
        let foundPath = null;
        for (const tryPath of potentialPaths) {
            if (fs.existsSync(tryPath)) {
                console.log("Found PDF at:", tryPath);
                foundPath = tryPath;
                break;
            }
        }
        
        if (!foundPath) {
            console.error("PDF file not found in any of the tried locations");
            return res.status(404).json({ 
                error: "PDF file not found",
                checkedPaths: potentialPaths 
            });
        }

        // Set the Content-Type header to application/pdf
        res.setHeader('Content-Type', 'application/pdf');

        // Create a readable stream from the PDF file and pipe it to the response
        const fileStream = fs.createReadStream(foundPath);
        fileStream.pipe(res);

        // Handle errors during file streaming
        fileStream.on('error', (err) => {
            console.error("Error streaming PDF:", err);
            if (!res.headersSent) {
                res.status(500).send("Error serving the PDF file.");
            }
        });

    } catch (error) {
        console.error("Error fetching report path:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: "Internal server error" });
        }
    }
};

export default view;