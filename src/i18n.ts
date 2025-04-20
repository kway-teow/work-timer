import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en/translation.json';
import zhCNTranslation from './locales/zh-CN/translation.json';

// 翻译资源
const resources = {
  en: {
    translation: enTranslation
  },
  'zh-CN': {
    translation: zhCNTranslation
  }
};

// 尝试从 localStorage 获取存储的语言
let initialLanguage = 'zh-CN';
try {
  const storedConfig = localStorage.getItem('app-config');
  if (storedConfig) {
    const config = JSON.parse(storedConfig);
    if (config.state && config.state.language) {
      initialLanguage = config.state.language;
    }
  }
} catch (e) {
  console.error('获取存储的语言失败', e);
}

i18n
  // 检测用户语言
  .use(LanguageDetector)
  // 将 i18n 实例传递给 react-i18next
  .use(initReactI18next)
  // 初始化 i18next
  .init({
    resources,
    lng: initialLanguage,
    fallbackLng: 'zh-CN',
    interpolation: {
      escapeValue: false // react 已经防止 xss 攻击
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n; 