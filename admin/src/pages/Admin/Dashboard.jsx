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
      <div className="flex flex-wrap gap-4">
        <div className="admin-stat">
          <img className="w-12" src={assets.doctor_icon} alt="" />
          <div><p className="text-2xl font-bold text-slate-950">{dashData.doctors}</p><p className="text-sm font-semibold text-slate-500">Doktorlar</p></div>
        </div>
        <div className="admin-stat">
          <img className="w-12" src={assets.appointments_icon} alt="" />
          <div><p className="text-2xl font-bold text-slate-950">{dashData.appointments}</p><p className="text-sm font-semibold text-slate-500">Randevular</p></div>
        </div>
        <div className="admin-stat">
          <img className="w-12" src={assets.patients_icon} alt="" />
          <div><p className="text-2xl font-bold text-slate-950">{dashData.patients}</p><p className="text-sm font-semibold text-slate-500">Hastalar</p></div>
        </div>
      </div>

      <div className="admin-card mt-8 overflow-hidden">
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
    </section>
  );
}
