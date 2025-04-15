import logo from '../assets/Logo.png';
import { FaLinkedin, FaUserMd, FaUserInjured, FaShieldAlt, FaChartLine, FaDatabase, FaFileMedicalAlt } from 'react-icons/fa';
import useScrollAnimation from '../hooks/useScrollAnimation';
import '../css/Home.css';

const Home = () => {
  useScrollAnimation();

  return (
    <div className="bg-gradient-to-b from-green-50 to-white min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="flex justify-center mb-8 fade-in">
          <img 
            src={logo} 
            alt="RespiraScan Logo" 
            className="h-60 w-auto transition-transform duration-500 hover:scale-105" 
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-900 fade-in">
          Breathe Easy with <span className="text-green-600">RespiraScan</span>
        </h1>
        <p className="max-w-3xl mx-auto mb-6 text-xl text-gray-600 fade-in">
          Advanced AI-powered detection for pneumonia, tuberculosis, and other pulmonary conditions. 
          Get accurate, instant analysis of your medical scans with clinical-grade precision.
        </p>
        <div className="bg-green-100 border-l-4 border-green-500 p-4 max-w-2xl mx-auto fade-in">
          <p className="text-green-800 text-xl font-medium italic">
            "Early detection saves lives. Know your lung health in minutes."
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-16 text-green-900 fade-in">
          Why Choose RespiraScan?
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-green-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow fade-in">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FaUserMd className="text-green-600 text-xl" />
              </div>
              <h3 className="text-xl font-bold text-green-900">Dual Login System</h3>
            </div>
            <p className="text-gray-600">
              Secure separate portals for patients and healthcare providers with role-based access.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-green-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow fade-in">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FaChartLine className="text-green-600 text-xl" />
              </div>
              <h3 className="text-xl font-bold text-green-900">AI-Powered Detection</h3>
            </div>
            <p className="text-gray-600">
              State-of-the-art deep learning analyzes chest X-rays with 98.7% clinical accuracy.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-green-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow fade-in">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FaUserInjured className="text-green-600 text-xl" />
              </div>
              <h3 className="text-xl font-bold text-green-900">Comprehensive Dashboards</h3>
            </div>
            <p className="text-gray-600">
              Intuitive interfaces for both doctors and patients to manage medical data.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-green-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow fade-in">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FaFileMedicalAlt className="text-green-600 text-xl" />
              </div>
              <h3 className="text-xl font-bold text-green-900">Instant Reports</h3>
            </div>
            <p className="text-gray-600">
              Detailed diagnostic reports generated in seconds with actionable insights.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-green-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow fade-in">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FaDatabase className="text-green-600 text-xl" />
              </div>
              <h3 className="text-xl font-bold text-green-900">Secure Storage</h3>
            </div>
            <p className="text-gray-600">
              HIPAA-compliant encrypted storage for all medical records and images.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-green-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow fade-in">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FaShieldAlt className="text-green-600 text-xl" />
              </div>
              <h3 className="text-xl font-bold text-green-900">Privacy First</h3>
            </div>
            <p className="text-gray-600">
              Strict data protection protocols ensure your health information stays private.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-16 text-green-900 fade-in">
          How RespiraScan Works
        </h2>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 mb-12 fade-in">
            <div className="bg-white p-6 rounded-xl shadow-md flex-1">
              <div className="text-green-600 text-4xl font-bold mb-4">1</div>
              <h3 className="text-xl font-bold mb-3 text-green-900">Upload Your Scan</h3>
              <p className="text-gray-600">
                Simply drag and drop your chest X-ray or CT scan. Our system accepts DICOM and standard image formats.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md flex-1">
              <div className="text-green-600 text-4xl font-bold mb-4">2</div>
              <h3 className="text-xl font-bold mb-3 text-green-900">AI Analysis</h3>
              <p className="text-gray-600">
                Our deep learning model examines 127 clinical features in your scan to detect abnormalities.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md flex-1">
              <div className="text-green-600 text-4xl font-bold mb-4">3</div>
              <h3 className="text-xl font-bold mb-3 text-green-900">Get Results</h3>
              <p className="text-gray-600">
                Receive a comprehensive report with findings, risk assessment, and recommended next steps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Developers Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-16 text-green-900 fade-in">
          Our Medical AI Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Developer 1 */}
          <div className="bg-green-50 p-6 rounded-xl text-center transition-transform hover:scale-105 fade-in">
            <div className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-md">
              <img 
                src="/kanak-profile.jpg" 
                alt="Kanak Dagade" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-green-900 mb-1">Kanak Dagade</h3>
            <a 
              href="https://linkedin.com/in/kanak-dagade" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-block bg-green-100 hover:bg-green-200 p-2 rounded-full transition-colors"
            >
              <FaLinkedin className="text-green-700" />
            </a>
          </div>

          {/* Developer 2 */}
          <div className="bg-green-50 p-6 rounded-xl text-center transition-transform hover:scale-105 fade-in">
            <div className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-md">
              <img 
                src="/Mrinmayi_profile.jpg" 
                alt="Mrinmayi Barve" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-green-900 mb-1">Mrinmayi Barve</h3>
            <a 
              href="https://www.linkedin.com/in/mrinmayi-barve-0a866b354/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-block bg-green-100 hover:bg-green-200 p-2 rounded-full transition-colors"
            >
              <FaLinkedin className="text-green-700" />
            </a>
          </div>

          {/* Developer 3 */}
          <div className="bg-green-50 p-6 rounded-xl text-center transition-transform hover:scale-105 fade-in">
            <div className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-md">
              <img 
                src="/Akanksha_Profile.jpg" 
                alt="Akanksha Bhagwat" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-green-900 mb-1">Akanksha Bhagwat</h3>
            <a 
              href="https://www.linkedin.com/in/akanksha-bhagwat-b86390287/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-block bg-green-100 hover:bg-green-200 p-2 rounded-full transition-colors"
            >
              <FaLinkedin className="text-green-700" />
            </a>
          </div>

          {/* Developer 4 */}
          <div className="bg-green-50 p-6 rounded-xl text-center transition-transform hover:scale-105 fade-in">
            <div className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-md">
              <img 
                src="/Bhavika_profile.jpg" 
                alt="Bhavika Panpalia" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-green-900 mb-1">Bhavika Panpalia</h3>
            <a 
              href="https://www.linkedin.com/in/bhavika-panpalia-11a027284/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-block bg-green-100 hover:bg-green-200 p-2 rounded-full transition-colors"
            >
              <FaLinkedin className="text-green-700" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 fade-in">Ready to Check Your Lung Health?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto fade-in">
            Join thousands of patients and doctors who trust RespiraScan for accurate pulmonary analysis.
          </p>
          <button className="bg-white text-green-600 font-bold py-3 px-8 rounded-full hover:bg-green-50 transition-colors shadow-lg fade-in">
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;