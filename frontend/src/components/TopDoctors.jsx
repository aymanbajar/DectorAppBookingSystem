import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
export default function TopDoctors(){
    const navigate =  useNavigate()
    const {doctors} = useContext(AppContext)
    return (
      <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10 font-serif">
        <h1 className="text-3xl font-bold">
          Randevu Alınacak En İyi Doktorlar
        </h1>
        <p className="text-xl font-medium text-center sm:w-1/3">
          Güvenilir doktorlardan oluşan geniş listemizi inceleyin.
        </p>
        <div
          className="w-full grid gap-4 pt-5 gap-y-5 px-3 sm:px-0"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
          }}
        >
          {doctors.slice(0, 10).map((item, index) => (
            <div
              onClick={() => {
                navigate(`/Appointments/${item._id}`);
                scrollTo(0, 0);
              }}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
              key={index}
            >
              <img className="bg-gray-50" src={item.image} alt=" item image" />
              <div className="p-4">
                <div className="flex items-center  gap-2 text-xl text-center text-green-500">
                  <p className="w-2 h-2 bg-green-500 rounded-full"></p>{" "}
                  <p>Müsait</p>
                </div>
                <p className="text-gray-900 text-lg ">{item.name}</p>
                <p className="text-gray-900 text-lg ">{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            navigate("/docctors");
            scrollTo(0, 0);
          }}
          className="bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10"
        >
          more
        </button>
      </div>
    );
}