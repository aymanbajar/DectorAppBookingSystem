import {assets} from '../assets/assets_frontend/assets.js'
export default function About(){
    return (
      <div className='font-serif'>
        <div className="text-center pt-10 text-2xl text-gray-500">
          <p>
            Hakkı<span className="text-gray-700">mızda</span>
          </p>
        </div>
        <div className="flex flex-col my-10 md:flex-row gap-12">
          <img
            className="w-full md:max-w-[360px]"
            src={assets.about_image}
            alt="about image"
          />
          <div className="flex flex-col  justify-center gap-6 md:w-2/4 text-xl  text-gray-600">
            <p>
              Hoş geldiniz. Sağlık ihtiyaçlarınızı kolay ve verimli bir şekilde
              yönetmede güvenilir ortağınız. Doktor randevularını planlama ve
              sağlık kayıtlarını yönetme konusunda bireylerin karşılaştığı
              zorlukları anlıyoruz. 
            </p>
            <p>
              Sağlık hizmetlerini daha kolay ve ulaşılabilir hale getirmek için
              sürekli kendini geliştiren bir platformdur. Amacımız, randevu
              almayı ve sağlık takibini herkes için pratik, güvenilir ve hızlı
              kılmaktır.
            </p>
            <b className="text-gray-800">Vizyonumuz</b>
            <p>
              Vizyonumuz, her kullanıcıya kesintisiz ve erişilebilir bir sağlık
              deneyimi sunmaktır. Hastalar ile sağlık hizmeti sağlayıcıları
              arasındaki bağlantıyı güçlendirerek, ihtiyaç duyulan bakıma hızlı
              ve kolay bir şekilde ulaşmayı hedefliyoruz.
            </p>
          </div>
        </div>
        <div className="text-xl my-4">
          <p>
            Neden
            <span className="text-gray-700"> bizi tercih etmelisiniz?</span>
          </p>
        </div>
        <div className="flex flex-col md:flex-row mb-20 ">
          <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5  text-[15px] hover:bg-blue-700 transition-all duration-300 text-black cursor-pointer">
            <b>Verimlilik</b>
            <p>
              Yoğun yaşam tarzınıza uyacak şekilde düzenlenmiş, hızlı ve
              sorunsuz randevu planlaması.
            </p>
          </div>
          <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5  text-[15px] hover:bg-blue-700 transition-all duration-300 text-black cursor-pointer">
            <b>Kolaylık</b>
            <p>Bölgenizdeki güvenilir sağlık profesyonellerine kolay erişim.</p>
          </div>
          <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5  text-[15px] hover:bg-blue-700 transition-all duration-300 text-black cursor-pointer">
            <b>Kişiselleştirme</b>
            <p>
              Sağlığınızı takip etmenize yardımcı olacak, size özel öneriler ve
              hatırlatmalar.
            </p>
          </div>
        </div>
      </div>
    );
}