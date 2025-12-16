import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Award, Activity, Trophy, Music, FileText } from "lucide-react";

const CATEGORIES = [
  { id: "All", label: "全部", icon: Award },
  { id: "Sport", label: "運動", icon: Activity },
  { id: "Horse", label: "騎馬", icon: Trophy },
  { id: "Dance", label: "街舞", icon: Activity },
  { id: "Music", label: "音樂", icon: Music },
  { id: "General", label: "綜合", icon: FileText },
];

const DEFAULT_CAMP_DETAILS = {
  desc: "自訂營隊",
  highlights: ["使用者新增"],
  scheduleType: "grid",
  gridHeader: ["項目", "內容"],
  grid: [{ time: "備註", d1: "使用者自行新增的營隊行程" }],
};

const generateUniqueId = (prefix = "custom") => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const AddCampModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: "",
    org: "",
    location: "",
    price: "",
    price_label: "",
    category: "General",
    days_text: "5天 (一至五)",
    weeks: [2],
    url: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newCamp = {
        id: generateUniqueId("custom"),
        ...formData,
        price: Number(formData.price),
        price_label: formData.price_label || `$${formData.price}`,
        day_indices: [0, 1, 2, 3, 4],
        available_weeks: formData.weeks,
        color: "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300",
        icon: "✨",
        details: DEFAULT_CAMP_DETAILS,
      };

      await onAdd(newCamp);
      onClose();
    } catch (error) {
      console.error("Error adding camp:", error);
      alert("新增失敗，請稍後再試");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleWeek = (weekId) => {
    setFormData((prev) => ({
      ...prev,
      weeks: prev.weeks.includes(weekId)
        ? prev.weeks.filter((w) => w !== weekId)
        : [...prev.weeks, weekId],
    }));
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-xl text-slate-800">新增自訂營隊</h3>
            <motion.button
              onClick={onClose}
              className="bg-slate-100 p-2 rounded-full hover:bg-slate-200"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={20} />
            </motion.button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="營隊名稱"
              required
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                label="單位"
                required
                value={formData.org}
                onChange={(e) => updateField("org", e.target.value)}
              />
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  類別
                </label>
                <select
                  className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.category}
                  onChange={(e) => updateField("category", e.target.value)}
                >
                  {CATEGORIES.filter((c) => c.id !== "All").map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                label="價格 (數字)"
                type="number"
                required
                value={formData.price}
                onChange={(e) => updateField("price", e.target.value)}
              />
              <FormField
                label="地點"
                required
                value={formData.location}
                onChange={(e) => updateField("location", e.target.value)}
              />
            </div>

            <FormField
              label="報名連結 (選填)"
              type="url"
              value={formData.url}
              onChange={(e) => updateField("url", e.target.value)}
            />

            {/* Week Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2">
                可報名梯次
              </label>
              <div className="flex gap-3">
                {[2, 3].map((w, idx) => (
                  <motion.button
                    key={w}
                    type="button"
                    onClick={() => toggleWeek(w)}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-colors ${
                      formData.weeks.includes(w)
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-slate-400 border-slate-200"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Week {idx + 1}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold mt-2 shadow-lg shadow-slate-200 hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={!isSubmitting ? { scale: 1.02 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            >
              {isSubmitting ? "新增中..." : "確認新增"}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const FormField = ({ label, required, type = "text", value, onChange }) => {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 mb-1">
        {label}
      </label>
      <input
        required={required}
        type={type}
        className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default AddCampModal;
