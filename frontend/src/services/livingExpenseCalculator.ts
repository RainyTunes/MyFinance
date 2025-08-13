import type { LivingExpense, LivingExpenseAnalysis } from '../types';

/**
 * 生活开销计算服务
 * 负责处理生活开销的计算和分析
 */
export class LivingExpenseCalculator {
  
  /**
   * 计算月度生活开销总额
   * @param expenses 生活开销列表
   * @returns 月度总开销（人民币分）
   */
  static calculateTotalMonthlyExpense(expenses: LivingExpense[]): number {
    return expenses
      .filter(expense => expense.isActive && expense.recurringPattern === 'monthly')
      .reduce((total, expense) => total + expense.amountInCNY, 0);
  }
  
  /**
   * 按类别分析生活开销
   * @param expenses 生活开销列表
   * @returns 生活开销分析结果
   */
  static analyzeLivingExpenses(expenses: LivingExpense[]): LivingExpenseAnalysis {
    const activeMonthlyExpenses = expenses.filter(
      expense => expense.isActive && expense.recurringPattern === 'monthly'
    );
    
    const totalMonthlyExpense = this.calculateTotalMonthlyExpense(expenses);
    
    // 按类别分组
    const categoryBreakdown: Record<string, {
      totalAmount: number;
      items: LivingExpense[];
      percentage: number;
    }> = {};
    
    activeMonthlyExpenses.forEach(expense => {
      const category = expense.category;
      
      if (!categoryBreakdown[category]) {
        categoryBreakdown[category] = {
          totalAmount: 0,
          items: [],
          percentage: 0
        };
      }
      
      categoryBreakdown[category].totalAmount += expense.amountInCNY;
      categoryBreakdown[category].items.push(expense);
    });
    
    // 计算各类别百分比
    Object.keys(categoryBreakdown).forEach(category => {
      categoryBreakdown[category].percentage = totalMonthlyExpense > 0 
        ? (categoryBreakdown[category].totalAmount / totalMonthlyExpense) * 100 
        : 0;
    });
    
    // 按币种分组
    const currencyBreakdown: Record<string, {
      totalAmount: number;
      totalAmountInCNY: number;
      percentage: number;
    }> = {};
    
    activeMonthlyExpenses.forEach(expense => {
      const currency = expense.currency;
      
      if (!currencyBreakdown[currency]) {
        currencyBreakdown[currency] = {
          totalAmount: 0,
          totalAmountInCNY: 0,
          percentage: 0
        };
      }
      
      currencyBreakdown[currency].totalAmount += expense.amount;
      currencyBreakdown[currency].totalAmountInCNY += expense.amountInCNY;
    });
    
    // 计算各币种百分比
    Object.keys(currencyBreakdown).forEach(currency => {
      currencyBreakdown[currency].percentage = totalMonthlyExpense > 0 
        ? (currencyBreakdown[currency].totalAmountInCNY / totalMonthlyExpense) * 100 
        : 0;
    });
    
    return {
      totalMonthlyExpense,
      categoryBreakdown,
      currencyBreakdown
    };
  }
  
  /**
   * 获取各类别的中文名称
   * @param category 类别英文名
   * @returns 中文名称
   */
  static getCategoryDisplayName(category: string): string {
    const categoryNames: Record<string, string> = {
      'housing': '住房',
      'utilities': '水电气网',
      'food': '食品',
      'transportation': '交通',
      'entertainment': '娱乐',
      'subscription': '订阅服务',
      'other': '其他'
    };
    
    return categoryNames[category] || category;
  }
  
  /**
   * 获取最大开销项目
   * @param expenses 生活开销列表
   * @returns 金额最大的前N个开销项目
   */
  static getTopExpenses(expenses: LivingExpense[], limit: number = 5): LivingExpense[] {
    return expenses
      .filter(expense => expense.isActive && expense.recurringPattern === 'monthly')
      .sort((a, b) => b.amountInCNY - a.amountInCNY)
      .slice(0, limit);
  }
  
  /**
   * 计算生活开销占收入的比例
   * @param totalExpense 总生活开销（人民币分）
   * @param monthlyIncome 月收入（人民币分）
   * @returns 开销收入比（百分比）
   */
  static calculateExpenseToIncomeRatio(totalExpense: number, monthlyIncome: number): number {
    return monthlyIncome > 0 ? (totalExpense / monthlyIncome) * 100 : 0;
  }
  
  /**
   * 预测生活开销变化（简单预测，可根据需要扩展）
   * @param expenses 生活开销列表
   * @param months 预测月数
   * @param inflationRate 通胀率（年化，默认3%）
   * @returns 各月预测开销
   */
  static forecastLivingExpenses(
    expenses: LivingExpense[], 
    months: number = 120, 
    inflationRate: number = 0.03
  ): Array<{ month: number; totalExpense: number; inflationAdjustedExpense: number }> {
    const currentMonthlyExpense = this.calculateTotalMonthlyExpense(expenses);
    const monthlyInflationRate = inflationRate / 12; // 月度通胀率
    
    const forecast = [];
    
    for (let month = 1; month <= months; month++) {
      const inflationMultiplier = Math.pow(1 + monthlyInflationRate, month);
      const inflationAdjustedExpense = Math.round(currentMonthlyExpense * inflationMultiplier);
      
      forecast.push({
        month,
        totalExpense: currentMonthlyExpense,
        inflationAdjustedExpense
      });
    }
    
    return forecast;
  }
}