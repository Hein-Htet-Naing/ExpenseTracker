export interface Category {
  _id: string;
  name: string;
  description?: string;
  color: string;
  types: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CategoryFormData {
  name: string;
  color: string;
  types: string;
  description?: string;
}
export interface CategoryResponse {
  success: boolean;
  data?: Category;
  message?: string;
}
//I am bored that cuz I dun want to update the whole categories respone
//Thus, I creat a new Response for listing of categories in page and add form page
export interface CategoriesResponse {
  categories: Category[];
  expenseCategories: Category[];
  incomeCategories: Category[];
}
