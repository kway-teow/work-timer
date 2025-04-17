import { ConfigProvider } from 'antd';
import TimeTracker from './components/TimeTracker';
import './App.css';
import './styles/responsive.css';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // 添加viewport meta标签以确保移动端正确缩放
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    
    // 只在不存在时添加meta标签
    if (!document.querySelector('meta[name="viewport"]')) {
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#1890ff' } }}>
      <TimeTracker />
    </ConfigProvider>
  );
}

export default App;
