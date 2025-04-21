import React from 'react';
import { Segmented } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

// 匹配WorkTimer中使用的最小宽度
const MIN_WIDTH = '320px';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  
  const handleLanguageChange = (value: string | number) => {
    const newLanguage = value === 'en' ? 'en' : 'zh-CN';
    if (newLanguage !== i18n.language) {
      i18n.changeLanguage(newLanguage);
    }
  };

  return (
    <div 
      className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10 px-4 py-3 flex justify-between items-center"
      style={{ minWidth: MIN_WIDTH }}
    >
      <h1 className="text-xl font-semibold text-gray-800">{t('appTitle')}</h1>
      <div className="flex items-center">
        <GlobalOutlined className="mr-2 text-gray-600" />
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
  );
};

export default Header; 