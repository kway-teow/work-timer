import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Card, Typography, Result, Skeleton, Space } from 'antd';
import { LockOutlined, MailOutlined, SendOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';
// 注意：此组件使用isSignUpLoading替代通用isLoading表示注册过程的加载状态
// 并使用isResendConfirmationLoading替代局部状态resendLoading表示重发确认邮件的加载状态

const { Title, Text, Link } = Typography;

interface RegisterFormProps {
  onToggleForm: () => void;
  onSuccess?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleForm, onSuccess }) => {
  const { t } = useTranslation();
  const { signUp, resendConfirmationEmail, isSignUpLoading, isResendConfirmationLoading, error } = useAuthStore();
  const [form] = Form.useForm();
  const [registeredEmail, setRegisteredEmail] = useState<string>('');
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);

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
        
        // 如果提供了成功回调函数，则调用
        if (onSuccess) {
          onSuccess();
        }
      }
    }
  };

  // 重新发送确认邮件
  const handleResendConfirmation = async () => {
    if (!registeredEmail) return;
    
    await resendConfirmationEmail(registeredEmail);
    
    if (!useAuthStore.getState().error) {
      message.success(t('confirmationEmailResent'));
    }
  };

  // 显示确认邮箱的提示信息
  if (showConfirmationMessage) {
    // 重发邮件时的加载状态显示骨架屏
    if (isResendConfirmationLoading) {
      return (
        <Card className="max-w-md w-full shadow-md">
          <Space direction="vertical" align="center" style={{ width: '100%' }}>
            <Skeleton.Image active />
            <Skeleton.Input active style={{ width: 200 }} />
            <Skeleton.Input active style={{ width: 280 }} />
            <Space className="mt-4">
              <Skeleton.Button active />
              <Skeleton.Button active />
            </Space>
            <Skeleton.Input active style={{ width: 250 }} />
          </Space>
        </Card>
      );
    }

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
              loading={isResendConfirmationLoading}
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
            <Text>{t('emailSentTo')}: <Text strong>{registeredEmail}</Text></Text>
            <br />
            <Text type="secondary">{t('checkSpamFolder')}</Text>
          </div>
        </Result>
      </Card>
    );
  }

  // 在表单加载状态下显示骨架屏
  if (isSignUpLoading) {
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
          <Skeleton.Input active block style={{ height: 40 }} />
          <Skeleton.Button active block style={{ height: 40 }} />
          
          <div className="text-center mt-4">
            <Skeleton.Input active style={{ width: 180 }} />
          </div>
        </Space>
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
            disabled={isSignUpLoading}
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
            disabled={isSignUpLoading}
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
            disabled={isSignUpLoading}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={isSignUpLoading}
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