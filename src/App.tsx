import { ConfigProvider } from 'antd';
import WorkTimer from './components/WorkTimer';
import { useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfigStore } from './store/configStore';

// 导入 Ant Design 语言包
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';

// 导入 dayjs 语言包
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';

// 缓存语言映射以避免重复创建
const localeMap = {
  'zh-CN': zhCN,
  'en': enUS
};

function App() {
  const { i18n } = useTranslation();
  const { language, setLanguage } = useConfigStore();
  
  // 基于当前语言使用记忆化的 Ant Design 语言包
  const antdLocale = useMemo(() => {
    return i18n.language === 'zh-CN' ? localeMap['zh-CN'] : localeMap['en'];
  }, [i18n.language]);
  
  // 使用 useCallback 优化语言变更处理函数
  const handleLanguageChanged = useCallback((lng: string) => {
    // 设置 dayjs 语言
    const dayjsLocale = lng === 'zh-CN' ? 'zh-cn' : 'en';
    dayjs.locale(dayjsLocale);
    
    // 更新文档标题
    document.title = lng === 'zh-CN' ? '工时管家' : 'Work Timer';
    
    // 与存储同步
    if (lng !== language) {
      setLanguage(lng);
    }
  }, [language, setLanguage]);
  
  // 监听语言变化
  useEffect(() => {
    // 初始化时执行一次
    handleLanguageChanged(i18n.language);
    
    // 添加语言变更事件监听器
    i18n.on('languageChanged', handleLanguageChanged);
    
    // 组件卸载时清理监听器
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, handleLanguageChanged]);
  
  useEffect(() => {
    // 添加视口元标签用于移动设备缩放
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    
    // 仅在元标签不存在时添加
    if (!document.querySelector('meta[name="viewport"]')) {
      document.head.appendChild(meta);
    }
  }, []);

  // 记忆化主题配置
  const theme = useMemo(() => ({ 
    token: { colorPrimary: '#1890ff' } 
  }), []);

  return (
    <ConfigProvider 
      theme={theme}
      locale={antdLocale}
    >
      <WorkTimer />
    </ConfigProvider>
  );
}

export default App;
