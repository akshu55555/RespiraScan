import { ReportModel } from "../db.js";

const previous = async (req, res) => {
    try {
        console.log("entered previous");
        const { patientId } = req.body;

        if (!patientId) {
            return res.status(400).json({ error: "Patient ID is required" });
        }

        const reports = await ReportModel.findAll({
            attributes: ["id", "reportPath", "diagnosis", "createdAt"],
            where: {
                patient_id: patientId,
            },
            order: [['createdAt', 'DESC']]  
        });

        const formattedReports = reports.map(report => {
            let formattedDate;

            if (report.createdAt instanceof Date) {
                formattedDate = report.createdAt.toISOString();
            } else if (typeof report.createdAt === 'string' || typeof report.createdAt === 'number') {
                formattedDate = new Date(report.createdAt).toISOString();
            } else {
                console.warn("Unexpected createdAt type:", typeof report.createdAt, "Value:", report.createdAt);
                formattedDate = null; // Or a default date string, e.g., 'Unknown'
            }

            return {
                id: report.id,
                diagnosis: report.diagnosis || 'Medical Report',
                date: formattedDate,
                createdAt: report.createdAt,
                reportPath: report.reportPath
            };
        });

        console.log("Formatted reports:", formattedReports);
        return res.status(200).json({ reports: formattedReports });
    } catch (error) {
        console.error("Error fetching previous reports:", error);
        return res.status(500).json({ error: "Failed to fetch reports" });
    }
};

export default previous;