import { useEffect, useState } from 'react';
import { pdfjs } from 'react-pdf';
import Chatbot from './Chatbot';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function ReportHandler({ patientId, final_result }) {
  const [reportText, setReportText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (patientId) {
      fetchReportText();
    } else {
      setError("No patient ID provided");
      setIsLoading(false);
    }
  }, [patientId]);

  const fetchReportText = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Update this path based on your backend API structure
      const response = await fetch(`/api/reports/${patientId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch report: ${response.status}`);
      }
      
      const pdfBlob = await response.blob();
      const pdfData = await extractTextFromPdf(pdfBlob);
      setReportText(pdfData);
    } catch (err) {
      console.error("Error fetching report:", err);
      setError(`Unable to load patient report: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const extractTextFromPdf = async (pdfBlob) => {
    try {
      const pdf = await pdfjs.getDocument(URL.createObjectURL(pdfBlob)).promise;
      let text = '';

      // Extract text from all pages (not just first 3)
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(' ');
      }

      return text;
    } catch (err) {
      throw new Error(`PDF parsing error: ${err.message}`);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading patient report...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={fetchReportText}>Try Again</button>
      </div>
    );
  }

  // Make sure we have the necessary data
  if (!reportText || !final_result) {
    return (
      <div className="error-container">
        <h3>Missing Data</h3>
        <p>Unable to load complete patient information needed for the chatbot.</p>
      </div>
    );
  }

  return (
    <div className="report-handler">
      <div className="report-info">
        <h2>Your Diagnosis Report</h2>
        {final_result && (
          <div className="diagnosis-summary">
            <h3>Diagnosis: {final_result.label}</h3>
            <div className="confidence-bar">
              <div 
                className="confidence-level" 
                style={{ width: `${final_result.confidence * 100}%` }}
              >
                {(final_result.confidence * 100).toFixed(1)}% confidence
              </div>
            </div>
          </div>
        )}
      </div>
      <Chatbot reportText={reportText} final_result={final_result} />
    </div>
  );
}

export default ReportHandler;