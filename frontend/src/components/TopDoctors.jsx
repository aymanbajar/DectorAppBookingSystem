import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function TopDoctors() {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  return (
    <section className="my-20">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="section-eyebrow">Popüler doktorlar</p>
          <h2 className="section-title mt-2">Randevu alınacak en iyi doktorlar</h2>
        </div>
        <p className="section-copy md:text-right">
          Geniş uzman ağımızdan size en uygun doktoru seçin.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {doctors.slice(0, 10).map((item) => (
          <button
            type="button"
            onClick={() => {
              navigate(`/Appointments/${item._id}`);
              scrollTo(0, 0);
            }}
            className="doctor-card text-left"
            key={item._id}
          >
            <div className="bg-gradient-to-b from-cyan-50 to-slate-50">
              <img className="aspect-[4/3] w-full object-contain p-2" src={item.image} alt={item.name} />
            </div>
            <div className="space-y-2 p-4">
              <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${item.available ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                <span className={`h-2 w-2 rounded-full ${item.available ? "bg-emerald-500" : "bg-slate-400"}`} />
                {item.available ? "Müsait" : "Müsait Değil"}
              </div>
              <div>
                <p className="font-bold text-slate-950">{item.name}</p>
                <p className="text-sm text-slate-500">{item.speciality}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <button
          onClick={() => {
            navigate("/doctors");
            scrollTo(0, 0);
          }}
          className="btn-secondary"
        >
          Tüm Doktorları Görüntüle
        </button>
      </div>
    </section>
  );
}
