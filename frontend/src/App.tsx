import type { FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Dashboard from './pages/Dashboard';
import ForecastPage from './pages/Forecast';
import LivingExpenses from './pages/LivingExpenses';
import CreditCards from './pages/CreditCards';
import Loans from './pages/Loans';
import './App.css';

const App: FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/forecast" element={<ForecastPage />} />
            <Route path="/living-expenses" element={<LivingExpenses />} />
            <Route path="/credit-cards" element={<CreditCards />} />
            <Route path="/loans" element={<Loans />} />
            {/* 可以继续添加其他模块的路由 */}
            <Route path="/income-sources" element={<div style={{padding: '24px', textAlign: 'center'}}>收入来源页面 - 开发中</div>} />
            <Route path="/assets" element={<div style={{padding: '24px', textAlign: 'center'}}>资产组合页面 - 开发中</div>} />
            <Route path="/budgets" element={<div style={{padding: '24px', textAlign: 'center'}}>预算管理页面 - 开发中</div>} />
          </Routes>
        </div>
      </Router>
    </ConfigProvider>
  );
};

export default App;
