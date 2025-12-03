export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  categoryIds?: string[];
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
interface CountExpenseItem {
  count: number;
}
export interface ExpenseSummary {
  totalExpenses: TotalExpense[];
  monthlyAverage: MonthlyAverage[];
  countExpenses: CountExpenseItem[];
  topCategories: topCategories[];
}
export interface MonthlySpending {
  year: number;
  month: number;
  totalAmount: number;
  expensesCount: number;
}
export interface CategorySpending {
  categoryName: string;
  categoryColor: string;
  amount: number;
  count: number;
  percentage: number;
}
