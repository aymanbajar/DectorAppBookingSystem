import { Link } from "react-router-dom";
import { specialityData } from "../assets/assets_frontend/assets";

export default function SpecialityMenu() {

    return (
      <div id="speciality" className="flex flex-col items-center  gap-4 py-16 text-gray-800 font-serif">
        <h1 className="uppercase text-4xl">Uzmanlığa Göre Bul</h1>
        <p className="sm:w-1/2 text-center text-xl">
          Güvenilir doktorlardan oluşan geniş listemizi inceleyin, randevunuzu
          zahmetsizce planlayın. 
        </p>
        <div className="flex sm:justify-center gap-4 pt-5 w-full overflow-scroll-hidden scrollbar-hide px-4">
        {specialityData.map((item, index) =>(
            <Link onClick={() => scrollTo(0,0)} className=" flex flex-col items-center text-sm cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500" key={index} to={`/doctors/${item.speciality}`}>
                <img className="w-16 sm:w-24 mb-2" src={item.image} alt="item image" />
                <p>{item.speciality}</p>

            </Link>

        ))}

        </div>
      </div>
    );
}