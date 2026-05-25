import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets";

export default function Banner() {
  const navigate = useNavigate();

  return (
    <section className="my-20 overflow-hidden rounded-[2rem] bg-cyan-700 text-white shadow-xl shadow-cyan-900/15">
      <div className="grid items-center gap-8 px-6 pt-8 sm:px-10 md:grid-cols-[1fr_360px] lg:px-14">
        <div className="pb-8 md:py-14">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100">
            Yeni randevu
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
            Güvenilir doktorlarla sağlığınızı bugünden planlayın.
          </h2>
          <button
            onClick={() => {
              navigate("/login");
              scrollTo(0, 0);
            }}
            className="mt-7 rounded-full bg-white px-7 py-3 text-sm font-semibold text-cyan-800 shadow-lg shadow-cyan-950/15 hover:-translate-y-0.5 hover:bg-cyan-50"
          >
            Hesap oluştur
          </button>
        </div>
        <div className="hidden self-end md:block">
          <img className="w-full object-contain" src={assets.appointment_img} alt="Randevu" />
        </div>
      </div>
    </section>
  );
}
