import React from "react";
import { motion } from "framer-motion";
import { Clock, MapPin, Info, CheckCircle, Plus } from "lucide-react";
import { ANIMATION_VARIANTS } from "../utils/constants";
import {
  getDurationTag,
  extractBgColor,
  isCampAvailableInWeek,
} from "../utils/helpers";

/**
 * 營隊卡片元件
 * @param {Object} camp - 營隊資料
 * @param {Object} schedule - 當前排程 { 2: camp, 3: camp }
 * @param {Function} onToggle - 切換營隊加入排程
 * @param {Function} onShowDetails - 顯示營隊詳細資訊
 */
const CampCard = ({ camp, schedule, onToggle, onShowDetails }) => {
  const isSelectedW1 = schedule[2]?.id === camp.id;
  const isSelectedW2 = schedule[3]?.id === camp.id;
  const headerColorClass = extractBgColor(camp.color);
  const durationTag = getDurationTag(camp);

  return (
    <motion.div
      onClick={onShowDetails}
      className={`relative bg-white rounded-xl border p-3 shadow-sm hover:shadow-md transition-all group cursor-pointer ${
        isSelectedW1 || isSelectedW2
          ? "border-indigo-500 ring-1 ring-indigo-500"
          : "border-slate-100 hover:border-slate-300"
      }`}
      variants={ANIMATION_VARIANTS.scaleIn}
      whileHover={{
        y: -4,
        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
      }}
      layout
    >
      <div className="flex gap-3">
        {/* 營隊圖示 */}
        <motion.div
          className={`w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl ${headerColorClass}`}
          whileHover={{
            scale: 1.1,
            rotate: [0, -10, 10, 0],
            transition: { duration: 0.5 },
          }}
        >
          {camp.icon}
        </motion.div>

        {/* 營隊資訊 */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-1 overflow-hidden">
              <h3 className="font-bold text-slate-800 text-sm truncate group-hover:text-indigo-600 transition-colors">
                {camp.title}
              </h3>
              <motion.span
                className={`flex-shrink-0 text-[9px] px-1 py-0.5 rounded border leading-none font-bold ${
                  durationTag === "全"
                    ? "bg-orange-50 text-orange-600 border-orange-200"
                    : "bg-slate-100 text-slate-500 border-slate-200"
                }`}
                whileHover={{ scale: 1.1 }}
              >
                {durationTag}
              </motion.span>
            </div>
            <motion.div
              className="text-slate-300 flex-shrink-0"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.3 }}
            >
              <Info size={12} />
            </motion.div>
          </div>

          <p className="text-xs text-slate-500 truncate mb-1.5">{camp.org}</p>

          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
            <span className="flex items-center gap-0.5">
              <Clock size={10} />
              {camp.days_text?.split(" ")[0]}
            </span>
            <span className="flex items-center gap-0.5">
              <MapPin size={10} />
              {camp.location.substring(0, 4)}
            </span>
            <span className="text-slate-600 font-bold ml-auto">
              {camp.price_label}
            </span>
          </div>
        </div>
      </div>

      {/* 週次選擇按鈕 */}
      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-50">
        <WeekButton
          weekLabel="W1"
          weekId={2}
          camp={camp}
          isSelected={isSelectedW1}
          isAvailable={isCampAvailableInWeek(camp, 2)}
          onToggle={onToggle}
        />
        <WeekButton
          weekLabel="W2"
          weekId={3}
          camp={camp}
          isSelected={isSelectedW2}
          isAvailable={isCampAvailableInWeek(camp, 3)}
          onToggle={onToggle}
        />
      </div>
    </motion.div>
  );
};

/**
 * 週次按鈕子元件
 */
const WeekButton = ({
  weekLabel,
  weekId,
  camp,
  isSelected,
  isAvailable,
  onToggle,
}) => {
  const handleClick = (e) => {
    e.stopPropagation();
    if (isAvailable) {
      onToggle(camp, weekId);
    }
  };

  const buttonClass = !isAvailable
    ? "text-slate-200 bg-slate-50 cursor-not-allowed"
    : isSelected
    ? weekId === 2
      ? "bg-emerald-500 text-white shadow-md shadow-emerald-200"
      : "bg-blue-500 text-white shadow-md shadow-blue-200"
    : weekId === 2
    ? "bg-white border border-slate-200 text-slate-600 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50"
    : "bg-white border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50";

  return (
    <motion.button
      onClick={handleClick}
      disabled={!isAvailable}
      className={`text-xs font-bold py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-all ${buttonClass}`}
      whileHover={isAvailable ? { scale: 1.05 } : {}}
      whileTap={isAvailable ? { scale: 0.95 } : {}}
    >
      {isSelected ? <CheckCircle size={12} /> : <Plus size={12} />}
      {weekLabel}
    </motion.button>
  );
};

export default CampCard;
