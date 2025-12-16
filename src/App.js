import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

// Components
import Header from "./components/Header";
import DeviceToggle from "./components/DeviceToggle";
import ScheduleGrid from "./components/ScheduleGrid";
import CategoryFilter from "./components/CategoryFilter";
import CampCard from "./components/CampCard";
import CampDetailModal from "./components/CampDetailModal";
import AddCampModal from "./components/AddCampModal";

// Supabase
import { fetchCamps, addCamp, subscribeToCamps } from "./supabaseClient";

// Utils
import { WEEKS, ANIMATION_VARIANTS } from "./utils/constants";
import { calculateTotalPrice } from "./utils/helpers";

function App() {
  // ==========================================
  // 狀態管理
  // ==========================================
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [schedule, setSchedule] = useState({ 2: null, 3: null });
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState("mobile");
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // ==========================================
  // 資料載入 (從 Supabase)
  // ==========================================
  useEffect(() => {
    loadCamps();

    // 訂閱即時更新
    const unsubscribe = subscribeToCamps(() => {
      console.log("Camps data changed, reloading...");
      loadCamps();
    });

    return unsubscribe;
  }, []);

  /**
   * 從 Supabase 載入營隊資料
   */
  const loadCamps = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCamps();
      setCamps(data);
    } catch (err) {
      setError(err.message);
      console.error("Failed to load camps:", err);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 營隊篩選
  // ==========================================
  const filteredCamps = useMemo(() => {
    if (activeCategory === "All") return camps;
    return camps.filter((camp) => camp.category === activeCategory);
  }, [camps, activeCategory]);

  // ==========================================
  // 計算總價
  // ==========================================
  const totalPrice = useMemo(() => {
    return calculateTotalPrice(schedule);
  }, [schedule]);

  // ==========================================
  // 事件處理函數
  // ==========================================

  /**
   * 切換營隊加入排程
   */
  const handleToggleCamp = (camp, weekId) => {
    setSchedule((prev) => ({
      ...prev,
      [weekId]: prev[weekId]?.id === camp.id ? null : camp,
    }));
  };

  /**
   * 從週次移除營隊
   */
  const handleRemoveCamp = (weekId) => {
    setSchedule((prev) => ({
      ...prev,
      [weekId]: null,
    }));
  };

  /**
   * 新增自訂營隊
   */
  const handleAddCamp = async (campData) => {
    try {
      const newCamp = await addCamp(campData);
      setCamps((prev) => [...prev, newCamp]);
    } catch (error) {
      console.error("Failed to add camp:", error);
      alert("新增失敗，請稍後再試");
    }
  };

  // ==========================================
  // 容器樣式
  // ==========================================
  const wrapperClass =
    viewMode === "mobile"
      ? "w-[393px] mx-auto border-[12px] border-slate-900 rounded-[50px] shadow-2xl overflow-hidden h-[852px] relative bg-white ring-4 ring-slate-300/50"
      : "min-h-screen bg-white";

  // ==========================================
  // 載入狀態
  // ==========================================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-slate-600 font-medium">載入營隊資料中...</p>
        </motion.div>
      </div>
    );
  }

  // ==========================================
  // 錯誤狀態
  // ==========================================
  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 mb-2">載入失敗</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={loadCamps}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
          >
            重新載入
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // 主要渲染
  // ==========================================
  return (
    <div
      className={`bg-slate-100 font-sans text-slate-800 ${
        viewMode === "desktop"
          ? "min-h-screen"
          : "py-10 flex items-center justify-center min-h-screen"
      }`}
    >
      {/* Device Toggle */}
      <DeviceToggle viewMode={viewMode} setViewMode={setViewMode} />

      {/* Main Container */}
      <motion.div
        className={`${wrapperClass} flex flex-col transition-all duration-300`}
        initial="hidden"
        animate="visible"
        variants={ANIMATION_VARIANTS.fadeIn}
      >
        {/* iPhone Notch */}
        {viewMode === "mobile" && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 h-8 w-[120px] bg-black rounded-full z-50 pointer-events-none" />
        )}

        {/* Header */}
        <Header totalPrice={totalPrice} viewMode={viewMode} />

        {/* Main Content */}
        <main
          className={`flex-1 overflow-y-auto p-4 flex flex-col gap-6 ${
            viewMode === "mobile"
              ? "scrollbar-thin"
              : "max-w-6xl mx-auto w-full p-6"
          }`}
        >
          {/* Week Cards Section */}
          <motion.section
            className={`grid gap-4 ${
              viewMode === "mobile"
                ? "grid-cols-1"
                : "grid-cols-1 md:grid-cols-2"
            }`}
            variants={ANIMATION_VARIANTS.staggerContainer}
          >
            {WEEKS.map((week) => (
              <ScheduleGrid
                key={week.id}
                week={week}
                camp={schedule[week.id]}
                onRemove={() => handleRemoveCamp(week.id)}
                onShowDetails={() => setSelectedCamp(schedule[week.id])}
                viewMode={viewMode}
              />
            ))}
          </motion.section>

          {/* Camp Selection Section */}
          <motion.section variants={ANIMATION_VARIANTS.slideUp}>
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-700">選擇營隊</h2>
                <motion.button
                  onClick={() => setIsAddModalOpen(true)}
                  className="ml-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={12} />
                  自訂
                </motion.button>
              </div>

              {/* Category Filter */}
              <CategoryFilter
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>

            {/* Camp Cards Grid */}
            <motion.div
              className={`grid gap-3 ${
                viewMode === "mobile"
                  ? "grid-cols-1"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              }`}
              variants={ANIMATION_VARIANTS.staggerContainer}
            >
              <AnimatePresence mode="popLayout">
                {filteredCamps.map((camp) => (
                  <CampCard
                    key={camp.id}
                    camp={camp}
                    schedule={schedule}
                    onToggle={handleToggleCamp}
                    onShowDetails={() => setSelectedCamp(camp)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {filteredCamps.length === 0 && (
              <motion.div
                className="text-center py-8 text-slate-400 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                沒有符合「{activeCategory}」類別的營隊
              </motion.div>
            )}
          </motion.section>
        </main>

        {/* Home Indicator (iPhone) */}
        {viewMode === "mobile" && (
          <div className="h-1 w-1/3 bg-slate-900 rounded-full mx-auto mb-3 opacity-20" />
        )}
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {selectedCamp && (
          <CampDetailModal
            camp={selectedCamp}
            onClose={() => setSelectedCamp(null)}
          />
        )}
        {isAddModalOpen && (
          <AddCampModal
            onClose={() => setIsAddModalOpen(false)}
            onAdd={handleAddCamp}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
