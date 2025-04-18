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
import { WorkRecord } from '../types/WorkRecord';

dayjs.extend(isBetween);

// Global minimum width for consistent display
const MIN_WIDTH = '320px';

const WorkTimer: React.FC = () => {
  const { t } = useTranslation();
  const [records, setRecords] = useState<WorkRecord[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WorkRecord | null>(null);
  const [showInDays, setShowInDays] = useState(false);
  const [hoursPerDay, setHoursPerDay] = useState(7); // Default: 7 hours per day
  const [showChart, setShowChart] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  // Load sample data on first render
  useEffect(() => {
    const sampleRecords: WorkRecord[] = [
      {
        id: '1',
        startDate: '2025-04-18',
        startTime: '09:00',
        endDate: '2025-04-18',
        endTime: '18:00',
        description: '完成产品设计文档和用户调研报告',
        hours: 9,
      },
      {
        id: '2',
        startDate: '2025-04-17',
        startTime: '10:00',
        endDate: '2025-04-17',
        endTime: '19:30',
        description: '参加项目启动会议，准备产品原型',
        hours: 9.5,
      },
      {
        id: '3',
        startDate: '2025-04-16',
        startTime: '14:00',
        endDate: '2025-04-16',
        endTime: '22:00',
        description: '修复用户反馈的界面问题，优化交互流程',
        hours: 8,
      },
      {
        id: '4',
        startDate: '2025-04-15',
        startTime: '21:00',
        endDate: '2025-04-16',
        endTime: '01:30',
        description: '紧急处理线上问题，跨夜加班',
        hours: 4.5,
      },
      {
        id: '5',
        startDate: '2025-04-14',
        startTime: '09:30',
        endDate: '2025-04-14',
        endTime: '18:30',
        description: '进行用户访谈，整理需求文档',
        hours: 9,
      },
    ];
    setRecords(sampleRecords);
  }, []);

  // Open modal for creating or editing record
  const showModal = (record?: WorkRecord) => {
    if (record) {
      setEditingRecord(record);
    } else {
      setEditingRecord(null);
    }
    setIsModalVisible(true);
  };

  // Handle form cancel
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingRecord(null);
  };

  // Handle form submission
  const handleSubmit = (record: WorkRecord) => {
    if (editingRecord) {
      // Update existing record
      setRecords(
        records.map((r) => (r.id === editingRecord.id ? record : r))
      );
      message.success(t('recordUpdated'));
    } else {
      // Add new record
      setRecords([record, ...records]);
      message.success(t('recordAdded'));
    }
    setIsModalVisible(false);
    setEditingRecord(null);
  };

  // Delete record
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

  // Calculate weekly hours
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

  // Calculate monthly hours
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

  const weeklyHours = getWeeklyHours();
  const monthlyHours = getMonthlyHours();

  return (
    <div className="min-h-screen bg-gray-50" style={{ minWidth: MIN_WIDTH }}>
      {/* Header */}
      <Header />
      
      {/* Main content */}
      <div className="pt-16 px-4 pb-24" style={{ minWidth: MIN_WIDTH }}>
        {/* Statistics */}
        <StatisticsCards
          weeklyHours={weeklyHours}
          monthlyHours={monthlyHours}
          showInDays={showInDays}
          setShowInDays={setShowInDays}
          hoursPerDay={hoursPerDay}
          setHoursPerDay={setHoursPerDay}
        />
        
        {/* View selector */}
        <ViewSelector
          showChart={showChart}
          showTimeline={showTimeline}
          setShowChart={setShowChart}
          setShowTimeline={setShowTimeline}
        />
        
        {/* View content based on selection */}
        {showChart ? (
          <WorkChart records={records} />
        ) : showTimeline ? (
          <TimelineView
            records={records}
            showInDays={showInDays}
            onEdit={showModal}
            onDelete={deleteRecord}
            hoursPerDay={hoursPerDay}
          />
        ) : (
          <RecordsView
            records={records}
            showInDays={showInDays}
            onEdit={showModal}
            onDelete={deleteRecord}
            hoursPerDay={hoursPerDay}
          />
        )}
      </div>
      
      {/* Add button */}
      <button
        className="fixed right-4 bottom-4 w-14 h-14 rounded-full bg-blue-500 text-white shadow-lg flex items-center justify-center hover:bg-blue-600 transition-colors rounded-button"
        onClick={() => showModal()}
      >
        <PlusOutlined style={{ fontSize: '24px' }} />
      </button>
      
      {/* Form modal */}
      <WorkRecordForm
        visible={isModalVisible}
        editingRecord={editingRecord}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default WorkTimer; 