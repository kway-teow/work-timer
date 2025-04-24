import React, { useEffect } from 'react';
import { Form, Input, Button, message, Card, Typography, Skeleton, Space } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';

const { Title, Text, Link } = Typography;

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBackToLogin }) => {
  const { t } = useTranslation();
  const { resetPassword, isLoading, error } = useAuthStore();
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

  // 加载状态下显示骨架屏
  if (isLoading) {
    return (
      <Card className="max-w-md w-full shadow-md">
        <div className="text-center mb-6">
          <Skeleton.Input active style={{ width: 180 }} />
          <div className="mt-2">
            <Skeleton.Input active style={{ width: 250 }} />
          </div>
        </div>

        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Skeleton.Input active block style={{ height: 40 }} />
          <Skeleton.Button active block style={{ height: 40 }} />
          
          <div className="text-center mt-4">
            <Skeleton.Input active style={{ width: 120 }} />
          </div>
        </Space>
      </Card>
    );
  }

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