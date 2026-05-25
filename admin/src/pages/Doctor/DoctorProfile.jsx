import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { DoctorContext } from "../../context/DoctorContext.jsx";
import { AppContext } from "../../context/AppContext.jsx";

export default function DoctorProfile() {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } = useContext(DoctorContext);
  const { currency } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);

  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        isAvailable: profileData.isAvailable,
      };
      const { data } = await axios.post(`${backendUrl}/api/doctor/update-profile`, updateData, {
        headers: { Authorization: `Bearer ${dToken}` },
      });
      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error("Profil güncellenemedi");
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    if (dToken) getProfileData();
  }, [dToken]);

  return profileData && (
    <section className="admin-page">
      <h1 className="admin-title">Doktor Profili</h1>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="admin-card overflow-hidden">
          <img className="w-full bg-cyan-50 object-cover" src={profileData.image} alt={profileData.name} />
        </div>
        <div className="admin-card p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-950">{profileData.name}</h2>
              <p className="mt-2 text-slate-600">{profileData.degree} - {profileData.speciality}</p>
              <span className="status-pill mt-3 bg-cyan-50 text-cyan-700">{profileData.experience}</span>
            </div>
            <label className="flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
              <input
                onChange={() => isEdit && setProfileData((prev) => ({ ...prev, isAvailable: !prev.isAvailable }))}
                checked={profileData.isAvailable}
                type="checkbox"
                className="h-4 w-4 accent-cyan-700"
                readOnly
              />
              Müsait
            </label>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <p className="font-bold text-slate-950">Hakkında</p>
              <p className="mt-2 leading-7 text-slate-600">{profileData.about}</p>
            </div>
            <div>
              <p className="font-bold text-slate-950">Randevu Ücreti</p>
              {isEdit ? (
                <input type="number" onChange={(e) => setProfileData((prev) => ({ ...prev, fees: e.target.value }))} value={profileData.fees} className="admin-input mt-2 max-w-xs" />
              ) : (
                <p className="mt-2 text-lg font-bold text-slate-800">{currency} {profileData.fees}</p>
              )}
            </div>
            <div>
              <p className="font-bold text-slate-950">Adres</p>
              {isEdit ? (
                <div className="mt-2 grid gap-2">
                  <input type="text" onChange={(e) => setProfileData((prev) => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={profileData.address.line1} className="admin-input" />
                  <input type="text" onChange={(e) => setProfileData((prev) => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={profileData.address.line2} className="admin-input" />
                </div>
              ) : (
                <p className="mt-2 text-slate-600">{profileData.address.line1}<br />{profileData.address.line2}</p>
              )}
            </div>
          </div>

          <button onClick={isEdit ? updateProfile : () => setIsEdit(true)} className="admin-button mt-6">
            {isEdit ? "Kaydet" : "Güncelle"}
          </button>
        </div>
      </div>
    </section>
  );
}
