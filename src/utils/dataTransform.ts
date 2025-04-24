/**
 * 工具函数，用于在 Supabase 数据结构与本地应用数据结构之间进行转换
 */

/**
 * 将下划线命名法转换为驼峰命名法
 * 示例: start_date -> startDate
 */
export const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

/**
 * 将驼峰命名法转换为下划线命名法
 * 示例: startDate -> start_date
 */
export const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

/**
 * 自动将 Supabase 记录格式（下划线命名）转换为本地应用格式（驼峰命名）
 */
export const transformApiToLocal = (
  apiData: Record<string, unknown>,
  excludeFields: string[] = []
): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  
  for (const key in apiData) {
    // 跳过排除的字段
    if (excludeFields.includes(key)) continue;
    
    // 将字段名从下划线命名法转换为驼峰命名法
    const camelKey = snakeToCamel(key);
    result[camelKey] = apiData[key];
  }
  
  return result;
};

/**
 * 自动将本地应用格式（驼峰命名）转换为 Supabase 记录格式（下划线命名）
 */
export const transformLocalToApi = (
  localData: Record<string, unknown>,
  excludeFields: string[] = []
): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  
  for (const key in localData) {
    // 跳过排除的字段
    if (excludeFields.includes(key)) continue;
    
    // 将字段名从驼峰命名法转换为下划线命名法
    const snakeKey = camelToSnake(key);
    result[snakeKey] = localData[key];
  }
  
  return result;
}; 