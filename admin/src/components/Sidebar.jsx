import { AdminContext } from "../context/AdminContext";
import { useContext } from "react";
import { NavLink } from 'react-router-dom';
import { assets } from "../assets/assets";
import { DoctorContext } from "../context/DoctorContext";
export default function Sidebar(){
    const{aToken} =  useContext(AdminContext);
    const{dToken} =  useContext(DoctorContext);
    return(
        <div className="min-h-[150vh] bg-white border-r">

        {
            aToken && <ul className="text-[#515151] mt-5">
                <NavLink  to={"/admin-dashboard"}
                    className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive? 'bg-[F2F3FF] border-r-4 border-blue-500':''}`}
                >
                    <img src={assets.home_icon} alt="" />
                    <span>panel</span>
                </NavLink>
                
                <NavLink
                    className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive? 'bg-[F2F3FF] border-r-4 border-blue-500':''}`}
                to={"/all-appointments"}>
                    <img src={assets.appointment_icon} alt="" />
                    <span>randavular</span>
                </NavLink>
                
                <NavLink
                    className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive? 'bg-[F2F3FF] border-r-4 border-blue-500':''}`}
                to={"/add-doctor"}>
                    <img src={assets.add_icon} alt="" />
                    <span>Dokror ekle</span>
                </NavLink>
                
                <NavLink 
                    className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive? 'bg-[F2F3FF] border-r-4 border-blue-500':''}`}
                to={"/doctor-list"}>
                    <img src={assets.people_icon} alt="" />
                    <span>Doktorlar </span>
                </NavLink>
            </ul>
        }
         {
            dToken && <ul className="text-[#515151] mt-5">
                <NavLink  to={"/doctor-dashboard"}
                    className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive? 'bg-[F2F3FF] border-r-4 border-blue-500':''}`}
                >
                    <img src={assets.home_icon} alt="" />
                    <span>panel</span>
                </NavLink>
                
                <NavLink
                    className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive? 'bg-[F2F3FF] border-r-4 border-blue-500':''}`}
                to={"/doctor-appointments"}>
                    <img src={assets.appointment_icon} alt="" />
                    <span>randavular</span>
                </NavLink>
                
              
                
                <NavLink 
                    className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive? 'bg-[F2F3FF] border-r-4 border-blue-500':''}`}
                to={"/doctor-profile"}>
                    <img src={assets.people_icon} alt="" />
                    <span>Profil </span>
                </NavLink>
            </ul>
        }

        </div>
    )
}