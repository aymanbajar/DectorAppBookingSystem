import { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export default function DoctorProfile() {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } =
    useContext(DoctorContext);
  const { currency } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        isAvailable: profileData.isAvailable,
      };
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/update-profile`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${dToken}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error("Profil güncellenemedi");
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  return (
    profileData && (
      <div>
        <div className="flex flex-col gap-4 m-5 font-serif">
          <div>
            <img
              className="bg-blue-500 w-full sm:max-w-64 rounded-lg"
              src={profileData.image}
              alt={profileData.name}
            />
          </div>
          <div className="flex-1 border border-stone-100 rounded-lg px-8 py-7 bg-white">
            <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
              {profileData.name}
            </p>
            <div className="flex items-center gap-2 mt-1 text-gray-600">
              <p>
                {profileData.degree} - {profileData.speciality} -{" "}
                <button className="py-0.5 px-2 border text-xs rounded-full">
                  {profileData.experience}
                </button>
              </p>
            </div>

            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3">
                <p> Hakkında :</p>

                <p className="text-sm text-gray-600 font-medium ">
                  {profileData.about}
                </p>
              </p>
            </div>
            <p>
              Randevu Ücreti :{" "}
              <span className="text-gray-800">
                {" "}
                {currency}{" "}
                {isEdit ? (
                  <input
                    type="number"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        fees: e.target.value,
                      }))
                    }
                    value={profileData.fees}
                  />
                ) : (
                  profileData.fees
                )}{" "}
              </span>
            </p>
            <div className="flex gap-2 py-2">
              <p>Adres :</p>
              <p className="text-sm">
                {isEdit ? (
                  <input
                    type="text"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                    value={profileData.address.line1}
                  />
                ) : (
                  profileData.address.line1
                )}
                <br />
                {isEdit ? (
                  <input
                    type="text"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                    value={profileData.address.line2}
                  />
                ) : (
                  profileData.address.line2
                )}
              </p>
            </div>
            <div className="flex gap-1 py-2">
              <input
                onChange={() =>
                  isEdit &&
                  setProfileData((prev) => ({
                    ...prev,
                    isAvailable: !prev.isAvailable,
                  }))
                }
                checked={profileData.isAvailable}
                type="checkbox"
                name=""
                id=""
              />
              <label htmlFor="">Müsait</label>
            </div>
            {isEdit ? (
              <button
                onClick={updateProfile}
                className="w-24 px-4 py-1 border border-blue-600  text-sm rounded-full mt-5 hover:bg-blue-700 hover:text-white transition-all"
              >
                Kaydet
              </button>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="w-24 px-4 py-1 border border-blue-600 text-sm rounded-full mt-5 hover:bg-blue-700 hover:text-white transition-all"
              >
                Güncelle
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
}
