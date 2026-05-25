import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

export default function DoctorList() {
  const { doctors, getAllDoctors, aToken, changeAvailability } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) getAllDoctors();
  }, [aToken]);

  return (
    <section className="admin-page">
      <h1 className="admin-title">Doktor Listesi</h1>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {doctors.map((item) => (
          <div className="admin-card overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-900/10" key={item._id}>
            <div className="bg-gradient-to-b from-cyan-50 to-slate-50">
              <img className="aspect-[4/3] w-full object-contain p-3" src={item.image} alt={item.name} />
            </div>
            <div className="p-4">
              <p className="text-lg font-bold text-slate-950">{item.name}</p>
              <p className="text-sm text-slate-500">{item.speciality}</p>
              <label className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input onChange={() => changeAvailability(item._id)} type="checkbox" checked={item.available} className="h-4 w-4 accent-cyan-700" readOnly />
                Müsait
              </label>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
