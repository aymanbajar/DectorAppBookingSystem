import { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
export default function DoctorAppoinments() {
  const { dToken, appointments, getAppointments } = useContext(DoctorContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>Tüm Randevular</p>
      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll'>
        <div className='max-sm:hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
          <p>#</p>
          <p>Hasta</p>
          <p>Ödeme</p>
          <p>Yaş</p>
          <p>Tarih & Zaman</p>
          <p>Ücret</p>
          <p>İşlemler</p>
        </div>
      </div>
    </div>
  );
}
