import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DoctorLoginImage from '../assets/Doctor_Login.jpg';

const DoctorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: Replace this dummy logic with actual API call
    if (email && password) {
      // You can send email/password to backend here and check response
      // If successful:
      navigate('/doctor-dashboard');
    } else {
      alert('Please enter valid email and password');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Image covering full half */}
      <div className="w-1/2 hidden md:block">
        <img 
          src={DoctorLoginImage} 
          alt="Login Illustration" 
          className="w-full h-full object-cover" 
        />
      </div>

      {/* Right Side - Login Form with Gradient Background */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-gradient-to-b from-white to-[#09D8B6] p-12">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Doctor Login</h2>
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email ID
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#09D8B6]"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#09D8B6]"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#0A66C2] text-white py-2 px-4 rounded-md hover:bg-[#084B9E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A66C2]"
          >
            Submit
          </button>
        </form>
        
        <p className="mt-4 text-center text-gray-800">
          Don't have an account?{' '}
          <Link to="/doctor-signup" className="text-[#0A66C2] font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default DoctorLogin;
