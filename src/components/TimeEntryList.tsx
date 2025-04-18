import React, { useMemo, memo } from 'react';
import { List, Typography, Card, Tooltip, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { TimeEntry } from '../types';
import { HOURS_PER_DAY } from '../utils/timeUtils';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

interface TimeEntryListProps {
  entries: TimeEntry[];
  onDelete: (id: string) => void;
  onEdit: (entry: TimeEntry) => void;
  showAsDays: boolean;
}

// 使用memo减少不必要的重渲染
const TimeEntryList: React.FC<TimeEntryListProps> = memo(({ entries, onDelete, onEdit, showAsDays }) => {
  const { t, i18n } = useTranslation();
  
  // 使用useMemo缓存格式化函数，只在语言变化时重新创建
  const formatters = useMemo(() => {
    const locale = i18n.language === 'zh-CN' ? 'zh-CN' : 'en-US';
    
    const formatDate = (dateStr: string): string => {
      const date = new Date(dateStr);
      return date.toLocaleDateString(locale, {
        month: '2-digit',
        day: '2-digit'
      });
    };

    const formatTime = (dateStr: string): string => {
      const date = new Date(dateStr);
      return date.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: i18n.language !== 'zh-CN'
      });
    };

    const formatTimeRange = (startTime: string, endTime: string): string => {
      return `${formatTime(startTime)} - ${formatTime(endTime || '')}`;
    };
    
    return {
      formatDate,
      formatTime,
      formatTimeRange
    };
  }, [i18n.language]);

  // 预定义空状态文本
  const emptyText = useMemo(() => t('entries.noEntries', 'No entries yet'), [t]);

  // 卡片样式缓存
  const cardBodyStyle = useMemo(() => ({ 
    body: { padding: '0.75rem 0.75rem' } 
  }), []);

  return (
    <List
      dataSource={entries}
      locale={{ emptyText }}
      renderItem={(entry) => (
        <List.Item
          key={entry.id}
          className="py-1 w-full"
        >
          <Card 
            className="w-full"
            styles={cardBodyStyle}
            size="small"
            actions={[
              <Tooltip title={t('entries.edit')} key="edit">
                <EditOutlined key="edit" onClick={() => onEdit(entry)} />
              </Tooltip>,
              <Tooltip title={t('entries.delete')} key="delete">
                <DeleteOutlined key="delete" onClick={() => onDelete(entry.id)} />
              </Tooltip>
            ]}
          >
            <div className="flex">
              {/* 左侧：工时和时间 */}
              <div className="flex flex-col mr-4">
                {/* 工时时长（突出显示）*/}
                <div className="inline-flex items-end mb-1">
                  <Text strong className="text-2xl md:text-3xl text-blue-600 font-bold mr-1">
                    {showAsDays 
                      ? (entry.duration / 60 / HOURS_PER_DAY).toFixed(1)
                      : (entry.duration / 60).toFixed(1)
                    }
                  </Text>
                  <Text type="secondary" className="text-xs">
                    {showAsDays ? t('stats.daysUnit') : t('stats.hoursUnit')}
                  </Text>
                </div>
                
                {/* 时间范围（弱化显示）*/}
                <Text type="secondary" className="text-xs opacity-60">
                  {formatters.formatTimeRange(entry.startTime, entry.endTime || '')}
                </Text>
                
                {/* 日期标签 */}
                <Tag color="default" className="text-xs mt-1 rounded-sm opacity-70 w-fit">
                  {formatters.formatDate(entry.startTime)}
                </Tag>
              </div>
              
              {/* 右侧：工作内容 */}
              <div className="flex-1">
                <Paragraph 
                  ellipsis={{ rows: 2, expandable: true, symbol: t('entries.more') }}
                  className="mb-0 text-base w-full"
                >
                  {entry.description}
                </Paragraph>
              </div>
            </div>
          </Card>
        </List.Item>
      )}
    />
  );
});

// 添加显示名称以方便调试
TimeEntryList.displayName = 'TimeEntryList';

export default TimeEntryList; 