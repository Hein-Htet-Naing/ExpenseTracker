import { Category } from "./category";
export interface Expense {
  _id: string;
  title: string;
  amount: number;
  categoryId: string;
  description?: string;
  categoryDetails?: Category;
  date: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
export interface ExpenseFormData {
  title: string;
  amount: number;
  categoryId: string;
  description?: string;
  date: string;
}

export interface ExpenseFilters {
  category?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface ExpenseRespone {
  success: boolean;
  data: Expense;
}
