import React, { useState, useEffect } from 'react';
import { Card, Table, Typography, Space, Button, Tag, Progress } from 'antd';
import { BankOutlined, ArrowLeftOutlined, PieChartOutlined, TableOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import * as echarts from 'echarts';
import loansData from '../../data/loans.json';

const { Title, Text } = Typography;

interface Loan {
  id: string;
  name: string;
  principal: number;
  monthlyPayment: number;
  startDate: string | null;
  endDate: string | null;
  totalTerms: number | null;
  remainingTerms: number | null;
  paidPrincipal: number;
  remainingBalance: number;
  timeToMaturity: string | null;
  notes: string | null;
  bankName: string;
  loanType: string;
  isActive: boolean;
  lastUpdated: string;
  floatingPayment?: {
    enabled: boolean;
    basePayment: number;
    monthlyDecrement: number;
    baseDate: string;
  };
}

const Loans: React.FC = () => {
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

  // 获取贷款类型颜色
  const getLoanTypeColor = (loanType: string) => {
    const colors: Record<string, string> = {
      'mortgage': '#ff4d4f',
      'personal': '#fa8c16',
      'business': '#52c41a',
      'auto': '#1890ff',
      'credit': '#722ed1'
    };
    return colors[loanType] || '#666666';
  };

  // 获取贷款类型中文名
  const getLoanTypeName = (loanType: string) => {
    const names: Record<string, string> = {
      'mortgage': '房贷',
      'personal': '个人贷',
      'business': '企业贷',
      'auto': '车贷',
      'credit': '信用贷'
    };
    return names[loanType] || loanType;
  };

  // 过滤活跃的贷款并按月供排序
  const activeLoans = (loansData as Loan[])
    .filter((loan: Loan) => loan.isActive)
    .sort((a: Loan, b: Loan) => b.monthlyPayment - a.monthlyPayment);

  // 表格列定义
  const columns: ColumnsType<Loan> = [
    {
      title: '贷款名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Loan) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.bankName}
          </Text>
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'loanType',
      key: 'loanType',
      width: 100,
      render: (loanType: string) => (
        <Tag color={getLoanTypeColor(loanType)}>
          {getLoanTypeName(loanType)}
        </Tag>
      ),
    },
    {
      title: '月供',
      dataIndex: 'monthlyPayment',
      key: 'monthlyPayment',
      width: 140,
      render: (payment: number) => (
        <Text strong style={{ color: '#ff4d4f', fontSize: '16px' }}>
          {formatCurrency(payment)}
        </Text>
      ),
    },
    {
      title: '剩余本金',
      dataIndex: 'remainingBalance',
      key: 'remainingBalance',
      width: 140,
      render: (balance: number) => (
        <Text style={{ color: '#fa8c16' }}>
          {formatCurrency(balance)}
        </Text>
      ),
    },
    {
      title: '原始本金',
      dataIndex: 'principal',
      key: 'principal',
      width: 140,
      render: (principal: number) => (
        <Text type="secondary">
          {formatCurrency(principal)}
        </Text>
      ),
    },
    {
      title: '还款进度',
      dataIndex: 'paidPrincipal',
      key: 'progress',
      width: 120,
      render: (paidPrincipal: number, record: Loan) => {
        const progress = (paidPrincipal / record.principal) * 100;
        return (
          <Space direction="vertical" size={0}>
            <Progress 
              percent={progress} 
              size="small" 
              strokeColor="#52c41a"
              showInfo={false}
            />
            <Text style={{ fontSize: '12px' }}>
              {progress.toFixed(1)}%
            </Text>
          </Space>
        );
      },
    },
    {
      title: '备注',
      dataIndex: 'notes',
      key: 'notes',
      render: (notes: string | null) => (
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {notes || '-'}
        </Text>
      ),
    },
  ];

  // 计算饼图数据
  const getLoanTypeData = () => {
    const typeMap: Record<string, { payment: number, count: number }> = {};
    
    activeLoans.forEach((loan: Loan) => {
      const typeName = getLoanTypeName(loan.loanType);
      if (!typeMap[typeName]) {
        typeMap[typeName] = { payment: 0, count: 0 };
      }
      typeMap[typeName].payment += loan.monthlyPayment;
      typeMap[typeName].count += 1;
    });

    return Object.entries(typeMap)
      .map(([name, data]) => ({
        name: `${name} (${data.count}笔)`,
        value: data.payment / 100,
        itemStyle: {
          color: getLoanTypeColor(Object.keys(typeMap).find(key => getLoanTypeName(key) === name) || '')
        }
      }))
      .sort((a, b) => b.value - a.value);
  };

  // 初始化饼图
  useEffect(() => {
    const chartDom = document.getElementById('loans-pie-chart');
    if (chartDom) {
      const myChart = echarts.init(chartDom);
      setChartInstance(myChart);

      const loanTypeData = getLoanTypeData();
      const totalPayment = loanTypeData.reduce((sum, item) => sum + item.value, 0);

      const option = {
        title: {
          text: '月供分布',
          subtext: `总月供: ¥${totalPayment.toLocaleString()}`,
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
            const percent = ((params.value / totalPayment) * 100).toFixed(1);
            return `${params.name}<br/>月供: ¥${params.value.toLocaleString()}<br/>占比: ${percent}%`;
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
            name: '贷款月供',
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
                  const percent = ((params.value / totalPayment) * 100).toFixed(1);
                  return `${params.name}\n¥${params.value.toLocaleString()}\n${percent}%`;
                }
              }
            },
            labelLine: {
              show: false
            },
            data: loanTypeData
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
  const totalMonthlyPayment = activeLoans.reduce((sum, loan) => sum + loan.monthlyPayment, 0);
  const totalRemainingBalance = activeLoans.reduce((sum, loan) => sum + loan.remainingBalance, 0);
  const totalPaidPrincipal = activeLoans.reduce((sum, loan) => sum + loan.paidPrincipal, 0);
  const avgProgress = activeLoans.reduce((sum, loan) => sum + (loan.paidPrincipal / loan.principal), 0) / activeLoans.length * 100;

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
            <BankOutlined style={{ marginRight: '8px', color: '#fa8c16' }} />
            贷款管理
          </Title>
        </Space>
        <Text type="secondary" style={{ fontSize: '14px', marginLeft: '40px' }}>
          共 {activeLoans.length} 笔活跃贷款 | 月供总计 {formatCurrency(totalMonthlyPayment)}
        </Text>
      </div>

      {/* 统计卡片 */}
      <div style={{ marginBottom: '24px' }}>
        <Space size="large">
          <Card size="small" style={{ minWidth: '150px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f' }}>
                {formatCurrency(totalMonthlyPayment)}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>月供总额</div>
            </div>
          </Card>
          <Card size="small" style={{ minWidth: '150px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fa8c16' }}>
                {formatCurrency(totalRemainingBalance)}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>剩余本金</div>
            </div>
          </Card>
          <Card size="small" style={{ minWidth: '150px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#52c41a' }}>
                {formatCurrency(totalPaidPrincipal)}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>已还本金</div>
            </div>
          </Card>
          <Card size="small" style={{ minWidth: '150px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
                {avgProgress.toFixed(1)}%
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>平均进度</div>
            </div>
          </Card>
        </Space>
      </div>

      {/* 饼图 */}
      <Card 
        title={
          <Space>
            <PieChartOutlined />
            <span>月供分布分析</span>
          </Space>
        }
        style={{ marginBottom: '24px' }}
      >
        <div 
          id="loans-pie-chart" 
          style={{ width: '100%', height: '400px' }}
        />
      </Card>

      {/* 数据表格 */}
      <Card 
        title={
          <Space>
            <TableOutlined />
            <span>贷款列表（按月供降序）</span>
          </Space>
        }
      >
        <Table<Loan>
          columns={columns}
          dataSource={activeLoans}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条数据`,
          }}
          scroll={{ x: 1000 }}
          size="middle"
        />
      </Card>
    </div>
  );
};

export default Loans;