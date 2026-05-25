import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function Favorites() {
  const navigate = useNavigate();
  const { doctors, currencySymbol } = useContext(AppContext);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem("favoriteDoctors") || "[]"));

  useEffect(() => {
    localStorage.setItem("favoriteDoctors", JSON.stringify(favorites));
  }, [favorites]);

  const favoriteDoctors = useMemo(
    () => doctors.filter((doctor) => favorites.includes(doctor._id)),
    [doctors, favorites]
  );

  const removeFavorite = (event, id) => {
    event.stopPropagation();
    setFavorites((prev) => prev.filter((item) => item !== id));
  };

  return (
    <section className="py-10">
      <div className="mb-8">
        <p className="section-eyebrow">Favoriler</p>
        <h1 className="section-title mt-2">Favori Doktorlar</h1>
        <p className="section-copy mt-3">
          Favori doktorlarınızı saklayın ve randevu sırasında hızlıca ulaşın.
        </p>
      </div>

      {favoriteDoctors.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {favoriteDoctors.map((item) => (
            <button
              key={item._id}
              onClick={() => navigate(`/Appointments/${item._id}`)}
              className="doctor-card relative text-left"
              type="button"
            >
              <span
                onClick={(event) => removeFavorite(event, item._id)}
                className="absolute right-3 top-3 z-10 rounded-full bg-red-500 px-3 py-2 text-sm font-bold text-white shadow-sm"
                title="إزالة من المفضلة"
              >
                ♥
              </span>
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
                <p className="text-sm font-semibold text-slate-700">{currencySymbol}{item.fees} • {item.experience}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="surface-card p-8 text-center">
          <h2 className="text-xl font-bold text-slate-950">Henüz Favori Doktorunuz Yok</h2>
          <p className="mt-2 text-slate-500">Favori doktorlarınızı saklayın ve randevu sırasında hızlıca ulaşın.</p>
          <button onClick={() => navigate("/doctors")} className="btn-primary mt-6">
            استعراض الأطباء
          </button>
        </div>
      )}
    </section>
  );
}
