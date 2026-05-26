import { useContext, useEffect, useMemo, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

export default function DoctorAppoinments() {
  const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment, confirmAppointment, rejectAppointment } = useContext(DoctorContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);
  const [viewMode, setViewMode] = useState("list");
  const [openAppointmentId, setOpenAppointmentId] = useState("");

  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((a, b) => getAppointmentTime(b) - getAppointmentTime(a));
  }, [appointments]);

  useEffect(() => {
    if (dToken) getAppointments();
  }, [dToken]);

  const appointmentsByDate = useMemo(() => {
    return sortedAppointments.reduce((acc, item) => {
      acc[item.sloteDate] = [...(acc[item.sloteDate] || []), item];
      return acc;
    }, {});
  }, [sortedAppointments]);

  const statusPill = (item) => {
    if (item.cancelled || item.status === "cancelled") return <span className="status-pill bg-red-50 text-red-600">İptal Edildi</span>;
    if (item.status === "rejected") return <span className="status-pill bg-red-50 text-red-600">Reddedildi</span>;
    if (item.isCompleted || item.status === "completed") return <span className="status-pill bg-emerald-50 text-emerald-700">Tamamlandı</span>;
    if (item.status === "follow_up") return <span className="status-pill bg-amber-50 text-amber-700">Takip gerekli</span>;
    if (item.status === "confirmed") return <span className="status-pill bg-cyan-50 text-cyan-700">Onaylandı</span>;
    return <span className="status-pill bg-amber-50 text-amber-700">Onay Bekliyor</span>;
  };

  return (
    <section className="admin-page">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="admin-title mb-0">Tüm Randevular</h1>
        <div className="rounded-full border border-slate-200 bg-white p-1">
          <button onClick={() => setViewMode("list")} className={`rounded-full px-4 py-2 text-sm font-bold ${viewMode === "list" ? "bg-slate-950 text-white" : "text-slate-600"}`}>Liste</button>
          <button onClick={() => setViewMode("calendar")} className={`rounded-full px-4 py-2 text-sm font-bold ${viewMode === "calendar" ? "bg-slate-950 text-white" : "text-slate-600"}`}>Takvim</button>
        </div>
      </div>

      {viewMode === "calendar" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Object.entries(appointmentsByDate).map(([date, items]) => (
            <div key={date} className="admin-card overflow-hidden">
              <div className="border-b border-slate-200 bg-cyan-50 p-4 font-bold text-cyan-800">{slotDateFormat(date)}</div>
              <div className="divide-y divide-slate-100">
                {items.map((item) => (
                  <div key={item._id} className="p-4">
                    <p className="font-bold text-slate-950">{item.sloteTime} - {item.userData.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.visitReason || "Ziyaret nedeni yok"}</p>
                    <div className="mt-2">{statusPill(item)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {sortedAppointments.map((item, index) => (
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
                <button onClick={() => setOpenAppointmentId((prev) => prev === item._id ? "" : item._id)} className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">
                  Detaylar
                </button>
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

              {openAppointmentId === item._id && <AppointmentDetails appointment={item} />}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function AppointmentDetails({ appointment }) {
  const record = appointment.patientRecord || {};
  const treatmentPlan = record.treatmentPlan || {};
  const labRequests = record.labRequests || [];
  const prescriptions = record.prescriptions || [];
  const tasks = record.tasks || [];
  const files = record.files || [];

  return (
    <div className="mt-4 grid gap-4 border-t border-slate-100 pt-4 xl:grid-cols-2">
      <DetailCard title="Takip ve risk">
        <InfoLine label="Takip durumu" value={record.followUpStatus || "-"} />
        <InfoLine label="Risk" value={record.riskLevel || "-"} />
        <InfoLine label="Takip tarihi" value={record.followUpDate || "-"} />
      </DetailCard>

      <DetailCard title="Tedavi planı">
        <InfoLine label="Durum" value={treatmentPlan.status || "-"} />
        <InfoLine label="Sonraki kontrol" value={treatmentPlan.nextReviewDate || "-"} />
        <InfoLine label="Hedefler" value={treatmentPlan.goals || "-"} />
        <InfoLine label="Talimatlar" value={treatmentPlan.instructions || "-"} />
      </DetailCard>

      <DetailCard title="Görevler ve takip">
        {tasks.length ? tasks.map((task, index) => (
          <InfoLine key={`${task.title}-${index}`} label={task.done ? "Tamamlandı" : "Açık"} value={`${task.title || "-"}${task.dueDate ? ` | ${task.dueDate}` : ""}`} />
        )) : <p className="text-sm text-slate-500">Görev yok.</p>}
      </DetailCard>

      <DetailCard title="Doktor notları">
        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">{record.privateNotes || "Not yok."}</p>
      </DetailCard>

      <DetailCard title="Yazılan reçete">
        {prescriptions.length ? prescriptions.map((item) => (
          <div key={item._id || `${item.medicine}-${item.createdAt}`} className="rounded-xl bg-white p-3 text-sm text-slate-600">
            <p className="font-bold text-slate-950">{item.medicine}</p>
            <p>{item.dosage} | {item.duration}</p>
            {item.notes && <p className="mt-1">{item.notes}</p>}
          </div>
        )) : <p className="text-sm text-slate-500">Reçete yok.</p>}
      </DetailCard>

      <DetailCard title="Tahlil isteği">
        {labRequests.length ? labRequests.map((item) => (
          <InfoLine key={item._id || `${item.testName}-${item.createdAt}`} label={item.status || "requested"} value={`${item.testName || "-"}${item.notes ? ` | ${item.notes}` : ""}`} />
        )) : <p className="text-sm text-slate-500">Tahlil isteği yok.</p>}
      </DetailCard>

      <DetailCard title="Hasta dosyaları">
        {files.length ? files.map((file) => (
          <a key={file._id || file.fileUrl} href={file.fileUrl} target="_blank" rel="noreferrer" className="block rounded-xl bg-white p-3 text-sm font-bold text-cyan-700">
            {file.title || "Dosya"}
          </a>
        )) : <p className="text-sm text-slate-500">Dosya yok.</p>}
      </DetailCard>
    </div>
  );
}

function DetailCard({ title, children }) {
  return <div className="rounded-2xl bg-slate-50 p-4"><p className="mb-3 font-bold text-slate-950">{title}</p><div className="grid gap-2">{children}</div></div>;
}

function InfoLine({ label, value }) {
  return <p className="text-sm leading-6 text-slate-600"><span className="font-semibold text-slate-800">{label}:</span> {value}</p>;
}

function getAppointmentTime(appointment) {
  const [day, month, year] = String(appointment.sloteDate || "").split("-").map(Number);
  const time = String(appointment.sloteTime || "00:00").trim();
  const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  let hour = match ? Number(match[1]) : 0;
  const minute = match ? Number(match[2]) : 0;
  const meridiem = match?.[3]?.toUpperCase();

  if (meridiem === "PM" && hour < 12) hour += 12;
  if (meridiem === "AM" && hour === 12) hour = 0;

  return new Date(year || 0, (month || 1) - 1, day || 1, hour, minute).getTime();
}
