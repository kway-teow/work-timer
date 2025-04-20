import React, { memo, useCallback, useEffect } from 'react';
import { Segmented, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { GlobalOutlined } from '@ant-design/icons';
import { useConfigStore } from '../store/configStore';

// 使用memo包装组件以减少不必要的重渲染
const LanguageSwitcher: React.FC = memo(() => {
  const { i18n } = useTranslation();
  const { language, setLanguage } = useConfigStore();

  // 组件挂载时，从store初始化i18n语言
  useEffect(() => {
    if (language && language !== i18n.language) {
      i18n.changeLanguage(language);
    }
  }, []);

  // 使用useCallback缓存changeLanguage函数
  const changeLanguage = useCallback((value: string | number) => {
    const lng = value as string;
    if (lng === i18n.language) return; // 如果点击当前语言，不做任何操作
    
    // 更新store中的语言设置
    setLanguage(lng);
    
    // 延迟消息提示，让语言切换先完成
    const displayMessage = () => {
      if (lng === 'zh-CN') {
        message.success('语言已切换为中文');
      } else {
        message.success('Language switched to English');
      }
    };
    
    // 更改语言
    i18n.changeLanguage(lng);
    
    // 使用setTimeout让语言切换操作完成后再显示消息
    setTimeout(displayMessage, 10);
  }, [i18n, setLanguage]);

  // 预先定义选项，避免重新创建
  const options = [
    { value: 'en', label: 'English' },
    { value: 'zh-CN', label: '中文' }
  ];

  return (
    <div className="flex items-center">
      <GlobalOutlined className="text-blue-500 mr-2" />
      <Segmented
        value={i18n.language}
        onChange={changeLanguage}
        options={options}
        size="middle"
        className="text-sm md:text-base min-w-[120px]"
      />
    </div>
  );
});

// 添加显示名称以方便调试
LanguageSwitcher.displayName = 'LanguageSwitcher';

export default LanguageSwitcher; 