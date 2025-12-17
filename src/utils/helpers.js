/**
 * 計算營隊時段標籤（全日 / 半日）
 */
export const getDurationTag = (camp) => {
  const details = camp.details || {};
  const grids = [details.grid, details.gridWeek1, details.gridWeek2]
    .filter(Boolean)
    .flat();
  
  for (const row of grids) {
    // 檢查是否有下午時段
    if (row.time && (
      parseInt(row.time) >= 13 || 
      row.time.includes('13:') || 
      row.time.includes('14:') || 
      row.time.includes('15:') || 
      row.time.includes('16:')
    )) {
      return '全';
    }
    
    // 檢查是否包含午餐
    const rowStr = JSON.stringify(row).toLowerCase();
    if (rowStr.includes('lunch') || rowStr.includes('午餐')) {
      return '全';
    }
  }
  
  return '半';
};

/**
 * 從顏色類別中提取背景色
 */
export const extractBgColor = (colorClass) => {
  if (!colorClass) return 'bg-gray-100';
  const match = colorClass.match(/bg-[\w-]+/);
  return match ? match[0] : 'bg-gray-100';
};

/**
 * 格式化價格顯示
 */
export const formatPrice = (price) => {
  if (!price) return '$0';
  return `$${price.toLocaleString()}`;
};

/**
 * 檢查營隊是否在特定週次開課
 */
export const isCampAvailableInWeek = (camp, weekId) => {
  return camp.available_weeks?.includes(weekId) || false;
};

/**
 * 生成唯一 ID
 */
export const generateUniqueId = (prefix = 'custom') => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 深度複製物件
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};