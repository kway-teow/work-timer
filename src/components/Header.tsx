import React from 'react';
import { Segmented, Divider } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import UserStatus from './auth/UserStatus';
import SyncButton from './SyncButton';
import { useAuthStore } from '@/store/authStore';

// 匹配WorkTimer中使用的最小宽度

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const currentLanguage = i18n.language;
  
  const handleLanguageChange = (value: string | number) => {
    const newLanguage = value === 'en' ? 'en' : 'zh-CN';
    if (newLanguage !== i18n.language) {
      i18n.changeLanguage(newLanguage);
    }
  };

  return (
    <div 
      className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10 px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 system-min-width"
    >
      <h1 className="text-xl font-semibold text-gray-800 mb-1 sm:mb-0">{t('appTitle')}</h1>
      <div className="flex items-center flex-wrap justify-center">
        {user && (
          <>
            <SyncButton />
            <Divider type="vertical" className="h-5" />
            <UserStatus />
            <Divider type="vertical" className="h-5" />
          </>
        )}
        <div className="flex items-center">
          <GlobalOutlined className="mr-1 text-gray-600" />
          <Segmented
            value={currentLanguage === 'zh-CN' ? 'zh-CN' : 'en'}
            onChange={handleLanguageChange}
            options={[
              {
                label: '中文',
                value: 'zh-CN',
              },
              {
                label: 'EN',
                value: 'en',
              },
            ]}
            size="small"
          />
        </div>
      </div>
    </div>
  );
};

export default Header; 