import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/Logo.png' // Import the logo

const Header = () => {
  const [showLoginDropdown, setShowLoginDropdown] = useState(false)
  const [showSignupDropdown, setShowSignupDropdown] = useState(false)

  // Smooth scroll function
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Fixed Transparent Header */}
      <header className="fixed top-0 left-0 w-full bg-transparent z-50">
        <div className="container mx-auto flex justify-between items-center p-4">
          {/* Logo and RespiraScan Text */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="RespiraScan Logo" className="h-10 w-10 rounded-full object-cover" />
            <span className="text-[#09D8B6] font-bold text-xl">RespiraScan</span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-6">
            <button 
              className="text-gray-700 hover:text-[#09D8B6]" 
              onClick={(e) => { e.preventDefault(); scrollToSection("features"); }}
            >
              Features
            </button>
            <button 
              className="text-gray-700 hover:text-[#09D8B6]" 
              onClick={(e) => { e.preventDefault(); scrollToSection("about-developers"); }}
            >
              About Developers
            </button>

            {/* Sign Up Dropdown */}
            <div className="relative">
              <button 
                className="text-gray-700 hover:text-[#09D8B6]"
                onClick={() => {
                  setShowSignupDropdown(!showSignupDropdown);
                  setShowLoginDropdown(false);
                }}
              >
                Sign Up
              </button>
              {showSignupDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
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
                onClick={() => {
                  setShowLoginDropdown(!showLoginDropdown);
                  setShowSignupDropdown(false);
                }}
              >
                Login
              </button>
              {showLoginDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
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

      {/* Spacer to prevent content from being hidden under fixed header */}
      <div className="h-20"></div>
    </>
  )
}

export default Header;
