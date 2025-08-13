import React, { useState, useEffect } from 'react';
import { Card, Table, Typography, Space, Button, Tag } from 'antd';
import { CreditCardOutlined, ArrowLeftOutlined, PieChartOutlined, TableOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import * as echarts from 'echarts';
import creditCardsData from '../../data/creditCards.json';

const { Title, Text } = Typography;

interface CreditCard {
  id: string;
  cardNumber: string;
  bankName: string;
  creditLimit: number;
  cardType: string;
  annualFee: number;
  isActive: boolean;
  cashAdvanceRate: number;
  notes?: string;
  lastUpdated: string;
}

const CreditCards: React.FC = () => {
  const navigate = useNavigate();
  const [, setChartInstance] = useState<echarts.ECharts | null>(null);

  // 格式化金额显示
  const formatCurrency = (amount: number) => {
    const value = amount / 100;
    return `¥${value.toLocaleString('zh-CN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;
  };

  // 获取银行颜色
  const getBankColor = (bankName: string) => {
    const colors: Record<string, string> = {
      '工商银行': '#c41e3a',
      '光大银行': '#fa8c16',
      '中国银行': '#1890ff',
      '招商银行': '#52c41a',
      '浦发银行': '#722ed1',
      '平安银行': '#13c2c2',
      '建设银行': '#faad14',
      '农业银行': '#eb2f96'
    };
    return colors[bankName] || '#666666';
  };

  // 过滤活跃的信用卡并按额度排序
  const activeCards = creditCardsData
    .filter((card: CreditCard) => card.isActive)
    .sort((a: CreditCard, b: CreditCard) => b.creditLimit - a.creditLimit);

  // 表格列定义
  const columns: ColumnsType<CreditCard> = [
    {
      title: '卡号',
      dataIndex: 'cardNumber',
      key: 'cardNumber',
      width: 80,
      render: (text: string) => (
        <Text strong style={{ color: '#1890ff' }}>{text}</Text>
      ),
    },
    {
      title: '银行',
      dataIndex: 'bankName',
      key: 'bankName',
      width: 120,
      render: (bankName: string) => (
        <Tag color={getBankColor(bankName)}>{bankName}</Tag>
      ),
    },
    {
      title: '卡种',
      dataIndex: 'cardType',
      key: 'cardType',
      width: 120,
      render: (text: string) => (
        <Text strong>{text}</Text>
      ),
    },
    {
      title: '信用额度',
      dataIndex: 'creditLimit',
      key: 'creditLimit',
      width: 140,
      render: (limit: number) => (
        <Text strong style={{ color: '#52c41a', fontSize: '16px' }}>
          {formatCurrency(limit)}
        </Text>
      ),
    },
    {
      title: '套现费率',
      dataIndex: 'cashAdvanceRate',
      key: 'cashAdvanceRate',
      width: 100,
      render: (rate: number) => (
        <Text style={{ color: '#ff4d4f' }}>
          {(rate * 100).toFixed(1)}%
        </Text>
      ),
    },
    {
      title: '年费',
      dataIndex: 'annualFee',
      key: 'annualFee',
      width: 100,
      render: (fee: number) => (
        <Text style={{ color: fee > 0 ? '#fa8c16' : '#52c41a' }}>
          {fee > 0 ? formatCurrency(fee) : '免费'}
        </Text>
      ),
    },
    {
      title: '备注',
      dataIndex: 'notes',
      key: 'notes',
      render: (notes: string) => (
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {notes || '-'}
        </Text>
      ),
    },
  ];

  // 计算饼图数据
  const getBankData = () => {
    const bankMap: Record<string, { limit: number, count: number }> = {};
    
    activeCards.forEach((card: CreditCard) => {
      if (!bankMap[card.bankName]) {
        bankMap[card.bankName] = { limit: 0, count: 0 };
      }
      bankMap[card.bankName].limit += card.creditLimit;
      bankMap[card.bankName].count += 1;
    });

    return Object.entries(bankMap)
      .map(([name, data]) => ({
        name: `${name} (${data.count}张)`,
        value: data.limit / 100,
        itemStyle: {
          color: getBankColor(name)
        }
      }))
      .sort((a, b) => b.value - a.value);
  };

  // 初始化饼图
  useEffect(() => {
    const chartDom = document.getElementById('cards-pie-chart');
    if (chartDom) {
      const myChart = echarts.init(chartDom);
      setChartInstance(myChart);

      const bankData = getBankData();
      const totalLimit = bankData.reduce((sum, item) => sum + item.value, 0);

      const option = {
        title: {
          text: '信用额度分布',
          subtext: `总额度: ¥${totalLimit.toLocaleString()}`,
          left: 'center',
          textStyle: {
            fontSize: 18,
            fontWeight: 'bold'
          },
          subtextStyle: {
            fontSize: 14,
            color: '#666'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: (params: any) => {
            const percent = ((params.value / totalLimit) * 100).toFixed(1);
            return `${params.name}<br/>额度: ¥${params.value.toLocaleString()}<br/>占比: ${percent}%`;
          }
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: 'middle',
          textStyle: {
            fontSize: 12
          }
        },
        series: [
          {
            name: '信用额度',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['60%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 8,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
                fontWeight: 'bold',
                formatter: (params: any) => {
                  const percent = ((params.value / totalLimit) * 100).toFixed(1);
                  return `${params.name}\n¥${params.value.toLocaleString()}\n${percent}%`;
                }
              }
            },
            labelLine: {
              show: false
            },
            data: bankData
          }
        ]
      };

      myChart.setOption(option);

      // 响应式处理
      const handleResize = () => {
        myChart.resize();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        myChart.dispose();
      };
    }
  }, []);

  const handleBack = () => {
    navigate('/');
  };

  // 计算统计数据
  const totalLimit = activeCards.reduce((sum, card) => sum + card.creditLimit, 0);
  const totalCards = activeCards.length;
  const avgCashAdvanceRate = activeCards.reduce((sum, card) => sum + card.cashAdvanceRate, 0) / totalCards;
  const cardsWithFee = activeCards.filter(card => card.annualFee > 0).length;

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <Space>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
            style={{ marginRight: '8px' }}
          >
            返回
          </Button>
          <Title level={2} style={{ margin: 0 }}>
            <CreditCardOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
            信用卡管理
          </Title>
        </Space>
        <Text type="secondary" style={{ fontSize: '14px', marginLeft: '40px' }}>
          共 {totalCards} 张活跃信用卡 | 总额度 {formatCurrency(totalLimit)}
        </Text>
      </div>

      {/* 统计卡片 */}
      <div style={{ marginBottom: '24px' }}>
        <Space size="large">
          <Card size="small" style={{ minWidth: '150px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                {formatCurrency(totalLimit)}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>总信用额度</div>
            </div>
          </Card>
          <Card size="small" style={{ minWidth: '150px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#52c41a' }}>
                {totalCards}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>活跃卡片数</div>
            </div>
          </Card>
          <Card size="small" style={{ minWidth: '150px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff4d4f' }}>
                {(avgCashAdvanceRate * 100).toFixed(1)}%
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>平均套现费率</div>
            </div>
          </Card>
          <Card size="small" style={{ minWidth: '150px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fa8c16' }}>
                {cardsWithFee}/{totalCards}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>收费卡片</div>
            </div>
          </Card>
        </Space>
      </div>

      {/* 饼图 */}
      <Card 
        title={
          <Space>
            <PieChartOutlined />
            <span>银行额度分布</span>
          </Space>
        }
        style={{ marginBottom: '24px' }}
      >
        <div 
          id="cards-pie-chart" 
          style={{ width: '100%', height: '400px' }}
        />
      </Card>

      {/* 数据表格 */}
      <Card 
        title={
          <Space>
            <TableOutlined />
            <span>信用卡列表（按额度降序）</span>
          </Space>
        }
      >
        <Table<CreditCard>
          columns={columns}
          dataSource={activeCards}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条数据`,
          }}
          scroll={{ x: 800 }}
          size="middle"
        />
      </Card>
    </div>
  );
};

export default CreditCards;