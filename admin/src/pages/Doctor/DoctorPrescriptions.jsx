import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DoctorContext } from "../../context/DoctorContext";

export default function DoctorPrescriptions() {
  const { backendUrl, dToken } = useContext(DoctorContext);
  const [prescriptions, setPrescriptions] = useState([]);
  const [editingId, setEditingId] = useState("");
  const [draft, setDraft] = useState({ medicine: "", dosage: "", duration: "", notes: "", instructions: "" });

  const loadPrescriptions = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/prescriptions`, {
        headers: { Authorization: `Bearer ${dToken}` },
      });
      if (data.success) setPrescriptions(data.prescriptions);
      else toast.error(data.message || "Receteler alinamadi");
    } catch (error) {
      console.log(error);
      toast.error("Receteler alinamadi");
    }
  };

  useEffect(() => {
    if (dToken) loadPrescriptions();
  }, [dToken]);

  const openEditor = (item) => {
    setEditingId(item.prescriptionId || item._id);
    setDraft({
      medicine: item.medicine || "",
      dosage: item.dosage || "",
      duration: item.duration || "",
      notes: item.notes || "",
      instructions: item.instructions || "",
    });
  };

  const savePrescription = async (prescriptionId) => {
    try {
      const { data } = await axios.put(`${backendUrl}/api/doctor/prescriptions/${prescriptionId}`, draft, {
        headers: { Authorization: `Bearer ${dToken}` },
      });
      if (data.success) {
        toast.success(data.message);
        setEditingId("");
        loadPrescriptions();
      } else {
        toast.error(data.message || "Recete guncellenemedi");
      }
    } catch (error) {
      console.log(error);
      toast.error("Recete guncellenemedi");
    }
  };

  return (
    <section className="admin-page">
      <h1 className="admin-title">Receteler</h1>
      <div className="grid gap-4">
        {prescriptions.length ? prescriptions.map((item) => {
          const prescriptionId = item.prescriptionId || item._id;
          const isEditing = editingId === prescriptionId;

          return (
          <div key={prescriptionId} className="admin-card p-5">
            <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr_0.8fr_1.4fr_1.1fr_160px] xl:items-center">
              <div className="flex items-center gap-3">
                <img className="h-12 w-12 rounded-full object-cover" src={item.patientData?.image} alt="" />
                <div>
                  <p className="font-bold text-slate-950">{item.patientData?.name || "Hasta"}</p>
                  <p className="text-sm text-slate-500">{item.appointmentDate || "-"} | {item.appointmentTime || "-"}</p>
                </div>
              </div>
              {isEditing ? (
                <>
                  <input className="admin-input" value={draft.medicine} onChange={(e) => setDraft((prev) => ({ ...prev, medicine: e.target.value }))} placeholder="Recete" />
                  <input className="admin-input" value={draft.dosage} onChange={(e) => setDraft((prev) => ({ ...prev, dosage: e.target.value }))} placeholder="Doz" />
                  <input className="admin-input" value={draft.notes} onChange={(e) => setDraft((prev) => ({ ...prev, notes: e.target.value }))} placeholder="Talimat" />
                </>
              ) : (
                <>
                  <p className="truncate text-sm font-bold text-slate-950">{item.medicine || "-"}</p>
                  <p className="truncate text-sm text-slate-600">Doz: {item.dosage || "-"}</p>
                  <p className="truncate text-sm text-slate-600">Talimat: {item.notes || item.instructions || "-"}</p>
                </>
              )}
              <p className="text-sm font-semibold text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
              <div className="flex flex-wrap justify-end gap-2">
                {isEditing ? (
                  <>
                    <button onClick={() => savePrescription(prescriptionId)} className="admin-button px-5 py-2">Kaydet</button>
                    <button onClick={() => setEditingId("")} className="rounded-full bg-slate-100 px-5 py-2 text-sm font-bold text-slate-700">Vazgec</button>
                  </>
                ) : (
                  <button onClick={() => openEditor(item)} className="rounded-full bg-cyan-50 px-5 py-2 text-sm font-bold text-cyan-700 hover:bg-cyan-100">Duzenle</button>
                )}
              </div>
            </div>
          </div>
        )}) : (
          <div className="admin-card p-8 text-center text-slate-500">Henuz recete yok.</div>
        )}
      </div>
    </section>
  );
}
