import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
export default function MyAppointments() {
  const { backendUrl, token,getDoctorsData } = useContext(AppContext);
  const [Appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  const month = [
    "oca",
    "Şub",
    "Mar",
    "Nis",
    "May",
    "Haz",
    "Tem",
    "Ağu",
    "Eyl",
    "Eki",
    "Kas",
    "Ara",
  ];
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("-");
    return (
      dateArray[0] +
      " " +
      month[parseInt(dateArray[1]) - 1] +
      " " +
      dateArray[2]
    );
  };
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/appointments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log(data.appointments);
      } else {
        console.log("Randevular alınamadı");
        toast.error("Randevular alınamadı");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const cancelAppointment = async (appointmentId) => {
    try {
      const {data} = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        {appointmentId},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if(data.success){
        toast.success("Randevu başarıyla iptal edildi");
        getUserAppointments();
        getDoctorsData();
      }else{
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
      handler: async(res) =>{
        console.log(res);
        try{
          const {data} = await axios.post(`${backendUrl}/api/user/verifyRazorpay`,res,{
            headers:{
              Authorization:`Bearer ${token}`
            }
          });
          if(data.success){
            toast.success("Ödeme başarılı");
            getUserAppointments();
            navigate('/my-appointments');
          }else{
            toast.error("Ödeme doğrulanamadı");
          }
        }catch(error){
          console.log(error);
          toast.error("Ödeme doğrulanamadı");
        }
      }
    }
    const rzp =new window.Razorpay(options)
    rzp.open();
  }

const appointmentRazorpay = async(appointmentId) => {
  try{
    const {data} = await axios.post(
      `${backendUrl}/api/user/payment-razorpay`,
      {appointmentId},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if(data.success){
    initPay(data.order);
    }

  }catch(error){
    console.log(error)
  }
}


  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Randevularım
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        {Appointments.map((item, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row items-center bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {/* صورة الدكتور */}
            <div className="w-full sm:w-40 h-40 overflow-hidden flex-shrink-0">
              <img
                src={item.docData.image}
                alt={item.docData.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* تفاصيل الدكتور */}
            <div className="flex-1 p-4 sm:pl-6">
              <h3 className="text-xl font-bold text-gray-900">
                {item.docData.name}
              </h3>
              <p className="text-gray-600">{item.docData.speciality}</p>
              <p className="text-gray-500 mt-2">
                <span className="font-semibold">Adres:</span>{" "}
                {item.docData.address.line1}, {item.docData.address.line2}
              </p>
              <p className="text-gray-500 mt-1">
                <span className="font-semibold">Tarih & Zaman:</span>{" "}
                {slotDateFormat(item.sloteDate)} | {item.sloteTime}
              </p>
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex flex-row sm:flex-col gap-2 p-4">
              {!item.cancelled && item.payment && <button className="sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50">ödendi</button>}
            {!item.cancelled &&   <button
              onClick={() => appointmentRazorpay(item._id)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Çevrimiçi Öde
              </button>}
              {!item.cancelled && !item.payment && <button 
              onClick={() => cancelAppointment(item._id)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                Randevuyu İptal Et
              </button> }

              {item.cancelled && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500' >Randevuyu İptal Edildi</button>}
             
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
