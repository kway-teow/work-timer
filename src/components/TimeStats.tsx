import React from 'react';
import { Card, Row, Col, Switch, Typography, Divider } from 'antd';
import { useTranslation } from 'react-i18next';
import { TimeStats as TimeStatsType } from '../types';
import { HOURS_PER_DAY } from '../utils/timeUtils';

const { Title, Text } = Typography;

interface TimeStatsProps {
  weeklyStats: TimeStatsType;
  monthlyStats: TimeStatsType;
  showAsDays: boolean;
  setShowAsDays: React.Dispatch<React.SetStateAction<boolean>>;
}

const TimeStats: React.FC<TimeStatsProps> = ({ 
  weeklyStats, 
  monthlyStats,
  showAsDays,
  setShowAsDays 
}) => {
  const { t } = useTranslation();

  return (
    <div style={{ marginBottom: 24 }}>
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{t('stats.title')}</span>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Text style={{ marginRight: 8 }}>{t('stats.hours')}</Text>
              <Switch 
                checked={showAsDays}
                onChange={setShowAsDays}
                size="small"
              />
              <Text style={{ marginLeft: 8 }}>{t('stats.days')}</Text>
            </div>
          </div>
        }
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card 
              type="inner" 
              title={
                <div style={{ textAlign: 'center' }}>
                  {t('stats.thisWeek')}
                </div>
              }
              bodyStyle={{ padding: '24px' }}
            >
              <div style={{ textAlign: 'center' }}>
                <Title level={2} style={{ margin: 0 }}>
                  {showAsDays 
                    ? weeklyStats.totalDays.toFixed(1)
                    : weeklyStats.totalHours.toFixed(1)
                  }
                  <Text style={{ fontSize: '18px', marginLeft: '4px' }}>
                    {showAsDays ? t('stats.daysUnit') : t('stats.hoursUnit')}
                  </Text>
                </Title>
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card 
              type="inner" 
              title={
                <div style={{ textAlign: 'center' }}>
                  {t('stats.thisMonth')}
                </div>
              }
              bodyStyle={{ padding: '24px' }}
            >
              <div style={{ textAlign: 'center' }}>
                <Title level={2} style={{ margin: 0 }}>
                  {showAsDays 
                    ? monthlyStats.totalDays.toFixed(1)
                    : monthlyStats.totalHours.toFixed(1)
                  }
                  <Text style={{ fontSize: '18px', marginLeft: '4px' }}>
                    {showAsDays ? t('stats.daysUnit') : t('stats.hoursUnit')}
                  </Text>
                </Title>
              </div>
            </Card>
          </Col>
        </Row>
        
        <Divider style={{ margin: '16px 0' }} />
        
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Text type="secondary">
            {t('stats.dailyWorkHoursSetting')}: {HOURS_PER_DAY}{t('stats.hoursPerDayUnit')}
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default TimeStats; 