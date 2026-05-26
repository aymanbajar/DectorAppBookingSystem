import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import RelatedDoctors from "../components/RelatedDoctors";

export default function Appointments() {
  const navigate = useNavigate();
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext);
  const daysOfWeek = ["Pzr", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [visitReason, setVisitReason] = useState("");
  const [reviewData, setReviewData] = useState({ reviews: [], averageRating: 0, totalReviews: 0 });

  const getAvailableSlots = () => {
    if (!docInfo) return;

    const allSlots = [];
    const today = new Date();
    const fullDays = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
    const hasSchedule = docInfo.workSchedule?.some((item) => item.enabled);

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      const isoDate = currentDate.toISOString().slice(0, 10);
      const isBlocked = docInfo.blockedDays?.includes(isoDate);
      const daySchedule = docInfo.workSchedule?.find((item) => item.day === fullDays[currentDate.getDay()]);

      if (isBlocked || (hasSchedule && !daySchedule?.enabled)) {
        allSlots.push([]);
        continue;
      }

      const [startHour = 10, startMinute = 0] = (daySchedule?.start || "10:00").split(":").map(Number);
      const [endHour = 21, endMinute = 0] = (daySchedule?.end || "21:00").split(":").map(Number);

      const endTime = new Date(today);
      endTime.setDate(today.getDate() + i);
      endTime.setHours(endHour, endMinute, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > startHour ? currentDate.getHours() + 1 : startHour);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(startHour, startMinute, 0, 0);
      }

      const timeSlots = [];
      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const slotDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
        const isSlotBooked = docInfo.slots_booked?.[slotDate]?.includes(formattedTime);

        if (!isSlotBooked) {
          timeSlots.push({ datetime: new Date(currentDate), time: formattedTime });
        }
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      allSlots.push(timeSlots);
    }

    setDocSlots(allSlots);
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warning("Lütfen randevu almak için giriş yapın");
      return navigate("/login");
    }

    if (!slotTime || !docSlots[slotIndex]?.[0]) {
      toast.warning("Lütfen uygun bir saat seçin");
      return;
    }

    try {
      const date = docSlots[slotIndex][0].datetime;
      const slotDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime, visitReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message || "Randevu isteği gönderildi");
        getDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Randevu alınamadı");
    }
  };

  useEffect(() => {
    setDocInfo(doctors.find((doc) => doc._id === docId) || null);
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);

  useEffect(() => {
    if (!docInfo?._id) return;
    const recentDoctors = JSON.parse(localStorage.getItem("recentDoctors") || "[]");
    const nextRecentDoctors = [docInfo._id, ...recentDoctors.filter((id) => id !== docInfo._id)].slice(0, 8);
    localStorage.setItem("recentDoctors", JSON.stringify(nextRecentDoctors));
  }, [docInfo]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/doctor/reviews/${docId}`);
        if (data.success) setReviewData(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchReviews();
  }, [backendUrl, docId]);

  if (!docInfo) {
    return <p className="mt-10 text-center text-xl text-slate-600">Doktor bilgileri yükleniyor...</p>;
  }

  const selectedDate = docSlots[slotIndex]?.[0]?.datetime;

  return (
    <div className="mx-auto w-full max-w-6xl py-8">
      <div className="surface-card overflow-hidden p-5 sm:p-8">
        <div className="flex min-w-0 flex-col gap-8 sm:flex-row">
          <div className="flex-shrink-0 sm:w-72">
            <img className="h-full w-full rounded-2xl border border-slate-200 bg-cyan-50 object-cover" src={docInfo.image} alt={docInfo.name} />
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
            <div className="flex min-w-0 items-center gap-2">
              <h1 className="text-3xl font-bold text-slate-950">{docInfo.name}</h1>
              <img className="h-5 w-5" src={assets.verified_icon} alt="Onaylı" />
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-700">
              <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold">{docInfo.degree}</span>
              <span className="rounded-full bg-cyan-50 px-3 py-1 font-semibold text-cyan-700">{docInfo.speciality}</span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">{docInfo.experience}</span>
              <span className="rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-700">★ {reviewData.averageRating ? reviewData.averageRating.toFixed(1) : "0.0"} ({reviewData.totalReviews})</span>
            </div>

            <div className="mt-4">
              <p className="flex items-center gap-2 text-xl font-semibold text-slate-950">
                Hakkında
                <img className="h-5 w-5" src={assets.info_icon} alt="" />
              </p>
              <p className="mt-2 leading-7 text-slate-600">{docInfo.about}</p>
            </div>

            <p className="mt-4 text-lg text-slate-700">
              Randevu ücreti: <span className="font-bold text-slate-950">{currencySymbol}{docInfo.fees}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="surface-card mt-6 p-5 sm:p-6">
        <p className="text-xl font-bold text-slate-950">Randevu saatleri</p>
        <div className="mt-4 flex w-full items-center gap-3 overflow-x-auto pb-2">
          {docSlots.map((item, index) => (
            <button
              type="button"
              onClick={() => {
                setSlotIndex(index);
                setSlotTime("");
              }}
              key={index}
              className={`min-w-20 rounded-2xl px-4 py-4 text-center font-semibold ${slotIndex === index ? "bg-slate-950 text-white" : "border border-slate-200 bg-white text-slate-600 hover:border-cyan-200"}`}
            >
              <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
              <p className="text-sm">{item[0] && `${item[0].datetime.getDate()}/${item[0].datetime.getMonth() + 1}`}</p>
            </button>
          ))}
        </div>

        <div className="mt-4 flex w-full items-center gap-3 overflow-x-auto pb-2">
          {docSlots[slotIndex]?.map((item, index) => (
            <button
              type="button"
              onClick={() => setSlotTime(item.time)}
              className={`flex-shrink-0 rounded-full px-5 py-2 text-sm font-semibold ${item.time === slotTime ? "bg-cyan-700 text-white" : "border border-slate-200 bg-white text-slate-700 hover:border-cyan-200"}`}
              key={index}
            >
              {item.time}
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
          <p className="text-sm font-semibold text-cyan-800">Seçilen randevu özeti</p>
          <div className="mt-3 grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
            <p><span className="font-bold text-slate-950">Doktor:</span> {docInfo.name}</p>
            <p><span className="font-bold text-slate-950">Tarih:</span> {selectedDate ? `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}` : "Seçilmedi"}</p>
            <p><span className="font-bold text-slate-950">Saat:</span> {slotTime || "Seçilmedi"}</p>
            <p><span className="font-bold text-slate-950">Ücret:</span> {currencySymbol}{docInfo.fees}</p>
            <p className="sm:col-span-2"><span className="font-bold text-slate-950">Durum:</span> {slotTime ? "Rezervasyon için hazır" : "Lütfen bir saat seçin"}</p>
          </div>
        </div>

        <label className="mt-5 block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Ziyaret nedeni / doktora not</span>
          <textarea
            value={visitReason}
            onChange={(event) => setVisitReason(event.target.value)}
            className="form-input min-h-28"
            placeholder="Şikayetinizi, belirtilerinizi veya doktorun bilmesini istediğiniz notu yazın..."
          />
        </label>

        <button onClick={bookAppointment} className="btn-primary my-6">
          Randevu al
        </button>
      </div>

      <div className="surface-card mt-6 p-5 sm:p-6">
        <h2 className="text-xl font-bold text-slate-950">Hasta yorumları</h2>
        <div className="mt-4 grid gap-4">
          {reviewData.reviews.length ? reviewData.reviews.slice(0, 5).map((review) => (
            <div key={review._id} className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-bold text-slate-950">{review.userName}</p>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-bold text-amber-700">★ {review.rating}</span>
              </div>
              <p className="mt-2 leading-7 text-slate-600">{review.comment}</p>
            </div>
          )) : (
            <p className="text-slate-500">Bu doktor için henüz yorum yok.</p>
          )}
        </div>
      </div>

      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  );
}
