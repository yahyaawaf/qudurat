/** @type {import('next').NextConfig} */
const nextConfig = {
  // النطاق المخصص يعمل من جذر الموقع مباشرة، لذلك لا نستخدم basePath باسم المستودع.
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
