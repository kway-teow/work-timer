import React, { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import AuthPage from './AuthPage';

/**
 * 认证守卫组件
 * 用于保护需要登录才能访问的路由
 * 如果用户未登录，会自动重定向到登录页面
 */
interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * 认证守卫组件
 * @param children 子组件（受保护的内容）
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  // 使用isInitializeLoading替代isLoading('initialize')更明确地表示认证初始化的加载状态
  const { initialize, user, isInitialized, isInitializeLoading } = useAuthStore();
  
  // 组件挂载时初始化认证状态
  useEffect(() => {
    initialize();
  }, [initialize]);

  // 如果正在初始化，显示加载状态
  if (isInitializeLoading || !isInitialized) {
    return null; // 显示空白加载状态
  }
  
  // 如果用户未登录，显示认证页面
  if (!user) {
    return <AuthPage />;
  }
  
  // 渲染子组件
  return <>{children}</>;
};

export default AuthGuard; 