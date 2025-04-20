import React from 'react';
import { Card, Statistic, Switch, Select } from 'antd';
import { ClockCircleOutlined, CalendarOutlined, GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useConfigStore } from '../store/configStore';

interface StatisticsCardsProps {
  weeklyHours: number;
  monthlyHours: number;
  totalHours: number;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({
  weeklyHours,
  monthlyHours,
  totalHours,
}) => {
  const { t } = useTranslation();
  const { Option } = Select;
  
  // 从存储中获取显示偏好
  const { 
    showInDays, 
    setShowInDays, 
    hoursPerDay, 
    setHoursPerDay, 
    showTotalStats, 
    setShowTotalStats 
  } = useConfigStore();

  // 根据每天工时设置将小时转换为天数
  const hoursToDays = (hours: number) => {
    return (hours / hoursPerDay).toFixed(1);
  };

  return (
    <>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {showTotalStats ? (
          <Card className="shadow-sm rounded-lg hover:shadow-md transition-shadow" hoverable>
            <div className="flex items-center mb-2">
              <GlobalOutlined className="text-green-500 mr-2" />
              <span className="text-gray-600">{t('totalHours')}</span>
            </div>
            <Statistic
              value={
                showInDays ? hoursToDays(totalHours) : totalHours.toFixed(1)
              }
              suffix={showInDays ? t('days') : t('hours')}
              valueStyle={{ color: '#10B981', fontWeight: 'bold' }}
            />
          </Card>
        ) : (
          <>
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
          </>
        )}
      </div>
      
      {/* 显示设置 */}
      <div className="mt-4 flex flex-wrap justify-end items-center gap-4">
        {/* 切换周/月和总计统计 */}
        <div className="flex items-center">
          <span className="text-gray-500 text-sm mr-2">{t('displayStats')}:</span>
          <span
            className={`text-sm mr-1 ${!showTotalStats ? 'text-blue-500 font-medium' : 'text-gray-500'}`}
          >
            {t('weekMonth')}
          </span>
          <Switch
            checked={showTotalStats}
            onChange={setShowTotalStats}
            size="small"
            className="bg-gray-300"
          />
          <span
            className={`text-sm ml-1 ${showTotalStats ? 'text-blue-500 font-medium' : 'text-gray-500'}`}
          >
            {t('total')}
          </span>
        </div>
        
        {/* 每日工时设置 */}
        <div className="flex items-center">
          <span className="text-gray-500 text-sm mr-2">{t('hoursPerDay')}:</span>
          <Select 
            value={hoursPerDay} 
            onChange={setHoursPerDay}
            size="small"
            style={{ width: 100 }}
            variant="outlined"
          >
            {[6, 7, 8, 9, 10].map(hours => (
              <Option key={hours} value={hours}>
                {hours} {t('hours')}
              </Option>
            ))}
          </Select>
        </div>
        
        {/* 单位切换 */}
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