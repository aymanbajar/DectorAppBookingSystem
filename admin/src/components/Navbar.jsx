import { assets } from "../assets/assets";
import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { useNavigate } from 'react-router-dom';
import { DoctorContext } from "../context/DoctorContext";

export default function Navbar() {
    const {aToken, setAToken} = useContext(AdminContext);
    const {dToken, setDToken} = useContext(DoctorContext);
    const navigate = useNavigate();
    const logout = () => {
        navigate('/');

        aToken && setAToken('');
        aToken && localStorage.removeItem('aToken');
        dToken && setDToken('');
        dToken && localStorage.removeItem('dToken');
    }
    return (
        <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b border-gray-300 bg-white font-serif">
            <div className="flex items-center gap-2 text-xs">
                <img 
                    src={assets.admin_logo} 
                    alt='admin logo' 
                    className="h-12 w-auto object-contain hover:scale-105 transition-transform duration-200"
                />
                <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600 ">
                    {aToken ? 'Admin' : 'Dok tor'}
                </p>
              
            </div>
              <button onClick={logout} className="bg-blue-600 text-white text-sm px-10 py-2 rounded-full font-bold">
                    Çıkış Yap
                </button>
        </div>
    )
}