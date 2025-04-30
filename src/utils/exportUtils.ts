import { WorkRecord } from '@/types/WorkRecord';
import dayjs from 'dayjs';

/**
 * 将工时记录格式化为CSV字符串，用于复制到剪贴板
 * @param records 工时记录数组
 * @returns 格式化的CSV字符串
 */
export const formatRecordsToCSV = (records: WorkRecord[]): string => {
  // 表头 - 简化为三列
  const headers = ['日期', '工时', '工作内容'];
  
  // 按日期排序 (最新的排在前面)
  const sortedRecords = [...records].sort((a, b) => {
    const dateA = dayjs(`${a.startDate} ${a.startTime}`);
    const dateB = dayjs(`${b.startDate} ${b.startTime}`);
    return dateB.valueOf() - dateA.valueOf();
  });
  
  // 格式化记录为表格行 - 简化为三列
  const rows = sortedRecords.map(record => {
    // 如果开始日期和结束日期相同，只显示一个日期
    const dateDisplay = record.startDate === record.endDate 
      ? dayjs(record.startDate).format('YYYY-MM-DD')
      : `${dayjs(record.startDate).format('YYYY-MM-DD')} 至 ${dayjs(record.endDate).format('YYYY-MM-DD')}`;
    
    return [
      dateDisplay,
      record.hours.toString(),
      record.description.replace(/\n/g, ' ') // 移除换行符，避免在CSV中出现问题
    ];
  });
  
  // 组合表头和数据行
  const csv = [headers, ...rows]
    .map(row => row.join('\t')) // 使用制表符而不是逗号，更适合粘贴到表格中
    .join('\n');
  
  return csv;
};

/**
 * 将文本复制到剪贴板
 * @param text 要复制的文本
 * @returns 成功返回true，失败返回false
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('复制到剪贴板失败:', error);
    return false;
  }
};

/**
 * 将工时记录导出为CSV并复制到剪贴板
 * @param records 工时记录数组
 * @returns 成功返回true，失败返回false
 */
export const exportRecordsToClipboard = async (records: WorkRecord[]): Promise<boolean> => {
  const csv = formatRecordsToCSV(records);
  return await copyToClipboard(csv);
}; 