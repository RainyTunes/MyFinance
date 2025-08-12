import React from 'react';
import { Card, Row, Col, Statistic, Typography, Divider, Alert } from 'antd';
import { 
  RiseOutlined, 
  FallOutlined, 
  DollarOutlined,
  CalendarOutlined,
  BarChartOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import WealthGrowthChart from '../../components/charts/WealthGrowthChart';
import { CashFlowForecastService } from '../../services/cashFlowForecast';

const { Title, Paragraph, Text } = Typography;

const ForecastPage: React.FC = () => {
  // 获取财务摘要数据
  const financialSummary = CashFlowForecastService.getFinancialSummary();
  
  // 格式化金额显示
  const formatCurrency = (amount: number, showSymbol = true) => {
    const value = Math.abs(amount) / 100;
    const formatted = value.toLocaleString('zh-CN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    
    if (showSymbol) {
      return amount >= 0 ? `¥${formatted}` : `-¥${formatted}`;
    }
    return formatted;
  };

  const getStatisticValueStyle = (value: number) => ({
    color: value >= 0 ? '#52c41a' : '#ff4d4f'
  });

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ marginBottom: '8px' }}>
          <BarChartOutlined style={{ marginRight: '8px' }} />
          现金流预测分析
        </Title>
        <Paragraph type="secondary">
          基于当前收入结构和支出模式，预测未来24个月的财富变化趋势
        </Paragraph>
      </div>

      {/* 提示信息 */}
      <Alert
        message="预测说明"
        description="本预测基于当前的收入来源、信用卡套现成本、贷款月供等数据计算。实际结果可能因市场变化、个人支出调整等因素而有所不同。"
        type="info"
        icon={<InfoCircleOutlined />}
        style={{ marginBottom: '24px' }}
        showIcon
      />

      {/* 关键指标卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="月收入"
              value={financialSummary.currentMonthlyIncome / 100}
              precision={0}
              prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
              formatter={(value) => `¥${Number(value).toLocaleString()}`}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="月支出"
              value={financialSummary.currentMonthlyExpense / 100}
              precision={0}
              prefix={<FallOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
              formatter={(value) => `¥${Number(value).toLocaleString()}`}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="月净现金流"
              value={financialSummary.currentNetCashFlow / 100}
              precision={0}
              prefix={
                financialSummary.currentNetCashFlow >= 0 ? 
                <RiseOutlined style={{ color: '#52c41a' }} /> : 
                <FallOutlined style={{ color: '#ff4d4f' }} />
              }
              valueStyle={getStatisticValueStyle(financialSummary.currentNetCashFlow)}
              formatter={(value) => formatCurrency(Number(value) * 100)}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="24个月后预计财富增量"
              value={financialSummary.projectedWealthAfter24Months / 100}
              precision={0}
              prefix={<CalendarOutlined />}
              valueStyle={getStatisticValueStyle(financialSummary.projectedWealthAfter24Months)}
              formatter={(value) => formatCurrency(Number(value) * 100)}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要图表 */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="财富增量趋势图" bodyStyle={{ padding: '20px' }}>
            <WealthGrowthChart months={24} height={500} />
          </Card>
        </Col>
      </Row>

      {/* 详细分析 */}
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title="支出结构分析" bodyStyle={{ padding: '20px' }}>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Text strong>信用卡成本</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text>{financialSummary.expenseBreakdown.creditCardCostPercent.toFixed(1)}%</Text>
              </Col>
            </Row>
            <Divider style={{ margin: '8px 0' }} />
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Text strong>贷款月供</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text>{financialSummary.expenseBreakdown.loanPaymentPercent.toFixed(1)}%</Text>
              </Col>
            </Row>
            <Divider style={{ margin: '8px 0' }} />
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Text strong>其他支出</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text>{financialSummary.expenseBreakdown.otherExpensePercent.toFixed(1)}%</Text>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="贷款债务分析" bodyStyle={{ padding: '20px' }}>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Text strong>活跃贷款数量</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text>{financialSummary.loanAnalysis.activeLoanCount}个</Text>
              </Col>
            </Row>
            <Divider style={{ margin: '8px 0' }} />
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Text strong>剩余债务总额</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text style={{ color: '#ff4d4f' }}>
                  {formatCurrency(financialSummary.loanAnalysis.totalRemainingDebt)}
                </Text>
              </Col>
            </Row>
            <Divider style={{ margin: '8px 0' }} />
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Text strong>债务收入比</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text style={{ color: financialSummary.loanAnalysis.debtToIncomeRatio > 50 ? '#ff4d4f' : '#faad14' }}>
                  {financialSummary.loanAnalysis.debtToIncomeRatio.toFixed(1)}%
                </Text>
              </Col>
            </Row>
            <Divider style={{ margin: '8px 0' }} />
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Text strong>还款进度</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text style={{ color: '#52c41a' }}>
                  {financialSummary.loanAnalysis.repaymentProgress.toFixed(1)}%
                </Text>
              </Col>
            </Row>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="年化数据预测" bodyStyle={{ padding: '20px' }}>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Text strong>年收入</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text style={{ color: '#52c41a' }}>
                  {formatCurrency(financialSummary.annualizedIncome)}
                </Text>
              </Col>
            </Row>
            <Divider style={{ margin: '8px 0' }} />
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Text strong>年支出</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text style={{ color: '#ff4d4f' }}>
                  {formatCurrency(financialSummary.annualizedExpense)}
                </Text>
              </Col>
            </Row>
            <Divider style={{ margin: '8px 0' }} />
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Text strong>年净现金流</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text style={getStatisticValueStyle(financialSummary.annualizedNetFlow)}>
                  {formatCurrency(financialSummary.annualizedNetFlow)}
                </Text>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 贷款明细分析 */}
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title="主要贷款明细" bodyStyle={{ padding: '20px' }}>
            <Row gutter={[16, 16]}>
              {financialSummary.loanAnalysis.topLoansByPayment.slice(0, 4).map((loan, index) => (
                <Col xs={24} sm={12} lg={6} key={loan.id}>
                  <Card 
                    size="small" 
                    style={{ 
                      backgroundColor: index === 0 ? '#fff2e8' : '#fafafa',
                      border: index === 0 ? '1px solid #ffa940' : '1px solid #e8e8e8'
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <Text strong style={{ fontSize: '12px', color: '#666' }}>
                        {loan.name}
                      </Text>
                      <br />
                      <Text style={{ 
                        fontSize: '16px', 
                        fontWeight: 'bold',
                        color: index === 0 ? '#fa8c16' : '#262626'
                      }}>
                        {formatCurrency(loan.monthlyPayment)}
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '11px' }}>
                        占比 {loan.percentage.toFixed(1)}%
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '10px' }}>
                        余额 {formatCurrency(loan.remainingBalance)}
                      </Text>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
            
            {financialSummary.loanAnalysis.activeLoanCount > 4 && (
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <Text type="secondary">
                  显示前4个主要贷款，共{financialSummary.loanAnalysis.activeLoanCount}个活跃贷款
                </Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ForecastPage;