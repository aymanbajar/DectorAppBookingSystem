import axios from "axios";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

export default function ChangePassword() {
  const { backendUrl, token } = useContext(AppContext);
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const submit = async (event) => {
    event.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast.error("Yeni parola eşleşmiyor");
      return;
    }
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/change-password`,
        { currentPassword: form.currentPassword, newPassword: form.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message);
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(data.message || "Parola değiştirilemedi");
      }
    } catch (error) {
      console.log(error);
      toast.error("Parola değiştirilemedi");
    }
  };

  return (
    <section className="py-10">
      <p className="section-eyebrow">Hesabım</p>
      <h1 className="section-title mt-2">Parola Değiştir</h1>
      <form onSubmit={submit} className="surface-card mt-8 max-w-2xl space-y-4 p-6">
        <input
          type="password"
          className="form-input"
          value={form.currentPassword}
          onChange={(e) => setForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
          placeholder="Mevcut parola"
        />
        <input
          type="password"
          className="form-input"
          value={form.newPassword}
          onChange={(e) => setForm((prev) => ({ ...prev, newPassword: e.target.value }))}
          placeholder="Yeni parola"
        />
        <input
          type="password"
          className="form-input"
          value={form.confirmPassword}
          onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
          placeholder="Yeni parolayı tekrar yazın"
        />
        <button className="btn-primary px-8">Kaydet</button>
      </form>
    </section>
  );
}
