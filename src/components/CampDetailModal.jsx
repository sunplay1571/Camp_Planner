import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  DollarSign,
  CheckCircle,
  Info,
  Clock,
  ExternalLink,
  MapPin,
} from "lucide-react";
import { CATEGORIES } from "../utils/constants";

/**
 * 營隊詳細資訊彈窗元件
 * @param {Object} camp - 營隊資料
 * @param {Function} onClose - 關閉彈窗的回調函數
 */
const CampDetailModal = ({ camp, onClose }) => {
  const [activeWeek, setActiveWeek] = useState(1);

  // ESC 鍵關閉彈窗
  useEffect(() => {
    const handleKeyDown = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!camp) return null;

  const details = camp.details || {};
  let currentGrid = details.grid || [];

  // 處理雙週課表
  if (details.scheduleType === "bi-weekly-grid") {
    currentGrid = activeWeek === 1 ? details.gridWeek1 : details.gridWeek2;
  }

  const headerColorClass = camp.color
    ? camp.color.split(" ")[0]
    : "bg-gray-100";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          {/* Header */}
          <motion.div
            className={`p-4 sm:p-6 ${headerColorClass} relative border-b border-slate-100 flex justify-between items-start`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <motion.span
                className="text-3xl sm:text-5xl shadow-sm bg-white/50 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-2xl"
                whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                {camp.icon}
              </motion.span>
              <div>
                <span className="px-2 py-0.5 bg-white/80 backdrop-blur-md rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase text-slate-700 shadow-sm mb-1 inline-block">
                  {CATEGORIES.find((c) => c.id === camp.category)?.label ||
                    camp.category}
                </span>
                <h2 className="text-lg sm:text-2xl font-black text-slate-800 leading-tight">
                  {camp.title}
                </h2>
                <p className="text-slate-600 font-medium text-xs sm:text-sm flex items-center gap-1">
                  {camp.org}
                  <span className="hidden sm:inline text-slate-400 mx-2">
                    |
                  </span>
                  <span className="hidden sm:flex items-center gap-1">
                    <MapPin size={14} />
                    {camp.location}
                  </span>
                </p>
              </div>
            </div>
            <motion.button
              onClick={onClose}
              className="p-2 bg-white/50 hover:bg-white rounded-full transition-colors text-slate-600"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={20} />
            </motion.button>
          </motion.div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 bg-slate-50/50">
            {/* 價格和標籤 */}
            <motion.div
              className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6 items-start sm:items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 pr-4 sm:border-r border-slate-100 w-full sm:w-auto mb-2 sm:mb-0">
                <DollarSign size={20} className="text-emerald-500" />
                <span className="text-xl font-black text-slate-800">
                  {camp.price_label}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 flex-1">
                {details.highlights?.map((tag, idx) => (
                  <motion.span
                    key={idx}
                    className="px-2 sm:px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] sm:text-xs font-bold rounded-lg border border-indigo-100 flex items-center gap-1"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + idx * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <CheckCircle size={10} />
                    {tag}
                  </motion.span>
                ))}
              </div>
              {camp.url && (
                <motion.a
                  href={camp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto justify-center bg-slate-900 text-white px-5 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-colors sm:ml-auto cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  報名資訊 <ExternalLink size={14} />
                </motion.a>
              )}
            </motion.div>

            {/* 營隊介紹 */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Info size={14} />
                營隊介紹
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                {details.desc}
              </p>
            </motion.div>

            {/* 課程時間表 */}
            <ScheduleTable
              details={details}
              activeWeek={activeWeek}
              setActiveWeek={setActiveWeek}
              currentGrid={currentGrid}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * 時間表組件
 */
const ScheduleTable = ({ details, activeWeek, setActiveWeek, currentGrid }) => {
  return (
    <motion.div
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <Clock size={16} className="text-indigo-500" />
          課程時間表
        </h4>
        {details.scheduleType === "bi-weekly-grid" && (
          <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
            <motion.button
              onClick={() => setActiveWeek(1)}
              className={`px-2 sm:px-4 py-1.5 rounded-md text-[10px] sm:text-xs font-bold transition-all ${
                activeWeek === 1
                  ? "bg-indigo-500 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Week 1
            </motion.button>
            <motion.button
              onClick={() => setActiveWeek(2)}
              className={`px-2 sm:px-4 py-1.5 rounded-md text-[10px] sm:text-xs font-bold transition-all ${
                activeWeek === 2
                  ? "bg-indigo-500 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Week 2
            </motion.button>
          </div>
        )}
      </div>

      <div className="w-full overflow-x-auto">
        {(details.scheduleType === "grid" ||
          details.scheduleType === "bi-weekly-grid") && (
          <table className="w-full text-left table-fixed">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                {(details.scheduleType === "bi-weekly-grid"
                  ? activeWeek === 1
                    ? details.gridWeek1Header
                    : details.gridWeek2Header
                  : details.gridHeader
                )?.map((h, i) => (
                  <th
                    key={i}
                    className={`px-1 py-2 font-bold text-center text-[10px] sm:text-xs ${
                      i === 0 ? "w-12" : ""
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentGrid.map((row, idx) => (
                <motion.tr
                  key={idx}
                  className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.05 }}
                >
                  <td className="px-1 py-2 font-bold text-slate-400 bg-slate-50/30 text-center border-r border-slate-100 w-12 text-[10px] break-words align-top">
                    {row.time}
                  </td>
                  {["d1", "d2", "d3", "d4", "d5"].map(
                    (key) =>
                      row[key] !== undefined && (
                        <td
                          key={key}
                          className="px-0.5 py-2 text-slate-700 text-center leading-snug text-[10px] break-words whitespace-normal align-top w-[18%]"
                        >
                          {row[key]}
                        </td>
                      )
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
};

export default CampDetailModal;
