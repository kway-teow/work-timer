import React from 'react';
import { Radio, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { GlobalOutlined } from '@ant-design/icons';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Space style={{ marginBottom: 24 }}>
      <GlobalOutlined />
      <Radio.Group 
        value={i18n.language} 
        onChange={(e) => changeLanguage(e.target.value)}
        optionType="button"
        buttonStyle="solid"
        size="small"
      >
        <Radio.Button value="en">English</Radio.Button>
        <Radio.Button value="zh-CN">中文</Radio.Button>
      </Radio.Group>
    </Space>
  );
};

export default LanguageSwitcher; 