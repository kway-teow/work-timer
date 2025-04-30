import React from 'react';
import { Button, Tooltip, message } from 'antd';
import { FileExcelOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { WorkRecord } from '@/types/WorkRecord';
import { exportRecordsToClipboard } from '@/utils/exportUtils';

interface ExportButtonProps {
  records: WorkRecord[];
  className?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ records, className }) => {
  const { t } = useTranslation();

  const handleExport = async () => {
    if (records.length === 0) {
      message.warning(t('noRecords'));
      return;
    }

    const success = await exportRecordsToClipboard(records);
    
    if (success) {
      message.success(t('exportSuccess'));
    } else {
      message.error(t('exportError'));
    }
  };

  return (
    <Tooltip title={t('exportTooltip')}>
      <Button
        type="default"
        icon={<FileExcelOutlined />}
        onClick={handleExport}
        className={className}
      >
        {t('exportForWps')}
      </Button>
    </Tooltip>
  );
};

export default ExportButton; 