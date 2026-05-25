import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";

const specialities = ["Pratisyen Hekim", "Dermatoloji", "Nöroloji", "Kardiyoloji", "Kadın Doğum Uzmanı", "Psikiyatri", "Çocuk Doktoru", "Üroloji"];

export default function DoctorList() {
  const { doctors, getAllDoctors, aToken, changeAvailability, updateDoctor, deleteDoctor } = useContext(AdminContext);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (aToken) getAllDoctors();
  }, [aToken]);

  const openEditor = (doctor) => {
    setEditingDoctor({
      ...doctor,
      password: "",
      address: {
        line1: doctor.address?.line1 || "",
        line2: doctor.address?.line2 || "",
      },
    });
  };

  const saveDoctor = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    ["name", "email", "speciality", "degree", "experience", "about", "fees", "available"].forEach((field) => {
      formData.append(field, editingDoctor[field]);
    });
    if (editingDoctor.password) formData.append("password", editingDoctor.password);
    formData.append("address", JSON.stringify(editingDoctor.address));
    const ok = await updateDoctor(editingDoctor._id, formData);
    if (ok) setEditingDoctor(null);
  };

  const setDoctorStatus = async (docId, payload) => {
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/doctor-status/${docId}`, payload, { headers: { Authorization: `Bearer ${aToken}` } });
    getAllDoctors();
  };

  const filteredDoctors = useMemo(() => {
    const search = query.trim().toLocaleLowerCase("tr-TR");
    return doctors
      .filter((doctor) => !search || [doctor.name, doctor.email, doctor.speciality].filter(Boolean).some((field) => String(field).toLocaleLowerCase("tr-TR").includes(search)))
      .filter((doctor) => {
        if (filter === "all") return true;
        if (filter === "pending") return !doctor.approved;
        if (filter === "disabled") return doctor.disabled;
        if (filter === "active") return doctor.approved && !doctor.disabled;
        return doctor.speciality === filter;
      });
  }, [doctors, filter, query]);

  return (
    <section className="admin-page">
      <h1 className="admin-title">Doktor Listesi</h1>
      <div className="mb-5 grid gap-3 md:grid-cols-[1fr_220px]">
        <input className="admin-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Doktor, e-posta veya uzmanlık ara" />
        <select className="admin-input" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Tümü</option>
          <option value="active">Aktif</option>
          <option value="pending">Onay bekleyen</option>
          <option value="disabled">Devre dışı</option>
          {[...new Set(doctors.map((item) => item.speciality).filter(Boolean))].map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredDoctors.map((item) => (
          <div className="admin-card overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-900/10" key={item._id}>
            <div className="bg-gradient-to-b from-cyan-50 to-slate-50">
              <img className="aspect-[4/3] w-full object-contain p-3" src={item.image} alt={item.name} />
            </div>
            <div className="p-4">
              <p className="text-lg font-bold text-slate-950">{item.name}</p>
              <p className="text-sm text-slate-500">{item.speciality}</p>
              <p className="mt-1 text-sm font-semibold text-slate-700">{item.email}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
                <span className={`rounded-full px-3 py-1 ${item.approved ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{item.approved ? "Onaylı" : "Bekliyor"}</span>
                {item.disabled && <span className="rounded-full bg-red-50 px-3 py-1 text-red-600">Devre dışı</span>}
              </div>
              <label className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input onChange={() => changeAvailability(item._id)} type="checkbox" checked={item.available} className="h-4 w-4 accent-cyan-700" readOnly />
                Müsait
              </label>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button onClick={() => openEditor(item)} className="admin-button bg-cyan-700 py-2 text-sm">Düzenle</button>
                <button onClick={() => deleteDoctor(item._id)} className="admin-button bg-red-600 py-2 text-sm">Sil</button>
                <button onClick={() => setDoctorStatus(item._id, { approved: !item.approved })} className="rounded-full bg-amber-50 px-3 py-2 text-sm font-bold text-amber-700">{item.approved ? "Onayı kaldır" : "Onayla"}</button>
                <button onClick={() => setDoctorStatus(item._id, { disabled: !item.disabled })} className="rounded-full bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700">{item.disabled ? "Aktifleştir" : "Devre dışı"}</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingDoctor && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
          <form onSubmit={saveDoctor} className="admin-card max-h-[90vh] w-full max-w-4xl overflow-y-auto p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-slate-950">Doktor Bilgilerini Düzenle</h2>
              <button type="button" onClick={() => setEditingDoctor(null)} className="rounded-full border border-slate-200 px-4 py-2 font-bold text-slate-600">Kapat</button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input className="admin-input" value={editingDoctor.name} onChange={(e) => setEditingDoctor((prev) => ({ ...prev, name: e.target.value }))} placeholder="Ad Soyad" />
              <input className="admin-input" value={editingDoctor.email} onChange={(e) => setEditingDoctor((prev) => ({ ...prev, email: e.target.value }))} placeholder="E-posta" />
              <input className="admin-input" type="password" value={editingDoctor.password} onChange={(e) => setEditingDoctor((prev) => ({ ...prev, password: e.target.value }))} placeholder="Yeni parola (isteğe bağlı)" />
              <select className="admin-input" value={editingDoctor.speciality} onChange={(e) => setEditingDoctor((prev) => ({ ...prev, speciality: e.target.value }))}>
                {specialities.map((item) => <option key={item}>{item}</option>)}
              </select>
              <input className="admin-input" value={editingDoctor.degree} onChange={(e) => setEditingDoctor((prev) => ({ ...prev, degree: e.target.value }))} placeholder="Derece" />
              <input className="admin-input" value={editingDoctor.experience} onChange={(e) => setEditingDoctor((prev) => ({ ...prev, experience: e.target.value }))} placeholder="Deneyim" />
              <input className="admin-input" type="number" value={editingDoctor.fees} onChange={(e) => setEditingDoctor((prev) => ({ ...prev, fees: e.target.value }))} placeholder="Ücret" />
              <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700">
                <input type="checkbox" checked={Boolean(editingDoctor.available)} onChange={(e) => setEditingDoctor((prev) => ({ ...prev, available: e.target.checked }))} className="h-4 w-4 accent-cyan-700" />
                Müsait
              </label>
              <input className="admin-input" value={editingDoctor.address.line1} onChange={(e) => setEditingDoctor((prev) => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} placeholder="Adres satırı 1" />
              <input className="admin-input" value={editingDoctor.address.line2} onChange={(e) => setEditingDoctor((prev) => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} placeholder="Adres satırı 2" />
              <textarea className="admin-input md:col-span-2" rows="4" value={editingDoctor.about} onChange={(e) => setEditingDoctor((prev) => ({ ...prev, about: e.target.value }))} placeholder="Hakkında" />
            </div>
            <button className="admin-button mt-5 px-8">Kaydet</button>
          </form>
        </div>
      )}
    </section>
  );
}
