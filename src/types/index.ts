export interface TimeEntry {
  id: string;
  startTime: string; // ISO 字符串
  endTime: string | null; // ISO 字符串
  description: string;
  duration: number; // 持续时间（分钟）
}

export interface TimeStats {
  totalHours: number;
  totalDays: number; // 基于每天7小时计算
  entries: TimeEntry[];
} 