import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

export default function MedicalRecord() {
  const { userData, token, backendUrl, loadUserProfileData } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [medicalRecord, setMedicalRecord] = useState(userData?.medicalRecord || {});

  useEffect(() => {
    if (userData?.medicalRecord) setMedicalRecord(userData.medicalRecord);
  }, [userData]);

  const changeMedical = (field, value) => {
    setMedicalRecord((prev) => ({ ...prev, [field]: value }));
  };

  const updateMedicalRecord = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/update-medical-record`, medicalRecord, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success("Sağlık bilgileri güncellendi");
        await loadUserProfileData();
        setIsEdit(false);
      } else {
        toast.error("Sağlık bilgileri güncellenemedi");
      }
    } catch (error) {
      console.log(error);
      toast.error("Sağlık bilgileri güncellenemedi");
    }
  };

  return userData && (
    <section className="mx-auto max-w-4xl py-10">
      <div className="surface-card p-6 sm:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="section-eyebrow">Sağlık kaydı</p>
            <h1 className="section-title mt-2">Tıbbi Bilgilerim</h1>
            <p className="section-copy mt-3">
              Doktorlar randevu sırasında bu bilgileri görerek daha doğru değerlendirme yapabilir.
            </p>
          </div>
          <button onClick={() => setIsEdit((prev) => !prev)} className="btn-secondary">
            {isEdit ? "Vazgeç" : "Düzenle"}
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["bloodType", "Kan Grubu"],
            ["allergies", "Alerjiler"],
            ["medications", "Kullanılan İlaçlar"],
            ["chronicDiseases", "Kronik Hastalıklar"],
          ].map(([field, label]) => (
            <label key={field} className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-500">{label}</span>
              {isEdit ? (
                <input value={medicalRecord?.[field] || ""} onChange={(e) => changeMedical(field, e.target.value)} className="form-input" />
              ) : (
                <p className="rounded-xl bg-slate-50 px-4 py-3 font-semibold text-slate-800">{userData.medicalRecord?.[field] || "Belirtilmedi"}</p>
              )}
            </label>
          ))}

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-slate-500">Ek Notlar</span>
            {isEdit ? (
              <textarea value={medicalRecord?.notes || ""} onChange={(e) => changeMedical("notes", e.target.value)} className="form-input min-h-32" />
            ) : (
              <p className="rounded-xl bg-slate-50 px-4 py-3 font-semibold text-slate-800">{userData.medicalRecord?.notes || "Belirtilmedi"}</p>
            )}
          </label>
        </div>

        {isEdit && <button onClick={updateMedicalRecord} className="btn-primary mt-6">Sağlık Bilgilerini Kaydet</button>}
      </div>
    </section>
  );
}
