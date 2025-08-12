# MyFinance - 个人现金流管理系统

## 项目背景

MyFinance 是一个现代化的个人财务管理工具，专注于现金流可视化和风险预测。项目旨在将复杂的Excel财务表格数字化，提供直观的数据可视化、图表生成和未来现金流预测功能。

### 核心需求
- 月供统计管理（房贷、车贷等）
- 生活开销记录与分析  
- 私人借贷跟踪
- 未来现金流预测
- 财务风险预警

## 技术选型

### 前端技术栈
- **React 18 + TypeScript** - 现代前端框架
- **Vite** - 快速构建工具
- **ECharts** - 专业级图表可视化
- **Ant Design** - UI组件库
- **Zustand** - 轻量级状态管理
- **Day.js** - 日期处理库

### 数据存储（快速启动阶段）
- **JSON文件** - 本地数据存储
- **LocalStorage** - 浏览器缓存
- **Mock数据** - 开发阶段硬编码数据

### 未来扩展
- **MongoDB** - NoSQL数据库
- **Node.js + Express** - 后端API
- **Mongoose** - MongoDB ODM

## 项目结构

```
MyFinance/
├── frontend/                 # React前端应用
│   ├── src/
│   │   ├── components/      # UI组件
│   │   │   ├── charts/     # 图表组件
│   │   │   ├── forms/      # 表单组件
│   │   │   └── layout/     # 布局组件
│   │   ├── pages/
│   │   │   ├── Dashboard/  # 现金流仪表板
│   │   │   ├── Records/    # 记录管理
│   │   │   ├── Forecast/   # 预测分析
│   │   │   └── Settings/   # 配置页面
│   │   ├── stores/         # 状态管理
│   │   ├── services/       # 数据服务层
│   │   ├── types/          # TypeScript类型
│   │   └── data/           # 本地JSON数据
│   └── package.json
│
├── shared/                  # 共享类型定义
│   └── types/
│
└── tools/                   # 工具脚本
    └── excel-import/       # Excel导入工具
```

## 数据模型

### 现金流记录
```typescript
interface CashFlowRecord {
  id: string;
  date: string;
  type: 'income' | 'expense' | 'loan_payment' | 'investment';
  amount: number;
  category: string;
  description: string;
  tags?: string[];
  isRecurring?: boolean;
  recurringPattern?: 'monthly' | 'yearly';
}
```

### 贷款信息
```typescript
interface Loan {
  id: string;
  name: string;
  principal: number;
  interestRate: number;
  monthlyPayment: number;
  startDate: string;
  endDate: string;
  remainingBalance: number;
}
```

## 工作流程

### Phase 1: 快速原型（当前阶段）
1. ✅ 项目初始化和Git设置
2. 🔄 React + TypeScript前端搭建
3. 📊 基础图表组件开发
4. 💾 JSON数据模拟和本地存储
5. 🎯 核心现金流可视化功能

### Phase 2: 功能完善
1. 📈 预测算法实现
2. ⚠️ 风险预警系统
3. 📱 响应式设计优化
4. 🔄 Excel数据导入工具

### Phase 3: 后端集成
1. 🏗️ Node.js API开发
2. 🗃️ MongoDB数据库集成
3. 🔐 用户认证系统
4. ☁️ 云端部署

## 开发要点

### 代码规范
- 使用TypeScript严格模式
- 遵循React函数式组件模式
- 组件命名使用PascalCase
- 文件名使用kebab-case
- Git commit使用英文

### 数据处理原则
- 所有金额使用分为单位（避免浮点精度问题）
- 日期统一使用ISO 8601格式
- 数据验证在组件边界进行
- 状态更新保持不可变性

### 性能考虑
- 图表组件按需懒加载
- 大数据集使用虚拟滚动
- 防抖处理用户输入
- 缓存计算结果

## 部署方案

### 开发环境
```bash
cd frontend
npm run dev
```

### 生产构建
```bash
cd frontend
npm run build
```

### 部署目标
- **前端**: Vercel / Netlify
- **后端**: Railway / Render
- **数据库**: MongoDB Atlas

## 关键功能

1. **现金流仪表板** - 实时显示收支情况和趋势
2. **智能预测** - 基于历史数据预测未来3-12个月现金流
3. **风险预警** - 识别潜在的现金流断裂风险
4. **多维度分析** - 按类别、时间、标签等维度分析支出
5. **Excel集成** - 支持现有Excel数据的无缝导入

## 注意事项

- 所有commit message使用英文
- 代码注释和文档使用中文
- 保持代码简洁和可读性
- 定期备份本地JSON数据
- 敏感数据不要提交到Git仓库