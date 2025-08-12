// 测试动态贷款到期处理
import { LoanCalculator } from '../frontend/src/services/loanCalculator.js';
import { CashFlowForecastService } from '../frontend/src/services/cashFlowForecast.js';

console.log('🧪 测试动态贷款到期处理\n');
console.log('=' + '='.repeat(60));

// 模拟贷款数据（简化版）
const testLoans = [
  {
    id: "loan003",
    name: "xka的闪电贷",
    principal: 25000000,
    monthlyPayment: 1428800,
    remainingTerms: 6, // 剩余6期
    isActive: true
  },
  {
    id: "loan004", 
    name: "我的广农消费分期",
    principal: 17000000,
    monthlyPayment: 321600,
    remainingTerms: 26, // 剩余26期
    isActive: true
  },
  {
    id: "loan007",
    name: "我的工行快贷",
    principal: 29200000,
    monthlyPayment: 124600,
    remainingTerms: null, // 无期限限制
    isActive: true
  }
];

console.log('\n1. 测试贷款在不同月份的活跃状态:');

// 测试不同月份的贷款活跃状态
const testMonths = [
  { month: '2025-08', desc: '当前月份' },
  { month: '2025-12', desc: '4个月后' },
  { month: '2026-02', desc: '6个月后（闪电贷到期）' },
  { month: '2026-03', desc: '7个月后（闪电贷已还完）' },
  { month: '2027-10', desc: '26个月后（广农分期到期）' }
];

testMonths.forEach(({ month, desc }) => {
  const testDate = new Date(month + '-01');
  console.log(`\n${desc} (${month}):`);
  
  testLoans.forEach(loan => {
    const isActive = LoanCalculator.isLoanActiveInMonth(loan, testDate);
    const status = isActive ? '✅ 活跃' : '❌ 已还完';
    console.log(`  ${loan.name}: ${status}`);
  });
  
  const totalPayment = LoanCalculator.calculateMonthlyPaymentForMonth(testLoans, testDate);
  console.log(`  📊 当月总月供: ¥${(totalPayment / 100).toLocaleString()}`);
});

console.log('\n' + '=' + '='.repeat(60));
console.log('\n2. 测试24个月现金流预测变化:');

// 生成预测数据看看是否有变化
const wealthData = CashFlowForecastService.generateWealthGrowthData(24);

// 显示关键月份的现金流变化
const keyMonths = [0, 5, 6, 7, 11, 23]; // 对应的数组索引
keyMonths.forEach(index => {
  if (wealthData[index]) {
    const data = wealthData[index];
    console.log(`${data.month}: 月净现金流 ¥${(data.monthlyNetFlow / 100).toLocaleString()}, 累计财富 ${data.cumulativeWealthFormatted}`);
  }
});

console.log('\n✅ 动态贷款测试完成！');
console.log('\n💡 预期结果: 从2026年3月开始，月净现金流应该增加¥14,288（闪电贷还完后）');