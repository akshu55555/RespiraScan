import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PatientLoginImage from '../assets/Patient_Login.jpg';

const PatientLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors

    try {
      const response = await fetch('http://localhost:5000/loginpatient', { // Assuming your backend runs on port 8000
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, pass: password }), // Use 'pass' to match your backend
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
        
        if (data.token) {
          await new Promise((resolve) => {
            localStorage.setItem('patientToken', data.token);
            resolve();
          });
        }
      
        navigate('/patient-dashboard'); // Redirect to patient dashboard
      } else if (response.status === 402) {
        const errorMessage = await response.json(); // Backend sends plain text error
        setError(errorMessage);
      } else {
        setError('Login failed. Please check your credentials.');
        console.error('Login failed:', response.status);
      }
    } catch (error) {
      setError('An error occurred during login.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Image covering full half */}
      <div className="w-1/2 hidden md:block">
        <img
          src={PatientLoginImage}
          alt="Login Illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Login Form with Gradient Background */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-gradient-to-b from-white to-[#09D8B6] p-12">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Patient Login</h2>
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

          {/* Updated Button Color and Added onSubmit */}
          <button
            type="submit"
            className="w-full bg-[#0A66C2] text-white py-2 px-4 rounded-md hover:bg-[#084A9B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A66C2]"
          >
            LogIn
          </button>
        </form>

        {/* Updated Sign-up Text Color */}
        <p className="mt-4 text-center text-gray-800">
          Don't have an account?{' '}
          <Link to="/patient-signup" className="text-[#0A66C2] font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default PatientLogin;