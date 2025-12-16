import React from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

const ANIMATION_VARIANTS = {
  slideDown: {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  },
};

const formatPrice = (price) => {
  if (!price) return "$0";
  return `$${price.toLocaleString()}`;
};

const Header = ({ totalPrice, viewMode }) => {
  return (
    <motion.header
      className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm shrink-0"
      initial="hidden"
      animate="visible"
      variants={ANIMATION_VARIANTS.slideDown}
    >
      <div
        className={`mx-auto px-4 py-3 flex justify-between items-center ${
          viewMode === "mobile" ? "pt-12" : ""
        }`}
      >
        {/* Logo 和標題 */}
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-md">
            <Calendar size={16} strokeWidth={3} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-none">
              Winter Planner
            </h1>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide">
              2026 幼兒冬令營 (5歲)
            </span>
          </div>
        </motion.div>

        {/* 總價顯示 */}
        <motion.div
          className="flex items-center gap-2 bg-gradient-to-r from-slate-50 to-indigo-50 px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <span className="text-[10px] text-slate-400 font-bold uppercase">
            Total
          </span>
          <motion.span
            className="text-lg font-black text-indigo-600"
            key={totalPrice}
            initial={{ scale: 1.2, color: "#10b981" }}
            animate={{ scale: 1, color: "#4f46e5" }}
            transition={{ duration: 0.3 }}
          >
            {formatPrice(totalPrice)}
          </motion.span>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
