// 共享类型定义

export interface CashFlowRecord {
  id: string;
  date: string; // ISO 8601 格式
  type: 'income' | 'expense' | 'loan_payment' | 'investment';
  amount: number; // 以分为单位
  category: string;
  description: string;
  tags?: string[];
  isRecurring?: boolean;
  recurringPattern?: 'monthly' | 'yearly' | 'weekly';
}

export interface Loan {
  id: string;
  name: string;
  principal: number; // 本金（分）
  interestRate: number; // 年利率（百分比）
  monthlyPayment: number; // 月供（分）
  startDate: string;
  endDate: string;
  remainingBalance: number; // 剩余本金（分）
  bankName?: string;
}

export interface Budget {
  id: string;
  category: string;
  monthlyLimit: number; // 月度预算限额（分）
  currentSpent: number; // 当月已花费（分）
  year: number;
  month: number;
}

export interface Asset {
  id: string;
  name: string;
  type: 'savings' | 'investment' | 'property' | 'other';
  currentValue: number; // 当前价值（分）
  description?: string;
  lastUpdated: string;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number; // 目标金额（分）
  currentAmount: number; // 当前金额（分）
  targetDate: string;
  category: string;
  description?: string;
}

// 现金流预测数据
export interface CashFlowForecast {
  date: string;
  predictedIncome: number;
  predictedExpense: number;
  predictedBalance: number;
  confidence: number; // 置信度 0-1
}

// 数据库结构（用于JSON文件）
export interface FinanceData {
  cashFlowRecords: CashFlowRecord[];
  loans: Loan[];
  budgets: Budget[];
  assets: Asset[];
  financialGoals: FinancialGoal[];
  creditCards: CreditCard[];
  lastUpdated: string;
}

// API 响应类型
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// 统计数据类型
export interface MonthlyStats {
  month: string;
  totalIncome: number;
  totalExpense: number;
  netCashFlow: number;
  topExpenseCategories: Array<{
    category: string;
    amount: number;
  }>;
}

export interface YearlyStats {
  year: number;
  months: MonthlyStats[];
  totalIncome: number;
  totalExpense: number;
  netCashFlow: number;
}

// 信用卡数据模型（专用于套现场景）
export interface CreditCard {
  id: string;                    // 唯一标识
  cardNumber: string;            // 编号（如A0, A5等）
  bankName: string;              // 银行名称
  creditLimit: number;           // 额度（分为单位）
  cardType: string;              // 卡种（如香白、孝心标准等）
  annualFee: number;             // 年费（分为单位）
  isActive: boolean;             // 是否激活使用
  
  // 套现相关计算字段
  cashAdvanceRate?: number;      // 套现手续费率（默认0.6%）
  interestRate?: number;         // 日利率（默认万分之5）
  monthlyCost?: number;          // 每月成本（计算得出）
  notes?: string;                // 备注信息
  lastUpdated: string;           // 最后更新时间
}

// 信用卡套现成本计算
export interface CreditCardCostCalculation {
  creditCardId: string;
  creditLimit: number;           // 额度
  annualFee: number;             // 年费
  cashAdvanceRate: number;       // 套现手续费率
  interestRate: number;          // 日利率
  
  // 计算结果
  monthlyCashAdvanceFee: number; // 每月套现手续费
  monthlyInterest: number;       // 每月利息（大概估算）
  monthlyAnnualFee: number;      // 年费分摊/月
  totalMonthlyCost: number;      // 每月总成本
}