import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function Doctors() {
  const navigate = useNavigate();
  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);
  const [showfilter,setShowfilter] = useState(false)
  const [filterDoc, setFilterDoc] = useState([]);

  useEffect(() => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  }, [doctors, speciality]);

  // دالة مساعدة لسهولة التكرار
  const specialities = [
    { key: "PratisyenHekim", label: "Pratisyen Hekim" },
    { key: "KadınDoğumUzmanı", label: "Kadın Doğum Uzmanı" },
    { key: "Dermatolog", label: "Dermatolog" },
    { key: "ÇocukDoktoru", label: "Çocuk Doktoru" },
    { key: "Nörolog", label: "Nörolog" },
    { key: "Gastroenterolog", label: "Gastroenterolog" },
  ];

  return (
    <div className="font-serif">
      <p className="text-black text-2xl">
        Doktorların uzmanlık alanlarına göz atın.
      </p>
      <button className={`py-1 px-3 border rounded text-xl  transition-all sm:hidden ${showfilter ? 'text-white bg-blue-600' : ''}`} onClick={() => setShowfilter(prev => !prev)}>Filters</button>

      <div className={`flex flex-col md:flex-row items-start gap-5 mt-5 ${showfilter ? 'flex': 'hidden sm:flex '}`}>
        {/* الفلاتر */}
        <div className="flex flex-col gap-4 text-xl text-gray-800">
          {specialities.map((sp) => (
            <p
              key={sp.key}
              onClick={() =>
                speciality === sp.key
                  ? navigate("/doctors")
                  : navigate(`/doctors/${sp.key}`)
              }
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded cursor-pointer transition-all ${
                speciality === sp.key ? "bg-indigo-100 text-black" : ""
              }`}
            >
              {sp.label}
            </p>
          ))}
        </div>

        {/* عرض الأطباء */}
        <div
          className="w-full grid gap-4 gap-y-6"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          }}
        >
          {filterDoc.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/Appointments/${item._id}`)}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500"
            >
              <img className="bg-gray-50" src={item.image} alt={item.name} />
              <div className="p-4">
                <div className="flex items-center gap-2 text-xl text-green-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <p>Müsait</p>
                </div>
                <p className="text-gray-900 text-lg">{item.name}</p>
                <p className="text-gray-900 text-lg">{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
