import React, { useState } from 'react';
import { Spin } from 'antd';
import { useAuthStore } from '@/store/authStore';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import { useTranslation } from 'react-i18next';

enum AuthView {
  LOGIN = 'login',
  REGISTER = 'register',
  FORGOT_PASSWORD = 'forgot_password'
}

const AuthPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, isLoading } = useAuthStore();
  const [currentView, setCurrentView] = useState<AuthView>(AuthView.LOGIN);

  // 切换到登录视图
  const showLogin = () => setCurrentView(AuthView.LOGIN);
  
  // 切换到注册视图
  const showRegister = () => setCurrentView(AuthView.REGISTER);
  
  // 切换到忘记密码视图
  const showForgotPassword = () => setCurrentView(AuthView.FORGOT_PASSWORD);

  // 根据当前视图显示不同的表单
  const renderAuthForm = () => {
    switch (currentView) {
      case AuthView.REGISTER:
        return <RegisterForm onToggleForm={showLogin} />;
      case AuthView.FORGOT_PASSWORD:
        return <ForgotPasswordForm onBackToLogin={showLogin} />;
      default:
        return <LoginForm onToggleForm={showRegister} onForgotPassword={showForgotPassword} />;
    }
  };

  // 正在加载时显示加载指示器
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip={t('loading')} />
      </div>
    );
  }
  
  // 如果用户已登录，返回 null，由 AuthGuard 来决定渲染内容
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="w-full max-w-md">
        {renderAuthForm()}
      </div>
    </div>
  );
};

export default AuthPage; 