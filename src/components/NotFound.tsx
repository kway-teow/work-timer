import { Button, Result } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

/**
 * 404页面组件
 * 当用户访问不存在的路径时显示
 */
const NotFound: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // 处理返回首页
  const handleBackHome = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <Result
        status="404"
        title={t('pageNotFound')}
        subTitle={t('pageNotFoundDescription')}
        extra={[
          <Button 
            type="primary" 
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

export default NotFound;

 