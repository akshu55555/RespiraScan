import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const DoctorSignup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Updated state
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    NMC_id: " ",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/signupdoctor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Signup successful!");
        navigate("/doctor-login");
      } else {
        alert(data.message || "Signup failed.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-md py-12">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-xl font-semibold text-center mb-4">Personal Info</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#09D8B6]"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="contact">Contact No.</label>
            <input
              type="text"
              id="contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#09D8B6]"
              required
            />
          </div>

          <h2 className="text-xl font-semibold text-center mb-4">Doctor ID</h2>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="NMC_id">NMC_id</label>
            <input
              type="text"
              id="NMC_id"
              value={formData.NMC_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#09D8B6]"
              required
            />
          </div>

          <h2 className="text-xl font-semibold text-center mb-4">Login Details</h2>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="email">Email Id</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#09D8B6]"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700 mb-1" htmlFor="password">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={formData.password}
              onChange={handleChange}
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
            <label htmlFor="showPassword" className="text-gray-700">Show Password</label>
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
          <Link to="/doctor-login" className="text-[#09D8B6] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default DoctorSignup;
