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
    const fetchPatientData = async () => {
      try {
        const res = await fetch("http://localhost:5000/patient-view", {
          method: "GET",
          credentials: "include", // Important for sending cookies
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

      } catch (err) {
        console.error("Fetch Error:", err);
        
        // Check if it's an authentication error
        if (err.message?.includes("token") || err.message?.includes("authentication")) {
          setError("Authentication failed. Please login again.");
        } else {
          setError(err.message || "Failed to load patient data");
        }
      }
    };

    fetchPatientData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/logout', {
        method: 'POST',
        credentials: 'include'
      });
      navigate('/login'); // Redirect to login page
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleChangeDoctor = (e) => {
    e.preventDefault();
    alert(`Changing doctor to: ${newDoctorId}`);
    setShowDoctorPopup(false);
    setNewDoctorId("");
  };

  if (error) {
    return (
      <div className="text-center mt-12 text-lg text-red-500">
        {error}
        <br />
        <button 
          onClick={() => navigate('/login')}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Return to Login
        </button>
      </div>
    );
  }

  if (!patientData) {
    return <div className="text-center mt-12 text-lg">Loading patient data...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-12 bg-white p-8 shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Patient Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Name</p>
            <p className="font-medium">{patientData.name}</p>
          </div>
          <div>
            <p className="text-gray-600">Age</p>
            <p className="font-medium">{patientData.age}</p>
          </div>
          <div>
            <p className="text-gray-600">Gender</p>
            <p className="font-medium">{patientData.gender}</p>
          </div>
          <div>
            <p className="text-gray-600">Blood Group</p>
            <p className="font-medium">{patientData.bloodGroup}</p>
          </div>
          <div>
            <p className="text-gray-600">Height</p>
            <p className="font-medium">{patientData.height} cm</p>
          </div>
          <div>
            <p className="text-gray-600">Weight</p>
            <p className="font-medium">{patientData.weight} kg</p>
          </div>
          <div>
            <p className="text-gray-600">Email</p>
            <p className="font-medium">{patientData.email}</p>
          </div>
          <div>
            <p className="text-gray-600">Doctor ID</p>
            <p className="font-medium">{patientData.doctorId}</p>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => setShowReportsPopup(true)}
          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          View Reports
        </button>
        <button
          onClick={() => setShowDoctorPopup(true)}
          className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Change Doctor
        </button>
      </div>

      {showReportsPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Your Reports</h2>
            <p>No reports available.</p>
            <button
              onClick={() => setShowReportsPopup(false)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showDoctorPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Change Doctor</h2>
            <form onSubmit={handleChangeDoctor}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">New Doctor ID</label>
                <input
                  type="text"
                  value={newDoctorId}
                  onChange={(e) => setNewDoctorId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-500 text-white py-2 rounded"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowDoctorPopup(false)}
                  className="flex-1 bg-gray-300 py-2 rounded"
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