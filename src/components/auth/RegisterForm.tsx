import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Card, Typography, Result } from 'antd';
import { LockOutlined, MailOutlined, SendOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';

const { Title, Text, Link, Paragraph } = Typography;

interface RegisterFormProps {
  onToggleForm: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleForm }) => {
  const { t } = useTranslation();
  const { signUp, resendConfirmationEmail, isLoading, error } = useAuthStore();
  const [form] = Form.useForm();
  const [registeredEmail, setRegisteredEmail] = useState<string>('');
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // 使用 useEffect 处理错误提示
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  // 注册处理
  const handleSubmit = async (values: { email: string; password: string; confirmPassword: string }) => {
    const result = await signUp(values.email, values.password);
    
    // 错误信息由 AuthStore 中的错误状态处理
    if (!useAuthStore.getState().error) {
      if (result.isConfirmEmailSent) {
        // 保存邮箱以便重发验证邮件
        setRegisteredEmail(values.email);
        // 显示确认邮件提示
        setShowConfirmationMessage(true);
      } else {
        message.success(t('registerSuccess'));
        form.resetFields();
      }
    }
  };

  // 重新发送确认邮件
  const handleResendConfirmation = async () => {
    if (!registeredEmail) return;
    
    setResendLoading(true);
    await resendConfirmationEmail(registeredEmail);
    setResendLoading(false);
    
    if (!useAuthStore.getState().error) {
      message.success(t('confirmationEmailResent'));
    }
  };

  // 显示确认邮箱的提示信息
  if (showConfirmationMessage) {
    return (
      <Card className="max-w-md w-full shadow-md">
        <Result
          status="success"
          title={t('registerSuccessTitle')}
          subTitle={t('confirmEmailMessage')}
          extra={[
            <Button 
              key="resend" 
              type="primary" 
              icon={<SendOutlined />}
              loading={resendLoading}
              onClick={handleResendConfirmation}
            >
              {t('resendConfirmationEmail')}
            </Button>,
            <Button 
              key="login" 
              onClick={onToggleForm}
            >
              {t('backToLogin')}
            </Button>
          ]}
        >
          <div className="text-center">
            <Paragraph>{t('emailSentTo')}: <Text strong>{registeredEmail}</Text></Paragraph>
            <Paragraph>{t('checkSpamFolder')}</Paragraph>
          </div>
        </Result>
      </Card>
    );
  }

  return (
    <Card className="max-w-md w-full shadow-md">
      <div className="text-center mb-6">
        <Title level={3}>{t('register')}</Title>
        <Text type="secondary">{t('registerDescription')}</Text>
      </div>

      <Form
        form={form}
        name="register"
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

        <Form.Item
          name="password"
          rules={[
            { required: true, message: t('passwordRequired') },
            { min: 6, message: t('passwordTooShort') }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder={t('password')}
            size="large"
            disabled={isLoading}
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: t('confirmPasswordRequired') },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t('passwordMismatch')));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder={t('confirmPassword')}
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
            {t('register')}
          </Button>
        </Form.Item>

        <div className="text-center">
          <Text>{t('alreadyHaveAccount')} </Text>
          <Link onClick={onToggleForm}>{t('login')}</Link>
        </div>
      </Form>
    </Card>
  );
};

export default RegisterForm; 