import { TimeEntry, TimeStats } from '@/types';

export const HOURS_PER_DAY = 7;

// 计算两个时间之间的分钟数
export const calculateDuration = (startTime: string, endTime: string): number => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  // 处理隔夜情况 - 如果结束时间早于开始时间，则假定为第二天
  let diff = end.getTime() - start.getTime();
  if (diff < 0) {
    // 给结束时间加上24小时
    const nextDayEnd = new Date(end);
    nextDayEnd.setDate(nextDayEnd.getDate() + 1);
    diff = nextDayEnd.getTime() - start.getTime();
  }
  
  return Math.round(diff / (1000 * 60)); // 将毫秒转换为分钟
};

// 获取当前周的开始（周一）
export const getStartOfWeek = (): Date => {
  const now = new Date();
  const day = now.getDay(); // 0是周日，1是周一，以此类推
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // 针对周日进行调整
  const startOfWeek = new Date(now.setDate(diff));
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
};

// 获取当前月份的开始
export const getStartOfMonth = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

// 计算给定时间段的统计数据
export const calculateStats = (entries: TimeEntry[], startDate: Date): TimeStats => {
  const filteredEntries = entries.filter(entry => 
    new Date(entry.startTime) >= startDate || new Date(entry.endTime!) >= startDate
  );
  
  const totalMinutes = filteredEntries.reduce((total, entry) => total + entry.duration, 0);
  const totalHours = totalMinutes / 60;
  const totalDays = totalHours / HOURS_PER_DAY;
  
  return {
    totalHours: parseFloat(totalHours.toFixed(2)),
    totalDays: parseFloat(totalDays.toFixed(2)),
    entries: filteredEntries
  };
};

// 从Date对象格式化时间字符串（HH:MM）
export const formatTimeString = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

// 将时间字符串（HH:MM）解析为Date对象
export const parseTimeString = (timeString: string, baseDate: Date = new Date()): Date => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date(baseDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
}; 