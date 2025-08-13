import type { FinanceData } from '../types';

// 导入模块化的数据文件
import cashFlowRecords from '../data/cashFlowRecords.json';
import loans from '../data/loans.json';
import budgets from '../data/budgets.json';
import assets from '../data/assets.json';
import financialGoals from '../data/financialGoals.json';
import creditCards from '../data/creditCards.json';
import incomeSources from '../data/incomeSources.json';
import livingExpenses from '../data/livingExpenses.json';

/**
 * Mock数据服务 - 聚合所有模块化的数据
 */
export class MockDataService {
  private static readonly LAST_UPDATED = '2024-01-15T08:00:00.000Z';

  /**
   * 获取完整的财务数据
   * @returns 聚合后的财务数据
   */
  static getFinanceData(): FinanceData {
    return {
      cashFlowRecords: cashFlowRecords as any[],
      loans: loans as any[],
      budgets: budgets as any[],
      assets: assets as any[],
      financialGoals: financialGoals as any[],
      creditCards: creditCards as any[],
      incomeSources: incomeSources as any[],
      lastUpdated: this.LAST_UPDATED
    };
  }

  /**
   * 获取现金流记录
   * @returns 现金流记录数组
   */
  static getCashFlowRecords() {
    return cashFlowRecords;
  }

  /**
   * 获取贷款数据
   * @returns 贷款数组
   */
  static getLoans() {
    return loans;
  }

  /**
   * 获取预算数据
   * @returns 预算数组
   */
  static getBudgets() {
    return budgets;
  }

  /**
   * 获取资产数据
   * @returns 资产数组
   */
  static getAssets() {
    return assets;
  }

  /**
   * 获取财务目标数据
   * @returns 财务目标数组
   */
  static getFinancialGoals() {
    return financialGoals;
  }

  /**
   * 获取信用卡数据
   * @returns 信用卡数组
   */
  static getCreditCards() {
    return creditCards;
  }

  /**
   * 获取收入来源数据
   * @returns 收入来源数组
   */
  static getIncomeSources() {
    return incomeSources;
  }

  /**
   * 获取生活开销数据
   * @returns 生活开销数组
   */
  static getLivingExpenses() {
    return livingExpenses;
  }

  /**
   * 获取数据最后更新时间
   * @returns 更新时间字符串
   */
  static getLastUpdated() {
    return this.LAST_UPDATED;
  }

  /**
   * 根据类型获取特定数据模块
   * @param dataType 数据类型
   * @returns 对应的数据数组
   */
  static getDataByType(dataType: keyof FinanceData) {
    switch (dataType) {
      case 'cashFlowRecords':
        return this.getCashFlowRecords();
      case 'loans':
        return this.getLoans();
      case 'budgets':
        return this.getBudgets();
      case 'assets':
        return this.getAssets();
      case 'financialGoals':
        return this.getFinancialGoals();
      case 'creditCards':
        return this.getCreditCards();
      case 'incomeSources':
        return this.getIncomeSources();
      case 'lastUpdated':
        return this.getLastUpdated();
      default:
        throw new Error(`Unknown data type: ${dataType}`);
    }
  }

  /**
   * 获取数据统计摘要
   * @returns 数据统计信息
   */
  static getDataSummary() {
    const data = this.getFinanceData();
    return {
      cashFlowRecordsCount: data.cashFlowRecords.length,
      loansCount: data.loans.length,
      budgetsCount: data.budgets.length,
      assetsCount: data.assets.length,
      financialGoalsCount: data.financialGoals.length,
      creditCardsCount: data.creditCards.length,
      incomeSourcesCount: data.incomeSources.length,
      totalDataPoints: data.cashFlowRecords.length + data.loans.length + 
                      data.budgets.length + data.assets.length + 
                      data.financialGoals.length + data.creditCards.length + 
                      data.incomeSources.length,
      lastUpdated: data.lastUpdated
    };
  }
}