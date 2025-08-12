// 测试收入计算和多币种支持
import incomeSources from '../frontend/src/data/incomeSources.json';
import type { IncomeSource } from '../shared/types';

console.log('收入数据和多币种支持测试\n');
console.log('=' * 60);

const incomeSourcesDataData = incomeSourcesData as IncomeSource[];

// 1. 计算总收入
let totalCNY = 0;
let totalHKD = 0;

console.log('收入来源详情:');
incomeSourcesData.forEach((source, index) => {
  console.log(`${index + 1}. ${source.name}`);
  console.log(`   原始金额: ${source.currency === 'CNY' ? '¥' : 'HK$'}${(source.amount / 100).toLocaleString()}`);
  console.log(`   人民币等值: ¥${(source.amountInCNY / 100).toLocaleString()}`);
  console.log(`   汇率: ${source.exchangeRate}`);
  console.log(`   类型: ${source.category}`);
  console.log(`   状态: ${source.isActive ? '活跃' : '非活跃'}`);
  console.log('');

  if (source.isActive) {
    if (source.currency === 'CNY') {
      totalCNY += source.amount;
    } else {
      totalHKD += source.amount;
    }
  }
});

// 2. 按币种汇总
const activeSources = incomeSourcesData.filter(s => s.isActive);
const totalActiveIncomeCNY = activeSources.reduce((sum, s) => sum + s.amountInCNY, 0);

console.log('=' * 60);
console.log('收入汇总:');
console.log(`人民币收入: ¥${(totalCNY / 100).toLocaleString()}`);
console.log(`港币收入: HK$${(totalHKD / 100).toLocaleString()}`);
console.log(`总收入(人民币): ¥${(totalActiveIncomeCNY / 100).toLocaleString()}`);

// 3. 按类型分组
const byCategory: Record<string, number> = {};
activeSources.forEach(source => {
  if (!byCategory[source.category]) {
    byCategory[source.category] = 0;
  }
  byCategory[source.category] += source.amountInCNY;
});

console.log('\n按类型分组:');
Object.entries(byCategory).forEach(([category, amount]) => {
  const percentage = (amount / totalActiveIncomeCNY * 100).toFixed(1);
  console.log(`${category}: ¥${(amount / 100).toLocaleString()} (${percentage}%)`);
});

// 4. 验证汇率计算
console.log('\n汇率计算验证:');
const hkdSources = activeSources.filter(s => s.currency === 'HKD');
hkdSources.forEach(source => {
  const calculatedCNY = Math.round(source.amount * source.exchangeRate);
  const difference = Math.abs(calculatedCNY - source.amountInCNY);
  console.log(`${source.name}:`);
  console.log(`  HK$${(source.amount / 100).toLocaleString()} × ${source.exchangeRate} = ¥${(calculatedCNY / 100).toLocaleString()}`);
  console.log(`  存储的CNY: ¥${(source.amountInCNY / 100).toLocaleString()}`);
  console.log(`  差异: ${difference === 0 ? '无' : `¥${(difference / 100).toFixed(2)}`}`);
});

console.log('\n=' * 60);
console.log(`月度收入总计: ¥${(totalActiveIncomeCNY / 100).toLocaleString()}`);
console.log(`年度收入估算: ¥${(totalActiveIncomeCNY * 12 / 100).toLocaleString()}`);

// 验证实际数字
const expectedValues = {
  myHKDSalary: 39000, // HK$
  rentGuangzhou: 4500, // CNY
  rentHK: 3000, // HK$
  freelance: 1000, // CNY
  yangmao: 1000, // CNY
};

console.log('\n数据验证:');
console.log('预期 vs 实际:');
console.log(`我的工资: HK$${expectedValues.myHKDSalary} vs HK$${incomeSourcesData[0].amount / 100}`);
console.log(`广州租金: ¥${expectedValues.rentGuangzhou} vs ¥${incomeSourcesData[4].amount / 100}`);
console.log(`香港租金: HK$${expectedValues.rentHK} vs HK$${incomeSourcesData[5].amount / 100}`);
console.log(`外包收入: ¥${expectedValues.freelance} vs ¥${incomeSourcesData[2].amount / 100}`);
console.log(`羊毛收入: ¥${expectedValues.yangmao} vs ¥${incomeSourcesData[3].amount / 100}`);