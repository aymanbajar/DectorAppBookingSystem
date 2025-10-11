import { NavLink, useNavigate } from 'react-router-dom'
import logoImage from '../assets/logo.png'
import profileLogo from '../assets/profileLogo.png'
import { assets } from '../assets/assets_frontend/assets.js';
import { useState } from 'react';

export default function Navbar(){
    const navigate =  useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [token,setToken] =useState(true)
   
    return (
      <div className="flex justify-between items-center bg-white sticky top-0 z-50 border-b border-gray-400 text-xl px-8 py-2 mb-5 font-serif">
        {/* logo */}
        <div
          className="flex items-center  cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            onClick={() => navigate("/")}
            src={logoImage}
            alt="logo"
            className="w-20 h-20"
          />
        </div>

        {/* Links */}
        <ul className="hidden md:flex items-center gap-8  text-gray-700">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `transition-colors duration-300 ${
                isActive ? "text-blue-600 border-b-2 border-blue-600" : ""
              } hover:text-blue-600`
            }
          >
            Ana Sayfa
          </NavLink>
          <NavLink
            to="/doctors"
            className={({ isActive }) =>
              `transition-colors duration-300 ${
                isActive ? "text-blue-600 border-b-2 border-blue-600" : ""
              } hover:text-blue-600`
            }
          >
            Tüm Doktorlar
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `transition-colors duration-300 ${
                isActive ? "text-blue-600 border-b-2 border-blue-600" : ""
              } hover:text-blue-600`
            }
          >
            Hakkında
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `transition-colors duration-300 ${
                isActive ? "text-blue-600 border-b-2 border-blue-600" : ""
              } hover:text-blue-600`
            }
          >
            İletişim
          </NavLink>
        </ul>
        <div className="flex items-center gap-3">
          {token ? (
            <div className=" flex items-center gap-2 cursor-pointer group  relative">
              <img
                className="w-8 rounded-full"
                src={profileLogo}
                alt="profile logo"
              />
              <img
                className="w-2.5"
                src={assets.dropdown_icon}
                alt="dropdown icon"
              />
              <div className="absolute top-0 right-0 pt-14 text-base group-hover:block hidden  text-gray-600 z-2 ">
                <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4 ">
                  <p
                    className="hover:text-black cursor-pointer transition"
                    onClick={() => navigate("/my-profile")}
                  >
                    profilim
                  </p>
                  <p
                    className="hover:text-black cursor-pointer transition"
                    onClick={() => navigate("/my-appointments")}
                  >
                    randevularım
                  </p>
                  <p
                    className="hover:text-black cursor-pointer transition"
                    onClick={() => setToken(false)}
                  >
                    çıkış yap
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-800 hidden md:block text-white px-8 py-3 rounded-full font-light"
            >
              Hesap Oluştur
            </button>
          )}
          <img
            onClick={() => setShowMenu(true)}
            className="w-6  md:hidden "
            src={assets.menu_icon}
            alt="Menu  icon "
          />
          {/* Mobil menu  */}
          <div className={`${showMenu ? 'fixed w-full' : 'w-0 h-0 '} md:hidden right-0 bottom-0 top-0 z-20 overflow-hidden  bg-white transition-all duration-300`}>
            <div className='flex items-center justify-between px-5 py-6'>
              <img className='w-20' src={logoImage} alt="logo  image" />
              <img
                className='w-7'
                onClick={() => setShowMenu(false)}
                src={assets.cross_icon}
                alt="cross icon "
              />
            </div>
            <ul className='flex flex-col  items-center gap-2 mt-5 px-5 text-3xl '>
              <NavLink  onClick={() =>setShowMenu(false)} to='/' ><p className='px-4 py-2 rounded inline-block'>Ana Sayfa</p></NavLink>
              <NavLink  onClick={() =>setShowMenu(false)} to='/doctors' ><p className='px-4 py-2 rounded inline-block'>Tüm Doktorlar</p></NavLink>
              <NavLink  onClick={() =>setShowMenu(false)} to='/about' ><p className='px-4 py-2 rounded inline-block'>Hakkında</p></NavLink>
              <NavLink  onClick={() =>setShowMenu(false)} to='/contact' ><p className='px-4 py-2 rounded inline-block'>İletişim</p></NavLink>
            </ul>
          </div>
        </div>
      </div>
    );
}