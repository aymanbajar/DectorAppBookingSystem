# Doctor Appointment Booking System

نظام حجز مواعيد طبية مبني بتقنية MERN، ويضم ثلاث واجهات رئيسية: واجهة المرضى، لوحة الإدارة، ولوحة الأطباء. يتيح النظام البحث عن الأطباء، حجز المواعيد، إدارة المرضى، متابعة السجلات الطبية، الوصفات، المحادثات، الإشعارات، والمدفوعات عبر Razorpay.

## روابط التجربة

### واجهة المستخدم

الرابط: https://dector-app-booking-system.vercel.app/

بيانات الدخول التجريبية:

```text
Email: ayman@bajar.com
Password: 12345678
```

### لوحة الإدارة

الرابط:https://dector-app-booking-system-alor.vercel.app

بيانات الدخول التجريبية:

```text
Email: admin@example.com
Password: asd1234
```

### لوحة الطبيب

الرابط: https://dector-app-booking-system-alor.vercel.app

بيانات الدخول التجريبية:

```text
Email: ahmet@yilmaz.com
Password: 12345678
```

## الميزات

### واجهة المرضى

- إنشاء حساب وتسجيل الدخول.
- استعراض الأطباء والتصفية حسب التخصص.
- عرض ملف الطبيب وتفاصيله وتقييماته.
- حجز المواعيد واختيار الوقت المناسب.
- متابعة المواعيد وإلغاء الموعد عند الحاجة.
- الدفع عبر Razorpay والتحقق من عملية الدفع.
- إدارة الملف الشخصي وتحديث البيانات الطبية.
- عرض الوصفات الطبية.
- إضافة الأطباء إلى المفضلة ومقارنة الأطباء.
- عرض آخر الأطباء الذين تمت زيارتهم.
- المحادثة مع الطبيب.
- استقبال الإشعارات ومتابعة غير المقروء منها.
- دعم الوضع الداكن في الواجهة.

### لوحة الطبيب

- تسجيل دخول الطبيب.
- لوحة تحكم تعرض الإحصائيات والمواعيد القريبة.
- عرض المواعيد وتأكيدها أو رفضها أو إكمالها أو إلغاؤها.
- عرض تفاصيل الموعد وتحديث التشخيص والخطة العلاجية والملاحظات.
- إدارة المرضى المرتبطين بالطبيب وسجلاتهم الطبية.
- إضافة وصفات طبية وطلبات تحاليل ومرفقات.
- إدارة الوصفات وتعديلها.
- تحديث ملف الطبيب وساعات العمل والأيام المحجوبة.
- المحادثة مع المرضى.
- استقبال الإشعارات.

### لوحة الإدارة

- تسجيل دخول المدير.
- لوحة تحكم للإحصائيات العامة مثل عدد الأطباء والمرضى والمواعيد والإيرادات.
- إضافة طبيب جديد مع رفع الصورة إلى Cloudinary.
- إدارة قائمة الأطباء وتعديل بياناتهم أو حذفهم.
- الموافقة على الأطباء أو تعطيل حساباتهم.
- إدارة المرضى وتحديث بياناتهم أو تعطيل حساباتهم.
- عرض كل المواعيد وإلغاؤها.
- إدارة التخصصات الطبية.
- إدارة التقييمات وحذف غير المناسب منها.
- إرسال إشعارات جماعية للمرضى أو الأطباء.
- إعدادات الموقع مثل نصوص الصفحة الرئيسية والأطباء المميزين.
- سجل نشاطات إدارية لمتابعة العمليات المهمة.

## التقنيات المستخدمة

### Backend

- Node.js
- Express.js
- MongoDB و Mongoose
- JSON Web Token للتحقق من الهوية
- bcrypt لتشفير كلمات المرور
- Multer لرفع الملفات
- Cloudinary لتخزين الصور والملفات
- Razorpay لمعالجة المدفوعات

### Frontend و Admin

- React
- Vite
- React Router
- Axios
- Tailwind CSS
- React Toastify

## بنية المشروع

```text
DectorAppBookingSystem/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   ├── package.json
│   └── vite.config.js
├── admin/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   ├── package.json
│   └── vite.config.js
└── readme.md
```

## متطلبات التشغيل

- Node.js 20 أو أحدث.
- حساب MongoDB Atlas أو قاعدة MongoDB محلية.
- حساب Cloudinary.
- حساب Razorpay لاستخدام الدفع.

## التشغيل محلياً

### 1. تثبيت المشروع

```bash
git clone https://github.com/aymanbajar/DectorAppBookingSystem.git
cd DectorAppBookingSystem
```

### 2. تشغيل Backend

```bash
cd backend
npm install
```

أنشئ ملف `.env` داخل مجلد `backend`:

```env
PORT=4000
MONGODB_URL=your_mongodb_connection_string
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CURRENCY=TRY
```

ثم شغل الخادم:

```bash
npm run dev
```

سيعمل الخادم افتراضياً على:

```text
http://localhost:4000
```

### 3. تشغيل واجهة المرضى

```bash
cd ../frontend
npm install
```

أنشئ ملف `.env` داخل مجلد `frontend`:

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

ثم شغل الواجهة:

```bash
npm run dev
```

### 4. تشغيل لوحة الإدارة والطبيب

```bash
cd ../admin
npm install
```

أنشئ ملف `.env` داخل مجلد `admin`:

```env
VITE_BACKEND_URL=http://localhost:4000
```

ثم شغل اللوحة:

```bash
npm run dev
```

## أوامر مهمة

### Backend

```bash
npm run dev
npm start
```

### Frontend

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

### Admin

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## أهم مسارات API

### Admin

- `POST /api/admin/login`
- `POST /api/admin/add-doctor`
- `POST /api/admin/all-doctors`
- `GET /api/admin/patients`
- `POST /api/admin/update-doctor/:docId`
- `POST /api/admin/update-patient/:userId`
- `DELETE /api/admin/doctor/:docId`
- `DELETE /api/admin/patient/:userId`
- `GET /api/admin/appointments`
- `POST /api/admin/cancel-appointment`
- `GET /api/admin/dashboard`
- `GET /api/admin/center`
- `POST /api/admin/specialty`
- `POST /api/admin/broadcast`
- `POST /api/admin/site-settings`

### Doctor

- `GET /api/doctor/list`
- `GET /api/doctor/reviews/:docId`
- `POST /api/doctor/login`
- `GET /api/doctor/appointments`
- `GET /api/doctor/appointments/:appointmentId`
- `PUT /api/doctor/appointments/:appointmentId/details`
- `POST /api/doctor/confirm-appointment`
- `POST /api/doctor/reject-appointment`
- `POST /api/doctor/complete-appointment`
- `POST /api/doctor/cancel-appointment`
- `GET /api/doctor/dashboard`
- `GET /api/doctor/profile`
- `POST /api/doctor/update-profile`
- `GET /api/doctor/patients`
- `GET /api/doctor/patient/:userId`
- `POST /api/doctor/patient/:userId/record`
- `POST /api/doctor/patient/:userId/prescription`
- `POST /api/doctor/patient/:userId/file`
- `GET /api/doctor/prescriptions`
- `GET /api/doctor/chats`
- `GET /api/doctor/notifications`

### User / Patient

- `POST /api/user/register`
- `POST /api/user/login`
- `GET /api/user/get-profile`
- `POST /api/user/update-profile`
- `POST /api/user/update-medical-record`
- `POST /api/user/change-password`
- `POST /api/user/book-appointment`
- `GET /api/user/appointments`
- `POST /api/user/cancel-appointment`
- `POST /api/user/payment-razorpay`
- `POST /api/user/verifyRazorpay`
- `GET /api/user/prescriptions`
- `POST /api/user/review`
- `GET /api/user/chats`
- `GET /api/user/chat/:docId`
- `POST /api/user/chat/:docId`
- `GET /api/user/notifications`

### Prescriptions

- `POST /api/prescriptions`
- `GET /api/prescriptions/appointment/:appointmentId`
- `GET /api/prescriptions/patient/:patientId`
- `GET /api/prescriptions/doctor/:doctorId`

## المصادقة والصلاحيات

- يعتمد النظام على JWT.
- توجد صلاحيات منفصلة لكل من المدير والطبيب والمريض.
- توضع رموز الدخول في الهيدر عند استدعاء المسارات المحمية.
- يستخدم النظام bcrypt لتشفير كلمات المرور قبل تخزينها.

## رفع الملفات

- يتم استقبال الملفات عبر Multer.
- يتم رفع صور الأطباء وملفات المرضى إلى Cloudinary.
- يدعم النظام رفع الصور والملفات الطبية المرتبطة بسجل المريض.

## ملاحظات

- قاعدة البيانات الافتراضية في الاتصال هي `prescripto`.
- يجب أن تتطابق قيمة `VITE_RAZORPAY_KEY_ID` في الواجهة مع مفتاح Razorpay المستخدم في الباكند.
- مجلدات `node_modules` غير مطلوبة داخل المستودع عند الرفع إلى GitHub.
- اسم المشروع في المسار الحالي هو `DectorAppBookingSystem` كما هو مستخدم في المستودع.

## المطور

Ayman Bajar

GitHub: https://github.com/aymanbajar
