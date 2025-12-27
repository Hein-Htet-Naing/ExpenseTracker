export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  categoryIds?: string[];
  IcategoryIds?: string[];
  minAmount?: number;
  maxAmount?: number;
}

export interface topCategories {
  totalAmount: number;
  count: number;
  categoryId: string;
  name: string;
  color: string;
}
interface TotalExpense {
  _id: string;
  total: number;
}
interface MonthlyAverage {
  _id: string | null;
  avgPerMonth: number;
}
interface CountFinancialItem {
  count: number;
}
export interface ExpenseSummary {
  totalExpenses: TotalExpense[];
  monthlyAverage: MonthlyAverage[];
  countExpenses: CountFinancialItem[];
  topCategories: topCategories[];
}
interface totalIncome {
  _id: string;
  total: number;
}
interface highestIncome {
  totalAmount: number;
  count: number;
  categoryId: string;
  name: string;
  color: string;
}
export interface IncomeSummary {
  totalIncome: totalIncome[];
  countIncome: CountFinancialItem[];
  highestIncome: highestIncome[];
}
interface eachIcomeCategories {
  categoryName: string;
  categoryColor: string;
  totalAmount: number;
  percentage: number;
}
export interface incomeByCategories {
  categories: eachIcomeCategories[];
  overallTotal: number;
}
//for expense monthly
export interface MonthlySpending {
  year: number;
  month: number;
  totalAmount: number;
  expensesCount: number;
}
//for income monthly
export interface MonthlyIncome {
  incomeEachMonth: number;
  _id: null;
  year: number;
  month: string;
}
export interface CategorySpending {
  categoryName: string;
  categoryColor: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number;
}

export interface IncomeVsExpenseSummary {
  incomeForeachMonth: number;
  expenseForeachMonth: number;
  year: number;
  month: number;
  netsavingforeachMonth: number;
}
