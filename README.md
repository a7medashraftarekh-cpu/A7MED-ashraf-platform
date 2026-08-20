# 🎓 A7MED Ashraf LMS

منصة تعلم برمجي متكاملة بتقنية **Evo LMS** — منصة حديثة لإدارة الدورات التعليمية والفيديوهات والامتحانات.

## ⚡ المميزات

- ✅ لوحة تحكم Admin كاملة
- ✅ رفع فيديوهات تعليمية
- ✅ إنشاء امتحانات متعددة الخيارات
- ✅ إدارة الطلاب والتقدم
- ✅ تصميم عصري ومتجاوب
- ✅ مصادقة JWT آمنة

## 🔐 بيانات الدخول

| الحقل | القيمة |
|-------|--------|
| اسم المستخدم | `A7MED ashraf` |
| كلمة المرور | `Af.12345` |

## 🚀 خطوات التشغيل

### 1. المتطلبات
- Node.js (v18+)
- MongoDB

### 2. التثبيت
```bash
npm install
```

### 3. تشغيل MongoDB
```bash
mongod
```

### 4. تشغيل السيرفر
```bash
npm run dev
```

### 5. الفتح في المتصفح
```
http://localhost:5000
```

## 📁 ملفات المشروع (هيكل مسطح)

```
a7med-ashraf-lms/
├── package.json
├── .env
├── README.md
├── server.js          ← السيرفر الرئيسي
├── auth.js            ← تسجيل الدخول
├── courses.js         ← الدورات والفيديوهات
├── exams.js           ← الامتحانات
├── Course.js          ← نموذج الدورات
├── Exam.js            ← نموذج الامتحانات
├── User.js            ← نموذج المستخدمين
├── index.html         ← الواجهة الأمامية
├── style.css          ← التصميم
├── app.js             ← المنطق التفاعلي
└── uploads/           ← مجلد رفع الفيديوهات
```

## 🌐 الاستضافة السحابية

### Render
1. اربط Repo GitHub
2. اضبط Build: `npm install`
3. اضبط Start: `npm start`
4. أضف Environment Variables من ملف `.env`
5. استخدم MongoDB Atlas للقاعدة

### Railway
1. Deploy من GitHub
2. أضف MongoDB من Marketplace
3. أضف Environment Variables
4. اضبط Start Command: `npm start`

---
**صنع بحب ❤️ بواسطة A7MED Ashraf**
