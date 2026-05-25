import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";

export default function AddDoctor() {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 yıl");
  const [fees, setFees] = useState("");
  const [speciality, setSpeciality] = useState("Pratisyen Hekim");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [about, setAbout] = useState("");
  const { backendURL, aToken } = useContext(AdminContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (!docImg) return toast.error("Lütfen doktor resmi seçin");

      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append("experience", experience);
      formData.append("about", about);
      formData.append("fees", Number(fees));
      formData.append("address", JSON.stringify({ line1: address1, line2: address2 }));
      formData.append("image", docImg);

      const { data } = await axios.post(`${backendURL}/api/admin/add-doctor`, formData, {
        headers: { Authorization: `Bearer ${aToken}` },
      });

      if (data.success) {
        toast.success("Doktor başarıyla eklendi");
        setName(""); setEmail(""); setPassword(""); setFees(""); setSpeciality("Pratisyen Hekim");
        setDegree(""); setDocImg(false); setAbout(""); setAddress1(""); setAddress2("");
      } else {
        toast.error("Doktor eklenemedi");
      }
    } catch (error) {
      toast.error("Bir hata oluştu, doktor eklenemedi");
      console.log(error);
    }
  };

  return (
    <section className="admin-page">
      <h1 className="admin-title">Doktor Ekle</h1>
      <form onSubmit={onSubmitHandler} className="admin-card max-w-5xl p-6">
        <div className="mb-8 flex items-center gap-4">
          <label htmlFor="doc-img" className="cursor-pointer">
            <img className="h-24 w-24 rounded-2xl border border-cyan-200 bg-cyan-50 object-cover p-2" src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="Doktor yükle" />
          </label>
          <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
          <div>
            <p className="font-bold text-slate-950">Doktor fotoğrafı</p>
            <p className="text-sm text-slate-500">Kartlarda ve profilde kullanılacak görsel.</p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <label><span className="mb-2 block text-sm font-semibold text-slate-700">İsim</span><input onChange={(e) => setName(e.target.value)} value={name} className="admin-input" type="text" required /></label>
          <label><span className="mb-2 block text-sm font-semibold text-slate-700">E-posta</span><input onChange={(e) => setEmail(e.target.value)} value={email} className="admin-input" type="email" required /></label>
          <label><span className="mb-2 block text-sm font-semibold text-slate-700">Şifre</span><input onChange={(e) => setPassword(e.target.value)} value={password} className="admin-input" type="password" required /></label>
          <label><span className="mb-2 block text-sm font-semibold text-slate-700">Deneyim</span><select onChange={(e) => setExperience(e.target.value)} value={experience} className="admin-input">{[1,2,3,4,5,6,7,8,9,10].map((year) => <option key={year} value={`${year} yıl`}>{year} yıl</option>)}</select></label>
          <label><span className="mb-2 block text-sm font-semibold text-slate-700">Ücret</span><input onChange={(e) => setFees(e.target.value)} value={fees} className="admin-input" type="number" required /></label>
          <label><span className="mb-2 block text-sm font-semibold text-slate-700">Uzmanlık Alanı</span><select onChange={(e) => setSpeciality(e.target.value)} value={speciality} className="admin-input"><option>Pratisyen Hekim</option><option>Dermatoloji</option><option>Nöroloji</option><option>Kardiyoloji</option><option>Kadın Doğum Uzmanı</option><option>Psikiyatri</option><option>Çocuk Doktoru</option><option>Üroloji</option></select></label>
          <label><span className="mb-2 block text-sm font-semibold text-slate-700">Eğitim Bilgisi</span><input onChange={(e) => setDegree(e.target.value)} value={degree} className="admin-input" type="text" required /></label>
          <div className="grid gap-3">
            <label><span className="mb-2 block text-sm font-semibold text-slate-700">Adres satırı 1</span><input onChange={(e) => setAddress1(e.target.value)} value={address1} className="admin-input" type="text" required /></label>
            <label><span className="mb-2 block text-sm font-semibold text-slate-700">Adres satırı 2</span><input onChange={(e) => setAddress2(e.target.value)} value={address2} className="admin-input" type="text" /></label>
          </div>
        </div>

        <label className="mt-5 block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Doktor hakkında</span>
          <textarea onChange={(e) => setAbout(e.target.value)} value={about} className="admin-input min-h-32" required />
        </label>

        <button type="submit" className="admin-button mt-6">Doktoru Ekle</button>
      </form>
    </section>
  );
}
