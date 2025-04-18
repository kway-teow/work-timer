import React from 'react';
import { Card } from 'antd';
import { 
  ClockCircleOutlined, 
  CalendarOutlined, 
  FieldTimeOutlined, 
  FileTextOutlined, 
  EditOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { WorkRecord } from '../types/WorkRecord';

interface TimelineViewProps {
  records: WorkRecord[];
  showInDays: boolean;
  onEdit: (record: WorkRecord) => void;
  onDelete: (id: string) => void;
  hoursPerDay: number;
}

const TimelineView: React.FC<TimelineViewProps> = ({
  records,
  showInDays,
  onEdit,
  onDelete,
  hoursPerDay,
}) => {
  const { t } = useTranslation();

  // Convert hours to days based on hoursPerDay setting
  const hoursToDays = (hours: number) => {
    return (hours / hoursPerDay).toFixed(1);
  };

  // Format date range
  const formatDateRange = (startDate: string, endDate: string) => {
    if (startDate === endDate) {
      return dayjs(startDate).format('MM/DD');
    } else {
      return `${dayjs(startDate).format('MM/DD')} - ${dayjs(endDate).format('MM/DD')}`;
    }
  };

  return (
    <div className="mt-4">
      <div className="relative pl-10">
        {records.map((record) => (
          <div key={record.id} className="mb-8 relative">
            {/* Timeline line */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200"></div>
            {/* Time node */}
            <div className="absolute left-[-20px] top-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-md z-10">
              <ClockCircleOutlined />
            </div>
            {/* Content card */}
            <Card
              className="ml-4 shadow-sm transition-shadow cursor-pointer"
              onClick={() => onEdit(record)}
              hoverable
              style={{ marginBottom: '16px' }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center text-gray-500 text-sm mb-1">
                    <CalendarOutlined className="mr-1" />
                    <span>
                      {formatDateRange(record.startDate, record.endDate)}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <FieldTimeOutlined className="mr-1" />
                    <span>
                      {record.startTime} - {record.endTime}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <FileTextOutlined className="text-gray-400 mt-1 mr-1" />
                    <p className="text-gray-700 break-words">
                      {record.description}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-blue-500 font-medium">
                    {showInDays
                      ? `${hoursToDays(record.hours)} ${t('days')}`
                      : `${record.hours} ${t('hours')}`}
                  </div>
                  <div className="flex mt-2">
                    <button
                      className="text-gray-400 hover:text-blue-500 p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(record);
                      }}
                    >
                      <EditOutlined />
                    </button>
                    <button
                      className="text-gray-400 hover:text-red-500 p-1 ml-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(record.id);
                      }}
                    >
                      <DeleteOutlined />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineView; 