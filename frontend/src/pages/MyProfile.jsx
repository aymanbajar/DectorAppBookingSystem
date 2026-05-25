import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";

const emptyPasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function MyProfile() {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);

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
        toast.error(data.message || "Profil güncellenemedi");
      }
    } catch (error) {
      console.log(error);
      toast.error("Bir hata oluştu");
    }
  };

  const updatePassword = async (event) => {
    event.preventDefault();

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error("Parola alanlarını eksiksiz doldurun");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Yeni parola eşleşmiyor");
      return;
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/change-password`,
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message || "Parola başarıyla güncellendi");
        setPasswordForm(emptyPasswordForm);
      } else {
        toast.error(data.message || "Parola değiştirilemedi");
      }
    } catch (error) {
      console.log(error);
      toast.error("Parola değiştirilemedi");
    }
  };

  const cancelEdit = async () => {
    setIsEdit(false);
    setImage(false);
    await loadUserProfileData();
  };

  return userData && (
    <section className="mx-auto max-w-5xl space-y-6 py-10">
      <div className="surface-card overflow-hidden shadow-xl shadow-slate-900/5">
        <div className="border-b border-slate-200 bg-gradient-to-r from-cyan-50 to-white px-6 py-6 sm:px-8">
          <p className="section-eyebrow">Hesabım</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Profilim</h1>
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[180px_1fr]">
            <div className="flex justify-center lg:justify-start">
              {isEdit ? (
                <label htmlFor="image" className="relative h-36 w-36 cursor-pointer">
                  <img
                    className="h-36 w-36 rounded-3xl border border-slate-200 object-cover opacity-80 shadow-lg shadow-cyan-900/10"
                    src={image ? URL.createObjectURL(image) : userData.image}
                    alt="Profil"
                  />
                  {!image && (
                    <img
                      className="absolute bottom-3 right-3 w-10 rounded-full bg-white p-2 shadow"
                      src={assets.upload_icon}
                      alt=""
                    />
                  )}
                  <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                </label>
              ) : (
                <img
                  src={userData.image}
                  alt="Profil"
                  className="h-36 w-36 rounded-3xl border border-cyan-100 object-cover shadow-lg shadow-cyan-900/10"
                />
              )}
            </div>

            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <ProfileField label="Ad Soyad">
                  {isEdit ? (
                    <input
                      type="text"
                      value={userData.name || ""}
                      onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
                      className="form-input"
                    />
                  ) : (
                    <p className="text-xl font-bold text-slate-950">{userData.name}</p>
                  )}
                </ProfileField>

                <ProfileField label="E-posta">
                  <p className="font-semibold text-slate-800">{userData.email}</p>
                </ProfileField>

                <ProfileField label="Telefon">
                  {isEdit ? (
                    <input
                      type="text"
                      value={userData.phone || ""}
                      onChange={(e) => setUserData((prev) => ({ ...prev, phone: e.target.value }))}
                      className="form-input"
                    />
                  ) : (
                    <p className="font-semibold text-slate-800">{userData.phone || "-"}</p>
                  )}
                </ProfileField>

                <ProfileField label="Cinsiyet">
                  {isEdit ? (
                    <select
                      value={userData.gender || "Erkek"}
                      onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))}
                      className="form-input"
                    >
                      <option value="Erkek">Erkek</option>
                      <option value="Kadın">Kadın</option>
                    </select>
                  ) : (
                    <p className="font-semibold text-slate-800">{userData.gender || "-"}</p>
                  )}
                </ProfileField>

                <ProfileField label="Adres">
                  {isEdit ? (
                    <div className="grid gap-3">
                      <input
                        type="text"
                        value={userData.address?.line1 || ""}
                        onChange={(e) => setUserData((prev) => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                        className="form-input"
                        placeholder="Adres satırı 1"
                      />
                      <input
                        type="text"
                        value={userData.address?.line2 || ""}
                        onChange={(e) => setUserData((prev) => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                        className="form-input"
                        placeholder="Adres satırı 2"
                      />
                    </div>
                  ) : (
                    <p className="font-semibold text-slate-800">
                      {[userData.address?.line1, userData.address?.line2].filter(Boolean).join(" ") || "-"}
                    </p>
                  )}
                </ProfileField>

                <ProfileField label="Doğum Tarihi">
                  {isEdit ? (
                    <input
                      type="date"
                      value={userData.dob || ""}
                      onChange={(e) => setUserData((prev) => ({ ...prev, dob: e.target.value }))}
                      className="form-input"
                    />
                  ) : (
                    <p className="font-semibold text-slate-800">{userData.dob || "-"}</p>
                  )}
                </ProfileField>
                   <ProfileField label="Şifre Değiştir" >
                  <input
            type="password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
            className="form-input"
            placeholder="Mevcut parola"
          />
          <input
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
            className="form-input"
            placeholder="Yeni parola"
          />
          <input
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
            className="form-input"
            placeholder="Yeni parolayı tekrar yazın"
          />
          </ProfileField>
              </div>

              <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-6">
                {isEdit ? (
                  <>
                    <button onClick={cancelEdit} className="btn-secondary">Vazgeç</button>
                    <button onClick={updateUserProfileData} className="btn-primary">Bilgileri Kaydet</button>
                  </>
                ) : (
                  <button onClick={() => setIsEdit(true)} className="btn-secondary">Düzenle</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

     
    </section>
  );
}

function ProfileField({ label, children }) {
  return (
    <label className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <span className="mb-2 block text-sm font-semibold text-slate-500">{label}</span>
      {children}
    </label>
  );
}
