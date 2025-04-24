import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WorkRecord, NewWorkRecord } from '@/types/WorkRecord';
import { supabase, WORK_RECORDS_TABLE, isSupabaseConfigured } from '@/utils/supabase';
import { transformApiToLocal, transformLocalToApi } from '@/utils/dataTransform';

// 工作记录的 localStorage 键名
const STORAGE_KEY = 'workRecords';

// 排除的字段 - 这些字段不会在转换过程中被包含
const EXCLUDED_API_FIELDS = ['created_at', 'updated_at'];
const EXCLUDED_LOCAL_FIELDS = ['user_id'];

interface WorkRecordState {
  // 工作记录数据
  records: WorkRecord[];
  
  // 加载状态
  isLoading: boolean;
  error: string | null;
  
  // 操作方法
  fetchRecords: () => Promise<void>;
  addRecord: (record: NewWorkRecord) => Promise<void>;
  updateRecord: (record: WorkRecord) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
}

export const useWorkRecordStore = create<WorkRecordState>()(
  persist(
    (set, get) => ({
      records: [],
      isLoading: false,
      error: null,
      
      // 获取记录
      fetchRecords: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // 检查是否可以使用 Supabase
          if (isSupabaseConfigured()) {
            // 检查当前用户登录状态
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session) {
              // 从 Supabase 获取数据
              const { data, error } = await supabase
                .from(WORK_RECORDS_TABLE)
                .select('*')
                .order('start_date', { ascending: false });
                
              if (error) {
                throw error;
              }
              
              if (data) {
                // 转换为本地格式
                const localRecords = data.map(record => {
                  // 先转换为本地格式（将字段名从下划线改为驼峰）
                  const localData = transformApiToLocal(record as Record<string, unknown>, EXCLUDED_API_FIELDS);
                  // 转换为 WorkRecord 类型
                  return localData as unknown as WorkRecord;
                });
                
                // 更新状态
                set({ records: localRecords, isLoading: false });
                
                // 同步到 localStorage
                localStorage.setItem(STORAGE_KEY, JSON.stringify(localRecords));
                return;
              }
            }
          }
          
          // 如果无法从 Supabase 获取，则从 localStorage 获取数据
          const savedRecords = localStorage.getItem(STORAGE_KEY);
          const records = savedRecords ? JSON.parse(savedRecords) : [];
          set({ records, isLoading: false });
        } catch (error) {
          console.error('获取记录时出错:', error);
          
          // 出错时尝试从 localStorage 获取数据
          const savedRecords = localStorage.getItem(STORAGE_KEY);
          const records = savedRecords ? JSON.parse(savedRecords) : [];
          
          set({ 
            records, 
            isLoading: false, 
            error: error instanceof Error ? error.message : '获取记录时出错'
          });
        }
      },
      
      // 添加记录
      addRecord: async (record: NewWorkRecord) => {
        try {
          // 如果可以使用 Supabase，则同步到数据库
          if (isSupabaseConfigured()) {
            // 检查用户是否已登录
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session) {
              // 转换为 Supabase 格式
              const convertedData = transformLocalToApi(record as unknown as Record<string, unknown>, EXCLUDED_LOCAL_FIELDS);
              
              // 添加用户ID
              const supabaseRecord = {
                ...convertedData,
                user_id: session.user.id
              };
              
              // 先尝试向 Supabase 添加记录并获取返回的数据
              const { data, error } = await supabase
                .from(WORK_RECORDS_TABLE)
                .insert(supabaseRecord)
                .select();
                
              if (error) {
                throw error;
              }
              
              // 使用 Supabase 返回的记录（包含自动生成的UUID）
              if (data && data.length > 0) {
                // 转换为本地格式
                const localData = transformApiToLocal(data[0] as Record<string, unknown>, EXCLUDED_API_FIELDS);
                const returnedRecord = localData as unknown as WorkRecord;
                
                // 获取当前记录
                const currentRecords = get().records;
                // 将新记录添加到记录列表开头
                const updatedRecords = [returnedRecord, ...currentRecords];
                
                // 更新状态和 localStorage
                set({ records: updatedRecords });
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
                return;
              }
            }
          }
          
          // 如果不能使用 Supabase 或用户未登录，使用本地 ID
          const recordWithLocalId: WorkRecord = {
            ...record,
            id: Date.now().toString()
          };
          
          // 获取当前记录
          const currentRecords = get().records;
          // 将新记录添加到记录列表开头
          const updatedRecords = [recordWithLocalId, ...currentRecords];
          
          // 更新状态和 localStorage
          set({ records: updatedRecords });
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
        } catch (error) {
          console.error('添加记录时出错:', error);
          // 错误处理 - 由于已经更新了 localStorage，所以这里不需要回滚
          set({ error: error instanceof Error ? error.message : '添加记录时出错' });
        }
      },
      
      // 更新记录
      updateRecord: async (record: WorkRecord) => {
        try {
          // 获取当前记录
          const currentRecords = get().records;
          // 更新记录
          const updatedRecords = currentRecords.map(r => 
            r.id === record.id ? record : r
          );
          
          // 先更新状态和 localStorage
          set({ records: updatedRecords });
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
          
          // 如果可以使用 Supabase，则同步到数据库
          if (isSupabaseConfigured()) {
            // 检查用户是否已登录
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session) {
              // 转换为 Supabase 格式，排除 id 字段(因为 id 直接用于 eq 条件)
              const convertedData = transformLocalToApi(
                record as unknown as Record<string, unknown>,
                [...EXCLUDED_LOCAL_FIELDS, 'id']
              );
              
              const { error } = await supabase
                .from(WORK_RECORDS_TABLE)
                .update(convertedData)
                .eq('id', record.id)
                .eq('user_id', session.user.id);
                
              if (error) {
                throw error;
              }
            }
          }
        } catch (error) {
          console.error('更新记录时出错:', error);
          set({ error: error instanceof Error ? error.message : '更新记录时出错' });
        }
      },
      
      // 删除记录
      deleteRecord: async (id: string) => {
        try {
          // 获取当前记录
          const currentRecords = get().records;
          // 过滤掉要删除的记录
          const updatedRecords = currentRecords.filter(r => r.id !== id);
          
          // 先更新状态和 localStorage
          set({ records: updatedRecords });
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
          
          // 如果可以使用 Supabase，则同步到数据库
          if (isSupabaseConfigured()) {
            // 检查用户是否已登录
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session) {
              const { error } = await supabase
                .from(WORK_RECORDS_TABLE)
                .delete()
                .eq('id', id)
                .eq('user_id', session.user.id);
                
              if (error) {
                throw error;
              }
            }
          }
        } catch (error) {
          console.error('删除记录时出错:', error);
          set({ error: error instanceof Error ? error.message : '删除记录时出错' });
        }
      }
    }),
    {
      name: 'work-records-storage',
      partialize: (state) => ({ records: state.records }),
    }
  )
); 