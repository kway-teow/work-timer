import React, { useEffect, useState } from 'react';
import { Button, Result, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLoaderData } from 'react-router';
import { useAuthStore } from '@/store/authStore';

// 加载器返回的数据类型
interface LoaderData {
  token?: string;
  error?: string;
}

/**
 * 认证回调组件
 * 用于处理 Supabase 邮箱确认后的回调
 */
const AuthCallback: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token, error: loaderError } = useLoaderData() as LoaderData;
  const { verifyEmail } = useAuthStore();
  
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(loaderError || null);
  
  // 导航到首页
  const goToHome = () => {
    navigate('/', { replace: true });
  };
  
  // 使用 token 验证邮箱
  useEffect(() => {
    if (!token) {
      setIsVerifying(false);
      return;
    }
    
    const verify = async () => {
      try {
        const result = await verifyEmail(token);
        if (!result.success) {
          setError(result.error || t('authenticationError'));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsVerifying(false);
      }
    };
    
    verify();
  }, [token, verifyEmail, t]);
  
  // 验证中显示加载状态
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
        <Spin size="large" tip={t('verifyingEmail')} />
      </div>
    );
  }
  
  // 验证失败显示错误
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
        <Result
          status="error"
          title={t('authenticationError')}
          subTitle={error}
          extra={[
            <Button type="primary" key="home" onClick={goToHome}>
              {t('backToHome')}
            </Button>
          ]}
        />
      </div>
    );
  }
  
  // 验证成功显示结果
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <Result
        status="success"
        title={t('emailConfirmed')}
        subTitle={t('emailConfirmedMessage')}
        extra={[
          <Button type="primary" key="home" onClick={goToHome}>
            {t('backToHome')}
          </Button>
        ]}
      />
    </div>
  );
};

export default AuthCallback; 