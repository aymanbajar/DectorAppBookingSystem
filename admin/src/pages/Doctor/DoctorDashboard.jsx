import { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

export default function DoctorDashboard() {
  const { dToken, dashData, getDashData, cancelAppointment, completeAppointment } = useContext(DoctorContext);
  const { currency, slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (dToken) getDashData();
  }, [dToken]);

  return dashData && (
    <section className="admin-page">
      <h1 className="admin-title">Doktor Paneli</h1>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Stat icon={assets.earning_icon} value={`${currency} ${dashData.earnings}`} label="Kazançlar" />
        <Stat icon={assets.appointments_icon} value={dashData.appointmentCount || dashData.appointments} label="Randevular" />
        <Stat icon={assets.patients_icon} value={dashData.patients} label="Hastalar" />
        <Stat icon={assets.list_icon} value={dashData.pending || 0} label="Onay bekleyen" />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="admin-card overflow-hidden">
          <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
            <img src={assets.list_icon} alt="" />
            <p className="font-bold text-slate-950">Son Randevular</p>
          </div>
          <div className="divide-y divide-slate-100">
            {dashData.latestAppointments.map((item) => (
              <div className="flex items-center gap-3 px-5 py-4 hover:bg-slate-50" key={item._id}>
                <img className="h-11 w-11 rounded-full object-cover" src={item.userData.image} alt="" />
                <div className="min-w-0 flex-1 text-sm">
                  <p className="font-bold text-slate-900">{item.userData.name}</p>
                  <p className="text-slate-500">{slotDateFormat(item.sloteDate)} | {item.sloteTime}</p>
                </div>
                {item.cancelled ? (
                  <span className="status-pill bg-red-50 text-red-600">İptal Edildi</span>
                ) : item.isCompleted || item.status === "completed" ? (
                  <span className="status-pill bg-emerald-50 text-emerald-700">Tamamlandı</span>
                ) : item.status === "follow_up" ? (
                  <span className="status-pill bg-amber-50 text-amber-700">Takip gerekli</span>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => cancelAppointment(item._id)} className="rounded-full bg-red-50 p-2 hover:bg-red-100">
                      <img className="w-7" src={assets.cancel_icon} alt="İptal et" />
                    </button>
                    <button onClick={() => completeAppointment(item._id)} className="rounded-full bg-emerald-50 p-2 hover:bg-emerald-100">
                      <img className="w-7" src={assets.tick_icon} alt="Tamamla" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="admin-card p-5">
            <h2 className="text-xl font-bold text-slate-950">Yaklaşan Hatırlatmalar</h2>
            <div className="mt-4 space-y-3">
              {dashData.upcomingAppointments?.length ? dashData.upcomingAppointments.map((item) => (
                <div key={item._id} className="rounded-2xl bg-cyan-50 p-4">
                  <p className="font-bold text-slate-950">{item.userData.name}</p>
                  <p className="text-sm font-semibold text-cyan-700">{item.sloteDate} • {item.sloteTime}</p>
                </div>
              )) : <p className="text-sm text-slate-500">Yaklaşan randevu yok.</p>}
            </div>
          </div>

          <div className="admin-card p-5">
            <h2 className="text-xl font-bold text-slate-950">Kısa Rapor</h2>
            <div className="mt-4 grid gap-3">
              <Report label="Tamamlanan" value={dashData.completed || 0} tone="emerald" />
              <Report label="İptal / reddedilen" value={dashData.cancelled || 0} tone="red" />
              <Report label="En yoğun gün" value={dashData.busiestDay ? `${dashData.busiestDay.date} (${dashData.busiestDay.count})` : "-"} tone="cyan" />
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

function Report({ label, value, tone }) {
  const color = {
    emerald: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-600",
    cyan: "bg-cyan-50 text-cyan-700",
  }[tone];
  return (
    <div className={`rounded-2xl px-4 py-3 ${color}`}>
      <p className="text-sm font-semibold">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}
