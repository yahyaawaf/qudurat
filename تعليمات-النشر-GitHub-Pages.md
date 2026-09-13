# خطوات إصلاح ونشر موقع «قدراتي»

النطاق:

`https://qudurat.somaya-mgalad.sa/`

## الخطوة 1: ارفعي النسخة المصححة

ارفعي محتويات المجلد مباشرة إلى جذر فرع `main`، بحيث تظهر الملفات والمجلدات التالية في الصفحة الأولى للمستودع:

- `.github/`
- `app/`
- `public/`
- `next.config.mjs`
- `package.json`

## الخطوة 2: غيّري مصدر GitHub Pages

من:

**Settings → Pages → Build and deployment**

اجعلي:

**Source = GitHub Actions**

ولا تستخدمي **Deploy from a branch** لهذه النسخة.

## الخطوة 3: حافظي على النطاق المخصص

في **Custom domain** اتركي:

`qudurat.somaya-mgalad.sa`

إذا كانت الرسالة:

`DNS check successful`

فإعداد DNS صحيح من جهة GitHub Pages. قد تحتاج شهادة HTTPS بعض الوقت حتى تصدر؛ بعدها يصبح **Enforce HTTPS** متاحًا.

## الخطوة 4: انتظري اكتمال النشر

من تبويب **Actions** افتحي:

`Deploy GitHub Pages`

يجب أن تنجح مرحلتا:

- `build`
- `deploy`

## الخطوة 5: حدّثي الموقع

افتحي:

`https://qudurat.somaya-mgalad.sa/`

ثم اضغطي:

`Ctrl + F5`

أو افتحي نافذة خاصة للتأكد من عدم استخدام نسخة مخبأة.

## سبب الإصلاح

الموقع يستخدم Next.js. ملفات التنسيق والـ JavaScript النهائية تُنشأ داخل `out/_next/` أثناء البناء. لذلك نشر ملفات المصدر مباشرة من فرع `main` لا يعادل نشر الموقع المبني. كذلك استخدام مسار باسم المستودع (`basePath`) غير مناسب عند فتح الموقع من جذر نطاق مخصص.
