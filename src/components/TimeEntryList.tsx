import React from 'react';
import { List, Typography, Card, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { TimeEntry } from '../types';
import { HOURS_PER_DAY } from '../utils/timeUtils';

const { Text, Paragraph } = Typography;

interface TimeEntryListProps {
  entries: TimeEntry[];
  onDelete: (id: string) => void;
  onEdit: (entry: TimeEntry) => void;
  showAsDays: boolean;
}

const TimeEntryList: React.FC<TimeEntryListProps> = ({ entries, onDelete, onEdit, showAsDays }) => {
  const { t } = useTranslation();

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatTime = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatTimeRange = (startTime: string, endTime: string): string => {
    return `${formatTime(startTime)} - ${formatTime(endTime || '')}`;
  };

  const formatDuration = (minutes: number): string => {
    if (showAsDays) {
      const days = minutes / 60 / HOURS_PER_DAY;
      return `${days.toFixed(1)} ${t('stats.daysUnit')}`;
    } else {
      const hours = minutes / 60;
      return `${hours.toFixed(1)} ${t('stats.hoursUnit')}`;
    }
  };

  return (
    <List
      dataSource={entries}
      renderItem={(entry) => (
        <List.Item
          key={entry.id}
          style={{ padding: '8px 0' }}
        >
          <Card 
            style={{ width: '100%' }}
            bodyStyle={{ padding: '16px' }}
            actions={[
              <Tooltip title={t('entries.edit')} key="edit">
                <EditOutlined key="edit" onClick={() => onEdit(entry)} />
              </Tooltip>,
              <Tooltip title={t('entries.delete')} key="delete">
                <DeleteOutlined key="delete" onClick={() => onDelete(entry.id)} />
              </Tooltip>
            ]}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                <Text type="secondary">{formatDate(entry.startTime)}</Text>
                <Text strong>{formatTimeRange(entry.startTime, entry.endTime || '')}</Text>
                <Paragraph 
                  ellipsis={{ rows: 1, expandable: true, symbol: t('entries.more') }}
                  style={{ marginBottom: 0, textAlign: 'left' }}
                >
                  {entry.description}
                </Paragraph>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginLeft: '12px' }}>
                <Text strong style={{ fontSize: '16px' }}>
                  {formatDuration(entry.duration)}
                </Text>
              </div>
            </div>
          </Card>
        </List.Item>
      )}
    />
  );
};

export default TimeEntryList; 