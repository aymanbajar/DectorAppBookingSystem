import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DoctorContext } from "../../context/DoctorContext";

export default function DoctorPrescriptions() {
  const { backendUrl, dToken } = useContext(DoctorContext);
  const [prescriptions, setPrescriptions] = useState([]);

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

  return (
    <section className="admin-page">
      <h1 className="admin-title">Receteler</h1>
      <div className="grid gap-4">
        {prescriptions.length ? prescriptions.map((item) => (
          <div key={item.prescriptionId || item._id} className="admin-card p-5">
            <div className="grid gap-4 lg:grid-cols-[1.4fr_2fr_1.2fr] lg:items-center">
              <div className="flex items-center gap-3">
                <img className="h-12 w-12 rounded-full object-cover" src={item.patientData?.image} alt="" />
                <div>
                  <p className="font-bold text-slate-950">{item.patientData?.name || "Hasta"}</p>
                  <p className="text-sm text-slate-500">{item.appointmentDate || "-"} | {item.appointmentTime || "-"}</p>
                </div>
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
          <div className="admin-card p-8 text-center text-slate-500">Henuz recete yok.</div>
        )}
      </div>
    </section>
  );
}
