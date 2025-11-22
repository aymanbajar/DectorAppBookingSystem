import { assets } from "../../assets/assets";
import { useState } from "react";
import { useContext } from "react";
import {AdminContext} from '../../context/AdminContext';
import {toast} from 'react-toastify';
import axios from 'axios'
export default function AddDoctor() {
    const[docImg,setDocImg]=useState(false);
    const[name,setName]=useState("");
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const[experience, setExperience]=useState("1 yıl");
    const[fees,setFees]=useState("");
    const[speciality,setSpeciality]=useState("Kardiyoloji");
    const[degree,setDegree]=useState("");
    const[address1,setAddress1]=useState("");
    const[address2,setAddress2]=useState("");
    const[about,setAbout]=useState("");
    const{backendUrl,aToken} = useContext(AdminContext);
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try{{}
            if(!docImg){
                return toast.error('resim seçilmedi');

            }
            const formData = new FormData()
            formData.append('name',name);
            formData.append('email',email);
            formData.append('password',password);
            formData.append('speciality',speciality);
            formData.append('degree',degree);
            formData.append('experience',experience);
            formData.append('about',about);
            formData.append('fees',Number(fees));
            formData.append('address',JSON.stringify({line1:address1,line2:address2}));
            formData.append('image',docImg);
            //console.log(...formData);
            formData.forEach((value,key) => {  
                console.log(key,value);
            });
            const{data} = await axios.post(`${backendUrl}/api/admin/add-doctor`,formData,{
                headers:{
                    aToken
                }
            });
            if(data.success){
                toast.success('doktor başarıyla eklendi');
            }else{
                toast.error('doktor eklenmedi')
            }

        }catch(error){

        }
    }
  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent"> Doktor Ekleme Formu</p>
      <div className="bg-white px-8 py-8 border-2 border-gray-200 rounded-xl w-full max-w-4xl max-h[80vh] overflow-y-scroll shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center gap-4 mb-8 text-gray-600">
          <label htmlFor="doc-img" className="group cursor-pointer">
            <img
              className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full cursor-pointer border-2 border-dashed border-indigo-300 p-2 group-hover:border-indigo-500 group-hover:scale-105 transition-all duration-200"
              src={docImg ? URL.createObjectURL(docImg) :assets.upload_area}
              alt=""
            />
          </label>
          <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
          <p className="font-medium">
            Doktorun resmini <br />
            yükleyin
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p className="font-semibold text-gray-700">İsim</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200"
                type="text"
                placeholder="Doktorun ismini girin"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p className="font-semibold text-gray-700">Doktorun e-postası</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200"
                type="text"
                placeholder="Doktorun e-postasını girin"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p className="font-semibold text-gray-700">Doktor Şifresi</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200"
                type="text"
                placeholder="Doktorun şifresini girin"
                required
              />
            </div>
            <div className="w-full lg:flex-1 flex flex-col gap-4">
              <div className="flex-1 flex flex-col gap-1">
                <p className="font-semibold text-gray-700">Deneyim</p>
                <select
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                className="border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 cursor-pointer bg-white" name="" id="">
                  <option value="1 Year">1 yıl</option>
                  <option value="2 Years">2 yıl</option>
                  <option value="3 Years">3 yıl</option>
                  <option value="4 Years">4 yıl</option>
                  <option value="5 Years">5 yıl</option>
                  <option value="6 Years">6 yıl</option>
                  <option value="7 Years">7 yıl</option>
                  <option value="8 Years">8 yıl</option>
                  <option value="9 Years">9 yıl</option>
                  <option value="10 Years">10 yıl</option>
                </select>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p className="font-semibold text-gray-700">Ücret</p>
              <input
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                className="border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200"
                type="number"
                placeholder="Doktorun ücretini girin"
                required
              />
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <p className="font-semibold text-gray-700">Uzmanlık Alanı</p>
            <select
            onChange={(e) => setSpeciality(e.target.value)}
            value={speciality}
            
            className="border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 cursor-pointer bg-white" name="" id="">
              <option value="Cardiology">Kardiyoloji</option>
              <option value="Dermatology">Dermatoloji</option>
              <option value="Neurology">Nöroloji</option>
              <option value="Pediatrics">Pediatri</option>
              <option value="Psychiatry">Psikiyatri</option>
              <option value="Radiology">Radyoloji</option>
              <option value="Surgery">Cerrahi</option>
              <option value="Urology">Üroloji</option>
            </select>

            <div className="flex-1 flex flex-col gap-1">
              <p className="font-semibold text-gray-700">Eğitim Bilgisi</p>
              <input
                onChange={(e) => setDegree(e.target.value)}
                value={degree}
                className="border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200"
                type="text"
                placeholder="Eğitim bilgilerinizi girin"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p className="font-semibold text-gray-700">Adres</p>
              <input
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                className="border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200"
                type="text"
                placeholder="Adres satırı 1"
                required
              />
              <input
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                className="border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200"
                type="text"
                placeholder="Adres satırı 2"
              />
            </div>
          </div>
        </div>
        <div>
          <p className="mt-4 mb-2 font-semibold text-gray-700">Doktor hakkında</p>
          <textarea
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            className="w-full px-4 pt-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200"
            placeholder="Doktor hakkında kısa bilgi girin"
            rows={5}
            required
          />
        </div>
        <button
        type="submit" className="mt-6 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-semibold px-12 py-3.5 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
          Doktoru Ekle
        </button>
      </div>
    </form>
  );
}
