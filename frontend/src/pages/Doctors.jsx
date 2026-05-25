import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const specialities = [
  "Pratisyen Hekim",
  "Kadın Doğum Uzmanı",
  "Dermatoloji",
  "Çocuk Doktoru",
  "Nörolog",
  "Gastroenteroloji",
];

const getExperienceNumber = (value = "") => Number.parseInt(String(value), 10) || 0;

export default function Doctors() {
  const navigate = useNavigate();
  const { speciality } = useParams();
  const { doctors, currencySymbol } = useContext(AppContext);
  const [showFilter, setShowFilter] = useState(false);
  const [query, setQuery] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");
  const [priceMax, setPriceMax] = useState("");
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem("favoriteDoctors") || "[]"));
  const [compareDoctors, setCompareDoctors] = useState(() => JSON.parse(localStorage.getItem("compareDoctors") || "[]"));

  const highestFee = useMemo(
    () => doctors.reduce((max, doctor) => Math.max(max, Number(doctor.fees || 0)), 0),
    [doctors]
  );

  useEffect(() => {
    localStorage.setItem("favoriteDoctors", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("compareDoctors", JSON.stringify(compareDoctors));
  }, [compareDoctors]);

  const filteredDoctors = useMemo(() => {
    const search = query.trim().toLowerCase();
    const maxPrice = priceMax ? Number(priceMax) : Infinity;

    return doctors
      .filter((doc) => !speciality || doc.speciality === speciality)
      .filter((doc) => !availableOnly || doc.available)
      .filter((doc) => Number(doc.fees || 0) <= maxPrice)
      .filter((doc) => {
        if (!search) return true;
        return [doc.name, doc.speciality, doc.degree, doc.address?.line1, doc.address?.line2]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(search));
      })
      .sort((a, b) => {
        if (sortBy === "fees-low") return Number(a.fees || 0) - Number(b.fees || 0);
        if (sortBy === "fees-high") return Number(b.fees || 0) - Number(a.fees || 0);
        if (sortBy === "experience") return getExperienceNumber(b.experience) - getExperienceNumber(a.experience);
        if (sortBy === "available") return Number(Boolean(b.available)) - Number(Boolean(a.available));
        return 0;
      });
  }, [availableOnly, doctors, priceMax, query, sortBy, speciality]);

  const toggleFavorite = (event, id) => {
    event.stopPropagation();
    setFavorites((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  };

  const toggleCompare = (event, id) => {
    event.stopPropagation();
    setCompareDoctors((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  return (
    <section className="py-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="section-eyebrow">Doktorlar</p>
          <h1 className="section-title mt-2">Uzmanlık alanına göre keşfedin</h1>
          <p className="section-copy mt-3">
            Arama, fiyat filtresi, sıralama ve karşılaştırma ile en uygun doktoru daha hızlı bulun.
          </p>
        </div>
        <button
          className={`btn-secondary sm:hidden ${showFilter ? "border-cyan-300 text-cyan-700" : ""}`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          Filtreler
        </button>
      </div>

      <div className="surface-card mb-6 grid gap-4 p-4 lg:grid-cols-[1fr_190px_190px_210px]">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="form-input"
          placeholder="Doktor, uzmanlık veya adres ara..."
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="form-input">
          <option value="recommended">Önerilen</option>
          <option value="available">Müsait olanlar</option>
          <option value="experience">En deneyimli</option>
          <option value="fees-low">En düşük ücret</option>
          <option value="fees-high">En yüksek ücret</option>
        </select>
        <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
          <input type="checkbox" checked={availableOnly} onChange={(e) => setAvailableOnly(e.target.checked)} className="h-4 w-4 accent-cyan-700" />
          Sadece müsait
        </label>
        <div>
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Maks. ücret</span>
            <span>{priceMax ? `${currencySymbol}${priceMax}` : "Tümü"}</span>
          </div>
          <input
            type="range"
            min="0"
            max={highestFee || 1000}
            step="10"
            value={priceMax || highestFee || 0}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-full accent-cyan-700"
          />
        </div>
      </div>

      {compareDoctors.length > 0 && (
        <div className="surface-card mb-6 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-slate-700">
            Karşılaştırma listesinde {compareDoctors.length}/3 doktor var.
          </p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => navigate("/compare")} className="btn-primary px-5 py-2">
              Karşılaştır
            </button>
            <button onClick={() => setCompareDoctors([])} className="btn-secondary px-5 py-2">
              Temizle
            </button>
          </div>
        </div>
      )}

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

        <div className="w-full">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
            <span>{filteredDoctors.length} doktor bulundu</span>
            <div className="flex gap-4">
              <button onClick={() => navigate("/recent")} className="font-semibold text-cyan-700 hover:text-cyan-900">
                Son görüntülenenler
              </button>
              <button onClick={() => navigate("/favorites")} className="font-semibold text-cyan-700 hover:text-cyan-900">
                Favoriler: {favorites.length}
              </button>
            </div>
          </div>

          <div className="grid w-full gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {filteredDoctors.map((item) => {
              const isFavorite = favorites.includes(item._id);
              const isCompared = compareDoctors.includes(item._id);
              return (
                <button
                  key={item._id}
                  onClick={() => navigate(`/Appointments/${item._id}`)}
                  className="doctor-card relative text-left"
                  type="button"
                >
                  <span
                    onClick={(event) => toggleFavorite(event, item._id)}
                    className={`absolute right-3 top-3 z-10 rounded-full px-3 py-2 text-sm font-bold shadow-sm ${isFavorite ? "bg-red-500 text-white" : "bg-white text-slate-600"}`}
                    title="Favorilere ekle"
                  >
                    {isFavorite ? "♥" : "♡"}
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
                    <span
                      onClick={(event) => toggleCompare(event, item._id)}
                      className={`inline-flex w-full justify-center rounded-full px-4 py-2 text-sm font-semibold ${isCompared ? "bg-cyan-700 text-white" : "bg-cyan-50 text-cyan-700"}`}
                    >
                      {isCompared ? "Karşılaştırmada" : "Karşılaştır"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {!filteredDoctors.length && (
            <div className="surface-card p-8 text-center">
              <h2 className="text-xl font-bold text-slate-950">Sonuç bulunamadı</h2>
              <p className="mt-2 text-slate-500">Arama veya filtreleri biraz genişletmeyi deneyin.</p>
              <button onClick={() => { setQuery(""); setPriceMax(""); setAvailableOnly(false); }} className="btn-secondary mt-5">
                Filtreleri temizle
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
