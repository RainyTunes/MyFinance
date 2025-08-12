import type { IncomeSource, Currency } from '../types';

/**
 * 收入计算器
 */
export class IncomeCalculator {
  /**
   * 计算总月收入（人民币）
   * @param incomeSources 收入来源列表
   * @returns 月总收入（分为单位）
   */
  static calculateTotalMonthlyIncome(incomeSources: IncomeSource[]): number {
    return incomeSources
      .filter(source => source.isActive && source.isRecurring)
      .reduce((total, source) => total + source.amountInCNY, 0);
  }

  /**
   * 按币种分组统计收入
   * @param incomeSources 收入来源列表
   * @returns 按币种分组的收入统计
   */
  static getIncomeGroupedByCurrency(incomeSources: IncomeSource[]): Record<Currency, {
    totalAmount: number;
    totalAmountInCNY: number;
    sources: IncomeSource[];
  }> {
    const result: Record<Currency, { totalAmount: number; totalAmountInCNY: number; sources: IncomeSource[] }> = {
      CNY: { totalAmount: 0, totalAmountInCNY: 0, sources: [] },
      HKD: { totalAmount: 0, totalAmountInCNY: 0, sources: [] }
    };

    incomeSources
      .filter(source => source.isActive && source.isRecurring)
      .forEach(source => {
        result[source.currency].totalAmount += source.amount;
        result[source.currency].totalAmountInCNY += source.amountInCNY;
        result[source.currency].sources.push(source);
      });

    return result;
  }

  /**
   * 按收入类型分组统计
   * @param incomeSources 收入来源列表
   * @returns 按类型分组的收入统计
   */
  static getIncomeGroupedByCategory(incomeSources: IncomeSource[]): Record<string, {
    totalAmountInCNY: number;
    sources: IncomeSource[];
  }> {
    const result: Record<string, { totalAmountInCNY: number; sources: IncomeSource[] }> = {};

    incomeSources
      .filter(source => source.isActive && source.isRecurring)
      .forEach(source => {
        if (!result[source.category]) {
          result[source.category] = { totalAmountInCNY: 0, sources: [] };
        }
        result[source.category].totalAmountInCNY += source.amountInCNY;
        result[source.category].sources.push(source);
      });

    return result;
  }

  /**
   * 计算年收入
   * @param incomeSources 收入来源列表
   * @returns 年收入（分为单位）
   */
  static calculateAnnualIncome(incomeSources: IncomeSource[]): number {
    const monthlyIncome = this.calculateTotalMonthlyIncome(incomeSources);
    return monthlyIncome * 12;
  }

  /**
   * 格式化收入摘要
   * @param incomeSources 收入来源列表
   * @returns 格式化的收入摘要
   */
  static getIncomeSummary(incomeSources: IncomeSource[]): {
    totalMonthlyIncomeCNY: number;
    totalAnnualIncomeCNY: number;
    activeSourcesCount: number;
    currencyBreakdown: Record<Currency, { totalAmount: number; totalAmountInCNY: number; count: number }>;
    categoryBreakdown: Record<string, { totalAmountInCNY: number; count: number }>;
  } {
    const activeSources = incomeSources.filter(source => source.isActive && source.isRecurring);
    
    const currencyGroups = this.getIncomeGroupedByCurrency(incomeSources);
    const categoryGroups = this.getIncomeGroupedByCategory(incomeSources);

    const currencyBreakdown: Record<Currency, { totalAmount: number; totalAmountInCNY: number; count: number }> = {
      CNY: { 
        totalAmount: currencyGroups.CNY.totalAmount, 
        totalAmountInCNY: currencyGroups.CNY.totalAmountInCNY, 
        count: currencyGroups.CNY.sources.length 
      },
      HKD: { 
        totalAmount: currencyGroups.HKD.totalAmount, 
        totalAmountInCNY: currencyGroups.HKD.totalAmountInCNY, 
        count: currencyGroups.HKD.sources.length 
      }
    };

    const categoryBreakdown: Record<string, { totalAmountInCNY: number; count: number }> = {};
    Object.keys(categoryGroups).forEach(category => {
      categoryBreakdown[category] = {
        totalAmountInCNY: categoryGroups[category].totalAmountInCNY,
        count: categoryGroups[category].sources.length
      };
    });

    return {
      totalMonthlyIncomeCNY: this.calculateTotalMonthlyIncome(incomeSources),
      totalAnnualIncomeCNY: this.calculateAnnualIncome(incomeSources),
      activeSourcesCount: activeSources.length,
      currencyBreakdown,
      categoryBreakdown
    };
  }
}