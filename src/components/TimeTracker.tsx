import React, { useState, useEffect } from 'react';
import { Layout, Typography, Button, Modal, message, Grid } from 'antd';
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
const { useBreakpoint } = Grid;

const TimeTracker: React.FC = () => {
  const { t } = useTranslation();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  
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
      <Content style={{ 
        padding: isMobile ? '12px' : '24px', 
        maxWidth: '1200px', 
        margin: '0 auto',
        width: '100%'
      }}>
        <div className={isMobile ? 'mobile-stack' : ''} style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'flex-start' : 'center', 
          marginBottom: isMobile ? 12 : 16 
        }}>
          <Title level={isMobile ? 3 : 2} className={isMobile ? 'mobile-margin-bottom' : ''}>
            {t('appTitle')}
          </Title>
          <LanguageSwitcher />
        </div>

        <TimeStats 
          weeklyStats={weeklyStats} 
          monthlyStats={monthlyStats} 
          showAsDays={showAsDays}
          setShowAsDays={setShowAsDays}
          isMobile={isMobile}
        />

        <div className={isMobile ? 'mobile-stack' : ''} style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'flex-start' : 'center', 
          marginBottom: isMobile ? 12 : 16 
        }}>
          <Title level={4} className={isMobile ? 'mobile-margin-bottom' : ''}>
            {t('entries.timeRecords')}
          </Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={showModal}
            size={isMobile ? 'middle' : 'large'}
          >
            {t('form.addEntry')}
          </Button>
        </div>

        <TimeEntryList 
          entries={entries} 
          onDelete={handleDeleteEntry}
          onEdit={handleEditEntry}
          showAsDays={showAsDays}
          isMobile={isMobile}
        />

        <Modal
          title={editingEntry ? t('form.editEntry') : t('form.addEntry')}
          open={isModalVisible}
          footer={null}
          onCancel={handleCancel}
          destroyOnClose={true}
          width={isMobile ? '95%' : 520}
          style={{ maxWidth: '100vw', margin: isMobile ? '10px auto' : '100px auto' }}
          bodyStyle={{ padding: isMobile ? '12px' : '24px' }}
        >
          <TimeEntryForm 
            onSubmit={handleAddEntry} 
            initialValues={editingEntry}
            isMobile={isMobile}
          />
        </Modal>
      </Content>
    </Layout>
  );
};

export default TimeTracker; 