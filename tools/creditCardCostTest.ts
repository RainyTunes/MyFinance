// 测试信用卡套现成本计算
import creditCards from '../frontend/src/data/creditCards.json';
import type { CreditCard } from '../shared/types';

// 模拟计算器逻辑（简化版）
function calculateMonthlyCost(card: CreditCard) {
  const cashAdvanceRate = 0.006; // 0.6%

  const monthlyCashAdvanceFee = Math.round(card.creditLimit * cashAdvanceRate);
  const monthlyAnnualFee = Math.round(card.annualFee / 12);
  const totalMonthlyCost = monthlyCashAdvanceFee + monthlyAnnualFee;

  return {
    cardNumber: card.cardNumber,
    bankName: card.bankName,
    creditLimit: card.creditLimit / 100, // 转为元
    annualFee: card.annualFee / 100,
    monthlyCashAdvanceFee: monthlyCashAdvanceFee / 100,
    monthlyAnnualFee: monthlyAnnualFee / 100,
    totalMonthlyCost: totalMonthlyCost / 100
  };
}

console.log('信用卡套现成本计算测试\n');
console.log('=' * 60);

const creditCardsData = creditCards as CreditCard[];
let totalMonthlyCost = 0;
let totalCreditLimit = 0;

creditCardsData.forEach(card => {
  const cost = calculateMonthlyCost(card);
  console.log(`${cost.cardNumber} - ${cost.bankName} ${card.cardType}`);
  console.log(`  额度: ¥${cost.creditLimit.toLocaleString()}`);
  console.log(`  年费: ¥${cost.annualFee.toLocaleString()}`);
  console.log(`  月套现费: ¥${cost.monthlyCashAdvanceFee.toFixed(2)}`);
  console.log(`  月年费分摊: ¥${cost.monthlyAnnualFee.toFixed(2)}`);
  console.log(`  月总成本: ¥${cost.totalMonthlyCost.toFixed(2)}`);
  console.log('');
  
  totalMonthlyCost += cost.totalMonthlyCost;
  totalCreditLimit += cost.creditLimit;
});

console.log('=' * 60);
console.log(`总额度: ¥${totalCreditLimit.toLocaleString()}`);
console.log(`总月成本: ¥${totalMonthlyCost.toFixed(2)}`);
console.log(`年化成本率: ${((totalMonthlyCost * 12 / totalCreditLimit) * 100).toFixed(2)}%`);

// 与CSV汇总对比
console.log('\nCSV汇总数据对比:');
console.log(`CSV总额度: ¥1,218,200 vs 计算总额度: ¥${totalCreditLimit.toLocaleString()}`);
console.log(`CSV年费总计: ¥6,860 vs 计算年费: ¥${(creditCardsData.reduce((sum, card) => sum + card.annualFee, 0) / 100).toLocaleString()}`);