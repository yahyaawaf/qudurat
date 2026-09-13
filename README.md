# قدراتي — نسخة GitHub Pages المصححة للنطاق المخصص

هذه النسخة مضبوطة للعمل على:

`https://qudurat.somaya-mgalad.sa/`

## سبب ظهور الموقع بلا تنسيق

من الصور المرفقة، المشكلة الأوضح هي إعداد النشر وليس ملف CSS نفسه:

- إعداد Pages الحالي مضبوط على **Deploy from a branch**.
- المشروع مبني بـ **Next.js** ويحتاج أولًا إلى `next build` ثم نشر مجلد `out`.
- النسخة السابقة كانت تحسب `BASE_PATH` من اسم المستودع، بينما النطاق المخصص يعمل من جذر النطاق. هذا قد يجعل روابط CSS/JavaScript تشير إلى مسار غير موجود، فتظهر الصفحة بلا تنسيق.

## المطلوب بعد رفع هذه النسخة

1. ارفعي محتويات هذه النسخة إلى جذر فرع `main`.
2. افتحي **Settings → Pages → Build and deployment → Source**.
3. غيّري المصدر إلى **GitHub Actions**.
4. اتركي **Custom domain** على `qudurat.somaya-mgalad.sa`.
5. افتحي تبويب **Actions** وانتظري نجاح Workflow باسم **Deploy GitHub Pages**.
6. بعد نجاح النشر افتحي الموقع واضغطي `Ctrl + F5`.
7. عندما يصدر GitHub شهادة TLS، فعّلي **Enforce HTTPS**.

## ما تم تعديله

- تثبيت `basePath: ""` صراحةً حتى تُبنى أصول CSS/JavaScript من جذر النطاق المخصص.
- إبقاء الموقع على جذر النطاق المخصص.
- استخدام Workflow GitHub Pages الرسمي لبناء Next.js ورفع مجلد `out`.
- استخدام `actions/upload-pages-artifact@v4` و`actions/deploy-pages@v4`.
- التحقق أثناء النشر من وجود `out/index.html` و`out/_next` والصورة الرئيسية.
- فشل النشر تلقائيًا إذا ظهر المسار القديم `/qudurat/_next/` في الناتج.
- إنشاء `out/.nojekyll` بعد البناء كإجراء حماية إضافي لمجلد `_next`.
- التحقق من أن ملف CSS المشار إليه في `out/index.html` موجود فعليًا داخل `out/_next/static/css/`.
- الإبقاء على `public/.nojekyll`.

> ملاحظة: عند النشر عبر GitHub Actions، إعداد **Custom domain** في Settings هو المرجع الأساسي، ولا يلزم ملف `CNAME` داخل المشروع.
