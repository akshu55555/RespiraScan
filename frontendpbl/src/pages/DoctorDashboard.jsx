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
  const [isUploading, setIsUploading] = useState(false); // New state for upload loading

  useEffect(() => {
    const dummyPatients = [
      { _id: 13, name: 'Aarav Mehta', email: 'aarav@example.com' },
      { _id: 14, name: 'Priya Sharma', email: 'priya@example.com' },
      { _id: 16, name: 'Kabir Singh', email: 'kabir@example.com' },
      { _id: 17, name: 'Sneha Reddy', email: 'sneha@example.com' },
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
    setIsUploading(false); // Reset uploading state when popup opens
  };

  const handleImageUpload = async () => {
    if (!image || !selectedPatientId || !selectedDisease) {
      return alert("Please select patient, disease, and image");
    }

    setIsUploading(true); // Set uploading to true

    const formData = new FormData();
    formData.append('image', image);
    formData.append('patientId', selectedPatientId);
    formData.append('disease', selectedDisease);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData);
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
      setIsUploading(false); // Set uploading to false
    }
  };

  const handleReportSubmit = async () => {
    if (!result || selectedPatientId === null || !doctorNmcId || isGeneratingReport) {
      return;
    }

    setIsGeneratingReport(true);

    if (!doctorNmcId) {
      console.error("Doctor NMC ID is undefined. Report generation cannot proceed.");
      alert("Error: Doctor NMC ID is missing.");
      setIsGeneratingReport(false);
      return;
    }

    try {
      const requestBody = {
        id: selectedPatientId,
        NMC_id: doctorNmcId,
      };

      const response = await axios.post('http://localhost:5000/report', requestBody, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      window.open(pdfUrl, '_blank');
      setShowPopup(false);
    } catch (err) {
      console.error('Report generation failed', err);
      alert("Report generation failed.");
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
              <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
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
                <option value="covid">COVID</option>
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
                disabled={isUploading} // Disable button while uploading
                className={`bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 ${isUploading ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                {isUploading ? (
                  <Oval color="#fff" height={20} width={20} /> // Show spinner while uploading
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
    </div>
  );
};

export default DoctorDashboard;