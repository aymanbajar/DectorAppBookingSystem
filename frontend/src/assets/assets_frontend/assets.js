import appointment_img from './appointment_img.png'
import header_img from './header_img.png'
import group_profiles from './group_profiles.png'
import profile_pic from './profile_pic.png'
import contact_image from './contact_image.png'
import about_image from './about_image.png'
import logo from './logo.svg'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import stripe_logo from './stripe_logo.png'
import razorpay_logo from './razorpay_logo.png'
import doc1 from './doc1.png'
import doc2 from './doc2.png'
import doc3 from './doc3.png'
import doc4 from './doc4.png'
import doc5 from './doc5.png'
import doc6 from './doc6.png'
import doc7 from './doc7.png'
import doc8 from './doc8.png'
import doc9 from './doc9.png'
import doc10 from './doc10.png'
import doc11 from './doc11.png'
import doc12 from './doc12.png'
import doc13 from './doc13.png'
import doc14 from './doc14.png'
import doc15 from './doc15.png'
import Dermatologist from './Dermatologist.svg'
import Gastroenterologist from './Gastroenterologist.svg'
import General_physician from './General_physician.svg'
import Gynecologist from './Gynecologist.svg'
import Neurologist from './Neurologist.svg'
import Pediatricians from './Pediatricians.svg'


export const assets = {
    appointment_img,
    header_img,
    group_profiles,
    logo,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    stripe_logo,
    razorpay_logo
}
export const doctors = [
  {
    _id: "doc1",
    name: "Dr. Ahmet Yılmaz",
    image: doc1,
    speciality: "Pratisyen Hekim", // General physician
    degree: "Tıp Doktoru",
    experience: "4 Yıl", // Years → Yıl
    about:
      "Dr. Ahmet Yılmaz, kapsamlı tıbbi bakım sunmaya güçlü bir bağlılığa sahiptir; önleyici tıp, erken teşhis ve etkili tedavi stratejilerine odaklanır.",
    fees: 500,
    address: {
      line1: "Atatürk Caddesi, No: 25, Kat: 3, Daire:",
      line2: "7, Kadıköy, İstanbul",
    },
  },
  {
    _id: "doc2",
    name: "Dr. Elif Kaya",
    image: doc2,
    speciality: "Kadın Doğum Uzmanı", // Gynecologist
    degree: "MBBS",
    experience: "3 Yıl",
    about:
  "Dr. Elif Kaya, kadın hastalıkları ve doğum alanında modern tanı ve tedavi yöntemleriyle hizmet vermektedir. Gebelik takibi, jinekolojik muayene ve kadın sağlığı danışmanlığı konularında uzmanlaşmıştır.",    fees: 600,
    address: {
      line1: "Bağdat Caddesi No: 112",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    _id: "doc3",
    name: "Dr. Mehmet Demir",
    image: doc3,
    speciality: "Dermatoloji", // Dermatologist
    degree: "MBBS",
    experience: "1 Yıl",
    about:
  "Dr. Mehmet Demir, cilt hastalıklarının teşhis ve tedavisinde uzman bir dermatologdur. Akne, egzama, alerjik reaksiyonlar ve estetik dermatoloji uygulamaları üzerine yoğun deneyime sahiptir.",    fees: 500,
    address: {
      line1: "Valikonağı Caddesi No: 48",
      line2: "Kat 2, Şişli, İstanbul",
    },
  },
  {
    _id: "doc4",
    name: "Dr. Mehmet Arslan",
    image: doc4,
    speciality: "Çocuk Doktoru", // Pediatricians
    degree: " Çocuk Sağlığı ve Hastalıkları Uzmanlığı",
    experience: "2 Yıl",
    about:
      "Dr. Ayşe Arslan, kapsamlı tıbbi bakım sunmaya güçlü bir bağlılığa sahiptir; önleyici tıp, erken teşhis ve etkili tedavi stratejilerine odaklanır.",
    fees: 40,
    address: {
      line1: "Mimar Sinan Caddesi No: 19",
      line2: "Daire 4, Üsküdar, İstanbul",
    },
  },
  {
    _id: "doc5",
    name: "Dr. Can Öztürk",
    image: doc5,
    speciality: "Nörolog", // Neurologist
    degree: "MBBS",
    experience: "4 Yıl",
    about:
      "Dr. Can Öztürk, kapsamlı tıbbi bakım sunmaya güçlü bir bağlılığa sahiptir; önleyici tıp, erken teşhis ve etkili tedavi stratejilerine odaklanır.",
    fees: 50,
    address: {
      line1: "57th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    _id: "doc6",
    name: "Dr. Salih Yıldız",
    image: doc6,
    speciality: "Nörolog",
    degree: "MBBS",
    experience: "4 Yıl",
    about:
      "Dr. Selin Yıldız, kapsamlı tıbbi bakım sunmaya güçlü bir bağlılığa sahiptir; önleyici tıp, erken teşhis ve etkili tedavi stratejilerine odaklanır.",
    fees: 50,
    address: {
      line1: "57th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    _id: "doc7",
    name: "Dr. Emre Kaya",
    image: doc7,
    speciality: "Pratisyen Hekim",
    degree: "MBBS",
    experience: "4 Yıl",
    about:
      "Dr. Emre Kaya, kapsamlı tıbbi bakım sunmaya güçlü bir bağlılığa sahiptir; önleyici tıp, erken teşhis ve etkili tedavi stratejilerine odaklanır.",
    fees: 50,
    address: {
      line1: "17th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    _id: "doc8",
    name: "Dr. Ömer Demir",
    image: doc8,
    speciality: "Kadın Doğum Uzmanı",
    degree: "MBBS",
    experience: "3 Yıl",
    about:
      "Dr. Aylin Demir, kapsamlı tıbbi bakım sunmaya güçlü bir bağlılığa sahiptir; önleyici tıp, erken teşhis ve etkili tedavi stratejilerine odaklanır.",
    fees: 60,
    address: {
      line1: "27th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    _id: "doc9",
    name: "Dr. Elif Arslan",
    image: doc9,
    speciality: "Dermatoloji",
    degree: "MBBS",
    experience: "1 Yıl",
    about:
      "Dr. Burak Arslan, kapsamlı tıbbi bakım sunmaya güçlü bir bağlılığa sahiptir; önleyici tıp, erken teşhis ve etkili tedavi stratejilerine odaklanır.",
    fees: 30,
    address: {
      line1: "37th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    _id: "doc10",
    name: "Dr. Camil Kaya",
    image: doc10,
    speciality: "Çocuk Doktoru",
    degree: "MBBS",
    experience: "2 Yıl",
    about:
      "Dr. Elif Kaya, kapsamlı tıbbi bakım sunmaya güçlü bir bağlılığa sahiptir; önleyici tıp, erken teşhis ve etkili tedavi stratejilerine odaklanır.",
    fees: 40,
    address: {
      line1: "47th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },

  {
    _id: "doc11",
    name: "Dr. Zeynep Kaya",
    image: doc11,
    speciality: "Nörolog",
    degree: "Tıp Doktoru (MBBS)",
    experience: "4 Yıl",
    about:
      "Dr. Zeynep, kapsamlı tıbbi bakım sağlamaya, koruyucu hekimliğe, erken teşhise ve etkili tedavi stratejilerine güçlü bir bağlılık göstermektedir.",
    fees: 50,
    address: {
      line1: "57. Cadde, Richmond",
      line2: "Çember, Çevre Yolu, Londra",
    },
  },
  {
    _id: "doc12",
    name: "Dr. Mehmet Yıldız",
    image: doc12,
    speciality: "Nörolog",
    degree: "Tıp Doktoru (MBBS)",
    experience: "4 Yıl",
    about:
      "Dr. Mehmet, kapsamlı tıbbi bakım sağlamaya, koruyucu hekimliğe, erken teşhise ve etkili tedavi stratejilerine güçlü bir bağlılık göstermektedir.",
    fees: 50,
    address: {
      line1: "57. Cadde, Richmond",
      line2: "Çember, Çevre Yolu, Londra",
    },
  },
  {
    _id: "doc13",
    name: "Dr. Elif Demir",
    image: doc13,
    speciality: "PratisyenHekim",
    degree: "Tıp Doktoru (MBBS)",
    experience: "4 Yıl",
    about:
      "Dr. Elif, kapsamlı tıbbi bakım sağlamaya, koruyucu hekimliğe, erken teşhise ve etkili tedavi stratejilerine güçlü bir bağlılık göstermektedir.",
    fees: 50,
    address: {
      line1: "17. Cadde, Richmond",
      line2: "Çember, Çevre Yolu, Londra",
    },
  },
  {
    _id: "doc14",
    name: "Dr. Ahmet Acar",
    image: doc14,
    speciality: "Pratisyen Hekim",
    degree: "Tıp Doktoru (MBBS)",
    experience: "3 Yıl",
    about:
      "Dr. Ahmet, kapsamlı tıbbi bakım sağlamaya, koruyucu hekimliğe, erken teşhise ve etkili tedavi stratejilerine güçlü bir bağlılık göstermektedir.",
    fees: 60,
    address: {
      line1: "27. Cadde, Richmond",
      line2: "Çember, Çevre Yolu, Londra",
    },
  },
  {
    _id: "doc15",
    name: "Dr. Ayşe Şahin",
    image: doc15,
    speciality: "Dermatoloji",
    degree: "Tıp Doktoru (MBBS)",
    experience: "1 Yıl",
    about:
      "Dr. Ayşe, kapsamlı tıbbi bakım sağlamaya, koruyucu hekimliğe, erken teşhise ve etkili tedavi stratejilerine güçlü bir bağlılık göstermektedir.",
    fees: 30,
    address: {
      line1: "37. Cadde, Richmond",
      line2: "Çember, Çevre Yolu, Londra",
    },
  },
];


export const specialityData = [
  {
    speciality: "Pratisyen Hekim",
    image: General_physician,
  },
  {
    speciality: "Kadın Doğum Uzmanı",
    image: Gynecologist,
  },
  {
    speciality: "Dermatoloji",
    image: Dermatologist,
  },
  {
    speciality: "Çocuk Doktoru",
    image: Pediatricians,
  },
  {
    speciality: "Nörolog",
    image: Neurologist,
  },

];
