import React, { useState } from 'react';
import { Form, Input, Button, message, Card, Typography } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/utils/supabase';

const { Title, Text } = Typography;

const ResetPasswordForm: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // 重置密码处理
  const handleSubmit = async (values: { password: string }) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password: values.password
      });
      
      if (error) {
        throw error;
      }
      
      setIsSuccess(true);
      message.success(t('passwordResetSuccess'));
      
      // 3秒后重定向到主页
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
      
    } catch (error) {
      console.error('重置密码错误:', error);
      message.error(error instanceof Error ? error.message : '重置密码失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 如果成功重置，显示成功信息
  if (isSuccess) {
    return (
      <Card className="max-w-md w-full shadow-md">
        <div className="text-center mb-6">
          <Title level={3}>{t('passwordResetSuccess')}</Title>
          <Text type="secondary">{t('redirectingToHome')}</Text>
        </div>
      </Card>
    );
  }

  return (
    <Card className="max-w-md w-full shadow-md">
      <div className="text-center mb-6">
        <Title level={3}>{t('resetPassword')}</Title>
        <Text type="secondary">{t('resetPasswordDescription')}</Text>
      </div>

      <Form
        form={form}
        name="resetPassword"
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          name="password"
          rules={[
            { required: true, message: t('passwordRequired') },
            { min: 8, message: t('passwordMinLength') }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder={t('newPassword')}
            size="large"
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
            {t('resetPassword')}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ResetPasswordForm; 