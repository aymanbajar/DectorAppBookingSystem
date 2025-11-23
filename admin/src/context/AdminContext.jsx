import { createContext } from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export const  AdminContext = createContext();

const AdminContextProvider =(props) => {
    const [aToken,setAToken] = useState(localStorage.getItem('aToken') );
    const[doctors,setDoctors] = useState([]);
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

    const value = {
        aToken,
        setAToken,
        backendURL,
        doctors,
        getAllDoctors,
        changeAvailability
    }
    return(
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}
export default AdminContextProvider;