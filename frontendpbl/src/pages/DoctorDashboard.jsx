import React, { useEffect, useState } from 'react';
import '../css/DoctorDashboard.css'; // Custom styles
import axios from 'axios';

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch patients from backend for this doctor
  useEffect(() => {
    const doctorId = localStorage.getItem('doctorId');
    axios.get(`/api/doctor/${doctorId}/patients`)
      .then(response => {
        setPatients(response.data);
      })
      .catch(error => {
        console.error('Error fetching patients:', error);
      });
  }, []);

  // Filtered patient list
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="doctor-dashboard">
      <h1 className="dashboard-title">Doctor Dashboard</h1>
      <input
        type="text"
        className="search-input"
        placeholder="Search patients by name or ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredPatients.map((patient, index) => (
        <div key={index} className="patient-card">
          <div className="patient-info">
            <p><strong>Name:</strong> {patient.name}</p>
            <p><strong>ID:</strong> {patient.id}</p>
          </div>
          <button className="view-upload-btn">View / Upload Report</button>
        </div>
      ))}
    </div>
  );
};

export default DoctorDashboard;
