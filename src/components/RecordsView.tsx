import React from 'react';
import { Card, Empty } from 'antd';
import { 
  CalendarOutlined, 
  FieldTimeOutlined, 
  FileTextOutlined, 
  EditOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { WorkRecord } from '../types/WorkRecord';

interface RecordsViewProps {
  records: WorkRecord[];
  showInDays: boolean;
  onEdit: (record: WorkRecord) => void;
  onDelete: (id: string) => void;
  hoursPerDay: number;
}

const RecordsView: React.FC<RecordsViewProps> = ({
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
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-medium text-gray-700">{t('timeRecords')}</h2>
      </div>
      {records.length > 0 ? (
        <div className="space-y-3">
          {records.map((record) => (
            <Card
              key={record.id}
              className="shadow-sm rounded-lg cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onEdit(record)}
              style={{ marginBottom: '12px' }}
              hoverable
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
          ))}
        </div>
      ) : (
        <Empty
          description={t('noRecords')}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="my-8"
        />
      )}
    </div>
  );
};

export default RecordsView; 