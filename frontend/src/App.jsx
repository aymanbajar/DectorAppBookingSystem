// Pages
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About  from './pages/About'
import Contact from './pages/Contact'
import MyProfile from  './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import Appointments from './pages/Appointments'
import Favorites from './pages/Favorites'
import Compare from './pages/Compare'
import RecentDoctors from './pages/RecentDoctors'
import Chat from './pages/Chat'
import Notifications from './pages/Notifications'
import MedicalRecord from './pages/MedicalRecord'
import MyPrescriptions from './pages/MyPrescriptions'

// components
import Navbar from './components/Navbar'

// React Router
import { Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react'


function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <ToastContainer />
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="page-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:speciality" element={<Doctors />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/my-appointments" element={<MyAppointments />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/recent" element={<RecentDoctors />} />
          <Route path="/chat/:docId" element={<Chat />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/medical-record" element={<MedicalRecord />} />
          <Route path="/my-prescriptions" element={<MyPrescriptions />} />
          <Route path="/Appointments/:docId" element={<Appointments />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App
