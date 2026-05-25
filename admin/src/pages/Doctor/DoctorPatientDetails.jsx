import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { DoctorContext } from "../../context/DoctorContext";

const emptyPrescription = { medicine: "", dosage: "", duration: "", notes: "" };
const emptyTask = { title: "", dueDate: "", done: false };
const emptyLabRequest = { testName: "", notes: "", status: "requested" };

export default function DoctorPatientDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { backendUrl, dToken, updateAppointmentStatus, profileData, getProfileData } = useContext(DoctorContext);
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [record, setRecord] = useState(null);
  const [prescription, setPrescription] = useState(emptyPrescription);
  const [task, setTask] = useState(emptyTask);
  const [labRequest, setLabRequest] = useState(emptyLabRequest);
  const [tagInput, setTagInput] = useState("");
  const [fileTitle, setFileTitle] = useState("");
  const [file, setFile] = useState(null);
  const [voiceFile, setVoiceFile] = useState(null);

  const authHeaders = { Authorization: `Bearer ${dToken}` };

  const fetchPatient = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/patient/${userId}`, { headers: authHeaders });
      if (data.success) {
        setPatient(data.patient);
        setAppointments(data.appointments);
        setRecord({
          riskLevel: "low",
          followUpDate: "",
          tags: [],
          treatmentPlan: { goals: "", instructions: "", status: "active", nextReviewDate: "" },
          tasks: [],
          labRequests: [],
          ...data.record,
        });
      } else {
        toast.error(data.message || "Hasta bilgileri alınamadı");
      }
    } catch (error) {
      console.log(error);
      toast.error("Hasta bilgileri alınamadı");
    }
  };

  const saveRecord = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/patient/${userId}/record`,
        {
          privateNotes: record.privateNotes,
          followUpStatus: record.followUpStatus,
          riskLevel: record.riskLevel,
          followUpDate: record.followUpDate,
          tags: record.tags,
          treatmentPlan: record.treatmentPlan,
          tasks: record.tasks,
          labRequests: record.labRequests,
        },
        { headers: authHeaders }
      );
      if (data.success) {
        toast.success(data.message);
        setRecord(data.record);
      } else {
        toast.error(data.message || "Bilgiler kaydedilemedi");
      }
    } catch (error) {
      console.log(error);
      toast.error("Bilgiler kaydedilemedi");
    }
  };

  const addPrescription = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/doctor/patient/${userId}/prescription`, prescription, { headers: authHeaders });
      if (data.success) {
        toast.success(data.message);
        setRecord(data.record);
        setPrescription(emptyPrescription);
      } else {
        toast.error(data.message || "Reçete eklenemedi");
      }
    } catch (error) {
      console.log(error);
      toast.error("Reçete eklenemedi");
    }
  };

  const uploadFile = async (event, selectedFile = file, selectedTitle = fileTitle) => {
    event.preventDefault();
    if (!selectedFile) return toast.error("Dosya seçin");
    try {
      const formData = new FormData();
      formData.append("title", selectedTitle);
      formData.append("file", selectedFile);
      const { data } = await axios.post(`${backendUrl}/api/doctor/patient/${userId}/file`, formData, { headers: authHeaders });
      if (data.success) {
        toast.success(data.message);
        setRecord(data.record);
        setFileTitle("");
        setFile(null);
        setVoiceFile(null);
      } else {
        toast.error(data.message || "Dosya yüklenemedi");
      }
    } catch (error) {
      console.log(error);
      toast.error("Dosya yüklenemedi");
    }
  };

  const addTask = () => {
    if (!task.title) return;
    setRecord((prev) => ({ ...prev, tasks: [...(prev.tasks || []), task] }));
    setTask(emptyTask);
  };

  const addLabRequest = () => {
    if (!labRequest.testName) return;
    setRecord((prev) => ({ ...prev, labRequests: [...(prev.labRequests || []), labRequest] }));
    setLabRequest(emptyLabRequest);
  };

  const addTag = () => {
    const nextTag = tagInput.trim();
    if (!nextTag) return;
    setRecord((prev) => ({ ...prev, tags: Array.from(new Set([...(prev.tags || []), nextTag])) }));
    setTagInput("");
  };

  const exportPdf = () => {
    const popup = window.open("", "_blank");
    if (!popup) return;
    popup.document.write(`
      <html><head><title>${patient.name} - Hasta Dosyası</title></head>
      <body style="font-family:Arial;padding:32px;color:#0f172a">
        <h1>${patient.name}</h1>
        <p><b>Email:</b> ${patient.email}</p>
        <p><b>Telefon:</b> ${patient.phone || "-"}</p>
        <h2>Sağlık Kaydı</h2>
        <p><b>Kan:</b> ${patient.medicalRecord?.bloodType || "-"}</p>
        <p><b>Alerji:</b> ${patient.medicalRecord?.allergies || "-"}</p>
        <p><b>Kronik:</b> ${patient.medicalRecord?.chronicDiseases || "-"}</p>
        <h2>Tedavi Planı</h2>
        <p>${record.treatmentPlan?.goals || "-"}</p>
        <p>${record.treatmentPlan?.instructions || "-"}</p>
        <h2>Doktor Notları</h2>
        <p>${record.privateNotes || "-"}</p>
      </body></html>
    `);
    popup.document.close();
    popup.print();
  };

  useEffect(() => {
    if (dToken && userId) {
      fetchPatient();
      getProfileData();
    }
  }, [dToken, userId]);

  if (!patient || !record) return <section className="admin-page"><p className="admin-card p-6 text-slate-500">Yükleniyor...</p></section>;

  const riskClass = record.riskLevel === "high" ? "bg-red-50 text-red-600" : record.riskLevel === "medium" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700";

  return (
    <section className="admin-page max-w-full overflow-hidden">
      <div className="mb-5 grid gap-4 2xl:grid-cols-[1fr_auto] 2xl:items-end">
        <div className="min-w-0">
          <h1 className="admin-title mb-1">Hasta Detayı</h1>
          <p className="text-sm font-semibold text-slate-500">Tedavi planı, görevler, risk, reçete, dosya ve takipleri yönetin.</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 2xl:w-[300px]">
          <button onClick={exportPdf} className="admin-button bg-slate-700 px-5">PDF Yazdır</button>
          <button onClick={() => navigate(`/doctor-chat?userId=${userId}`)} className="admin-button px-5">Mesaj Gönder</button>
        </div>
      </div>

      <div className="grid min-w-0 gap-6 2xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="grid min-w-0 gap-6 lg:grid-cols-2 2xl:block 2xl:space-y-6">
          <div className="admin-card p-5">
            <img className="mx-auto h-28 w-28 rounded-full object-cover" src={patient.image} alt={patient.name} />
            <h2 className="mt-4 text-center text-2xl font-bold text-slate-950">{patient.name}</h2>
            <div className="mt-4 flex justify-center"><span className={`status-pill ${riskClass}`}>Risk: {record.riskLevel}</span></div>
            <div className="mt-5 space-y-2 break-words text-sm text-slate-600">
              <p><b>E-posta:</b> {patient.email}</p>
              <p><b>Telefon:</b> {patient.phone || "-"}</p>
              <p><b>Cinsiyet:</b> {patient.gender || "-"}</p>
              <p><b>Doğum tarihi:</b> {patient.dob || "-"}</p>
            </div>
          </div>

          <div className="admin-card p-5">
            <h2 className="text-xl font-bold text-slate-950">Sağlık Kaydı</h2>
            <div className="mt-4 grid gap-3">
              <Info label="Kan Grubu" value={patient.medicalRecord?.bloodType} />
              <Info label="Alerjiler" value={patient.medicalRecord?.allergies} />
              <Info label="İlaçlar" value={patient.medicalRecord?.medications} />
              <Info label="Kronik Hastalıklar" value={patient.medicalRecord?.chronicDiseases} />
              <Info label="Notlar" value={patient.medicalRecord?.notes} />
            </div>
          </div>
        </aside>

        <div className="grid min-w-0 gap-6 xl:grid-cols-2">
          <Card title="Risk ve Takip">
            <div className="grid gap-4 lg:grid-cols-3">
              <Field label="Risk Seviyesi"><select value={record.riskLevel || "low"} onChange={(e) => setRecord((prev) => ({ ...prev, riskLevel: e.target.value }))} className="admin-input"><option value="low">Düşük</option><option value="medium">Orta</option><option value="high">Yüksek</option></select></Field>
              <Field label="Takip Durumu"><select value={record.followUpStatus || "normal"} onChange={(e) => setRecord((prev) => ({ ...prev, followUpStatus: e.target.value }))} className="admin-input"><option value="normal">Normal</option><option value="follow_up">Takip gerekli</option><option value="urgent">Öncelikli</option></select></Field>
              <Field label="Takip Tarihi"><input type="date" value={record.followUpDate || ""} onChange={(e) => setRecord((prev) => ({ ...prev, followUpDate: e.target.value }))} className="admin-input" /></Field>
            </div>
            <div className="mt-5">
              <span className="mb-2 block font-bold text-slate-950">Etiketler</span>
              <div className="flex flex-wrap gap-2">
                {(record.tags || []).map((tag) => <span key={tag} className="rounded-full bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-700">{tag} <button onClick={() => setRecord((prev) => ({ ...prev, tags: prev.tags.filter((item) => item !== tag) }))}>x</button></span>)}
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
                <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} className="admin-input" placeholder="Diabetes, Follow-up..." />
                <button type="button" onClick={addTag} className="admin-button px-5">Ekle</button>
              </div>
            </div>
          </Card>

          <Card title="Tedavi Planı">
            <div className="grid gap-3 md:grid-cols-2">
              <select value={record.treatmentPlan?.status || "active"} onChange={(e) => setRecord((prev) => ({ ...prev, treatmentPlan: { ...prev.treatmentPlan, status: e.target.value } }))} className="admin-input"><option value="active">Aktif</option><option value="paused">Beklemede</option><option value="completed">Tamamlandı</option></select>
              <input type="date" value={record.treatmentPlan?.nextReviewDate || ""} onChange={(e) => setRecord((prev) => ({ ...prev, treatmentPlan: { ...prev.treatmentPlan, nextReviewDate: e.target.value } }))} className="admin-input" />
              <textarea className="admin-input md:col-span-2" rows="3" value={record.treatmentPlan?.goals || ""} onChange={(e) => setRecord((prev) => ({ ...prev, treatmentPlan: { ...prev.treatmentPlan, goals: e.target.value } }))} placeholder="Tedavi hedefleri" />
              <textarea className="admin-input md:col-span-2" rows="3" value={record.treatmentPlan?.instructions || ""} onChange={(e) => setRecord((prev) => ({ ...prev, treatmentPlan: { ...prev.treatmentPlan, instructions: e.target.value } }))} placeholder="Hasta talimatları" />
            </div>
          </Card>

          <Card title="Görevler ve Takip">
            <div className="grid gap-3 md:grid-cols-[1fr_150px_auto]">
              <input className="admin-input" value={task.title} onChange={(e) => setTask((prev) => ({ ...prev, title: e.target.value }))} placeholder="Tahlil sonucunu kontrol et" />
              <input className="admin-input" type="date" value={task.dueDate} onChange={(e) => setTask((prev) => ({ ...prev, dueDate: e.target.value }))} />
              <button type="button" onClick={addTask} className="admin-button px-6">Ekle</button>
            </div>
            <div className="mt-4 grid gap-2">
              {(record.tasks || []).map((item, index) => (
                <label key={`${item.title}-${index}`} className="flex min-w-0 items-center gap-3 rounded-xl bg-slate-50 p-3">
                  <input type="checkbox" checked={Boolean(item.done)} onChange={(e) => setRecord((prev) => ({ ...prev, tasks: prev.tasks.map((taskItem, taskIndex) => taskIndex === index ? { ...taskItem, done: e.target.checked } : taskItem) }))} className="h-4 w-4 accent-cyan-700" />
                  <span className={`min-w-0 flex-1 truncate font-semibold ${item.done ? "text-slate-400 line-through" : "text-slate-700"}`}>{item.title}</span>
                  <span className="text-sm text-slate-500">{item.dueDate || "-"}</span>
                </label>
              ))}
            </div>
          </Card>

          <Card title="Doktor Notları">
            <textarea value={record.privateNotes || ""} onChange={(e) => setRecord((prev) => ({ ...prev, privateNotes: e.target.value }))} className="admin-input min-h-32" placeholder="Bu notları sadece doktor görür..." />
            <button onClick={saveRecord} className="admin-button mt-4 px-6">Tüm Bilgileri Kaydet</button>
          </Card>

          <Card title="Reçete Ekle">
            {profileData?.prescriptionTemplates?.length > 0 && <select onChange={(e) => e.target.value && setPrescription(profileData.prescriptionTemplates[Number(e.target.value)])} className="admin-input"><option value="">Hazır reçete şablonu seç</option>{profileData.prescriptionTemplates.map((item, index) => <option value={index} key={`${item.name}-${index}`}>{item.name || item.medicine}</option>)}</select>}
            <form onSubmit={addPrescription} className="mt-4 grid gap-3 lg:grid-cols-4">
              <input className="admin-input" value={prescription.medicine || ""} onChange={(e) => setPrescription((prev) => ({ ...prev, medicine: e.target.value }))} placeholder="İlaç adı" />
              <input className="admin-input" value={prescription.dosage || ""} onChange={(e) => setPrescription((prev) => ({ ...prev, dosage: e.target.value }))} placeholder="Doz" />
              <input className="admin-input" value={prescription.duration || ""} onChange={(e) => setPrescription((prev) => ({ ...prev, duration: e.target.value }))} placeholder="Süre" />
              <button className="admin-button">Ekle</button>
              <textarea className="admin-input lg:col-span-4" value={prescription.notes || ""} onChange={(e) => setPrescription((prev) => ({ ...prev, notes: e.target.value }))} placeholder="Reçete notu" />
            </form>
          </Card>

          <Card title="Tahlil İsteği">
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <input className="admin-input" value={labRequest.testName} onChange={(e) => setLabRequest((prev) => ({ ...prev, testName: e.target.value }))} placeholder="CBC, MRI, Blood Test..." />
              <input className="admin-input" value={labRequest.notes} onChange={(e) => setLabRequest((prev) => ({ ...prev, notes: e.target.value }))} placeholder="Not" />
              <button type="button" onClick={addLabRequest} className="admin-button px-6">İste</button>
            </div>
          </Card>

          <Card title="Dosyalar ve Sesli Notlar">
            <form onSubmit={uploadFile} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <input className="admin-input" value={fileTitle} onChange={(e) => setFileTitle(e.target.value)} placeholder="Dosya başlığı" />
              <input className="admin-input" type="file" onChange={(e) => setFile(e.target.files[0])} />
              <button className="admin-button px-6">Yükle</button>
            </form>
            <form onSubmit={(event) => uploadFile(event, voiceFile, "Sesli not")} className="mt-3 grid gap-3 md:grid-cols-[1fr_auto]">
              <input className="admin-input" type="file" accept="audio/*" onChange={(e) => setVoiceFile(e.target.files[0])} />
              <button className="admin-button bg-slate-700 px-6">Sesli Not Yükle</button>
            </form>
          </Card>

          <Card title="Randevular" wide>
            <div className="grid gap-3">
              {appointments.map((appointment) => (
                <div key={appointment._id} className="rounded-2xl bg-slate-50 p-4">
                  <div className="grid gap-3 md:grid-cols-[1fr_190px] md:items-center">
                    <div>
                      <p className="font-bold text-slate-950">{appointment.sloteDate} - {appointment.sloteTime}</p>
                      <p className="mt-1 text-sm text-slate-500">Ziyaret nedeni: {appointment.visitReason || "-"}</p>
                    </div>
                    <select value={appointment.status || "pending"} onChange={async (e) => { await updateAppointmentStatus(appointment._id, e.target.value); fetchPatient(); }} className="admin-input">
                      <option value="pending">Bekliyor</option><option value="confirmed">Onaylandı</option><option value="completed">Tamamlandı</option><option value="follow_up">Takip gerekli</option><option value="cancelled">İptal edildi</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Card({ title, children, wide }) {
  return <div className={`admin-card min-w-0 p-5 ${wide ? "xl:col-span-2" : ""}`}><h2 className="mb-4 text-xl font-bold text-slate-950">{title}</h2>{children}</div>;
}

function Field({ label, children }) {
  return <label><span className="mb-2 block font-bold text-slate-950">{label}</span>{children}</label>;
}

function Info({ label, value }) {
  return (
    <div className="min-w-0 rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 break-words text-sm font-semibold text-slate-700">{value || "-"}</p>
    </div>
  );
}
