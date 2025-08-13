import { MockDataService } from './mockDataService';
import { IncomeCalculator } from './incomeCalculator';
import { CreditCardCalculator } from './creditCardCalculator';
import { LoanCalculator } from './loanCalculator';
import { LivingExpenseCalculator } from './livingExpenseCalculator';
import type { CashFlowRecord, Loan, CashFlowForecast, IncomeSource, CreditCard, LivingExpense } from '../types';

/**
 * 现金流预测服务
 */
export class CashFlowForecastService {
  
  /**
   * 计算当前月度基础现金流
   * @returns 月度现金流基础数据
   */
  static calculateMonthlyBaseline() {
    // 1. 计算月度收入
    const incomeSources = MockDataService.getIncomeSources() as IncomeSource[];
    const monthlyIncome = IncomeCalculator.calculateTotalMonthlyIncome(incomeSources);
    
    // 2. 计算信用卡套现成本
    const creditCards = MockDataService.getCreditCards() as CreditCard[];
    const creditCardCost = CreditCardCalculator.calculateTotalMonthlyCost(creditCards);
    
    // 3. 计算贷款月供
    const loans = MockDataService.getLoans() as Loan[];
    const loanPayments = LoanCalculator.calculateTotalMonthlyPayment(loans);
    
    // 4. 计算生活开销
    const livingExpenses = MockDataService.getLivingExpenses() as LivingExpense[];
    const livingExpenseCost = LivingExpenseCalculator.calculateTotalMonthlyExpense(livingExpenses);
    
    // 5. 计算其他定期支出 (从现金流记录中提取定期支出)
    const cashFlowRecords = MockDataService.getCashFlowRecords() as CashFlowRecord[];
    const recurringExpenses = cashFlowRecords
      .filter((record) => 
        record.type === 'expense' && 
        record.isRecurring && 
        record.recurringPattern === 'monthly'
      )
      .reduce((total, record) => total + record.amount, 0);
    
    // 6. 计算净现金流
    const totalMonthlyExpense = creditCardCost + loanPayments + livingExpenseCost + recurringExpenses;
    const netCashFlow = monthlyIncome - totalMonthlyExpense;
    
    return {
      monthlyIncome,
      monthlyExpenses: {
        creditCardCost,
        loanPayments,
        livingExpenseCost,
        recurringExpenses,
        total: totalMonthlyExpense
      },
      netCashFlow,
      breakdown: {
        totalIncome: monthlyIncome,
        totalExpense: totalMonthlyExpense,
        netFlow: netCashFlow
      }
    };
  }
  
  /**
   * 生成未来N个月的现金流预测
   * @param months 预测月数
   * @param startDate 起始日期
   * @returns 现金流预测数组
   */
  static generateForecast(months: number = 120, startDate: Date = new Date('2025-08-01')): CashFlowForecast[] {
    const forecasts: CashFlowForecast[] = [];
    
    // 获取贷款数据用于动态计算
    const loans = MockDataService.getLoans() as Loan[];
    const incomeSources = MockDataService.getIncomeSources() as IncomeSource[];
    const monthlyIncome = IncomeCalculator.calculateTotalMonthlyIncome(incomeSources);
    const creditCards = MockDataService.getCreditCards() as CreditCard[];
    const creditCardCost = CreditCardCalculator.calculateTotalMonthlyCost(creditCards);
    const livingExpenses = MockDataService.getLivingExpenses() as LivingExpense[];
    const livingExpenseCost = LivingExpenseCalculator.calculateTotalMonthlyExpense(livingExpenses);
    const cashFlowRecords = MockDataService.getCashFlowRecords() as CashFlowRecord[];
    const recurringExpenses = cashFlowRecords
      .filter((record) => 
        record.type === 'expense' && 
        record.isRecurring && 
        record.recurringPattern === 'monthly'
      )
      .reduce((total, record) => total + record.amount, 0);
    
    let cumulativeWealth = 0; // 累计财富增量
    
    for (let i = 0; i < months; i++) {
      const forecastDate = new Date(startDate);
      forecastDate.setMonth(forecastDate.getMonth() + i);
      
      // 动态计算该月的贷款月供（考虑贷款到期）
      const dynamicLoanPayments = LoanCalculator.calculateMonthlyPaymentForMonth(loans, forecastDate);
      
      // 重新计算该月的总支出
      const totalMonthlyExpense = creditCardCost + dynamicLoanPayments + livingExpenseCost + recurringExpenses;
      const netFlow = monthlyIncome - totalMonthlyExpense;
      
      // 累计财富变化
      cumulativeWealth += netFlow;
      
      forecasts.push({
        date: forecastDate.toISOString().slice(0, 7), // YYYY-MM 格式
        predictedIncome: monthlyIncome,
        predictedExpense: totalMonthlyExpense,
        predictedBalance: netFlow,
        confidence: 0.85 // 基础置信度85%
      });
    }
    
    return forecasts;
  }
  
  /**
   * 生成财富增量数据（相对于起始点的累计变化）
   * @param months 预测月数
   * @param startDate 起始日期
   * @returns 财富增量数据
   */
  static generateWealthGrowthData(months: number = 120, startDate: Date = new Date('2025-08-01')) {
    const forecasts = this.generateForecast(months, startDate);
    
    const wealthGrowthData: Array<{
      month: string;
      monthlyNetFlow: number;
      cumulativeWealth: number;
      cumulativeWealthFormatted: string;
    }> = [];
    let cumulativeWealth = 0;
    
    forecasts.forEach((forecast) => {
      cumulativeWealth += forecast.predictedBalance;
      
      wealthGrowthData.push({
        month: forecast.date,
        monthlyNetFlow: forecast.predictedBalance,
        cumulativeWealth: cumulativeWealth,
        cumulativeWealthFormatted: (cumulativeWealth / 100).toLocaleString('zh-CN', {
          style: 'currency',
          currency: 'CNY',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        })
      });
    });
    
    return wealthGrowthData;
  }
  
  /**
   * 获取关键财务指标摘要
   * @returns 财务指标摘要
   */
  static getFinancialSummary() {
    const baseline = this.calculateMonthlyBaseline();
    const wealthData = this.generateWealthGrowthData();
    
    // 获取贷款分析
    const loans = MockDataService.getLoans() as Loan[];
    const loanAnalysis = LoanCalculator.analyzeLoanStructure(loans);
    const debtToIncomeRatio = LoanCalculator.calculateDebtToIncomeRatio(
      baseline.monthlyExpenses.loanPayments, 
      baseline.monthlyIncome
    );
    
    // 获取生活开销分析
    const livingExpenses = MockDataService.getLivingExpenses() as LivingExpense[];
    const livingExpenseAnalysis = LivingExpenseCalculator.analyzeLivingExpenses(livingExpenses);
    const livingExpenseToIncomeRatio = LivingExpenseCalculator.calculateExpenseToIncomeRatio(
      livingExpenseAnalysis.totalMonthlyExpense,
      baseline.monthlyIncome
    );
    
    // 找到最高和最低点
    const wealthValues = wealthData.map(d => d.cumulativeWealth);
    const maxWealth = Math.max(...wealthValues);
    const minWealth = Math.min(...wealthValues);
    const finalWealth = wealthValues[wealthValues.length - 1];
    
    return {
      currentMonthlyIncome: baseline.monthlyIncome,
      currentMonthlyExpense: baseline.monthlyExpenses.total,
      currentNetCashFlow: baseline.netCashFlow,
      
      // 预测摘要（10年期）
      projectedWealthAfter120Months: finalWealth,
      projectedWealthAfter24Months: wealthData[23]?.cumulativeWealth || 0,
      projectedWealthAfter36Months: wealthData[35]?.cumulativeWealth || 0,
      projectedWealthAfter60Months: wealthData[59]?.cumulativeWealth || 0,
      projectedWealthAfter84Months: wealthData[83]?.cumulativeWealth || 0, // 7年
      projectedMaxWealth: maxWealth,
      projectedMinWealth: minWealth,
      
      // 年化数据
      annualizedIncome: baseline.monthlyIncome * 12,
      annualizedExpense: baseline.monthlyExpenses.total * 12,
      annualizedNetFlow: baseline.netCashFlow * 12,
      
      // 收支结构
      expenseBreakdown: {
        creditCardCostPercent: baseline.monthlyExpenses.total > 0 ? (baseline.monthlyExpenses.creditCardCost / baseline.monthlyExpenses.total) * 100 : 0,
        loanPaymentPercent: baseline.monthlyExpenses.total > 0 ? (baseline.monthlyExpenses.loanPayments / baseline.monthlyExpenses.total) * 100 : 0,
        livingExpensePercent: baseline.monthlyExpenses.total > 0 ? (baseline.monthlyExpenses.livingExpenseCost / baseline.monthlyExpenses.total) * 100 : 0,
        otherExpensePercent: baseline.monthlyExpenses.total > 0 ? (baseline.monthlyExpenses.recurringExpenses / baseline.monthlyExpenses.total) * 100 : 0
      },
      
      // 新增：贷款详细分析
      loanAnalysis: {
        totalMonthlyPayment: loanAnalysis.summary.totalMonthlyPayment,
        totalRemainingDebt: loanAnalysis.summary.totalRemainingDebt,
        activeLoanCount: loanAnalysis.summary.activeLoanCount,
        repaymentProgress: loanAnalysis.summary.repaymentProgress,
        debtToIncomeRatio,
        loansByType: loanAnalysis.breakdown.byType,
        topLoansByPayment: loanAnalysis.breakdown.byMonthlyPayment.slice(0, 5)
      },
      
      // 新增：生活开销详细分析
      livingExpenseAnalysis: {
        totalMonthlyExpense: livingExpenseAnalysis.totalMonthlyExpense,
        livingExpenseToIncomeRatio,
        categoryBreakdown: livingExpenseAnalysis.categoryBreakdown,
        currencyBreakdown: livingExpenseAnalysis.currencyBreakdown,
        topExpenses: LivingExpenseCalculator.getTopExpenses(livingExpenses, 5)
      }
    };
  }
}