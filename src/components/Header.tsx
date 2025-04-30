import React from 'react';
import { Divider } from 'antd';
import { useTranslation } from 'react-i18next';
import UserStatus from './auth/UserStatus';
import SyncButton from './SyncButton';
import LanguageSelector from './LanguageSelector';
import { useAuthStore } from '@/store/authStore';

// 匹配WorkTimer中使用的最小宽度

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  return (
    <div 
      className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10 px-4 py-3 flex flex-row justify-between items-center system-min-width"
    >
      <h1 className="text-xl font-semibold text-gray-800">{t('appTitle')}</h1>
      <div className="flex items-center">
        {user && (
          <>
            <div className="hidden sm:block">
              <SyncButton />
              <Divider type="vertical" className="h-5" />
            </div>
            <UserStatus />
            <div className="hidden sm:block">
              <Divider type="vertical" className="h-5" />
            </div>
          </>
        )}
        <div className="hidden sm:block">
          <LanguageSelector />
        </div>
        {/* If user is not logged in, show language selector on all screens */}
        {!user && <LanguageSelector />}
      </div>
    </div>
  );
};

export default Header; 