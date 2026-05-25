import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
import { AdminContext } from "./context/AdminContext.jsx";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import DoctorList from "./pages/Admin/DoctorList";
import PatientList from "./pages/Admin/PatientList";
import AdminCenter from "./pages/Admin/AdminCenter";
import AddDoctor from "./pages/Admin/AddDoctor";
import AllApointments from "./pages/Admin/AllApointments";
import { DoctorContext } from "./context/DoctorContext.jsx";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorAppoinments from "./pages/Doctor/DoctorAppoinments";
import DoctorProfile from "./pages/Doctor/DoctorProfile";
import DoctorChat from "./pages/Doctor/DoctorChat";
import DoctorNotifications from "./pages/Doctor/DoctorNotifications";
import DoctorPatients from "./pages/Doctor/DoctorPatients";
import DoctorPatientDetails from "./pages/Doctor/DoctorPatientDetails";
function App() {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);
  return aToken || dToken ? (
    <div className="min-h-screen bg-slate-100">
      <ToastContainer />
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <Routes>
            {/* Admin Routes */}
          
            <Route path="/" element={<></>} />
            <Route path="/admin-dashboard" element={<Dashboard />} />
            <Route path="/doctor-list" element={<DoctorList />} />
            <Route path="/patient-list" element={<PatientList />} />
            <Route path="/admin-center" element={<AdminCenter />} />
            <Route path="/add-doctor" element={<AddDoctor />} />
            <Route path="/all-appointments" element={<AllApointments />} />

            {/* Doctor Routes */}
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor-appointments" element={<DoctorAppoinments />} />
            <Route path="/doctor-profile" element={<DoctorProfile />} />
            <Route path="/doctor-chat" element={<DoctorChat />} />
            <Route path="/doctor-patients" element={<DoctorPatients />} />
            <Route path="/doctor-patient/:userId" element={<DoctorPatientDetails />} />
            <Route path="/doctor-notifications" element={<DoctorNotifications />} />
          </Routes>
        </main>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
}

export default App;
