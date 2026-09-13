"use client";

import {
  Activity,
  Award,
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  CloudUpload,
  Download,
  Eye,
  FileText,
  FolderOpen,
  Gauge,
  GraduationCap,
  Home,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Newspaper,
  BrainCircuit,
  Calculator,
  Gamepad2,
  Languages,
  Link2,
  PlayCircle,
  Plus,
  Puzzle,
  Printer,
  Save,
  Search,
  Send,
  Settings,
  School,
  Sparkles,
  Trophy,
  Upload,
  UserRound,
  Users,
  Video,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { articleCategories, knowledgeArticles, sourcesForCategory, type ArticleCategoryId, type KnowledgeArticle } from "./articles-data";

type View = "home" | "lessons" | "category-lessons" | "verbal-lessons" | "mansaf-foundation" | "mansaf-training" | "mansaf-files" | "mansaf-file-group" | "lesson" | "files" | "file-category" | "year-files" | "tests" | "test" | "games" | "game" | "articles" | "article" | "contact" | "login" | "dashboard";
type DashboardTab = "overview" | "add-lesson" | "add-file" | "add-test" | "students" | "messages" | "settings";
type LessonCategory = "قدرات لفظي" | "قدرات كمي" | "استيب" | "المفكر";
type FileLibraryCategory = "تجميع السنوات السابقة";
type MansafFileGroup = "ملفات تأسيس المنصف" | "ملفات بنوك المنصف" | "ملفات زبدة المنصف";
type PreviousYear = "1434" | "1435" | "1436" | "1437" | "1438" | "1439" | "1440" | "1441" | "1442" | "1443" | "1444";

type Lesson = {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  videoUrl: string;
  published: boolean;
};

type LearningFile = {
  id: string;
  title: string;
  type: string;
  size: string;
  url: string;
  lessonId?: string;
};

type TestItem = {
  id: string;
  title: string;
  questions: number;
  minutes: number;
  category: string;
  description?: string;
  level?: "متوسط" | "متقدم" | "شامل";
};

type TestQuestion = {
  id: string;
  text: string;
  choices: string[];
  correct: number;
  explanation: string;
  passage?: string;
};

type StudentTestResult = {
  title: string;
  score: number;
  date: string;
};

type StudentGameResult = {
  title: string;
  score: number;
  date: string;
  certificate: boolean;
};

type StudentActivityEntry = {
  area: string;
  item: string;
  action: string;
  date: string;
};

type StudentCertificate = {
  title: string;
  gameTitle: string;
  issuedAt: string;
  certificateNumber: string;
};

type StudentRecord = {
  id: string;
  name: string;
  grade: string;
  classroom: string;
  lastActive: string;
  lastLocation: string;
  visits: number;
  status: "متصلة الآن" | "نشطة اليوم" | "غير متصلة";
  tests: StudentTestResult[];
  games: StudentGameResult[];
  activities: StudentActivityEntry[];
  certificates: StudentCertificate[];
};

type CertificatePreview = {
  studentName: string;
  activityTitle: string;
  activityType: "لعبة تعليمية" | "اختبار تفاعلي";
  score: number;
  issuedAt: string;
  certificateNumber: string;
};

type GameMode = "multiple-choice" | "fill-blank" | "wheel" | "matching" | "ordering" | "true-false";

type GameStage = {
  title: string;
  question?: string;
  choices?: string[];
  correct?: number;
  acceptedAnswers?: string[];
  pairs?: { left: string; right: string }[];
  orderItems?: string[];
  correctOrder?: string[];
};

type AbilityGame = {
  id: string;
  title: string;
  typeLabel: string;
  description: string;
  subject: "قدرات لفظي" | "قدرات كمي" | "قدرات متنوعة";
  sourceLabel: string;
  icon: typeof Link2;
  mode: GameMode;
  stages: GameStage[];
};

const demoStudents: StudentRecord[] = [
  {
    id: "student-sarah",
    name: "سارة أحمد",
    grade: "الصف الثالث الثانوي",
    classroom: "3 / أ",
    lastActive: "اليوم، 10:42 ص",
    lastLocation: "الألعاب ← سباق الحساب الذهني",
    visits: 42,
    status: "متصلة الآن",
    tests: [
      { title: "اختبار القدرات الكمي 1", score: 92, date: "10 أغسطس 2026" },
      { title: "اختبار التناظر اللفظي", score: 86, date: "8 أغسطس 2026" },
      { title: "اختبار استيعاب المقروء", score: 87, date: "5 أغسطس 2026" },
    ],
    games: [
      { title: "سباق الحساب الذهني", score: 100, date: "اليوم، 10:40 ص", certificate: true },
      { title: "تحدي التناظر اللفظي", score: 90, date: "8 أغسطس 2026", certificate: true },
      { title: "لغز التفكير المنطقي", score: 80, date: "6 أغسطس 2026", certificate: false },
    ],
    activities: [
      { area: "الألعاب", item: "سباق الحساب الذهني", action: "أكملت اللعبة", date: "اليوم، 10:40 ص" },
      { area: "الاختبارات", item: "اختبار القدرات الكمي 1", action: "أنهت الاختبار بدرجة 92%", date: "اليوم، 10:18 ص" },
      { area: "الشرح", item: "تدريب المنصف — الدرس 21", action: "شاهدت الدرس", date: "أمس، 8:25 م" },
      { area: "الملفات", item: "زبدة القدرات (20) محلول", action: "حمّلت الملف", date: "أمس، 8:02 م" },
    ],
    certificates: [
      { title: "شهادة إنجاز", gameTitle: "سباق الحساب الذهني", issuedAt: "10 أغسطس 2026", certificateNumber: "QD-2026-1042" },
      { title: "شهادة إنجاز", gameTitle: "تحدي التناظر اللفظي", issuedAt: "8 أغسطس 2026", certificateNumber: "QD-2026-0831" },
    ],
  },
  {
    id: "student-layan",
    name: "ليان محمد",
    grade: "الصف الثاني الثانوي",
    classroom: "2 / ب",
    lastActive: "أمس، 9:15 م",
    lastLocation: "الشرح ← تأسيس المنصف",
    visits: 31,
    status: "غير متصلة",
    tests: [
      { title: "اختبار القدرات اللفظي 1", score: 84, date: "9 أغسطس 2026" },
      { title: "اختبار إكمال الجمل", score: 78, date: "6 أغسطس 2026" },
    ],
    games: [
      { title: "مفردات القدرات", score: 90, date: "9 أغسطس 2026", certificate: true },
      { title: "تحدي التناظر اللفظي", score: 75, date: "4 أغسطس 2026", certificate: false },
    ],
    activities: [
      { area: "الشرح", item: "تأسيس المنصف — الدرس 12", action: "شاهدت الدرس", date: "أمس، 9:15 م" },
      { area: "الألعاب", item: "مفردات القدرات", action: "أكملت اللعبة", date: "9 أغسطس، 7:30 م" },
      { area: "الاختبارات", item: "اختبار القدرات اللفظي 1", action: "أنهت الاختبار بدرجة 84%", date: "9 أغسطس، 7:08 م" },
    ],
    certificates: [
      { title: "شهادة إنجاز", gameTitle: "مفردات القدرات", issuedAt: "9 أغسطس 2026", certificateNumber: "QD-2026-0917" },
    ],
  },
  {
    id: "student-reem",
    name: "ريم خالد",
    grade: "الصف الثالث الثانوي",
    classroom: "3 / ب",
    lastActive: "اليوم، 9:08 ص",
    lastLocation: "الاختبارات ← اختبار شامل",
    visits: 55,
    status: "نشطة اليوم",
    tests: [
      { title: "اختبار شامل قدرات", score: 96, date: "10 أغسطس 2026" },
      { title: "اختبار القدرات الكمي 2", score: 91, date: "7 أغسطس 2026" },
      { title: "اختبار استيعاب المقروء", score: 92, date: "3 أغسطس 2026" },
    ],
    games: [
      { title: "لغز التفكير المنطقي", score: 100, date: "7 أغسطس 2026", certificate: true },
      { title: "سباق الحساب الذهني", score: 100, date: "5 أغسطس 2026", certificate: true },
    ],
    activities: [
      { area: "الاختبارات", item: "اختبار شامل قدرات", action: "أنهت الاختبار بدرجة 96%", date: "اليوم، 9:08 ص" },
      { area: "الملفات", item: "مراجعة القدرات الكمي", action: "حمّلت الملف", date: "أمس، 6:10 م" },
      { area: "الألعاب", item: "لغز التفكير المنطقي", action: "حصلت على شهادة", date: "7 أغسطس، 8:02 م" },
    ],
    certificates: [
      { title: "شهادة إنجاز", gameTitle: "لغز التفكير المنطقي", issuedAt: "7 أغسطس 2026", certificateNumber: "QD-2026-0774" },
      { title: "شهادة إنجاز", gameTitle: "سباق الحساب الذهني", issuedAt: "5 أغسطس 2026", certificateNumber: "QD-2026-0542" },
    ],
  },
  {
    id: "student-joud",
    name: "جود عبدالله",
    grade: "الصف الأول الثانوي",
    classroom: "1 / أ",
    lastActive: "اليوم، 8:20 ص",
    lastLocation: "الملفات ← ملفات STEP",
    visits: 18,
    status: "نشطة اليوم",
    tests: [
      { title: "اختبار تمهيدي قدرات", score: 76, date: "9 أغسطس 2026" },
      { title: "اختبار المفردات", score: 82, date: "6 أغسطس 2026" },
    ],
    games: [
      { title: "مفردات القدرات", score: 85, date: "8 أغسطس 2026", certificate: false },
    ],
    activities: [
      { area: "الملفات", item: "استراتيجيات الريدنق", action: "فتحت الملف", date: "اليوم، 8:20 ص" },
      { area: "الشرح", item: "تأسيس المنصف — الدرس 4", action: "شاهدت الدرس", date: "9 أغسطس، 5:11 م" },
      { area: "الاختبارات", item: "اختبار تمهيدي قدرات", action: "أنهت الاختبار بدرجة 76%", date: "9 أغسطس، 4:45 م" },
    ],
    certificates: [],
  },
];

const quantitativeSections = [
  {
    title: "تأسيس المنصف",
    count: 19,
    availableCount: 16,
    description: "ابدأ من الأساسيات والقواعد المهمة قبل الانتقال إلى التدريب.",
    icon: GraduationCap,
  },
  {
    title: "تدريب المنصف",
    count: 126,
    availableCount: 33,
    description: "تدريبات كمية متدرجة لترسيخ المهارات ورفع سرعة الحل.",
    icon: Calculator,
  },
  {
    title: "ملفات المنصف",
    count: 125,
    availableCount: 27,
    description: "ملفات وبنوك تدريبية منظمة للمراجعة والتطبيق المستمر.",
    icon: FolderOpen,
  },
];

const quantitativeLessonCount = quantitativeSections.reduce((total, section) => total + section.count, 0);

const stepFiles = [
  "ملف المحاضرات التمهيدية – قرامر",
  "استراتيجيات الريدنق – غير محلول",
  "استراتيجيات الريدنق – محلول",
  "ريدنق تمهيدي – غير محلول",
  "ريدنق تمهيدي – محلول",
  "ملف المحاضرات التمهيدية – ليسننق غير محلول",
  "ملف المحاضرات التمهيدية – ليسننق محلول",
  "نماذج الريدنق – غير محلولة",
  "نماذج الريدنق – محلولة",
  "شرح القرامر – غير محلول",
  "شرح القرامر – محلول",
  "مراجعة القرامر – غير محلول",
  "مراجعة القرامر – محلول",
  "ملف استثناءات القواعد – غير محلول",
  "ملف استثناءات القواعد – محلول",
  "نماذج القرامر لشهر أغسطس – غير محلولة",
  "نماذج القرامر لشهر أغسطس – محلولة",
  "استراتيجيات الليسننق",
  "نماذج الليسننق – غير محلولة",
  "نماذج الليسننق – محلولة",
  "مراجعة أول 8 قواعد",
  "نماذج بدون مقاطع",
  "القطع الأكثر تكرارًا – غير محلولة",
  "القطع الأكثر تكرارًا – محلولة",
  "كبسولة الإنقاذ",
];
const uploadedStepFiles: Record<number, { url: string; downloadName: string; size: string }> = {
  1: { url: "files/step-01.pdf", downloadName: "ملف المحاضرات التمهيدية قرامر.pdf", size: "2.7 ميجابايت" },
  2: { url: "files/step-02.pdf", downloadName: "استراتيجيات الريدنق غير محلول.pdf", size: "4.3 ميجابايت" },
  3: { url: "files/step-03.pdf", downloadName: "استراتيجيات الريدنق محلول.pdf", size: "5.0 ميجابايت" },
  4: { url: "files/step-04.pdf", downloadName: "ريدنق تمهيدي غير محلول.pdf", size: "0.9 ميجابايت" },
  5: { url: "files/step-05.pdf", downloadName: "ريدنق تمهيدي محلول.pdf", size: "0.9 ميجابايت" },
  6: { url: "files/step-06.pdf", downloadName: "المحاضرات التمهيدية ليسننق غير محلول.pdf", size: "6.7 ميجابايت" },
  7: { url: "files/step-07.pdf", downloadName: "المحاضرات التمهيدية ليسننق محلول.pdf", size: "8.4 ميجابايت" },
  8: { url: "files/step-08.pdf", downloadName: "نماذج الريدنق غير محلولة.pdf", size: "5.8 ميجابايت" },
  9: { url: "files/step-09.pdf", downloadName: "نماذج الريدنق محلولة.pdf", size: "5.8 ميجابايت" },
  10: { url: "files/step-10.pdf", downloadName: "شرح القرامر غير محلول.pdf", size: "5.7 ميجابايت" },
  11: { url: "files/step-11.pdf", downloadName: "شرح القرامر محلول.pdf", size: "4.2 ميجابايت" },
  12: { url: "files/step-12.pdf", downloadName: "مراجعة قرامر غير محلول.pdf", size: "1.4 ميجابايت" },
  13: { url: "files/step-13.pdf", downloadName: "مراجعة قرامر محلول.pdf", size: "1.4 ميجابايت" },
  14: { url: "files/step-14.pdf", downloadName: "استثناءات القواعد غير محلول.pdf", size: "1.5 ميجابايت" },
  15: { url: "files/step-15.pdf", downloadName: "استثناءات القواعد محلول.pdf", size: "1.6 ميجابايت" },
  16: { url: "files/step-16.pdf", downloadName: "نماذج القرامر أغسطس غير محلول.pdf", size: "3.0 ميجابايت" },
  17: { url: "files/step-17.pdf", downloadName: "نماذج القرامر أغسطس محلول.pdf", size: "3.1 ميجابايت" },
  18: { url: "files/step-18.pdf", downloadName: "استراتيجيات الليسننق.pdf", size: "0.6 ميجابايت" },
  19: { url: "files/step-19.pdf", downloadName: "نماذج الليسننق غير محلولة.pdf", size: "0.7 ميجابايت" },
  20: { url: "files/step-20.pdf", downloadName: "نماذج الليسننق محلولة.pdf", size: "0.8 ميجابايت" },
  21: { url: "files/step-21.pdf", downloadName: "مراجعة أول 8 قواعد.pdf", size: "0.7 ميجابايت" },
  22: { url: "files/step-22.pdf", downloadName: "نماذج بدون مقاطع.pdf", size: "0.4 ميجابايت" },
  23: { url: "files/step-23.pdf", downloadName: "القطع الأكثر تكرارًا غير محلول.pdf", size: "0.3 ميجابايت" },
  24: { url: "files/step-24.pdf", downloadName: "القطع الأكثر تكرارًا محلولة.pdf", size: "0.6 ميجابايت" },
  25: { url: "files/step-25.pdf", downloadName: "كبسولة الإنقاذ.pdf", size: "1.2 ميجابايت" },
};

const mansafFiles = Array.from({ length: 34 }, (_, index) => {
  const number = index + 1;
  const title = `زبدة القدرات ( ${number} ) محلول`;
  const sizes = ["5.7", "5.7", "5.2", "5.7", "5.2", "5.2", "1.5", "5.7", "5.5", "5.6", "5.6", "5.7", "1.5", "5.7", "1.5", "1.5", "1.6", "5.7", "1.6", "1.5", "1.6", "5.7", "5.7", "1.5", "5.7", "1.5", "1.6", "1.5", "1.6", "1.5", "1.5", "1.5", "1.6", "1.6"];
  const sourceNumbers = [1, 1, 3, 1, 5, 6, 7, 1, 9, 10, 11, 1, 13, 1, 15, 16, 17, 1, 19, 20, 21, 1, 1, 24, 1, 26, 27, 28, 27, 30, 31, 32, 33, 34];
  return {
    title,
    url: `files/zobdat-almonsef-${String(sourceNumbers[index]).padStart(2, "0")}.pdf`,
    downloadName: `زبدة القدرات (${number}) محلول.pdf`,
    size: `${sizes[index]} ميجابايت`,
  };
});
const mansafFoundationFiles = [
  {
    title: "ملف تأسيس المنصف + تمارين على التأسيس",
    url: "files/mansaf-foundation-exercises.pdf",
    downloadName: "ملف تأسيس المنصف + تمارين على التأسيس.pdf",
    size: "14.7 ميجابايت",
  },
  {
    title: "ملف تأسيس المنصف الخاص بمقاطع الشرح",
    url: "files/mansaf-foundation-explanation-videos.pdf",
    downloadName: "ملف تأسيس المنصف الخاص بمقاطع الشرح.pdf",
    size: "1.9 ميجابايت",
  },
];
const mansafBankFiles = Array.from({ length: 30 }, (_, index) => {
  const number = index + 1;
  const uploadedSizes = ["2.0", "8.2", "1.7", "1.7", "8.2", "1.8", "8.2", "2.2", "8.2", "1.9", "8.2", "2.0", "8.2", "1.8", "1.9", "8.2", "1.8", "8.2", "1.9", "8.2", "1.8", "1.8", "7.9", "1.7", "7.9", "1.9", "1.8", "1.8", "7.9", "1.8"];
  const sourceNumbers = [1, 2, 3, 4, 2, 6, 2, 8, 2, 10, 2, 12, 2, 14, 15, 2, 17, 2, 19, 2, 21, 22, 2, 24, 2, 26, 27, 28, 2, 30];
  const sourceNumber = sourceNumbers[index];
  const size = uploadedSizes[index];
  return {
    title: `بنك المنصف ( ${number} )`,
    url: sourceNumber === 1
      ? "files/bank-almonsef-01.pdf"
      : sourceNumber === 2
        ? "files/zobdat-almonsef-27.pdf"
        : `files/bank-almonsef-${String(sourceNumber).padStart(2, "0")}.pdf`,
    downloadName: `بنك المنصف (${number}).pdf`,
    size: `${size} ميجابايت`,
  };
});
const mansafFilesPerPage = 10;
const mansafFileGroups: { title: MansafFileGroup; count: number }[] = [
  { title: "ملفات تأسيس المنصف", count: 2 },
  { title: "ملفات بنوك المنصف", count: 30 },
  { title: "ملفات زبدة المنصف", count: 34 },
];
const fileLibraryCategories: { title: FileLibraryCategory }[] = [
  { title: "تجميع السنوات السابقة" },
];

const previousYears1434Files = [
  {
    title: "تجميع 1434 بنات - فترة أولى",
    url: "files/previous-years-1434-01.pdf",
    downloadName: "تجميع 1434 بنات - فترة أولى.pdf",
    size: "2.3 ميجابايت",
  },
  {
    title: "تجميع البنات الجزء اللفظي 1434",
    url: "files/previous-years-1434-02.pdf",
    downloadName: "تجميع البنات الجزء اللفظي 1434.pdf",
    size: "2.3 ميجابايت",
  },
  {
    title: "تجميع 1434 - بنات - الفترة الثانية - نسخة",
    url: "files/previous-years-1434-03.pdf",
    downloadName: "تجميع 1434 - بنات - الفترة الثانية - نسخة.pdf",
    size: "1.1 ميجابايت",
  },
  {
    title: "تجميع بنات 1434",
    url: "files/previous-years-1434-04.pdf",
    downloadName: "تجميع بنات 1434.pdf",
    size: "1.9 ميجابايت",
  },
  {
    title: "غير محلولة بنات",
    url: "files/previous-years-1434-05.pdf",
    downloadName: "غير محلولة بنات.pdf",
    size: "2.0 ميجابايت",
  },
];

const previousYears1435Files = [
  {
    title: "التجميع الكمي 1435 الفترة الأولى غير المحلول",
    url: "files/previous-years-1435-01.pdf",
    downloadName: "التجميع الكمي 1435 الفترة الأولى غير المحلول.pdf",
    size: "2.4 ميجابايت",
  },
  {
    title: "تجميع الكمي 1435 الفترة الأولى",
    url: "files/previous-years-1435-02.pdf",
    downloadName: "تجميع الكمي 1435 الفترة الأولى.pdf",
    size: "4.5 ميجابايت",
  },
  {
    title: "تجميع اللفظي 1435 الفترة الأولى - نسخة غير محلولة",
    url: "files/previous-years-1435-03.pdf",
    downloadName: "تجميع اللفظي 1435 الفترة الأولى - نسخة غير محلولة.pdf",
    size: "1.3 ميجابايت",
  },
  {
    title: "تجميع اللفظي 1435 الفترة الأولى",
    url: "files/previous-years-1435-04.pdf",
    downloadName: "تجميع اللفظي 1435 الفترة الأولى.pdf",
    size: "1.3 ميجابايت",
  },
  {
    title: "تجميع الفترة الثانية 1435 هـ كمي - غير محلول",
    url: "files/previous-years-1435-05.pdf",
    downloadName: "تجميع الفترة الثانية 1435 هـ كمي -غير محلول.pdf",
    size: "2.4 ميجابايت",
  },
  {
    title: "تجميع الفترة الثانية 1435 هـ كمي - محلول",
    url: "files/previous-years-1435-06.pdf",
    downloadName: "تجميع الفترة الثانية 1435 هـ كمي -محلول.pdf",
    size: "2.9 ميجابايت",
  },
  {
    title: "تجميع الفترة الثانية 1435 هـ لفظي - غير محلول",
    url: "files/previous-years-1435-07.pdf",
    downloadName: "تجميع الفترة الثانية 1435 هـ لفظي - غير محلول.pdf",
    size: "5.6 ميجابايت",
  },
  {
    title: "تجميع الفترة الثانية 1435 هـ لفظي - محلول",
    url: "files/previous-years-1435-08.pdf",
    downloadName: "تجميع الفترة الثانية 1435 هـ لفظي -محلول.pdf",
    size: "5.8 ميجابايت",
  },
];

const previousYears1436Files = [
  {
    title: "تجميع الفترة الأولى 1436 هـ - كمي - غير محلول",
    url: "files/previous-years-1436-01.pdf",
    downloadName: "تجميع الفترة الأولى 1436 هـ - كمي - غير محلول.pdf",
    size: "1.9 ميجابايت",
  },
  {
    title: "تجميع الفترة الأولى 1436 هـ - كمي - محلول",
    url: "files/previous-years-1436-02.pdf",
    downloadName: "تجميع الفترة الأولى 1436 هـ - كمي - محلول.pdf",
    size: "2.4 ميجابايت",
  },
  {
    title: "تجميع الفترة الأولى 1436 هـ - لفظي - غير محلول",
    url: "files/previous-years-1436-03.pdf",
    downloadName: "تجميع الفترة الأولى 1436 هـ - لفظي - غير محلول.pdf",
    size: "5.4 ميجابايت",
  },
  {
    title: "تجميع الفترة الأولى 1436 هـ - لفظي - محلول",
    url: "files/previous-years-1436-04.pdf",
    downloadName: "تجميع الفترة الأولى 1436 هـ - لفظي - محلول.pdf",
    size: "6.6 ميجابايت",
  },
  {
    title: "الخميس 21-5",
    url: "files/previous-years-1436-05.pdf",
    downloadName: "الخميس 21-5.pdf",
    size: "0.5 ميجابايت",
  },
  {
    title: "تجميع كمي ولفظي - الفترة الثانية 1436 - الأسبوع الأول",
    url: "files/previous-years-1436-06.pdf",
    downloadName: "تجميع كمي ولفظي - الفترة الثانية 1436 - الأسبوع الأول.pdf",
    size: "1.4 ميجابايت",
  },
  {
    title: "تجميع الفترة الثانية 1436 هـ - كمي - غير محلول",
    url: "files/previous-years-1436-07.pdf",
    downloadName: "تجميع الفترة الثانية 1436 هـ - كمي - غير محلول.pdf",
    size: "4.1 ميجابايت",
  },
  {
    title: "تجميع الفترة الثانية 1436 هـ - كمي - محلول",
    url: "files/previous-years-1436-08.pdf",
    downloadName: "تجميع الفترة الثانية 1436 هـ - كمي - محلول.pdf",
    size: "5.4 ميجابايت",
  },
  {
    title: "تجميع الفترة الثانية 1436 هـ - لفظي - غير محلول",
    url: "files/previous-years-1436-09.pdf",
    downloadName: "تجميع الفترة الثانية 1436 هـ - لفظي - غير محلول.pdf",
    size: "3.9 ميجابايت",
  },
  {
    title: "تجميع الفترة الثانية 1436 هـ - لفظي - محلول",
    url: "files/previous-years-1436-10.pdf",
    downloadName: "تجميع الفترة الثانية 1436 هـ - لفظي - محلول.pdf",
    size: "4.0 ميجابايت",
  },
  {
    title: "تجميع يوم 15-5 الجمعة - غير محلول",
    url: "files/previous-years-1436-11.pdf",
    downloadName: "تجميع يوم 15-5 الجمعة غير محلول.pdf",
    size: "0.5 ميجابايت",
  },
  {
    title: "تجميع يوم 15-5 الجمعة - محلول",
    url: "files/previous-years-1436-12.pdf",
    downloadName: "تجميع يوم 15-5 الجمعة محلول.pdf",
    size: "0.6 ميجابايت",
  },
  {
    title: "تجميع يوم الأحد 17-5 - غير محلول",
    url: "files/previous-years-1436-13.pdf",
    downloadName: "تجميع يوم الأحد 17-5 غير محلول.pdf",
    size: "0.5 ميجابايت",
  },
  {
    title: "تجميع يوم الأحد 17-5 - محلول",
    url: "files/previous-years-1436-14.pdf",
    downloadName: "تجميع يوم الأحد 17-5 محلول.pdf",
    size: "0.6 ميجابايت",
  },
  {
    title: "تجميع يوم السبت 16-5 مسائي - غير محلول",
    url: "files/previous-years-1436-15.pdf",
    downloadName: "تجميع يوم السبت 16-5 مسائي غير محلول.pdf",
    size: "0.4 ميجابايت",
  },
  {
    title: "تجميع يوم السبت 16-5 مسائي - محلول",
    url: "files/previous-years-1436-16.pdf",
    downloadName: "تجميع يوم السبت 16-5 مسائي محلول.pdf",
    size: "0.5 ميجابايت",
  },
  {
    title: "تجميع يوم السبت 16-5 صباحي - غير محلول",
    url: "files/previous-years-1436-17.pdf",
    downloadName: "تجميع يوم السبت 16-5 صباحي غير محلول.pdf",
    size: "0.5 ميجابايت",
  },
  {
    title: "تجميع يوم السبت 16-5 صباحي - محلول",
    url: "files/previous-years-1436-18.pdf",
    downloadName: "تجميع يوم السبت 16-5 صباحي محلول.pdf",
    size: "0.6 ميجابايت",
  },
  {
    title: "تجميع يوم الخميس 21-5 - غير محلول",
    url: "files/previous-years-1436-19.pdf",
    downloadName: "تجميع يوم الخميس 21-5 غير محلول.pdf",
    size: "0.5 ميجابايت",
  },
  {
    title: "تجميع يوم الخميس 21-5 - محلول",
    url: "files/previous-years-1436-20.pdf",
    downloadName: "تجميع يوم الخميس 21-5 محلول.pdf",
    size: "0.6 ميجابايت",
  },
];

const previousYears1437Files = [
  {
    title: "السبت 2-2 كمي - محلول",
    url: "files/previous-years-1437-01.pdf",
    downloadName: "السبت 2-2 كمي - محلول.pdf",
    size: "1.3 ميجابايت",
  },
  {
    title: "تجميع الفترة الأولى 1437 هـ - كمي - غير محلول",
    url: "files/previous-years-1437-02.pdf",
    downloadName: "تجميع الفترة الأولى 1437 هـ - كمي - غير محلول.pdf",
    size: "1.1 ميجابايت",
  },
  {
    title: "تجميع الفترة الأولى 1437 هـ - كمي - محلول",
    url: "files/previous-years-1437-03.pdf",
    downloadName: "تجميع الفترة الأولى 1437 هـ - كمي - محلول.pdf",
    size: "1.4 ميجابايت",
  },
  {
    title: "تجميع الفترة الأولى 1437 هـ - لفظي - غير محلول",
    url: "files/previous-years-1437-04.pdf",
    downloadName: "تجميع الفترة الأولى 1437 هـ - لفظي - غير محلول.pdf",
    size: "2.7 ميجابايت",
  },
  {
    title: "تجميع الفترة الأولى 1437 هـ - لفظي - محلول",
    url: "files/previous-years-1437-05.pdf",
    downloadName: "تجميع الفترة الأولى 1437 هـ - لفظي - محلول.pdf",
    size: "3.1 ميجابايت",
  },
];

const previousYears1438Files = [
  {
    title: "تجميع الفترة الأولى 1438 هـ - كمي - محلول",
    url: "files/previous-years-1438-01.pdf",
    downloadName: "تجميع الفترة الأولى 1438 هـ - كمي - محلول.pdf",
    size: "5.5 ميجابايت",
  },
  {
    title: "تجميع الفترة الأولى 1438 هـ - لفظي - محلول",
    url: "files/previous-years-1438-02.pdf",
    downloadName: "تجميع الفترة الأولى 1438 هـ - لفظي - محلول.pdf",
    size: "5.5 ميجابايت",
  },
  {
    title: "تجميع الفترة الثانية 1438 هـ - كمي - محلول",
    url: "files/previous-years-1438-03.pdf",
    downloadName: "تجميع الفترة الثانية 1438 هـ - كمي - محلول.pdf",
    size: "4.6 ميجابايت",
  },
  {
    title: "تجميع الفترة الثانية 1438 هـ - كمي - غير محلول",
    url: "files/previous-years-1438-04.pdf",
    downloadName: "تجميع الفترة الثانية 1438 هـ - كمي - غير محلول.pdf",
    size: "2.3 ميجابايت",
  },
  {
    title: "تجميع الفترة الثانية 1438 هـ - لفظي - محلول",
    url: "files/previous-years-1438-05.pdf",
    downloadName: "تجميع الفترة الثانية 1438 هـ - لفظي - محلول.pdf",
    size: "4.8 ميجابايت",
  },
  {
    title: "تجميع الفترة الثانية 1438 هـ - لفظي - غير محلول",
    url: "files/previous-years-1438-06.pdf",
    downloadName: "تجميع الفترة الثانية 1438 هـ - لفظي - غير محلول.pdf",
    size: "4.4 ميجابايت",
  },
];

// ملفات التجميع المعتمدة لعام 1439هـ.
const previousYears1439Files = [
  { title: "تجميع الفترة الأولى 1439 هـ - لفظي - غير محلول", url: "files/previous-years-1439-01.pdf", downloadName: "تجميع الفترة الأولى 1439 هـ - لفظي - غير محلول.pdf", size: "5.3 ميجابايت" },
  { title: "تجميع الفترة الأولى 1439 هـ - لفظي - محلول", url: "files/previous-years-1439-02.pdf", downloadName: "تجميع الفترة الأولى 1439 هـ - لفظي - محلول.pdf", size: "5.5 ميجابايت" },
  { title: "تجميع الفترة الأولى 1439 هـ - كمي - غير محلول", url: "files/previous-years-1439-03.pdf", downloadName: "تجميع الفترة الأولى 1439 هـ - كمي - غير محلول.pdf", size: "5.4 ميجابايت" },
  { title: "تجميع الفترة الأولى 1439 هـ - كمي - محلول", url: "files/previous-years-1439-04.pdf", downloadName: "تجميع الفترة الأولى 1439 هـ - كمي - محلول.pdf", size: "7.2 ميجابايت" },
  { title: "تجميع الفترة الثانية 1439 هـ - كمي - محلول", url: "files/previous-years-1439-05.pdf", downloadName: "تجميع الفترة الثانية 1439 هـ - كمي - محلول.pdf", size: "8.0 ميجابايت" },
  { title: "تجميع الفترة الثانية 1439 هـ - لفظي - غير محلول", url: "files/previous-years-1439-06.pdf", downloadName: "تجميع الفترة الثانية 1439 هـ - لفظي - غير محلول.pdf", size: "5.1 ميجابايت" },
  { title: "تجميع الفترة الثانية 1439 هـ - لفظي - محلول", url: "files/previous-years-1439-07.pdf", downloadName: "تجميع الفترة الثانية 1439 هـ - لفظي - محلول.pdf", size: "6.4 ميجابايت" },
];

// ملفات التجميع المعتمدة لعام 1440هـ.
const previousYears1440Files = [
  { title: "تجميع الفترة الأولى 1440 هـ - كمي - مطبوع", url: "files/previous-years-1440-01.pdf", downloadName: "تجميع الفترة الأولى 1440 هـ - كمي - مطبوع.pdf", size: "8.5 ميجابايت" },
  { title: "تجميع الفترة الأولى 1440 هـ - لفظي - مطبوع", url: "files/previous-years-1440-02.pdf", downloadName: "تجميع الفترة الأولى 1440 هـ - لفظي - مطبوع.pdf", size: "9.8 ميجابايت" },
  { title: "تجميع الفترة الثانية 1440 هـ - كمي - محلول", url: "files/previous-years-1440-03.pdf", downloadName: "تجميع الفترة الثانية 1440 هـ - كمي - محلول.pdf", size: "4.1 ميجابايت" },
  { title: "تجميع الفترة الثانية 1440 هـ - لفظي - محلول", url: "files/previous-years-1440-04.pdf", downloadName: "تجميع الفترة الثانية 1440 هـ - لفظي - محلول.pdf", size: "4.9 ميجابايت" },
];

// ملفات التجميع المعتمدة لعام 1441هـ.
const previousYears1441Files = [
  { title: "تجميع الفترة الأولى 1441 هـ - كمي - مطبوع", url: "files/previous-years-1441-01.pdf", downloadName: "تجميع الفترة الأولى 1441 هـ - كمي - مطبوع.pdf", size: "16.1 ميجابايت" },
  { title: "تجميع الفترة الأولى 1441 هـ - لفظي - مطبوع", url: "files/previous-years-1441-02.pdf", downloadName: "تجميع الفترة الأولى 1441 هـ - لفظي - مطبوع.pdf", size: "19.9 ميجابايت" },
  { title: "تجميع الفترة الثانية 1441 هـ - كمي - مطبوع", url: "files/previous-years-1441-03.pdf", downloadName: "تجميع الفترة الثانية 1441 هـ - كمي - مطبوع.pdf", size: "4.4 ميجابايت" },
  { title: "تجميع الفترة الثانية 1441 هـ - لفظي - مطبوع", url: "files/previous-years-1441-04.pdf", downloadName: "تجميع الفترة الثانية 1441 هـ - لفظي - مطبوع.pdf", size: "5.0 ميجابايت" },
];

// ملفات التجميع المعتمدة لعام 1442هـ.
const previousYears1442Files = [
  { title: "التجميع الأسبوعي الأول 1442 هـ - كمي", url: "files/previous-years-1442-01.pdf", downloadName: "التجميع الأسبوعي الأول 1442 هـ - كمي.pdf", size: "2.6 ميجابايت" },
  { title: "التجميع الأسبوعي الأول 1442 هـ - لفظي", url: "files/previous-years-1442-02.pdf", downloadName: "التجميع الأسبوعي الأول 1442 هـ - لفظي.pdf", size: "2.7 ميجابايت" },
  { title: "تجميع الفترة الثانية 1442 هـ - كمي - محلول", url: "files/previous-years-1442-03.pdf", downloadName: "تجميع الفترة الثانية 1442 هـ - كمي - محلول.pdf", size: "10.2 ميجابايت" },
  { title: "تجميع الفترة الأولى 1442 هـ - لفظي - محلول", url: "files/previous-years-1442-04.pdf", downloadName: "تجميع الفترة الأولى 1442 هـ - لفظي - محلول.pdf", size: "9.5 ميجابايت" },
];

// ملفات التجميع المعتمدة لعام 1443هـ.
const previousYears1443Files = [
  { title: "تجميع الفترة الثانية 1443 هـ - كمي - غير محلول", url: "files/previous-years-1443-01.pdf", downloadName: "تجميع الفترة الثانية 1443 هـ - كمي - غير محلول.pdf", size: "2.6 ميجابايت" },
  { title: "تجميع الفترة الثانية 1443 هـ - كمي - محلول", url: "files/previous-years-1443-02.pdf", downloadName: "تجميع الفترة الثانية 1443 هـ - كمي - محلول.pdf", size: "3.0 ميجابايت" },
  { title: "تجميع الفترة الثانية 1443 هـ - لفظي - غير محلول", url: "files/previous-years-1443-03.pdf", downloadName: "تجميع الفترة الثانية 1443 هـ - لفظي - غير محلول.pdf", size: "4.7 ميجابايت" },
  { title: "تجميع الفترة الثانية 1443 هـ - لفظي - محلول", url: "files/previous-years-1443-04.pdf", downloadName: "تجميع الفترة الثانية 1443 هـ - لفظي - محلول.pdf", size: "4.8 ميجابايت" },
  { title: "تجميع الفترة الأولى 1443 هـ - كمي - محلول", url: "files/previous-years-1443-05.pdf", downloadName: "تجميع الفترة الأولى 1443 هـ - كمي - محلول.pdf", size: "1.5 ميجابايت" },
  { title: "تجميع الفترة الأولى 1443 هـ - لفظي - محلول", url: "files/previous-years-1443-06.pdf", downloadName: "تجميع الفترة الأولى 1443 هـ - لفظي - محلول.pdf", size: "3.2 ميجابايت" },
  { title: "التجميع الأسبوعي الأول 1443 هـ - الفترة الثانية", url: "files/previous-years-1443-07.pdf", downloadName: "التجميع الأسبوعي الأول 1443 هـ - الفترة الثانية.pdf", size: "4.1 ميجابايت" },
];

// ملفات التجميع المعتمدة لعام 1444هـ.
const previousYears1444Files = [
  { title: "تجميع الورقي لعام 1444 هـ - كمي", url: "files/previous-years-1444-01.pdf", downloadName: "تجميع الورقي لعام 1444 هـ - كمي.pdf", size: "3.3 ميجابايت" },
  { title: "تجميع الورقي لعام 1444 هـ - لفظي", url: "files/previous-years-1444-02.pdf", downloadName: "تجميع الورقي لعام 1444 هـ - لفظي.pdf", size: "3.9 ميجابايت" },
];

function normalizeFileTitle(title: string) {
  return title.replace(/\s+/g, "").replace(/[–—-]/g, "").trim();
}

function previewFileUrl(url: string) {
  const cleanUrl = url.startsWith("/") ? url.slice(1) : url;
  return `viewer.html?file=${encodeURIComponent(cleanUrl)}`;
}

const demoLessons: Lesson[] = [
  { id: "verbal-lecture-1", title: "القسم 1: الزلازل والسكري", description: "المحاضرة الأولى من سلسلة قدراتي لفظي، مرتبة للبدء بالتدريب خطوة بخطوة.", category: "قدرات لفظي", duration: "المحاضرة 1", videoUrl: "https://www.youtube.com/watch?v=lks7f-SWbzM", published: true },
  { id: "verbal-lecture-2", title: "القسم 2: الاحتكاك والنجاح", description: "المحاضرة الثانية من سلسلة قدراتي لفظي، لاستكمال الشرح والتدريب المنظم.", category: "قدرات لفظي", duration: "المحاضرة 2", videoUrl: "https://www.youtube.com/watch?v=_34BGTbCdks", published: true },
  { id: "verbal-lecture-3", title: "القسم 3: الجمل والطحالب", description: "المحاضرة الثالثة من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 3", videoUrl: "https://www.youtube.com/watch?v=4opdGIZPT0Y", published: true },
  { id: "verbal-lecture-4", title: "القسم 4: فقراء بريطانيا", description: "المحاضرة الرابعة من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 4", videoUrl: "https://www.youtube.com/watch?v=27zwYh5fhAc", published: true },
  { id: "verbal-lecture-5", title: "القسم 5: البصمة والحواس", description: "المحاضرة الخامسة من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 5", videoUrl: "https://www.youtube.com/watch?v=fV2evCEDPfM", published: true },
  { id: "verbal-lecture-6", title: "القسم 6: ثقافة اليابان والفراغ", description: "المحاضرة السادسة من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 6", videoUrl: "https://www.youtube.com/watch?v=btOucssRxBU", published: true },
  { id: "verbal-lecture-7", title: "القسم 7: النمل واحتضان الآباء", description: "المحاضرة السابعة من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 7", videoUrl: "https://www.youtube.com/watch?v=nvYaKdYepU8", published: true },
  { id: "verbal-lecture-8", title: "القسم 8", description: "المحاضرة الثامنة من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 8", videoUrl: "https://www.youtube.com/watch?v=xdNZSUe7P-4", published: true },
  { id: "verbal-lecture-9", title: "القسم 9: القمر والطحالب", description: "المحاضرة التاسعة من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 9", videoUrl: "https://www.youtube.com/watch?v=KAXT1XarAmk", published: true },
  { id: "verbal-lecture-10", title: "القسم 10: التدرج والتغيير", description: "المحاضرة العاشرة من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 10", videoUrl: "https://www.youtube.com/watch?v=M3esx3t5qwo", published: true },
  { id: "verbal-lecture-11", title: "القسم 11: الحج والمواليد", description: "المحاضرة الحادية عشرة من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 11", videoUrl: "https://www.youtube.com/watch?v=bWqZC0CvB-Y", published: true },
  { id: "verbal-lecture-12", title: "القسم 12: انعدام الفقر", description: "المحاضرة الثانية عشرة من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 12", videoUrl: "https://www.youtube.com/watch?v=hTKTePuEXRg", published: true },
  { id: "verbal-lecture-13", title: "القسم 13", description: "المحاضرة الثالثة عشرة من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 13", videoUrl: "https://www.youtube.com/watch?v=RxtmQ5bp8DQ", published: true },
  { id: "verbal-lecture-14", title: "القسم 14", description: "المحاضرة الرابعة عشرة من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 14", videoUrl: "https://www.youtube.com/watch?v=3D0wowtbxdk", published: true },
  { id: "verbal-lecture-15", title: "القسم 15", description: "المحاضرة الخامسة عشرة من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 15", videoUrl: "https://www.youtube.com/watch?v=qlYiWGMy900", published: true },
  { id: "verbal-lecture-16", title: "القسم 16", description: "المحاضرة السادسة عشرة من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 16", videoUrl: "https://www.youtube.com/watch?v=2hOV9V7VHAE", published: true },
  { id: "verbal-lecture-17", title: "القسم 17", description: "المحاضرة السابعة عشرة من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 17", videoUrl: "https://www.youtube.com/watch?v=Gr-UJ2QG1Eg", published: true },
  { id: "verbal-lecture-18", title: "القسم 18", description: "المحاضرة الثامنة عشرة من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 18", videoUrl: "https://www.youtube.com/watch?v=wnyZLo8ZQ7g", published: true },
  { id: "verbal-lecture-19", title: "القسم 19", description: "المحاضرة التاسعة عشرة من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 19", videoUrl: "https://www.youtube.com/watch?v=L0mhwrCOYok", published: true },
  { id: "verbal-lecture-20", title: "القسم 20", description: "المحاضرة العشرون من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 20", videoUrl: "https://www.youtube.com/watch?v=EVySJKQLSD4", published: true },
  { id: "verbal-lecture-21", title: "القسم 21", description: "المحاضرة الحادية والعشرون من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 21", videoUrl: "https://www.youtube.com/watch?v=j77K7MGjUuQ", published: true },
  { id: "verbal-lecture-22", title: "القسم 22", description: "المحاضرة الثانية والعشرون من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 22", videoUrl: "https://www.youtube.com/watch?v=cBXQXy8Y3pw", published: true },
  { id: "verbal-lecture-23", title: "القسم 23", description: "المحاضرة الثالثة والعشرون من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 23", videoUrl: "https://www.youtube.com/watch?v=SF9pEvl0WdI", published: true },
  { id: "verbal-lecture-24", title: "القسم 24", description: "المحاضرة الرابعة والعشرون من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 24", videoUrl: "https://www.youtube.com/watch?v=drajEAhzIK4", published: true },
  { id: "verbal-lecture-25", title: "القسم 25", description: "المحاضرة الخامسة والعشرون من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 25", videoUrl: "https://www.youtube.com/watch?v=eDTo5scrDi4", published: true },
  { id: "verbal-lecture-26", title: "القسم 26", description: "المحاضرة رقم 26 من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 26", videoUrl: "https://www.youtube.com/watch?v=3PLbD3yLxAc", published: true },
  { id: "verbal-lecture-27", title: "القسم 27", description: "المحاضرة رقم 27 من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 27", videoUrl: "https://www.youtube.com/watch?v=3g8DG-U1ThE", published: true },
  { id: "verbal-lecture-28", title: "القسم 28", description: "المحاضرة رقم 28 من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 28", videoUrl: "https://www.youtube.com/watch?v=oD5av3qmCMU", published: true },
  { id: "verbal-lecture-29", title: "القسم 29", description: "المحاضرة رقم 29 من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 29", videoUrl: "https://www.youtube.com/watch?v=5mcnoVUpWf4", published: true },
  { id: "verbal-lecture-30", title: "القسم 30", description: "المحاضرة رقم 30 من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 30", videoUrl: "https://www.youtube.com/watch?v=D-wdQ2ndok0", published: true },
  { id: "verbal-lecture-31", title: "القسم 31", description: "المحاضرة رقم 31 من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 31", videoUrl: "https://www.youtube.com/watch?v=ylUAUr_n7CI", published: true },
  { id: "verbal-lecture-32", title: "القسم 32", description: "المحاضرة رقم 32 من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 32", videoUrl: "https://www.youtube.com/watch?v=zmTyCh7CK68", published: true },
  { id: "verbal-lecture-33", title: "القسم 33", description: "المحاضرة رقم 33 من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 33", videoUrl: "https://www.youtube.com/watch?v=FnBleSZ9nEE", published: true },
  { id: "verbal-lecture-34", title: "القسم 34", description: "المحاضرة رقم 34 من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 34", videoUrl: "https://www.youtube.com/watch?v=VagGcEgtVsI", published: true },
  { id: "verbal-lecture-35", title: "القسم 35", description: "المحاضرة رقم 35 من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 35", videoUrl: "https://www.youtube.com/watch?v=kuNi5LXaTls", published: true },
  { id: "verbal-lecture-36", title: "القسم 36", description: "المحاضرة رقم 36 من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 36", videoUrl: "https://www.youtube.com/watch?v=rurgd2fCVu8", published: true },
  { id: "verbal-lecture-37", title: "القسم 37", description: "المحاضرة رقم 37 من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 37", videoUrl: "https://www.youtube.com/watch?v=dwmsqelw9-U", published: true },
  { id: "verbal-lecture-38", title: "القسم 38", description: "المحاضرة رقم 38 من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 38", videoUrl: "https://www.youtube.com/watch?v=B0KkI39R3qQ", published: true },
  { id: "verbal-lecture-39", title: "القسم 39", description: "المحاضرة رقم 39 من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 39", videoUrl: "https://www.youtube.com/watch?v=Btd5r_ZsIHY", published: true },
  { id: "verbal-lecture-40", title: "القسم 40", description: "المحاضرة رقم 40 من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 40", videoUrl: "https://www.youtube.com/watch?v=gd_TA-KqNfk", published: true },
  { id: "verbal-lecture-41", title: "القسم 41", description: "المحاضرة رقم 41 من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 41", videoUrl: "https://www.youtube.com/watch?v=cJZBhUDJMYU", published: true },
  { id: "verbal-lecture-42", title: "القسم 42", description: "المحاضرة رقم 42 من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 42", videoUrl: "https://www.youtube.com/watch?v=j-UHVHoNKuM", published: true },
  { id: "verbal-lecture-43", title: "القسم 43", description: "المحاضرة رقم 43 من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 43", videoUrl: "https://www.youtube.com/watch?v=jTokvLqElRU", published: true },
  { id: "verbal-lecture-44", title: "القسم 44", description: "المحاضرة رقم 44 من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 44", videoUrl: "https://www.youtube.com/watch?v=G0HO-Un9onA", published: true },
  { id: "verbal-lecture-45", title: "القسم 45", description: "المحاضرة رقم 45 من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 45", videoUrl: "https://www.youtube.com/watch?v=f26o9O13oCs", published: true },
  { id: "verbal-lecture-46", title: "القسم 46", description: "المحاضرة رقم 46 من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 46", videoUrl: "https://www.youtube.com/watch?v=DtQ0c8I4240", published: true },
  { id: "verbal-lecture-47", title: "القسم 47", description: "المحاضرة رقم 47 من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 47", videoUrl: "https://www.youtube.com/watch?v=f_BwjFokIFE", published: true },
  { id: "verbal-lecture-48", title: "القسم 48", description: "المحاضرة رقم 48 من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 48", videoUrl: "https://www.youtube.com/watch?v=YvKleyY_TE4", published: true },
  { id: "verbal-lecture-49", title: "القسم 49", description: "المحاضرة رقم 49 من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 49", videoUrl: "https://www.youtube.com/watch?v=wEUnQWfi4zA", published: true },
  { id: "verbal-lecture-50", title: "القسم 50", description: "المحاضرة رقم 50 من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 50", videoUrl: "https://www.youtube.com/watch?v=g1B8y10Sm-c", published: true },
  { id: "verbal-lecture-51", title: "القسم 51", description: "المحاضرة رقم 51 من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 51", videoUrl: "https://www.youtube.com/watch?v=-dHYwtPm5sY", published: true },
  { id: "verbal-lecture-52", title: "القسم 52", description: "المحاضرة رقم 52 من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 52", videoUrl: "https://www.youtube.com/watch?v=8xDaAIoofuI", published: true },
  { id: "verbal-lecture-53", title: "القسم 53", description: "المحاضرة رقم 53 من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 53", videoUrl: "https://www.youtube.com/watch?v=TJVkICxmTZ0", published: true },
  { id: "verbal-lecture-54", title: "القسم 54", description: "المحاضرة رقم 54 من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 54", videoUrl: "https://www.youtube.com/watch?v=DRWRtxFfxVA", published: true },
  { id: "verbal-lecture-55", title: "القسم 55", description: "المحاضرة رقم 55 من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 55", videoUrl: "https://www.youtube.com/watch?v=JugTs2l4JX4", published: true },
  { id: "verbal-lecture-56", title: "القسم 56", description: "المحاضرة رقم 56 من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 56", videoUrl: "https://www.youtube.com/watch?v=JwqLpVfTur8", published: true },
  { id: "verbal-lecture-57", title: "القسم 57", description: "المحاضرة رقم 57 من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 57", videoUrl: "https://www.youtube.com/watch?v=JxfxuNGWIzk", published: true },
  { id: "verbal-lecture-58", title: "القسم 58", description: "المحاضرة رقم 58 من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 58", videoUrl: "https://www.youtube.com/watch?v=ZeL-j8QpDXQ", published: true },
  { id: "verbal-lecture-59", title: "القسم 59", description: "المحاضرة رقم 59 من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 59", videoUrl: "https://www.youtube.com/watch?v=OR61w3X52to", published: true },
  { id: "verbal-lecture-60", title: "القسم 60", description: "المحاضرة رقم 60 من سلسلة قدراتي لفظي، لمتابعة الشرح والتدريب وفق الترتيب.", category: "قدرات لفظي", duration: "المحاضرة 60", videoUrl: "https://www.youtube.com/watch?v=NvIq7hB3e0I", published: true },
  { id: "lesson-1", title: "التناظر اللفظي", description: "تعلّم تحديد العلاقة بين الكلمات واختيار العلاقة المماثلة.", category: "قدرات لفظي", duration: "18 دقيقة", videoUrl: "", published: true },
  { id: "lesson-2", title: "النسبة والتناسب", description: "شرح مبسّط لأهم قوانين النسبة مع تطبيقات متدرجة.", category: "قدرات كمي", duration: "24 دقيقة", videoUrl: "", published: true },
  { id: "lesson-3", title: "مهارات استيعاب المقروء", description: "استراتيجيات سريعة لفهم النص والوصول إلى الإجابة الدقيقة.", category: "قدرات لفظي", duration: "20 دقيقة", videoUrl: "", published: true },
  { id: "lesson-4", title: "أساسيات الجبر", description: "مراجعة القواعد الأساسية وحل مسائل تحصيلية متنوعة.", category: "تحصيلي", duration: "27 دقيقة", videoUrl: "", published: true },
];

const verbalChannelUrl = "https://www.youtube.com/@%D8%A7%D9%84%D9%82%D8%AF%D8%B1%D8%A7%D8%AA100/videos";
const verbalLecturesPerPage = 10;
const mansafLessonsPerPage = 10;

const mansafFoundationLessons: Lesson[] = [
  { id: "mansaf-foundation-1", title: "تأسيس المنصف — الدرس 1", description: "الدرس الأول من سلسلة تأسيس المنصف في القدرات الكمية.", category: "قدرات كمي • تأسيس المنصف", duration: "الدرس 1", videoUrl: "https://www.youtube.com/watch?v=xdEYswgNIZo", published: true },
  { id: "mansaf-foundation-2", title: "تأسيس المنصف — الدرس 2", description: "الدرس الثاني من سلسلة تأسيس المنصف في القدرات الكمية.", category: "قدرات كمي • تأسيس المنصف", duration: "الدرس 2", videoUrl: "https://www.youtube.com/watch?v=T7aqYnbP_ak", published: true },
  { id: "mansaf-foundation-3", title: "تأسيس المنصف — الدرس 3", description: "الدرس الثالث من سلسلة تأسيس المنصف في القدرات الكمية.", category: "قدرات كمي • تأسيس المنصف", duration: "الدرس 3", videoUrl: "https://www.youtube.com/watch?v=EAGteD0sgag", published: true },
  { id: "mansaf-foundation-4", title: "تأسيس المنصف — الدرس 4", description: "الدرس الرابع من سلسلة تأسيس المنصف في القدرات الكمية.", category: "قدرات كمي • تأسيس المنصف", duration: "الدرس 4", videoUrl: "https://www.youtube.com/watch?v=ktpBhVRUntE", published: true },
  { id: "mansaf-foundation-5", title: "تأسيس المنصف — الدرس 5", description: "الدرس الخامس من سلسلة تأسيس المنصف في القدرات الكمية.", category: "قدرات كمي • تأسيس المنصف", duration: "الدرس 5", videoUrl: "https://www.youtube.com/watch?v=7npCvoZ0_E0", published: true },
  { id: "mansaf-foundation-6", title: "تأسيس المنصف — الدرس 6", description: "الدرس السادس من سلسلة تأسيس المنصف في القدرات الكمية.", category: "قدرات كمي • تأسيس المنصف", duration: "الدرس 6", videoUrl: "https://www.youtube.com/watch?v=si_ymS0waAI", published: true },
  { id: "mansaf-foundation-7", title: "تأسيس المنصف — الدرس 7", description: "الدرس السابع من سلسلة تأسيس المنصف في القدرات الكمية.", category: "قدرات كمي • تأسيس المنصف", duration: "الدرس 7", videoUrl: "https://www.youtube.com/watch?v=k3OLAmLaFJA", published: true },
  { id: "mansaf-foundation-8", title: "تأسيس المنصف — الدرس 8", description: "الدرس الثامن من سلسلة تأسيس المنصف في القدرات الكمية.", category: "قدرات كمي • تأسيس المنصف", duration: "الدرس 8", videoUrl: "https://www.youtube.com/watch?v=yYTNy1lFkGY", published: true },
  { id: "mansaf-foundation-9", title: "تأسيس المنصف — الدرس 9", description: "الدرس التاسع من سلسلة تأسيس المنصف في القدرات الكمية.", category: "قدرات كمي • تأسيس المنصف", duration: "الدرس 9", videoUrl: "https://www.youtube.com/watch?v=ttL1Meckpbs", published: true },
  { id: "mansaf-foundation-10", title: "تأسيس المنصف — الدرس 10", description: "الدرس العاشر من سلسلة تأسيس المنصف في القدرات الكمية.", category: "قدرات كمي • تأسيس المنصف", duration: "الدرس 10", videoUrl: "https://www.youtube.com/watch?v=itaGnuAtEWQ", published: true },
  { id: "mansaf-foundation-11", title: "تأسيس المنصف — الدرس 11", description: "الدرس الحادي عشر من سلسلة تأسيس المنصف في القدرات الكمية.", category: "قدرات كمي • تأسيس المنصف", duration: "الدرس 11", videoUrl: "https://www.youtube.com/watch?v=AT47J9EaZho", published: true },
  { id: "mansaf-foundation-12", title: "تأسيس المنصف — الدرس 12", description: "الدرس الثاني عشر من سلسلة تأسيس المنصف في القدرات الكمية.", category: "قدرات كمي • تأسيس المنصف", duration: "الدرس 12", videoUrl: "https://www.youtube.com/watch?v=hA00HA8l66M", published: true },
  { id: "mansaf-foundation-13", title: "تأسيس المنصف — الدرس 13", description: "الدرس الثالث عشر من سلسلة تأسيس المنصف في القدرات الكمية.", category: "قدرات كمي • تأسيس المنصف", duration: "الدرس 13", videoUrl: "https://www.youtube.com/watch?v=4KJg3LqZ08I", published: true },
  { id: "mansaf-foundation-14", title: "تأسيس المنصف — الدرس 14", description: "الدرس الرابع عشر من سلسلة تأسيس المنصف في القدرات الكمية.", category: "قدرات كمي • تأسيس المنصف", duration: "الدرس 14", videoUrl: "https://www.youtube.com/watch?v=e82KC7y0uyI", published: true },
  { id: "mansaf-foundation-15", title: "تأسيس المنصف — الدرس 15", description: "الدرس الخامس عشر من سلسلة تأسيس المنصف في القدرات الكمية.", category: "قدرات كمي • تأسيس المنصف", duration: "الدرس 15", videoUrl: "https://www.youtube.com/watch?v=qqi1oUI151w", published: true },
  { id: "mansaf-foundation-16", title: "تأسيس المنصف — الدرس 16", description: "الدرس السادس عشر من سلسلة تأسيس المنصف في القدرات الكمية.", category: "قدرات كمي • تأسيس المنصف", duration: "الدرس 16", videoUrl: "https://www.youtube.com/watch?v=h9HHi-TQ18o", published: true },
];

const mansafTrainingLessons: Lesson[] = [
  { id: "mansaf-training-1", title: "تدريب المنصف — الدرس 1", description: "الدرس الأول من سلسلة تدريب المنصف في القدرات الكمية.", category: "قدرات كمي • تدريب المنصف", duration: "الدرس 1", videoUrl: "https://www.youtube.com/watch?v=a4T4mWDJNRU", published: true },
  { id: "mansaf-training-2", title: "تدريب المنصف — الدرس 2", description: "الدرس الثاني من سلسلة تدريب المنصف في القدرات الكمية.", category: "قدرات كمي • تدريب المنصف", duration: "الدرس 2", videoUrl: "https://www.youtube.com/watch?v=2ZHq45MXFpw", published: true },
  { id: "mansaf-training-3", title: "تدريب المنصف — الدرس 3", description: "الدرس الثالث من سلسلة تدريب المنصف في القدرات الكمية.", category: "قدرات كمي • تدريب المنصف", duration: "الدرس 3", videoUrl: "https://www.youtube.com/watch?v=qEkwv1g1yOY", published: true },
  { id: "mansaf-training-4", title: "تدريب المنصف — الدرس 4", description: "الدرس الرابع من سلسلة تدريب المنصف في القدرات الكمية.", category: "قدرات كمي • تدريب المنصف", duration: "الدرس 4", videoUrl: "https://www.youtube.com/watch?v=hqsYdpqcyvI", published: true },
  { id: "mansaf-training-5", title: "تدريب المنصف — الدرس 5", description: "الدرس الخامس من سلسلة تدريب المنصف في القدرات الكمية.", category: "قدرات كمي • تدريب المنصف", duration: "الدرس 5", videoUrl: "https://www.youtube.com/watch?v=WKdLuDLIQiQ", published: true },
  { id: "mansaf-training-6", title: "تدريب المنصف — الدرس 6", description: "الدرس السادس من سلسلة تدريب المنصف في القدرات الكمية.", category: "قدرات كمي • تدريب المنصف", duration: "الدرس 6", videoUrl: "https://www.youtube.com/watch?v=imtGbwZI8KQ", published: true },
  { id: "mansaf-training-7", title: "تدريب المنصف — الدرس 7", description: "الدرس السابع من سلسلة تدريب المنصف في القدرات الكمية.", category: "قدرات كمي • تدريب المنصف", duration: "الدرس 7", videoUrl: "https://www.youtube.com/watch?v=tcF8Q62kNR0", published: true },
  { id: "mansaf-training-8", title: "تدريب المنصف — الدرس 8", description: "الدرس الثامن من سلسلة تدريب المنصف في القدرات الكمية.", category: "قدرات كمي • تدريب المنصف", duration: "الدرس 8", videoUrl: "https://www.youtube.com/watch?v=OyIKqTLEftk", published: true },
  { id: "mansaf-training-9", title: "تدريب المنصف — الدرس 9", description: "الدرس التاسع من سلسلة تدريب المنصف في القدرات الكمية.", category: "قدرات كمي • تدريب المنصف", duration: "الدرس 9", videoUrl: "https://www.youtube.com/watch?v=AWLuNjPcCvg", published: true },
  { id: "mansaf-training-10", title: "تدريب المنصف — الدرس 10", description: "الدرس العاشر من سلسلة تدريب المنصف في القدرات الكمية.", category: "قدرات كمي • تدريب المنصف", duration: "الدرس 10", videoUrl: "https://www.youtube.com/watch?v=FLSnINP0iIc", published: true },
  { id: "mansaf-training-11", title: "تدريب المنصف — الدرس 11", description: "الدرس الحادي عشر من سلسلة تدريب المنصف في القدرات الكمية.", category: "قدرات كمي • تدريب المنصف", duration: "الدرس 11", videoUrl: "https://www.youtube.com/watch?v=fo0MdbAK950", published: true },
  { id: "mansaf-training-12", title: "تدريب المنصف — الدرس 12", description: "الدرس الثاني عشر من سلسلة تدريب المنصف في القدرات الكمية.", category: "قدرات كمي • تدريب المنصف", duration: "الدرس 12", videoUrl: "https://www.youtube.com/watch?v=HPN4aPmOPFg", published: true },
  { id: "mansaf-training-13", title: "تدريب المنصف — الدرس 13", description: "الدرس الثالث عشر من سلسلة تدريب المنصف في القدرات الكمية.", category: "قدرات كمي • تدريب المنصف", duration: "الدرس 13", videoUrl: "https://www.youtube.com/watch?v=KiNa29p1XfQ", published: true },
  { id: "mansaf-training-14", title: "تدريب المنصف — الدرس 14", description: "الدرس الرابع عشر من سلسلة تدريب المنصف في القدرات الكمية.", category: "قدرات كمي • تدريب المنصف", duration: "الدرس 14", videoUrl: "https://www.youtube.com/watch?v=O3lr2ZVyILo", published: true },
  { id: "mansaf-training-15", title: "تدريب المنصف — الدرس 15", description: "الدرس الخامس عشر من سلسلة تدريب المنصف في القدرات الكمية.", category: "قدرات كمي • تدريب المنصف", duration: "الدرس 15", videoUrl: "https://www.youtube.com/watch?v=Hz1XhQV79d8", published: true },
  { id: "mansaf-training-16", title: "تدريب المنصف — الدرس 16", description: "الدرس السادس عشر من سلسلة تدريب المنصف في القدرات الكمية.", category: "قدرات كمي • تدريب المنصف", duration: "الدرس 16", videoUrl: "https://www.youtube.com/watch?v=fJFr8zxBlWQ", published: true },
  { id: "mansaf-training-17", title: "تدريب المنصف — الدرس 17", description: "الدرس السابع عشر من سلسلة تدريب المنصف في القدرات الكمية.", category: "قدرات كمي • تدريب المنصف", duration: "الدرس 17", videoUrl: "https://www.youtube.com/watch?v=H2vmudbLNOM", published: true },
  { id: "mansaf-training-18", title: "تدريب المنصف — الدرس 18", description: "الدرس الثامن عشر من سلسلة تدريب المنصف في القدرات الكمية.", category: "قدرات كمي • تدريب المنصف", duration: "الدرس 18", videoUrl: "https://www.youtube.com/watch?v=9r9nmG8JO4E", published: true },
  { id: "mansaf-training-19", title: "تدريب المنصف — الدرس 19", description: "الدرس التاسع عشر من سلسلة تدريب المنصف في القدرات الكمية.", category: "قدرات كمي • تدريب المنصف", duration: "الدرس 19", videoUrl: "https://www.youtube.com/watch?v=Y9phQaNKEyQ", published: true },
  { id: "mansaf-training-20", title: "تدريب المنصف — الدرس 20", description: "الدرس رقم 20 من سلسلة تدريب المنصف في القدرات الكمية.", category: "قدرات كمي • تدريب المنصف", duration: "الدرس 20", videoUrl: "https://www.youtube.com/watch?v=n8qZCZveEVg", published: true },
  { id: "mansaf-training-21", title: "تدريب المنصف — الدرس 21", description: "الدرس رقم 21 من سلسلة تدريب المنصف في القدرات الكمية.", category: "قدرات كمي • تدريب المنصف", duration: "الدرس 21", videoUrl: "https://www.youtube.com/watch?v=XcnE5V0kV80", published: true },
  { id: "mansaf-training-22", title: "تدريب المنصف — الدرس 22", description: "الدرس رقم 22 من سلسلة تدريب المنصف في القدرات الكمية.", category: "قدرات كمي • تدريب المنصف", duration: "الدرس 22", videoUrl: "https://www.youtube.com/watch?v=VoZwntzhNDo", published: true },
  { id: "mansaf-training-23", title: "تدريب المنصف — الدرس 23", description: "الدرس رقم 23 من سلسلة تدريب المنصف في القدرات الكمية.", category: "قدرات كمي • تدريب المنصف", duration: "الدرس 23", videoUrl: "https://www.youtube.com/watch?v=bLXzdnhzxzw", published: true },
  { id: "mansaf-training-24", title: "تدريب المنصف — الدرس 24", description: "الدرس رقم 24 من سلسلة تدريب المنصف في القدرات الكمية.", category: "قدرات كمي • تدريب المنصف", duration: "الدرس 24", videoUrl: "https://www.youtube.com/watch?v=C5gtBeHRXP4", published: true },
  { id: "mansaf-training-25", title: "تدريب المنصف — الدرس 25", description: "الدرس رقم 25 من سلسلة تدريب المنصف في القدرات الكمية.", category: "قدرات كمي • تدريب المنصف", duration: "الدرس 25", videoUrl: "https://www.youtube.com/watch?v=BFlPYBkqhnE", published: true },
  { id: "mansaf-training-26", title: "تدريب المنصف — الدرس 26", description: "الدرس رقم 26 من سلسلة تدريب المنصف في القدرات الكمية.", category: "قدرات كمي • تدريب المنصف", duration: "الدرس 26", videoUrl: "https://www.youtube.com/watch?v=LJ3ndBQnudA", published: true },
  { id: "mansaf-training-27", title: "تدريب المنصف — الدرس 27", description: "الدرس رقم 27 من سلسلة تدريب المنصف في القدرات الكمية.", category: "قدرات كمي • تدريب المنصف", duration: "الدرس 27", videoUrl: "https://www.youtube.com/watch?v=QqriuOgzhso", published: true },
  { id: "mansaf-training-28", title: "تدريب المنصف — الدرس 28", description: "الدرس رقم 28 من سلسلة تدريب المنصف في القدرات الكمية.", category: "قدرات كمي • تدريب المنصف", duration: "الدرس 28", videoUrl: "https://www.youtube.com/watch?v=UXfXd55mYmU", published: true },
  { id: "mansaf-training-29", title: "تدريب المنصف — الدرس 29", description: "الدرس رقم 29 من سلسلة تدريب المنصف في القدرات الكمية.", category: "قدرات كمي • تدريب المنصف", duration: "الدرس 29", videoUrl: "https://www.youtube.com/watch?v=Drtlg6QHqRI", published: true },
  { id: "mansaf-training-30", title: "تدريب المنصف — الدرس 30", description: "الدرس رقم 30 من سلسلة تدريب المنصف في القدرات الكمية.", category: "قدرات كمي • تدريب المنصف", duration: "الدرس 30", videoUrl: "https://www.youtube.com/watch?v=YEGh91FxX2o", published: true },
  { id: "mansaf-training-31", title: "تدريب المنصف — الدرس 31", description: "الدرس رقم 31 من سلسلة تدريب المنصف في القدرات الكمية.", category: "قدرات كمي • تدريب المنصف", duration: "الدرس 31", videoUrl: "https://www.youtube.com/watch?v=V_ElWcKog9c", published: true },
  { id: "mansaf-training-32", title: "تدريب المنصف — الدرس 32", description: "الدرس رقم 32 من سلسلة تدريب المنصف في القدرات الكمية.", category: "قدرات كمي • تدريب المنصف", duration: "الدرس 32", videoUrl: "https://www.youtube.com/watch?v=nnOpo-lqc7E", published: true },
  { id: "mansaf-training-33", title: "تدريب المنصف — الدرس 33", description: "الدرس رقم 33 من سلسلة تدريب المنصف في القدرات الكمية.", category: "قدرات كمي • تدريب المنصف", duration: "الدرس 33", videoUrl: "https://www.youtube.com/watch?v=bgiG37FabFc", published: true },
];

const demoFiles: LearningFile[] = [
  { id: "file-1", title: "ملخص قوانين القدرات الكمية", type: "PDF", size: "2.4 MB", url: "#", lessonId: "lesson-2" },
  { id: "file-2", title: "تدريبات التناظر اللفظي", type: "PDF", size: "1.8 MB", url: "#", lessonId: "lesson-1" },
  { id: "file-3", title: "خطة مذاكرة لمدة أربعة أسابيع", type: "DOCX", size: "860 KB", url: "#" },
  { id: "file-4", title: "عرض مراجعة أساسيات الجبر", type: "PPTX", size: "4.1 MB", url: "#", lessonId: "lesson-4" },
];

const mofakerFiles = [
  {
    title: "أقسام المفكر من 1 إلى 107",
    url: "files/mofaker-sections-1-107.pdf",
    downloadName: "أقسام المفكر من 1 إلى 107.pdf",
    size: "29.9 ميجابايت",
    pages: "1284 صفحة",
  },
  {
    title: "المفكر الأكثر تكرارًا",
    url: "files/mofaker-most-repeated.pdf",
    downloadName: "المفكر الأكثر تكرارًا.pdf",
    size: "82.9 ميجابايت",
    pages: "1047 صفحة",
  },
];

const demoTests: TestItem[] = [
  { id: "verbal-analogy-1", title: "محاكاة لفظي 1 — التناظر والعلاقات", questions: 10, minutes: 13, category: "قدرات لفظي", description: "علاقات لغوية وتناظر لفظي بدرجات صعوبة متدرجة.", level: "متوسط" },
  { id: "verbal-context-1", title: "محاكاة لفظي 2 — إكمال الجمل والسياق", questions: 10, minutes: 13, category: "قدرات لفظي", description: "إكمال جمل واختيار التعبير الأدق وفق سياق العبارة.", level: "متوسط" },
  { id: "verbal-reading-1", title: "محاكاة لفظي 3 — استيعاب المقروء", questions: 10, minutes: 15, category: "قدرات لفظي", description: "نصّان أصليان مع أسئلة الفكرة والاستنتاج والدلالة.", level: "متقدم" },
  { id: "quant-ratios-1", title: "محاكاة كمي 1 — النسب والمسائل الحياتية", questions: 10, minutes: 15, category: "قدرات كمي", description: "تطبيقات النسبة والتناسب والسرعة والخصم والعمل.", level: "متوسط" },
  { id: "quant-algebra-1", title: "محاكاة كمي 2 — الجبر والمقارنات", questions: 10, minutes: 15, category: "قدرات كمي", description: "معادلات ودوال ومتباينات وأنماط عددية قصيرة.", level: "متقدم" },
  { id: "quant-geometry-1", title: "محاكاة كمي 3 — الهندسة والإحصاء", questions: 10, minutes: 15, category: "قدرات كمي", description: "زوايا ومساحات ومتوسطات واحتمالات بأسلوب الاختبار.", level: "شامل" },
];

const sampleQuestions: TestQuestion[] = [
  { id: "sample-1", text: "كتاب : قراءة", choices: ["قلم : كتابة", "باب : منزل", "شمس : نهار", "بحر : سفينة"], correct: 0, explanation: "العلاقة بين الشيء واستخدامه المباشر." },
  { id: "sample-2", text: "طبيب : مستشفى", choices: ["معلم : مدرسة", "طائرة : مطار", "نهر : ماء", "كتاب : مكتبة"], correct: 0, explanation: "العلاقة بين المهنة ومكان ممارستها المعتاد." },
  { id: "sample-3", text: "نجاح : اجتهاد", choices: ["حصاد : زراعة", "سفر : طريق", "علم : كتاب", "صباح : شمس"], correct: 0, explanation: "الاجتهاد سبب للنجاح، والزراعة سبب للحصاد." },
];

const readingPassageOne = "تسهم الأشجار داخل المدن في خفض حرارة الشوارع؛ فهي تمنح الظل وتمتص جزءًا من الإشعاع الشمسي، كما تطلق بخار الماء من أوراقها. لكن أثرها لا يعتمد على عددها وحده، بل على اختيار أنواع تلائم المناخ وتوزيعها قرب مسارات المشاة والمباني. وقد تفشل بعض مشروعات التشجير حين تُزرع أنواع كثيرة الاستهلاك للماء أو توضع في أماكن تعيق الحركة. لذلك يجمع التخطيط الناجح بين الفائدة البيئية وحسن إدارة الموارد وسهولة الصيانة.";
const readingPassageTwo = "تختلف القراءة العميقة عن المرور السريع على الكلمات؛ إذ تحتاج إلى وقت يسمح للقارئ بربط الأفكار ومقارنة الحجج واستحضار خبراته السابقة. ولا يعني ذلك أن القراءة السريعة عديمة الفائدة، فهي مناسبة للبحث عن معلومة محددة أو تكوين تصور أولي. المشكلة تظهر عندما تتحول السرعة إلى عادة وحيدة، فيتعامل القارئ مع كل النصوص بالطريقة نفسها. القارئ الماهر لا يلتزم سرعة ثابتة، بل يغيّر إيقاعه وفق هدفه وصعوبة النص.";

const testQuestionBanks: Record<string, TestQuestion[]> = {
  "verbal-analogy-1": [
    { id: "va1-1", text: "بوصلة : اتجاه", choices: ["ميزان : وزن", "مرآة : ضوء", "قلم : ورق", "نافذة : هواء"], correct: 0, explanation: "البوصلة أداة لتحديد الاتجاه، والميزان أداة لتحديد الوزن." },
    { id: "va1-2", text: "بذرة : شجرة", choices: ["غيمة : مطر", "بيضة : طائر", "ورقة : كتاب", "مسمار : جدار"], correct: 1, explanation: "البذرة أصل تنمو منه الشجرة، والبيضة أصل يخرج منه الطائر." },
    { id: "va1-3", text: "مشرط : جرّاح", choices: ["فرشاة : رسّام", "سبورة : طالب", "حقيبة : مسافر", "مقعد : سائق"], correct: 0, explanation: "المشرط أداة يستخدمها الجرّاح، والفرشاة أداة يستخدمها الرسّام." },
    { id: "va1-4", text: "صمت : ضوضاء", choices: ["ظلام : نور", "صيف : بحر", "حديث : صوت", "قرب : وصول"], correct: 0, explanation: "العلاقة تضاد: الصمت ضد الضوضاء، والظلام ضد النور." },
    { id: "va1-5", text: "مكتبة : كتب", choices: ["حديقة : أشجار", "مطار : طائرة", "مدرسة : معلم", "طريق : سيارة"], correct: 0, explanation: "المكتبة تضم مجموعة من الكتب، والحديقة تضم مجموعة من الأشجار." },
    { id: "va1-6", text: "اجتهاد : نجاح", choices: ["إهمال : إخفاق", "سؤال : معرفة", "سفر : حقيبة", "تعب : نوم"], correct: 0, explanation: "الاجتهاد يؤدي غالبًا إلى النجاح، والإهمال يؤدي غالبًا إلى الإخفاق." },
    { id: "va1-7", text: "نحل : عسل", choices: ["دودة القز : حرير", "غزال : سرعة", "طائر : جناح", "نخلة : ظل"], correct: 0, explanation: "النحل ينتج العسل، ودودة القز تنتج الحرير." },
    { id: "va1-8", text: "ساعة : زمن", choices: ["مقياس حرارة : درجة الحرارة", "عدسة : صورة", "مصباح : كهرباء", "هاتف : رسالة"], correct: 0, explanation: "الساعة تقيس الزمن، ومقياس الحرارة يقيس درجة الحرارة." },
    { id: "va1-9", text: "مفتاح : قفل", choices: ["كلمة مرور : حساب", "عنوان : رسالة", "تذكرة : مقعد", "خريطة : مدينة"], correct: 0, explanation: "المفتاح يتيح فتح القفل، وكلمة المرور تتيح الدخول إلى الحساب." },
    { id: "va1-10", text: "طبيب : علاج", choices: ["معلم : تعليم", "مهندس : مبنى", "كاتب : صحيفة", "مزارع : تربة"], correct: 0, explanation: "العلاقة بين صاحب المهنة ووظيفته الأساسية." },
  ],
  "verbal-context-1": [
    { id: "vc1-1", text: "لا تُقاس قيمة الفكرة بحداثتها فقط، بل بقدرتها على ______ مشكلة حقيقية.", choices: ["تعقيد", "حل", "تجاهل", "تأجيل"], correct: 1, explanation: "السياق يربط قيمة الفكرة بقدرتها على حل مشكلة." },
    { id: "vc1-2", text: "حين يعترف الباحث بحدود دراسته فإنه يعزّز ______ نتائجه ولا ينتقص منها.", choices: ["غموض", "مصداقية", "سرعة", "شهرة"], correct: 1, explanation: "الاعتراف بالحدود سلوك علمي يعزّز المصداقية." },
    { id: "vc1-3", text: "كان القائد يصغي للآراء المخالفة؛ لأنه يرى في الحوار وسيلةً لـ ______ القرار.", choices: ["إرباك", "تحسين", "إلغاء", "تأخير"], correct: 1, explanation: "الإصغاء للآراء المتنوعة يساعد على تحسين القرار." },
    { id: "vc1-4", text: "كلما اتسعت معارف الإنسان أدرك أن ما يجهله ______ مما يعرفه.", choices: ["أقل", "أيسر", "أكثر", "أوضح"], correct: 2, explanation: "اتساع المعرفة يزيد الوعي بحجم المجهول." },
    { id: "vc1-5", text: "العجلة في الحكم قد تحجب تفاصيل ______ مسار القضية كاملًا.", choices: ["تغيّر", "تكرّر", "تختصر", "تزيّن"], correct: 0, explanation: "التفاصيل قد تغيّر فهم القضية ومسار الحكم عليها." },
    { id: "vc1-6", text: "النقد البنّاء لا يكتفي بكشف الخلل، بل يقترح مسارًا لـ ______.", choices: ["التراجع", "التحسين", "التبرير", "التجاهل"], correct: 1, explanation: "التحسين هو الغاية التي تميّز النقد البنّاء." },
    { id: "vc1-7", text: "اختر الكلمة غير الملائمة سياقيًا: «ازدهرت الحديقة بفضل إهمال العامل سقايتها».", choices: ["ازدهرت", "الحديقة", "إهمال", "سقايتها"], correct: 2, explanation: "الإهمال لا يؤدي إلى الازدهار؛ الأنسب اهتمام العامل بسقايتها." },
    { id: "vc1-8", text: "من يستمع ليفهم يختلف عمّن يستمع لمجرد ______.", choices: ["الرد", "التعلّم", "التأمل", "الإنصاف"], correct: 0, explanation: "المقابلة بين الفهم والاستماع بغرض الرد فقط هي الأوضح." },
    { id: "vc1-9", text: "الفكرة الواضحة لا تحتاج إلى ألفاظ ______ تحجب معناها.", choices: ["دقيقة", "معقّدة", "مألوفة", "محددة"], correct: 1, explanation: "الألفاظ المعقدة قد تحجب المعنى الواضح." },
    { id: "vc1-10", text: "قبل مشاركة معلومة مثيرة، من الحكمة ______ مصدرها.", choices: ["نسيان", "تغيير", "التحقق من", "المبالغة في"], correct: 2, explanation: "التحقق من المصدر يحمي من نشر المعلومات غير الدقيقة." },
  ],
  "verbal-reading-1": [
    { id: "vr1-1", text: "ما الفكرة الرئيسة للنص؟", choices: ["منع زراعة الأشجار في المدن", "نجاح التشجير الحضري يحتاج تخطيطًا يوازن المنافع والموارد", "كل الأشجار تخفض الحرارة بالمقدار نفسه", "الماء أهم من الظل في المدن"], correct: 1, explanation: "يلخّص الخيار عناصر النص: الفائدة، اختيار الأنواع، التوزيع، والموارد.", passage: readingPassageOne },
    { id: "vr1-2", text: "أي عامل لم يذكره النص ضمن أسباب خفض الحرارة؟", choices: ["توفير الظل", "امتصاص جزء من الإشعاع", "إطلاق بخار الماء", "زيادة سرعة الرياح"], correct: 3, explanation: "ذكر النص الظل والإشعاع وبخار الماء، ولم يذكر زيادة سرعة الرياح.", passage: readingPassageOne },
    { id: "vr1-3", text: "يُفهم من النص أن كثرة الأشجار وحدها:", choices: ["تكفي لنجاح المشروع دائمًا", "قد لا تحقق الهدف دون اختيار وتوزيع مناسبين", "تمنع المشاة من الحركة حتمًا", "تلغي الحاجة إلى الصيانة"], correct: 1, explanation: "صرّح النص بأن الأثر لا يعتمد على العدد وحده.", passage: readingPassageOne },
    { id: "vr1-4", text: "المقصود بعبارة «حسن إدارة الموارد» في السياق أقرب إلى:", choices: ["زيادة استهلاك الماء", "اختيار حلول قابلة للاستمرار والصيانة", "إزالة الأشجار القديمة", "توسيع الطرق فقط"], correct: 1, explanation: "السياق يربط الموارد باستهلاك الماء وسهولة الصيانة.", passage: readingPassageOne },
    { id: "vr1-5", text: "أي عنوان أنسب للنص؟", choices: ["التشجير الحضري: عدد الأشجار أم جودة التخطيط؟", "تاريخ الحدائق العامة", "أنواع التربة الزراعية", "مشكلة ازدحام المركبات"], correct: 0, explanation: "العنوان يجمع موضوع النص والمقارنة التي يوضحها.", passage: readingPassageOne },
    { id: "vr1-6", text: "ما الفكرة الرئيسة للنص؟", choices: ["القراءة السريعة أفضل دائمًا", "لكل نص سرعة واحدة مناسبة", "القارئ الماهر يكيّف سرعته مع الهدف وصعوبة النص", "الخبرة السابقة تعيق فهم النص"], correct: 2, explanation: "الخاتمة تلخص موقف النص: تغيير الإيقاع وفق الهدف والصعوبة.", passage: readingPassageTwo },
    { id: "vr1-7", text: "متى تكون القراءة السريعة مناسبة وفق النص؟", choices: ["عند تحليل الحجج المعقدة", "عند البحث عن معلومة محددة", "عند حفظ جميع التفاصيل", "عند مقارنة أفكار متعددة"], correct: 1, explanation: "ذكر النص البحث عن معلومة محددة مثالًا صريحًا." , passage: readingPassageTwo },
    { id: "vr1-8", text: "ما المشكلة التي يحذّر منها الكاتب؟", choices: ["استخدام السرعة أسلوبًا وحيدًا لكل النصوص", "التوقف أثناء القراءة", "ربط النص بالخبرات السابقة", "تكوين تصور أولي"], correct: 0, explanation: "تظهر المشكلة حين تتحول السرعة إلى عادة وحيدة.", passage: readingPassageTwo },
    { id: "vr1-9", text: "يفيد النص أن القراءة العميقة تتطلب:", choices: ["إهمال الحجج", "وقتًا للربط والمقارنة", "سرعة ثابتة", "البحث عن كلمة واحدة"], correct: 1, explanation: "يذكر النص الربط بين الأفكار ومقارنة الحجج ضمن القراءة العميقة.", passage: readingPassageTwo },
    { id: "vr1-10", text: "العلاقة بين الفقرتين في النص هي:", choices: ["رفض القراءة السريعة ثم قبولها", "تعريف القراءة العميقة ثم توضيح موضع القراءة السريعة والموازنة بينهما", "سرد حدثين تاريخيين", "عرض سبب واحد بلا نتيجة"], correct: 1, explanation: "بدأ النص بالعميقة، ثم بيّن فائدة السريعة وحدود استخدامها.", passage: readingPassageTwo },
  ],
  "quant-ratios-1": [
    { id: "qr1-1", text: "إذا كان ثمن 3 دفاتر 18 ريالًا، فما ثمن 5 دفاتر بالسعر نفسه؟", choices: ["24", "27", "30", "36"], correct: 2, explanation: "ثمن الدفتر 6 ريالات، وثمن خمسة دفاتر 30 ريالًا." },
    { id: "qr1-2", text: "خزان سعته 250 لترًا، امتلأ منه 40٪. كم لترًا في الخزان؟", choices: ["80", "90", "100", "125"], correct: 2, explanation: "40٪ من 250 = 0.4 × 250 = 100." },
    { id: "qr1-3", text: "قطعت مركبة 180 كم خلال ساعتين ونصف. ما متوسط سرعتها؟", choices: ["60 كم/س", "68 كم/س", "72 كم/س", "75 كم/س"], correct: 2, explanation: "السرعة = المسافة ÷ الزمن = 180 ÷ 2.5 = 72 كم/س." },
    { id: "qr1-4", text: "سعر حقيبة 240 ريالًا، وعليها خصم 20٪. ما السعر بعد الخصم؟", choices: ["180", "192", "200", "220"], correct: 1, explanation: "قيمة الخصم 48 ريالًا؛ السعر الجديد 192 ريالًا." },
    { id: "qr1-5", text: "نسبة الطالبات إلى الطلاب 5 : 3، وكان مجموعهم 32. كم عدد الطالبات؟", choices: ["12", "18", "20", "24"], correct: 2, explanation: "مجموع الأجزاء 8، قيمة الجزء 4، وعدد الطالبات 5 × 4 = 20." },
    { id: "qr1-6", text: "يعبّئ عامل 6 صناديق في 15 دقيقة بالمعدل نفسه. كم دقيقة يحتاج لتعبئة 18 صندوقًا؟", choices: ["30", "40", "45", "60"], correct: 2, explanation: "18 صندوقًا تساوي ثلاثة أمثال 6؛ الزمن 3 × 15 = 45 دقيقة." },
    { id: "qr1-7", text: "خُلِط الماء بالعصير بنسبة 4 : 1، وكان حجم الخليط 10 لترات. كم لترًا من العصير؟", choices: ["1", "2", "2.5", "4"], correct: 1, explanation: "مجموع الأجزاء 5، وقيمة الجزء 2 لتر؛ العصير جزء واحد." },
    { id: "qr1-8", text: "ارتفع سعر سلعة من 80 إلى 92 ريالًا. ما نسبة الزيادة؟", choices: ["10٪", "12٪", "15٪", "20٪"], correct: 2, explanation: "الزيادة 12، ونسبتها من السعر الأصلي 12 ÷ 80 = 15٪." },
    { id: "qr1-9", text: "في خريطة مقياسها 1 : 100000، تمثل مسافة 3.5 سم كم كيلومترًا في الواقع؟", choices: ["0.35", "1.5", "3.5", "35"], correct: 2, explanation: "كل 1 سم يمثل 1 كم، لذلك 3.5 سم تمثل 3.5 كم." },
    { id: "qr1-10", text: "ينجز 12 عاملًا عملًا في 8 أيام بالمعدل نفسه. كم يومًا يحتاج 16 عاملًا؟", choices: ["4", "6", "10", "12"], correct: 1, explanation: "العمل ثابت: 12 × 8 = 96 عامل-يوم، و96 ÷ 16 = 6 أيام." },
  ],
  "quant-algebra-1": [
    { id: "qa1-1", text: "إذا كان 3س + 5 = 20، فما قيمة س؟", choices: ["3", "4", "5", "6"], correct: 2, explanation: "3س = 15، إذن س = 5." },
    { id: "qa1-2", text: "إذا كانت س : ص = 2 : 3، وكانت ص = 12، فما قيمة س؟", choices: ["6", "8", "9", "10"], correct: 1, explanation: "عامل التكبير 4؛ س = 2 × 4 = 8." },
    { id: "qa1-3", text: "إذا كان س² − 9 = 0، وكانت س موجبة، فما قيمة س؟", choices: ["1", "3", "6", "9"], correct: 1, explanation: "س² = 9، والجذر الموجب هو 3." },
    { id: "qa1-4", text: "إذا كان 2(أ + 3) = 18، فما قيمة أ؟", choices: ["5", "6", "7", "9"], correct: 1, explanation: "أ + 3 = 9، إذن أ = 6." },
    { id: "qa1-5", text: "ثلاثة أعداد صحيحة متتالية مجموعها 45. ما العدد الأوسط؟", choices: ["13", "14", "15", "16"], correct: 2, explanation: "الأعداد 14 و15 و16، والعدد الأوسط 15." },
    { id: "qa1-6", text: "إذا كانت د(س) = 2س² − 1، فما قيمة د(3)؟", choices: ["11", "15", "17", "19"], correct: 2, explanation: "2 × 3² − 1 = 18 − 1 = 17." },
    { id: "qa1-7", text: "إذا كان (س + 2)(س − 2) = 21، وكانت س موجبة، فما قيمتها؟", choices: ["3", "4", "5", "7"], correct: 2, explanation: "س² − 4 = 21، إذن س² = 25، والجذر الموجب 5." },
    { id: "qa1-8", text: "إذا كان 1 ÷ س = 0.25، فما قيمة س؟", choices: ["2", "4", "5", "8"], correct: 1, explanation: "0.25 = ربع، لذا 1 ÷ س = 1 ÷ 4، فتكون س = 4." },
    { id: "qa1-9", text: "أي العبارات الآتية تكافئ 5س − 2 > 13؟", choices: ["س > 2", "س > 3", "س < 3", "س ≥ 3"], correct: 1, explanation: "5س > 15، وبالقسمة على 5 نحصل على س > 3." },
    { id: "qa1-10", text: "إذا كان س + ص = 14، وس − ص = 4، فما قيمة س؟", choices: ["5", "7", "9", "10"], correct: 2, explanation: "بجمع المعادلتين: 2س = 18، إذن س = 9." },
  ],
  "quant-geometry-1": [
    { id: "qg1-1", text: "في مثلث زاويتان قياسهما 50° و60°. فما قياس الزاوية الثالثة؟", choices: ["60°", "70°", "80°", "90°"], correct: 1, explanation: "مجموع زوايا المثلث 180°؛ الزاوية الثالثة 70°." },
    { id: "qg1-2", text: "مستطيل طوله 8 سم وعرضه 5 سم. ما مساحته؟", choices: ["13 سم²", "26 سم²", "40 سم²", "80 سم²"], correct: 2, explanation: "المساحة = الطول × العرض = 8 × 5 = 40 سم²." },
    { id: "qg1-3", text: "مربع طول ضلعه 6 سم. ما محيطه؟", choices: ["12 سم", "18 سم", "24 سم", "36 سم"], correct: 2, explanation: "المحيط = 4 × طول الضلع = 24 سم." },
    { id: "qg1-4", text: "دائرة نصف قطرها 7 سم. ما محيطها إذا استُخدم ط = 22/7؟", choices: ["22 سم", "44 سم", "77 سم", "154 سم"], correct: 1, explanation: "المحيط = 2 × ط × نق = 2 × 22/7 × 7 = 44 سم." },
    { id: "qg1-5", text: "ما المتوسط الحسابي للأعداد: 4، 6، 8، 12؟", choices: ["6", "7", "7.5", "8"], correct: 2, explanation: "المجموع 30، وعدد القيم 4؛ المتوسط 7.5." },
    { id: "qg1-6", text: "ما الوسيط للقيم: 3، 5، 7، 9، 20؟", choices: ["5", "7", "8", "9"], correct: 1, explanation: "القيمة الواقعة في المنتصف بعد الترتيب هي 7." },
    { id: "qg1-7", text: "ما المدى للقيم: 4، 10، 13، 16؟", choices: ["6", "10", "12", "16"], correct: 2, explanation: "المدى = أكبر قيمة − أصغر قيمة = 16 − 4 = 12." },
    { id: "qg1-8", text: "مثلث قائم طولا ضلعيه القائمين 6 سم و8 سم. ما طول الوتر؟", choices: ["9 سم", "10 سم", "12 سم", "14 سم"], correct: 1, explanation: "الوتر = √(6² + 8²) = √100 = 10 سم." },
    { id: "qg1-9", text: "مثلث طول قاعدته 10 سم وارتفاعه 6 سم. ما مساحته؟", choices: ["16 سم²", "30 سم²", "60 سم²", "80 سم²"], correct: 1, explanation: "المساحة = نصف × القاعدة × الارتفاع = 30 سم²." },
    { id: "qg1-10", text: "كيس فيه 3 كرات حمراء وكرتان زرقاوان. ما احتمال سحب كرة حمراء؟", choices: ["2/5", "1/2", "3/5", "3/2"], correct: 2, explanation: "عدد النتائج المناسبة 3 من مجموع 5، فالاحتمال 3/5." },
  ],
};

const abilityGames: AbilityGame[] = [
  {
    id: "analogy",
    title: "تحدي التناظر اللفظي",
    typeLabel: "مسار اختيار من متعدد",
    description: "خمس مراحل متدرجة لاكتشاف العلاقة بين الكلمات.",
    subject: "قدرات لفظي",
    sourceLabel: "فيديوهات المحاضرات اللفظية وملفات التناظر اللفظي",
    icon: Link2,
    mode: "multiple-choice",
    stages: [
      { title: "العلاقة والاستخدام", question: "قلم : كتابة = فرشاة : ؟", choices: ["رسم", "قراءة", "قياس", "سفر"], correct: 0 },
      { title: "الأداة والقياس", question: "بوصلة : اتجاه = ميزان : ؟", choices: ["وزن", "طول", "سرعة", "حرارة"], correct: 0 },
      { title: "الأصل والناتج", question: "بذرة : شجرة = بيضة : ؟", choices: ["عش", "طائر", "ريشة", "غصن"], correct: 1 },
      { title: "التضاد", question: "صمت : ضوضاء = ظلام : ؟", choices: ["ليل", "ظل", "نور", "هدوء"], correct: 2 },
      { title: "المكان والمحتوى", question: "مكتبة : كتب = حديقة : ؟", choices: ["مقاعد", "أسوار", "أشجار", "طرقات"], correct: 2 },
    ],
  },
  {
    id: "fill-blank",
    title: "مسار إكمال الجمل",
    typeLabel: "تحدي لغوي كتابي",
    description: "خمس مراحل لاختيار الكلمة الأدق وفق سياق الجملة.",
    subject: "قدرات لفظي",
    sourceLabel: "فيديوهات إكمال الجمل وملفات السياق اللفظي",
    icon: Languages,
    mode: "fill-blank",
    stages: [
      { title: "سبب النجاح", question: "لم يكن النجاح وليد الصدفة، بل ثمرة ______.", acceptedAnswers: ["الاجتهاد", "اجتهاد"] },
      { title: "البحث العلمي", question: "اعتراف الباحث بحدود دراسته يعزّز ______ النتائج.", acceptedAnswers: ["مصداقية", "مصداقية النتائج", "المصداقية"] },
      { title: "الحوار والقرار", question: "الإصغاء للآراء المختلفة يساعد على ______ القرار.", acceptedAnswers: ["تحسين", "تحسين القرار"] },
      { title: "النقد البنّاء", question: "النقد البنّاء يكشف الخلل ويقترح طريقًا نحو ______.", acceptedAnswers: ["التحسين", "تحسين"] },
      { title: "التحقق من المعلومات", question: "قبل مشاركة معلومة مثيرة، من الحكمة ______ من مصدرها.", acceptedAnswers: ["التحقق", "التأكد"] },
    ],
  },
  {
    id: "ability-wheel",
    title: "عجلة مهارات القدرات",
    typeLabel: "تحديات لفظية وكمية",
    description: "أديري العجلة في كل مرحلة واكملي خمس مهارات متنوعة.",
    subject: "قدرات متنوعة",
    sourceLabel: "ملفات التجميعات والفيديوهات اللفظية والكمية",
    icon: Sparkles,
    mode: "wheel",
    stages: [
      { title: "النسبة المئوية", question: "ما قيمة 25٪ من 80؟", choices: ["15", "20", "25", "30"], correct: 1 },
      { title: "التناظر اللفظي", question: "نحلة : خلية = طائر : ؟", choices: ["عش", "ريشة", "جناح", "سماء"], correct: 0 },
      { title: "الأنماط العددية", question: "ما العدد التالي: 2، 4، 8، 16، ؟", choices: ["20", "24", "30", "32"], correct: 3 },
      { title: "المتضادات", question: "ما ضد كلمة «نادر»؟", choices: ["قليل", "شائع", "بعيد", "ثمين"], correct: 1 },
      { title: "التعويض الجبري", question: "إذا كان س = 7، فما قيمة 3س + 2؟", choices: ["21", "22", "23", "24"], correct: 2 },
    ],
  },
  {
    id: "matching",
    title: "المطابقة الذكية",
    typeLabel: "بطاقات مطابقة",
    description: "خمس لوحات مطابقة للمفردات والعلاقات والمفاهيم.",
    subject: "قدرات متنوعة",
    sourceLabel: "ملفات المفردات وملفات تأسيس المنصف",
    icon: Puzzle,
    mode: "matching",
    stages: [
      { title: "المفردة ومعناها", pairs: [{ left: "حَثيث", right: "سريع ومتواصل" }, { left: "نَزِر", right: "قليل" }, { left: "وَارف", right: "كثير الظل" }] },
      { title: "الكلمة وضدها", pairs: [{ left: "نادر", right: "شائع" }, { left: "غامض", right: "واضح" }, { left: "متواضع", right: "متكبّر" }] },
      { title: "الأداة ووظيفتها", pairs: [{ left: "البوصلة", right: "تحديد الاتجاه" }, { left: "الميزان", right: "قياس الوزن" }, { left: "الساعة", right: "قياس الزمن" }] },
      { title: "المفهوم الكمي وتعريفه", pairs: [{ left: "المتوسط", right: "مجموع القيم ÷ عددها" }, { left: "المحيط", right: "مجموع أطوال الأضلاع" }, { left: "المدى", right: "أكبر قيمة − أصغر قيمة" }] },
      { title: "المنتِج وما ينتجه", pairs: [{ left: "النحل", right: "العسل" }, { left: "دودة القز", right: "الحرير" }, { left: "النخلة", right: "التمر" }] },
    ],
  },
  {
    id: "ordering",
    title: "مسار ترتيب القيم",
    typeLabel: "ترتيب كمي متدرج",
    description: "خمس مراحل لترتيب الكسور والنسب والأعداد والقياسات.",
    subject: "قدرات كمي",
    sourceLabel: "ملفات تأسيس المنصف وتدريبات المقارنات الكمية",
    icon: Calculator,
    mode: "ordering",
    stages: [
      { title: "الكسور والعشريات", question: "رتّبي من الأصغر إلى الأكبر.", orderItems: ["3/4", "1.2", "25٪", "0.5"], correctOrder: ["25٪", "0.5", "3/4", "1.2"] },
      { title: "الأعداد الصحيحة", question: "رتّبي من الأصغر إلى الأكبر.", orderItems: ["5", "−3", "2", "0"], correctOrder: ["−3", "0", "2", "5"] },
      { title: "النسب المتكافئة", question: "رتّبي من الأصغر إلى الأكبر.", orderItems: ["75٪", "1/4", "0.5", "10٪"], correctOrder: ["10٪", "1/4", "0.5", "75٪"] },
      { title: "مقارنة الكسور", question: "رتّبي من الأصغر إلى الأكبر.", orderItems: ["1/2", "3/4", "1/5", "1/3"], correctOrder: ["1/5", "1/3", "1/2", "3/4"] },
      { title: "تحويل وحدات الطول", question: "رتّبي الأطوال من الأقصر إلى الأطول.", orderItems: ["1.2 م", "95 سم", "150 سم", "0.8 م"], correctOrder: ["0.8 م", "95 سم", "1.2 م", "150 سم"] },
    ],
  },
  {
    id: "true-false",
    title: "بوابة صح أم خطأ",
    typeLabel: "استدلال كمي سريع",
    description: "خمس بوابات للتحقق من صحة القوانين والنتائج الكمية.",
    subject: "قدرات كمي",
    sourceLabel: "فيديوهات تدريب المنصف وملفات القوانين الكمية",
    icon: BrainCircuit,
    mode: "true-false",
    stages: [
      { title: "المعادلات", question: "إذا كان نصف عدد يساوي 18، فإن العدد يساوي 36.", choices: ["صح", "خطأ"], correct: 0 },
      { title: "النسبة المئوية", question: "20٪ من 150 تساوي 30.", choices: ["صح", "خطأ"], correct: 0 },
      { title: "زوايا المثلث", question: "مجموع الزوايا الداخلية للمثلث يساوي 180°.", choices: ["صح", "خطأ"], correct: 0 },
      { title: "محيط المربع", question: "محيط مربع طول ضلعه 6 سم يساوي 36 سم.", choices: ["صح", "خطأ"], correct: 1 },
      { title: "الوسيط", question: "وسيط القيم 3، 5، 9 هو العدد 5.", choices: ["صح", "خطأ"], correct: 0 },
    ],
  },
];

const navItems = [
  { view: "home" as View, label: "الرئيسية", icon: Home },
  { view: "lessons" as View, label: "الشرح", icon: BookOpen },
  { view: "files" as View, label: "الملفات", icon: FolderOpen },
  { view: "tests" as View, label: "الاختبارات", icon: ClipboardCheck },
  { view: "games" as View, label: "الألعاب", icon: Puzzle },
  { view: "articles" as View, label: "المقالات", icon: Newspaper },
  { view: "contact" as View, label: "اتصل بنا", icon: Mail },
];

const contactEmail = "amwahz1395@gmail.com";

const articleIcons = {
  book: BookOpen,
  language: Languages,
  calculator: Calculator,
  brain: BrainCircuit,
  calendar: CalendarDays,
  sparkles: Sparkles,
  puzzle: Puzzle,
};

const viewActivityLabels: Partial<Record<View, string>> = {
  home: "الرئيسية",
  lessons: "الشرح",
  "category-lessons": "أقسام الشرح",
  "verbal-lessons": "قدرات لفظي",
  "mansaf-foundation": "تأسيس المنصف",
  "mansaf-training": "تدريب المنصف",
  "mansaf-files": "ملفات المنصف",
  "mansaf-file-group": "مجموعات ملفات المنصف",
  lesson: "مشاهدة درس",
  files: "الملفات",
  "file-category": "قسم الملفات",
  tests: "الاختبارات",
  test: "حل اختبار",
  games: "الألعاب",
  game: "لعبة تعليمية",
  articles: "المقالات",
  article: "قراءة مقال",
  contact: "التواصل",
};

function formatActivityDate(value?: string | null) {
  if (!value) return "لا يوجد نشاط مسجل";
  return new Intl.DateTimeFormat("ar-SA", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function getYouTubeEmbed(url: string) {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?\s]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

function getVerbalLectureOrder(lesson: Lesson) {
  if (lesson.category !== "قدرات لفظي") return null;
  const titleMatch = lesson.title.match(/(?:المحاضرة|القسم)\s*(?:رقم)?\s*(\d+)/);
  const idMatch = lesson.id.match(/verbal-lecture-(\d+)/);
  const value = titleMatch?.[1] ?? idMatch?.[1];
  return value ? Number(value) : null;
}

function lectureCountLabel(count: number) {
  if (count === 1) return "محاضرة واحدة";
  if (count === 2) return "محاضرتان";
  if (count >= 3 && count <= 10) return `${count} محاضرات`;
  return `${count} محاضرة`;
}

function availableVideoLabel(count: number, total: number) {
  if (count === 1) return `فيديو واحد متاح من ${total}`;
  if (count === 2) return `فيديوهان متاحان من ${total}`;
  if (count >= 3 && count <= 10) return `${count} فيديوهات متاحة من ${total}`;
  return `${count} فيديو متاح من ${total}`;
}

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function HomePage() {
  const [view, setViewState] = useState<View>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [lessonCategory, setLessonCategory] = useState<LessonCategory>("قدرات كمي");
  const [verbalPage, setVerbalPage] = useState(1);
  const [mansafPage, setMansafPage] = useState(1);
  const [mansafTrainingPage, setMansafTrainingPage] = useState(1);
  const [mansafFilesPage, setMansafFilesPage] = useState(1);
  const [selectedMansafFileGroup, setSelectedMansafFileGroup] = useState<MansafFileGroup>("ملفات زبدة المنصف");
  const [selectedFileCategory, setSelectedFileCategory] = useState<FileLibraryCategory>("تجميع السنوات السابقة");
  const [selectedPreviousYear, setSelectedPreviousYear] = useState<PreviousYear>("1434");
  const [lessons, setLessons] = useState<Lesson[]>(demoLessons);
  const [files, setFiles] = useState<LearningFile[]>(demoFiles);
  const [tests, setTests] = useState<TestItem[]>(demoTests);
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(demoLessons[0]);
  const [selectedTest, setSelectedTest] = useState<TestItem>(demoTests[0]);
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>("overview");
  const sessionChecking = false;
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [loginMessage, setLoginMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dashboardMessage, setDashboardMessage] = useState("");
  const [testAnswers, setTestAnswers] = useState<Record<string, number>>({});
  const [testResult, setTestResult] = useState<number | null>(null);
  const [testCategoryFilter, setTestCategoryFilter] = useState("الكل");
  const [articleCategoryFilter, setArticleCategoryFilter] = useState<"all" | ArticleCategoryId>("all");
  const [articleSearch, setArticleSearch] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle>(knowledgeArticles[0]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [testDeadline, setTestDeadline] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(demoTests[0].minutes * 60);
  const [testSubmittedByTime, setTestSubmittedByTime] = useState(false);
  const testSubmissionRef = useRef(false);
  const [activeGameId, setActiveGameId] = useState("analogy");
  const [gameStageIndex, setGameStageIndex] = useState(0);
  const [gameAnswer, setGameAnswer] = useState<number | null>(null);
  const [gameOutcome, setGameOutcome] = useState<"success" | "stage-success" | "retry" | null>(null);
  const [fillBlankAnswer, setFillBlankAnswer] = useState("");
  const [selectedMatchWord, setSelectedMatchWord] = useState<string | null>(null);
  const [matchedWords, setMatchedWords] = useState<string[]>([]);
  const [matchingMessage, setMatchingMessage] = useState("");
  const [orderedValues, setOrderedValues] = useState<string[]>([]);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [wheelReady, setWheelReady] = useState(false);
  const [completedGameIds, setCompletedGameIds] = useState<string[]>([]);
  const [certificateStudentName, setCertificateStudentName] = useState("");
  const [certificateNameMessage, setCertificateNameMessage] = useState("");
  const [certificatePreview, setCertificatePreview] = useState<CertificatePreview | null>(null);
  const [studentRecords, setStudentRecords] = useState<StudentRecord[]>(demoStudents);
  const [selectedStudentId, setSelectedStudentId] = useState(demoStudents[0].id);
  const [studentSearch, setStudentSearch] = useState("");
  const [studentGradeFilter, setStudentGradeFilter] = useState("الكل");
  const [studentPage, setStudentPage] = useState(1);
  const [contactSent, setContactSent] = useState(false);
  const [lessonForm, setLessonForm] = useState({ title: "", description: "", category: "قدرات لفظي", duration: "", videoUrl: "", published: true });
  const [fileForm, setFileForm] = useState({ title: "", type: "PDF", fileUrl: "", lessonId: "" });
  const [testForm, setTestForm] = useState({ title: "", category: "قدرات لفظي", questions: "10", minutes: "15" });
  const activeTestQuestions = testQuestionBanks[selectedTest.id] ?? sampleQuestions;
  const filteredArticles = useMemo(() => {
    const query = articleSearch.trim().toLocaleLowerCase("ar");
    return knowledgeArticles.filter((article) => {
      const matchesCategory = articleCategoryFilter === "all" || article.category === articleCategoryFilter;
      const matchesSearch = !query || `${article.title} ${article.answer}`.toLocaleLowerCase("ar").includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [articleCategoryFilter, articleSearch]);

  async function recordActivity(_area: string, _itemTitle: string, _action = "فتح القسم") {
    // نسخة GitHub Pages ثابتة: لا توجد قاعدة بيانات أو اتصالات خادمية.
    return;
  }

  const setView = (next: View) => {
    const publicView: View = next === "dashboard" || next === "login" ? "home" : next;
    setViewState(publicView);
    setMenuOpen(false);
    if (typeof window !== "undefined") window.history.pushState(null, "", `#${publicView}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
    const activityLabel = viewActivityLabels[publicView];
    if (activityLabel) void recordActivity(activityLabel, activityLabel);
  };

  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.replace("#", "") as View;
      const allowed: View[] = ["home", "lessons", "category-lessons", "verbal-lessons", "mansaf-foundation", "mansaf-training", "mansaf-files", "mansaf-file-group", "lesson", "files", "file-category", "tests", "test", "games", "game", "articles", "article", "contact"];
      if (!allowed.includes(hash)) return;
      if (hash === "game") {
        const currentGameId = window.localStorage.getItem("qodrati-current-game");
        const currentGame = abilityGames.find((game) => game.id === currentGameId);
        if (currentGame) setActiveGameId(currentGame.id);
      }
      if (hash === "article") {
        const currentArticleId = window.localStorage.getItem("qodrati-current-article");
        const currentArticle = knowledgeArticles.find((article) => article.id === currentArticleId);
        if (currentArticle) setSelectedArticle(currentArticle);
      }
      if (hash === "test") {
        const currentTestId = window.localStorage.getItem("qodrati-current-test");
        const currentTest = demoTests.find((test) => test.id === currentTestId);
        if (currentTest) {
          try {
            const savedAttempt = JSON.parse(window.localStorage.getItem(`qodrati-attempt-${currentTest.id}`) ?? "null") as { answers?: Record<string, number>; deadline?: number; currentQuestionIndex?: number } | null;
            if (savedAttempt?.deadline && savedAttempt.deadline > Date.now()) {
              setSelectedTest(currentTest);
              setTestAnswers(savedAttempt.answers ?? {});
              setCurrentQuestionIndex(Math.max(0, Math.min(savedAttempt.currentQuestionIndex ?? 0, (testQuestionBanks[currentTest.id] ?? sampleQuestions).length - 1)));
              setTestDeadline(savedAttempt.deadline);
              setTimeLeft(Math.max(0, Math.ceil((savedAttempt.deadline - Date.now()) / 1000)));
              setViewState("test");
              return;
            }
          } catch {
            window.localStorage.removeItem(`qodrati-attempt-${currentTest.id}`);
          }
        }
        window.history.replaceState(null, "", "#tests");
        setViewState("tests");
        return;
      }
      setViewState(hash);
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  useEffect(() => {
    if (view !== "test" || testResult !== null || testDeadline === null) return;
    const updateTimer = () => setTimeLeft(Math.max(0, Math.ceil((testDeadline - Date.now()) / 1000)));
    updateTimer();
    const timer = window.setInterval(updateTimer, 1000);
    return () => window.clearInterval(timer);
  }, [view, testResult, testDeadline]);

  useEffect(() => {
    if (view === "test" && testResult === null && testDeadline !== null && timeLeft === 0) {
      void submitTest(true);
    }
  }, [view, testResult, testDeadline, timeLeft]);

  useEffect(() => {
    if (view !== "test" || testResult !== null || testDeadline === null) return;
    window.localStorage.setItem(`qodrati-attempt-${selectedTest.id}`, JSON.stringify({
      answers: testAnswers,
      deadline: testDeadline,
      currentQuestionIndex,
    }));
  }, [view, testResult, testDeadline, selectedTest.id, testAnswers, currentQuestionIndex]);

  const filteredLessons = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return query ? lessons.filter((lesson) => `${lesson.title} ${lesson.description} ${lesson.category}`.toLowerCase().includes(query)) : lessons;
  }, [lessons, searchQuery]);
  const filteredTests = useMemo(() => testCategoryFilter === "الكل" ? tests : tests.filter((test) => test.category === testCategoryFilter), [tests, testCategoryFilter]);

  const verbalLectures = useMemo(() => lessons
    .filter((lesson) => getVerbalLectureOrder(lesson) !== null)
    .sort((first, second) => (getVerbalLectureOrder(first) ?? 0) - (getVerbalLectureOrder(second) ?? 0)), [lessons]);
  const verbalPageCount = Math.max(1, Math.ceil(verbalLectures.length / verbalLecturesPerPage));
  const visibleVerbalLectures = useMemo(() => {
    const start = (verbalPage - 1) * verbalLecturesPerPage;
    return verbalLectures.slice(start, start + verbalLecturesPerPage);
  }, [verbalLectures, verbalPage]);
  const categoryLessons = filteredLessons.filter((lesson) => lesson.category === lessonCategory);
  const categoryContent = categoryLessons.filter((lesson) => getVerbalLectureOrder(lesson) === null);
  const mansafPageCount = Math.max(1, Math.ceil(mansafFoundationLessons.length / mansafLessonsPerPage));
  const visibleMansafLessons = useMemo(() => {
    const start = (mansafPage - 1) * mansafLessonsPerPage;
    return mansafFoundationLessons.slice(start, start + mansafLessonsPerPage);
  }, [mansafPage]);
  const mansafTrainingPageCount = Math.max(1, Math.ceil(mansafTrainingLessons.length / mansafLessonsPerPage));
  const visibleMansafTrainingLessons = useMemo(() => {
    const start = (mansafTrainingPage - 1) * mansafLessonsPerPage;
    return mansafTrainingLessons.slice(start, start + mansafLessonsPerPage);
  }, [mansafTrainingPage]);
  const linkedMansafFiles = useMemo(() => mansafFiles.map((file) => {
    const uploadedFile = files.find((item) => normalizeFileTitle(item.title) === normalizeFileTitle(file.title));
    return {
      ...file,
      url: uploadedFile?.url || file.url,
      size: uploadedFile?.size || file.size,
    };
  }), [files]);
  const openLessonCategory = (category: LessonCategory) => {
    setLessonCategory(category);
    if (category === "قدرات لفظي") setVerbalPage(1);
    setView(category === "قدرات لفظي" ? "verbal-lessons" : "category-lessons");
  };

  const changeVerbalPage = (page: number) => {
    setVerbalPage(Math.min(Math.max(page, 1), verbalPageCount));
    window.requestAnimationFrame(() => document.getElementById("verbal-lecture-list")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const changeMansafPage = (page: number) => {
    setMansafPage(Math.min(Math.max(page, 1), mansafPageCount));
    window.requestAnimationFrame(() => document.getElementById("mansaf-foundation-list")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const changeMansafTrainingPage = (page: number) => {
    setMansafTrainingPage(Math.min(Math.max(page, 1), mansafTrainingPageCount));
    window.requestAnimationFrame(() => document.getElementById("mansaf-training-list")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const openLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setView("lesson");
    void recordActivity("الشرح", lesson.title, "مشاهدة درس");
  };
  const openArticle = (article: KnowledgeArticle) => {
    setSelectedArticle(article);
    window.localStorage.setItem("qodrati-current-article", article.id);
    setView("article");
    void recordActivity("المقالات", article.title, "قراءة مقال");
  };
  const openTest = (test: TestItem) => {
    setSelectedTest(test);
    const storageKey = `qodrati-attempt-${test.id}`;
    let restoredAnswers: Record<string, number> = {};
    let restoredQuestionIndex = 0;
    let deadline = Date.now() + test.minutes * 60 * 1000;
    try {
      const savedAttempt = window.localStorage.getItem(storageKey);
      if (savedAttempt) {
        const saved = JSON.parse(savedAttempt) as { answers?: Record<string, number>; deadline?: number; currentQuestionIndex?: number };
        if (saved.deadline && saved.deadline > Date.now()) {
          restoredAnswers = saved.answers ?? {};
          restoredQuestionIndex = Math.max(0, Math.min(saved.currentQuestionIndex ?? 0, (testQuestionBanks[test.id] ?? sampleQuestions).length - 1));
          deadline = saved.deadline;
        } else {
          window.localStorage.removeItem(storageKey);
        }
      }
    } catch {
      window.localStorage.removeItem(storageKey);
    }
    setTestAnswers(restoredAnswers);
    setCurrentQuestionIndex(restoredQuestionIndex);
    setTestDeadline(deadline);
    setTimeLeft(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
    setTestResult(null);
    setTestSubmittedByTime(false);
    testSubmissionRef.current = false;
    window.localStorage.setItem("qodrati-current-test", test.id);
    setView("test");
    void recordActivity("الاختبارات", test.title, "بدء الاختبار");
  };

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginMessage("لوحة المعلمة غير مفعّلة في نسخة GitHub Pages العامة.");
  }

  async function logout() {
    setCurrentUser(null);
    setView("home");
  }

  async function handleVideoUpload(file?: File) {
    if (!file) return;
    setUploadProgress(0);
    setDashboardMessage("الرفع المباشر غير متاح على GitHub Pages. أضيفي رابط الفيديو الخارجي بدلًا من رفعه.");
  }

  async function handleFileUpload(file?: File) {
    if (!file) return;
    setUploadProgress(0);
    setFileForm((current) => ({ ...current, type: file.name.split(".").pop()?.toUpperCase() || "FILE" }));
    setDashboardMessage("الرفع المباشر غير متاح على GitHub Pages. ضعي الملف داخل public/files أو أضيفي رابطًا مباشرًا.");
  }

  async function addLesson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!lessonForm.title.trim()) return;
    const localLesson: Lesson = { id: crypto.randomUUID(), ...lessonForm };
    setLessons((current) => [localLesson, ...current]);
    setLessonForm({ title: "", description: "", category: "قدرات لفظي", duration: "", videoUrl: "", published: true });
    setUploadProgress(0);
    setDashboardMessage("أُضيف الدرس داخل الجلسة الحالية فقط.");
  }

  async function addFile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!fileForm.title || !fileForm.fileUrl) { setDashboardMessage("ارفعي الملف أولًا أو أضيفي رابطه."); return; }
    const localFile: LearningFile = { id: crypto.randomUUID(), title: fileForm.title, type: fileForm.type, size: "ملف جديد", url: fileForm.fileUrl, lessonId: fileForm.lessonId || undefined };
    setFiles((current) => [localFile, ...current]);
    setFileForm({ title: "", type: "PDF", fileUrl: "", lessonId: "" });
    setUploadProgress(0);
    setDashboardMessage("أُضيف الملف داخل الجلسة الحالية فقط.");
  }

  function addTest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!testForm.title) return;
    setTests((current) => [{ id: crypto.randomUUID(), title: testForm.title, category: testForm.category, questions: Number(testForm.questions), minutes: Number(testForm.minutes) }, ...current]);
    setTestForm({ title: "", category: "قدرات لفظي", questions: "10", minutes: "15" });
    setDashboardMessage("تمت إضافة بطاقة الاختبار داخل الجلسة الحالية فقط.");
  }

  async function submitTest(timedOut = false) {
    if (testSubmissionRef.current || testResult !== null || (!timedOut && Object.keys(testAnswers).length === 0)) return;
    testSubmissionRef.current = true;
    const questions = testQuestionBanks[selectedTest.id] ?? sampleQuestions;
    const correct = questions.reduce((total, question) => total + (testAnswers[question.id] === question.correct ? 1 : 0), 0);
    const percentage = Math.round((correct / questions.length) * 100);
    setTestSubmittedByTime(timedOut);
    setTestResult(percentage);
    setTestDeadline(null);
    window.localStorage.removeItem(`qodrati-attempt-${selectedTest.id}`);
    window.localStorage.removeItem("qodrati-current-test");
    await recordActivity("الاختبارات", selectedTest.title, `إنهاء الاختبار بدرجة ${percentage}%`);
  }

  async function completeActiveGame(activeGame: AbilityGame) {
    setGameOutcome("success");
    if (completedGameIds.includes(activeGame.id)) return;
    setCompletedGameIds((current) => [...current, activeGame.id]);
    await recordActivity("الألعاب", activeGame.title, "إكمال اللعبة بنجاح");
  }

  async function completeGameStage(activeGame: AbilityGame) {
    if (gameStageIndex >= activeGame.stages.length - 1) {
      await completeActiveGame(activeGame);
      return;
    }
    setGameOutcome("stage-success");
  }

  async function chooseGameAnswer(answerIndex: number) {
    const activeGame = abilityGames.find((game) => game.id === activeGameId) ?? abilityGames[0];
    const activeStage = activeGame.stages[gameStageIndex] ?? activeGame.stages[0];
    if (gameOutcome === "stage-success" || gameOutcome === "success") return;
    setGameAnswer(answerIndex);
    if (answerIndex !== activeStage.correct) {
      setGameOutcome("retry");
      return;
    }
    await completeGameStage(activeGame);
  }

  async function submitFillBlank() {
    const activeGame = abilityGames.find((game) => game.id === activeGameId) ?? abilityGames[0];
    const activeStage = activeGame.stages[gameStageIndex] ?? activeGame.stages[0];
    if (gameOutcome === "stage-success" || gameOutcome === "success") return;
    const normalized = fillBlankAnswer.trim().replace(/\s+/g, " ");
    const correct = activeStage.acceptedAnswers?.some((answer) => answer === normalized);
    if (!correct) {
      setGameOutcome("retry");
      return;
    }
    await completeGameStage(activeGame);
  }

  async function selectMatchingMeaning(meaning: string) {
    const activeGame = abilityGames.find((game) => game.id === activeGameId) ?? abilityGames[0];
    const activeStage = activeGame.stages[gameStageIndex] ?? activeGame.stages[0];
    if (!selectedMatchWord) {
      setMatchingMessage("اختاري المفردة أولًا، ثم اختاري معناها.");
      return;
    }
    const pair = activeStage.pairs?.find((item) => item.left === selectedMatchWord);
    if (pair?.right !== meaning) {
      setMatchingMessage("ليست هذه المطابقة الصحيحة؛ حاولي مرة أخرى.");
      setGameOutcome("retry");
      setSelectedMatchWord(null);
      return;
    }
    const nextMatched = [...matchedWords, selectedMatchWord];
    setMatchedWords(nextMatched);
    setSelectedMatchWord(null);
    setMatchingMessage("مطابقة صحيحة ✦");
    setGameOutcome(null);
    if (nextMatched.length === activeStage.pairs?.length) await completeGameStage(activeGame);
  }

  async function selectOrderedValue(value: string) {
    const activeGame = abilityGames.find((game) => game.id === activeGameId) ?? abilityGames[0];
    const activeStage = activeGame.stages[gameStageIndex] ?? activeGame.stages[0];
    if (orderedValues.includes(value)) return;
    const nextValues = [...orderedValues, value];
    setOrderedValues(nextValues);
    if (nextValues.length !== activeStage.correctOrder?.length) return;
    const correct = nextValues.every((item, index) => item === activeStage.correctOrder?.[index]);
    if (!correct) {
      setGameOutcome("retry");
      return;
    }
    await completeGameStage(activeGame);
  }

  function spinAbilityWheel() {
    setWheelSpinning(true);
    setWheelReady(false);
    setGameAnswer(null);
    setGameOutcome(null);
    setWheelRotation((current) => current + 720 + (gameStageIndex + 1) * 60);
    window.setTimeout(() => {
      setWheelSpinning(false);
      setWheelReady(true);
    }, 900);
  }

  function resetGameInteraction(resetStage = true) {
    if (resetStage) setGameStageIndex(0);
    setGameAnswer(null);
    setGameOutcome(null);
    setFillBlankAnswer("");
    setSelectedMatchWord(null);
    setMatchedWords([]);
    setMatchingMessage("");
    setOrderedValues([]);
    setWheelReady(false);
    setCertificateNameMessage("");
  }

  function openAbilityGame(gameId: string) {
    setActiveGameId(gameId);
    window.localStorage.setItem("qodrati-current-game", gameId);
    setGameStageIndex(0);
    resetGameInteraction(false);
    setView("game");
  }

  function advanceGameStage() {
    const activeGame = abilityGames.find((game) => game.id === activeGameId) ?? abilityGames[0];
    setGameStageIndex((current) => Math.min(current + 1, activeGame.stages.length - 1));
    resetGameInteraction(false);
    window.requestAnimationFrame(() => document.getElementById("active-game-stage")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  async function issueCertificate(activityId: string, activityTitle: string, activityType: "لعبة تعليمية" | "اختبار تفاعلي", score: number) {
    let studentName = certificateStudentName.trim();
    const issuedAtDate = new Date();
    const certificateNumber = `QD-${issuedAtDate.getFullYear()}-${String(issuedAtDate.getTime()).slice(-6)}`;

    if (studentName.split(/\s+/).filter(Boolean).length < 4) {
      setCertificateNameMessage("اكتبي اسمك الرباعي كما تريدين ظهوره في الشهادة.");
      return;
    }

    setCertificatePreview({
      studentName,
      activityTitle,
      activityType,
      score,
      issuedAt: new Intl.DateTimeFormat("ar-SA", { day: "numeric", month: "long", year: "numeric" }).format(issuedAtDate),
      certificateNumber,
    });
    setCertificateNameMessage("");
    await recordActivity("الشهادات", activityTitle, `إصدار شهادة ${activityType}`);
  }

  async function sendContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const fullName = String(form.get("name") ?? "").trim();
    const senderEmail = String(form.get("email") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
    const subject = encodeURIComponent(`رسالة من منصة قدراتي — ${fullName}`);
    const body = encodeURIComponent(`الاسم: ${fullName}\nالبريد: ${senderEmail}\n\nالرسالة:\n${message}`);
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    event.currentTarget.reset();
    setContactSent(true);
  }

  const renderHeader = () => (
    <header className="site-header">
      <button className="brand brand-button" onClick={() => setView("home")} aria-label="العودة إلى الرئيسية">
        <span className="brand-copy"><b>قدراتي</b></span>
      </button>
      <nav className={menuOpen ? "nav-links open" : "nav-links"} aria-label="التنقل الرئيسي">
        {navItems.map(({ label, view: itemView, icon: Icon }) => (
          <button key={label} className={view === itemView ? "active" : ""} onClick={() => setView(itemView)}><Icon size={17} /> {label}</button>
        ))}
      </nav>
      <div className="header-actions">
        <label className="search-box"><Search size={17} /><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} onFocus={() => view !== "lessons" && setView("lessons")} aria-label="البحث" placeholder="بحث..." /></label>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="فتح القائمة">{menuOpen ? <X /> : <Menu />}</button>
      </div>
    </header>
  );

  const renderFooter = () => (
    <footer className="site-footer">
      <div><span className="footer-brand"><span className="footer-monogram">ق</span> قدراتي</span></div>
      <div><strong>الدعم</strong><button onClick={() => setView("contact")}>اتصل بنا</button><a href={`mailto:${contactEmail}`}>{contactEmail}</a></div>
      <div className="footer-rights"><span>الثانوية 107</span><span>جميع الحقوق محفوظة للمعلمة أمل الزهراني © 2026</span></div>
    </footer>
  );

  const pageHeading = (title: string, text: string) => (
    <section className="page-heading"><span className="eyebrow"><Sparkles size={16} /> محتوى تعليمي منظم</span><h1>{title}</h1><p>{text}</p></section>
  );

  const renderHome = () => (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><Sparkles size={17} /> ثقتك تبدأ من استعدادك</span>
          <h1>مع <span>قدراتي</span><br />تعلّم بثقة وتألق</h1>
          <p>شروحات مركّزة، ملفات منظمة، واختبارات تفاعلية ترافقك بخطوات هادئة نحو أفضل نتيجة.</p>
          <div className="hero-school-identity"><School size={20} /><strong>الثانوية 107</strong><span>إشراف المعلمة أمل الزهراني</span></div>
          <div className="hero-actions"><button className="primary-btn large" onClick={() => setView("lessons")}><PlayCircle size={20} /> ابدأ التعلّم</button><button className="secondary-btn" onClick={() => setView("tests")}>جرّب اختبارًا</button></div>
        </div>
        <div className="hero-art teacher-stage" aria-label="معلمة قدراتي ثلاثية الأبعاد">
          <div className="teacher-halo halo-one" /><div className="teacher-halo halo-two" />
          <span className="floating-note note-one">✦</span><span className="floating-note note-two">♡</span><span className="floating-note note-three">✧</span>
          <div className="mini-card mini-book"><BookOpen size={25} /><span>شرح</span></div>
          <div className="mini-card mini-test"><ClipboardCheck size={25} /><span>اختبار</span></div>
          <img className="teacher-character" src="qodrati-teacher.png" alt="معلمة كرتونية ثلاثية الأبعاد تحمل كتابًا وتشرح" />
        </div>
      </section>
      <section className="features-section">
        <div className="feature-grid">
          {[{ t: "شرح واضح", p: "دروس مرتبة وسهلة المتابعة.", i: PlayCircle, tone: "orange" }, { t: "ملفات مفيدة", p: "ملخصات ومستندات في مكان واحد.", i: FileText, tone: "teal" }, { t: "اختبارات ذكية", p: "تدريب عملي ونتائج فورية.", i: ClipboardCheck, tone: "purple" }, { t: "تجربة مريحة", p: "واجهة عربية تعمل على كل الأجهزة.", i: Sparkles, tone: "gold" }].map(({ t, p, i: Icon, tone }) => <article className="feature-card" key={t}><span className={`feature-icon ${tone}`}><Icon size={24} /></span><h2>{t}</h2><p>{p}</p></article>)}
        </div>
        <div className="stats-grid">
          {[{ v: lessons.length, l: "دروس متاحة", i: BookOpen }, { v: "111", l: "فيديوهات", i: Video }, { v: files.length, l: "ملفات تعليمية", i: FileText }, { v: "+11K", l: "متعلمًا", i: Users }].map(({ v, l, i: Icon }) => <article className="stat-card" key={l}><span><Icon size={22} /></span><strong>{v}</strong><p>{l}</p></article>)}
        </div>
      </section>
    </>
  );

  const renderLessons = () => (
    <>{pageHeading("أقسام الشروحات", "اضغط على القسم للدخول إلى محتواه الخاص.")}<section className="content-page"><div className="subject-grid">{([
      { category: "قدرات لفظي", title: "لفظي", meta: `${verbalLectures.length} فيديو مرتّب` },
      { category: "قدرات كمي", title: "كمي", meta: `${quantitativeSections.length} أقسام • ${quantitativeLessonCount} درس` },
      { category: "استيب", title: "استيب", meta: `${stepFiles.length} ملفًا مرتّبًا` },
      { category: "المفكر", title: "المفكر", meta: "ملفان جاهزان" },
    ] as { category: LessonCategory; title: string; meta: string }[]).map(({ category, title, meta }) => <button className="subject-card" key={category} onClick={() => openLessonCategory(category)}><span className="subject-icon"><BookOpen size={31} /></span><span className="subject-copy"><strong>{title}</strong><small>{meta}</small></span><ChevronLeft className="subject-arrow" size={22} /></button>)}</div></section></>
  );

  const renderCategoryLessons = () => (
    <section className="series-page">
      <button className="back-button" onClick={() => setView("lessons")}><ChevronLeft size={18} /> رجوع إلى الأقسام</button>
      <div className="category-heading"><span className="subject-icon"><BookOpen size={30} /></span><div><small>قسم الشروحات</small><h1>{lessonCategory}</h1><p>{lessonCategory === "قدرات كمي" ? `اختر مسارك من ${quantitativeSections.length} أقسام تضم ${quantitativeLessonCount} درسًا.` : lessonCategory === "استيب" ? `${stepFiles.length} ملفًا تعليميًا مرتّبًا وجاهزًا للعرض والتحميل.` : lessonCategory === "المفكر" ? "ملفات المفكر متاحة للعرض المباشر أو التحميل على الجهاز." : "المحتوى التعليمي الخاص بالقسم."}</p></div></div>
      {lessonCategory === "قدرات كمي" ? (
        <div className="quantitative-grid">
          {quantitativeSections.map(({ title, count, availableCount, description, icon: Icon }, index) => (
            <button className={`quantitative-section-card ${availableCount ? "" : "quantitative-section-card-pending"}`} key={title} onClick={() => { if (title === "تأسيس المنصف") { setMansafPage(1); setView("mansaf-foundation"); } else if (title === "تدريب المنصف") { setMansafTrainingPage(1); setView("mansaf-training"); } else if (title === "ملفات المنصف") { setMansafFilesPage(1); setView("mansaf-files"); } }} disabled={!availableCount}>
              <span className="quantitative-card-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="quantitative-card-icon"><Icon size={34} /></span>
              <span className="quantitative-card-copy">
                <small>مسار قدرات كمي</small>
                <strong>{title}</strong>
                <p>{description}</p>
              </span>
              <span className="quantitative-card-footer"><b>{availableCount ? (title === "ملفات المنصف" ? `${availableCount} ملفًا مُدرجًا من ${count}` : availableVideoLabel(availableCount, count)) : `${count} درس`}</b><span>{availableCount ? <>{title === "ملفات المنصف" ? <FolderOpen size={17} /> : <PlayCircle size={17} />} فتح القسم</> : <><Clock3 size={17} /> بانتظار المحتوى</>}</span></span>
            </button>
          ))}
        </div>
      ) : lessonCategory === "استيب" ? (
        <div className="step-files-section">
          <div className="step-files-summary"><span><FileText size={20} /> قائمة ملفات STEP</span><strong>{stepFiles.length} ملفًا</strong></div>
          <ol className="step-files-list">
            {stepFiles.map((title, index) => {
              const file = uploadedStepFiles[index + 1];
              return <li className="step-file-card" key={title}>
                <span className="step-file-number">{index + 1}</span>
                <span className="step-file-icon"><FileText size={25} /></span>
                <span className="step-file-copy"><small>{file ? `ملف PDF • ${file.size}` : `ملف STEP رقم ${index + 1}`}</small><strong>{title}</strong></span>
                {file ? <span className="step-file-actions">
                  <a className="step-file-preview" href={previewFileUrl(file.url)} target="_blank" rel="noreferrer" aria-label={`عرض ${title}`}><Eye size={17} /> عرض الملف</a>
                  <a className="step-file-download" href={file.url} download={file.downloadName} aria-label={`تحميل ${title}`}><Download size={17} /> تحميل الملف</a>
                </span> : <span className="step-file-status"><CloudUpload size={17} /> بانتظار رفع الملف</span>}
              </li>;
            })}
          </ol>
        </div>
      ) : lessonCategory === "المفكر" ? (
        <div className="step-files-section">
          <div className="step-files-summary"><span><FileText size={20} /> ملفات المفكر</span><strong>ملفان</strong></div>
          <ol className="step-files-list">
            {mofakerFiles.map((file, index) => (
              <li className="step-file-card" key={file.url}>
                <span className="step-file-number">{index + 1}</span>
                <span className="step-file-icon"><FileText size={25} /></span>
                <span className="step-file-copy"><small>ملف PDF • {file.size} • {file.pages}</small><strong>{file.title}</strong></span>
                <span className="step-file-actions">
                  <a className="step-file-preview" href={previewFileUrl(file.url)} target="_blank" rel="noreferrer" aria-label={`عرض ${file.title}`}><Eye size={17} /> عرض الملف</a>
                  <a className="step-file-download" href={file.url} download={file.downloadName} aria-label={`تحميل ${file.title}`}><Download size={17} /> تحميل الملف</a>
                </span>
              </li>
            ))}
          </ol>
        </div>
      ) : categoryContent.length ? <div className="lesson-grid category-content-grid">{categoryContent.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} openLesson={openLesson} />)}</div> : <div className="empty-category"><BookOpen size={42} /><h2>سيُضاف المحتوى قريبًا</h2><p>ستظهر الدروس والفيديوهات الخاصة بهذا القسم هنا.</p></div>}
    </section>
  );

  const renderVerbalLessons = () => (
    <section className="series-page">
      <button className="back-button" onClick={() => setView("lessons")}><ChevronLeft size={18} /> رجوع إلى جميع الدروس</button>
      <div className="series-hero"><span className="series-hero-icon"><Video size={42} /></span><div><small>قدرات لفظي</small><h1>قائمة المحاضرات</h1><p>شاهد المحاضرات بالترتيب، من المحاضرة الأولى حتى أحدث محاضرة مضافة.</p></div><strong>{lectureCountLabel(verbalLectures.length)}</strong></div>
      <div className="series-tools"><p>تظهر 10 محاضرات في كل صفحة، مرتبة تلقائيًا حسب الرقم.</p><a className="secondary-btn series-channel-link" href={verbalChannelUrl} target="_blank" rel="noreferrer"><Video size={19} /> فتح جميع فيديوهات القناة</a></div>
      <div className="pagination-summary" id="verbal-lecture-list" aria-live="polite">
        <span>الصفحة {verbalPage} من {verbalPageCount}</span>
        <span>عرض {(verbalPage - 1) * verbalLecturesPerPage + 1}–{Math.min(verbalPage * verbalLecturesPerPage, verbalLectures.length)} من {verbalLectures.length} محاضرة</span>
      </div>
      <ol className="lecture-list" start={(verbalPage - 1) * verbalLecturesPerPage + 1}>
        {visibleVerbalLectures.map((lesson, index) => {
          const order = getVerbalLectureOrder(lesson) ?? (verbalPage - 1) * verbalLecturesPerPage + index + 1;
          return <li className="lecture-item" key={lesson.id}><span className="lecture-number">{order}</span><div className="lecture-copy"><small>المحاضرة رقم {order}</small><h2>{lesson.title}</h2><p>{lesson.description}</p></div><button className="primary-btn" onClick={() => openLesson(lesson)}><PlayCircle size={19} /> مشاهدة المحاضرة</button></li>;
        })}
      </ol>
      {verbalPageCount > 1 && <nav className="pagination" aria-label="صفحات محاضرات القدرات اللفظية">
        <button className="pagination-nav" onClick={() => changeVerbalPage(verbalPage - 1)} disabled={verbalPage === 1}><ChevronRight size={18} /> السابق</button>
        <div className="pagination-pages">
          {Array.from({ length: verbalPageCount }, (_, index) => index + 1).map((page) => <button key={page} className={page === verbalPage ? "active" : ""} onClick={() => changeVerbalPage(page)} aria-label={`الصفحة ${page}`} aria-current={page === verbalPage ? "page" : undefined}>{page}</button>)}
        </div>
        <button className="pagination-nav" onClick={() => changeVerbalPage(verbalPage + 1)} disabled={verbalPage === verbalPageCount}>التالي <ChevronLeft size={18} /></button>
      </nav>}
    </section>
  );

  const renderMansafFoundation = () => (
    <section className="series-page">
      <button className="back-button" onClick={() => { setLessonCategory("قدرات كمي"); setView("category-lessons"); }}><ChevronLeft size={18} /> رجوع إلى أقسام الكمي</button>
      <div className="series-hero"><span className="series-hero-icon"><Calculator size={42} /></span><div><small>قدرات كمي</small><h1>تأسيس المنصف</h1><p>شاهد دروس التأسيس بالترتيب، ثم انتقل إلى التدريب بعد إتقان القواعد الأساسية.</p></div><strong>{mansafFoundationLessons.length} دروس</strong></div>
      <div className="series-tools"><p>تظهر 10 دروس في الصفحة، مرتبة تلقائيًا حسب الرقم.</p></div>
      <div className="pagination-summary" id="mansaf-foundation-list" aria-live="polite">
        <span>الصفحة {mansafPage} من {mansafPageCount}</span>
        <span>عرض {(mansafPage - 1) * mansafLessonsPerPage + 1}–{Math.min(mansafPage * mansafLessonsPerPage, mansafFoundationLessons.length)} من {mansafFoundationLessons.length} دروس</span>
      </div>
      <ol className="lecture-list" start={(mansafPage - 1) * mansafLessonsPerPage + 1}>
        {visibleMansafLessons.map((lesson, index) => {
          const order = (mansafPage - 1) * mansafLessonsPerPage + index + 1;
          return <li className="lecture-item" key={lesson.id}><span className="lecture-number">{order}</span><div className="lecture-copy"><small>الدرس رقم {order}</small><h2>{lesson.title}</h2><p>{lesson.description}</p></div><button className="primary-btn" onClick={() => openLesson(lesson)}><PlayCircle size={19} /> مشاهدة الدرس</button></li>;
        })}
      </ol>
      {mansafPageCount > 1 && <nav className="pagination" aria-label="صفحات دروس تأسيس المنصف">
        <button className="pagination-nav" onClick={() => changeMansafPage(mansafPage - 1)} disabled={mansafPage === 1}><ChevronRight size={18} /> السابق</button>
        <div className="pagination-pages">
          {Array.from({ length: mansafPageCount }, (_, index) => index + 1).map((page) => <button key={page} className={page === mansafPage ? "active" : ""} onClick={() => changeMansafPage(page)} aria-label={`الصفحة ${page}`} aria-current={page === mansafPage ? "page" : undefined}>{page}</button>)}
        </div>
        <button className="pagination-nav" onClick={() => changeMansafPage(mansafPage + 1)} disabled={mansafPage === mansafPageCount}>التالي <ChevronLeft size={18} /></button>
      </nav>}
    </section>
  );

  const renderMansafTraining = () => (
    <section className="series-page">
      <button className="back-button" onClick={() => { setLessonCategory("قدرات كمي"); setView("category-lessons"); }}><ChevronLeft size={18} /> رجوع إلى أقسام الكمي</button>
      <div className="series-hero"><span className="series-hero-icon"><Calculator size={42} /></span><div><small>قدرات كمي</small><h1>تدريب المنصف</h1><p>طبّق مهاراتك من خلال تدريبات كمية مرتبة، وواصل إضافة الدروس الجديدة بالتسلسل.</p></div><strong>{mansafTrainingLessons.length} درسًا</strong></div>
      <div className="series-tools"><p>تظهر 10 دروس في الصفحة، مرتبة تلقائيًا حسب الرقم.</p></div>
      <div className="pagination-summary" id="mansaf-training-list" aria-live="polite">
        <span>الصفحة {mansafTrainingPage} من {mansafTrainingPageCount}</span>
        <span>عرض {(mansafTrainingPage - 1) * mansafLessonsPerPage + 1}–{Math.min(mansafTrainingPage * mansafLessonsPerPage, mansafTrainingLessons.length)} من {mansafTrainingLessons.length} درسًا</span>
      </div>
      <ol className="lecture-list" start={(mansafTrainingPage - 1) * mansafLessonsPerPage + 1}>
        {visibleMansafTrainingLessons.map((lesson, index) => {
          const order = (mansafTrainingPage - 1) * mansafLessonsPerPage + index + 1;
          return <li className="lecture-item" key={lesson.id}><span className="lecture-number">{order}</span><div className="lecture-copy"><small>الدرس رقم {order}</small><h2>{lesson.title}</h2><p>{lesson.description}</p></div><button className="primary-btn" onClick={() => openLesson(lesson)}><PlayCircle size={19} /> مشاهدة الدرس</button></li>;
        })}
      </ol>
      {mansafTrainingPageCount > 1 && <nav className="pagination" aria-label="صفحات دروس تدريب المنصف">
        <button className="pagination-nav" onClick={() => changeMansafTrainingPage(mansafTrainingPage - 1)} disabled={mansafTrainingPage === 1}><ChevronRight size={18} /> السابق</button>
        <div className="pagination-pages">
          {Array.from({ length: mansafTrainingPageCount }, (_, index) => index + 1).map((page) => <button key={page} className={page === mansafTrainingPage ? "active" : ""} onClick={() => changeMansafTrainingPage(page)} aria-label={`الصفحة ${page}`} aria-current={page === mansafTrainingPage ? "page" : undefined}>{page}</button>)}
        </div>
        <button className="pagination-nav" onClick={() => changeMansafTrainingPage(mansafTrainingPage + 1)} disabled={mansafTrainingPage === mansafTrainingPageCount}>التالي <ChevronLeft size={18} /></button>
      </nav>}
    </section>
  );

  const renderMansafFiles = () => (
    <section className="series-page">
      <button className="back-button" onClick={() => { setLessonCategory("قدرات كمي"); setView("category-lessons"); }}><ChevronLeft size={18} /> رجوع إلى أقسام الكمي</button>
      <div className="series-hero"><span className="series-hero-icon"><FolderOpen size={42} /></span><div><small>قدرات كمي</small><h1>ملفات المنصف</h1><p>اختاري القسم للوصول إلى ملفات التأسيس أو البنوك أو زبدة المنصف.</p></div><strong>3 أقسام</strong></div>
      <div className="mansaf-file-group-grid">
        {mansafFileGroups.map(({ title, count }) => (
          <button className="mansaf-file-group-card" key={title} onClick={() => { setSelectedMansafFileGroup(title); setMansafFilesPage(1); setView("mansaf-file-group"); }}>
            <span className="mansaf-file-group-icon"><FolderOpen size={34} /></span>
            <span className="mansaf-file-group-copy"><strong>{title}</strong><small>{title === "ملفات تأسيس المنصف" ? "ملفان" : `${count} ملفًا`}</small></span>
            <ChevronLeft size={23} className="file-category-arrow" />
          </button>
        ))}
      </div>
    </section>
  );

  const renderMansafFileGroup = () => {
    const selectedGroup = mansafFileGroups.find((group) => group.title === selectedMansafFileGroup)!;
    const isFoundationGroup = selectedMansafFileGroup === "ملفات تأسيس المنصف";
    const isBankGroup = selectedMansafFileGroup === "ملفات بنوك المنصف";
    const isZubdaGroup = selectedMansafFileGroup === "ملفات زبدة المنصف";
    const selectedGroupFiles = isBankGroup ? mansafBankFiles : linkedMansafFiles;
    const selectedGroupPageCount = Math.max(1, Math.ceil(selectedGroupFiles.length / mansafFilesPerPage));
    const selectedGroupPageStart = (mansafFilesPage - 1) * mansafFilesPerPage;
    const visibleSelectedGroupFiles = selectedGroupFiles.slice(selectedGroupPageStart, selectedGroupPageStart + mansafFilesPerPage);
    const uploadedSelectedGroupFiles = selectedGroupFiles.filter((file) => Boolean(file.url)).length;
    return (
      <section className="series-page">
        <button className="back-button" onClick={() => setView("mansaf-files")}><ChevronLeft size={18} /> رجوع إلى ملفات المنصف</button>
        <div className="series-hero"><span className="series-hero-icon"><FolderOpen size={42} /></span><div><small>ملفات المنصف</small><h1>{selectedGroup.title}</h1><p>{isFoundationGroup ? "ملفات التأسيس متاحة للعرض المباشر أو التحميل على الجهاز." : isZubdaGroup ? "ملفات زبدة القدرات مرتبة من (1) إلى (34)، وتتوفر الملفات المرفوعة للعرض المباشر أو التحميل." : "ملفات بنوك المنصف مرتبة من (1) إلى (30)، وتتوفر الملفات المرفوعة للعرض المباشر أو التحميل."}</p></div><strong>{isFoundationGroup ? "ملفان" : `${selectedGroup.count} ملفًا`}</strong></div>
        {isFoundationGroup ? <div className="step-files-section">
          <ol className="step-files-list">
            {mansafFoundationFiles.map((file, index) => (
              <li className="step-file-card" key={file.url}>
                <span className="step-file-number">{index + 1}</span>
                <span className="step-file-icon"><FileText size={25} /></span>
                <span className="step-file-copy"><small>ملف PDF • {file.size}</small><strong>{file.title}</strong></span>
                <span className="step-file-actions">
                  <a className="step-file-preview" href={previewFileUrl(file.url)} target="_blank" rel="noreferrer" aria-label={`عرض ${file.title}`}><Eye size={17} /> عرض الملف</a>
                  <a className="step-file-download" href={file.url} download={file.downloadName} aria-label={`تحميل ${file.title}`}><Download size={17} /> تحميل الملف</a>
                </span>
              </li>
            ))}
          </ol>
        </div> : (isZubdaGroup || isBankGroup) ? <>
          <div className="series-tools"><p>{isBankGroup ? "تظهر 10 ملفات في كل صفحة، مرتبة من بنك المنصف (1) حتى (30)." : "تظهر 10 ملفات في كل صفحة، مرتبة من زبدة القدرات (1) حتى (34)."}</p></div>
          <div className="pagination-summary" id="mansaf-files-list" aria-live="polite">
            <span>الصفحة {mansafFilesPage} من {selectedGroupPageCount}</span>
            <span>{isBankGroup ? `${uploadedSelectedGroupFiles} ملفات مضافة من أصل ${selectedGroupFiles.length}` : `عرض ${selectedGroupPageStart + 1}–${Math.min(mansafFilesPage * mansafFilesPerPage, selectedGroupFiles.length)} من ${selectedGroupFiles.length} ملفًا مضافًا`}</span>
          </div>
          <div className="step-files-section">
            <ol className="step-files-list" start={(mansafFilesPage - 1) * mansafFilesPerPage + 1}>
              {visibleSelectedGroupFiles.map(({ title, url, downloadName, size }, index) => {
                const order = (mansafFilesPage - 1) * mansafFilesPerPage + index + 1;
                return <li className="step-file-card" key={title}>
                  <span className="step-file-number">{order}</span>
                  <span className="step-file-icon"><FileText size={25} /></span>
                  <span className="step-file-copy"><small>{url ? `ملف PDF • ${size}` : `ملف ${isBankGroup ? "بنوك" : "زبدة"} المنصف رقم ${order}`}</small><strong>{title}</strong></span>
                  {url ? <span className="step-file-actions">
                    <a className="step-file-preview" href={previewFileUrl(url)} target="_blank" rel="noreferrer" aria-label={`عرض ${title}`}><Eye size={17} /> عرض الملف</a>
                    <a className="step-file-download" href={url} download={downloadName} aria-label={`تحميل ${title}`}><Download size={17} /> تحميل الملف</a>
                  </span> : <span className="step-file-status"><CloudUpload size={17} /> بانتظار رفع الملف</span>}
                </li>;
              })}
            </ol>
          </div>
          {selectedGroupPageCount > 1 && <nav className="pagination" aria-label={`صفحات ${selectedGroup.title}`}>
            <button className="pagination-nav" onClick={() => setMansafFilesPage(Math.max(mansafFilesPage - 1, 1))} disabled={mansafFilesPage === 1}><ChevronRight size={18} /> السابق</button>
            <div className="pagination-pages">
              {Array.from({ length: selectedGroupPageCount }, (_, index) => index + 1).map((page) => <button key={page} className={page === mansafFilesPage ? "active" : ""} onClick={() => setMansafFilesPage(page)} aria-label={`الصفحة ${page}`} aria-current={page === mansafFilesPage ? "page" : undefined}>{page}</button>)}
            </div>
            <button className="pagination-nav" onClick={() => setMansafFilesPage(Math.min(mansafFilesPage + 1, selectedGroupPageCount))} disabled={mansafFilesPage === selectedGroupPageCount}>التالي <ChevronLeft size={18} /></button>
          </nav>}
        </> : <div className="empty-category"><CloudUpload size={42} /><h2>القسم جاهز لرفع الملفات</h2><p>ستظهر الملفات وأزرار التحميل هنا عند إضافتها.</p></div>}
      </section>
    );
  };

  const renderLesson = () => {
    const embed = getYouTubeEmbed(selectedLesson.videoUrl);
    const relatedFiles = files.filter((file) => file.lessonId === selectedLesson.id);
    const isMansafFoundation = selectedLesson.id.startsWith("mansaf-foundation-");
    const isMansafTraining = selectedLesson.id.startsWith("mansaf-training-");
    const isVerbalLecture = getVerbalLectureOrder(selectedLesson) !== null;
    const returnView: View = isMansafFoundation ? "mansaf-foundation" : isMansafTraining ? "mansaf-training" : isVerbalLecture ? "verbal-lessons" : "lessons";
    const returnLabel = isMansafFoundation ? "رجوع إلى تأسيس المنصف" : isMansafTraining ? "رجوع إلى تدريب المنصف" : isVerbalLecture ? "رجوع إلى قائمة المحاضرات" : "رجوع إلى الشرح";
    return (
      <section className="lesson-page"><button className="back-button" onClick={() => setView(returnView)}><ChevronLeft size={18} /> {returnLabel}</button><h1>{selectedLesson.title}</h1><p className="lesson-subtitle">{selectedLesson.description}</p>
        <div className="lesson-layout"><div><article className="video-card"><h2>{selectedLesson.title}</h2>{embed ? <iframe src={embed} title={selectedLesson.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /> : selectedLesson.videoUrl ? <video controls src={selectedLesson.videoUrl} /> : <div className="video-placeholder"><span><PlayCircle size={68} /></span><strong>مشغل الفيديو</strong><p>يظهر الفيديو هنا بعد إضافته من لوحة التحكم.</p></div>}</article>
          <article className="next-action"><div><strong>اختبر فهمك بعد مشاهدة الدرس</strong><p>اختبار قصير مع نتيجة فورية.</p></div><button className="primary-btn" onClick={() => openTest(tests[0])}><ClipboardCheck size={19} /> ابدأ الاختبار</button></article></div>
          <aside className="lesson-sidebar"><h3>تفاصيل الدرس</h3><p><Clock3 size={17} /> {selectedLesson.duration || "مدة مرنة"}</p><p><BookOpen size={17} /> {selectedLesson.category}</p><h3>ملفات الدرس</h3>{relatedFiles.length ? relatedFiles.map((file) => <a key={file.id} href={previewFileUrl(file.url)} target="_blank" rel="noreferrer"><FileText size={18} /><span>{file.title}<small>{file.type}</small></span><Download size={17} /></a>) : <p className="muted-note">لا توجد ملفات مرتبطة بعد.</p>}</aside>
        </div>
      </section>
    );
  };

  const renderFiles = () => (
    <>{pageHeading("مكتبة الملفات", "اختاري القسم للوصول إلى الملفات والمسميات المرتبة داخله.")}<section className="content-page"><div className="file-category-grid">{fileLibraryCategories.map(({ title }) => <button className="file-category-card" key={title} onClick={() => { setSelectedFileCategory(title); setView("file-category"); }}><span className="file-category-icon"><FolderOpen size={32} /></span><span className="file-category-copy"><strong>{title}</strong></span><ChevronLeft size={23} className="file-category-arrow" /></button>)}</div></section></>
  );

  const renderFileCategory = () => {
    const selectedCategory = fileLibraryCategories.find((category) => category.title === selectedFileCategory)!;
    return (
      <section className="series-page">
        <button className="back-button" onClick={() => setView("files")}><ChevronLeft size={18} /> رجوع إلى أقسام الملفات</button>
        <div className="category-heading"><span className="subject-icon"><FolderOpen size={30} /></span><div><small>مكتبة الملفات</small><h1>{selectedCategory.title}</h1></div></div>
        <div className="file-category-grid">
          <button className="file-category-card" onClick={() => { setSelectedPreviousYear("1434"); setView("year-files"); }}>
            <span className="file-category-icon"><FolderOpen size={32} /></span>
            <span className="file-category-copy"><strong>عام 1434هـ</strong><small>{previousYears1434Files.length} ملفات</small></span>
            <ChevronLeft size={23} className="file-category-arrow" />
          </button>
          <button className="file-category-card" onClick={() => { setSelectedPreviousYear("1435"); setView("year-files"); }}>
            <span className="file-category-icon"><FolderOpen size={32} /></span>
            <span className="file-category-copy"><strong>عام 1435هـ</strong><small>{previousYears1435Files.length} ملفات</small></span>
            <ChevronLeft size={23} className="file-category-arrow" />
          </button>
          <button className="file-category-card" onClick={() => { setSelectedPreviousYear("1436"); setView("year-files"); }}>
            <span className="file-category-icon"><FolderOpen size={32} /></span>
            <span className="file-category-copy"><strong>عام 1436هـ</strong><small>{previousYears1436Files.length} ملفات</small></span>
            <ChevronLeft size={23} className="file-category-arrow" />
          </button>
          <button className="file-category-card" onClick={() => { setSelectedPreviousYear("1437"); setView("year-files"); }}>
            <span className="file-category-icon"><FolderOpen size={32} /></span>
            <span className="file-category-copy"><strong>عام 1437هـ</strong><small>{previousYears1437Files.length} ملفات</small></span>
            <ChevronLeft size={23} className="file-category-arrow" />
          </button>
          <button className="file-category-card" onClick={() => { setSelectedPreviousYear("1438"); setView("year-files"); }}>
            <span className="file-category-icon"><FolderOpen size={32} /></span>
            <span className="file-category-copy"><strong>عام 1438هـ</strong><small>{previousYears1438Files.length} ملفات</small></span>
            <ChevronLeft size={23} className="file-category-arrow" />
          </button>
          <button className="file-category-card" onClick={() => { setSelectedPreviousYear("1439"); setView("year-files"); }}>
            <span className="file-category-icon"><FolderOpen size={32} /></span>
            <span className="file-category-copy"><strong>عام 1439هـ</strong><small>{previousYears1439Files.length} ملفات</small></span>
            <ChevronLeft size={23} className="file-category-arrow" />
          </button>
          <button className="file-category-card" onClick={() => { setSelectedPreviousYear("1440"); setView("year-files"); }}>
            <span className="file-category-icon"><FolderOpen size={32} /></span>
            <span className="file-category-copy"><strong>عام 1440هـ</strong><small>{previousYears1440Files.length} ملفات</small></span>
            <ChevronLeft size={23} className="file-category-arrow" />
          </button>
          <button className="file-category-card" onClick={() => { setSelectedPreviousYear("1441"); setView("year-files"); }}>
            <span className="file-category-icon"><FolderOpen size={32} /></span>
            <span className="file-category-copy"><strong>عام 1441هـ</strong><small>{previousYears1441Files.length} ملفات</small></span>
            <ChevronLeft size={23} className="file-category-arrow" />
          </button>
          <button className="file-category-card" onClick={() => { setSelectedPreviousYear("1442"); setView("year-files"); }}>
            <span className="file-category-icon"><FolderOpen size={32} /></span>
            <span className="file-category-copy"><strong>عام 1442هـ</strong><small>{previousYears1442Files.length} ملفات</small></span>
            <ChevronLeft size={23} className="file-category-arrow" />
          </button>
          <button className="file-category-card" onClick={() => { setSelectedPreviousYear("1443"); setView("year-files"); }}>
            <span className="file-category-icon"><FolderOpen size={32} /></span>
            <span className="file-category-copy"><strong>عام 1443هـ</strong><small>{previousYears1443Files.length} ملفات</small></span>
            <ChevronLeft size={23} className="file-category-arrow" />
          </button>
          <button className="file-category-card" onClick={() => { setSelectedPreviousYear("1444"); setView("year-files"); }}>
            <span className="file-category-icon"><FolderOpen size={32} /></span>
            <span className="file-category-copy"><strong>عام 1444هـ</strong><small>{previousYears1444Files.length} ملفات</small></span>
            <ChevronLeft size={23} className="file-category-arrow" />
          </button>
        </div>
      </section>
    );
  };

  const renderYearFiles = () => {
    const yearFiles = selectedPreviousYear === "1444"
      ? previousYears1444Files
      : selectedPreviousYear === "1443"
        ? previousYears1443Files
        : selectedPreviousYear === "1442"
          ? previousYears1442Files
          : selectedPreviousYear === "1441"
            ? previousYears1441Files
            : selectedPreviousYear === "1440"
              ? previousYears1440Files
              : selectedPreviousYear === "1439"
                ? previousYears1439Files
                : selectedPreviousYear === "1438"
                  ? previousYears1438Files
                  : selectedPreviousYear === "1437"
                    ? previousYears1437Files
                    : selectedPreviousYear === "1436"
                      ? previousYears1436Files
                      : selectedPreviousYear === "1435"
                        ? previousYears1435Files
                        : previousYears1434Files;
    return (
      <section className="series-page">
        <button className="back-button" onClick={() => setView("file-category")}><ChevronLeft size={18} /> رجوع إلى تجميع السنوات السابقة</button>
        <div className="series-hero"><span className="series-hero-icon"><FolderOpen size={42} /></span><div><small>تجميع السنوات السابقة</small><h1>ملفات عام {selectedPreviousYear}هـ</h1><p>ملفات التجميع متاحة للعرض المباشر أو التحميل على الجهاز.</p></div><strong>{yearFiles.length} ملفات</strong></div>
        <div className="step-files-section">
          <ol className="step-files-list">
            {yearFiles.map((file, index) => (
              <li className="step-file-card" key={file.url}>
                <span className="step-file-number">{index + 1}</span>
                <span className="step-file-icon"><FileText size={25} /></span>
                <span className="step-file-copy"><small>ملف PDF • {file.size}</small><strong>{file.title}</strong></span>
                <span className="step-file-actions">
                  <a className="step-file-preview" href={previewFileUrl(file.url)} target="_blank" rel="noreferrer" aria-label={`عرض ${file.title}`}><Eye size={17} /> عرض الملف</a>
                  <a className="step-file-download" href={file.url} download={file.downloadName} aria-label={`تحميل ${file.title}`}><Download size={17} /> تحميل الملف</a>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  };

  const renderTests = () => (
    <>
      {pageHeading("الاختبارات المحاكية", "نماذج أصلية بوقت محدد، وتصحيح فوري، ومراجعة تفصيلية للإجابات.")}
      <section className="content-page simulation-tests-page">
        <article className="simulation-summary">
          <span><Clock3 size={34} /></span>
          <div><small>تجربة قريبة من الاختبار الفعلي</small><h2>اختبارات قصيرة مركّزة بمدة 13–15 دقيقة</h2><p>يبدأ المؤقت عند فتح النموذج، ويحفظ المتصفح تقدمك تلقائيًا حتى تعودي إليه.</p></div>
          <strong>{tests.length} اختبارات</strong>
        </article>
        <div className="test-filter-bar" aria-label="تصفية الاختبارات">
          {["الكل", "قدرات لفظي", "قدرات كمي"].map((category) => <button className={testCategoryFilter === category ? "active" : ""} key={category} onClick={() => setTestCategoryFilter(category)}>{category}</button>)}
        </div>
        <div className="test-grid">
          {filteredTests.map((test) => <article className="test-card simulation-test-card" key={test.id}>
            <div className="test-card-tags"><span className="test-category">{test.category}</span>{test.level && <span className="test-level">{test.level}</span>}</div>
            <div className="test-icon"><ClipboardCheck size={30} /></div>
            <h2>{test.title}</h2>
            <p>{test.description ?? "اختبار تفاعلي بوقت محدد وتصحيح فوري."}</p>
            <div className="test-meta"><span><ClipboardCheck size={15} /> {test.questions} أسئلة</span><span><Clock3 size={15} /> {test.minutes} دقيقة</span></div>
            <button className="primary-btn" onClick={() => openTest(test)}>ابدأ الاختبار</button>
          </article>)}
        </div>
      </section>
    </>
  );

  const renderTest = () => {
    const question = activeTestQuestions[currentQuestionIndex] ?? activeTestQuestions[0];
    const answeredCount = activeTestQuestions.filter((item) => testAnswers[item.id] !== undefined).length;
    const correctCount = activeTestQuestions.filter((item) => testAnswers[item.id] === item.correct).length;
    const unansweredCount = activeTestQuestions.length - answeredCount;
    const progress = Math.round((answeredCount / activeTestQuestions.length) * 100);
    const timerTone = timeLeft <= 60 ? "critical" : timeLeft <= 300 ? "warning" : "";
    return (
      <section className="test-page simulation-test-runner">
        <button className="back-button" onClick={() => setView("tests")}><ChevronLeft size={18} /> رجوع إلى الاختبارات</button>
        <div className="test-header simulation-test-header">
          <div className="test-header-copy"><span className="test-category">{selectedTest.category}</span><h1>{selectedTest.title}</h1><p>{testResult === null ? "اختاري إجابة واحدة، ويمكنك التنقل بين الأسئلة قبل إنهاء الاختبار." : "راجعي إجاباتك وتفسير كل سؤال، ثم أعيدي المحاولة متى شئتِ."}</p></div>
          <div className={`test-timer ${timerTone}`} aria-live="polite"><Clock3 size={22} /><small>{testResult === null ? "الوقت المتبقي" : "انتهى الاختبار"}</small><strong>{testResult === null ? formatCountdown(timeLeft) : `${testResult}%`}</strong></div>
          <div className="test-progress-track" aria-label={`أُجيب عن ${answeredCount} من ${activeTestQuestions.length}`}><span style={{ width: `${progress}%` }} /></div>
          <div className="test-progress-copy"><span>{answeredCount} مجاب</span><span>{unansweredCount} غير مجاب</span></div>
        </div>

        {testResult !== null && <article className="result-card simulation-result-card">
          <Trophy size={45} /><div><small>{testSubmittedByTime ? "انتهى الوقت وتم تسليم إجاباتك تلقائيًا" : "اكتمل النموذج بنجاح"}</small><h2>نتيجتك: {testResult}%</h2><p>{correctCount === 1 ? "إجابة صحيحة واحدة" : correctCount === 2 ? "إجابتان صحيحتان" : `${correctCount} إجابات صحيحة`} من أصل {activeTestQuestions.length}. {testResult >= 60 ? "أحسنتِ، راجعي التفسيرات لتثبيت المهارة." : "راجعي مواضع الخطأ ثم أعيدي المحاولة لرفع نتيجتك."}</p></div>
        </article>}

        <nav className="question-navigator" aria-label="التنقل بين أسئلة الاختبار">
          {activeTestQuestions.map((item, index) => {
            const answered = testAnswers[item.id] !== undefined;
            const status = testResult === null ? (answered ? "answered" : "") : testAnswers[item.id] === undefined ? "unanswered" : testAnswers[item.id] === item.correct ? "correct" : "wrong";
            return <button className={`${currentQuestionIndex === index ? "current" : ""} ${status}`} key={item.id} onClick={() => setCurrentQuestionIndex(index)} aria-label={`السؤال ${index + 1}`}>{index + 1}</button>;
          })}
        </nav>

        <article className="question-card focused-question-card">
          <div className="focused-question-heading"><span className="question-number">السؤال {currentQuestionIndex + 1} من {activeTestQuestions.length}</span>{testAnswers[question.id] !== undefined && <span className="answered-mark"><CheckCircle2 size={15} /> تمت الإجابة</span>}</div>
          {question.passage && <blockquote className="reading-passage"><small>النص</small><p>{question.passage}</p></blockquote>}
          <h2>{question.text}</h2>
          <div className="choices focused-choices">{question.choices.map((choice, choiceIndex) => {
            const selected = testAnswers[question.id] === choiceIndex;
            const correctChoice = testResult !== null && choiceIndex === question.correct;
            const wrongChoice = testResult !== null && selected && choiceIndex !== question.correct;
            return <label className={`${selected ? "selected" : ""} ${correctChoice ? "correct-choice" : ""} ${wrongChoice ? "wrong-choice" : ""}`} key={choice}>
              <input type="radio" name={question.id} disabled={testResult !== null} checked={selected} onChange={() => setTestAnswers((answers) => ({ ...answers, [question.id]: choiceIndex }))} />
              <span className="choice-letter">{["أ", "ب", "ج", "د"][choiceIndex]}</span><span>{choice}</span>
            </label>;
          })}</div>
          {testResult !== null && <div className="answer-explanation"><CheckCircle2 size={19} /><div><strong>التفسير</strong><p>{question.explanation}</p></div></div>}
        </article>

        <div className="test-runner-actions">
          <button className="secondary-btn" disabled={currentQuestionIndex === 0} onClick={() => setCurrentQuestionIndex((index) => Math.max(0, index - 1))}><ChevronRight size={18} /> السابق</button>
          {currentQuestionIndex < activeTestQuestions.length - 1 ? <button className="primary-btn" onClick={() => setCurrentQuestionIndex((index) => Math.min(activeTestQuestions.length - 1, index + 1))}>التالي <ChevronLeft size={18} /></button> : testResult === null ? <button className="primary-btn finish-test-button" disabled={answeredCount === 0} onClick={() => void submitTest(false)}><ClipboardCheck size={18} /> إنهاء الاختبار</button> : <button className="primary-btn" onClick={() => setCurrentQuestionIndex(0)}>مراجعة من البداية</button>}
        </div>

        {testResult === null && <div className="test-submit-strip"><div><strong>جاهزة للتسليم؟</strong><span>أجبتِ عن {answeredCount} من {activeTestQuestions.length}. الأسئلة غير المجابة تُحسب خطأ.</span></div><button className="primary-btn" disabled={answeredCount === 0} onClick={() => void submitTest(false)}>تسليم الإجابات</button></div>}

        {testResult !== null && <article className="result-card certificate-result-card"><div className="test-certificate-heading"><span><Award size={28} /></span><div><small>بعد انتهاء الاختبار</small><h3>شهادة إتمام الاختبار</h3><p>اكتبي الاسم الرباعي، ثم أصدري الشهادة واطبعيها أو احفظيها بصيغة PDF.</p></div></div><div className="certificate-name-box"><label htmlFor="test-certificate-name">الاسم الرباعي في الشهادة</label><input id="test-certificate-name" value={certificateStudentName} onChange={(event) => { setCertificateStudentName(event.target.value); setCertificateNameMessage(""); }} placeholder="اكتبي اسم الطالبة الرباعي" /><small>سيظهر الاسم كما كُتب هنا.</small>{certificateNameMessage && <em role="alert">{certificateNameMessage}</em>}</div><div className="result-actions"><button className="certificate-button large-certificate-button" onClick={() => void issueCertificate(`test-${selectedTest.id}`, selectedTest.title, "اختبار تفاعلي", testResult)}><Award size={19} /> إصدار شهادة إتمام الاختبار</button><button className="secondary-btn" onClick={() => { const deadline = Date.now() + selectedTest.minutes * 60 * 1000; setTestAnswers({}); setCurrentQuestionIndex(0); setTestDeadline(deadline); setTimeLeft(selectedTest.minutes * 60); setTestResult(null); setTestSubmittedByTime(false); setCertificateNameMessage(""); testSubmissionRef.current = false; window.localStorage.setItem("qodrati-current-test", selectedTest.id); }}><Clock3 size={18} /> إعادة المحاولة</button></div></article>}
      </section>
    );
  };

  const renderGames = () => {
    const activeGame = abilityGames.find((game) => game.id === activeGameId) ?? abilityGames[0];
    const activeStage = activeGame.stages[gameStageIndex] ?? activeGame.stages[0];
    const displayedQuestion = activeGame.mode === "wheel" ? (wheelReady ? activeStage.question : undefined) : activeStage.question;
    const displayedChoices = activeGame.mode === "wheel" && !wheelReady ? [] : activeStage.choices ?? [];
    const displayedCorrect = activeStage.correct;
    const stageProgress = gameOutcome === "success" ? 100 : Math.round(((gameStageIndex + (gameOutcome === "stage-success" ? 1 : 0)) / activeGame.stages.length) * 100);
    return (
      <>
        {pageHeading(view === "game" ? activeGame.title : "ألعاب القدرات متعددة المراحل", view === "game" ? `${activeGame.stages.length} مراحل متدرجة — أكمليها جميعًا لاستحقاق شهادة الإنجاز.` : "اختاري لعبة، ثم انتقلي إلى صفحتها المستقلة لإكمال مراحلها.")}
        <section className="content-page games-page">
          {view === "games" && <>
          <div className="games-heading"><span className="games-main-icon"><Puzzle size={38} /></span><div><h2>اختاري لعبتك بالضغط على اسمها</h2><p>كل لعبة تتكون من خمس مراحل متدرجة مرتبطة بمحتوى منصة قدراتي.</p></div></div>
          <div className="games-grid">
            {abilityGames.map(({ id, title, typeLabel, description, subject, sourceLabel, stages, icon: Icon }) => (
              <article className="game-card" key={id}>
                {completedGameIds.includes(id) && <span className="game-completed"><CheckCircle2 size={14} /> مكتملة</span>}
                <span className="game-icon"><Icon size={31} /></span><small className="game-type">{subject} • {typeLabel}</small>
                <button className="game-title-button" onClick={() => openAbilityGame(id)}>{title}</button>
                <p>{description}</p>
                <span className="game-source"><BookOpen size={14} /> {sourceLabel}</span>
                <div className="game-card-footer"><strong>{stages.length} مراحل</strong><button onClick={() => openAbilityGame(id)}><Gamepad2 size={18} /> افتحي اللعبة</button></div>
              </article>
            ))}
          </div>
          </>}
          {view === "game" && <>
          <button className="game-detail-back secondary-btn" onClick={() => setView("games")}><ChevronRight size={18} /> العودة إلى جميع الألعاب</button>
          <article className="quick-game multi-stage-game" id="active-game-stage" aria-live="polite">
            <div className="quick-game-title"><span><Gamepad2 size={25} /></span><div><small>{activeGame.subject} • {activeGame.typeLabel}</small><h2>{activeGame.title}</h2></div><strong className="stage-count-badge">المرحلة {gameStageIndex + 1} من {activeGame.stages.length}</strong></div>
            <div className="active-game-source"><BookOpen size={17} /><span><small>المحتوى المرتبط</small><strong>{activeGame.sourceLabel}</strong></span></div>
            <div className="game-stage-progress" aria-label={`التقدم في اللعبة ${stageProgress}%`}><span style={{ width: `${stageProgress}%` }} /></div>
            <div className="game-stage-dots">{activeGame.stages.map((stage, index) => <span className={`${index < gameStageIndex || gameOutcome === "success" ? "completed" : ""} ${index === gameStageIndex ? "current" : ""}`} key={stage.title}><i>{index < gameStageIndex || gameOutcome === "success" ? <CheckCircle2 size={15} /> : index + 1}</i><small>{stage.title}</small></span>)}</div>
            <div className="current-stage-heading"><small>المهارة الحالية</small><h3>{activeStage.title}</h3></div>

            {activeGame.mode === "wheel" && <div className="wheel-stage"><div className="wheel-pointer" aria-hidden="true">▼</div><div className="ability-wheel" style={{ transform: `rotate(${wheelRotation}deg)` }} aria-label="عجلة أسئلة القدرات"><span>لفظي</span><span>كمي</span><span>منطق</span><span>نِسب</span><span>مفردات</span><span>أنماط</span></div><button className="primary-btn wheel-button" onClick={spinAbilityWheel} disabled={wheelSpinning || gameOutcome === "stage-success" || gameOutcome === "success"}>{wheelSpinning ? "العجلة تدور..." : wheelReady ? "أعيدي تدوير العجلة" : "أديري العجلة"}</button>{!wheelReady && !wheelSpinning && <small className="wheel-hint">أديري العجلة ليظهر سؤال المرحلة.</small>}</div>}

            {displayedQuestion && <p className="game-question">{displayedQuestion}</p>}

            {(activeGame.mode === "multiple-choice" || activeGame.mode === "true-false" || activeGame.mode === "wheel") && <div className="game-choices">
              {displayedChoices.map((choice, index) => (
                <button disabled={(activeGame.mode === "wheel" && wheelSpinning) || gameOutcome === "stage-success" || gameOutcome === "success"} className={gameAnswer === index ? (index === displayedCorrect ? "correct" : "wrong") : ""} key={choice} onClick={() => void chooseGameAnswer(index)}>{choice}</button>
              ))}
            </div>}

            {activeGame.mode === "fill-blank" && <form className="fill-blank-form" onSubmit={(event) => { event.preventDefault(); void submitFillBlank(); }}><label htmlFor="fill-blank-answer">الكلمة المناسبة</label><div><input id="fill-blank-answer" disabled={gameOutcome === "stage-success" || gameOutcome === "success"} value={fillBlankAnswer} onChange={(event) => { setFillBlankAnswer(event.target.value); setGameOutcome(null); }} placeholder="اكتبي الإجابة هنا" autoComplete="off" /><button className="primary-btn" disabled={gameOutcome === "stage-success" || gameOutcome === "success"}>تحقّقي من الإجابة</button></div></form>}

            {activeGame.mode === "matching" && <div className="matching-board"><div><strong>البطاقات</strong>{activeStage.pairs?.map((pair) => <button className={matchedWords.includes(pair.left) ? "matched" : selectedMatchWord === pair.left ? "selected" : ""} disabled={matchedWords.includes(pair.left) || gameOutcome === "stage-success" || gameOutcome === "success"} key={pair.left} onClick={() => { setSelectedMatchWord(pair.left); setMatchingMessage("اختاري البطاقة المطابقة من القائمة المقابلة."); setGameOutcome(null); }}>{pair.left}</button>)}</div><div><strong>المطابقات</strong>{activeStage.pairs?.slice().reverse().map((pair) => <button className={matchedWords.includes(pair.left) ? "matched" : ""} disabled={matchedWords.includes(pair.left) || gameOutcome === "stage-success" || gameOutcome === "success"} key={pair.right} onClick={() => void selectMatchingMeaning(pair.right)}>{pair.right}</button>)}</div>{matchingMessage && <p>{matchingMessage}</p>}</div>}

            {activeGame.mode === "ordering" && <div className="ordering-game"><div className="ordering-progress">{orderedValues.length ? orderedValues.map((value, index) => <span key={value}>{index + 1}. {value}</span>) : <small>ابدئي باختيار أصغر قيمة.</small>}</div><div className="ordering-options">{activeStage.orderItems?.map((value) => <button className={orderedValues.includes(value) ? "selected" : ""} disabled={orderedValues.includes(value) || gameOutcome === "stage-success" || gameOutcome === "success"} key={value} onClick={() => void selectOrderedValue(value)}>{value}</button>)}</div>{orderedValues.length === activeStage.correctOrder?.length && gameOutcome === "retry" && <button className="secondary-btn ordering-reset" onClick={() => { setOrderedValues([]); setGameOutcome(null); }}>إعادة الترتيب</button>}</div>}

            {gameOutcome === "retry" && <div className="game-feedback retry">إجابة غير صحيحة، حاولي مرة أخرى.</div>}
            {gameOutcome === "stage-success" && <div className="game-feedback stage-success"><CheckCircle2 size={25} /><div><strong>أحسنتِ! اكتملت المرحلة {gameStageIndex + 1}.</strong><span>تابعي إلى المرحلة التالية لإكمال مسار اللعبة.</span></div><button className="primary-btn" onClick={advanceGameStage}>المرحلة التالية <ChevronLeft size={18} /></button></div>}
            {gameOutcome === "success" && <div className="game-feedback success final-game-success"><Trophy size={32} /><strong>أحسنتِ يا مبدعتنا! أنجزتِ جميع مراحل اللعبة ✦</strong><span>اكتبي اسمك الرباعي لإصدار شهادة الإنجاز.</span><div className="certificate-name-box compact"><label htmlFor="game-certificate-name">الاسم الرباعي في الشهادة</label><input id="game-certificate-name" value={certificateStudentName} onChange={(event) => { setCertificateStudentName(event.target.value); setCertificateNameMessage(""); }} placeholder="اكتبي اسم الطالبة الرباعي" />{certificateNameMessage && <em role="alert">{certificateNameMessage}</em>}</div><button className="certificate-button" onClick={() => void issueCertificate(activeGame.id, activeGame.title, "لعبة تعليمية", 100)}><Award size={19} /> إصدار شهادة إنجاز جميع المراحل</button></div>}
          </article>
          </>}
        </section>
      </>
    );
  };

  const renderCertificate = () => certificatePreview && (
    <div className="certificate-modal" role="dialog" aria-modal="true" aria-label="شهادة إنجاز">
      <div className="certificate-dialog">
        <div className="certificate-sheet">
          <span className="certificate-seal"><Award size={48} /></span>
          <small className="certificate-platform">منصة قدراتي للقدرات والتحصيلي</small>
          <div className="certificate-school"><School size={18} /> الثانوية 107</div>
          <h2>شهادة إنجاز</h2>
          <p>تُمنح هذه الشهادة إلى الطالبة</p>
          <strong className="certificate-student-name">{certificatePreview.studentName}</strong>
          <p>تقديرًا لإتمامها {certificatePreview.activityType} بنجاح</p>
          <h3>{certificatePreview.activityTitle}</h3>
          <p className="certificate-congratulation">وقد حصلتِ على هذه الشهادة تقديرًا لجهودكِ المتميزة؛ فواصلي التألق يا مبدعتنا.</p>
          <div className="certificate-meta"><span><CalendarDays size={17} /> {certificatePreview.issuedAt}</span><span>النتيجة: {certificatePreview.score}%</span><span>رقم الشهادة: {certificatePreview.certificateNumber}</span></div>
          <div className="certificate-signatures"><div><span>المدرسة</span><b>الثانوية 107</b></div><div><span>المعلمة</span><b>أمل الزهراني</b></div></div>
        </div>
        <div className="certificate-actions">
          <button className="secondary-btn" onClick={() => setCertificatePreview(null)}><X size={18} /> إغلاق</button>
          <button className="primary-btn" onClick={() => window.print()}><Printer size={18} /> طباعة أو حفظ PDF</button>
        </div>
      </div>
    </div>
  );

  const renderArticles = () => {
    const featuredArticles = knowledgeArticles.filter((article) => article.featured);
    return (
      <>
        {pageHeading("مكتبة مقالات القدرات", "سبعة مسارات معرفية و55 إجابة عملية للتأسيس، والتدريب، والتخطيط، والاستعداد بثقة.")}
        <section className="content-page articles-library">
          <div className="articles-stats" aria-label="ملخص مكتبة المقالات">
            <span><Newspaper size={21} /><b>{knowledgeArticles.length}</b> مقالة مجابة</span>
            <span><FolderOpen size={21} /><b>{articleCategories.length}</b> أقسام</span>
            <span><CheckCircle2 size={21} /> تدريب وإجابة في كل مقالة</span>
          </div>

          <section className="featured-articles" aria-labelledby="featured-articles-title">
            <div className="section-kicker"><Sparkles size={18} /><div><h2 id="featured-articles-title">ابدئي بهذه المقالات</h2><p>موضوعات مختارة لبناء خطة واضحة وتحسين الأداء.</p></div></div>
            <div className="featured-article-list">{featuredArticles.map((article) => <button key={article.id} onClick={() => openArticle(article)}><span>مقترح</span>{article.title}<ChevronLeft size={17} /></button>)}</div>
          </section>

          <section className="article-category-section" aria-labelledby="article-categories-title">
            <div className="section-kicker"><FolderOpen size={18} /><div><h2 id="article-categories-title">أقسام المقالات</h2><p>اختاري القسم، أو اعرضي المكتبة كاملة.</p></div></div>
            <div className="article-category-grid">
              <button className={articleCategoryFilter === "all" ? "active" : ""} onClick={() => setArticleCategoryFilter("all")}><span><Newspaper size={25} /></span><strong>جميع المقالات</strong><small>{knowledgeArticles.length} موضوعًا</small></button>
              {articleCategories.map((category) => {
                const Icon = articleIcons[category.icon];
                const count = knowledgeArticles.filter((article) => article.category === category.id).length;
                return <button className={`${articleCategoryFilter === category.id ? "active" : ""} category-${category.color}`} key={category.id} onClick={() => setArticleCategoryFilter(category.id)}><span><Icon size={25} /></span><strong>{category.label}</strong><small>{count} موضوعات</small></button>;
              })}
            </div>
          </section>

          <div className="article-tools">
            <label><Search size={19} /><input value={articleSearch} onChange={(event) => setArticleSearch(event.target.value)} placeholder="ابحثي عن سؤال أو مهارة..." aria-label="البحث في المقالات" /></label>
            <p aria-live="polite">عرض <b>{filteredArticles.length}</b> من {knowledgeArticles.length} مقالة</p>
          </div>

          {filteredArticles.length ? <div className="article-grid">{filteredArticles.map((article, index) => {
            const category = articleCategories.find((item) => item.id === article.category) ?? articleCategories[0];
            const Icon = articleIcons[category.icon];
            return <article className={`article-card article-tone-${(index % 3) + 1}`} key={article.id}><div className="article-card-top"><span className={`article-category-tag category-${category.color}`}><Icon size={15} />{category.label}</span>{article.featured && <small><Sparkles size={13} /> مقترح للبدء</small>}</div><h2>{article.title}</h2><p>{article.answer}</p><button onClick={() => openArticle(article)}>قراءة الإجابة الكاملة <ChevronLeft size={17} /></button></article>;
          })}</div> : <div className="empty-category"><Search size={42} /><h2>لا توجد نتيجة مطابقة</h2><p>جرّبي كلمة أخرى أو اختاري «جميع المقالات».</p><button className="secondary-btn" onClick={() => { setArticleSearch(""); setArticleCategoryFilter("all"); }}>مسح البحث</button></div>}
        </section>
      </>
    );
  };

  const renderArticle = () => {
    const category = articleCategories.find((item) => item.id === selectedArticle.category) ?? articleCategories[0];
    const Icon = articleIcons[category.icon];
    const sources = sourcesForCategory(selectedArticle.category);
    return (
      <>
        <section className={`article-detail-hero category-${category.color}`}>
          <button className="back-button" onClick={() => setView("articles")}><ChevronRight size={18} /> العودة إلى المقالات</button>
          <div className="article-detail-heading"><span><Icon size={30} /></span><div><small>{category.label}</small><h1>{selectedArticle.title}</h1><p>{category.description}</p></div></div>
        </section>
        <article className="article-detail-page">
          <section className="article-lead"><span>الإجابة المختصرة</span><p>{selectedArticle.answer}</p></section>

          <div className="article-detail-grid">
            <section><span className="article-section-number">1</span><div><h2>مقدمة</h2><p>يؤثر هذا الموضوع مباشرة في جودة استعدادك؛ وفهم الفكرة ثم تطبيقها في تدريب قصير أفضل من حفظ نصيحة عامة من غير ممارسة.</p></div></section>
            <section><span className="article-section-number">2</span><div><h2>الهدف من المقالة</h2><p>{category.goal}</p></div></section>
            <section className="article-wide"><span className="article-section-number">3</span><div><h2>الشرح المبسط</h2><p>{selectedArticle.answer}</p></div></section>
            <section className="article-wide"><span className="article-section-number">4</span><div><h2>خطوات عملية</h2><ol>{category.steps.map((step) => <li key={step}>{step}</li>)}</ol></div></section>
            <section><span className="article-section-number">5</span><div><h2>مثال محلول</h2><p>{selectedArticle.example ?? category.example}</p></div></section>
            <section className="article-warning"><span className="article-section-number">6</span><div><h2>خطأ شائع</h2><p>{selectedArticle.commonMistake ?? category.commonMistake}</p></div></section>
            <section className="article-training"><span className="article-section-number">7</span><div><h2>تدريب قصير</h2><p>{selectedArticle.training ?? category.training}</p></div></section>
            <details className="article-answer"><summary><CheckCircle2 size={20} /> افتحي الإجابة مع التفسير</summary><p>{selectedArticle.trainingAnswer ?? category.trainingAnswer}</p></details>
            <section className="article-wide article-summary"><span className="article-section-number">8</span><div><h2>الخلاصة</h2><p>{selectedArticle.answer} طبقي الخطوات على تدريب واحد الآن، ثم راجعي سبب الإجابة قبل الانتقال إلى موضوع جديد.</p></div></section>
          </div>

          <section className="article-related"><div><Link2 size={22} /><span><h2>دروس واختبارات مرتبطة</h2><p>حوّلي الفكرة إلى ممارسة مباشرة داخل منصة قدراتي.</p></span></div><div><button className="secondary-btn" onClick={() => setView("lessons")}><BookOpen size={18} /> فتح الدروس</button><button className="primary-btn" onClick={() => setView("tests")}><ClipboardCheck size={18} /> فتح الاختبارات المحاكية</button></div></section>

          <section className="article-sources"><div className="section-kicker"><FileText size={18} /><div><h2>المصادر والمراجع الموثوقة</h2><p>روابط رسمية، تم الاطلاع عليها في 14 أغسطس 2026.</p></div></div><ul>{sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer"><strong>{source.title}</strong><span>{source.organization} • {source.year}</span><Link2 size={16} /></a></li>)}</ul><small>تنبيه: راجعي دائمًا إشعار تسجيلك والصفحة الرسمية لمعرفة التعليمات التنظيمية الأحدث لموعدك.</small></section>

          <nav className="article-bottom-nav" aria-label="تنقل المقالة"><button className="secondary-btn" onClick={() => setView("articles")}><ChevronRight size={18} /> جميع المقالات</button>{knowledgeArticles.findIndex((article) => article.id === selectedArticle.id) < knowledgeArticles.length - 1 && <button className="primary-btn" onClick={() => openArticle(knowledgeArticles[knowledgeArticles.findIndex((article) => article.id === selectedArticle.id) + 1])}>المقالة التالية <ChevronLeft size={18} /></button>}</nav>
        </article>
      </>
    );
  };

  const renderContact = () => (
    <>{pageHeading("تواصل معنا", "أرسل استفسارك أو اقتراحك وسنعود إليك في أقرب وقت.")}<section className="contact-layout"><div className="contact-info"><span><Mail size={24} /></span><h2>يسعدنا سماعك</h2><p>اكتبي رسالتك بوضوح، وسيُفتح تطبيق البريد لديك برسالة جاهزة للإرسال.</p><div><strong>البريد</strong><a className="contact-email-link" href={`mailto:${contactEmail}`}><Mail size={16} /> {contactEmail}</a></div></div><form className="form-card" onSubmit={sendContact}><label>الاسم الكامل<input name="name" required /></label><label>البريد الإلكتروني<input name="email" type="email" required /></label><label>الرسالة<textarea name="message" rows={6} required /></label><button className="primary-btn"><Mail size={18} /> تجهيز الرسالة بالبريد</button>{contactSent && <p className="success-message"><CheckCircle2 size={18} /> تم تجهيز الرسالة في تطبيق البريد؛ راجعيها ثم أرسليها.</p>}</form></section></>
  );

  const renderLogin = () => (
    <section className="login-page"><div className="login-visual"><span><GraduationCap size={52} /></span><h1>مرحبًا أمل الزهراني</h1><p>دخول خاص بالمعلمة لإدارة محتوى منصة قدراتي ومتابعة أكثر من 400 طالبة.</p><ul><li><CheckCircle2 /> متابعة الطالبات والنتائج</li><li><CheckCircle2 /> إدارة الدروس والملفات</li><li><CheckCircle2 /> متابعة الألعاب والشهادات</li></ul></div><form className="login-card login-card-page" onSubmit={handleLogin}><span className="login-logo"><LogIn size={28} /></span><h2>دخول المعلمة</h2><p>استخدمي اسم المستخدم وكلمة المرور الخاصة بك.</p><label>اسم المستخدم<input name="username" type="text" autoComplete="username" placeholder="اسم المستخدم" required /></label><label>كلمة المرور<input name="password" type="password" autoComplete="current-password" placeholder="••••••••" required /></label><button className="primary-btn full" disabled={sessionChecking}>{sessionChecking ? "جارٍ التحقق..." : "دخول آمن"}</button>{loginMessage && <p className="form-message" role="status">{loginMessage}</p>}</form></section>
  );

  const renderDashboard = () => {
    const tabs: { id: DashboardTab; label: string; icon: typeof Home }[] = [
      { id: "overview", label: "نظرة عامة", icon: Gauge }, { id: "add-lesson", label: "إضافة درس", icon: Video }, { id: "add-file", label: "إضافة ملف", icon: FolderOpen }, { id: "add-test", label: "إضافة اختبار", icon: ClipboardCheck }, { id: "students", label: "الطالبات والنتائج", icon: Users }, { id: "messages", label: "الرسائل", icon: MessageSquare }, { id: "settings", label: "الإعدادات", icon: Settings },
    ];
    const filteredStudents = studentRecords.filter((student) => {
      const matchesSearch = `${student.name} ${student.grade} ${student.classroom}`.includes(studentSearch.trim());
      const matchesGrade = studentGradeFilter === "الكل" || student.grade === studentGradeFilter;
      return matchesSearch && matchesGrade;
    });
    const studentsPerPage = 20;
    const studentPageCount = Math.max(1, Math.ceil(filteredStudents.length / studentsPerPage));
    const safeStudentPage = Math.min(studentPage, studentPageCount);
    const visibleStudents = filteredStudents.slice((safeStudentPage - 1) * studentsPerPage, safeStudentPage * studentsPerPage);
    const selectedStudent = studentRecords.find((student) => student.id === selectedStudentId) ?? filteredStudents[0] ?? studentRecords[0];
    const selectedStudentAverage = selectedStudent?.tests.length
      ? Math.round(selectedStudent.tests.reduce((total, result) => total + result.score, 0) / selectedStudent.tests.length)
      : 0;
    const totalCertificates = studentRecords.reduce((total, student) => total + student.certificates.length, 0);
    return (
      <section className="dashboard-shell"><aside className="dashboard-sidebar"><div className="dashboard-user"><span><UserRound size={24} /></span><div><strong>أمل الزهراني</strong><small>حساب المعلمة</small></div></div>{tabs.map(({ id, label, icon: Icon }) => <button className={dashboardTab === id ? "active" : ""} key={id} onClick={() => { setDashboardTab(id); setDashboardMessage(""); }}><Icon size={19} /> {label}</button>)}<button className="logout-button" onClick={logout}><LogOut size={19} /> تسجيل الخروج</button></aside>
        <div className="dashboard-main"><div className="dashboard-top"><div><span>لوحة إدارة المحتوى</span><h1>{tabs.find((tab) => tab.id === dashboardTab)?.label}</h1></div><button className="secondary-btn" onClick={() => setView("home")}><Eye size={18} /> مشاهدة الموقع</button></div>
          {dashboardTab === "overview" && <><div className="dashboard-kpis"><Kpi icon={BookOpen} value={lessons.length} label="الدروس" tone="orange" /><Kpi icon={FolderOpen} value={files.length} label="الملفات" tone="teal" /><Kpi icon={ClipboardCheck} value={tests.length} label="الاختبارات" tone="purple" /><Kpi icon={Users} value={studentRecords.length} label="الطالبات" tone="blue" /></div><div className="dashboard-grid"><article className="panel"><div className="panel-title"><h2>أحدث الدروس</h2><button onClick={() => setDashboardTab("add-lesson")}><Plus size={17} /> إضافة</button></div>{lessons.slice(0, 4).map((lesson) => <div className="table-row" key={lesson.id}><span className="mini-icon"><Video size={17} /></span><div><strong>{lesson.title}</strong><small>{lesson.category}</small></div><span className="status-live">منشور</span></div>)}</article><article className="panel"><div className="panel-title"><h2>تقدم المنصة</h2></div><div className="progress-stat"><span>إكمال الملفات</span><b>78%</b><i><em style={{ width: "78%" }} /></i></div><div className="progress-stat"><span>نشاط الاختبارات</span><b>64%</b><i><em style={{ width: "64%" }} /></i></div><div className="progress-stat"><span>مشاهدة الدروس</span><b>86%</b><i><em style={{ width: "86%" }} /></i></div></article></div></>}
          {dashboardTab === "add-lesson" && <form className="admin-form panel" onSubmit={addLesson}><div className="panel-title"><div><h2>إضافة درس جديد</h2><p>أضيفي رابط YouTube أو استخدمي رابط فيديو خارجي.</p></div></div><div className="form-grid"><label>عنوان الدرس<input value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} required /></label><label>القسم<select value={lessonForm.category} onChange={(e) => setLessonForm({ ...lessonForm, category: e.target.value })}><option>قدرات لفظي</option><option>قدرات كمي</option><option>تحصيلي</option></select></label><label className="full-field">وصف الدرس<textarea rows={4} value={lessonForm.description} onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })} /></label><label>مدة الفيديو<input placeholder="مثال: 20 دقيقة" value={lessonForm.duration} onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })} /></label><label>رابط YouTube أو الفيديو<input type="url" placeholder="https://..." value={lessonForm.videoUrl} onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })} /></label></div><label className="upload-zone"><CloudUpload size={34} /><strong>رفع فيديو MP4</strong><span>اختاري الفيديو، وسيظهر تقدم الرفع للملفات الكبيرة.</span><input type="file" accept="video/mp4,video/webm" onChange={(e) => handleVideoUpload(e.target.files?.[0])} /></label>{uploadProgress > 0 && <div className="upload-progress"><span style={{ width: `${uploadProgress}%` }} /><b>{uploadProgress}%</b></div>}<label className="toggle-line"><input type="checkbox" checked={lessonForm.published} onChange={(e) => setLessonForm({ ...lessonForm, published: e.target.checked })} /> نشر الدرس مباشرة</label><button className="primary-btn save-button"><Save size={18} /> حفظ الدرس</button></form>}
          {dashboardTab === "add-file" && <form className="admin-form panel" onSubmit={addFile}><div className="panel-title"><div><h2>رفع ملف تعليمي</h2><p>PDF أو Word أو PowerPoint، ثم اربطيه بالدرس المناسب.</p></div></div><div className="form-grid"><label>اسم الملف<input value={fileForm.title} onChange={(e) => setFileForm({ ...fileForm, title: e.target.value })} required /></label><label>الدرس المرتبط<select value={fileForm.lessonId} onChange={(e) => setFileForm({ ...fileForm, lessonId: e.target.value })}><option value="">ملف عام</option>{lessons.map((lesson) => <option key={lesson.id} value={lesson.id}>{lesson.title}</option>)}</select></label><label className="full-field">رابط خارجي اختياري<input type="url" placeholder="Google Drive أو رابط مباشر" value={fileForm.fileUrl} onChange={(e) => setFileForm({ ...fileForm, fileUrl: e.target.value })} /></label></div><label className="upload-zone"><Upload size={34} /><strong>اختيار ملف</strong><span>PDF أو DOCX أو PPTX</span><input type="file" accept=".pdf,.docx,.pptx" onChange={(e) => handleFileUpload(e.target.files?.[0])} /></label>{uploadProgress > 0 && <div className="upload-progress"><span style={{ width: `${uploadProgress}%` }} /><b>{uploadProgress}%</b></div>}<button className="primary-btn save-button"><Save size={18} /> حفظ الملف</button></form>}
          {dashboardTab === "add-test" && <form className="admin-form panel" onSubmit={addTest}><div className="panel-title"><div><h2>إنشاء اختبار</h2><p>أنشئي بطاقة الاختبار ثم أضيفي الأسئلة بعد ربط قاعدة البيانات.</p></div></div><div className="form-grid"><label>عنوان الاختبار<input value={testForm.title} onChange={(e) => setTestForm({ ...testForm, title: e.target.value })} required /></label><label>القسم<select value={testForm.category} onChange={(e) => setTestForm({ ...testForm, category: e.target.value })}><option>قدرات لفظي</option><option>قدرات كمي</option><option>تحصيلي</option></select></label><label>عدد الأسئلة<input type="number" min="1" value={testForm.questions} onChange={(e) => setTestForm({ ...testForm, questions: e.target.value })} /></label><label>المدة بالدقائق<input type="number" min="1" value={testForm.minutes} onChange={(e) => setTestForm({ ...testForm, minutes: e.target.value })} /></label></div><button className="primary-btn save-button"><Save size={18} /> إنشاء الاختبار</button></form>}
          {dashboardTab === "students" && <section className="student-report">
            <div className="dashboard-kpis student-kpis">
              <Kpi icon={Users} value={studentRecords.length} label="إجمالي الطالبات" tone="blue" />
              <Kpi icon={Activity} value={studentRecords.filter((student) => student.status !== "غير متصلة").length} label="نشطات اليوم" tone="teal" />
              <Kpi icon={ClipboardCheck} value={studentRecords.reduce((total, student) => total + student.tests.length, 0)} label="محاولات الاختبارات" tone="purple" />
              <Kpi icon={Award} value={totalCertificates} label="شهادات الإنجاز" tone="orange" />
            </div>

            <article className="panel student-list-panel">
              <div className="panel-title"><div><h2>سجل الطالبات</h2><p>مصمم لإدارة أكثر من 400 طالبة، ويعرض 20 طالبة في كل صفحة.</p></div></div>
              <div className="student-toolbar">
                <label><Search size={17} /><input value={studentSearch} onChange={(event) => { setStudentSearch(event.target.value); setStudentPage(1); }} placeholder="ابحثي باسم الطالبة أو الشعبة" aria-label="البحث في الطالبات" /></label>
                <label><School size={17} /><select value={studentGradeFilter} onChange={(event) => { setStudentGradeFilter(event.target.value); setStudentPage(1); }} aria-label="تصفية حسب الصف"><option value="الكل">جميع الصفوف</option>{Array.from(new Set(studentRecords.map((student) => student.grade))).map((grade) => <option key={grade}>{grade}</option>)}</select></label>
              </div>
              <div className="student-list-summary"><span>الصفحة {safeStudentPage} من {studentPageCount}</span><strong>{filteredStudents.length} سجلًا مطابقًا</strong></div>
              <div className="data-table student-data-table">
                <div className="student-data-row student-data-head"><span>الطالبة</span><span>الصف والشعبة</span><span>آخر دخول</span><span>آخر مكان دخلته</span><span>متوسط الاختبارات</span><span>الألعاب</span><span>الشهادات</span><span>التفاصيل</span></div>
                {visibleStudents.map((student) => {
                  const average = student.tests.length ? Math.round(student.tests.reduce((total, result) => total + result.score, 0) / student.tests.length) : 0;
                  return <div className={selectedStudent?.id === student.id ? "student-data-row selected" : "student-data-row"} key={student.id}>
                    <span className="student-table-name"><i className={`presence-dot ${student.status === "متصلة الآن" ? "online" : student.status === "نشطة اليوم" ? "active-today" : "offline"}`} /><strong>{student.name}</strong></span>
                    <span>{student.grade}<small>الشعبة {student.classroom}</small></span>
                    <span>{student.lastActive}</span>
                    <span className="last-location"><MapPin size={15} /> {student.lastLocation}</span>
                    <span><b className="score-pill">{average}%</b><small>{student.tests.length} اختبارات</small></span>
                    <span>{student.games.length}</span>
                    <span>{student.certificates.length}</span>
                    <span><button className="student-details-button" onClick={() => setSelectedStudentId(student.id)}>عرض الملف</button></span>
                  </div>;
                })}
                {!filteredStudents.length && <div className="student-empty">لا توجد طالبات مطابقة للبحث.</div>}
              </div>
              {studentPageCount > 1 && <nav className="pagination student-pagination" aria-label="صفحات سجل الطالبات"><button className="pagination-nav" onClick={() => setStudentPage(Math.max(1, safeStudentPage - 1))} disabled={safeStudentPage === 1}><ChevronRight size={18} /> السابق</button><div className="pagination-pages"><button className="active" aria-current="page">{safeStudentPage}</button><span>من {studentPageCount}</span></div><button className="pagination-nav" onClick={() => setStudentPage(Math.min(studentPageCount, safeStudentPage + 1))} disabled={safeStudentPage === studentPageCount}>التالي <ChevronLeft size={18} /></button></nav>}
            </article>

            {selectedStudent && <section className="student-profile-section">
              <header className="student-profile-header">
                <span className="student-avatar"><UserRound size={31} /></span>
                <div><small>ملف الطالبة</small><h2>{selectedStudent.name}</h2><p><School size={16} /> {selectedStudent.grade} — الشعبة {selectedStudent.classroom}</p></div>
                <span className={`student-status ${selectedStudent.status === "متصلة الآن" ? "online" : ""}`}>{selectedStudent.status}</span>
              </header>

              <div className="student-profile-kpis">
                <article><span><CalendarDays size={20} /></span><div><small>آخر دخول</small><strong>{selectedStudent.lastActive}</strong></div></article>
                <article><span><MapPin size={20} /></span><div><small>عدد مرات الدخول</small><strong>{selectedStudent.visits} مرة</strong></div></article>
                <article><span><ClipboardCheck size={20} /></span><div><small>متوسط الاختبارات</small><strong>{selectedStudentAverage}%</strong></div></article>
                <article><span><Award size={20} /></span><div><small>الشهادات</small><strong>{selectedStudent.certificates.length}</strong></div></article>
              </div>

              <div className="student-detail-grid">
                <article className="panel activity-panel">
                  <div className="panel-title"><div><h2>سجل الدخول والتنقّل</h2><p>آخر الأماكن التي دخلتها الطالبة داخل المنصة.</p></div></div>
                  <ol className="activity-timeline">{selectedStudent.activities.map((activity, index) => <li key={`${activity.item}-${activity.date}`}><span>{index + 1}</span><div><small>{activity.area}</small><strong>{activity.item}</strong><p>{activity.action} • {activity.date}</p></div></li>)}</ol>
                </article>

                <article className="panel student-results-panel">
                  <div className="panel-title"><div><h2>نتائج الاختبارات</h2><p>الدرجة وتاريخ آخر محاولة.</p></div></div>
                  <div className="mini-results-list">{selectedStudent.tests.map((result) => <div key={`${result.title}-${result.date}`}><span><ClipboardCheck size={18} /></span><div><strong>{result.title}</strong><small>{result.date}</small></div><b className={result.score >= 80 ? "high-score" : ""}>{result.score}%</b></div>)}{!selectedStudent.tests.length && <p className="no-records">لا توجد اختبارات مسجلة.</p>}</div>
                </article>

                <article className="panel student-games-panel">
                  <div className="panel-title"><div><h2>الألعاب والإنجاز</h2><p>نتائج الألعاب وحالة استحقاق الشهادة.</p></div></div>
                  <div className="mini-results-list">{selectedStudent.games.map((game) => <div key={`${game.title}-${game.date}`}><span><Gamepad2 size={18} /></span><div><strong>{game.title}</strong><small>{game.date}</small></div><b>{game.score}%</b><em className={game.certificate ? "certificate-earned" : "certificate-pending"}>{game.certificate ? "شهادة مكتسبة" : "لم تُصدر"}</em></div>)}{!selectedStudent.games.length && <p className="no-records">لا توجد ألعاب مكتملة.</p>}</div>
                </article>

                <article className="panel student-certificates-panel">
                  <div className="panel-title"><div><h2>شهادات الطالبة</h2><p>الشهادات الصادرة بعد إكمال الألعاب.</p></div></div>
                  <div className="certificate-list">{selectedStudent.certificates.map((certificate) => <button key={certificate.certificateNumber} onClick={() => setCertificatePreview({ studentName: selectedStudent.name, activityTitle: certificate.gameTitle, activityType: "لعبة تعليمية", score: 100, issuedAt: certificate.issuedAt, certificateNumber: certificate.certificateNumber })}><span><Award size={22} /></span><div><strong>{certificate.title}</strong><small>{certificate.gameTitle} • {certificate.issuedAt}</small></div><b>عرض</b></button>)}{!selectedStudent.certificates.length && <div className="no-certificate"><Award size={28} /><span>لم تحصل الطالبة على شهادة بعد.</span></div>}</div>
                </article>
              </div>
            </section>}
          </section>}
          {dashboardTab === "messages" && <article className="panel"><div className="panel-title"><h2>رسائل التواصل</h2></div>{[{ n: "طالبة", m: "أحتاج مساعدة في فتح ملف المراجعة." }, { n: "زائرة المنصة", m: "هل يتوفر اختبار شامل جديد؟" }].map((message) => <div className="message-row" key={message.m}><span><Mail size={18} /></span><div><strong>{message.n}</strong><p>{message.m}</p></div><button>فتح</button></div>)}</article>}
          {dashboardTab === "settings" && <article className="panel settings-panel"><h2>نسخة GitHub Pages</h2><div className="connection"><span><CheckCircle2 /></span><div><strong>الوضع الثابت مفعّل</strong><p>المحتوى العام يعمل محليًا داخل المتصفح من دون تسجيل دخول أو قاعدة بيانات أو رفع خادمي.</p></div></div></article>}
          {dashboardMessage && <div className="dashboard-alert"><CheckCircle2 size={18} /> {dashboardMessage}</div>}
        </div>
      </section>
    );
  };

  const views: Record<View, () => React.ReactNode> = { home: renderHome, lessons: renderLessons, "category-lessons": renderCategoryLessons, "verbal-lessons": renderVerbalLessons, "mansaf-foundation": renderMansafFoundation, "mansaf-training": renderMansafTraining, "mansaf-files": renderMansafFiles, "mansaf-file-group": renderMansafFileGroup, lesson: renderLesson, files: renderFiles, "file-category": renderFileCategory, "year-files": renderYearFiles, tests: renderTests, test: renderTest, games: renderGames, game: renderGames, articles: renderArticles, article: renderArticle, contact: renderContact, login: renderLogin, dashboard: renderDashboard };

  const renderTicker = () => (
    <div className="motivation-ticker" aria-label="عبارات تحفيزية">
      <div className="ticker-track">
        <span>✦ ثقتك تبدأ من استعدادك</span><span>✦ كل تدريب يقربك من هدفك</span><span>✦ قدراتك أكبر مما تتخيل</span><span>✦ تعلّم بهدوء وتقدّم بثبات</span>
        <span aria-hidden="true">✦ ثقتك تبدأ من استعدادك</span><span aria-hidden="true">✦ كل تدريب يقربك من هدفك</span><span aria-hidden="true">✦ قدراتك أكبر مما تتخيل</span><span aria-hidden="true">✦ تعلّم بهدوء وتقدّم بثبات</span>
      </div>
    </div>
  );

  const visibleView: View = view === "dashboard" || view === "login" ? "home" : view;
  return <main dir="rtl">{renderHeader()}{renderTicker()}{views[visibleView]()} {renderFooter()}<a className="telegram-float" href="https://t.me/AMAL_139" target="_blank" rel="noreferrer" aria-label="التواصل عبر تيليجرام مع أمل الزهراني"><span className="telegram-tooltip">@AMAL_139</span><Send size={27} /></a>{renderCertificate()}</main>;
}

function LessonCard({ lesson, openLesson }: { lesson: Lesson; openLesson: (lesson: Lesson) => void }) {
  return <article className="lesson-card"><div className="lesson-cover"><span>{lesson.category}</span><PlayCircle size={54} /></div><div className="lesson-card-body"><small><Clock3 size={14} /> {lesson.duration || "مدة مرنة"}</small><h2>{lesson.title}</h2><p>{lesson.description}</p><button onClick={() => openLesson(lesson)}>مشاهدة الدرس <ChevronLeft size={18} /></button></div></article>;
}

function Kpi({ icon: Icon, value, label, tone }: { icon: typeof Home; value: string | number; label: string; tone: string }) {
  return <article className={`kpi ${tone}`}><span><Icon size={23} /></span><div><strong>{value}</strong><p>{label}</p></div><BarChart3 size={34} className="kpi-chart" /></article>;
}
