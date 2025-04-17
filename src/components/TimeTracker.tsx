import React, { useState, useEffect } from 'react';
import { Layout, Typography, Button, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import TimeEntryForm from './TimeEntryForm';
import TimeEntryList from './TimeEntryList';
import TimeStats from './TimeStats';
import LanguageSwitcher from './LanguageSwitcher';
import { TimeEntry, TimeStats as TimeStatsType } from '../types';
import { getStartOfWeek, getStartOfMonth, calculateStats } from '../utils/timeUtils';

const { Content } = Layout;
const { Title } = Typography;

const TimeTracker: React.FC = () => {
  const { t } = useTranslation();
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<TimeStatsType>({
    totalHours: 0,
    totalDays: 0,
    entries: []
  });
  const [monthlyStats, setMonthlyStats] = useState<TimeStatsType>({
    totalHours: 0,
    totalDays: 0,
    entries: []
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showAsDays, setShowAsDays] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);

  // Load entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('timeEntries');
    if (savedEntries) {
      try {
        setEntries(JSON.parse(savedEntries));
      } catch (error) {
        console.error('Error loading saved entries:', error);
      }
    }
  }, []);

  // Update stats whenever entries change
  useEffect(() => {
    if (entries.length > 0) {
      // Save to localStorage
      localStorage.setItem('timeEntries', JSON.stringify(entries));
      
      // Calculate stats
      setWeeklyStats(calculateStats(entries, getStartOfWeek()));
      setMonthlyStats(calculateStats(entries, getStartOfMonth()));
    }
  }, [entries]);

  const handleAddEntry = (entry: TimeEntry) => {
    if (editingEntry) {
      // Update existing entry
      setEntries(prevEntries => 
        prevEntries.map(e => e.id === entry.id ? entry : e)
      );
      message.success(t('form.editSuccess'));
    } else {
      // Add new entry
      setEntries(prevEntries => [entry, ...prevEntries]);
      message.success(t('form.success'));
    }
    
    setIsModalVisible(false);
    setEditingEntry(null);
  };

  const handleEditEntry = (entry: TimeEntry) => {
    setEditingEntry(entry);
    setIsModalVisible(true);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
    message.success(t('entries.deleteSuccess'));
  };

  const showModal = () => {
    setEditingEntry(null);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingEntry(null);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={2}>{t('appTitle')}</Title>
          <LanguageSwitcher />
        </div>

        <TimeStats 
          weeklyStats={weeklyStats} 
          monthlyStats={monthlyStats} 
          showAsDays={showAsDays}
          setShowAsDays={setShowAsDays}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={4}>{t('entries.timeRecords')}</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={showModal}
          >
            {t('form.addEntry')}
          </Button>
        </div>

        <TimeEntryList 
          entries={entries} 
          onDelete={handleDeleteEntry}
          onEdit={handleEditEntry}
          showAsDays={showAsDays}
        />

        <Modal
          title={editingEntry ? t('form.editEntry') : t('form.addEntry')}
          open={isModalVisible}
          footer={null}
          onCancel={handleCancel}
          destroyOnClose={true}
        >
          <TimeEntryForm 
            onSubmit={handleAddEntry} 
            initialValues={editingEntry}
          />
        </Modal>
      </Content>
    </Layout>
  );
};

export default TimeTracker; 