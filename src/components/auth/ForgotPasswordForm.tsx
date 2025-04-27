import React, { useEffect } from 'react';
import { Form, Input, Button, message, Card, Typography } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';
// 注意：此组件使用isResetPasswordLoading替代isLoading('resetPassword')更明确地表示重置密码的加载状态

const { Title, Text, Link } = Typography;

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBackToLogin }) => {
  const { t } = useTranslation();
  const { resetPassword, isResetPasswordLoading, error } = useAuthStore();
  const [form] = Form.useForm();

  // 使用 useEffect 处理错误提示
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  // 重置密码处理
  const handleSubmit = async (values: { email: string }) => {
    await resetPassword(values.email);
    
    // 没有错误时显示成功消息
    if (!useAuthStore.getState().error) {
      message.success(t('resetPasswordEmailSent'));
      form.resetFields();
    }
  };

  return (
    <Card className="max-w-md w-full shadow-md">
      <div className="text-center mb-6">
        <Title level={3}>{t('forgotPassword')}</Title>
        <Text type="secondary">{t('forgotPasswordDescription')}</Text>
      </div>

      <Form
        form={form}
        name="forgotPassword"
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
            prefix={<MailOutlined className="text-gray-400" />}
            placeholder={t('email')}
            size="large"
            disabled={isResetPasswordLoading}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={isResetPasswordLoading}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {t('sendResetLink')}
          </Button>
        </Form.Item>

        <div className="text-center">
          <Link onClick={onBackToLogin}>{t('backToLogin')}</Link>
        </div>
      </Form>
    </Card>
  );
};

export default ForgotPasswordForm; 