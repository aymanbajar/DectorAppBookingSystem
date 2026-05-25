import { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

export default function DoctorAppoinments() {
  const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment, confirmAppointment, rejectAppointment } = useContext(DoctorContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (dToken) getAppointments();
  }, [dToken]);

  const statusPill = (item) => {
    if (item.cancelled || item.status === "cancelled") return <span className="status-pill bg-red-50 text-red-600">İptal Edildi</span>;
    if (item.status === "rejected") return <span className="status-pill bg-red-50 text-red-600">Reddedildi</span>;
    if (item.isCompleted || item.status === "completed") return <span className="status-pill bg-emerald-50 text-emerald-700">Tamamlandı</span>;
    if (item.status === "confirmed") return <span className="status-pill bg-cyan-50 text-cyan-700">Onaylandı</span>;
    return <span className="status-pill bg-amber-50 text-amber-700">Onay Bekliyor</span>;
  };

  return (
    <section className="admin-page">
      <h1 className="admin-title">Tüm Randevular</h1>
      <div className="grid gap-4">
        {[...appointments].reverse().map((item, index) => (
          <div className="admin-card p-5" key={item._id}>
            <div className="grid gap-4 lg:grid-cols-[0.4fr_1.8fr_1fr_1fr_1.4fr_1fr] lg:items-center">
              <p className="hidden text-slate-500 lg:block">#{index + 1}</p>
              <div className="flex items-center gap-3">
                <img className="h-12 w-12 rounded-full object-cover" src={item.userData.image} alt="" />
                <div>
                  <p className="font-bold text-slate-950">{item.userData.name}</p>
                  <p className="text-sm text-slate-500">Yaş: {calculateAge(item.userData.dob)}</p>
                </div>
              </div>
              <span className="status-pill w-fit bg-cyan-50 text-cyan-700">{item.payment ? "Online" : "Nakit"}</span>
              {statusPill(item)}
              <p className="text-sm text-slate-600">{slotDateFormat(item.sloteDate)} | {item.sloteTime}</p>
              <p className="font-bold text-slate-950">{currency}{item.amount}</p>
            </div>

            <div className="mt-4 grid gap-4 border-t border-slate-100 pt-4 lg:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-bold text-slate-950">Ziyaret nedeni</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.visitReason || "Belirtilmedi"}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-bold text-slate-950">Hasta sağlık kaydı</p>
                <div className="mt-2 grid gap-1 text-sm text-slate-600 sm:grid-cols-2">
                  <p><span className="font-semibold">Kan:</span> {item.userData.medicalRecord?.bloodType || "-"}</p>
                  <p><span className="font-semibold">Alerji:</span> {item.userData.medicalRecord?.allergies || "-"}</p>
                  <p><span className="font-semibold">İlaç:</span> {item.userData.medicalRecord?.medications || "-"}</p>
                  <p><span className="font-semibold">Kronik:</span> {item.userData.medicalRecord?.chronicDiseases || "-"}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {item.status === "pending" && !item.cancelled && (
                <>
                  <button onClick={() => confirmAppointment(item._id)} className="rounded-full bg-cyan-700 px-5 py-2 text-sm font-semibold text-white hover:bg-cyan-800">Onayla</button>
                  <button onClick={() => rejectAppointment(item._id)} className="rounded-full bg-red-50 px-5 py-2 text-sm font-semibold text-red-600 hover:bg-red-100">Reddet</button>
                </>
              )}
              {!item.cancelled && item.status === "confirmed" && !item.isCompleted && (
                <>
                  <button onClick={() => completeAppointment(item._id)} className="rounded-full bg-emerald-50 p-2 hover:bg-emerald-100"><img className="w-7" src={assets.tick_icon} alt="Tamamla" /></button>
                  <button onClick={() => cancelAppointment(item._id)} className="rounded-full bg-red-50 p-2 hover:bg-red-100"><img className="w-7" src={assets.cancel_icon} alt="İptal et" /></button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
