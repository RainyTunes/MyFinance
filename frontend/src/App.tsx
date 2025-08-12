import type { FC } from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import ForecastPage from './pages/Forecast';
import './App.css';

const App: FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <div className="App">
        <ForecastPage />
      </div>
    </ConfigProvider>
  );
};

export default App;
