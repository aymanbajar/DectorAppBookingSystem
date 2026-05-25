import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

export default function MyAppointments() {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
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
      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error("Randevular alınamadı");
      }
    } catch (error) {
      console.log(error);
      toast.error("Randevular alınamadı");
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success("Randevu başarıyla iptal edildi");
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error("Randevu iptal edilemedi");
      }
    } catch (error) {
      console.log(error);
      toast.error("Randevu iptal edilemedi");
    }
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Dector Randevu Sistemi",
      description: "Randevu Ödemesi",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (res) => {
        try {
          const { data } = await axios.post(`${backendUrl}/api/user/verifyRazorpay`, res, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (data.success) {
            toast.success("Ödeme başarılı");
            getUserAppointments();
            navigate("/my-appointments");
          } else {
            toast.error("Ödeme doğrulanamadı");
          }
        } catch (error) {
          console.log(error);
          toast.error("Ödeme doğrulanamadı");
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/payment-razorpay`,
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) initPay(data.order);
    } catch (error) {
      console.log(error);
      toast.error("Ödeme başlatılamadı");
    }
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

      <div className="grid gap-5">
        {appointments.map((item) => (
          <div key={item._id} className="surface-card flex flex-col overflow-hidden sm:flex-row">
            <div className="h-48 w-full bg-cyan-50 sm:h-auto sm:w-44">
              <img src={item.docData.image} alt={item.docData.name} className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-1 flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-950">{item.docData.name}</h2>
                <p className="mt-1 text-slate-500">{item.docData.speciality}</p>
                <p className="mt-3 text-sm text-slate-600">
                  <span className="font-semibold text-slate-800">Adres:</span> {item.docData.address.line1}, {item.docData.address.line2}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  <span className="font-semibold text-slate-800">Tarih & Saat:</span> {slotDateFormat(item.sloteDate)} | {item.sloteTime}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 sm:flex-col">
                {!item.cancelled && item.payment && !item.isCompleted && <span className="status-pill bg-cyan-50 text-cyan-700">Ödendi</span>}
                {!item.cancelled && !item.payment && !item.isCompleted && (
                  <button onClick={() => appointmentRazorpay(item._id)} className="rounded-full bg-cyan-700 px-5 py-2 text-sm font-semibold text-white hover:bg-cyan-800">
                    Online Öde
                  </button>
                )}
                {!item.cancelled && !item.isCompleted && (
                  <button onClick={() => cancelAppointment(item._id)} className="rounded-full bg-red-50 px-5 py-2 text-sm font-semibold text-red-600 hover:bg-red-100">
                    Randevuyu İptal Et
                  </button>
                )}
                {item.cancelled && !item.isCompleted && <span className="status-pill bg-red-50 text-red-600">İptal Edildi</span>}
                {item.isCompleted && <span className="status-pill bg-emerald-50 text-emerald-700">Tamamlandı</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
