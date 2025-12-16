import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Info } from 'lucide-react';
import { WEEKDAYS, ANIMATION_VARIANTS } from '../utils/constants';
import { extractBgColor } from '../utils/helpers';

/**
 * 行事曆週次卡片元件
 * @param {Object} week - 週次資料
 * @param {Object} camp - 已選擇的營隊
 * @param {Function} onRemove - 移除營隊
 * @param {Function} onShowDetails - 顯示營隊詳細資訊
 * @param {string} viewMode - 顯示模式 (mobile/desktop)
 */
const ScheduleGrid = ({ week, camp, onRemove, onShowDetails, viewMode }) => {
  const minHeight = viewMode === 'mobile' ? 'min-h-[140px]' : 'min-h-[180px]';

  return (
    <motion.div
      className={`rounded-3xl border-2 p-4 transition-all relative overflow-hidden flex flex-col ${minHeight} ${
        camp 
          ? 'bg-white border-indigo-100 shadow-lg' 
          : 'bg-slate-50 border-dashed border-slate-200'
      }`}
      variants={ANIMATION_VARIANTS.scaleIn}
      whileHover={camp ? { scale: 1.02, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' } : {}}
      layout
    >
      {/* 週次標題 */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <motion.span 
            className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${week.color}`}
            whileHover={{ scale: 1.05 }}
          >
            {week.label}
          </motion.span>
          <span className="text-xs text-slate-400 font-medium">
            {week.date}
          </span>
        </div>
        
        {/* 刪除按鈕 */}
        <AnimatePresence mode="wait">
          {camp && (
            <motion.button
              onClick={onRemove}
              className="text-slate-300 hover:text-red-500 transition-colors"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              whileHover={{ scale: 1.2, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
            >
              <Trash2 size={14} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* 星期圖示 */}
      <div className="grid grid-cols-5 gap-1 mb-auto">
        {WEEKDAYS.map((day, idx) => {
          const isOccupied = camp?.day_indices?.includes(idx);
          const iconColor = camp?.color ? extractBgColor(camp.color) : 'bg-gray-100';
          
          return (
            <motion.div 
              key={day} 
              className="flex flex-col gap-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <motion.div
                className={`h-8 sm:h-12 rounded-lg flex items-center justify-center text-sm transition-all duration-500 ${
                  isOccupied 
                    ? `${iconColor} border-b-2 border-black/10 scale-100` 
                    : 'bg-slate-100/50 scale-95 opacity-50'
                }`}
                animate={isOccupied ? { 
                  scale: [1, 1.1, 1],
                  rotate: [0, -5, 5, 0]
                } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                {isOccupied ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {camp.icon}
                  </motion.span>
                ) : (
                  <div className="w-1 h-1 rounded-full bg-slate-200" />
                )}
              </motion.div>
              <span className={`text-[8px] sm:text-[9px] text-center uppercase font-bold ${
                isOccupied ? 'text-slate-600' : 'text-slate-300'
              }`}>
                {day}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* 營隊資訊 */}
      <AnimatePresence mode="wait">
        {camp ? (
          <motion.div
            className="flex justify-between items-end cursor-pointer hover:opacity-70 transition-opacity mt-2"
            onClick={onShowDetails}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ y: -2 }}
          >
            <div>
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1">
                {camp.title}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  <Info size={12} className="text-slate-400" />
                </motion.div>
              </h4>
              <p className="text-[10px] text-slate-500">{camp.org}</p>
            </div>
            <div className="text-right">
              <motion.p 
                className="text-sm font-black text-indigo-600"
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
              >
                {camp.price_label}
              </motion.p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-xs text-slate-400 font-medium">尚未安排</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ScheduleGrid;