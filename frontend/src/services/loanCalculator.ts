import type { Loan } from '../types';

/**
 * 贷款计算服务
 * 负责处理各种贷款相关的计算和分析
 */
export class LoanCalculator {
  
  /**
   * 计算总月供
   * @param loans 贷款列表
   * @returns 总月供（分为单位）
   */
  static calculateTotalMonthlyPayment(loans: Loan[]): number {
    return loans
      .filter(loan => loan.isActive)
      .reduce((total, loan) => total + this.calculateLoanMonthlyPayment(loan), 0);
  }

  /**
   * 计算单个贷款的月供（考虑浮动月供）
   * @param loan 贷款信息
   * @param targetDate 目标日期（可选，默认为当前月）
   * @returns 该贷款在指定月份的月供（分为单位）
   */
  static calculateLoanMonthlyPayment(loan: Loan, targetDate?: Date): number {
    // 如果没有浮动月供配置，返回固定月供
    if (!loan.floatingPayment?.enabled) {
      return loan.monthlyPayment;
    }

    const currentDate = targetDate || new Date();
    const baseDate = new Date(loan.floatingPayment.baseDate);
    
    // 计算从基准日期到目标日期的月数差
    const monthsDiff = (currentDate.getFullYear() - baseDate.getFullYear()) * 12 + 
                      (currentDate.getMonth() - baseDate.getMonth());
    
    // 如果目标日期早于基准日期，使用基础月供
    if (monthsDiff < 0) {
      return loan.floatingPayment.basePayment;
    }

    // 计算浮动后的月供 = 基础月供 - (月数差 * 每月递减金额)
    const floatingPayment = loan.floatingPayment.basePayment - 
                           (monthsDiff * loan.floatingPayment.monthlyDecrement);
    
    // 确保月供不会为负数
    return Math.max(floatingPayment, 0);
  }

  /**
   * 计算指定月份的总月供（考虑贷款到期）
   * @param loans 贷款列表
   * @param targetDate 目标月份
   * @returns 该月份的总月供（分为单位）
   */
  static calculateMonthlyPaymentForMonth(loans: Loan[], targetDate: Date): number {
    return loans
      .filter(loan => loan.isActive)
      .filter(loan => this.isLoanActiveInMonth(loan, targetDate))
      .reduce((total, loan) => total + this.calculateLoanMonthlyPayment(loan, targetDate), 0);
  }

  /**
   * 判断贷款在指定月份是否还在还款中
   * @param loan 贷款
   * @param targetDate 目标月份
   * @returns 是否活跃
   */
  static isLoanActiveInMonth(loan: Loan, targetDate: Date): boolean {
    // 如果没有剩余期数信息，假设贷款一直活跃
    if (!loan.remainingTerms) {
      return true;
    }

    // 计算从当前时间（2025年8月）开始，目标月份是第几个月
    const currentDate = new Date('2025-08-01'); // 基准时间
    const monthsFromNow = (targetDate.getFullYear() - currentDate.getFullYear()) * 12 + 
                         (targetDate.getMonth() - currentDate.getMonth());

    // 如果目标月份超过了剩余期数，则贷款已经还完
    return monthsFromNow < loan.remainingTerms;
  }
  
  /**
   * 计算剩余总债务
   * @param loans 贷款列表
   * @returns 剩余总债务（分为单位）
   */
  static calculateTotalRemainingDebt(loans: Loan[]): number {
    return loans
      .filter(loan => loan.isActive)
      .reduce((total, loan) => total + loan.remainingBalance, 0);
  }
  
  /**
   * 分析贷款结构
   * @param loans 贷款列表
   * @returns 贷款结构分析
   */
  static analyzeLoanStructure(loans: Loan[]) {
    const activeLoans = loans.filter(loan => loan.isActive);
    const totalMonthlyPayment = this.calculateTotalMonthlyPayment(activeLoans);
    const totalRemainingDebt = this.calculateTotalRemainingDebt(activeLoans);
    const totalPrincipal = activeLoans.reduce((total, loan) => total + loan.principal, 0);
    const totalPaidPrincipal = activeLoans.reduce((total, loan) => total + (loan.paidPrincipal || 0), 0);
    
    // 按贷款类型分类
    const loansByType = activeLoans.reduce((acc, loan) => {
      const type = loan.loanType || 'other';
      if (!acc[type]) {
        acc[type] = {
          count: 0,
          totalPrincipal: 0,
          totalMonthlyPayment: 0,
          totalRemainingBalance: 0
        };
      }
      
      acc[type].count++;
      acc[type].totalPrincipal += loan.principal;
      acc[type].totalMonthlyPayment += this.calculateLoanMonthlyPayment(loan);
      acc[type].totalRemainingBalance += loan.remainingBalance;
      
      return acc;
    }, {} as Record<string, {
      count: number;
      totalPrincipal: number;
      totalMonthlyPayment: number;
      totalRemainingBalance: number;
    }>);
    
    // 计算还款进度
    const repaymentProgress = totalPrincipal > 0 ? (totalPaidPrincipal / totalPrincipal) * 100 : 0;
    
    // 按月供排序（降序）- 使用动态月供计算
    const loansByMonthlyPayment = [...activeLoans].sort((a, b) => {
      const aPayment = this.calculateLoanMonthlyPayment(a);
      const bPayment = this.calculateLoanMonthlyPayment(b);
      return bPayment - aPayment;
    });
    
    return {
      summary: {
        activeLoanCount: activeLoans.length,
        totalMonthlyPayment,
        totalRemainingDebt,
        totalPrincipal,
        totalPaidPrincipal,
        repaymentProgress
      },
      breakdown: {
        byType: loansByType,
        byMonthlyPayment: loansByMonthlyPayment.map(loan => {
          const dynamicMonthlyPayment = this.calculateLoanMonthlyPayment(loan);
          return {
            id: loan.id,
            name: loan.name,
            monthlyPayment: dynamicMonthlyPayment,
            remainingBalance: loan.remainingBalance,
            percentage: totalMonthlyPayment > 0 ? (dynamicMonthlyPayment / totalMonthlyPayment) * 100 : 0
          };
        })
      },
      insights: {
        largestLoan: loansByMonthlyPayment[0] || null,
        averageMonthlyPayment: activeLoans.length > 0 ? totalMonthlyPayment / activeLoans.length : 0,
        debtToIncomeRatio: null // 需要收入数据才能计算
      }
    };
  }
  
  /**
   * 预测贷款还款情况
   * @param loan 单个贷款
   * @param months 预测月数
   * @returns 还款预测
   */
  static forecastLoanPayment(loan: Loan, months: number = 120) {
    if (!loan.isActive || !loan.remainingTerms) {
      return null;
    }
    
    const monthsToForecast = Math.min(months, loan.remainingTerms);
    // 对于浮动月供贷款，我们需要动态计算每月的月供
    const isFloatingPayment = loan.floatingPayment?.enabled;
    
    const forecast = [];
    let remainingBalance = loan.remainingBalance;
    let remainingTerms = loan.remainingTerms;
    
    for (let month = 1; month <= monthsToForecast; month++) {
      // 计算当前月份的月供（考虑浮动月供）
      const currentDate = new Date();
      currentDate.setMonth(currentDate.getMonth() + month - 1);
      const monthlyPayment = isFloatingPayment ? 
        this.calculateLoanMonthlyPayment(loan, currentDate) : 
        loan.monthlyPayment;
        
      // 简化计算：假设每月还款等额本息
      const principalPayment = remainingBalance > monthlyPayment ? 
        Math.min(monthlyPayment, remainingBalance) : remainingBalance;
      
      remainingBalance -= principalPayment;
      remainingTerms--;
      
      forecast.push({
        month,
        monthlyPayment: remainingBalance > 0 ? monthlyPayment : principalPayment,
        principalPayment,
        remainingBalance,
        remainingTerms
      });
      
      if (remainingBalance <= 0) break;
    }
    
    return {
      loanId: loan.id,
      loanName: loan.name,
      forecastPeriod: monthsToForecast,
      totalPayments: forecast.reduce((sum, f) => sum + f.monthlyPayment, 0),
      finalRemainingBalance: forecast[forecast.length - 1]?.remainingBalance || 0,
      willBeCompletedInPeriod: remainingBalance <= 0,
      monthlyForecast: forecast
    };
  }
  
  /**
   * 获取即将到期的贷款
   * @param loans 贷款列表
   * @param monthsThreshold 月数阈值（默认6个月）
   * @returns 即将到期的贷款列表
   */
  static getUpcomingMaturityLoans(loans: Loan[], monthsThreshold: number = 6) {
    return loans
      .filter(loan => loan.isActive && loan.remainingTerms !== undefined)
      .filter(loan => loan.remainingTerms! <= monthsThreshold)
      .sort((a, b) => (a.remainingTerms || 0) - (b.remainingTerms || 0));
  }
  
  /**
   * 计算债务收入比
   * @param totalMonthlyPayment 总月供
   * @param monthlyIncome 月收入
   * @returns 债务收入比（百分比）
   */
  static calculateDebtToIncomeRatio(totalMonthlyPayment: number, monthlyIncome: number): number {
    return monthlyIncome > 0 ? (totalMonthlyPayment / monthlyIncome) * 100 : 0;
  }
}