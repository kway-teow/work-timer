import React, { useState, useEffect } from 'react';
import { Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import Header from './Header';
import StatisticsCards from './StatisticsCards';
import ViewSelector from './ViewSelector';
import WorkChart from './WorkChart';
import TimelineView from './TimelineView';
import RecordsView from './RecordsView';
import WorkRecordForm from './WorkRecordForm';
import { WorkRecord, NewWorkRecord } from '@/types/WorkRecord';
import { useConfigStore } from '@/store/configStore';
import { useWorkRecords } from '@/hooks/useWorkRecords';

dayjs.extend(isBetween);

// 全局最小宽度，用于一致的显示效果
const MIN_WIDTH = '320px';

const WorkTimer: React.FC = () => {
  const { t } = useTranslation();
  
  // 从 Zustand store 获取配置状态
  const { showChart, showTimeline } = useConfigStore();
  
  // 从 TanStack Query 获取工作记录状态
  const { 
    records, 
    isLoading, 
    error, 
    addRecord: addRecordMutation, 
    updateRecord: updateRecordMutation, 
    deleteRecord: deleteRecordMutation 
  } = useWorkRecords();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WorkRecord | null>(null);
  const [isCopying, setIsCopying] = useState(false); // 标记是否是复制操作

  // 使用 useEffect 处理错误信息
  useEffect(() => {
    if (error) {
      message.error(String(error));
    }
  }, [error]);

  // 计算每周工时
  const getWeeklyHours = () => {
    const now = dayjs();
    const startOfWeek = now.startOf('week');
    const endOfWeek = now.endOf('week');
    return records.reduce((total, record) => {
      const recordDate = dayjs(record.startDate);
      if (recordDate.isBetween(startOfWeek, endOfWeek, null, '[]')) {
        return total + record.hours;
      }
      return total;
    }, 0);
  };

  // 计算每月工时
  const getMonthlyHours = () => {
    const now = dayjs();
    const startOfMonth = now.startOf('month');
    const endOfMonth = now.endOf('month');
    return records.reduce((total, record) => {
      const recordDate = dayjs(record.startDate);
      if (recordDate.isBetween(startOfMonth, endOfMonth, null, '[]')) {
        return total + record.hours;
      }
      return total;
    }, 0);
  };

  // 计算所有记录的总工时
  const getTotalHours = () => {
    return records.reduce((total, record) => total + record.hours, 0);
  };

  const weeklyHours = getWeeklyHours();
  const monthlyHours = getMonthlyHours();
  const totalHours = getTotalHours();

  // 打开创建或编辑记录的对话框
  const showModal = (record?: WorkRecord) => {
    if (record) {
      // 检查是否是已有记录，还是复制的新记录
      const existingRecord = records.find(r => r.id === record.id);
      if (existingRecord) {
        // 编辑现有记录
        setIsCopying(false);
        setEditingRecord(record);
      } else {
        // 复制的新记录 - 创建一个没有 ID 的记录副本
        setIsCopying(true);
        
        // 创建 NewWorkRecord 类型对象 (不含 ID)
        const newRecordCopy: NewWorkRecord = {
          startDate: record.startDate,
          startTime: record.startTime,
          endDate: record.endDate,
          endTime: record.endTime,
          description: record.description,
          hours: record.hours
        };
        
        // 使用类型断言临时转换来设置编辑记录
        setEditingRecord(newRecordCopy as WorkRecord);
      }
    } else {
      // 添加新记录
      setIsCopying(false);
      setEditingRecord(null);
    }
    setIsModalVisible(true);
  };

  // 处理表单取消
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingRecord(null);
    setIsCopying(false);
  };

  // 处理表单提交
  const handleSubmit = async (record: WorkRecord | NewWorkRecord) => {
    if (editingRecord && !isCopying) {
      // 更新现有记录
      updateRecordMutation(record as WorkRecord);
      message.success(t('recordUpdated'));
    } else {
      // 添加新记录或复制的记录
      addRecordMutation(record as NewWorkRecord);
      message.success(isCopying ? t('recordCopied') : t('recordAdded'));
    }
    setIsModalVisible(false);
    setEditingRecord(null);
    setIsCopying(false);
  };

  // 删除记录
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: t('confirmDelete'),
      content: t('confirmDeleteMessage'),
      okText: t('confirm'),
      cancelText: t('cancel'),
      onOk: async () => {
        deleteRecordMutation(id);
        message.success(t('recordDeleted'));
      },
    });
  };

  // 如果正在加载，可以显示加载状态
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">加载中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ minWidth: MIN_WIDTH }}>
      {/* 页头 */}
      <Header />
      
      {/* 主要内容 */}
      <div className="pt-16 px-4 pb-24" style={{ minWidth: MIN_WIDTH }}>
        {/* 统计卡片 */}
        <StatisticsCards
          weeklyHours={weeklyHours}
          monthlyHours={monthlyHours}
          totalHours={totalHours}
          records={records}
        />
        
        {/* 视图选择器 */}
        <ViewSelector />
        
        {/* 基于选择显示内容 */}
        {showChart ? (
          <WorkChart records={records} />
        ) : showTimeline ? (
          <TimelineView
            records={records}
            onEdit={showModal}
            onDelete={handleDelete}
          />
        ) : (
          <RecordsView
            records={records}
            onEdit={showModal}
            onDelete={handleDelete}
          />
        )}
      </div>
      
      {/* 添加按钮 */}
      <button
        className="fixed right-4 bottom-4 w-14 h-14 rounded-full bg-blue-500 text-white shadow-lg flex items-center justify-center hover:bg-blue-600 transition-colors rounded-button"
        aria-label={t('addRecord')}
        onClick={() => showModal()}
      >
        <PlusOutlined style={{ fontSize: '24px' }} />
      </button>

      {/* 表单对话框 */}
      {isModalVisible && (
        <WorkRecordForm
          visible={isModalVisible}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          initialData={editingRecord}
        />
      )}
    </div>
  );
};

export default WorkTimer; 