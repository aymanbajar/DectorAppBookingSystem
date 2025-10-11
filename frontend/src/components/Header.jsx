import { assets } from '../assets/assets_frontend/assets.js';
export default function Header(){
    return (
      <div className="flex flex-col md:flex-row flex-wrap bg-blue-600 px-6 md:px-10 lg:px-20  font-serif rounded-2xl">
        {/* left side */}

        <div className="md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px] ">
          <p className="uppercase text-3xl md:text-4xl lg:text-5xl text-white leading-tight md:leading-tight lg:leading-tight">
            güvenilir doktorlardan <br /> randevu al{" "}
          </p>
          <div className="flex flex-col md:flex-row items-center gap-3  text-white ">
            <img
              className="w-28"
              src={assets.group_profiles}
              alt=" group profiles"
            />
            <p>
              Güvenilir doktorlardan oluşan geniş listemize göz atın,{" "}
              <br className="hidden sm:block" />
              randevunuzu zahmetsizce planlayın
            </p>
          </div>
          <a href="#speciality" className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-sm m-auto md:m-0 hover:scale-150 transition-all  duration-300'>
            Randevu al <img className=' w-3 ' src={assets.arrow_icon} alt="arrow icon" />
          </a>
        </div>

        {/* right side */}

        <div className="md:w-1/2 relative  ">
          <img
            className="w-full md:absolute bottom-0 h-auto rounded-lg"
            src={assets.header_img}
            alt="Header Image"
          />
        </div>
      </div>
    );
}