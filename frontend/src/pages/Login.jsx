import { useContext } from "react";
import { useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Login() {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const [state, setState] = useState("Kayıt ol");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const onSubmitHeader = async (event) => {
    event.preventDefault();
    try {
      if (state === "Kayıt ol") {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      }else{
        const { data } = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  };
useEffect(() => {
  if(token){
    navigate('/');
  }
}, [token]);
  return (
    <div className="flex justify-center items-center min-h-screen font-serif ">
      <form
        onSubmit={onSubmitHeader}
        className="bg-white shadow-xl rounded-xl p-10 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {state === "Kayıt ol" ? "Hesap Oluştur" : "Giriş Yap"}
        </h2>
        <p className="text-gray-500 mb-6">
          Lütfen {state === "Kayıt ol" ? "hesap oluşturun" : "giriş yapın "}
          randevu almak için.
        </p>

        {state === "Kayıt ol" && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">ADI SOYADI</label>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Şifre</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {state === "Kayıt ol" ? "Hesap Oluştur" : "Giriş Yap"}
        </button>

        <p className="text-center mt-4 text-gray-600">
          {state === "Kayıt ol" ? (
            <>
              Hesabınız var mı?{" "}
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => setState("Giriş")}
              >
                Buradan giriş yapın
              </span>
            </>
          ) : (
            <>
              Yeni hesap oluştur?{" "}
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => setState("Kayıt ol")}
              >
                Buradan
              </span>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
