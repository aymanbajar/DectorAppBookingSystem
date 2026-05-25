import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";

export default function MyProfile() {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("dob", userData.dob);
      formData.append("gender", userData.gender);
      image && formData.append("image", image);

      const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success("Profil başarıyla güncellendi");
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error("Profil güncellenemedi");
      }
    } catch (error) {
      console.log(error);
      toast.error("Bir hata oluştu");
    }
  };

  return userData && (
    <section className="mx-auto max-w-4xl py-10">
      <div className="surface-card p-6 sm:p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          {isEdit ? (
            <label htmlFor="image" className="relative cursor-pointer">
              <img className="h-36 w-36 rounded-2xl border border-slate-200 object-cover opacity-80" src={image ? URL.createObjectURL(image) : userData.image} alt="Profil" />
              {!image && <img className="absolute bottom-3 right-3 w-9 rounded-full bg-white p-2 shadow" src={assets.upload_icon} alt="" />}
              <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
            </label>
          ) : (
            <img src={userData.image} alt="Profil" className="h-32 w-32 rounded-2xl border border-cyan-100 object-cover shadow-lg shadow-cyan-900/10" />
          )}

          <div className="flex-1 text-center sm:text-left">
            {isEdit ? (
              <input type="text" value={userData.name} onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))} className="form-input text-lg font-bold" />
            ) : (
              <h1 className="text-3xl font-bold text-slate-950">{userData.name}</h1>
            )}
            <p className="mt-2 text-slate-500">{userData.email}</p>
          </div>
        </div>

        <div className="my-8 h-px bg-slate-200" />

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-lg font-bold text-slate-950">İletişim Bilgileri</h2>
            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-500">Telefon</span>
                {isEdit ? <input type="text" value={userData.phone} onChange={(e) => setUserData((prev) => ({ ...prev, phone: e.target.value }))} className="form-input" /> : <p className="font-semibold text-slate-800">{userData.phone}</p>}
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-500">Adres</span>
                {isEdit ? (
                  <div className="space-y-2">
                    <input type="text" value={userData.address?.line1 || ""} onChange={(e) => setUserData((prev) => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} className="form-input" />
                    <input type="text" value={userData.address?.line2 || ""} onChange={(e) => setUserData((prev) => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} className="form-input" />
                  </div>
                ) : (
                  <p className="font-semibold text-slate-800">{userData.address?.line1} {userData.address?.line2}</p>
                )}
              </label>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-bold text-slate-950">Temel Bilgiler</h2>
            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-500">Cinsiyet</span>
                {isEdit ? (
                  <select value={userData.gender} onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))} className="form-input">
                    <option value="Erkek">Erkek</option>
                    <option value="Kadın">Kadın</option>
                  </select>
                ) : (
                  <p className="font-semibold text-slate-800">{userData.gender}</p>
                )}
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-500">Doğum Tarihi</span>
                {isEdit ? <input type="date" value={userData.dob} onChange={(e) => setUserData((prev) => ({ ...prev, dob: e.target.value }))} className="form-input" /> : <p className="font-semibold text-slate-800">{userData.dob}</p>}
              </label>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          {isEdit ? <button onClick={updateUserProfileData} className="btn-primary">Bilgileri Kaydet</button> : <button onClick={() => setIsEdit(true)} className="btn-secondary">Düzenle</button>}
        </div>
      </div>
    </section>
  );
}
