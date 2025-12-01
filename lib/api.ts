import { AuthResponse, LoginFormData, RegisterFormData } from "@/types/auth";
import { ExpenseFormData, ExpenseRespone } from "@/types/expense";
import axios from "axios";
import { Expense } from "@/types/expense";
import { Category, CategoryFormData, CategoryResponse } from "@/types/category";
import { ReportFilters } from "@/types/report";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // console.log(originalRequest);
    // console.error("API Error:", error.response || error.message);

    if (error?.response.status === 401 || error?.response.status === 403) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshRes = await authAPI.refreshToken();
          if (refreshRes.success) {
            return api(originalRequest);
          }
        } catch (refreshError) {
          console.error("Refresh failed on retry:", refreshError);
          window.location.href = "/login"; // Redirect on failure
        }
      }

      return Promise.reject(error);
    }
  }
);

export const authAPI = {
  currentUser: async (): Promise<AuthResponse> => {
    const response = await api.get<AuthResponse>("/auth/me");
    return response.data;
  },

  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  refreshToken: async () => {
    const response = await api.get("/auth/refresh");
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },
};

export const expenseAPI = {
  list: async (page: number, limit: number) => {
    const response = await api.get(`/expense?page=${page}&limit=${limit}`);
    return response.data;
  },

  getbyid: async (id: string): Promise<Expense> => {
    const response = await api.post("/expense/listByid", { id });
    return response.data.user;
  },

  create: async (data: ExpenseFormData): Promise<Expense> => {
    const response = await api.post("/expense", data);
    return response.data;
  },

  update: async (
    id: string,
    data: ExpenseFormData
  ): Promise<ExpenseRespone> => {
    const response = await api.put(`/expense/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/expense/${id}`);
    return response.data;
  },
};

export const categoryAPI = {
  getAll: async (): Promise<Category[]> => {
    try {
      const response = await api.get("/categories");
      //return response.data.data = categories array
      return response.data.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || "Unknown error");
      }
      throw error;
    }
  },
  create: async (data: CategoryFormData): Promise<CategoryResponse> => {
    try {
      const response = await api.post("/categories", data);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || "Unknown error");
      }
      throw error;
    }
  },
  getById: async (id: string): Promise<CategoryResponse> => {
    try {
      const response = await api.get(`/categories/getbyId/${id}`);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || "Unknown error");
      }
      throw error;
    }
  },
  update: async (
    id: string,
    data: CategoryFormData
  ): Promise<CategoryResponse> => {
    try {
      const response = await api.put(`/categories/${id}`, data);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || "Unknown error");
      }
      throw error;
    }
  },
  delete: async (id: string) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.error || "Unknown Error");
      }
      throw error;
    }
  },
};

export const reportApi = {
  getExpenseReport: async (filters: ReportFilters) => {
    const response = await api.post("/report/expenses", filters);
    return response.data;
  },
};

export default api;
