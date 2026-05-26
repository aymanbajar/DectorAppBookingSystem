import { assets } from "../assets/assets_frontend/assets.js";

export default function Header() {
  return (
    <section className="relative mt-5 w-full overflow-hidden rounded-3xl bg-slate-950 text-white shadow-2xl shadow-slate-900/20 sm:mt-8 sm:rounded-[2rem]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.22),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.18),transparent_28%)]" />
      <div className="relative grid min-h-0 items-end gap-6 px-5 pt-8 sm:px-10 md:min-h-[520px] md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:gap-8 lg:px-16">
        <div className="z-10 flex min-w-0 flex-col items-start justify-center gap-6 pb-6 md:gap-7 md:pb-16">
          <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-cyan-100 backdrop-blur">
            Sağlık randevuları daha kolay
          </span>
          <div className="space-y-5">
            <h1 className="max-w-2xl text-3xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Güvenilir doktorlardan hızlıca randevu alın
            </h1>
            <p className="max-w-xl text-base leading-8 text-slate-200 sm:text-lg">
              Uzman doktorları karşılaştırın, uygun saatleri görün ve bakımınızı
              birkaç adımda planlayın.
            </p>
          </div>
          <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center">
            <a href="#speciality" className="btn-primary bg-white text-slate-950 hover:bg-cyan-100">
              Randevu al
              <img className="w-3" src={assets.arrow_icon} alt="" />
            </a>
            <div className="flex min-w-0 items-center gap-3 text-sm text-slate-200">
              <img className="w-20 shrink-0 sm:w-24" src={assets.group_profiles} alt="Hasta profilleri" />
              <span>Binlerce hasta tarafından tercih edildi</span>
            </div>
          </div>
        </div>

        <div className="relative min-h-[230px] sm:min-h-[300px] md:min-h-[520px]">
          <img
            className="absolute bottom-0 right-0 max-h-[300px] w-full object-contain object-bottom md:max-h-[520px]"
            src={assets.header_img}
            alt="Doktorlar"
          />
        </div>
      </div>
    </section>
  );
}
