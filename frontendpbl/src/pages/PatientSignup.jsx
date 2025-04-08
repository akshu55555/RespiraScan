import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const PatientSignup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // Submit logic goes here
    navigate("/patient-login");
  };

  return (
    <div className="container mx-auto px-4 max-w-lg py-12">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <form onSubmit={handleSubmit}>
          <h3 className="text-lg font-semibold text-center mb-2">Personal Info</h3>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#09D8B6]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-1" htmlFor="age">
                Age
              </label>
              <input
                type="number"
                id="age"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#09D8B6]"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1" htmlFor="gender">
                Gender
              </label>
              <select
                id="gender"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#09D8B6]"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-center mb-2">History</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-1" htmlFor="height">
                Height (cm)
              </label>
              <input
                type="number"
                id="height"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#09D8B6]"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1" htmlFor="weight">
                Weight (kg)
              </label>
              <input
                type="number"
                id="weight"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#09D8B6]"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700 mb-1" htmlFor="bloodGroup">
                Blood Group
              </label>
              <select
                id="bloodGroup"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#09D8B6]"
                required
              >
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
          </div>

          <h3 className="text-lg font-semibold text-center mb-2">Login Details</h3>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="email">
              Email Id
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#09D8B6]"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700 mb-1" htmlFor="password">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#09D8B6]"
              required
            />
          </div>

          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              id="showPassword"
              className="mr-2"
              onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor="showPassword" className="text-gray-700">
              Show Password
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#09D8B6] text-white py-2 px-4 rounded-md hover:bg-[#08c6a6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#09D8B6]"
          >
            Create an Account
          </button>
        </form>

        <p className="mt-4 text-center">
          Already have an Account?{" "}
          <Link to="/patient-login" className="text-[#09D8B6] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default PatientSignup;
