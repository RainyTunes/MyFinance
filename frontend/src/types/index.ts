// 共享类型定义

// 支持的币种
export type Currency = 'CNY' | 'HKD';

// 多币种金额
export interface MultiCurrencyAmount {
  amount: number;           // 原始金额（分为单位）
  currency: Currency;       // 币种
  amountInCNY?: number;     // 人民币金额（分为单位，用于计算）
  exchangeRate?: number;    // 使用的汇率（相对于人民币）
}

export interface CashFlowRecord {
  id: string;
  date: string; // ISO 8601 格式
  type: 'income' | 'expense' | 'loan_payment' | 'investment';
  amount: number; // 以分为单位（人民币）
  originalAmount?: MultiCurrencyAmount; // 原始币种金额
  category: string;
  description: string;
  tags?: string[];
  isRecurring?: boolean;
  recurringPattern?: 'monthly' | 'yearly' | 'weekly';
}

// 收入来源定义
export interface IncomeSource {
  id: string;
  name: string;             // 收入来源名称
  amount: number;           // 原始金额（分为单位）
  currency: Currency;       // 币种
  amountInCNY: number;      // 人民币金额（分为单位）
  exchangeRate: number;     // 汇率（相对于人民币）
  category: 'salary' | 'freelance' | 'rental' | 'investment' | 'other';
  description: string;
  isActive: boolean;        // 是否活跃
  isRecurring: boolean;     // 是否定期收入
  lastUpdated: string;
}

export interface Loan {
  id: string;
  name: string;                     // 贷款名称（如"广州房贷"）
  principal: number;                // 总本金（分为单位）
  monthlyPayment: number;           // 月供（分为单位）
  startDate?: string | null;        // 开始时间（可选）
  endDate?: string | null;          // 结束时间（可选）
  totalTerms?: number | null;       // 总期数
  remainingTerms?: number | null;   // 剩余期数
  paidPrincipal?: number;           // 已还本金（分为单位）
  remainingBalance: number;         // 剩余总待还本金（分为单位）
  timeToMaturity?: string | null;   // 距离到期时间
  notes?: string | null;            // 备注信息
  bankName?: string;                // 银行名称
  loanType?: 'mortgage' | 'consumer' | 'business' | 'credit_line' | 'other'; // 贷款类型
  isActive: boolean;                // 是否活跃
  lastUpdated: string;              // 最后更新时间
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
  incomeSources: IncomeSource[];
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
  
  // 计算结果
  monthlyCashAdvanceFee: number; // 每月套现手续费
  monthlyAnnualFee: number;      // 年费分摊/月
  totalMonthlyCost: number;      // 每月总成本
}