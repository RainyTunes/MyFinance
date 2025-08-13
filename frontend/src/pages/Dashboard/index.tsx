import React from 'react';
import { Card, Row, Col, Typography, Button, Space } from 'antd';
import { 
  CreditCardOutlined,
  HomeOutlined,
  BankOutlined,
  DollarOutlined,
  PieChartOutlined,
  TableOutlined,
  BarChartOutlined,
  FundOutlined,
  WalletOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

interface ModuleCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const modules: ModuleCard[] = [
    {
      id: 'living-expenses',
      title: '生活开销',
      description: '查看月度生活支出明细，按金额排序分析',
      icon: <HomeOutlined />,
      path: '/living-expenses',
      color: '#ff4d4f'
    },
    {
      id: 'credit-cards',
      title: '信用卡',
      description: '管理信用卡信息，查看额度和套现费率',
      icon: <CreditCardOutlined />,
      path: '/credit-cards',
      color: '#1890ff'
    },
    {
      id: 'loans',
      title: '贷款管理',
      description: '追踪贷款还款进度和月供明细',
      icon: <BankOutlined />,
      path: '/loans',
      color: '#fa8c16'
    },
    {
      id: 'income-sources',
      title: '收入来源',
      description: '查看多币种收入结构和汇率影响',
      icon: <DollarOutlined />,
      path: '/income-sources',
      color: '#52c41a'
    },
    {
      id: 'assets',
      title: '资产组合',
      description: '管理储蓄、投资和不动产资产',
      icon: <FundOutlined />,
      path: '/assets',
      color: '#722ed1'
    },
    {
      id: 'budgets',
      title: '预算管理',
      description: '设置和跟踪月度预算执行情况',
      icon: <WalletOutlined />,
      path: '/budgets',
      color: '#eb2f96'
    }
  ];

  const handleModuleClick = (path: string) => {
    navigate(path);
  };

  const handleForecastClick = () => {
    navigate('/forecast');
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <Title level={1} style={{ marginBottom: '8px' }}>
          <PieChartOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
          财务管理中心
        </Title>
        <Paragraph type="secondary" style={{ fontSize: '16px' }}>
          全面管理您的财务数据，实时监控收支状况和投资表现
        </Paragraph>
        
        {/* 现金流预测按钮 */}
        <div style={{ marginTop: '24px' }}>
          <Button 
            type="primary" 
            size="large" 
            icon={<BarChartOutlined />}
            onClick={handleForecastClick}
            style={{ 
              height: '48px', 
              fontSize: '16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
            }}
          >
            现金流预测分析
          </Button>
        </div>
      </div>

      {/* 模块链接区域 */}
      <div style={{ marginBottom: '32px' }}>
        <Title level={3} style={{ marginBottom: '24px', textAlign: 'center' }}>
          <TableOutlined style={{ marginRight: '8px' }} />
          数据模块总览
        </Title>
        
        <Row gutter={[24, 24]}>
          {modules.map((module) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={module.id}>
              <Card
                hoverable
                style={{ 
                  height: '180px',
                  border: `2px solid ${module.color}20`,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                bodyStyle={{ 
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%'
                }}
                onClick={() => handleModuleClick(module.path)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 8px 24px ${module.color}30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
              >
                <div>
                  <div style={{ 
                    fontSize: '32px', 
                    color: module.color, 
                    marginBottom: '12px',
                    textAlign: 'center'
                  }}>
                    {module.icon}
                  </div>
                  <Title level={4} style={{ 
                    margin: '0 0 8px 0', 
                    textAlign: 'center',
                    color: '#262626'
                  }}>
                    {module.title}
                  </Title>
                </div>
                <Paragraph 
                  type="secondary" 
                  style={{ 
                    margin: 0, 
                    fontSize: '12px',
                    textAlign: 'center',
                    lineHeight: '1.4'
                  }}
                >
                  {module.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 快速操作区域 */}
      <Card 
        title="快速操作" 
        style={{ 
          marginTop: '24px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        <Space size="middle" wrap>
          <Button 
            type="default" 
            icon={<TableOutlined />}
            onClick={() => handleModuleClick('/living-expenses')}
          >
            查看生活开销
          </Button>
          <Button 
            type="default" 
            icon={<CreditCardOutlined />}
            onClick={() => handleModuleClick('/credit-cards')}
          >
            信用卡管理
          </Button>
          <Button 
            type="default" 
            icon={<BankOutlined />}
            onClick={() => handleModuleClick('/loans')}
          >
            贷款总览
          </Button>
          <Button 
            type="default" 
            icon={<DollarOutlined />}
            onClick={() => handleModuleClick('/income-sources')}
          >
            收入分析
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default Dashboard;