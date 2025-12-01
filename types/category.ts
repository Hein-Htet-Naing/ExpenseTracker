export interface Category {
  _id: string;
  name: string;
  description?: string;
  color: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CategoryFormData {
  name: string;
  color: string;
  description?: string;
}
export interface CategoryResponse {
  success: boolean;
  data?: Category;
  message?: string;
}
