import { assets } from "../assets/assets_frontend/assets.js";

const reasons = [
  ["Verimlilik", "Yoğun günlerinize uyacak hızlı ve sorunsuz randevu planlaması."],
  ["Kolaylık", "Bölgenizdeki güvenilir sağlık profesyonellerine tek yerden erişim."],
  ["Kişiselleştirme", "Sağlık takibinizi kolaylaştıran size özel bilgiler ve hatırlatmalar."],
];

export default function About() {
  return (
    <section className="py-12">
      <div className="mb-10 text-center">
        <p className="section-eyebrow">Hakkımızda</p>
        <h1 className="section-title mt-2">Sağlık randevularını daha erişilebilir yapıyoruz</h1>
      </div>

      <div className="grid items-center gap-10 lg:grid-cols-[420px_1fr]">
        <img className="w-full rounded-[2rem] object-cover shadow-xl shadow-slate-900/10" src={assets.about_image} alt="Hakkımızda" />
        <div className="surface-card p-6 sm:p-8">
          <div className="space-y-5 text-base leading-8 text-slate-600">
            <p>
              Sağlık ihtiyaçlarınızı kolay ve verimli şekilde yönetmeniz için
              tasarlanmış güvenilir bir randevu platformuyuz.
            </p>
            <p>
              Amacımız, doktor bulmayı, randevu almayı ve sağlık takibini herkes
              için pratik, hızlı ve güvenilir hale getirmek.
            </p>
            <div>
              <h2 className="text-xl font-bold text-slate-950">Vizyonumuz</h2>
              <p className="mt-2">
                Hastalar ile sağlık hizmeti sağlayıcıları arasındaki bağlantıyı
                güçlendirerek ihtiyaç duyulan bakıma kolayca ulaşılmasını sağlamak.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-14">
        <h2 className="text-2xl font-bold text-slate-950">Neden bizi tercih etmelisiniz?</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {reasons.map(([title, copy]) => (
            <div key={title} className="surface-card p-6 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-900/10">
              <h3 className="text-lg font-bold text-slate-950">{title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
