import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const specialities = [
  "Pratisyen Hekim",
  "Kadın Doğum Uzmanı",
  "Dermatoloji",
  "Çocuk Doktoru",
  "Nörolog",
];

export default function Doctors() {
  const navigate = useNavigate();
  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterDoc, setFilterDoc] = useState([]);

  useEffect(() => {
    setFilterDoc(speciality ? doctors.filter((doc) => doc.speciality === speciality) : doctors);
  }, [doctors, speciality]);

  return (
    <section className="py-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="section-eyebrow">Doktorlar</p>
          <h1 className="section-title mt-2">Uzmanlık alanına göre keşfedin</h1>
          <p className="section-copy mt-3">
            Size uygun doktoru seçin ve müsait randevu saatlerini görüntüleyin.
          </p>
        </div>
        <button
          className={`btn-secondary sm:hidden ${showFilter ? "border-cyan-300 text-cyan-700" : ""}`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          Filtreler
        </button>
      </div>

      <div className="flex flex-col items-start gap-6 lg:flex-row">
        <aside className={`${showFilter ? "block" : "hidden sm:block"} w-full lg:w-72`}>
          <div className="surface-card sticky top-28 space-y-2 p-3">
            <button
              onClick={() => navigate("/doctors")}
              className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold ${!speciality ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-50"}`}
            >
              Tüm uzmanlıklar
            </button>
            {specialities.map((sp) => (
              <button
                key={sp}
                onClick={() => navigate(speciality === sp ? "/doctors" : `/doctors/${sp}`)}
                className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold ${speciality === sp ? "bg-cyan-50 text-cyan-800" : "text-slate-600 hover:bg-slate-50"}`}
              >
                {sp}
              </button>
            ))}
          </div>
        </aside>

        <div className="grid w-full gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {filterDoc.map((item) => (
            <button
              key={item._id}
              onClick={() => navigate(`/Appointments/${item._id}`)}
              className="doctor-card text-left"
              type="button"
            >
              <div className="bg-gradient-to-b from-cyan-50 to-slate-50">
                <img className="aspect-[4/3] w-full object-contain p-2" src={item.image} alt={item.name} />
              </div>
              <div className="space-y-2 p-4">
                <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${item.available ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                  <span className={`h-2 w-2 rounded-full ${item.available ? "bg-emerald-500" : "bg-slate-400"}`} />
                  {item.available ? "Müsait" : "Müsait Değil"}
                </div>
                <p className="font-bold text-slate-950">{item.name}</p>
                <p className="text-sm text-slate-500">{item.speciality}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
