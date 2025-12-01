import { LoginFormData, RegisterFormData } from "@/types/auth";
import { CategoryFormData } from "@/types/category";
import { ExpenseFormData } from "@/types/expense";

export const validateLogin = (data: LoginFormData): Record<string, string> => {
  const errors: Record<string, string> = {};
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!data.email) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(data.email)) {
    errors.email = "Email is invalid";
  }

  const pwRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!data.password) {
    errors.password = "Password is required";
  } else if (!pwRegex.test(data.password)) {
    errors.password =
      "Password must be at least 8 characters long and include a letter, a number, and a special character.";
  }
  return errors;
};

export const validateRegister = (
  data: RegisterFormData
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.name.trim()) {
    errors.name = "Name is required";
  }

  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!data.email) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(data.email)) {
    errors.email = "Email is invalid";
  }

  const pwRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!data.password) {
    errors.password = "Password is required";
  } else if (!pwRegex.test(data.password)) {
    errors.password =
      "Password must be at least 8 characters long and include a letter, a number, and a special character.";
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = "Confirm password is required.";
  } else if (data.confirmPassword !== data.password) {
    errors.confirmPassword = "Password and Confirm Password must be the same!";
  }
  return errors;
};

export const validateExpense = (
  data: ExpenseFormData
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.title.trim()) {
    errors.title = "Title is required";
  }

  if (!data.amount || data.amount <= 0) {
    errors.amount = "Amount must be greater than 0";
  }

  if (!data.categoryId) {
    errors.category = "Category is required";
  }

  if (!data.date) {
    errors.date = "Date is required";
  }
  return errors;
};

export const validateCategoreis = (
  data: CategoryFormData
): Record<string, string> => {
  const errors: Record<string, string> = {};

  //name
  const nameRegex = /^[\p{L}\s]{2,50}$/u;
  if (!data.name || !data.name.trim()) {
    errors.name = "name is required";
  } else if (!nameRegex.test(data.name)) {
    errors.name =
      "Invalid name. Name must be 2-50 characters and contain only letters, spaces, apostrophes, or hyphens";
  }
  //color
  if (!data.color || !data.color.trim()) {
    errors.color = "color is reqired";
  }
  return errors;
};
