import React, { useState, useEffect } from 'react';
import { Card, Table, Typography, Space, Button, Tag } from 'antd';
import { HomeOutlined, ArrowLeftOutlined, PieChartOutlined, TableOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import * as echarts from 'echarts';
import livingExpensesData from '../../data/livingExpenses.json';

const { Title, Text } = Typography;

interface LivingExpense {
  id: string;
  name: string;
  amount: number;
  currency: string;
  amountInCNY: number;
  exchangeRate: number;
  category: string;
  description: string;
  isRecurring: boolean;
  recurringPattern: string;
  isActive: boolean;
  lastUpdated: string;
}

const LivingExpenses: React.FC = () => {
  const navigate = useNavigate();
  const [, setChartInstance] = useState<echarts.ECharts | null>(null);

  // 格式化金额显示
  const formatCurrency = (amount: number, currency: string = 'CNY') => {
    const value = amount / 100;
    const symbol = currency === 'HKD' ? 'HK$' : '¥';
    return `${symbol}${value.toLocaleString('zh-CN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;
  };

  // 获取分类颜色
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'housing': '#ff4d4f',
      'utilities': '#fa8c16',
      'food': '#52c41a',
      'transportation': '#1890ff',
      'healthcare': '#722ed1',
      'entertainment': '#eb2f96',
      'education': '#faad14',
      'shopping': '#13c2c2',
      'other': '#666666'
    };
    return colors[category] || '#666666';
  };

  // 获取分类中文名
  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      'housing': '住房',
      'utilities': '水电气',
      'food': '餐饮',
      'transportation': '交通',
      'healthcare': '医疗',
      'entertainment': '娱乐',
      'education': '教育',
      'shopping': '购物',
      'other': '其他'
    };
    return names[category] || category;
  };

  // 过滤活跃的支出项并按金额排序
  const activeExpenses = livingExpensesData
    .filter((expense: LivingExpense) => expense.isActive)
    .sort((a: LivingExpense, b: LivingExpense) => b.amountInCNY - a.amountInCNY);

  // 表格列定义
  const columns: ColumnsType<LivingExpense> = [
    {
      title: '支出项目',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: LivingExpense) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.description}
          </Text>
        </Space>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category: string) => (
        <Tag color={getCategoryColor(category)}>
          {getCategoryName(category)}
        </Tag>
      ),
    },
    {
      title: '原币种金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount: number, record: LivingExpense) => (
        <Text>{formatCurrency(amount, record.currency)}</Text>
      ),
    },
    {
      title: '人民币金额',
      dataIndex: 'amountInCNY',
      key: 'amountInCNY',
      width: 120,
      render: (amount: number) => (
        <Text strong style={{ color: '#ff4d4f' }}>
          {formatCurrency(amount)}
        </Text>
      ),
    },
    {
      title: '币种',
      dataIndex: 'currency',
      key: 'currency',
      width: 80,
      render: (currency: string) => (
        <Tag color={currency === 'HKD' ? 'orange' : 'blue'}>
          {currency}
        </Tag>
      ),
    },
    {
      title: '汇率',
      dataIndex: 'exchangeRate',
      key: 'exchangeRate',
      width: 80,
      render: (rate: number, record: LivingExpense) => (
        record.currency === 'HKD' ? <Text type="secondary">{rate}</Text> : <Text type="secondary">1.00</Text>
      ),
    },
    {
      title: '类型',
      dataIndex: 'recurringPattern',
      key: 'recurringPattern',
      width: 80,
      render: (pattern: string) => (
        <Tag color="green">{pattern === 'monthly' ? '月度' : '一次性'}</Tag>
      ),
    },
  ];

  // 计算饼图数据
  const getCategoryData = () => {
    const categoryMap: Record<string, number> = {};
    
    activeExpenses.forEach((expense: LivingExpense) => {
      const categoryName = getCategoryName(expense.category);
      if (!categoryMap[categoryName]) {
        categoryMap[categoryName] = 0;
      }
      categoryMap[categoryName] += expense.amountInCNY;
    });

    return Object.entries(categoryMap)
      .map(([name, value]) => ({
        name,
        value: value / 100,
        itemStyle: {
          color: getCategoryColor(Object.keys(categoryMap).find(key => getCategoryName(key) === name) || '')
        }
      }))
      .sort((a, b) => b.value - a.value);
  };

  // 初始化饼图
  useEffect(() => {
    const chartDom = document.getElementById('expenses-pie-chart');
    if (chartDom) {
      const myChart = echarts.init(chartDom);
      setChartInstance(myChart);

      const categoryData = getCategoryData();
      const totalAmount = categoryData.reduce((sum, item) => sum + item.value, 0);

      const option = {
        title: {
          text: '生活开销分类分布',
          subtext: `总计: ¥${totalAmount.toLocaleString()}`,
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
            const percent = ((params.value / totalAmount) * 100).toFixed(1);
            return `${params.name}<br/>金额: ¥${params.value.toLocaleString()}<br/>占比: ${percent}%`;
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
            name: '生活开销',
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
                  const percent = ((params.value / totalAmount) * 100).toFixed(1);
                  return `${params.name}\n¥${params.value.toLocaleString()}\n${percent}%`;
                }
              }
            },
            labelLine: {
              show: false
            },
            data: categoryData
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
  const totalAmount = activeExpenses.reduce((sum, expense) => sum + expense.amountInCNY, 0);
  const hkdAmount = activeExpenses
    .filter(expense => expense.currency === 'HKD')
    .reduce((sum, expense) => sum + expense.amountInCNY, 0);
  const cnyAmount = activeExpenses
    .filter(expense => expense.currency === 'CNY')
    .reduce((sum, expense) => sum + expense.amountInCNY, 0);

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
            <HomeOutlined style={{ marginRight: '8px', color: '#ff4d4f' }} />
            生活开销管理
          </Title>
        </Space>
        <Text type="secondary" style={{ fontSize: '14px', marginLeft: '40px' }}>
          共 {activeExpenses.length} 项活跃支出 | 月度总计 {formatCurrency(totalAmount)}
        </Text>
      </div>

      {/* 统计卡片 */}
      <div style={{ marginBottom: '24px' }}>
        <Space size="large">
          <Card size="small" style={{ minWidth: '150px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f' }}>
                {formatCurrency(totalAmount)}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>月度总支出</div>
            </div>
          </Card>
          <Card size="small" style={{ minWidth: '150px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fa8c16' }}>
                {formatCurrency(hkdAmount)}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>港币支出</div>
            </div>
          </Card>
          <Card size="small" style={{ minWidth: '150px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
                {formatCurrency(cnyAmount)}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>人民币支出</div>
            </div>
          </Card>
        </Space>
      </div>

      {/* 饼图 */}
      <Card 
        title={
          <Space>
            <PieChartOutlined />
            <span>支出分类分析</span>
          </Space>
        }
        style={{ marginBottom: '24px' }}
      >
        <div 
          id="expenses-pie-chart" 
          style={{ width: '100%', height: '400px' }}
        />
      </Card>

      {/* 数据表格 */}
      <Card 
        title={
          <Space>
            <TableOutlined />
            <span>详细支出列表（按金额降序）</span>
          </Space>
        }
      >
        <Table<LivingExpense>
          columns={columns}
          dataSource={activeExpenses}
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

export default LivingExpenses;