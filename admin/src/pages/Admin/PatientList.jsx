import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";

const emptyRecord = {
  bloodType: "",
  allergies: "",
  medications: "",
  chronicDiseases: "",
  notes: "",
};

export default function PatientList() {
  const { aToken, patients, getAllPatients, deletePatient, updatePatient } = useContext(AdminContext);
  const [editingPatient, setEditingPatient] = useState(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (aToken) getAllPatients();
  }, [aToken]);

  const openEditor = (patient) => {
    setEditingPatient({
      ...patient,
      password: "",
      address: {
        line1: patient.address?.line1 || "",
        line2: patient.address?.line2 || "",
      },
      medicalRecord: {
        ...emptyRecord,
        ...(patient.medicalRecord || {}),
      },
    });
  };

  const savePatient = async (event) => {
    event.preventDefault();
    const payload = {
      name: editingPatient.name,
      email: editingPatient.email,
      phone: editingPatient.phone,
      gender: editingPatient.gender,
      dob: editingPatient.dob,
      address: editingPatient.address,
      medicalRecord: editingPatient.medicalRecord,
    };
    if (editingPatient.password) payload.password = editingPatient.password;
    const ok = await updatePatient(editingPatient._id, payload);
    if (ok) setEditingPatient(null);
  };

  const setPatientStatus = async (userId, disabled) => {
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/patient-status/${userId}`, { disabled }, { headers: { Authorization: `Bearer ${aToken}` } });
    getAllPatients();
  };

  const filteredPatients = useMemo(() => {
    const search = query.trim().toLocaleLowerCase("tr-TR");
    return patients
      .filter((patient) => !search || [patient.name, patient.email, patient.phone].filter(Boolean).some((field) => String(field).toLocaleLowerCase("tr-TR").includes(search)))
      .filter((patient) => filter === "all" ? true : filter === "disabled" ? patient.disabled : !patient.disabled);
  }, [filter, patients, query]);

  return (
    <section className="admin-page">
      <h1 className="admin-title">Hastalar</h1>
      <div className="mb-5 grid gap-3 md:grid-cols-[1fr_220px]">
        <input className="admin-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Hasta, e-posta veya telefon ara" />
        <select className="admin-input" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Tümü</option>
          <option value="active">Aktif</option>
          <option value="disabled">Devre dışı</option>
        </select>
      </div>
      <div className="admin-card overflow-hidden">
        <div className="hidden grid-cols-[minmax(0,1.4fr)_minmax(0,1.5fr)_minmax(0,1fr)_minmax(150px,170px)] gap-4 border-b border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-600 md:grid">
          <span>Hasta</span>
          <span>İletişim</span>
          <span>Sağlık Kaydı</span>
          <span>İşlem</span>
        </div>
        {filteredPatients.length ? filteredPatients.map((patient) => (
          <div key={patient._id} className="grid gap-4 border-b border-slate-100 p-4 text-sm md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.5fr)_minmax(0,1fr)_minmax(150px,170px)] md:items-center">
            <div className="flex min-w-0 items-center gap-3">
              <img className="h-12 w-12 shrink-0 rounded-full object-cover" src={patient.image} alt={patient.name} />
              <div className="min-w-0">
                <p className="truncate font-bold text-slate-950">{patient.name}</p>
                <p className="text-slate-500">{patient.gender || "Belirtilmedi"} • {patient.dob || "Doğum tarihi yok"}</p>
                {patient.disabled && <span className="mt-1 inline-block rounded-full bg-red-50 px-2 py-1 text-xs font-bold text-red-600">Devre dışı</span>}
              </div>
            </div>
            <div className="min-w-0 text-slate-600">
              <p className="truncate">{patient.email}</p>
              <p className="truncate">{patient.phone || "Telefon yok"}</p>
            </div>
            <div className="min-w-0 text-slate-600">
              <p>Kan: {patient.medicalRecord?.bloodType || "-"}</p>
              <p className="truncate">Alerji: {patient.medicalRecord?.allergies || "-"}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => openEditor(patient)} className="admin-button flex-1 bg-cyan-700 px-3 py-2 text-sm">Düzenle</button>
              <button onClick={() => deletePatient(patient._id)} className="admin-button flex-1 bg-red-600 px-3 py-2 text-sm">Sil</button>
              <button onClick={() => setPatientStatus(patient._id, !patient.disabled)} className="w-full rounded-full bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700">{patient.disabled ? "Aktifleştir" : "Devre dışı bırak"}</button>
            </div>
          </div>
        )) : (
          <p className="p-6 text-center text-slate-500">Henüz hasta yok.</p>
        )}
      </div>

      {editingPatient && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
          <form onSubmit={savePatient} className="admin-card max-h-[90vh] w-full max-w-5xl overflow-y-auto p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-slate-950">Hasta Bilgilerini Düzenle</h2>
              <button type="button" onClick={() => setEditingPatient(null)} className="rounded-full border border-slate-200 px-4 py-2 font-bold text-slate-600">Kapat</button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input className="admin-input" value={editingPatient.name || ""} onChange={(e) => setEditingPatient((prev) => ({ ...prev, name: e.target.value }))} placeholder="Ad Soyad" />
              <input className="admin-input" value={editingPatient.email || ""} onChange={(e) => setEditingPatient((prev) => ({ ...prev, email: e.target.value }))} placeholder="E-posta" />
              <input className="admin-input" value={editingPatient.phone || ""} onChange={(e) => setEditingPatient((prev) => ({ ...prev, phone: e.target.value }))} placeholder="Telefon" />
              <input className="admin-input" type="password" value={editingPatient.password} onChange={(e) => setEditingPatient((prev) => ({ ...prev, password: e.target.value }))} placeholder="Yeni parola (isteğe bağlı)" />
              <select className="admin-input" value={editingPatient.gender || "Belirtilmedi"} onChange={(e) => setEditingPatient((prev) => ({ ...prev, gender: e.target.value }))}>
                <option>Belirtilmedi</option>
                <option>Erkek</option>
                <option>Kadın</option>
              </select>
              <input className="admin-input" type="date" value={editingPatient.dob || ""} onChange={(e) => setEditingPatient((prev) => ({ ...prev, dob: e.target.value }))} />
              <input className="admin-input" value={editingPatient.address.line1} onChange={(e) => setEditingPatient((prev) => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} placeholder="Adres satırı 1" />
              <input className="admin-input" value={editingPatient.address.line2} onChange={(e) => setEditingPatient((prev) => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} placeholder="Adres satırı 2" />
            </div>

            <h3 className="mt-6 text-lg font-bold text-slate-950">Sağlık Kaydı</h3>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <input className="admin-input" value={editingPatient.medicalRecord.bloodType} onChange={(e) => setMedicalRecord(setEditingPatient, "bloodType", e.target.value)} placeholder="Kan grubu" />
              <input className="admin-input" value={editingPatient.medicalRecord.allergies} onChange={(e) => setMedicalRecord(setEditingPatient, "allergies", e.target.value)} placeholder="Alerjiler" />
              <input className="admin-input" value={editingPatient.medicalRecord.medications} onChange={(e) => setMedicalRecord(setEditingPatient, "medications", e.target.value)} placeholder="İlaçlar" />
              <input className="admin-input" value={editingPatient.medicalRecord.chronicDiseases} onChange={(e) => setMedicalRecord(setEditingPatient, "chronicDiseases", e.target.value)} placeholder="Kronik hastalıklar" />
              <textarea className="admin-input md:col-span-2" rows="3" value={editingPatient.medicalRecord.notes} onChange={(e) => setMedicalRecord(setEditingPatient, "notes", e.target.value)} placeholder="Notlar" />
            </div>

            <button className="admin-button mt-5 px-8">Kaydet</button>
          </form>
        </div>
      )}
    </section>
  );
}

function setMedicalRecord(setEditingPatient, field, value) {
  setEditingPatient((prev) => ({
    ...prev,
    medicalRecord: { ...prev.medicalRecord, [field]: value },
  }));
}

