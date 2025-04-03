import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/Logo.png' // Import the logo

const Header = () => {
  const [showLoginDropdown, setShowLoginDropdown] = useState(false)
  const [showSignupDropdown, setShowSignupDropdown] = useState(false)

  return (
    <header className="bg-transparent p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and RespiraScan Text */}
        <Link to="./Home.jsx" className="flex items-center space-x-2">
          <img src={logo} alt="RespiraScan Logo" className="h-10 w-10 rounded-full object-cover" />
          <span className="text-[#09D8B6] font-bold text-xl">RespiraScan</span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-[#09D8B6]">
            Features
          </Link>
          <Link to="/about-developers" className="text-gray-700 hover:text-[#09D8B6]">
            About Developers
          </Link>

          {/* Sign Up Dropdown */}
          <div className="relative">
            <button 
              className="text-gray-700 hover:text-[#09D8B6]"
              onClick={() => setShowSignupDropdown(!showSignupDropdown)}
            >
              Sign Up
            </button>
            {showSignupDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <Link 
                  to="/doctor-signup" 
                  className="block px-4 py-2 text-gray-700 hover:bg-[#09D8B6] hover:text-white"
                  onClick={() => setShowSignupDropdown(false)}
                >
                  Doctor
                </Link>
                <Link 
                  to="/patient-signup" 
                  className="block px-4 py-2 text-gray-700 hover:bg-[#09D8B6] hover:text-white"
                  onClick={() => setShowSignupDropdown(false)}
                >
                  Patient
                </Link>
              </div>
            )}
          </div>

          {/* Login Dropdown */}
          <div className="relative">
            <button 
              className="text-gray-700 hover:text-[#09D8B6]"
              onClick={() => setShowLoginDropdown(!showLoginDropdown)}
            >
              Login
            </button>
            {showLoginDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <Link 
                  to="/doctor-login" 
                  className="block px-4 py-2 text-gray-700 hover:bg-[#09D8B6] hover:text-white"
                  onClick={() => setShowLoginDropdown(false)}
                >
                  Doctor
                </Link>
                <Link 
                  to="/patient-login" 
                  className="block px-4 py-2 text-gray-700 hover:bg-[#09D8B6] hover:text-white"
                  onClick={() => setShowLoginDropdown(false)}
                >
                  Patient
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
