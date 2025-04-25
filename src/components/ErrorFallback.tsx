import React from 'react';
import { Button, Result } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { FallbackProps } from 'react-error-boundary';

/**
 * 错误回退组件
 * 用于在发生错误时显示给用户
 */
const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // 处理返回首页
  const handleBackHome = () => {
    navigate('/', { replace: true });
  };

  // 尝试处理特定类型的错误
  const errorMessage = error?.message || t('somethingWentWrong');
  let statusCode = 500;

  // 判断是否是 404 错误
  if (errorMessage.includes('not found') || errorMessage.includes('404')) {
    statusCode = 404;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <Result
        status={statusCode === 404 ? '404' : 'error'}
        title={statusCode === 404 ? t('pageNotFound') : t('error')}
        subTitle={errorMessage}
        extra={[
          <Button 
            type="primary" 
            key="retry" 
            onClick={resetErrorBoundary}
            className="mr-4"
          >
            {t('tryAgain')}
          </Button>,
          <Button 
            key="home" 
            onClick={handleBackHome}
          >
            {t('backToHome')}
          </Button>
        ]}
      />
    </div>
  );
};

export default ErrorFallback; 