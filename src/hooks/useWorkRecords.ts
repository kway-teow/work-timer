import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useWorkRecordStore } from '@/store/workRecordStore';
import type { WorkRecord } from '@/types/WorkRecord';

// 定义查询键
const RECORDS_QUERY_KEY = ['workRecords'];

/**
 * 获取工作记录的钩子，使用 TanStack Query 进行数据获取和缓存
 */
export const useWorkRecords = () => {
  const { fetchRecords, addRecord, updateRecord, deleteRecord } = useWorkRecordStore();
  const queryClient = useQueryClient();

  // 获取记录查询
  const recordsQuery = useQuery({
    queryKey: RECORDS_QUERY_KEY,
    queryFn: async () => {
      await fetchRecords();
      return useWorkRecordStore.getState().records;
    },
  });

  // 添加记录突变
  const addRecordMutation = useMutation({
    mutationFn: (record: WorkRecord) => addRecord(record),
    onSuccess: () => {
      // 成功后使查询缓存失效，触发重新获取
      queryClient.invalidateQueries({ queryKey: RECORDS_QUERY_KEY });
    },
  });

  // 更新记录突变
  const updateRecordMutation = useMutation({
    mutationFn: (record: WorkRecord) => updateRecord(record),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECORDS_QUERY_KEY });
    },
  });

  // 删除记录突变
  const deleteRecordMutation = useMutation({
    mutationFn: (id: string) => deleteRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECORDS_QUERY_KEY });
    },
  });

  return {
    // 查询状态和数据
    records: recordsQuery.data || [],
    isLoading: recordsQuery.isLoading,
    isError: recordsQuery.isError,
    error: recordsQuery.error,
    
    // 突变函数
    addRecord: addRecordMutation.mutate,
    updateRecord: updateRecordMutation.mutate,
    deleteRecord: deleteRecordMutation.mutate,
    
    // 突变状态
    isAddingRecord: addRecordMutation.isPending,
    isUpdatingRecord: updateRecordMutation.isPending,
    isDeletingRecord: deleteRecordMutation.isPending,
  };
}; 