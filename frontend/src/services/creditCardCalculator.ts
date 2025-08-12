import type { CreditCard, CreditCardCostCalculation } from '../types';

/**
 * 信用卡套现成本计算器
 */
export class CreditCardCalculator {
  // 默认费率
  static readonly DEFAULT_CASH_ADVANCE_RATE = 0.006; // 0.6%
  
  /**
   * 计算信用卡月度套现成本
   * @param card 信用卡信息
   * @returns 成本计算结果
   */
  static calculateMonthlyCost(card: CreditCard): CreditCardCostCalculation {
    const cashAdvanceRate = card.cashAdvanceRate || this.DEFAULT_CASH_ADVANCE_RATE;
    
    // 1. 每月套现手续费 = 额度 × 套现手续费率
    const monthlyCashAdvanceFee = Math.round(card.creditLimit * cashAdvanceRate);
    
    // 2. 年费分摊
    const monthlyAnnualFee = Math.round(card.annualFee / 12);
    
    // 3. 每月总成本 = 套现手续费 + 年费分摊
    const totalMonthlyCost = monthlyCashAdvanceFee + monthlyAnnualFee;
    
    return {
      creditCardId: card.id,
      creditLimit: card.creditLimit,
      annualFee: card.annualFee,
      cashAdvanceRate,
      monthlyCashAdvanceFee,
      monthlyAnnualFee,
      totalMonthlyCost
    };
  }
  
  /**
   * 批量计算多张卡的成本
   * @param cards 信用卡列表
   * @returns 成本计算结果列表
   */
  static calculateMultipleCosts(cards: CreditCard[]): CreditCardCostCalculation[] {
    return cards.filter(card => card.isActive).map(card => this.calculateMonthlyCost(card));
  }
  
  /**
   * 计算总的月度套现成本
   * @param cards 信用卡列表
   * @returns 总月度成本（分）
   */
  static calculateTotalMonthlyCost(cards: CreditCard[]): number {
    const calculations = this.calculateMultipleCosts(cards);
    return calculations.reduce((total, calc) => total + calc.totalMonthlyCost, 0);
  }
  
  /**
   * 获取总可用额度
   * @param cards 信用卡列表
   * @returns 总额度（分）
   */
  static getTotalCreditLimit(cards: CreditCard[]): number {
    return cards.filter(card => card.isActive).reduce((total, card) => total + card.creditLimit, 0);
  }
  
  /**
   * 格式化金额（分转元，保留2位小数）
   * @param amountInCents 金额（分）
   * @returns 格式化的金额字符串
   */
  static formatAmount(amountInCents: number): string {
    return (amountInCents / 100).toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
  
  /**
   * 计算套现的年化成本率
   * @param card 信用卡信息
   * @returns 年化成本率（百分比）
   */
  static calculateAnnualCostRate(card: CreditCard): number {
    const calculation = this.calculateMonthlyCost(card);
    const annualCost = calculation.totalMonthlyCost * 12;
    return (annualCost / card.creditLimit) * 100;
  }
}