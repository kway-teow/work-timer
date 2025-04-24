import React, { useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/store/authStore';
import AuthPage from './AuthPage';

interface AuthGuardProps {
  children: ReactNode;
}

/**
 * 认证守卫组件
 * 用于保护需要用户登录才能访问的内容
 * 如果用户未登录，则显示认证页面
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { initialize, user, isLoading } = useAuthStore();
  
  // 组件挂载时初始化认证状态
  useEffect(() => {
    // 只有在未初始化时才调用 initialize
    if (isLoading) {
      initialize();
    }
  }, [initialize, isLoading]);

  // 如果正在加载，显示加载状态
  if (isLoading) {
    return null; // 或者返回一个加载指示器
  }

  // 如果用户未登录，显示认证页面
  if (!user) {
    return <AuthPage />;
  }

  // 显示子组件（受保护的内容）
  return <>{children}</>;
};

export default AuthGuard; 