import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

export default function AllApointments() {
  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (aToken) getAllAppointments();
  }, [aToken]);

  return (
    <section className="admin-page">
      <h1 className="admin-title">Tüm Randevular</h1>
      <div className="admin-card max-h-[78vh] min-h-[55vh] overflow-auto text-sm">
        <div className="hidden grid-cols-[0.4fr_2fr_0.8fr_2fr_2fr_0.8fr_1fr] border-b border-slate-200 px-6 py-4 font-bold text-slate-700 sm:grid">
          <p>#</p><p>Hasta</p><p>Yaş</p><p>Tarih & Saat</p><p>Doktor</p><p>Ücret</p><p>İşlemler</p>
        </div>
        <div className="divide-y divide-slate-100">
          {appointments.map((item, index) => (
            <div className="grid gap-3 px-6 py-4 text-slate-600 hover:bg-slate-50 sm:grid-cols-[0.4fr_2fr_0.8fr_2fr_2fr_0.8fr_1fr] sm:items-center" key={item._id}>
              <p className="hidden sm:block">{index + 1}</p>
              <div className="flex items-center gap-2"><img className="h-9 w-9 rounded-full object-cover" src={item.userData.image} alt="" /><p className="font-semibold text-slate-800">{item.userData.name}</p></div>
              <p className="hidden sm:block">{calculateAge(item.userData.dob)}</p>
              <p>{slotDateFormat(item.sloteDate)} | {item.sloteTime}</p>
              <div className="flex items-center gap-2"><img className="h-9 w-9 rounded-full object-cover" src={item.docData.image} alt="" /><p className="font-semibold text-slate-800">{item.docData.name}</p></div>
              <p>{currency}{item.amount}</p>
              <div>
                {item.cancelled ? <span className="status-pill bg-red-50 text-red-600">İptal Edildi</span> : item.isCompleted ? <span className="status-pill bg-emerald-50 text-emerald-700">Tamamlandı</span> : <button onClick={() => cancelAppointment(item._id)} className="rounded-full bg-red-50 p-2 hover:bg-red-100"><img className="w-7" src={assets.cancel_icon} alt="İptal et" /></button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
