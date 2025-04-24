import React, { useState } from 'react';
import { Card, Statistic, Switch, Select, DatePicker, Skeleton } from 'antd';
import { ClockCircleOutlined, CalendarOutlined, GlobalOutlined, HistoryOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useConfigStore } from '@/store/configStore';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

interface StatisticsCardsProps {
  weeklyHours: number;
  monthlyHours: number;
  totalHours: number;
  records: Array<{
    startDate: string;
    hours: number;
  }>;
  loading?: boolean;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({
  weeklyHours,
  monthlyHours,
  totalHours,
  records,
  loading = false,
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

  // 选择的月份和年份 (默认为当前月份)
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  // 根据每天工时设置将小时转换为天数
  const hoursToDays = (hours: number) => {
    return (hours / hoursPerDay).toFixed(1);
  };

  // 计算选定月份/年份的工时
  const getSelectedMonthHours = () => {
    const startOfMonth = selectedDate.startOf('month');
    const endOfMonth = selectedDate.endOf('month');
    
    return records.reduce((total, record) => {
      const recordDate = dayjs(record.startDate);
      if (recordDate.isBetween(startOfMonth, endOfMonth, null, '[]')) {
        return total + record.hours;
      }
      return total;
    }, 0);
  };

  // 所选月份/年份的工时
  const selectedMonthHours = getSelectedMonthHours();

  // 处理日期选择变化
  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  // 骨架屏组件
  if (loading) {
    return (
      <>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="shadow-sm rounded-lg">
            <Skeleton active paragraph={{ rows: 1 }} />
          </Card>
          <Card className="shadow-sm rounded-lg">
            <Skeleton active paragraph={{ rows: 1 }} />
          </Card>
        </div>
        <div className="mt-4 flex justify-end">
          <Skeleton.Button active size="small" className="mr-2" />
          <Skeleton.Button active size="small" className="mr-2" />
          <Skeleton.Button active size="small" />
        </div>
      </>
    );
  }

  // 选择DatePicker的正确语言

  return (
    <>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {showTotalStats ? (
          <>
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
            <Card className="shadow-sm rounded-lg hover:shadow-md transition-shadow" hoverable>
              <div className="flex items-center mb-2">
                <HistoryOutlined className="text-orange-500 mr-2" />
                <DatePicker 
                  picker="month"
                  value={selectedDate}
                  onChange={handleDateChange}
                  allowClear={false}
                  className="cursor-pointer"
                  size="small"
                  format="YYYY年MM月"
                  variant="borderless"
                  suffixIcon={null}
                />
              </div>
              <Statistic
                value={
                  showInDays ? hoursToDays(selectedMonthHours) : selectedMonthHours.toFixed(1)
                }
                suffix={showInDays ? t('days') : t('hours')}
                valueStyle={{ color: '#F97316', fontWeight: 'bold' }}
              />
            </Card>
          </>
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