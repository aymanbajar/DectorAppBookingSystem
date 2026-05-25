import { createContext } from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export const  AdminContext = createContext();

const AdminContextProvider =(props) => {
    const [aToken,setAToken] = useState(localStorage.getItem('aToken') );
    const[doctors,setDoctors] = useState([]);
    const[patients,setPatients] = useState([]);
    const[appointments,setAppointments] = useState([]);
    const[dashData,setDashData] = useState(false);
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const getAllDoctors =async() => {
        try{
            const {data} = await axios.post(`${backendURL}/api/admin/all-doctors`,{},{
                headers:{
                    Authorization: `Bearer ${aToken}`
                }
            });
            if(data.success){
                setDoctors(data.doctors);
                console.log(data.doctors);
            }else{
                toast.error('Doktorlar alınamadı');
            }

        }catch(error){
            toast.error('Bir hata oluştu');
            console.log(error);

        }
        
    }
    const changeAvailability = async (docId) => {
        try {
            const { data } = await axios.post(`${backendURL}/api/admin/change-availability`, { docId }, {
                headers: {
                    Authorization: `Bearer ${aToken}`
                }
            });
            if (data.success) {
                toast.success(data.message);
                getAllDoctors();
            } else {
                toast.error('Doktor uygunluğu değiştirilemedi');
            }
        } catch (error) {
            toast.error('Bir hata oluştu');
            console.log(error);
        }
    }
    const getAllPatients = async () => {
        try {
            const { data } = await axios.get(`${backendURL}/api/admin/patients`, {
                headers: { Authorization: `Bearer ${aToken}` }
            });
            data.success ? setPatients(data.patients) : toast.error("Hastalar alınamadı");
        } catch (error) {
            toast.error("Hastalar alınamadı");
            console.log(error);
        }
    }

    const updateDoctor = async (docId, formData) => {
        try {
            const { data } = await axios.post(`${backendURL}/api/admin/update-doctor/${docId}`, formData, {
                headers: { Authorization: `Bearer ${aToken}` }
            });
            if (data.success) {
                toast.success(data.message);
                getAllDoctors();
                return true;
            }
            toast.error(data.message || "Doktor güncellenemedi");
            return false;
        } catch (error) {
            toast.error("Doktor güncellenemedi");
            console.log(error);
            return false;
        }
    }

    const deleteDoctor = async (docId) => {
        try {
            const { data } = await axios.delete(`${backendURL}/api/admin/doctor/${docId}`, {
                headers: { Authorization: `Bearer ${aToken}` }
            });
            if (data.success) {
                toast.success(data.message);
                getAllDoctors();
            } else {
                toast.error(data.message || "Doktor silinemedi");
            }
        } catch (error) {
            toast.error("Doktor silinemedi");
            console.log(error);
        }
    }

    const deletePatient = async (userId) => {
        try {
            const { data } = await axios.delete(`${backendURL}/api/admin/patient/${userId}`, {
                headers: { Authorization: `Bearer ${aToken}` }
            });
            if (data.success) {
                toast.success(data.message);
                getAllPatients();
            } else {
                toast.error(data.message || "Hasta silinemedi");
            }
        } catch (error) {
            toast.error("Hasta silinemedi");
            console.log(error);
        }
    }

    const updatePatient = async (userId, payload) => {
        try {
            const { data } = await axios.post(`${backendURL}/api/admin/update-patient/${userId}`, payload, {
                headers: { Authorization: `Bearer ${aToken}` }
            });
            if (data.success) {
                toast.success(data.message);
                getAllPatients();
                return true;
            }
            toast.error(data.message || "Hasta güncellenemedi");
            return false;
        } catch (error) {
            toast.error("Hasta güncellenemedi");
            console.log(error);
            return false;
        }
    }
    const getAllAppointments = async () => {
        try{
            const {data }= await axios.get(`${backendURL}/api/admin/appointments`,{
                headers:{
                    Authorization: `Bearer ${aToken}`
                }
            }); 
            if(data.success){
                setAppointments(data.appointments);
                toast.success('Randevular alındı');
            }else{
                toast.error('Randevular alınamadı');
            }

        }catch(error){
            console.log(error);
            toast.error('Randevular alınamadı');

        }
    }
 
 const  cancelAppointment =async(appointmentId) => {
    try{
        const{data} = await axios.post(`${backendURL}/api/admin/cancel-appointment`,{appointmentId},{
            headers:{
                Authorization: `Bearer ${aToken}`
            }
        });
        if(data.success){
            toast.success("Randevu başarıyla iptal edildi");
            getAllAppointments();
        }else{
            toast.error("Randevu iptal edilemedi");
        }   

    }catch(error){
        console.log(error);
    }
 }
const getDashData = async() => {
    try{
        const {data} = await axios.get(`${backendURL}/api/admin/dashboard`,{
            headers:{
                'Authorization': `Bearer ${aToken}`
            }
        });   
        if(data.success){  
            
            setDashData(data.dashData);
            console.log(data.dashData);
        }else{
            toast.error("Dashboard verileri alınamadı");
        }  
            
    }catch(error){
        console.log(error)
        toast.error("Dashboard verileri alınamadı");
    }
}

    const value = {
        aToken,
        setAToken,
        backendURL,
        doctors,
        patients,
        getAllDoctors,
        getAllPatients,
        changeAvailability,
        updateDoctor,
        deleteDoctor,
        deletePatient,
        updatePatient,
        appointments,
        setAppointments,
        getAllAppointments,
        cancelAppointment,
        dashData,
        getDashData
    }
    return(
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}
export default AdminContextProvider;
