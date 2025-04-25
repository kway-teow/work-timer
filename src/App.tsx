import React, { useEffect } from 'react';
import { ConfigProvider, App as AntdApp } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import enUS from 'antd/lib/locale/en_US';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { useTranslation } from 'react-i18next';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { ErrorBoundary } from 'react-error-boundary';
import WorkTimer from './components/WorkTimer';
import { useConfigStore } from './store/configStore';
import { useAuthStore } from './store/authStore';
import AuthCallback from './components/auth/AuthCallback';
import AuthGuard from './components/auth/AuthGuard';
import ResetPasswordPage from './components/auth/ResetPasswordPage';
import NotFound from './components/NotFound';
import ErrorFallback from './components/ErrorFallback';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 创建 TanStack Query 客户端
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5分钟
      gcTime: 1000 * 60 * 60, // 1小时
      retry: 1,
    },
  },
});

// 全局错误日志
const logError = (error: Error, info: React.ErrorInfo) => {
  // 在这里可以将错误发送到日志服务
  console.error('应用捕获到错误:', error);
  console.error('组件堆栈:', info.componentStack);
};

// 验证 Email 回调页面的加载器
const authCallbackLoader = ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  if (!token) {
    return { error: 'Token is missing' };
  }
  return { token };
};

// 创建路由配置
const router = createBrowserRouter([
  {
    path: '/auth/callback',
    element: <AuthCallback />,
    loader: authCallbackLoader
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />
  },
  {
    path: '/',
    element: <AuthGuard><WorkTimer /></AuthGuard>
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

const App: React.FC = () => {
  const { i18n } = useTranslation();
  const { language } = useConfigStore();
  const { initialize } = useAuthStore();
  
  // 设置语言
  useEffect(() => {
    // 根据当前语言设置 dayjs 的语言环境
    if (language === 'zh-CN') {
      dayjs.locale('zh-cn');
    } else {
      dayjs.locale('en');
    }
    
    // 设置 i18n 的语言
    i18n.changeLanguage(language);
  }, [language, i18n]);
  
  // 初始化认证
  useEffect(() => {
    initialize();
  }, [initialize]);
  
  // 设置视口元标签
  useEffect(() => {
    const metaViewport = document.createElement('meta');
    metaViewport.name = 'viewport';
    metaViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    document.head.appendChild(metaViewport);
    
    return () => {
      document.head.removeChild(metaViewport);
    };
  }, []);
  
  // 根据当前语言选择 antd 的语言包
  const antdLocale = language === 'zh-CN' ? zhCN : enUS;
  
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider locale={antdLocale}>
          <AntdApp>
            <RouterProvider router={router} />
          </AntdApp>
        </ConfigProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
