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

  const getAvailableSlots = () => {
    if (!docInfo) return;

    const allSlots = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const endTime = new Date(today);
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10, 0, 0, 0);
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
        { docId, slotDate, slotTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Randevu başarıyla alındı");
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

  if (!docInfo) {
    return <p className="mt-10 text-center text-xl text-slate-600">Doktor bilgileri yükleniyor...</p>;
  }

  return (
    <div className="mx-auto max-w-6xl py-8">
      <div className="surface-card overflow-hidden p-5 sm:p-8">
        <div className="flex flex-col gap-8 sm:flex-row">
          <div className="flex-shrink-0 sm:w-72">
            <img className="h-full w-full rounded-2xl border border-slate-200 bg-cyan-50 object-cover" src={docInfo.image} alt={docInfo.name} />
          </div>

          <div className="flex flex-1 flex-col justify-between gap-4">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-slate-950">{docInfo.name}</h1>
              <img className="h-5 w-5" src={assets.verified_icon} alt="Onaylı" />
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-700">
              <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold">{docInfo.degree}</span>
              <span className="rounded-full bg-cyan-50 px-3 py-1 font-semibold text-cyan-700">{docInfo.speciality}</span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">{docInfo.experience}</span>
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

        <button onClick={bookAppointment} className="btn-primary my-6">
          Randevu al
        </button>
      </div>

      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  );
}
