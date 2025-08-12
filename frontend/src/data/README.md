# 数据模块化结构

本目录包含模块化的Mock数据文件，每个文件对应一个特定的数据类型。

## 数据文件结构

```
data/
├── cashFlowRecords.json    # 现金流记录
├── loans.json              # 贷款数据
├── budgets.json            # 预算数据
├── assets.json             # 资产数据
├── financialGoals.json     # 财务目标
├── creditCards.json        # 信用卡数据
├── incomeSources.json      # 收入来源
└── README.md               # 本说明文件
```

## 使用方法

### 1. 使用聚合服务（推荐）

```typescript
import { MockDataService } from '../services/mockDataService';

// 获取所有数据
const allData = MockDataService.getFinanceData();

// 获取特定数据模块
const creditCards = MockDataService.getCreditCards();
const incomeSources = MockDataService.getIncomeSources();
```

### 2. 直接导入特定模块

```typescript
import creditCards from './creditCards.json';
import incomeSources from './incomeSources.json';
```

## 数据模块说明

### cashFlowRecords.json
- 包含收入、支出、投资、贷款还款等现金流记录
- 支持多币种（CNY/HKD）
- 包含定期和一次性交易

### loans.json
- 贷款信息：房贷、车贷等
- 包含利率、月供、剩余本金等详细信息

### budgets.json
- 月度预算设置
- 包含预算限额和当前支出

### assets.json
- 资产组合：储蓄、投资、房产等
- 包含资产类型和当前价值

### financialGoals.json
- 财务目标：应急基金、度假基金等
- 包含目标金额、当前进度、截止日期

### creditCards.json
- 信用卡信息：银行、额度、卡种、年费
- 专门针对套现场景优化
- 包含手续费率等计算参数

### incomeSources.json
- 多币种收入来源
- 包含汇率转换信息
- 支持工资、租金、外包等不同收入类型

## 优势

1. **模块化管理**：每个数据类型独立维护
2. **按需加载**：可单独导入需要的数据模块
3. **类型安全**：配合TypeScript提供完整的类型检查
4. **易于维护**：修改单个模块不影响其他数据
5. **可扩展性**：新增数据模块无需修改现有代码

## 数据更新

每个JSON文件的数据最后更新时间统一为：`2024-01-15T08:00:00.000Z`

所有金额均以分为单位存储，确保计算精度。