import { assets } from "../assets/assets_frontend/assets.js";

export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 font-sans">
      {/* Title */}
      <div className="text-center mb-10">
        <p className="text-3xl font-bold text-gray-900">Bize Ulaşın</p>
        <p className="text-gray-600 mt-2">
          Sorularınız veya talepleriniz için bizimle iletişime geçin
        </p>
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row gap-10 items-center">
        {/* Image */}
        <div className="flex-1">
          <img
            src={assets.contact_image}
            alt="contact image"
            className="rounded-xl shadow-lg w-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 bg-white p-8 rounded-xl shadow-md space-y-6">
          <div>
            <p className="text-2xl font-semibold text-gray-800">Ofisimiz</p>
            <p className="text-gray-600 mt-1">
              54709 Atatürk Caddesi Süit 350, İstanbul, Türkiye
            </p>
          </div>

          <div>
            <p className="text-gray-800 font-medium">Telefon:</p>
            <p className="text-gray-600">+90 212 345 67 89</p>
          </div>

          <div>
            <p className="text-gray-800 font-medium">E-posta:</p>
            <p className="text-gray-600">info@ornekfirma.com</p>
          </div>

          <div>
            <p className="text-2xl font-semibold text-gray-800">
              Ekibimize Katıl
            </p>
            <p className="text-gray-600 mt-1">
              Ekiplerimiz ve açık pozisyonlarımız hakkında daha fazla bilgi
              edinin.{" "}
            </p>
            <button className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition">
              İş Fırsatlarını Keşfedin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
