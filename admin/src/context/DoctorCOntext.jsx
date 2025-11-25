import { createContext } from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export const  DoctorContext = createContext();

const DoctorContextProvider =(props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [dToken,setDToken] = useState(localStorage.getItem('dToken') || '');
    const[appointments, setAppointments] = useState([])
    const[dashData,setDashData] = useState(false);

    const getAppointments = async( ) => {
        try{
            const {data} = await axios.get(`${backendUrl}/api/doctor/appointments`,{
                headers:{
                    Authorization: `Bearer ${dToken}`
                }
            });
            if(data.success){
                setAppointments(data.appointments.reverse());
                toast.success('Randevular alındı');
                console.log(data.appointments);
            }else{
                toast.error('Randevular alınamadı');
            }
        }catch(error){
            console.log(error);
            toast.error('Randevular alınamadı');
        }
    }

    const completeAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/doctor/complete-appointment`, { appointmentId }, {
                headers: {
                    Authorization: `Bearer ${dToken}`
                }
            });
            if (data.success) {
                toast.success(data.message);
                getAppointments();
            } else {
                toast.error('Randevu tamamlanamadı');
            }
        }
        catch (error) {
            toast.error('Randevu tamamlanamadı');
            console.log(error);
        }

    }
 const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/doctor/cancel-appointment`, { appointmentId }, {
                headers: {
                    Authorization: `Bearer ${dToken}`
                }
            });
            if (data.success) {
                toast.success(data.message);
                getAppointments();
            } else {
                toast.error('Randevu iptal edilemedi');
            }
        } catch (error) {
            toast.error('Randevu iptal edilemedi');
             console.log(error);
        }


 }

 const getDashData = async() => {
    try{
        const {data} = await axios.get(`${backendUrl}/api/doctor/dashboard`,{
            headers:{
                'Authorization': `Bearer ${dToken}`
            }
        });   
        if(data.success){
            setDashData(data.dashData);
            console.log(data.dashData);
        }else{
            toast.error("panel verileri alınamadı");
        }
    }catch(error){
        toast.error("panel verileri alınamadı");
        console.log(error);
    }
 }
    const value = {
        backendUrl,
        dToken,
        setDToken,
        appointments,
        setAppointments,
        getAppointments,
        completeAppointment,
        cancelAppointment,
        dashData,
        getDashData,
        setDashData

    }
    return(
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}
export default DoctorContextProvider;