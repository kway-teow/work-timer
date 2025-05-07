import React from 'react';
import { Button, Dropdown, Avatar, Space, message } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined, SyncOutlined, FileExcelOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from 'react-i18next';
import type { MenuProps } from 'antd';
import { useWorkRecordStore } from '@/store/workRecordStore';
import LanguageSelector from '../LanguageSelector';
import { useWorkRecords } from '@/hooks';
import { exportRecordsToClipboard } from '@/utils/exportUtils';

const UserStatus: React.FC = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuthStore();
  const { syncToDatabase, isSyncing } = useWorkRecordStore();
  // 获取工时记录
  const { records } = useWorkRecords();

  // 处理登出
  const handleSignOut = async () => {
    await signOut();
    message.success(t('signedOut'));
  };

  // 处理同步
  const handleSync = async () => {
    const result = await syncToDatabase();
    
    if (result.success) {
      message.success(result.message);
    } else {
      message.error(result.message);
    }
  };

  // 处理导出到文档
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

  // 如果没有用户，不显示任何内容
  if (!user) {
    return null;
  }

  // 用户菜单项
  const items: MenuProps['items'] = [
    {
      key: 'email',
      label: <span className="text-gray-600">{user.email}</span>,
    },
    {
      key: 'divider1',
      type: 'divider',
    },
    {
      key: 'sync',
      icon: <SyncOutlined spin={isSyncing} />,
      label: isSyncing ? t('syncing') : t('sync'),
      onClick: handleSync,
      className: 'sm:hidden', // Only show on small screens
    },
    {
      key: 'export',
      icon: <FileExcelOutlined />,
      label: t('exportForWps'),
      onClick: handleExport,
    },
    {
      key: 'language',
      label: <LanguageSelector />,
      className: 'sm:hidden', // Only show on small screens
    },
    {
      key: 'divider2',
      type: 'divider',
      className: 'sm:hidden', // Only show on small screens
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: t('settings'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('signOut'),
      onClick: handleSignOut,
    },
  ];

  return (
    <Dropdown menu={{ items }} placement="bottomRight">
      <Button type="text" className="flex items-center">
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <span className="max-w-[150px] overflow-hidden text-ellipsis">
            {user.email?.split('@')[0]}
          </span>
        </Space>
      </Button>
    </Dropdown>
  );
};

export default UserStatus; 