import React, { useMemo } from 'react';
import { Timeline, Tooltip, message } from 'antd';
import { 
  ClockCircleOutlined, 
  EditOutlined, 
  DeleteOutlined,
  CopyOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { WorkRecord } from '@/types/WorkRecord';
import { useConfigStore } from '@/store/configStore';

interface TimelineViewProps {
  records: WorkRecord[];
  onEdit: (record: WorkRecord) => void;
  onDelete: (id: string) => void;
}

const TimelineView: React.FC<TimelineViewProps> = ({
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
  const handleCopyRecord = (record: WorkRecord) => {
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

  if (records.length === 0) {
    return (
      <div className="mt-8 text-center text-gray-500">
        {t('noRecords')}
      </div>
    );
  }

  return (
    <div className="mt-4 px-2">
      <Timeline
        items={sortedRecords.map((record) => ({
          dot: <ClockCircleOutlined className="text-blue-500" />,
          color: "blue",
          children: (
            <div className="mb-3 py-1 group relative">
              {/* 日期和时间 */}
              <div className="text-sm flex items-center">
                <span className="font-medium">{formatDateRange(record.startDate, record.endDate)}</span>
                <span className="text-gray-500 mx-2">|</span>
                <span className="text-gray-500">{record.startTime} - {record.endTime}</span>
                <span className="text-blue-500 ml-2 font-bold">
                  {showInDays
                    ? `${hoursToDays(record.hours)} ${t('days')}`
                    : `${record.hours} ${t('hours')}`}
                </span>
              </div>
              
              {/* 工作内容描述 */}
              <div 
                className="text-gray-700 mt-1 cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis"
                onClick={() => onEdit(record)}
                style={{ maxWidth: '90%' }}
              >
                {record.description}
              </div>
              
              {/* 操作按钮 - 悬停时显示 */}
              <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <Tooltip title={t('editRecord') || '编辑记录'}>
                  <button
                    className="text-gray-400 hover:text-blue-500 p-1"
                    onClick={() => onEdit(record)}
                  >
                    <EditOutlined />
                  </button>
                </Tooltip>
                <Tooltip title={t('copyRecord') || '复制记录'}>
                  <button
                    className="text-gray-400 hover:text-green-500 p-1"
                    onClick={() => handleCopyRecord(record)}
                  >
                    <CopyOutlined />
                  </button>
                </Tooltip>
                <Tooltip title={t('confirmDelete') || '删除记录'}>
                  <button
                    className="text-gray-400 hover:text-red-500 p-1"
                    onClick={() => onDelete(record.id)}
                  >
                    <DeleteOutlined />
                  </button>
                </Tooltip>
              </div>
            </div>
          )
        }))}
      />
    </div>
  );
};

export default TimelineView; 