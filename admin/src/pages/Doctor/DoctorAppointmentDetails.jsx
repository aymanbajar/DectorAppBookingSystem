import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { DoctorContext } from "../../context/DoctorContext";

const emptyDetail = {
  visitReason: "",
  healthRecord: {},
  followUpStatus: "normal",
  followUpDate: "",
  treatmentPlan: { goals: "", instructions: "", status: "active", nextReviewDate: "" },
  tasks: [],
  doctorNotes: "",
  prescriptions: [],
  labRequests: [],
  diagnosis: "",
  risk: "low",
  status: "draft",
  files: [],
};

const emptyPrescription = { medicine: "", dosage: "", duration: "", notes: "", instructions: "" };
const emptyTask = { title: "", dueDate: "", done: false };
const emptyLab = { testName: "", notes: "", status: "requested" };
const normalizeStatus = (status = "") => String(status).trim().toLocaleLowerCase("tr-TR");
const isAppointmentCompleted = (appointment) => {
  return Boolean(appointment?.isCompleted) || ["completed", "tamamlandı", "tamamlandi"].includes(normalizeStatus(appointment?.status));
};
const isAppointmentCancelled = (appointment) => {
  return Boolean(appointment?.cancelled) || ["cancelled", "canceled", "iptal edildi", "iptal", "cancelledappointment"].includes(normalizeStatus(appointment?.status));
};

export default function DoctorAppointmentDetails() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { backendUrl, dToken, updateAppointmentStatus } = useContext(DoctorContext);
  const [appointment, setAppointment] = useState(null);
  const [detail, setDetail] = useState(emptyDetail);
  const [prescription, setPrescription] = useState(emptyPrescription);
  const [task, setTask] = useState(emptyTask);
  const [lab, setLab] = useState(emptyLab);

  const authHeaders = { Authorization: `Bearer ${dToken}` };

  const loadDetails = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/appointments/${appointmentId}`, { headers: authHeaders });
      if (data.success) {
        setAppointment(data.appointment);
        setDetail({
          ...emptyDetail,
          visitReason: data.appointment?.visitReason || "",
          healthRecord: data.appointment?.userData?.medicalRecord || {},
          ...(data.detail || {}),
          treatmentPlan: { ...emptyDetail.treatmentPlan, ...(data.detail?.treatmentPlan || {}) },
        });
      } else {
        toast.error(data.message || "Randevu detaylari alinamadi");
      }
    } catch (error) {
      console.log(error);
      toast.error("Randevu detaylari alinamadi");
    }
  };

  const saveDetails = async (nextDetail = detail, showToast = true) => {
    try {
      const { data } = await axios.put(`${backendUrl}/api/doctor/appointments/${appointmentId}/details`, nextDetail, { headers: authHeaders });
      if (data.success) {
        setDetail({ ...emptyDetail, ...data.detail, treatmentPlan: { ...emptyDetail.treatmentPlan, ...(data.detail.treatmentPlan || {}) } });
        if (showToast) toast.success(data.message || "Kaydedildi");
        return true;
      }
      toast.error(data.message || "Kaydedilemedi");
      return false;
    } catch (error) {
      console.log(error);
      toast.error("Kaydedilemedi");
      return false;
    }
  };

  const addPrescription = async () => {
    if (!prescription.medicine.trim()) return;
    const nextDetail = { ...detail, prescriptions: [...(detail.prescriptions || []), prescription] };
    if (await saveDetails(nextDetail)) setPrescription(emptyPrescription);
  };

  const addTask = () => {
    if (!task.title.trim()) return;
    setDetail((prev) => ({ ...prev, tasks: [...(prev.tasks || []), task] }));
    setTask(emptyTask);
  };

  const addLab = async () => {
    if (!lab.testName.trim()) return;
    const nextDetail = { ...detail, labRequests: [...(detail.labRequests || []), lab] };
    if (await saveDetails(nextDetail)) setLab(emptyLab);
  };

  const changeStatus = async (status) => {
    await updateAppointmentStatus(appointmentId, status);
    loadDetails();
  };

  useEffect(() => {
    if (dToken && appointmentId) loadDetails();
  }, [dToken, appointmentId]);

  if (!appointment) return <section className="admin-page"><p className="admin-card p-6 text-slate-500">Yukleniyor...</p></section>;
  const completedAppointment = isAppointmentCompleted(appointment);
  const cancelledAppointment = isAppointmentCancelled(appointment);
  const finalAppointment = completedAppointment || cancelledAppointment;

  return (
    <section className="admin-page">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <button onClick={() => navigate("/doctor-appointments")} className="mb-3 text-sm font-bold text-cyan-700">Geri don</button>
          <h1 className="admin-title mb-1">Randevu Detaylari</h1>
          <p className="text-sm font-semibold text-slate-500">{appointment.sloteDate} | {appointment.sloteTime}</p>
        </div>
        {finalAppointment ? (
          <p className={`rounded-full px-4 py-2 text-sm font-bold ${cancelledAppointment ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"}`}>
            {cancelledAppointment ? "Bu randevu iptal edildi, durum değiştirilemez." : "Bu randevu tamamlandı, durum değiştirilemez."}
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            <button onClick={() => changeStatus("confirmed")} className="admin-button bg-cyan-700 px-5 py-2">Onayla</button>
            <button onClick={() => changeStatus("completed")} className="admin-button bg-emerald-700 px-5 py-2">Tamamla</button>
            <button onClick={() => changeStatus("cancelled")} className="admin-button bg-red-600 px-5 py-2">Iptal</button>
          </div>
        )}
      </div>

      <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="grid gap-5">
          <Card title="Hasta">
            <div className="flex items-center gap-3">
              <img className="h-16 w-16 rounded-full object-cover" src={appointment.userData?.image} alt="" />
              <div>
                <p className="font-bold text-slate-950">{appointment.userData?.name}</p>
                <p className="text-sm text-slate-500">{appointment.userData?.email}</p>
              </div>
            </div>
          </Card>
          <Card title="Hasta saglik kaydi">
            <Info label="Kan" value={detail.healthRecord?.bloodType} />
            <Info label="Alerji" value={detail.healthRecord?.allergies} />
            <Info label="Ilac" value={detail.healthRecord?.medications} />
            <Info label="Kronik" value={detail.healthRecord?.chronicDiseases} />
          </Card>
        </aside>

        <div className="grid gap-5 xl:grid-cols-2">
          <Card title="Ziyaret ve tani">
            <input className="admin-input" value={detail.visitReason || ""} onChange={(e) => setDetail((prev) => ({ ...prev, visitReason: e.target.value }))} placeholder="Ziyaret nedeni" />
            <textarea className="admin-input mt-3" rows="3" value={detail.diagnosis || ""} onChange={(e) => setDetail((prev) => ({ ...prev, diagnosis: e.target.value }))} placeholder="Diagnosis / tani" />
          </Card>

          <Card title="Takip ve risk">
            <div className="grid gap-3 md:grid-cols-2">
              <select className="admin-input" value={detail.followUpStatus || "normal"} onChange={(e) => setDetail((prev) => ({ ...prev, followUpStatus: e.target.value }))}><option value="normal">Normal</option><option value="follow_up">Takip gerekli</option><option value="urgent">Oncelikli</option></select>
              <select className="admin-input" value={detail.risk || "low"} onChange={(e) => setDetail((prev) => ({ ...prev, risk: e.target.value }))}><option value="low">Dusuk</option><option value="medium">Orta</option><option value="high">Yuksek</option></select>
              <input className="admin-input md:col-span-2" type="date" value={detail.followUpDate || ""} onChange={(e) => setDetail((prev) => ({ ...prev, followUpDate: e.target.value }))} />
            </div>
          </Card>

          <Card title="Tedavi plani">
            <div className="grid gap-3 md:grid-cols-2">
              <select className="admin-input" value={detail.treatmentPlan?.status || "active"} onChange={(e) => setDetail((prev) => ({ ...prev, treatmentPlan: { ...prev.treatmentPlan, status: e.target.value } }))}><option value="active">Aktif</option><option value="paused">Beklemede</option><option value="completed">Tamamlandi</option></select>
              <input className="admin-input" type="date" value={detail.treatmentPlan?.nextReviewDate || ""} onChange={(e) => setDetail((prev) => ({ ...prev, treatmentPlan: { ...prev.treatmentPlan, nextReviewDate: e.target.value } }))} />
              <textarea className="admin-input md:col-span-2" rows="3" value={detail.treatmentPlan?.goals || ""} onChange={(e) => setDetail((prev) => ({ ...prev, treatmentPlan: { ...prev.treatmentPlan, goals: e.target.value } }))} placeholder="Hedefler" />
              <textarea className="admin-input md:col-span-2" rows="3" value={detail.treatmentPlan?.instructions || ""} onChange={(e) => setDetail((prev) => ({ ...prev, treatmentPlan: { ...prev.treatmentPlan, instructions: e.target.value } }))} placeholder="Talimatlar" />
            </div>
          </Card>

          <Card title="Doktor notlari">
            <textarea className="admin-input min-h-40" value={detail.doctorNotes || ""} onChange={(e) => setDetail((prev) => ({ ...prev, doctorNotes: e.target.value }))} placeholder="Belirtilmedi" />
          </Card>

          <Card title="Gorevler">
            <div className="grid gap-2 md:grid-cols-[1fr_150px_auto]">
              <input className="admin-input" value={task.title} onChange={(e) => setTask((prev) => ({ ...prev, title: e.target.value }))} placeholder="Gorev" />
              <input className="admin-input" type="date" value={task.dueDate} onChange={(e) => setTask((prev) => ({ ...prev, dueDate: e.target.value }))} />
              <button className="admin-button px-5" onClick={addTask}>Ekle</button>
            </div>
            <List items={detail.tasks} render={(item) => `${item.title || "-"} ${item.dueDate ? `| ${item.dueDate}` : ""}`} />
          </Card>

          <Card title="Receteler">
            <div className="grid gap-2 md:grid-cols-4">
              <input className="admin-input" value={prescription.medicine} onChange={(e) => setPrescription((prev) => ({ ...prev, medicine: e.target.value }))} placeholder="Ilac" />
              <input className="admin-input" value={prescription.dosage} onChange={(e) => setPrescription((prev) => ({ ...prev, dosage: e.target.value }))} placeholder="Doz" />
              <input className="admin-input" value={prescription.duration} onChange={(e) => setPrescription((prev) => ({ ...prev, duration: e.target.value }))} placeholder="Sure" />
              <button className="admin-button px-5" onClick={addPrescription}>Ekle</button>
              <input className="admin-input md:col-span-4" value={prescription.notes} onChange={(e) => setPrescription((prev) => ({ ...prev, notes: e.target.value }))} placeholder="Talimat / not" />
            </div>
            <List items={detail.prescriptions} render={(item) => `${item.medicine || "-"} | ${item.dosage || "-"} | ${item.notes || item.instructions || "-"}`} />
          </Card>

          <Card title="Tahlil istekleri">
            <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
              <input className="admin-input" value={lab.testName} onChange={(e) => setLab((prev) => ({ ...prev, testName: e.target.value }))} placeholder="CBC, MRI..." />
              <input className="admin-input" value={lab.notes} onChange={(e) => setLab((prev) => ({ ...prev, notes: e.target.value }))} placeholder="Not" />
              <button className="admin-button px-5" onClick={addLab}>Iste</button>
            </div>
            <List items={detail.labRequests} render={(item) => `${item.testName || "-"} | ${item.notes || "-"}`} />
          </Card>

          <Card title="Dosyalar">
            <List items={detail.files} render={(item) => item.title || item.fileUrl || "Dosya"} />
          </Card>

          <div className="xl:col-span-2">
            <button onClick={() => saveDetails()} className="admin-button px-8">Kaydet</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Card({ title, children }) {
  return <div className="admin-card min-w-0 p-5"><h2 className="mb-4 text-xl font-bold text-slate-950">{title}</h2>{children}</div>;
}

function Info({ label, value }) {
  return <p className="text-sm leading-6 text-slate-600"><span className="font-semibold text-slate-800">{label}:</span> {value || "Belirtilmedi"}</p>;
}

function List({ items = [], render }) {
  return (
    <div className="mt-3 grid gap-2">
      {items.length ? items.map((item, index) => <div key={item._id || index} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">{render(item)}</div>) : <p className="text-sm text-slate-500">Belirtilmedi</p>}
    </div>
  );
}
