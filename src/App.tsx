import { ConfigProvider } from 'antd';
import TimeTracker from './components/TimeTracker';
import './App.css';

function App() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#1890ff' } }}>
      <TimeTracker />
    </ConfigProvider>
  );
}

export default App;
