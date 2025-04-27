import React from 'react';
import ResetPasswordForm from './ResetPasswordForm';

/**
 * 重置密码页面
 * 整体布局与AuthPage保持一致，提供统一的用户体验
 */
const ResetPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="w-full max-w-md">
        <ResetPasswordForm />
      </div>
    </div>
  );
};

export default ResetPasswordPage; 