import React from 'react';
import { Segmented } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const handleLanguageChange = (value: string | number) => {
    const newLanguage = value === 'en' ? 'en' : 'zh-CN';
    if (newLanguage !== i18n.language) {
      i18n.changeLanguage(newLanguage);
    }
  };

  return (
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
        style={{ backgroundColor: '#eee', boxShadow: 'none' }}
      />
    </div>
  );
};

export default LanguageSelector; 