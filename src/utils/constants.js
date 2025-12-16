import { Award, Activity, Trophy, Music, FileText } from "lucide-react";

/**
 * 週次定義
 */
export const WEEKS = [
  {
    id: 2,
    label: "第一週 Week 1",
    date: "2/02 - 2/06",
    sub: "年後第一週",
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
  {
    id: 3,
    label: "第二週 Week 2",
    date: "2/09 - 2/13",
    sub: "開學前一週",
    color: "text-blue-600 bg-blue-50 border-blue-100",
  },
];

/**
 * 星期標籤
 */
export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

/**
 * 營隊分類
 */
export const CATEGORIES = [
  { id: "All", label: "全部", icon: Award },
  { id: "Sport", label: "運動", icon: Activity },
  { id: "Horse", label: "騎馬", icon: Trophy },
  { id: "Dance", label: "街舞", icon: Activity },
  { id: "Music", label: "音樂", icon: Music },
  { id: "General", label: "綜合", icon: FileText },
];

/**
 * Framer Motion 動畫變體
 */
export const ANIMATION_VARIANTS = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  },
  slideDown: {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  },
};

/**
 * 預設營隊詳細資訊結構
 */
export const DEFAULT_CAMP_DETAILS = {
  desc: "自訂營隊",
  highlights: ["使用者新增"],
  scheduleType: "grid",
  gridHeader: ["項目", "內容"],
  grid: [{ time: "備註", d1: "使用者自行新增的營隊行程" }],
};
