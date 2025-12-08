import { Category } from "./category";
export interface Income {
  _id: string;
  title: string;
  amount: number;
  categoryDetails?: Category;
  source?: string;
  date: string;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IncomeFormData {
  title: string;
  amount: number;
  categoryId: string;
  source?: string;
  date: string;
  description?: string;
}
export interface IncomeWithCategoreisResponse {
  success: boolean;
  message?: string;
  data: Income[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
  };
}
export interface IncomeResponse {
  success: boolean;
  message: string;
  data: Income;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number;
}
