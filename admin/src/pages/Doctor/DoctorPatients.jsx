import axios from "axios";
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { DoctorContext } from "../../context/DoctorContext";

export default function DoctorPatients() {
  const { backendUrl, dToken } = useContext(DoctorContext);
  const [patients, setPatients] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const fetchPatients = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/patients`, {
        headers: { Authorization: `Bearer ${dToken}` },
      });
      data.success ? setPatients(data.patients) : toast.error("Hastalar alınamadı");
    } catch (error) {
      console.log(error);
      toast.error("Hastalar alınamadı");
    }
  };

  useEffect(() => {
    if (dToken) fetchPatients();
  }, [dToken]);

  const filteredPatients = useMemo(() => {
    const search = query.trim().toLocaleLowerCase("tr-TR");
    return patients
      .filter((item) => {
        if (!search) return true;
        return [item.userData?.name, item.userData?.email, item.userData?.phone]
          .filter(Boolean)
          .some((value) => String(value).toLocaleLowerCase("tr-TR").includes(search));
      })
      .filter((item) => {
        if (filter === "all") return true;
        if (filter === "chronic") return Boolean(item.userData?.medicalRecord?.chronicDiseases);
        if (filter === "allergy") return Boolean(item.userData?.medicalRecord?.allergies);
        return item.latestAppointment?.status === filter;
      });
  }, [filter, patients, query]);

  return (
    <section className="admin-page">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="admin-title mb-2">Hastalarım</h1>
          <p className="text-sm font-semibold text-slate-500">Hastaları arayın, risk durumuna veya son randevu durumuna göre filtreleyin.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-[1fr_220px] xl:w-[560px]">
          <input value={query} onChange={(e) => setQuery(e.target.value)} className="admin-input" placeholder="Hasta adı, e-posta veya telefon ara" />
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="admin-input">
            <option value="all">Tüm hastalar</option>
            <option value="confirmed">Onaylananlar</option>
            <option value="completed">Tamamlananlar</option>
            <option value="follow_up">Takip gerekli</option>
            <option value="chronic">Kronik hastalığı olan</option>
            <option value="allergy">Alerjisi olan</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredPatients.length ? filteredPatients.map((item) => (
          <button key={item.userId} onClick={() => navigate(`/doctor-patient/${item.userId}`)} className="admin-card p-5 text-left hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-900/10">
            <div className="flex items-center gap-4">
              <img className="h-14 w-14 rounded-full object-cover" src={item.userData?.image} alt={item.userData?.name} />
              <div className="min-w-0">
                <p className="truncate text-lg font-bold text-slate-950">{item.userData?.name}</p>
                <p className="truncate text-sm text-slate-500">{item.userData?.email}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <span className="rounded-xl bg-cyan-50 px-3 py-2 font-semibold text-cyan-700">{item.appointmentCount} randevu</span>
              <span className="rounded-xl bg-slate-50 px-3 py-2 font-semibold text-slate-600">{item.latestAppointment?.status || "pending"}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
              {item.userData?.medicalRecord?.allergies && <span className="rounded-full bg-red-50 px-3 py-1 text-red-600">Alerji</span>}
              {item.userData?.medicalRecord?.chronicDiseases && <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">Kronik</span>}
            </div>
          </button>
        )) : (
          <p className="admin-card p-6 text-center text-slate-500 md:col-span-2 xl:col-span-3">Sonuç bulunamadı.</p>
        )}
      </div>
    </section>
  );
}
