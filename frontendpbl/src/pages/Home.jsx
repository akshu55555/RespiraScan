import logo from '../assets/Logo.png';
import { FaLinkedin, FaUserMd, FaUserInjured, FaShieldAlt, FaChartLine, FaDatabase, FaFileMedicalAlt } from 'react-icons/fa';
import useScrollAnimation from '../hooks/useScrollAnimation';
import '../css/Home.css';

const Home = () => {
  useScrollAnimation();

  return (
    <div className="bg-gradient-to-b from-white to-[#09D8B6] min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="flex justify-center mb-8 fade-in">
          <img 
            src={logo} 
            alt="RespiraScan Logo" 
            className="h-60 w-auto transition-transform duration-500 hover:scale-105" 
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#05695f] fade-in">
          Breathe Easy with <span className="text-[#09D8B6]">RespiraScan</span>
        </h1>
        <p className="max-w-3xl mx-auto mb-6 text-xl text-gray-600 fade-in">
          Advanced AI-powered detection for pneumonia, tuberculosis, and other pulmonary conditions. 
          Get accurate, instant analysis of your medical scans with clinical-grade precision.
        </p>
        <div className="bg-[#cff8f1] border-l-4 border-[#09D8B6] p-4 max-w-2xl mx-auto fade-in">
          <p className="text-[#05695f] text-xl font-medium italic">
            "Early detection saves lives. Know your lung health in seconds."
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-16 text-[#05695f] fade-in">
          Why Choose RespiraScan?
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { Icon: FaUserMd, title: "Dual Login System", desc: "Secure separate portals for patients and healthcare providers with role-based access." },
            { Icon: FaChartLine, title: "AI-Powered Detection", desc: "State-of-the-art deep learning analyzes chest X-rays with 98.7% clinical accuracy." },
            { Icon: FaUserInjured, title: "Comprehensive Dashboards", desc: "Intuitive interfaces for both doctors and patients to manage medical data." },
            { Icon: FaFileMedicalAlt, title: "Instant Reports", desc: "Detailed diagnostic reports generated in seconds with actionable insights." },
            { Icon: FaDatabase, title: "Secure Storage", desc: "HIPAA-compliant encrypted storage for all medical records and images." },
            { Icon: FaShieldAlt, title: "Privacy First", desc: "Strict data protection protocols ensure your health information stays private." },
          ].map(({ Icon, title, desc }, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow fade-in">
              <div className="flex items-center mb-4">
                <div className="bg-[#cff8f1] p-3 rounded-full mr-4">
                  <Icon className="text-[#09D8B6] text-xl" />
                </div>
                <h3 className="text-xl font-bold text-[#05695f]">{title}</h3>
              </div>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-16 text-[#05695f] fade-in">
          How RespiraScan Works
        </h2>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 mb-12 fade-in">
            {[
              ["Upload Your Scan", "Simply drag and drop your chest X-ray or CT scan. Our system accepts DICOM and standard image formats."],
              ["AI Analysis", "Our deep learning model examines 127 clinical features in your scan to detect abnormalities."],
              ["Get Results", "Receive a comprehensive report with findings, risk assessment, and recommended next steps."]
            ].map(([title, desc], idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-md flex-1">
                <div className="text-[#09D8B6] text-4xl font-bold mb-4">{idx + 1}</div>
                <h3 className="text-xl font-bold mb-3 text-[#05695f]">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developers Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-16 text-[#05695f] fade-in">
          Our Tech Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            { name: "Kanak Dagade", img: "/kanak-profile.jpg", link: "https://linkedin.com/in/kanak-dagade" },
            { name: "Mrinmayi Barve", img: "/Mrinmayi_profile.jpg", link: "https://www.linkedin.com/in/mrinmayi-barve-0a866b354/" },
            { name: "Akanksha Bhagwat", img: "/Akanksha_Profile.jpg", link: "https://www.linkedin.com/in/akanksha-bhagwat-b86390287/" },
            { name: "Bhavika Panpalia", img: "/Bhavika_profile.jpg", link: "https://www.linkedin.com/in/bhavika-panpalia-11a027284/" },
          ].map(({ name, img, link }, idx) => (
            <div key={idx} className="bg-[#e4fdf8] p-6 rounded-xl text-center transition-transform hover:scale-105 fade-in">
              <div className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-md">
                <img src={img} alt={name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold text-[#05695f] mb-1">{name}</h3>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#d4f7f1] hover:bg-[#bdf1e7] p-2 rounded-full transition-colors"
              >
                <FaLinkedin className="text-[#09D8B6]" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 fade-in">
      <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl font-bold mb-6 text-[#05695f]">Ready to Check Your Lung Health?</h2>
      <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-700">
      Join thousands of patients and doctors who trust RespiraScan for accurate pulmonary analysis.
      </p>
      </div>
      </section>
    </div>
  );
};

export default Home;