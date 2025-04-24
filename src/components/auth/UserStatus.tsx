import React from 'react';
import { Button, Dropdown, Avatar, Space, message } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from 'react-i18next';
import type { MenuProps } from 'antd';

const UserStatus: React.FC = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuthStore();

  // 处理登出
  const handleSignOut = async () => {
    await signOut();
    message.success(t('signedOut'));
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
      key: 'divider',
      type: 'divider',
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