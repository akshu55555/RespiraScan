import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Oval } from 'react-loader-spinner'; // Import a spinner component

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedDisease, setSelectedDisease] = useState('');
  const [image, setImage] = useState(null);
  const [report, setReport] = useState('');
  const [imageUploaded, setImageUploaded] = useState(false);
  const [result, setResult] = useState(null);
  const [doctorNmcId, setDoctorNmcId] = useState('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // New states for previous reports functionality
  const [previousReports, setPreviousReports] = useState([]);
  const [showReportsPopup, setShowReportsPopup] = useState(false);
  const [isLoadingReports, setIsLoadingReports] = useState(false);

  useEffect(() => {
    const dummyPatients = [
      { _id: 13, name: 'Akanksha Bhagwat', email: 'ab@gmail.com' },
      { _id: 14, name: 'Ananya Kadam', email: 'a@gmail.com' },
      { _id: 16, name: 'Neha Sawrikar', email: 'n@gmail.com' },
      { _id: 17, name: 'Shilpa Bhagwat', email: 's@gmail.com' },
      { _id: 18, name: 'Rohan Patel', email: 'rohan@example.com' },
      { _id: 19, name: 'Ishita Das', email: 'ishita@example.com' },
      { _id: 20, name: 'Yash Joshi', email: 'yash@example.com' },
      { _id: 21, name: 'Meera Nair', email: 'meera@example.com' },
      { _id: 22, name: 'Dev Gupta', email: 'dev@example.com' },
      { _id: 23, name: 'Ananya Rao', email: 'ananya@example.com' },
    ];
    setPatients(dummyPatients);

    const storedNmcId = localStorage.getItem('doctorNmcId');
    if (storedNmcId) {
      setDoctorNmcId(storedNmcId);
    } else {
      console.warn('Doctor NMC ID not found in local storage.');
    }
  }, []);

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUploadClick = (id) => {
    setSelectedPatientId(id);
    setShowPopup(true);
    setImage(null);
    setReport('');
    setImageUploaded(false);
    setSelectedDisease('');
    setResult(null);
    setIsUploading(false);
  };

  // Function to handle fetching previous reports
  const handlePreviousReportsClick = async (patientId) => {
    setSelectedPatientId(patientId);
    setIsLoadingReports(true);
    setShowReportsPopup(true);

    try {
      const response = await axios.post('http://localhost:5000/previous-reports', {
        patientId: patientId
      });

      // Format dates properly
      const reportsWithFormattedDates = response.data.reports.map(report => ({
        ...report,
        formattedDate: new Date(report.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }));

      setPreviousReports(reportsWithFormattedDates || []);
    } catch (err) {
      console.error('Failed to fetch previous reports', err);
      alert('Failed to load previous reports. Please try again.');
      setPreviousReports([]);
    } finally {
      setIsLoadingReports(false);
    }
};


  // Function to view a specific report
  const handleViewReport = async (reportId) => {
    try {
      const response = await axios.post('http://localhost:5000/view-report', {
        reportId: reportId
      }, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      window.open(pdfUrl, '_blank');
    } catch (err) {
      console.error('Failed to view report', err);
      alert('Failed to open report. Please try again.');
    }
  };

  const handleImageUpload = async () => {
    if (!image || !selectedPatientId || !selectedDisease) {
      return alert("Please select patient, disease, and image");
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('image', image);
    formData.append('patientId', selectedPatientId);
    formData.append('disease', selectedDisease);

    let uploadRoute = 'http://localhost:5000/upload'; // Default fallback
    if (selectedDisease === 'pneumonia') {
      uploadRoute = 'http://localhost:5000/pneumonia';
    } else if (selectedDisease === 'tuberculosis') {
      uploadRoute = 'http://localhost:5000/tuberculosis';
    }

    try {
      const response = await axios.post(uploadRoute, formData);
      setImageUploaded(true);
      if (response.data && response.data.label) {
        setResult(response.data);
        setReport(`Diagnosis: ${response.data.label} (Confidence: ${(response.data.confidence * 100).toFixed(2)}%)`);
      }
      alert("Image uploaded successfully. You can now check the report.");
    } catch (err) {
      console.error('Upload failed', err);
      alert("Image upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  // const handleReportSubmit = async () => {
  //   if (!result || selectedPatientId === null || !doctorNmcId || isGeneratingReport) {
  //     return;
  //   }

  //   setIsGeneratingReport(true);

  //   if (!doctorNmcId) {
  //     console.error("Doctor NMC ID is undefined. Report generation cannot proceed.");
  //     alert("Error: Doctor NMC ID is missing.");
  //     setIsGeneratingReport(false);
  //     return;
  //   }

  //   try {
  //     const requestBody = {
  //       id: selectedPatientId,
  //       NMC_id: doctorNmcId,
  //     };

  //     const response = await axios.post('http://localhost:5000/report', requestBody, {
  //       responseType: 'blob',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
  //     const pdfUrl = URL.createObjectURL(pdfBlob);

  //     window.open(pdfUrl, '_blank');
  //     setShowPopup(false);
  //   } catch (err) {
  //     console.error('Report generation failed', err);
  //     alert("Report generation failed.");
  //   } finally {
  //     setIsGeneratingReport(false);
  //   }
  // };
// const handleReportSubmit = async () => {
//     if (!result || selectedPatientId === null || !doctorNmcId || isGeneratingReport) {
//       return;
//     }

//     setIsGeneratingReport(true);

//     try {
//       const requestBody = {
//         id: selectedPatientId,
//         NMC_id: doctorNmcId,
//       };

//       const response = await axios.post('http://localhost:5000/report', requestBody, {
//         responseType: 'blob', // Important for PDF download
//       });

//       // Create a blob from the response
//       const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      
//       // Create a URL for the blob
//       const pdfUrl = window.URL.createObjectURL(pdfBlob);
      
//       // Create a temporary anchor element to trigger download
//       const link = document.createElement('a');
//       link.href = pdfUrl;
//       link.setAttribute('download', `RespiraScan_Report_${selectedPatientId}.pdf`);
//       document.body.appendChild(link);
      
//       // Trigger the download
//       link.click();
      
//       // Clean up
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(pdfUrl);
      
//       setShowPopup(false);
//     } catch (err) {
//       console.error('Report generation failed', err);
//       alert("Report generation failed. Please try again.");
//     } finally {
//       setIsGeneratingReport(false);
//     }
//   };
const handleReportSubmit = async () => {
  if (!result || !selectedPatientId || !doctorNmcId || isGeneratingReport) {
    return;
  }

  setIsGeneratingReport(true);

  try {
    const requestBody = {
      id: selectedPatientId,
      NMC_id: doctorNmcId,
    };

    // 1. Make the request with proper headers
    const response = await axios.post('http://localhost:5000/report', requestBody, {
      responseType: 'blob', // Crucial for PDF handling
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/pdf'
      }
    });

    // 2. Verify the response
    if (!response.data || response.data.size === 0) {
      throw new Error('Empty PDF response from server');
    }

    // 3. Create a more reliable download method
    const blob = new Blob([response.data], { type: 'application/pdf' });
    
    // Check for IE/Edge support
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, `RespiraScan_Report_${selectedPatientId}.pdf`);
    } else {
      // Modern browsers approach
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // 4. Set proper filename from response if available
      const contentDisposition = response.headers['content-disposition'];
      let fileName = `RespiraScan_Report_${selectedPatientId}.pdf`;
      
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1];
        }
      }
      
      link.setAttribute('download', fileName);
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      // 5. Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    }

    setShowPopup(false);
  } catch (err) {
    console.error('Report generation failed:', err);
    
    // 6. Enhanced error messaging
    let errorMsg = "Report download failed. Please try again.";
    if (err.response) {
      if (err.response.status === 404) {
        errorMsg = "Patient or doctor not found.";
      } else if (err.response.status === 500) {
        errorMsg = "Server error during report generation.";
      }
    }
    
    alert(errorMsg);
  } finally {
    setIsGeneratingReport(false);
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#09D8B6] p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Doctor Dashboard</h1>

      <input
        type="text"
        placeholder="Search patients..."
        className="w-full md:w-1/2 px-4 py-2 border rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-[#09D8B6] mb-6"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="w-full md:w-1/2 space-y-4">
        {filteredPatients.map((patient) => (
          <div
            key={patient._id}
            className="bg-white p-4 rounded-lg shadow-md transition"
          >
            <h2 className="text-xl font-semibold text-gray-800">Name: {patient.name}</h2>
            <p className="text-gray-700">Patient ID: {patient._id}</p>
            <p className="text-gray-700">Email: {patient.email}</p>
            <div className="mt-3 flex space-x-3">
              <button
                className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                onClick={() => handlePreviousReportsClick(patient._id)}
              >
                Previous Reports
              </button>
              <button
                onClick={() => handleUploadClick(patient._id)}
                className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
              >
                Upload
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload X-ray Report Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-1/2">
            <h2 className="text-xl font-bold mb-4">Upload X-ray Report</h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-1">Patient ID</label>
              <input
                type="text"
                value={selectedPatientId === null ? '' : selectedPatientId}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#09D8B6]"
                placeholder="Patient ID"
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-1">Doctor NMC ID</label>
              <input
                type="text"
                value={doctorNmcId}
                onChange={(e) => setDoctorNmcId(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#09D8B6]"
                placeholder="Enter Doctor NMC ID"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-1">Select Disease</label>
              <select
                value={selectedDisease}
                onChange={(e) => setSelectedDisease(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#09D8B6]"
              >
                <option value="">-- Select Disease --</option>
                <option value="pneumonia">Pneumonia</option>
                <option value="tuberculosis">Tuberculosis</option>
              </select>
            </div>
            <div className="mb-4 flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="flex-1"
              />
              <button
                onClick={handleImageUpload}
                disabled={isUploading}
                className={`bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 ${isUploading ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                {isUploading ? (
                  <Oval color="#fff" height={20} width={20} />
                ) : (
                  'Upload'
                )}
              </button>
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleReportSubmit}
                disabled={!imageUploaded || !doctorNmcId || isGeneratingReport}
                className={`px-4 py-2 rounded text-white ${imageUploaded && doctorNmcId && !isGeneratingReport ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'}`}
              >
                {isGeneratingReport ? 'Generating...' : 'Generate PDF Report'}
              </button>
              <button
                onClick={() => {
                  setShowPopup(false);
                  setReport('');
                  setImage(null);
                  setImageUploaded(false);
                  setSelectedDisease('');
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
            {report && (
              <div className="mt-4 bg-gray-100 p-4 rounded">
                <h3 className="font-bold">AI Report:</h3>
                <p>{report}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Previous Reports Popup */}
      {showReportsPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-1/2 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Previous Reports for Patient ID: {selectedPatientId}</h2>

            {isLoadingReports ? (
              <div className="flex justify-center items-center h-40">
                <Oval color="#09D8B6" height={40} width={40} />
              </div>
            ) : previousReports.length > 0 ? (
              <div className="space-y-3">
                            {previousReports.map((report) => (
              <div
                key={report.id}
                className="bg-gray-100 p-4 rounded-lg hover:bg-gray-200 cursor-pointer transition"
                onClick={() => handleViewReport(report.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{report.diagnosis}</p>
                    <p className="text-sm text-gray-600">
                      Date: {report.formattedDate || new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm">
                    View
                  </button>
                </div>
              </div>
            ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No previous reports found for this patient.
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowReportsPopup(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>  
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;