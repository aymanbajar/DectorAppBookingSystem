# 🏥 Doctor Appointment Booking System

Tam özellikli bir doktor randevu sistemi - hastalar, doktorlar ve yöneticiler için üç ayrı panel içerir.
kullanıcı için
https://dector-app-booking-system-z5fe.vercel.app/
user@example.com - asd12345

admin için 
https://dector-app-booking-system-epv3mb9yn-aymanbajars-projects.vercel.app/
admin@example.com -asd1234

 doctor için 
 https://dector-app-booking-system-epv3mb9yn-aymanbajars-projects.vercel.app/
ahmet@yilmaz.com - asd12345


## 📋 Özellikler

### 👤 Hasta Paneli (Frontend)
- Kullanıcı kaydı ve girişi
- Uzmanlık alanına göre doktor arama
- Doktor profili görüntüleme
- Online randevu alma
- Randevu geçmişi görüntüleme
- Randevu iptal etme
- Profil yönetimi
- Razorpay ile ödeme entegrasyonu

### 👨‍⚕️ Doktor Paneli
- Doktor girişi
- Randevu listesi görüntüleme
- Randevu onaylama/iptal etme
- Randevu tamamlama
- Profil bilgilerini güncelleme
- Müsaitlik durumu ayarlama
- Dashboard istatistikleri

### 👨‍💼 Admin Paneli
- Admin girişi
- Yeni doktor ekleme
- Doktor listesi yönetimi
- Doktor müsaitlik durumu değiştirme
- Tüm randevuları görüntüleme
- Randevu iptal etme
- Dashboard istatistikleri

## 🛠️ Teknolojiler

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Cloudinary** - Image storage
- **Multer** - File upload
- **Razorpay** - Payment gateway

### Frontend (Hasta Paneli)
- **React** & **Vite** - UI framework
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React Toastify** - Notifications

### Admin & Doctor Panel
- **React** & **Vite**
- **React Router**
- **Axios**
- **Tailwind CSS**
- **React Toastify**

## 📁 Proje Yapısı

```
DectorAppBookingSystem/
│
├── backend/
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── mongodb.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── doctorController.js
│   │   └── userController.js
│   ├── middlewares/
│   │   ├── authAdmin.js
│   │   ├── authDoctor.js
│   │   ├── authUser.js
│   │   └── multer.js
│   ├── models/
│   │   ├── appointmentModel.js
│   │   ├── doctorModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── adminRoute.js
│   │   ├── doctorRoute.js
│   │   └── userRoute.js
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Banner.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── RelatedDoctors.jsx
│   │   │   ├── SpecialityMenu.jsx
│   │   │   └── TopDoctors.jsx
│   │   ├── context/
│   │   │   └── AppContext.jsx
│   │   ├── pages/
│   │   │   ├── About.jsx
│   │   │   ├── Appointments.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Doctors.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MyAppointments.jsx
│   │   │   └── MyProfile.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
└── admin/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── Sidebar.jsx
    │   ├── context/
    │   │   ├── AdminContext.jsx
    │   │   ├── AppContext.jsx
    │   │   └── DoctorContext.jsx
    │   ├── pages/
    │   │   ├── Admin/
    │   │   │   ├── AddDoctor.jsx
    │   │   │   ├── AllApointments.jsx
    │   │   │   ├── Dashboard.jsx
    │   │   │   └── DoctorList.jsx
    │   │   ├── Doctor/
    │   │   │   ├── DoctorAppoinments.jsx
    │   │   │   ├── DoctorDashboard.jsx
    │   │   │   └── DoctorProfile.jsx
    │   │   └── Login.jsx
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env
    ├── package.json
    └── vite.config.js
```

## 🚀 Kurulum

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/aymanbajar/DectorAppBookingSystem.git
cd DectorAppBookingSystem
```

### 2. Backend Kurulumu

```bash
cd backend
npm install
```

`.env` dosyası oluşturun:
```env
MONGODB_URL=your_mongodb_connection_string
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CURRENCY=TRY
```

Backend'i başlatın:
```bash
npm run server
```

### 3. Frontend Kurulumu (Hasta Paneli)

```bash
cd frontend
npm install
```

`.env` dosyası oluşturun:
```env
VITE_BACKEND_URL=http://localhost:4000
```

Frontend'i başlatın:
```bash
npm run dev
```

### 4. Admin/Doctor Panel Kurulumu

```bash
cd admin
npm install
```

`.env` dosyası oluşturun:
```env
VITE_BACKEND_URL=http://localhost:4000
```

Admin paneli başlatın:
```bash
npm run dev
```

## 🔑 Varsayılan Admin Bilgileri

```
Email: admin@example.com
Password: asd1234
```

## 📡 API Endpoints

### Admin Routes
- `POST /api/admin/add-doctor` - Yeni doktor ekle
- `POST /api/admin/login` - Admin girişi
- `POST /api/admin/all-doctors` - Tüm doktorları listele
- `POST /api/admin/change-availability` - Doktor müsaitliğini değiştir
- `GET /api/admin/appointments` - Tüm randevuları listele
- `POST /api/admin/cancel-appointment` - Randevu iptal et
- `GET /api/admin/dashboard` - Dashboard verileri

### Doctor Routes
- `POST /api/doctor/login` - Doktor girişi
- `GET /api/doctor/appointments` - Doktor randevuları
- `POST /api/doctor/complete-appointment` - Randevu tamamla
- `POST /api/doctor/cancel-appointment` - Randevu iptal et
- `GET /api/doctor/dashboard` - Dashboard verileri
- `GET /api/doctor/profile` - Profil bilgileri
- `POST /api/doctor/update-profile` - Profil güncelle

### User Routes
- `POST /api/user/register` - Kullanıcı kaydı
- `POST /api/user/login` - Kullanıcı girişi
- `GET /api/user/get-profile` - Profil bilgileri
- `POST /api/user/update-profile` - Profil güncelle
- `POST /api/user/book-appointment` - Randevu al
- `GET /api/user/appointments` - Kullanıcı randevuları
- `POST /api/user/cancel-appointment` - Randevu iptal et
- `POST /api/user/payment-razorpay` - Ödeme işlemi

### Public Routes
- `GET /api/doctor/list` - Tüm doktorları listele

## 🎨 Uzmanlık Alanları

- Pratisyen Hekim
- Kadın Doğum Uzmanı
- Dermatoloji
- Çocuk Doktoru
- Nörolog

## 💳 Ödeme Entegrasyonu

Proje Razorpay ödeme gateway'i kullanır. Test modunda çalışmak için Razorpay hesabınızdan test API anahtarlarını alın.

## 🔐 Authentication

- JWT (JSON Web Tokens) kullanılır
- Admin, Doktor ve Hasta için ayrı authentication
- Token'lar localStorage'da saklanır
- Bearer token authentication

## 📸 Resim Yükleme

- Cloudinary kullanılır
- Doktor profil resimleri
- Multer ile dosya yükleme

## 🌐 Port Bilgileri

- Backend: `http://localhost:4000`
- Frontend (Hasta): `http://localhost:5173`
- Admin/Doctor Panel: `http://localhost:5174`

## 📝 Notlar

- Tüm şifreler bcrypt ile hash'lenir
- MongoDB için Atlas veya local instance kullanabilirsiniz
- Cloudinary hesabı gereklidir (ücretsiz tier yeterli)
- Razorpay test modu ücretsizdir

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'inizi push edin (`git push origin feature/AmazingFeature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altındadır.

## 👨‍💻 Geliştirici

**Ayman Bajar**
- GitHub: [@aymanbajar](https://github.com/aymanbajar)
