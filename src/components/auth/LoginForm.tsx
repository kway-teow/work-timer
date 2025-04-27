import React, { useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message, Skeleton, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';
// 注意：此组件使用isSignInLoading替代通用isLoading来表示登录过程的加载状态

const { Title, Text, Link } = Typography;

interface LoginFormProps {
  onToggleForm: () => void;
  onForgotPassword: () => void;
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleForm, onForgotPassword, onSuccess }) => {
  const { t } = useTranslation();
  // 使用特定的登录加载状态，替代通用的isLoading
  const { signIn, isSignInLoading, error } = useAuthStore();
  const [form] = Form.useForm();

  // 使用 useEffect 处理错误提示
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  // 登录处理
  const handleSubmit = async (values: { email: string; password: string }) => {
    await signIn(values.email, values.password);
    
    // 错误信息由 AuthStore 中的错误状态处理
    if (!useAuthStore.getState().error) {
      message.success(t('loginSuccess'));
      // 如果提供了成功回调函数，则调用
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  // 加载状态下显示骨架屏 - 使用isSignInLoading替代通用的isLoading
  if (isSignInLoading) {
    return (
      <Card className="max-w-md w-full shadow-md">
        <div className="text-center mb-6">
          <Skeleton.Input active style={{ width: 150 }} />
          <div className="mt-2">
            <Skeleton.Input active style={{ width: 250 }} />
          </div>
        </div>

        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Skeleton.Input active block style={{ height: 40 }} />
          <Skeleton.Input active block style={{ height: 40 }} />
          <Skeleton.Button active block style={{ height: 40 }} />
          
          <div className="flex justify-between mt-4">
            <Skeleton.Input active style={{ width: 100 }} />
            <Skeleton.Input active style={{ width: 100 }} />
          </div>
        </Space>
      </Card>
    );
  }

  return (
    <Card className="max-w-md w-full shadow-md">
      <div className="text-center mb-6">
        <Title level={3}>{t('login')}</Title>
        <Text type="secondary">{t('loginDescription')}</Text>
      </div>

      <Form
        form={form}
        name="login"
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: t('emailRequired') },
            { type: 'email', message: t('invalidEmail') }
          ]}
        >
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder={t('email')}
            size="large"
            // 使用特定的登录加载状态禁用输入
            disabled={isSignInLoading}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: t('passwordRequired') }]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder={t('password')}
            size="large"
            // 使用特定的登录加载状态禁用输入
            disabled={isSignInLoading}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            // 使用特定的登录加载状态控制按钮的加载状态
            loading={isSignInLoading}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {t('login')}
          </Button>
        </Form.Item>

        <div className="flex justify-between items-center">
          <Link onClick={onForgotPassword}>{t('forgotPassword')}</Link>
          <Link onClick={onToggleForm}>{t('createAccount')}</Link>
        </div>
      </Form>
    </Card>
  );
};

export default LoginForm; 