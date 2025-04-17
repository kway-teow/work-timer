import React from 'react';
import { Card, Row, Col, Typography, Divider, Segmented } from 'antd';
import { useTranslation } from 'react-i18next';
import { TimeStats as TimeStatsType } from '../types';
import { HOURS_PER_DAY } from '../utils/timeUtils';

const { Title, Text } = Typography;

interface TimeStatsProps {
  weeklyStats: TimeStatsType;
  monthlyStats: TimeStatsType;
  showAsDays: boolean;
  setShowAsDays: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile?: boolean;
}

const TimeStats: React.FC<TimeStatsProps> = ({ 
  weeklyStats, 
  monthlyStats,
  showAsDays,
  setShowAsDays,
  isMobile = false
}) => {
  const { t } = useTranslation();

  const handleTimeUnitChange = (value: string | number) => {
    setShowAsDays(value === 'days');
  };

  return (
    <div style={{ marginBottom: isMobile ? 16 : 24 }}>
      <Card
        title={
          <div style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between', 
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: isMobile ? '8px' : undefined 
          }}>
            <span className={isMobile ? 'mobile-margin-bottom' : ''}>
              {t('stats.title')}
            </span>
            <Segmented
              value={showAsDays ? 'days' : 'hours'}
              onChange={handleTimeUnitChange}
              options={[
                { value: 'hours', label: t('stats.hours') },
                { value: 'days', label: t('stats.days') }
              ]}
              size={isMobile ? "small" : "middle"}
            />
          </div>
        }
        bodyStyle={{ padding: isMobile ? '12px' : '24px' }}
        className={isMobile ? 'mobile-full-width' : ''}
      >
        <Row gutter={isMobile ? [8, 8] : [16, 16]}>
          <Col xs={24} sm={24} md={12} className={isMobile ? 'mobile-margin-bottom' : ''}>
            <Card 
              type="inner" 
              title={
                <div style={{ textAlign: 'center' }}>
                  {t('stats.thisWeek')}
                </div>
              }
              bodyStyle={{ padding: isMobile ? '16px' : '24px' }}
            >
              <div style={{ textAlign: 'center' }}>
                <Title level={isMobile ? 3 : 2} style={{ margin: 0 }}>
                  {showAsDays 
                    ? weeklyStats.totalDays.toFixed(1)
                    : weeklyStats.totalHours.toFixed(1)
                  }
                  <Text style={{ fontSize: isMobile ? '16px' : '18px', marginLeft: '4px' }}>
                    {showAsDays ? t('stats.daysUnit') : t('stats.hoursUnit')}
                  </Text>
                </Title>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Card 
              type="inner" 
              title={
                <div style={{ textAlign: 'center' }}>
                  {t('stats.thisMonth')}
                </div>
              }
              bodyStyle={{ padding: isMobile ? '16px' : '24px' }}
            >
              <div style={{ textAlign: 'center' }}>
                <Title level={isMobile ? 3 : 2} style={{ margin: 0 }}>
                  {showAsDays 
                    ? monthlyStats.totalDays.toFixed(1)
                    : monthlyStats.totalHours.toFixed(1)
                  }
                  <Text style={{ fontSize: isMobile ? '16px' : '18px', marginLeft: '4px' }}>
                    {showAsDays ? t('stats.daysUnit') : t('stats.hoursUnit')}
                  </Text>
                </Title>
              </div>
            </Card>
          </Col>
        </Row>
        
        <Divider style={{ margin: '12px 0' }} />
        
        <div style={{ 
          display: 'flex', 
          justifyContent: isMobile ? 'center' : 'flex-end',
          textAlign: isMobile ? 'center' : 'right'
        }}>
          <Text type="secondary" className={isMobile ? 'xs-small-text' : ''}>
            {t('stats.dailyWorkHoursSetting')}: {HOURS_PER_DAY}{t('stats.hoursPerDayUnit')}
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default TimeStats; 