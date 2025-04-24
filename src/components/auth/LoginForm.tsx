import React, { useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';

const { Title, Text, Link } = Typography;

interface LoginFormProps {
  onToggleForm: () => void;
  onForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleForm, onForgotPassword }) => {
  const { t } = useTranslation();
  const { signIn, isLoading, error } = useAuthStore();
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
    }
  };

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
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={isLoading}
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