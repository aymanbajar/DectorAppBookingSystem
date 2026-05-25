import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

export default function Dashboard() {
  const { aToken, dashData, getDashData, cancelAppointment } = useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (aToken) getDashData();
  }, [aToken]);

  return dashData && (
    <section className="admin-page">
      <h1 className="admin-title">Yönetim Paneli</h1>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Stat icon={assets.doctor_icon} value={dashData.doctors} label="Doktorlar" />
        <Stat icon={assets.patients_icon} value={dashData.patients} label="Hastalar" />
        <Stat icon={assets.appointments_icon} value={dashData.appointments} label="Randevular" />
        <Stat icon={assets.earning_icon} value={`₺${dashData.revenue || 0}`} label="Gelir" />
        <Stat icon={assets.doctor_icon} value={dashData.activeDoctors || 0} label="Aktif doktor" />
        <Stat icon={assets.list_icon} value={dashData.pendingDoctors || 0} label="Onay bekleyen" />
        <Stat icon={assets.cancel_icon} value={dashData.cancelledAppointments || 0} label="İptal/Reddedilen" />
        <Stat icon={assets.star_icon || assets.list_icon} value={dashData.averageRating || 0} label="Ortalama puan" />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="admin-card overflow-hidden">
          <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
            <img src={assets.list_icon} alt="" />
            <p className="font-bold text-slate-950">Son Randevular</p>
          </div>
          <div className="divide-y divide-slate-100">
            {dashData.latestAppointments.map((item) => (
              <div className="flex items-center gap-3 px-5 py-4 hover:bg-slate-50" key={item._id}>
                <img className="h-11 w-11 rounded-full object-cover" src={item.docData.image} alt="" />
                <div className="min-w-0 flex-1 text-sm">
                  <p className="font-bold text-slate-900">{item.docData.name}</p>
                  <p className="text-slate-500">{slotDateFormat(item.sloteDate)} | {item.sloteTime}</p>
                </div>
                {item.cancelled ? (
                  <span className="status-pill bg-red-50 text-red-600">İptal Edildi</span>
                ) : item.isCompleted ? (
                  <span className="status-pill bg-emerald-50 text-emerald-700">Tamamlandı</span>
                ) : (
                  <button onClick={() => cancelAppointment(item._id)} className="rounded-full bg-red-50 p-2 hover:bg-red-100">
                    <img className="w-7" src={assets.cancel_icon} alt="İptal et" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card p-5">
          <h2 className="text-xl font-bold text-slate-950">Öne çıkan</h2>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl bg-cyan-50 p-4">
              <p className="text-sm font-bold text-cyan-700">En yoğun uzmanlık</p>
              <p className="text-lg font-bold text-slate-950">{dashData.topSpecialty?.name || "-"} {dashData.topSpecialty ? `(${dashData.topSpecialty.count})` : ""}</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="text-sm font-bold text-emerald-700">Tamamlanan randevu</p>
              <p className="text-lg font-bold text-slate-950">{dashData.completedAppointments || 0}</p>
            </div>
            <div className="rounded-2xl bg-red-50 p-4">
              <p className="text-sm font-bold text-red-600">Devre dışı kullanıcı</p>
              <p className="text-lg font-bold text-slate-950">{dashData.disabledUsers || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ icon, value, label }) {
  return (
    <div className="admin-stat">
      <img className="w-12" src={icon} alt="" />
      <div><p className="text-2xl font-bold text-slate-950">{value}</p><p className="text-sm font-semibold text-slate-500">{label}</p></div>
    </div>
  );
}
