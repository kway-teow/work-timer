import { createClient } from '@supabase/supabase-js';
import type { WorkRecord } from '@/types/WorkRecord';

// 从环境变量中获取 Supabase URL 和匿名密钥
// 你需要在 .env 文件或者托管提供商中设置这些变量
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// 初始化 Supabase 客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 工作记录表名
export const WORK_RECORDS_TABLE = 'work_records';

// 检查 Supabase 是否正确配置
export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

// Supabase 工作记录类型，匹配本地模型结构
export type SupabaseWorkRecord = WorkRecord & {
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Supabase 数据库中的记录格式
export interface SupabaseRecord {
  id: string;
  user_id?: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  description: string;
  hours: number;
  created_at?: string;
  updated_at?: string;
} 