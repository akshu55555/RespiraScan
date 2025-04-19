import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PatientDashboard = () => {
  const [patientData, setPatientData] = useState(null);
  const [showReportsPopup, setShowReportsPopup] = useState(false);
  const [showDoctorPopup, setShowDoctorPopup] = useState(false);
  const [newDoctorId, setNewDoctorId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true; // Flag to track component mount status

    const fetchPatientData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Redirect to login if no token found
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await fetch("http://localhost:5000/patient-view", {
          method: "GET",
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log("Response Status:", res.status);

        if (!res.ok) {
          const errorData = await res.json();
          console.error("API Error:", errorData);
          throw new Error(errorData.message || "Failed to fetch patient data");
        }

        const data = await res.json();
        console.log("API Response:", data);

        if (!data.patient_details) {
          throw new Error("Patient details not found in response");
        }

        // Only update state if component is still mounted
        if (isMounted) {
          setPatientData({
            name: data.patient_details.name,
            age: data.patient_details.age,
            gender: data.patient_details.sex,
            height: data.patient_details.height,
            weight: data.patient_details.weight,
            bloodGroup: data.patient_details.bg,
            email: data.patient_details.email,
            doctorId: data.patient_details.doc_id,
          });
        }

      } catch (err) {
        console.error("Fetch Error:", err);
        
        // Only update state if component is still mounted
        if (isMounted) {
          // Check if it's an authentication error
          if (err.message?.includes("token") || err.message?.includes("authentication")) {
            setError("Authentication failed. Please login again.");
            localStorage.removeItem('token'); // Clear invalid token
            navigate('/login');
          } else {
            setError(err.message || "Failed to load patient data");
          }
        }
      }
    };

    fetchPatientData();

    // Cleanup function to set isMounted to false when component unmounts
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      localStorage.removeItem('token'); // Clear token from storage
      navigate('/login'); // Redirect to login page
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleChangeDoctor = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/change-doctor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ newDoctorId })
      });

      if (!response.ok) {
        throw new Error('Failed to change doctor');
      }

      const data = await response.json();
      setPatientData(prev => ({ ...prev, doctorId: newDoctorId }));
      setShowDoctorPopup(false);
      setNewDoctorId("");
      alert(`Doctor successfully changed to: ${newDoctorId}`);
    } catch (err) {
      console.error('Error changing doctor:', err);
      alert('Failed to change doctor. Please try again.');
    }
  };

  if (error) {
    return (
      <div className="text-center mt-12 text-lg text-red-500">
        {error}
        <br />
        <button 
          onClick={() => navigate('/login')}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Return to Login
        </button>
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="text-center mt-12 text-lg">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-12 bg-white p-8 shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Patient Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries({
            Name: patientData.name,
            Age: patientData.age,
            Gender: patientData.gender,
            'Blood Group': patientData.bloodGroup,
            'Height (cm)': patientData.height,
            'Weight (kg)': patientData.weight,
            Email: patientData.email,
            'Doctor ID': patientData.doctorId
          }).map(([label, value]) => (
            <div key={label} className="bg-white p-3 rounded shadow-sm">
              <p className="text-gray-600 text-sm">{label}</p>
              <p className="font-medium text-gray-800">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => setShowReportsPopup(true)}
          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          View Reports
        </button>
        <button
          onClick={() => setShowDoctorPopup(true)}
          className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
        >
          Change Doctor
        </button>
      </div>

      {/* Reports Popup */}
      {showReportsPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Your Reports</h2>
            <div className="mb-4">
              <p className="text-gray-600">No reports available at this time.</p>
            </div>
            <button
              onClick={() => setShowReportsPopup(false)}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Change Doctor Popup */}
      {showDoctorPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Change Doctor</h2>
            <form onSubmit={handleChangeDoctor}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">New Doctor ID</label>
                <input
                  type="text"
                  value={newDoctorId}
                  onChange={(e) => setNewDoctorId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Enter new doctor ID"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowDoctorPopup(false)}
                  className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;