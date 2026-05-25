import axios from "axios";
import { useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { AdminContext } from "../../context/AdminContext";

export default function AdminCenter() {
  const { aToken, backendURL } = useContext(AdminContext);
  const [data, setData] = useState(null);
  const [specialtyName, setSpecialtyName] = useState("");
  const [broadcast, setBroadcast] = useState({ recipientType: "user", title: "", message: "", link: "" });
  const [settings, setSettings] = useState({ heroTitle: "", heroSubtitle: "", featuredDoctorIds: [] });

  const auth = { Authorization: `Bearer ${aToken}` };

  const loadCenter = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/admin/center`, { headers: auth });
      if (data.success) {
        setData(data);
        setSettings({
          heroTitle: data.settings?.heroTitle || "",
          heroSubtitle: data.settings?.heroSubtitle || "",
          featuredDoctorIds: data.settings?.featuredDoctorIds || [],
        });
      } else toast.error("Yönetim verileri alınamadı");
    } catch (error) {
      console.log(error);
      toast.error("Yönetim verileri alınamadı");
    }
  };

  useEffect(() => {
    if (aToken) loadCenter();
  }, [aToken]);

  const addSpecialty = async () => {
    if (!specialtyName.trim()) return;
    await axios.post(`${backendURL}/api/admin/specialty`, { name: specialtyName }, { headers: auth });
    setSpecialtyName("");
    loadCenter();
  };

  const deleteSpecialty = async (id) => {
    await axios.delete(`${backendURL}/api/admin/specialty/${id}`, { headers: auth });
    loadCenter();
  };

  const sendBroadcast = async () => {
    const { data } = await axios.post(`${backendURL}/api/admin/broadcast`, broadcast, { headers: auth });
    data.success ? toast.success(data.message) : toast.error(data.message);
    setBroadcast({ recipientType: "user", title: "", message: "", link: "" });
  };

  const deleteReview = async (id) => {
    await axios.delete(`${backendURL}/api/admin/review/${id}`, { headers: auth });
    loadCenter();
  };

  const saveSettings = async () => {
    const { data } = await axios.post(`${backendURL}/api/admin/site-settings`, settings, { headers: auth });
    data.success ? toast.success(data.message) : toast.error(data.message);
    loadCenter();
  };

  const finance = useMemo(() => {
    const appointments = data?.appointments || [];
    const completed = appointments.filter((item) => item.isCompleted || item.status === "completed");
    return {
      revenue: completed.reduce((sum, item) => sum + Number(item.amount || 0), 0),
      completed: completed.length,
      cancelled: appointments.filter((item) => item.cancelled || ["cancelled", "rejected"].includes(item.status)).length,
    };
  }, [data]);

  const exportCsv = (rows, fileName) => {
    const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!data) return <section className="admin-page"><p className="admin-card p-6 text-slate-500">Yükleniyor...</p></section>;

  return (
    <section className="admin-page">
      <h1 className="admin-title">Yönetim Merkezi</h1>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Gelişmiş Rapor">
          <div className="grid gap-3 md:grid-cols-3">
            <Metric label="Gelir" value={`₺${finance.revenue}`} />
            <Metric label="Tamamlanan" value={finance.completed} />
            <Metric label="İptal/Reddedilen" value={finance.cancelled} />
          </div>
        </Card>

        <Card title="CSV / PDF Export">
          <div className="flex flex-wrap gap-3">
            <button className="admin-button" onClick={() => exportCsv([["Name", "Email", "Speciality"], ...data.doctors.map((d) => [d.name, d.email, d.speciality])], "doctors.csv")}>Doktor CSV</button>
            <button className="admin-button" onClick={() => exportCsv([["Name", "Email", "Phone"], ...data.patients.map((p) => [p.name, p.email, p.phone])], "patients.csv")}>Hasta CSV</button>
            <button className="admin-button" onClick={() => exportCsv([["Doctor", "Patient", "Date", "Status"], ...data.appointments.map((a) => [a.docData?.name, a.userData?.name, `${a.sloteDate} ${a.sloteTime}`, a.status])], "appointments.csv")}>Randevu CSV</button>
            <button className="admin-button bg-slate-700" onClick={() => window.print()}>PDF Yazdır</button>
          </div>
        </Card>

        <Card title="Uzmanlık Yönetimi">
          <div className="flex gap-3">
            <input className="admin-input" value={specialtyName} onChange={(e) => setSpecialtyName(e.target.value)} placeholder="Yeni uzmanlık" />
            <button className="admin-button px-6" onClick={addSpecialty}>Ekle</button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {data.specialties.map((item) => <span key={item._id} className="rounded-full bg-cyan-50 px-3 py-2 text-sm font-bold text-cyan-700">{item.name} <button onClick={() => deleteSpecialty(item._id)} className="ml-2 text-red-600">x</button></span>)}
          </div>
        </Card>

        <Card title="Genel Bildirim Gönder">
          <div className="grid gap-3">
            <select className="admin-input" value={broadcast.recipientType} onChange={(e) => setBroadcast((prev) => ({ ...prev, recipientType: e.target.value }))}><option value="user">Kullanıcılar</option><option value="doctor">Doktorlar</option></select>
            <input className="admin-input" value={broadcast.title} onChange={(e) => setBroadcast((prev) => ({ ...prev, title: e.target.value }))} placeholder="Başlık" />
            <textarea className="admin-input" value={broadcast.message} onChange={(e) => setBroadcast((prev) => ({ ...prev, message: e.target.value }))} placeholder="Mesaj" />
            <input className="admin-input" value={broadcast.link} onChange={(e) => setBroadcast((prev) => ({ ...prev, link: e.target.value }))} placeholder="Link (isteğe bağlı)" />
            <button className="admin-button w-fit px-6" onClick={sendBroadcast}>Gönder</button>
          </div>
        </Card>

        <Card title="Yorum Yönetimi">
          <div className="max-h-96 space-y-3 overflow-y-auto">
            {data.reviews.map((item) => <div key={item._id} className="rounded-xl bg-slate-50 p-3"><p className="font-bold">{item.userName} • ★ {item.rating}</p><p className="text-sm text-slate-600">{item.comment}</p><button onClick={() => deleteReview(item._id)} className="mt-2 text-sm font-bold text-red-600">Sil</button></div>)}
          </div>
        </Card>

        <Card title="Admin Activity Log">
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {data.activities.map((item) => <div key={item._id} className="rounded-xl bg-slate-50 p-3 text-sm"><p className="font-bold text-slate-950">{item.action}</p><p className="text-slate-500">{item.targetType} • {new Date(item.createdAt).toLocaleString()}</p></div>)}
          </div>
        </Card>

        <Card title="Ana Sayfa Yönetimi">
          <div className="grid gap-3">
            <input className="admin-input" value={settings.heroTitle} onChange={(e) => setSettings((prev) => ({ ...prev, heroTitle: e.target.value }))} placeholder="Hero başlığı" />
            <textarea className="admin-input" value={settings.heroSubtitle} onChange={(e) => setSettings((prev) => ({ ...prev, heroSubtitle: e.target.value }))} placeholder="Hero açıklaması" />
            <button className="admin-button w-fit px-6" onClick={saveSettings}>Kaydet</button>
          </div>
        </Card>

        <Card title="Son Yüklenen Dosyalar">
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {data.records.flatMap((record) => record.files || []).slice(0, 20).map((file) => <a key={file._id} href={file.fileUrl} target="_blank" rel="noreferrer" className="block rounded-xl bg-slate-50 p-3 text-sm font-bold text-cyan-700">{file.title || "Dosya"}<span className="block font-normal text-slate-500">{new Date(file.createdAt).toLocaleString()}</span></a>)}
          </div>
        </Card>
      </div>
    </section>
  );
}

function Card({ title, children }) {
  return <div className="admin-card min-w-0 p-5"><h2 className="mb-4 text-xl font-bold text-slate-950">{title}</h2>{children}</div>;
}

function Metric({ label, value }) {
  return <div className="rounded-2xl bg-cyan-50 p-4"><p className="text-sm font-bold text-cyan-700">{label}</p><p className="mt-1 text-2xl font-bold text-slate-950">{value}</p></div>;
}
