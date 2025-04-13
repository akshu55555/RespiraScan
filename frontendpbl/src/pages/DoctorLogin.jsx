import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DoctorLoginImage from '../assets/Doctor_Login.jpg';

const DoctorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors

    try {
      const response = await fetch('http://localhost:5000/logindoc', { // Assuming your backend runs on port 8000
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
        // Assuming the backend sets the token as a cookie
        navigate('/doctor-dashboard'); // Redirect to dashboard on successful login
      } else if (response.status === 402) {
        const errorMessage = await response.json();
        setError(errorMessage); // Display the error message from the backend
        // Do not navigate if the status is 402 (error)
      } else {
        setError('Login failed. Please check your credentials.');
        console.error('Login failed:', response.status);
        // Do not navigate for other error statuses as well
      }
    } catch (error) {
      setError('An error occurred during login.');
      console.error('Login error:', error);
      // Do not navigate if there's a network error
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Image */}
      <div className="w-1/2 hidden md:block">
        <img
          src={DoctorLoginImage}
          alt="Login Illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Form */}
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

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="login"
            className="w-full bg-[#0A66C2] text-white py-2 px-4 rounded-md hover:bg-[#084B9E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A66C2]"
          >
            Login
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