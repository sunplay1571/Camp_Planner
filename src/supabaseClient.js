import { createClient } from "@supabase/supabase-js";

// ⚠️ 請填寫您的 Supabase 專案資訊
// 可以在 Supabase Dashboard > Settings > API 找到這些資訊

const supabaseUrl = "https://rkpvskepakfuigvljqii.supabase.co"; // 例如: https://xxxxx.supabase.co
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrcHZza2VwYWtmdWlndmxqcWlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMzkwODgsImV4cCI6MjA4MDkxNTA4OH0.TVXDnPtpAfqmlHh69l4ixfODTteOszCY2r3Hyy_b7tU"; // 您的 anon/public key

// 建立 Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==========================================
// 資料庫操作函數
// ==========================================

/**
 * 從 Supabase 獲取所有營隊資料
 * @returns {Promise<Array>} 營隊資料陣列
 */
export const fetchCamps = async () => {
  try {
    const { data, error } = await supabase
      .from("camps")
      .select("*")
      .order("category", { ascending: true });

    if (error) throw error;

    // 確保 details 欄位被正確解析
    return data.map((camp) => ({
      ...camp,
      details:
        typeof camp.details === "string"
          ? JSON.parse(camp.details)
          : camp.details,
    }));
  } catch (error) {
    console.error("Error fetching camps:", error);
    throw error;
  }
};

/**
 * 新增自訂營隊
 * @param {Object} campData - 營隊資料
 * @returns {Promise<Object>} 新增的營隊資料
 */
export const addCamp = async (campData) => {
  try {
    const { data, error } = await supabase
      .from("camps")
      .insert([campData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error adding camp:", error);
    throw error;
  }
};

/**
 * 刪除營隊
 * @param {string} campId - 營隊 ID
 */
export const deleteCamp = async (campId) => {
  try {
    const { error } = await supabase.from("camps").delete().eq("id", campId);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting camp:", error);
    throw error;
  }
};

/**
 * 儲存使用者的排程
 * @param {string} userId - 使用者 ID
 * @param {Object} scheduleData - 排程資料 { week2: campId, week3: campId }
 */
export const saveUserSchedule = async (userId, scheduleData) => {
  try {
    const { data, error } = await supabase
      .from("user_schedules")
      .upsert({
        user_id: userId,
        schedule_data: scheduleData,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving schedule:", error);
    throw error;
  }
};

/**
 * 載入使用者的排程
 * @param {string} userId - 使用者 ID
 * @returns {Promise<Object>} 排程資料
 */
export const loadUserSchedule = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("user_schedules")
      .select("schedule_data")
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // 找不到資料，回傳空排程
        return { 2: null, 3: null };
      }
      throw error;
    }

    return data.schedule_data || { 2: null, 3: null };
  } catch (error) {
    console.error("Error loading schedule:", error);
    return { 2: null, 3: null };
  }
};

/**
 * 訂閱營隊資料變更（即時同步）
 * @param {Function} callback - 當資料變更時的回調函數
 * @returns {Function} 取消訂閱的函數
 */
export const subscribeToCamps = (callback) => {
  const subscription = supabase
    .channel("camps-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "camps" },
      callback
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
};
