// 测试现金流预测功能
import { CashFlowForecastService } from '../frontend/src/services/cashFlowForecast';
import { MockDataService } from '../frontend/src/services/mockDataService';
import { IncomeCalculator } from '../frontend/src/services/incomeCalculator';
import { CreditCardCalculator } from '../frontend/src/services/creditCardCalculator';

console.log('现金流预测测试\n');
console.log('=' * 60);

// 1. 测试基础数据计算
console.log('1. 基础数据分析:');

const incomeSources = MockDataService.getIncomeSources();
const monthlyIncome = IncomeCalculator.calculateTotalMonthlyIncome(incomeSources);
console.log(`   月收入: ¥${(monthlyIncome / 100).toLocaleString()}`);

const creditCards = MockDataService.getCreditCards();
const creditCardCost = CreditCardCalculator.calculateTotalMonthlyCost(creditCards);
console.log(`   信用卡月成本: ¥${(creditCardCost / 100).toLocaleString()}`);

const loans = MockDataService.getLoans();
const loanPayments = loans.reduce((total, loan) => total + loan.monthlyPayment, 0);
console.log(`   贷款月供: ¥${(loanPayments / 100).toLocaleString()}`);

console.log('\n' + '=' * 60);

// 2. 测试月度基准计算
console.log('2. 月度基准计算:');
const baseline = CashFlowForecastService.calculateMonthlyBaseline();

console.log(`   月收入: ¥${(baseline.monthlyIncome / 100).toLocaleString()}`);
console.log(`   月支出详情:`);
console.log(`     - 信用卡成本: ¥${(baseline.monthlyExpenses.creditCardCost / 100).toLocaleString()}`);
console.log(`     - 贷款月供: ¥${(baseline.monthlyExpenses.loanPayments / 100).toLocaleString()}`);
console.log(`     - 其他定期支出: ¥${(baseline.monthlyExpenses.recurringExpenses / 100).toLocaleString()}`);
console.log(`     - 支出合计: ¥${(baseline.monthlyExpenses.total / 100).toLocaleString()}`);
console.log(`   月净现金流: ¥${(baseline.netCashFlow / 100).toLocaleString()}`);

const netFlowColor = baseline.netCashFlow >= 0 ? '✅' : '❌';
console.log(`   ${netFlowColor} 现金流状态: ${baseline.netCashFlow >= 0 ? '正现金流' : '负现金流'}`);

console.log('\n' + '=' * 60);

// 3. 测试24个月预测
console.log('3. 24个月财富增量预测:');
const wealthGrowthData = CashFlowForecastService.generateWealthGrowthData(24);

console.log(`   预测期间: 24个月`);
console.log(`   起始财富增量: ¥0`);

// 显示关键时间点
const milestones = [3, 6, 12, 18, 24];
milestones.forEach(month => {
  const data = wealthGrowthData[month - 1];
  if (data) {
    const wealthChangeSymbol = data.cumulativeWealth >= 0 ? '📈' : '📉';
    console.log(`   第${month}个月 ${wealthChangeSymbol}: ${data.cumulativeWealthFormatted}`);
  }
});

console.log('\n' + '=' * 60);

// 4. 财务指标摘要
console.log('4. 关键财务指标:');
const summary = CashFlowForecastService.getFinancialSummary();

console.log(`   当前月净现金流: ¥${(summary.currentNetCashFlow / 100).toLocaleString()}`);
console.log(`   24个月后财富预测: ¥${(summary.projectedWealthAfter24Months / 100).toLocaleString()}`);
console.log(`   年化收入: ¥${(summary.annualizedIncome / 100).toLocaleString()}`);
console.log(`   年化支出: ¥${(summary.annualizedExpense / 100).toLocaleString()}`);
console.log(`   年化净现金流: ¥${(summary.annualizedNetFlow / 100).toLocaleString()}`);

console.log('\n   支出结构分析:');
console.log(`     - 信用卡成本占比: ${summary.expenseBreakdown.creditCardCostPercent.toFixed(1)}%`);
console.log(`     - 贷款月供占比: ${summary.expenseBreakdown.loanPaymentPercent.toFixed(1)}%`);
console.log(`     - 其他支出占比: ${summary.expenseBreakdown.otherExpensePercent.toFixed(1)}%`);

console.log('\n' + '=' * 60);

// 5. 风险分析
console.log('5. 风险提示:');

if (baseline.netCashFlow <= 0) {
  console.log('   ⚠️  警告: 当前净现金流为负，财务状况需要改善');
} else {
  console.log('   ✅ 当前净现金流为正，财务状况良好');
}

const emergencyFundMonths = 6;
const emergencyFundTarget = baseline.monthlyExpenses.total * emergencyFundMonths;
console.log(`   💡 建议应急基金: ¥${(emergencyFundTarget / 100).toLocaleString()} (${emergencyFundMonths}个月支出)`);

if (summary.projectedWealthAfter24Months < emergencyFundTarget) {
  console.log('   ⚠️  24个月后财富增量仍不足以覆盖建议的应急基金');
} else {
  const monthsToEmergencyFund = Math.ceil(emergencyFundTarget / baseline.netCashFlow);
  console.log(`   ✅ 预计${monthsToEmergencyFund}个月后可建立充足的应急基金`);
}

console.log('\n✅ 现金流预测测试完成！');
console.log('\n💡 建议: 基于以上分析结果，考虑优化收入结构或降低固定支出以改善现金流状况。');