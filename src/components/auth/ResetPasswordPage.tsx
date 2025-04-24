import React from 'react';
import { Layout } from 'antd';
import ResetPasswordForm from './ResetPasswordForm';

const { Content } = Layout;

const ResetPasswordPage: React.FC = () => {
  return (
    <Layout className="min-h-screen bg-gray-100">
      <Content className="flex justify-center items-center p-4">
        <ResetPasswordForm />
      </Content>
    </Layout>
  );
};

export default ResetPasswordPage; 