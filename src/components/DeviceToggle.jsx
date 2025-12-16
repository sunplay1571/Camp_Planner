import React from "react";
import { motion } from "framer-motion";
import { Monitor, Smartphone } from "lucide-react";

const DeviceToggle = ({ viewMode, setViewMode }) => {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 flex gap-2 bg-white p-1.5 rounded-full shadow-2xl border border-slate-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.button
        onClick={() => setViewMode("desktop")}
        className={`p-3 rounded-full transition-all ${
          viewMode === "desktop"
            ? "bg-slate-900 text-white shadow-md"
            : "text-slate-400 hover:text-slate-600"
        }`}
        title="桌機模式"
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.1 }}
      >
        <Monitor size={20} />
      </motion.button>

      <motion.button
        onClick={() => setViewMode("mobile")}
        className={`p-3 rounded-full transition-all ${
          viewMode === "mobile"
            ? "bg-slate-900 text-white shadow-md"
            : "text-slate-400 hover:text-slate-600"
        }`}
        title="手機模式"
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.1 }}
      >
        <Smartphone size={20} />
      </motion.button>
    </motion.div>
  );
};

export default DeviceToggle;
