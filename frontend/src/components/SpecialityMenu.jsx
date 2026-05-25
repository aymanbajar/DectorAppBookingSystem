import { Link } from "react-router-dom";
import { specialityData } from "../assets/assets_frontend/assets";

export default function SpecialityMenu() {
  return (
    <section id="speciality" className="py-20">
      <div className="mb-8 text-center">
        <p className="section-eyebrow">Uzmanlık seçin</p>
        <h2 className="section-title mt-2">İhtiyacınıza göre doktor bulun</h2>
        <p className="section-copy mx-auto mt-4">
          Randevunuzu planlamadan önce uzmanlık alanlarını hızlıca inceleyin.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {specialityData.map((item) => (
          <Link
            onClick={() => scrollTo(0, 0)}
            className="surface-card group flex flex-col items-center gap-4 p-6 text-center hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-900/10"
            key={item.speciality}
            to={`/doctors/${item.speciality}`}
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-cyan-50 group-hover:bg-cyan-100">
              <img className="w-12" src={item.image} alt={item.speciality} />
            </span>
            <p className="font-semibold text-slate-800">{item.speciality}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
