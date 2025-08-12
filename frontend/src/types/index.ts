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
  creditCardStatements: CreditCardStatement[];
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

// 信用卡数据模型
export interface CreditCard {
  id: string;                    // 唯一标识
  cardNumber: string;            // 编号（卡号后4位或自定义编号）
  bankName: string;              // 银行名称
  creditLimit: number;           // 额度（分为单位）
  cardType: string;              // 卡种（如：金卡、白金卡、普卡等）
  availableCredit?: number;      // 可用额度（分）
  currentBalance?: number;       // 当前欠款（分）
  issueDate?: string;            // 发卡日期
  expiryDate?: string;           // 到期日期
  annualFee?: number;            // 年费（分）
  interestRate?: number;         // 利率（百分比）
  statementDate?: number;        // 账单日（每月几号）
  paymentDueDate?: number;       // 还款日（每月几号）
  isActive: boolean;             // 是否激活
  lastUpdated: string;           // 最后更新时间
}

// 信用卡账单
export interface CreditCardStatement {
  id: string;
  creditCardId: string;          // 关联的信用卡ID
  statementDate: string;         // 账单日期
  dueDate: string;              // 还款截止日期
  previousBalance: number;       // 上期余额（分）
  currentBalance: number;        // 本期余额（分）
  minimumPayment: number;        // 最低还款额（分）
  transactions: CreditCardTransaction[];  // 交易记录
  isPaid: boolean;              // 是否已还款
  paymentAmount?: number;       // 实际还款金额（分）
  paymentDate?: string;         // 还款日期
}

// 信用卡交易记录
export interface CreditCardTransaction {
  id: string;
  creditCardId: string;
  date: string;                 // 交易日期
  description: string;          // 交易描述
  amount: number;               // 金额（分，正数为消费，负数为还款）
  category?: string;            // 消费类别
  merchant?: string;            // 商户名称
  isRefund?: boolean;          // 是否退款
}