import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function Compare() {
  const navigate = useNavigate();
  const { doctors, currencySymbol } = useContext(AppContext);
  const [compareIds, setCompareIds] = useState(() => JSON.parse(localStorage.getItem("compareDoctors") || "[]"));

  useEffect(() => {
    localStorage.setItem("compareDoctors", JSON.stringify(compareIds));
  }, [compareIds]);

  const comparedDoctors = useMemo(
    () => compareIds.map((id) => doctors.find((doctor) => doctor._id === id)).filter(Boolean),
    [compareIds, doctors]
  );

  const removeDoctor = (id) => {
    setCompareIds((prev) => prev.filter((item) => item !== id));
  };

  return (
    <section className="py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-eyebrow">Karşılaştırma</p>
          <h1 className="section-title mt-2">Doktorları karşılaştırın</h1>
          <p className="section-copy mt-3">
            Ücret, deneyim, uzmanlık ve müsaitlik bilgilerini yan yana görün.
          </p>
        </div>
        <button onClick={() => navigate("/doctors")} className="btn-secondary">
          Doktor ekle
        </button>
      </div>

      {comparedDoctors.length ? (
        <div className="overflow-x-auto">
          <div className="grid min-w-[760px] gap-4" style={{ gridTemplateColumns: `180px repeat(${comparedDoctors.length}, minmax(180px, 1fr))` }}>
            <div />
            {comparedDoctors.map((doctor) => (
              <div key={doctor._id} className="surface-card overflow-hidden">
                <div className="bg-cyan-50">
                  <img className="aspect-[4/3] w-full object-contain p-3" src={doctor.image} alt={doctor.name} />
                </div>
                <div className="p-4">
                  <p className="font-bold text-slate-950">{doctor.name}</p>
                  <p className="text-sm text-slate-500">{doctor.speciality}</p>
                  <button onClick={() => removeDoctor(doctor._id)} className="mt-3 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
                    Kaldır
                  </button>
                </div>
              </div>
            ))}

            {[
              ["Uzmanlık", (doctor) => doctor.speciality],
              ["Deneyim", (doctor) => doctor.experience],
              ["Ücret", (doctor) => `${currencySymbol}${doctor.fees}`],
              ["Müsaitlik", (doctor) => doctor.available ? "Müsait" : "Müsait Değil"],
              ["Eğitim", (doctor) => doctor.degree],
              ["Adres", (doctor) => `${doctor.address?.line1 || ""} ${doctor.address?.line2 || ""}`],
            ].map(([label, getter]) => (
              <div key={label} className="contents">
                <div className="surface-card p-4 font-bold text-slate-950">{label}</div>
                {comparedDoctors.map((doctor) => (
                  <div key={`${doctor._id}-${label}`} className="surface-card p-4 text-sm leading-6 text-slate-600">
                    {getter(doctor)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="surface-card p-8 text-center">
          <h2 className="text-xl font-bold text-slate-950">Karşılaştırma listeniz boş</h2>
          <p className="mt-2 text-slate-500">Doktorlar sayfasından en fazla 3 doktor seçebilirsiniz.</p>
          <button onClick={() => navigate("/doctors")} className="btn-primary mt-6">
            Doktorları Gör
          </button>
        </div>
      )}
    </section>
  );
}
