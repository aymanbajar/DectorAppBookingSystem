import { assets } from "../assets/assets_frontend/assets.js";

export default function Contact() {
  return (
    <section className="py-12">
      <div className="mb-10 text-center">
        <p className="section-eyebrow">İletişim</p>
        <h1 className="section-title mt-2">Bize Ulaşın</h1>
        <p className="section-copy mx-auto mt-3">
          Sorularınız, talepleriniz veya iş birlikleri için bizimle iletişime geçin.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <img src={assets.contact_image} alt="İletişim" className="h-full min-h-80 w-full rounded-[2rem] object-cover shadow-xl shadow-slate-900/10" />

        <div className="surface-card space-y-6 p-6 sm:p-8">
          <div>
            <p className="text-xl font-bold text-slate-950">Ofisimiz</p>
            <p className="mt-2 text-slate-600">Yıldız Caddesi No:5, Ofis 14, Sarıyer/İstanbul</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-500">Telefon</p>
              <p className="mt-1 font-bold text-slate-950">+90 212 345 67 89</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-500">E-posta</p>
              <p className="mt-1 font-bold text-slate-950">info@dectorapp.com</p>
            </div>
          </div>
          <div className="rounded-2xl bg-cyan-50 p-5">
            <p className="text-xl font-bold text-slate-950">Ekibimize katıl</p>
            <p className="mt-2 leading-7 text-slate-600">
              Ekiplerimiz ve açık pozisyonlarımız hakkında daha fazla bilgi edinin.
            </p>
            <button className="btn-primary mt-4">İş Fırsatlarını Keşfedin</button>
          </div>
        </div>
      </div>
    </section>
  );
}
