import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets";
export default function Banner(){
    const  navigate =  useNavigate()
    return (
      <div className="flex  bg-blue-700 px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10 font-serif">
        {/* Left side  */}
        <div className="flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5">
          <div className="text-xl sm:text-2xl md:text-3xl lg:text-5xl text-white ">
            <p>Randevu Al</p>
            <p className="mt-4 ">Güvenilir Doktorlar ile</p>
          </div>
          <button onClick={() => {navigate('/login') ;scrollTo(0,0)}} className="bg-white text-sm sm:text-base text-gray-600 px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all duration-300">Hesap oluştur</button>
        </div>
        {/* Right side */}
        <div className="hidden md:block md:w-1/2 lg:w-[370px] relative">
            <img className="w-full absolute right-0 bottom-0 max-w-md" src={assets.appointment_img} alt="appointment image" />
        </div>
      </div>
    );
}