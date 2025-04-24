import React, { useState } from 'react';
import { Button, Tooltip, message, Popconfirm } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useWorkRecordStore } from '@/store/workRecordStore';
import { useAuthStore } from '@/store/authStore';

const SyncButton: React.FC = () => {
  const { t } = useTranslation();
  const { syncToDatabase, isSyncing } = useWorkRecordStore();
  const { user } = useAuthStore();
  const [isPopVisible, setIsPopVisible] = useState(false);
  
  // 如果用户未登录，不显示同步按钮
  if (!user) return null;
  
  const handleSync = async () => {
    setIsPopVisible(false);
    const result = await syncToDatabase();
    
    if (result.success) {
      message.success(result.message);
    } else {
      message.error(result.message);
    }
  };
  
  return (
    <Popconfirm
      title={t('syncConfirmTitle')}
      description={t('syncConfirmDescription')}
      okText={t('syncConfirmOk')}
      cancelText={t('cancel')}
      open={isPopVisible}
      onOpenChange={setIsPopVisible}
      onConfirm={handleSync}
    >
      <Tooltip title={t('syncTooltip')}>
        <Button
          type="text"
          icon={<SyncOutlined spin={isSyncing} />}
          loading={isSyncing}
          onClick={() => setIsPopVisible(true)}
          className="flex items-center"
        >
          {isSyncing ? t('syncing') : t('sync')}
        </Button>
      </Tooltip>
    </Popconfirm>
  );
};

export default SyncButton; 