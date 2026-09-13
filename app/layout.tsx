import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "قدراتي | للقدرات والتحصيلي",
  description: "قدراتي منصة عربية أنيقة للشروحات والملفات والاختبارات التفاعلية للقدرات والتحصيلي.",
  authors: [{ name: "المعلمة أمل الزهراني" }],
  creator: "المعلمة أمل الزهراني - الثانوية 107",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
