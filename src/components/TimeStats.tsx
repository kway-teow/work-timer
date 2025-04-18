import React, { memo } from 'react';
import { Card, Row, Col, Typography, Divider, Segmented } from 'antd';
import { useTranslation } from 'react-i18next';
import { TimeStats as TimeStatsType } from '../types';
import { HOURS_PER_DAY } from '../utils/timeUtils';

const { Text } = Typography;

interface TimeStatsProps {
  weeklyStats: TimeStatsType;
  monthlyStats: TimeStatsType;
  showAsDays: boolean;
  setShowAsDays: React.Dispatch<React.SetStateAction<boolean>>;
}

// 使用memo包装组件以减少不必要的重渲染
const TimeStats: React.FC<TimeStatsProps> = memo(({ 
  weeklyStats, 
  monthlyStats,
  showAsDays,
  setShowAsDays
}) => {
  const { t } = useTranslation();

  const handleTimeUnitChange = (value: string | number) => {
    setShowAsDays(value === 'days');
  };

  return (
    <div className="mb-4 md:mb-6">
      <Card
        title={
          <div className="flex justify-between items-center w-full flex-wrap gap-1">
            <span className="font-medium">
              {t('stats.title')}
            </span>
            <Segmented
              value={showAsDays ? 'days' : 'hours'}
              onChange={handleTimeUnitChange}
              options={[
                { value: 'hours', label: t('stats.hours') },
                { value: 'days', label: t('stats.days') }
              ]}
              size="middle"
              className="text-sm time-unit-switcher"
            />
          </div>
        }
        styles={{ 
          body: { padding: '0.75rem 1rem' },
          header: { padding: '0.75rem 1rem' } 
        }}
        className="w-full"
      >
        <Row gutter={[8, 8]} className="md:gutter-16">
          <Col xs={24} md={12} className="mb-2 md:mb-0">
            <Card 
              type="inner" 
              title={
                <div className="text-center">
                  {t('stats.thisWeek')}
                </div>
              }
              styles={{ 
                body: { padding: '1rem' },
                header: { padding: '0.5rem 1rem' }
              }}
              className="h-full"
            >
              <div className="text-center">
                <div className="inline-flex items-end">
                  <Text className="!text-3xl md:!text-5xl m-0 text-blue-600 font-bold">
                    {showAsDays 
                      ? weeklyStats.totalDays.toFixed(1)
                      : weeklyStats.totalHours.toFixed(1)
                    }
                  </Text>
                  <Text className="text-xs md:text-sm text-gray-500">
                    {showAsDays ? t('stats.daysUnit') : t('stats.hoursUnit')}
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card 
              type="inner" 
              title={
                <div className="text-center">
                  {t('stats.thisMonth')}
                </div>
              }
              styles={{ 
                body: { padding: '1rem' },
                header: { padding: '0.5rem 1rem' }
              }}
              className="h-full"
            >
              <div className="text-center">
                <div className="inline-flex items-end">
                  <Text className="!text-3xl md:!text-5xl m-0 text-blue-600 font-bold">
                    {showAsDays 
                      ? monthlyStats.totalDays.toFixed(1)
                      : monthlyStats.totalHours.toFixed(1)
                    }
                  </Text>
                  <Text className="text-xs md:text-sm text-gray-500">
                    {showAsDays ? t('stats.daysUnit') : t('stats.hoursUnit')}
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        
        <Divider className="my-3" />
        
        <div className="flex justify-center md:justify-end text-center md:text-right">
          <Text type="secondary" className="text-xs md:text-sm">
            {t('stats.dailyWorkHoursSetting')}: {HOURS_PER_DAY}{t('stats.hoursPerDayUnit')}
          </Text>
        </div>
      </Card>
    </div>
  );
});

// 添加显示名称以方便调试
TimeStats.displayName = 'TimeStats';

export default TimeStats; 