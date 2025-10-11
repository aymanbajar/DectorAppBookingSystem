import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function MyAppointments() {
  const { doctors } = useContext(AppContext);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Randevularım
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        {doctors.slice(0,3).map((item, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row items-center bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {/* صورة الدكتور */}
            <div className="w-full sm:w-40 h-40 overflow-hidden flex-shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* تفاصيل الدكتور */}
            <div className="flex-1 p-4 sm:pl-6">
              <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
              <p className="text-gray-600">{item.speciality}</p>
              <p className="text-gray-500 mt-2">
                <span className="font-semibold">Adres:</span>{" "}
                {item.address.line1}, {item.address.line2}
              </p>
              <p className="text-gray-500 mt-1">
                <span className="font-semibold">Tarih & Zaman:</span> 25, Eyl
                2025 | 08:30 PM
              </p>
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex flex-row sm:flex-col gap-2 p-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Çevrimiçi Öde
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                Randevuyu İptal Et
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
