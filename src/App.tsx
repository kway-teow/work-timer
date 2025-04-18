import { ConfigProvider } from 'antd';
import WorkTimer from './components/WorkTimer';
import { useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

// Import Ant Design locales
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';

// Import dayjs locales
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';

// Cache locale mapping to avoid recreating
const localeMap = {
  'zh-CN': zhCN,
  'en': enUS
};

function App() {
  const { i18n } = useTranslation();
  
  // Use memoized Ant Design locale based on current language
  const antdLocale = useMemo(() => {
    return i18n.language === 'zh-CN' ? localeMap['zh-CN'] : localeMap['en'];
  }, [i18n.language]);
  
  // Optimize language change handler with useCallback
  const handleLanguageChanged = useCallback((lng: string) => {
    // Set dayjs locale
    const dayjsLocale = lng === 'zh-CN' ? 'zh-cn' : 'en';
    dayjs.locale(dayjsLocale);
    
    // Update document title
    document.title = lng === 'zh-CN' ? '工时管家' : 'Work Timer';
  }, []);
  
  // Listen for language changes
  useEffect(() => {
    // Execute once on init
    handleLanguageChanged(i18n.language);
    
    // Add language change event listener
    i18n.on('languageChanged', handleLanguageChanged);
    
    // Clean up listener on component unmount
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, handleLanguageChanged]);
  
  useEffect(() => {
    // Add viewport meta tag for mobile scaling
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    
    // Only add meta tag if it doesn't exist
    if (!document.querySelector('meta[name="viewport"]')) {
      document.head.appendChild(meta);
    }
  }, []);

  // Memoize theme configuration
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
