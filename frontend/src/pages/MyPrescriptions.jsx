import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

export default function MyPrescriptions() {
  const { backendUrl, token } = useContext(AppContext);
  const [prescriptions, setPrescriptions] = useState([]);

  const loadPrescriptions = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/patient/prescriptions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setPrescriptions(data.prescriptions);
      else toast.error(data.message || "Receteler alinamadi");
    } catch (error) {
      console.log(error);
      toast.error("Receteler alinamadi");
    }
  };

  useEffect(() => {
    if (token) loadPrescriptions();
  }, [token]);

  return (
    <section className="py-10">
      <div className="mb-8">
        <p className="section-eyebrow">Hesabim</p>
        <h1 className="section-title mt-2">Recetelerim</h1>
      </div>

      <div className="grid gap-4">
        {prescriptions.length ? prescriptions.map((item) => (
          <div key={item.prescriptionId || item._id} className="surface-card p-5">
            <div className="grid gap-3 md:grid-cols-[1.2fr_2fr_1fr] md:items-center">
              <div>
                <p className="font-bold text-slate-950">{item.doctorData?.name || "Doktor"}</p>
                <p className="text-sm text-slate-500">{item.appointmentDate || "-"} | {item.appointmentTime || "-"}</p>
              </div>
              <div className="text-sm text-slate-600">
                <p className="font-bold text-slate-950">{item.medicine || "-"}</p>
                <p>Doz: {item.dosage || "-"}</p>
                <p>Talimat: {item.notes || item.instructions || "-"}</p>
              </div>
              <p className="text-sm font-semibold text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
            </div>
          </div>
        )) : (
          <div className="surface-card p-8 text-center text-slate-500">Henuz recete yok.</div>
        )}
      </div>
    </section>
  );
}
