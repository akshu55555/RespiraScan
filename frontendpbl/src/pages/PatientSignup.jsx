import { useState } from 'react';
import { Link } from 'react-router-dom';

const PatientSignup = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-[#09D8B6]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Patient Sign Up</h2>
        
        <form>
          <h3 className="font-semibold mb-2">Personal Info</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input type="text" placeholder="First Name" className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
            <input type="text" placeholder="Last Name" className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
          </div>
          <div className="mb-4">
            <input type="number" placeholder="Age" className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
          </div>
          <div className="mb-4">
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md" required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <h3 className="font-semibold mb-2">Medical History</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input type="text" placeholder="Height (cm)" className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
            <input type="text" placeholder="Weight (kg)" className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
          </div>
          <div className="mb-4">
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md" required>
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>
          
          <h3 className="font-semibold mb-2">Login Details</h3>
          <div className="mb-4">
            <input type="email" placeholder="Email ID" className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
          </div>
          <div className="mb-4">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md" required
            />
          </div>
          <div className="mb-4 flex items-center">
            <input type="checkbox" id="showPassword" className="mr-2" onChange={() => setShowPassword(!showPassword)} />
            <label htmlFor="showPassword" className="text-gray-700">Show Password</label>
          </div>
          
          <button type="submit" className="w-full bg-[#09D8B6] text-white py-2 px-4 rounded-md hover:bg-[#08c6a6]">
            Create an Account
          </button>
        </form>
        
        <p className="mt-4 text-center">
          Already have an account? <Link to="/patient-login" className="text-[#09D8B6] hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default PatientSignup;
