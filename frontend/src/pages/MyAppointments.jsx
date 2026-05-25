import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

export default function MyAppointments() {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [reviewDrafts, setReviewDrafts] = useState({});
  const navigate = useNavigate();
  const month = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("-");
    return `${dateArray[0]} ${month[parseInt(dateArray[1]) - 1]} ${dateArray[2]}`;
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setAppointments(data.appointments.reverse());
      else toast.error("Randevular alınamadı");
    } catch (error) {
      console.log(error);
      toast.error("Randevular alınamadı");
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/cancel-appointment`, { appointmentId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success("Randevu başarıyla iptal edildi");
        getUserAppointments();
        getDoctorsData();
      } else toast.error("Randevu iptal edilemedi");
    } catch (error) {
      console.log(error);
      toast.error("Randevu iptal edilemedi");
    }
  };

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/payment-razorpay`, { appointmentId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        const rzp = new window.Razorpay({
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: data.order.amount,
          currency: data.order.currency,
          name: "Dector Randevu Sistemi",
          description: "Randevu Ödemesi",
          order_id: data.order.id,
          receipt: data.order.receipt,
          handler: async (res) => {
            const verify = await axios.post(`${backendUrl}/api/user/verifyRazorpay`, res, {
              headers: { Authorization: `Bearer ${token}` },
            });
            verify.data.success ? toast.success("Ödeme başarılı") : toast.error("Ödeme doğrulanamadı");
            getUserAppointments();
          },
        });
        rzp.open();
      }
    } catch (error) {
      console.log(error);
      toast.error("Ödeme başlatılamadı");
    }
  };

  const submitReview = async (appointmentId) => {
    const draft = reviewDrafts[appointmentId] || {};
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/review`, {
        appointmentId,
        rating: draft.rating || 5,
        comment: draft.comment || "",
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success("Yorumunuz kaydedildi");
        getUserAppointments();
      } else toast.error(data.message);
    } catch (error) {
      console.log(error);
      toast.error("Yorum kaydedilemedi");
    }
  };

  const statusPill = (item) => {
    if (item.cancelled || item.status === "cancelled") return <span className="status-pill bg-red-50 text-red-600">İptal Edildi</span>;
    if (item.status === "rejected") return <span className="status-pill bg-red-50 text-red-600">Reddedildi</span>;
    if (item.isCompleted || item.status === "completed") return <span className="status-pill bg-emerald-50 text-emerald-700">Tamamlandı</span>;
    if (item.status === "confirmed") return <span className="status-pill bg-cyan-50 text-cyan-700">Doktor Onayladı</span>;
    return <span className="status-pill bg-amber-50 text-amber-700">Doktor Onayı Bekliyor</span>;
  };

  useEffect(() => {
    if (token) getUserAppointments();
  }, [token]);

  return (
    <section className="py-10">
      <div className="mb-8">
        <p className="section-eyebrow">Hesabım</p>
        <h1 className="section-title mt-2">Randevularım</h1>
      </div>

      {!appointments.length ? (
        <div className="surface-card p-8 text-center">
          <h2 className="text-xl font-bold text-slate-950">Henüz randevunuz yok</h2>
          <p className="mt-2 text-slate-500">Uygun doktoru seçip ilk randevunuzu oluşturabilirsiniz.</p>
          <button onClick={() => navigate("/doctors")} className="btn-primary mt-6">Doktorları Gör</button>
        </div>
      ) : (
        <div className="grid gap-5">
          {appointments.map((item) => (
            <div key={item._id} className="surface-card overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="h-48 w-full bg-cyan-50 sm:h-auto sm:w-44">
                  <img src={item.docData.image} alt={item.docData.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="mb-3 flex flex-wrap gap-2">
                      {statusPill(item)}
                      {item.payment && <span className="status-pill bg-cyan-50 text-cyan-700">Ödeme Tamam</span>}
                      {!item.payment && !item.cancelled && <span className="status-pill bg-slate-100 text-slate-600">Ödeme Bekliyor</span>}
                    </div>
                    <h2 className="text-xl font-bold text-slate-950">{item.docData.name}</h2>
                    <p className="mt-1 text-slate-500">{item.docData.speciality}</p>
                    <p className="mt-3 text-sm text-slate-600"><span className="font-semibold text-slate-800">Adres:</span> {item.docData.address.line1}, {item.docData.address.line2}</p>
                    <p className="mt-1 text-sm text-slate-600"><span className="font-semibold text-slate-800">Tarih & Saat:</span> {slotDateFormat(item.sloteDate)} | {item.sloteTime}</p>
                    {item.visitReason && <p className="mt-1 text-sm text-slate-600"><span className="font-semibold text-slate-800">Ziyaret nedeni:</span> {item.visitReason}</p>}
                  </div>

                  <div className="flex flex-wrap gap-2 sm:flex-col">
                    {!item.cancelled && item.status !== "rejected" && <button onClick={() => navigate(`/chat/${item.docId}`)} className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white hover:bg-cyan-700">Doktorla Mesajlaş</button>}
                    {!item.cancelled && !item.payment && !item.isCompleted && item.status === "confirmed" && <button onClick={() => appointmentRazorpay(item._id)} className="rounded-full bg-cyan-700 px-5 py-2 text-sm font-semibold text-white hover:bg-cyan-800">Online Öde</button>}
                    {!item.cancelled && !item.isCompleted && <button onClick={() => cancelAppointment(item._id)} className="rounded-full bg-red-50 px-5 py-2 text-sm font-semibold text-red-600 hover:bg-red-100">Randevuyu İptal Et</button>}
                  </div>
                </div>
              </div>

              {item.isCompleted && !item.reviewed && (
                <div className="border-t border-slate-200 p-5">
                  <p className="font-bold text-slate-950">Doktoru değerlendirin</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-[140px_1fr_auto]">
                    <select
                      value={reviewDrafts[item._id]?.rating || 5}
                      onChange={(e) => setReviewDrafts((prev) => ({ ...prev, [item._id]: { ...prev[item._id], rating: e.target.value } }))}
                      className="form-input"
                    >
                      {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>★ {rating}</option>)}
                    </select>
                    <input
                      value={reviewDrafts[item._id]?.comment || ""}
                      onChange={(e) => setReviewDrafts((prev) => ({ ...prev, [item._id]: { ...prev[item._id], comment: e.target.value } }))}
                      className="form-input"
                      placeholder="Kısa yorumunuzu yazın..."
                    />
                    <button onClick={() => submitReview(item._id)} className="btn-primary px-5">Gönder</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
