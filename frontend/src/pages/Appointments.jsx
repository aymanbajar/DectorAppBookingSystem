import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

export default function Appointments() {
  const navigate = useNavigate();
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } =
    useContext(AppContext);
  const daysOfWeek = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Pzr"];
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const getAvailableSlots = async () => {
    let allSlots = []; // نخزن جميع الأيام هنا
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date(today);
      endTime.setDate(today.getDate() + i); // ✅ هنا كان عندك خطأ: استعملت getDay()
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();
        const slotDate = day + "-" + month + "-" + year;
        const slotTime = formattedTime;
        
        // Check if slot is already booked
        const isSlotBooked = docInfo.slots_booked?.[slotDate]?.includes(slotTime);
        
        if(!isSlotBooked){
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
        });
        }
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      allSlots.push(timeSlots);
    }

    setDocSlots(allSlots); // ✅ تحديث مرة وحدة فقط
  };
  const bookAppointment = async () => {
    if (!token) {
      toast.warning("Lütfen randevu almak için giriş yapın");
      return navigate("/login");
    }
    try {
      const date = docSlots[slotIndex][0].datetime;
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      const slotDate = day + "-" + month + "-" + year;
      const {data} = await axios.post(`${backendUrl}/api/user/book-appointment`,{
        docId,
        slotDate,
        slotTime},{
        headers:{
          Authorization:`Bearer ${token}`
      }}
      )
      if(data.success){
        toast.success("Randevu başarıyla alındı");
        getDoctorsData();
        navigate('/my-appointments');
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Randevu alınamadı");
    }
  };

  useEffect(() => {
    const fetchDocInfo = () => {
      const foundDoc = doctors.find((doc) => doc._id === docId);
      setDocInfo(foundDoc || null);
    };
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);
  useEffect(() => {
    console.log(docSlots);
  }, [docSlots]);

  if (!docInfo) {
    return <p className="text-center mt-10 text-xl">Loading doctor info...</p>;
  }

  return (
    docInfo && (
      <div className="max-w-6xl mx-auto p-5 sm:p-10 font-serif">
        {/* Doctor Container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col sm:flex-row gap-8 p-6 sm:p-10">
          {/* Image */}
          <div className="flex-shrink-0 sm:w-72">
            <img
              className="rounded-xl w-full h-full object-cover border border-gray-200"
              src={docInfo.image}
              alt={docInfo.name}
            />
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col justify-between gap-4">
            {/* Name & Verified */}
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {docInfo.name}
              </h1>
              <img
                className="w-5 h-5"
                src={assets.verified_icon}
                alt="verified icon"
              />
            </div>

            {/* Degree & Speciality */}
            <div className="flex flex-wrap items-center gap-3 text-gray-700 mt-1">
              <span className="bg-gray-100 px-3 py-1 rounded-full">
                {docInfo.degree}
              </span>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                {docInfo.speciality}
              </span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                {docInfo.experience}
              </span>
            </div>

            {/* About */}
            <div className="mt-4">
              <p className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                Hakkında{" "}
                <img
                  className="w-5 h-5"
                  src={assets.info_icon}
                  alt="about icon"
                />
              </p>
              <p className="text-gray-600 mt-2 leading-relaxed">
                {docInfo.about}
              </p>
            </div>

            {/* Fees */}
            <div className="mt-4">
              <p className="text-gray-700 text-lg">
                Randevu ücreti:{" "}
                <span className="font-semibold text-gray-900">
                  {currencySymbol}
                  {docInfo.fees}
                </span>
              </p>
            </div>
          </div>
        </div>
        {/* Booking slots */}
        <div className="sm:ml-72 sm:pl-4 mt-4 text-gray-700">
          <p>Randevu saatleri</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlots.length > 0 &&
              docSlots.map((item, index) => (
                <div
                  onClick={() => setSlotIndex(index)}
                  key={index}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index
                      ? "bg-blue-700 text-white"
                      : "border border-gray-200"
                  }`}
                >
                  <p className="font-medium text-block">
                    {item[0] && daysOfWeek[item[0].datetime.getDay()]}{" "}
                  </p>
                  <p className="text-sm">
                    {item[0] && item[0].datetime.getDate()}/
                    {item[0] && item[0].datetime.getMonth() + 1}
                  </p>
                </div>
              ))}
          </div>
          <div className="flex items-center gap-3  w-full overflow-x-scroll mt-4">
            {docSlots.length > 0 &&
              docSlots[slotIndex].map((item, index) => (
                <p
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    item.time === slotTime
                      ? "bg-blue-800 text-white"
                      : "text-gray-800 border border-gray-300 "
                  }`}
                  key={index}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>

          <button
            onClick={bookAppointment}
            className="bg-blue-800 text-white text-xl font-light px-14 py-3 rounded-full  my-6 "
          >
            Randevu al
          </button>
        </div>
        {/* listing related Doctors */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
}
