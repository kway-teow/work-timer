import React, { useEffect, useState } from 'react';
import { Result, Spin, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/utils/supabase';

/**
 * 认证回调组件
 * 用于处理 Supabase 邮箱确认后的回调
 */
const AuthCallback: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // 获取 URL 参数
        const params = new URLSearchParams(window.location.search);
        
        // 如果有错误参数，显示错误信息
        if (params.get('error')) {
          setError(params.get('error_description') || 'Authentication error');
          setIsLoading(false);
          return;
        }
        
        // Supabase 会自动处理 URL 参数中的令牌
        // 这里我们只需要等待一会儿，然后重新获取会话
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        // 如果有会话，说明成功
        if (!data.session) {
          // 如果没有会话，可能是其他类型的回调
          setError('未能完成认证过程，请尝试重新登录');
        }
      } catch (err) {
        console.error('处理认证回调时出错:', err);
        setError('处理认证回调时出错');
      } finally {
        setIsLoading(false);
      }
    };

    handleCallback();
  }, []);

  // 重定向到主页
  const goToHome = () => {
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip={t('verifyingEmail')} />
      </div>
    );
  }

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