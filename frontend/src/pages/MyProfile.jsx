// import profileLogo from "../assets/profileLogo.png";
import { useState } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import axios from 'axios'
import { toast } from "react-toastify";
export default function MyProfile() {
  const{ userData, setUserData,token,backendUrl, loadUserProfileData } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const[image,setImage] = useState(false);
  const updateUserProfileData = async() => {
    try{
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('address', JSON.stringify(userData.address));
      formData.append('dob', userData.dob);
      formData.append('gender', userData.gender);
      image && formData.append('image', image);
      const {data} =  await axios.post(`${backendUrl}/api/user/update-profile`, formData,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      if(data.success){
        toast.success('Profil başarıyla güncellendi');
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false)
      }else{
        toast.error('Profil güncellenemedi');
      }
        
    }catch(error){
      console.log(error);
      toast.error('Bir hata oluştu');
    }
  } 

  return userData && (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-xl shadow-lg mt-8">
      {
        isEdit ? <label htmlFor="image">
          <div className = 'inline-block reative cursor-pointer'>
            <img className='w-36 rounded opacity-75' src={image ? URL.createObjectURL(image) : userData.image} alt="" />
            <img className="w-10 absolute bottom-12 right-12" src={image ?'' :assets.upload_icon} alt="" />
          </div>
          <input onChange={(e) => setImage(e.target.files[0])} type="file"  id='image' hidden />
          
        </label>:    <img
          src={userData.image}
          alt="User"
          className="w-32 h-32 rounded-full border-4 border-blue-400 shadow-md"
        />
      }
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
      
        <div className="flex-1">
          {isEdit ? (
            <input
              type="text"
              value={userData.name}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ) : (
            <h2 className="text-2xl font-semibold text-gray-900">
              {userData.name}
            </h2>
          )}
          <p className="text-gray-500 mt-1">{userData.email}</p>
        </div>
      </div>

      <hr className="my-6 border-gray-300" />

      {/* Contact Information */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          İletişim Bilgileri
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500">Telefon:</p>
            {isEdit ? (
              <input
                type="text"
                value={userData.phone}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="text-gray-700">{userData.phone}</p>
            )}
          </div>
          <div>
            <p className="text-gray-500">Adres:</p>
            {isEdit ? (
              <input
                type="text"
                value={userData.address}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, address: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="text-gray-700">{userData.address}</p>
            )}
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Temel Bilgiler
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500">Cinsiyet:</p>
            {isEdit ? (
              <select
                value={userData.gender}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, gender: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="Erkek">Erkek</option>
                <option value="Kız">Kız</option>
              </select>
            ) : (
              <p className="text-gray-700">{userData.gender}</p>
            )}
          </div>
          <div>
            <p className="text-gray-500">Doğum Tarihi:</p>
            {isEdit ? (
              <input
                type="date"
                value={userData.dob}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, dob: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="text-gray-700">{userData.dob}</p>
            )}
          </div>
        </div>
      </div>

      {/* Edit / Save Button */}
      <div className="flex justify-end">
        {isEdit ? (
          <button
            onClick={updateUserProfileData}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Bilgileri Kaydet
          </button>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Düzenle
          </button>
        )}
      </div>
    </div>
  )
}
