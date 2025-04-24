// 基础工作记录类型（不含 ID）
export interface WorkRecordBase {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  description: string;
  hours: number;
  user_id?: string; // 可选，仅在与服务器交互时使用
}

// 创建新记录时使用的类型 (不含 ID)
export type NewWorkRecord = WorkRecordBase;

// 完整工作记录类型 (包含 ID)
export interface WorkRecord extends WorkRecordBase {
  id: string; // 已有记录必须有 ID
} 