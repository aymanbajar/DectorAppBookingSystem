import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { DoctorContext } from "../../context/DoctorContext.jsx";
import { AppContext } from "../../context/AppContext.jsx";

const specialities = ["Pratisyen Hekim", "Dermatoloji", "Nöroloji", "Kardiyoloji", "Kadın Doğum Uzmanı", "Psikiyatri", "Çocuk Doktoru", "Üroloji"];
const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const defaultSchedule = days.map((day) => ({ day, enabled: false, start: "09:00", end: "17:00" }));
const emptyTemplate = { name: "", medicine: "", dosage: "", duration: "", notes: "" };

export default function DoctorProfile() {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } = useContext(DoctorContext);
  const { currency } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [password, setPassword] = useState("");
  const [blockedDay, setBlockedDay] = useState("");
  const [template, setTemplate] = useState(emptyTemplate);
  const [image, setImage] = useState(null);

  const schedule = profileData?.workSchedule?.length ? profileData.workSchedule : defaultSchedule;

  const updateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("name", profileData.name);
      formData.append("email", profileData.email);
      formData.append("speciality", profileData.speciality);
      formData.append("degree", profileData.degree);
      formData.append("experience", profileData.experience);
      formData.append("about", profileData.about);
      formData.append("fees", profileData.fees);
      formData.append("available", profileData.available);
      formData.append("address", JSON.stringify(profileData.address || {}));
      formData.append("workSchedule", JSON.stringify(schedule));
      formData.append("blockedDays", JSON.stringify(profileData.blockedDays || []));
      formData.append("prescriptionTemplates", JSON.stringify(profileData.prescriptionTemplates || []));
      if (password) formData.append("password", password);
      if (image) formData.append("image", image);

      const { data } = await axios.post(`${backendUrl}/api/doctor/update-profile`, formData, {
        headers: { Authorization: `Bearer ${dToken}` },
      });
      if (data.success) {
        toast.success(data.message);
        setPassword("");
        setImage(null);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message || "Profil güncellenemedi");
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const updateSchedule = (day, field, value) => {
    setProfileData((prev) => {
      const currentSchedule = prev.workSchedule?.length ? prev.workSchedule : defaultSchedule;
      return { ...prev, workSchedule: currentSchedule.map((item) => item.day === day ? { ...item, [field]: value } : item) };
    });
  };

  const addBlockedDay = () => {
    if (!blockedDay) return;
    setProfileData((prev) => ({ ...prev, blockedDays: Array.from(new Set([...(prev.blockedDays || []), blockedDay])) }));
    setBlockedDay("");
  };

  const addTemplate = () => {
    if (!template.medicine || !template.dosage || !template.duration) return;
    setProfileData((prev) => ({ ...prev, prescriptionTemplates: [...(prev.prescriptionTemplates || []), template] }));
    setTemplate(emptyTemplate);
  };

  useEffect(() => {
    if (dToken) getProfileData();
  }, [dToken]);

  return profileData && (
    <section className="admin-page max-w-full overflow-hidden">
      <h1 className="admin-title">Doktor Profili</h1>
      <div className="grid min-w-0 gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
        <div className="admin-card h-fit overflow-hidden p-5">
          <label className={`${isEdit ? "cursor-pointer" : ""} block`}>
            <img className="mx-auto h-56 w-56 rounded-3xl bg-cyan-50 object-cover shadow-lg shadow-slate-900/10" src={image ? URL.createObjectURL(image) : profileData.image} alt={profileData.name} />
            {isEdit && <input type="file" hidden accept="image/*" onChange={(e) => setImage(e.target.files[0])} />}
          </label>
          <p className="mt-4 text-center text-sm font-semibold text-slate-500">{isEdit ? "Fotoğrafı değiştirmek için görsele tıklayın" : profileData.email}</p>
        </div>

        <div className="admin-card min-w-0 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              {isEdit ? (
                <div className="grid gap-3 md:grid-cols-2">
                  <input className="admin-input" value={profileData.name} onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))} placeholder="Ad Soyad" />
                  <input className="admin-input" value={profileData.email} onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))} placeholder="E-posta" />
                  <select className="admin-input" value={profileData.speciality} onChange={(e) => setProfileData((prev) => ({ ...prev, speciality: e.target.value }))}>{specialities.map((item) => <option key={item}>{item}</option>)}</select>
                  <input className="admin-input" value={profileData.degree} onChange={(e) => setProfileData((prev) => ({ ...prev, degree: e.target.value }))} placeholder="Derece" />
                  <input className="admin-input" value={profileData.experience} onChange={(e) => setProfileData((prev) => ({ ...prev, experience: e.target.value }))} placeholder="Deneyim" />
                  <input className="admin-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Yeni parola (isteğe bağlı)" />
                </div>
              ) : (
                <>
                  <h2 className="break-words text-3xl font-bold text-slate-950">{profileData.name}</h2>
                  <p className="mt-2 text-slate-600">{profileData.degree} - {profileData.speciality}</p>
                  <span className="status-pill mt-3 bg-cyan-50 text-cyan-700">{profileData.experience}</span>
                </>
              )}
            </div>
            <label className="flex shrink-0 items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
              <input onChange={(e) => isEdit && setProfileData((prev) => ({ ...prev, available: e.target.checked }))} checked={Boolean(profileData.available)} type="checkbox" className="h-4 w-4 accent-cyan-700" readOnly={!isEdit} />
              Müsait
            </label>
          </div>

          <div className="mt-6 grid min-w-0 gap-6">
            <Panel title="Hakkında">
              {isEdit ? <textarea value={profileData.about} onChange={(e) => setProfileData((prev) => ({ ...prev, about: e.target.value }))} className="admin-input" rows="4" /> : <p className="leading-7 text-slate-600">{profileData.about}</p>}
            </Panel>

            <div className="grid gap-6 lg:grid-cols-2">
              <Panel title="Randevu Ücreti">
                {isEdit ? <input type="number" onChange={(e) => setProfileData((prev) => ({ ...prev, fees: e.target.value }))} value={profileData.fees} className="admin-input" /> : <p className="text-lg font-bold text-slate-800">{currency} {profileData.fees}</p>}
              </Panel>
              <Panel title="Adres">
                {isEdit ? (
                  <div className="grid gap-2">
                    <input type="text" onChange={(e) => setProfileData((prev) => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={profileData.address?.line1 || ""} className="admin-input" />
                    <input type="text" onChange={(e) => setProfileData((prev) => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={profileData.address?.line2 || ""} className="admin-input" />
                  </div>
                ) : <p className="text-slate-600">{profileData.address?.line1}<br />{profileData.address?.line2}</p>}
              </Panel>
            </div>

            <Panel title="Çalışma Saatleri">
              <div className="grid gap-3">
                {schedule.map((item) => (
                  <div key={item.day} className="grid gap-3 rounded-xl bg-slate-50 p-3 lg:grid-cols-[1fr_120px_120px_100px] lg:items-center">
                    <label className="flex items-center gap-2 font-semibold text-slate-700"><input type="checkbox" disabled={!isEdit} checked={Boolean(item.enabled)} onChange={(e) => updateSchedule(item.day, "enabled", e.target.checked)} className="h-4 w-4 accent-cyan-700" />{item.day}</label>
                    <input disabled={!isEdit} type="time" value={item.start} onChange={(e) => updateSchedule(item.day, "start", e.target.value)} className="admin-input" />
                    <input disabled={!isEdit} type="time" value={item.end} onChange={(e) => updateSchedule(item.day, "end", e.target.value)} className="admin-input" />
                    <span className={`status-pill w-fit ${item.enabled ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{item.enabled ? "Açık" : "Kapalı"}</span>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Kapalı Günler">
              {isEdit && <div className="flex flex-wrap gap-3"><input type="date" value={blockedDay} onChange={(e) => setBlockedDay(e.target.value)} className="admin-input max-w-xs" /><button type="button" onClick={addBlockedDay} className="admin-button px-5">Ekle</button></div>}
              <div className="mt-3 flex flex-wrap gap-2">
                {(profileData.blockedDays || []).length ? profileData.blockedDays.map((day) => <span key={day} className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-600">{day}{isEdit && <button onClick={() => setProfileData((prev) => ({ ...prev, blockedDays: prev.blockedDays.filter((item) => item !== day) }))}>x</button>}</span>) : <span className="text-sm text-slate-500">Kapalı gün yok.</span>}
              </div>
            </Panel>

            <Panel title="Hazır Reçete Şablonları">
              {isEdit && <div className="grid gap-3 md:grid-cols-2"><input className="admin-input" value={template.name} onChange={(e) => setTemplate((prev) => ({ ...prev, name: e.target.value }))} placeholder="Şablon adı" /><input className="admin-input" value={template.medicine} onChange={(e) => setTemplate((prev) => ({ ...prev, medicine: e.target.value }))} placeholder="İlaç adı" /><input className="admin-input" value={template.dosage} onChange={(e) => setTemplate((prev) => ({ ...prev, dosage: e.target.value }))} placeholder="Doz" /><input className="admin-input" value={template.duration} onChange={(e) => setTemplate((prev) => ({ ...prev, duration: e.target.value }))} placeholder="Süre" /><textarea className="admin-input md:col-span-2" value={template.notes} onChange={(e) => setTemplate((prev) => ({ ...prev, notes: e.target.value }))} placeholder="Notlar" /><button type="button" onClick={addTemplate} className="admin-button w-fit px-5">Şablon Ekle</button></div>}
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {(profileData.prescriptionTemplates || []).length ? profileData.prescriptionTemplates.map((item, index) => <div key={`${item.medicine}-${index}`} className="rounded-xl bg-slate-50 p-3"><div className="flex items-start justify-between gap-3"><div><p className="font-bold text-slate-950">{item.name || item.medicine}</p><p className="text-sm text-slate-600">{item.medicine} - {item.dosage} - {item.duration}</p></div>{isEdit && <button type="button" onClick={() => setProfileData((prev) => ({ ...prev, prescriptionTemplates: prev.prescriptionTemplates.filter((_, itemIndex) => itemIndex !== index) }))} className="text-sm font-bold text-red-600">Sil</button>}</div></div>) : <span className="text-sm text-slate-500">Şablon yok.</span>}
              </div>
            </Panel>
          </div>

          <div className="mt-6 flex flex-wrap justify-end gap-3">
            {isEdit && <button onClick={() => { setIsEdit(false); setImage(null); getProfileData(); }} className="rounded-full border border-slate-200 px-6 py-3 font-bold text-slate-600">Vazgeç</button>}
            <button onClick={isEdit ? updateProfile : () => setIsEdit(true)} className="admin-button px-7">{isEdit ? "Kaydet" : "Güncelle"}</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Panel({ title, children }) {
  return <div className="min-w-0 rounded-2xl border border-slate-200 p-4"><p className="mb-3 font-bold text-slate-950">{title}</p>{children}</div>;
}
