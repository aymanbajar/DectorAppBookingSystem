import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

export default function RelatedDoctors({ speciality, docId }) {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  const [relDoc, setRelDoc] = useState([]);

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      setRelDoc(doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId));
    }
  }, [doctors, speciality, docId]);

  if (!relDoc.length) return null;

  return (
    <section className="my-16">
      <div className="mb-8">
        <p className="section-eyebrow">Benzer uzmanlar</p>
        <h2 className="section-title mt-2">İlgili doktorlar</h2>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {relDoc.slice(0, 5).map((item) => (
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
              <p className="font-bold text-slate-950">{item.name}</p>
              <p className="text-sm text-slate-500">{item.speciality}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
