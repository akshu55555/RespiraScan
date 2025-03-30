import React from 'react';
import '../pages/Home.css';
import logo from '../assets/logo.jpg';
import developer1 from '../assets/developer1.jpg';
import developer2 from '../assets/developer2.jpg';
import developer3 from '../assets/developer3.jpg';
import developer4 from '../assets/developer4.jpg';
import linkedinIcon from '../assets/linkedin.png';

const Home = () => {
    return (
        <div className="homepage">
            {/* Navbar */}
            <nav className="navbar">
                <div className="logo-container">
                    <img src={logo} alt="RespiraScan Logo" className="logo" />
                    <p className="logo-text">RespiraScan</p>
                </div>

                <div className="nav-links">
                    <a href="#features">Features</a>
                    <a href="#about">About Developers</a>

                    {/* Login Dropdown */}
                    <div className="dropdown">
                        <a className="dropbtn">Login</a>
                        <div className="dropdown-content">
                            <a href="/doctor-login">Doctor</a>
                            <a href="/patient-login">Patient</a>
                        </div>
                    </div>

                    {/* Signup Dropdown */}
                    <div className="dropdown">
                        <a className="dropbtn">Signup</a>
                        <div className="dropdown-content">
                            <a href="/doctor-signup">Doctor</a>
                            <a href="/patient-signup">Patient</a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="hero">
                <div className="hero-text">
                    <h1>Respira Scan</h1>
                    <p>RespiraScan – Your trusted AI-powered pneumonia detection tool. Simply upload your scan, and our advanced technology will analyze it to provide quick and accurate results.
                    <b>Scan, Detect Breathe Easier..</b></p>
                </div>

                {/* Placeholder for video/image */}
                <div className="video-placeholder">
                    <p>Video Placeholder</p>
                </div>
            </div>

            {/* Features Section */}
            <section id="features" className="section">
                <h2>Features</h2>
                <div className="features-container">
                    <div className="feature">
                        <h3>AI-based pneumonia detection</h3>
                        <p>Using advanced AI models, our system detects pneumonia from chest X-rays with high accuracy.</p>
                    </div>
                    <div className="feature">
                        <h3>Secure and accurate results</h3>
                        <p>Ensures data privacy and delivers results with maximum reliability.</p>
                    </div>
                    <div className="feature">
                        <h3>Fast report generation</h3>
                        <p>Get instant analysis within seconds, helping doctors make quick decisions.</p>
                    </div>
                    <div className="feature">
                        <h3>Doctor & patient dashboards</h3>
                        <p>Dedicated portals for both doctors and patients for easy management of reports.</p>
                    </div>
                    <div className="feature">
                        <h3>Cloud-based report storage</h3>
                        <p>Secure cloud storage ensures reports are accessible anytime, anywhere.</p>
                    </div>
                    <div className="feature">
                        <h3>Easy access & sharing of results</h3>
                        <p>Seamless report sharing with healthcare professionals for better collaboration.</p>
                    </div>
                    <div className="feature">
                        <h3>User-friendly interface</h3>
                        <p>Designed for ease of use, ensuring a smooth experience for all users.</p>
                    </div>
                </div>
            </section>

            {/* About Developers Section */}
            <section id="about" className="section">
                <h2>About Developers</h2>
                <div className="developer-container">
                    <div className="developer">
                        <img src={developer1} alt="Kanak Dagade" />
                        <p>Kanak Dagade</p>
                        <a href="https://www.linkedin.com/in/kanakdagade" target="_blank" rel="noopener noreferrer">
                            <img src={linkedinIcon} alt="LinkedIn" className="linkedin-icon" />
                        </a>
                    </div>

                    <div className="developer">
                        <img src={developer2} alt="Developer Name 2" />
                        <p>Developer Name 2</p>
                        <a href="https://www.linkedin.com/in/dev2" target="_blank" rel="noopener noreferrer">
                            <img src={linkedinIcon} alt="LinkedIn" className="linkedin-icon" />
                        </a>
                    </div>

                    <div className="developer">
                        <img src={developer3} alt="Developer Name 3" />
                        <p>Developer Name 3</p>
                        <a href="https://www.linkedin.com/in/dev3" target="_blank" rel="noopener noreferrer">
                            <img src={linkedinIcon} alt="LinkedIn" className="linkedin-icon" />
                        </a>
                    </div>

                    <div className="developer">
                        <img src={developer4} alt="Developer Name 4" />
                        <p>Developer Name 4</p>
                        <a href="https://www.linkedin.com/in/dev4" target="_blank" rel="noopener noreferrer">
                            <img src={linkedinIcon} alt="LinkedIn" className="linkedin-icon" />
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
