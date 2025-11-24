import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import {useEffect} from 'react';
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

export default function AllApointments(){
    const{aToken, appointments,getAllAppointments,cancelAppointment}= useContext(AdminContext);
    const { calculateAge ,slotDateFormat} = useContext(AppContext);

    useEffect(()=>{
        if(aToken){
            getAllAppointments();
        }
    },[aToken]);
    return(
        <div className='w-full max-w-6xl m-5'>
            <p className='mb-3 text-lg font-medium'>Tüm Randevular</p>
            <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
              <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b">
                <p className='font-bold'>#</p>
                <p className='font-bold'>Hasta </p>
                <p className='font-bold'>Yaş</p>
                <p className='font-bold'>Tarih & zaman</p>
                <p className='font-bold'>Doktor</p>
                <p className='font-bold'>Ücret</p>
                <p className='font-bold'>İşlemler</p>

               
              </div>
               {appointments.map((item,index) =>(
                    <div 
                    className='flex flex-wrap justify-between maxsm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50'
                    key ={index}>
                    <p className='max-sm:hidden'>{index+1}</p>   
                        <div className='flex items-center gap-2'>
                            <img className="w-8 rounded-full" src={item.userData.image} alt="" />
                            <p>{item.userData.name}</p>
                        </div>
                        <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
                        <p>{slotDateFormat(item.sloteDate)} | {item.sloteTime}</p>
                        <div className='flex items-center gap-2'>
                            <img className="w-8 rounded-full" src={item.docData.image} alt="" />
                            <p>{item.docData.name}</p>
                        </div>
                        <p>${item.amount}</p>
                        <div className="flex gap-2">
                            {item.cancelled ? (
                                <p className="text-red-500 text-xs font-medium">İptal Edildi</p>
                            ) : (
                                <img onClick={() => cancelAppointment(item._id)} className="w-10 cursor-pointer" src={assets.cancel_icon} alt="" />
                            )}
                        </div>
                    </div>
                ))}
            </div>



        </div>
    )
}