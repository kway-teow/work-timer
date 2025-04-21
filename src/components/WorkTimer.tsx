import React, { useState, useCallback } from 'react';
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
import { WorkRecord } from '@/types/WorkRecord';
import { useConfigStore } from '@/store/configStore';

dayjs.extend(isBetween);

// 全局最小宽度，用于一致的显示效果
const MIN_WIDTH = '320px';

// 工作记录的 localStorage 键名
const STORAGE_KEY = 'workRecords';

const WorkTimer: React.FC = () => {
  const { t } = useTranslation();
  
  // 从 Zustand store 获取配置状态
  const { showChart, showTimeline } = useConfigStore();
  
  // 初始化时直接从localStorage读取
  const initialRecords = (() => {
    try {
      const savedRecords = localStorage.getItem(STORAGE_KEY);
      return savedRecords ? JSON.parse(savedRecords) : [];
    } catch (error) {
      console.error('加载保存的记录时出错:', error);
      return [];
    }
  })();

  // 使用原始的useState，但不直接暴露setRecords
  const [records, setRecordsState] = useState<WorkRecord[]>(initialRecords);
  
  // 创建一个包装过的setRecords函数，同时更新state和localStorage
  const setRecords = useCallback((newRecords: WorkRecord[] | ((prev: WorkRecord[]) => WorkRecord[])) => {
    // 处理函数参数情况
    setRecordsState(prevRecords => {
      const nextRecords = typeof newRecords === 'function' 
        ? newRecords(prevRecords) 
        : newRecords;
      
      // 保存到localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRecords));
      
      return nextRecords;
    });
  }, []);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WorkRecord | null>(null);
  const [isCopying, setIsCopying] = useState(false); // 标记是否是复制操作

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
        // 复制的新记录
        setIsCopying(true);
        setEditingRecord(record);
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
  const handleSubmit = (record: WorkRecord) => {
    if (editingRecord && !isCopying) {
      // 更新现有记录
      setRecords(
        records.map((r) => (r.id === editingRecord.id ? record : r))
      );
      message.success(t('recordUpdated'));
    } else {
      // 添加新记录或复制的记录
      setRecords([record, ...records]);
      message.success(isCopying ? t('recordCopied') : t('recordAdded'));
    }
    setIsModalVisible(false);
    setEditingRecord(null);
    setIsCopying(false);
  };

  // 删除记录
  const deleteRecord = (id: string) => {
    Modal.confirm({
      title: t('confirmDelete'),
      content: t('confirmDeleteMessage'),
      okText: t('confirm'),
      cancelText: t('cancel'),
      onOk: () => {
        setRecords(records.filter((record) => record.id !== id));
        message.success(t('recordDeleted'));
      },
    });
  };

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
            onDelete={deleteRecord}
          />
        ) : (
          <RecordsView
            records={records}
            onEdit={showModal}
            onDelete={deleteRecord}
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