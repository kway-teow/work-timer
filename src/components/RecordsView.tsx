import React, { useMemo } from 'react';
import { Card, Empty, message } from 'antd';
import { 
  CalendarOutlined, 
  FieldTimeOutlined, 
  FileTextOutlined, 
  EditOutlined, 
  DeleteOutlined,
  CopyOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { WorkRecord } from '@/types/WorkRecord';
import { useConfigStore } from '@/store/configStore';

interface RecordsViewProps {
  records: WorkRecord[];
  onEdit: (record: WorkRecord) => void;
  onDelete: (id: string) => void;
}

const RecordsView: React.FC<RecordsViewProps> = ({
  records,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();
  const { showInDays, hoursPerDay } = useConfigStore();

  // 按开始日期和时间排序工时记录（最新的排在前面）
  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => {
      const dateA = dayjs(`${a.startDate} ${a.startTime}`);
      const dateB = dayjs(`${b.startDate} ${b.startTime}`);
      return dateB.valueOf() - dateA.valueOf(); // 降序排列（最新的在前）
    });
  }, [records]);

  // 根据每天工时设置将小时转换为天数
  const hoursToDays = (hours: number) => {
    return (hours / hoursPerDay).toFixed(1);
  };

  // 格式化日期范围
  const formatDateRange = (startDate: string, endDate: string) => {
    if (startDate === endDate) {
      return dayjs(startDate).format('YYYY-MM-DD');
    } else {
      return `${dayjs(startDate).format('MM/DD')} - ${dayjs(endDate).format('MM/DD')}`;
    }
  };

  // 复制工时记录
  const handleCopyRecord = (record: WorkRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // 创建一个新的记录对象，生成新的ID
    const copiedRecord: WorkRecord = {
      ...record,
      id: Date.now().toString(), // 使用当前时间戳作为新ID
      startDate: dayjs().format('YYYY-MM-DD'), // 默认设置为今天
      endDate: dayjs().format('YYYY-MM-DD')
    };
    
    onEdit(copiedRecord); // 使用编辑功能打开复制的记录进行编辑
    message.success(t('recordCopied') || '已复制工时记录');
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-medium text-gray-700">{t('timeRecords')}</h2>
      </div>
      {sortedRecords.length > 0 ? (
        <div className="space-y-3">
          {sortedRecords.map((record) => (
            <Card
              key={record.id}
              className="shadow-sm rounded-lg cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onEdit(record)}
              style={{ marginBottom: '12px' }}
              hoverable
            >
              <div className="flex justify-between items-start">
                <div>
                  {/* 日期范围显示 */}
                  <div className="flex items-center text-gray-500 text-sm mb-1">
                    <CalendarOutlined className="mr-1" />
                    <span>
                      {formatDateRange(record.startDate, record.endDate)}
                    </span>
                  </div>
                  {/* 时间范围显示 */}
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <FieldTimeOutlined className="mr-1" />
                    <span>
                      {record.startTime} - {record.endTime}
                    </span>
                  </div>
                  {/* 工作内容描述 */}
                  <div className="flex items-start">
                    <FileTextOutlined className="text-gray-400 mt-1 mr-1" />
                    <p className="text-gray-700 break-words">
                      {record.description}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  {/* 工时/天数显示 */}
                  <div className="text-blue-500 font-medium">
                    {showInDays
                      ? `${hoursToDays(record.hours)} ${t('days')}`
                      : `${record.hours} ${t('hours')}`}
                  </div>
                  {/* 操作按钮 */}
                  <div className="flex mt-2">
                    <button
                      className="text-gray-400 hover:text-blue-500 p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(record);
                      }}
                      title={t('editRecord') || '编辑记录'}
                    >
                      <EditOutlined />
                    </button>
                    <button
                      className="text-gray-400 hover:text-green-500 p-1 ml-1"
                      onClick={(e) => handleCopyRecord(record, e)}
                      title={t('copyRecord') || '复制记录'}
                    >
                      <CopyOutlined />
                    </button>
                    <button
                      className="text-gray-400 hover:text-red-500 p-1 ml-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(record.id);
                      }}
                      title={t('deleteRecord') || '删除记录'}
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