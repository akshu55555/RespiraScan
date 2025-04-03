import logo from '../assets/Logo.png';
import { FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const Home = () => {
  const [scrollIndex, setScrollIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 400 && scrollIndex < 1) setScrollIndex(1);
      if (scrollY > 800 && scrollIndex < 2) setScrollIndex(2);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollIndex]);

  return (
    <div className="container mx-auto px-4 pb-16">
      <div className="text-center my-8">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="RespiraScan Logo" className="h-45 w-45" />
        </div>
        <h1 className="text-3xl font-bold mb-2">RespiraScan</h1>
        <p className="max-w-2xl mx-auto mb-2 text-xl">
          Your trusted AI-powered pneumonia detection tool. Simply upload your scan, and our advanced technology will analyze it to provide quick and accurate results.
        </p>
        <p className="text-2xl font-semibold">Scan, Detect Breathe Easier.</p>
      </div>

      <section className="my-16">
        <h2 className="text-2xl font-bold text-center mb-10">Features</h2>
        <div className="max-w-4xl mx-auto space-y-8">
          {scrollIndex >= 0 && (
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="mb-8">
              <h3 className="text-xl font-bold mb-2">Dual Login System</h3>
              <p className="text-lg">Separate sign-up and login portals for patients and doctors for secure access.</p>
              <h3 className="text-xl font-bold mt-6 mb-2">AI-Powered Pneumonia Detection</h3>
              <p className="text-lg">Advanced machine learning analyzes chest X-rays to detect pneumonia accurately.</p>
            </motion.div>
          )}
          {scrollIndex >= 1 && (
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="mb-8">
              <h3 className="text-xl font-bold mb-2">Doctor Dashboard</h3>
              <p className="text-lg">Enables doctors to search patient IDs, upload X-rays, and access reports efficiently.</p>
              <h3 className="text-xl font-bold mt-6 mb-2">Instant Report Generation</h3>
              <p className="text-lg">AI processes X-rays in seconds and generates a detailed medical report.</p>
            </motion.div>
          )}
          {scrollIndex >= 2 && (
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="mb-8">
              <h3 className="text-xl font-bold mb-2">Centralized Report Storage</h3>
              <p className="text-lg">Reports are securely stored in both patient and doctor databases for easy access.</p>
              <h3 className="text-xl font-bold mt-6 mb-2">Patient Dashboard</h3>
              <p className="text-lg">Allows patients to view their reports and check their pneumonia status anytime.</p>
              <h3 className="text-xl font-bold mt-6 mb-2">Secure & Encrypted Data Handling</h3>
              <p className="text-lg">Ensures privacy and protection of medical records with encrypted storage.</p>
            </motion.div>
          )}
        </div>
      </section>

      <section className="my-16">
        <h2 className="text-3xl font-bold text-center mb-10">About Developers</h2>
        <div className="flex flex-wrap justify-center gap-24">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="text-center">
              <div className="w-32 h-32 mx-auto mb-3 rounded-full overflow-hidden">
                <img 
                  src="/kanak-profile.jpg" 
                  alt="Kanak Dagade" 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-medium">Kanak Dagade</p>
              <a 
                href="https://linkedin.com/in/kanak-dagade" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-block text-blue-600 mt-1"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
