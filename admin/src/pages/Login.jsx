import { useState } from 'react';
import { AdminContext } from '../context/AdminContext';
import { useContext } from 'react';
import { DoctorContext } from '../context/DoctorContext';
import axios from 'axios'
import { toast } from 'react-toastify';
export default function Login() {
    const [state,setState] = useState('Admin');
    const[email,setEmail] = useState('');
    const[password,setPassword] = useState('');
    const {setAtoken,backendURL} = useContext(AdminContext);
    const{dToken,backendUrl,setDToken} = useContext(DoctorContext);
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try{
            if(state === 'Admin'){
                const {data} = await axios.post(`${backendURL}/api/admin/login`,{email,password});
                if(data.success){
                    localStorage.setItem('aToken',data.token);
                    setAtoken(data.token);
                }else{
                    toast.error('hata tanımlanmadı');
                }
            }
            else{
                const {data} = await axios.post(`${backendUrl}/api/doctor/login`,{email,password});
                if(data.success){
                    localStorage.setItem('dToken',data.token);
                    setDToken(data.token);
                    console.log(dToken)
                }else{
                    toast.error('hata tanımlanmadı');
                }
            }

        }catch(error){
            console.log(error);

        }
    }
    return(
        <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50' >
            <div className='flex flex-col gap-4 m-auto items-start p-10 min-w-[340px] sm:min-w-96 bg-white border border-gray-200 rounded-2xl text-gray-700 text-sm shadow-2xl hover:shadow-3xl transition-all duration-300'>
                <p className='text-3xl font-bold m-auto bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent mb-2'>
                    <span className='text-pretty'>{state}</span> Girişi
                </p>
                <div className='w-full flex flex-col items-start'>
                    <p className='font-medium text-gray-700 mb-2 '>Email</p>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} className='border-2 border-gray-200 rounded-lg w-full p-3 mt-1 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200' type="email" required placeholder='example@email.com' />
                </div>

                <div className='w-full flex flex-col items-start'>
                    <p className='font-medium text-gray-700 mb-2'>Şifre</p>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} className='border-2 border-gray-200 rounded-lg w-full p-3 mt-1 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200' type="password" required placeholder='••••••••' />
                </div>
                <button className='bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white w-full font-semibold rounded-lg px-4 py-3 text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 mt-2'>
                    Giriş Yap
                </button>
                {
                    state === 'Admin' ?
                    <p className='text-center w-full text-gray-600'>Doktor Girişi ? <span className='text-indigo-600 font-semibold cursor-pointer hover:text-indigo-700 underline decoration-2 underline-offset-2' onClick={() => setState('Doctor')}>buraya tıklayın</span></p> :
                    <p className='text-center w-full text-gray-600'>Admin Girişi ? <span className='text-indigo-600 font-semibold cursor-pointer hover:text-indigo-700 underline decoration-2 underline-offset-2' onClick={() => setState('Admin')}>buraya tıklayın</span></p>
                }
            </div>      
        </form>
    )
}