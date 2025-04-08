import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import DoctorLogin from './pages/DoctorLogin'
import PatientLogin from './pages/PatientLogin'
import DoctorSignup from './pages/DoctorSignup.jsx'
import PatientSignup from './pages/PatientSignup'
import DoctorDashboard from './pages/DoctorDashboard' 

function App() {
  return (
    <div className="app min-h-screen bg-gradient-to-b from-white to-[#09D8B6]">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctor-login" element={<DoctorLogin />} />
        <Route path="/patient-login" element={<PatientLogin />} />
        <Route path="/doctor-signup" element={<DoctorSignup />} />
        <Route path="/patient-signup" element={<PatientSignup />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} /> 
      </Routes>
    </div>
  )
}

export default App
