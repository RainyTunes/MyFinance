import type { Currency, MultiCurrencyAmount } from '../types';

/**
 * 货币转换工具类
 */
export class CurrencyConverter {
  // 默认汇率（相对于人民币）
  private static readonly DEFAULT_EXCHANGE_RATES: Record<Currency, number> = {
    CNY: 1.0,      // 人民币基准
    HKD: 0.92      // 港币兑人民币（大约0.92，实际使用时应该从实时汇率获取）
  };

  // 当前使用的汇率
  private static exchangeRates: Record<Currency, number> = { ...CurrencyConverter.DEFAULT_EXCHANGE_RATES };

  /**
   * 设置汇率
   * @param rates 汇率对象
   */
  static setExchangeRates(rates: Partial<Record<Currency, number>>): void {
    this.exchangeRates = { ...this.exchangeRates, ...rates };
  }

  /**
   * 获取当前汇率
   * @param currency 币种
   * @returns 相对于人民币的汇率
   */
  static getExchangeRate(currency: Currency): number {
    return this.exchangeRates[currency];
  }

  /**
   * 转换为人民币
   * @param amount 原始金额（分为单位）
   * @param fromCurrency 源币种
   * @returns 人民币金额（分为单位）
   */
  static convertToCNY(amount: number, fromCurrency: Currency): number {
    if (fromCurrency === 'CNY') {
      return amount;
    }
    const rate = this.getExchangeRate(fromCurrency);
    return Math.round(amount * rate);
  }

  /**
   * 创建多币种金额对象
   * @param amount 原始金额（分为单位）
   * @param currency 币种
   * @returns MultiCurrencyAmount对象
   */
  static createMultiCurrencyAmount(amount: number, currency: Currency): MultiCurrencyAmount {
    const exchangeRate = this.getExchangeRate(currency);
    const amountInCNY = this.convertToCNY(amount, currency);

    return {
      amount,
      currency,
      amountInCNY,
      exchangeRate
    };
  }

  /**
   * 格式化金额显示
   * @param amount 金额（分为单位）
   * @param currency 币种
   * @param showSymbol 是否显示货币符号
   * @returns 格式化的金额字符串
   */
  static formatAmount(amount: number, currency: Currency, showSymbol: boolean = true): string {
    const value = amount / 100;
    const symbols: Record<Currency, string> = {
      CNY: '¥',
      HKD: 'HK$'
    };

    const formattedValue = value.toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return showSymbol ? `${symbols[currency]}${formattedValue}` : formattedValue;
  }

  /**
   * 获取币种符号
   * @param currency 币种
   * @returns 货币符号
   */
  static getCurrencySymbol(currency: Currency): string {
    const symbols: Record<Currency, string> = {
      CNY: '¥',
      HKD: 'HK$'
    };
    return symbols[currency];
  }

  /**
   * 获取币种名称
   * @param currency 币种
   * @returns 货币名称
   */
  static getCurrencyName(currency: Currency): string {
    const names: Record<Currency, string> = {
      CNY: '人民币',
      HKD: '港币'
    };
    return names[currency];
  }

  /**
   * 批量转换收入来源为人民币
   * @param incomeSources 收入来源列表
   * @returns 转换后的人民币总额（分为单位）
   */
  static calculateTotalIncomeInCNY(incomeSources: Array<{ amount: number; currency: Currency; isActive: boolean }>): number {
    return incomeSources
      .filter(source => source.isActive)
      .reduce((total, source) => {
        return total + this.convertToCNY(source.amount, source.currency);
      }, 0);
  }

  /**
   * 重置为默认汇率
   */
  static resetToDefaultRates(): void {
    this.exchangeRates = { ...this.DEFAULT_EXCHANGE_RATES };
  }
}