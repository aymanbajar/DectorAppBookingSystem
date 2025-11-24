import { createContext } from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export const  DoctorContext = createContext();

const DoctorContextProvider =(props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [dToken,setDToken] = useState(localStorage.getItem('dToken') || '');
    const[appointments, setAppointments] = useState([])

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

    const value = {
        backendUrl,
        dToken,
        setDToken,
        appointments,
        setAppointments,
        getAppointments

    }
    return(
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}
export default DoctorContextProvider;