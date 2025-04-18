import React from 'react';
import { Card, Statistic, Switch, Select } from 'antd';
import { ClockCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

interface StatisticsCardsProps {
  weeklyHours: number;
  monthlyHours: number;
  showInDays: boolean;
  setShowInDays: (value: boolean) => void;
  hoursPerDay: number;
  setHoursPerDay: (value: number) => void;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({
  weeklyHours,
  monthlyHours,
  showInDays,
  setShowInDays,
  hoursPerDay,
  setHoursPerDay,
}) => {
  const { t } = useTranslation();
  const { Option } = Select;

  // Convert hours to days based on hoursPerDay setting
  const hoursToDays = (hours: number) => {
    return (hours / hoursPerDay).toFixed(1);
  };

  return (
    <>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="shadow-sm rounded-lg hover:shadow-md transition-shadow" hoverable>
          <div className="flex items-center mb-2">
            <ClockCircleOutlined className="text-blue-500 mr-2" />
            <span className="text-gray-600">{t('weeklyHours')}</span>
          </div>
          <Statistic
            value={
              showInDays ? hoursToDays(weeklyHours) : weeklyHours.toFixed(1)
            }
            suffix={showInDays ? t('days') : t('hours')}
            valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
          />
        </Card>
        <Card className="shadow-sm rounded-lg hover:shadow-md transition-shadow" hoverable>
          <div className="flex items-center mb-2">
            <CalendarOutlined className="text-purple-500 mr-2" />
            <span className="text-gray-600">{t('monthlyHours')}</span>
          </div>
          <Statistic
            value={
              showInDays ? hoursToDays(monthlyHours) : monthlyHours.toFixed(1)
            }
            suffix={showInDays ? t('days') : t('hours')}
            valueStyle={{ color: '#7546C9', fontWeight: 'bold' }}
          />
        </Card>
      </div>
      
      {/* Display settings */}
      <div className="mt-4 flex flex-wrap justify-end items-center gap-4">
        {/* Hours per day setting */}
        <div className="flex items-center">
          <span className="text-gray-500 text-sm mr-2">{t('hoursPerDay')}:</span>
          <Select 
            value={hoursPerDay} 
            onChange={setHoursPerDay}
            size="small"
            style={{ width: 100 }}
            bordered
          >
            {[6, 7, 8, 9, 10].map(hours => (
              <Option key={hours} value={hours}>
                {hours} {t('hours')}
              </Option>
            ))}
          </Select>
        </div>
        
        {/* Unit toggle */}
        <div className="flex items-center">
          <span className="text-gray-500 text-sm mr-2">{t('displayUnit')}:</span>
          <span
            className={`text-sm mr-1 ${!showInDays ? 'text-blue-500 font-medium' : 'text-gray-500'}`}
          >
            {t('hours')}
          </span>
          <Switch
            checked={showInDays}
            onChange={setShowInDays}
            size="small"
            className="bg-gray-300"
          />
          <span
            className={`text-sm ml-1 ${showInDays ? 'text-blue-500 font-medium' : 'text-gray-500'}`}
          >
            {t('days')}
          </span>
        </div>
      </div>
    </>
  );
};

export default StatisticsCards; 