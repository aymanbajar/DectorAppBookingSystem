import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function RecentDoctors() {
  const navigate = useNavigate();
  const { doctors, currencySymbol } = useContext(AppContext);
  const [recentIds, setRecentIds] = useState(() => JSON.parse(localStorage.getItem("recentDoctors") || "[]"));

  useEffect(() => {
    localStorage.setItem("recentDoctors", JSON.stringify(recentIds));
  }, [recentIds]);

  const recentDoctors = useMemo(
    () => recentIds.map((id) => doctors.find((doctor) => doctor._id === id)).filter(Boolean),
    [doctors, recentIds]
  );

  return (
    <section className="py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-eyebrow">Son görüntülenenler</p>
          <h1 className="section-title mt-2">Tekrar bakmak istediğiniz doktorlar</h1>
          <p className="section-copy mt-3">
            Açtığınız doktor profilleri burada otomatik tutulur.
          </p>
        </div>
        {recentDoctors.length > 0 && (
          <button onClick={() => setRecentIds([])} className="btn-secondary">
            Listeyi temizle
          </button>
        )}
      </div>

      {recentDoctors.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {recentDoctors.map((doctor) => (
            <button key={doctor._id} onClick={() => navigate(`/Appointments/${doctor._id}`)} className="doctor-card text-left" type="button">
              <div className="bg-gradient-to-b from-cyan-50 to-slate-50">
                <img className="aspect-[4/3] w-full object-contain p-2" src={doctor.image} alt={doctor.name} />
              </div>
              <div className="space-y-2 p-4">
                <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${doctor.available ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                  <span className={`h-2 w-2 rounded-full ${doctor.available ? "bg-emerald-500" : "bg-slate-400"}`} />
                  {doctor.available ? "Müsait" : "Müsait Değil"}
                </div>
                <p className="font-bold text-slate-950">{doctor.name}</p>
                <p className="text-sm text-slate-500">{doctor.speciality}</p>
                <p className="text-sm font-semibold text-slate-700">{currencySymbol}{doctor.fees} • {doctor.experience}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="surface-card p-8 text-center">
          <h2 className="text-xl font-bold text-slate-950">Henüz görüntülenen doktor yok</h2>
          <p className="mt-2 text-slate-500">Bir doktor profili açtığınızda burada görünür.</p>
          <button onClick={() => navigate("/doctors")} className="btn-primary mt-6">
            Doktorları Gör
          </button>
        </div>
      )}
    </section>
  );
}
