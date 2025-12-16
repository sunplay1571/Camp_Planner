import React from "react";
import { motion } from "framer-motion";
import { Award, Activity, Trophy, Music, FileText } from "lucide-react";

const CATEGORIES = [
  { id: "All", label: "全部", icon: Award },
  { id: "Sport", label: "運動", icon: Activity },
  { id: "Horse", label: "騎馬", icon: Trophy },
  { id: "Dance", label: "街舞", icon: Activity },
  { id: "Music", label: "音樂", icon: Music },
  { id: "General", label: "綜合", icon: FileText },
];

const ANIMATION_VARIANTS = {
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
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  },
};

const CategoryFilter = ({ activeCategory, onCategoryChange }) => {
  return (
    <motion.div
      className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide"
      variants={ANIMATION_VARIANTS.staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {CATEGORIES.map((cat, index) => {
        const Icon = cat.icon;
        const isActive = activeCategory === cat.id;

        return (
          <motion.button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border flex items-center gap-1 ${
              isActive
                ? "bg-slate-800 text-white border-slate-800 shadow-md"
                : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
            }`}
            variants={ANIMATION_VARIANTS.slideUp}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Icon size={14} />
            {cat.label}
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default CategoryFilter;
