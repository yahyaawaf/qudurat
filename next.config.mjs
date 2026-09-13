/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages يعمل هنا عبر النطاق المخصص من جذر الموقع:
  // https://qudurat.somaya-mgalad.sa/
  // لذلك يجب ألا نضيف اسم المستودع إلى مسارات CSS/JS والصور.
  output: "export",
  basePath: "",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
