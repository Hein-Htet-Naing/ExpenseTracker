import { LoginFormData, RegisterFormData } from "@/types/auth";
import { CategoryFormData } from "@/types/category";
import { ExpenseFormData } from "@/types/expense";
import { IncomeFormData } from "@/types/income";

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
  if (!data.types) {
    errors.types = "Type is reqired";
  }
  //color
  if (!data.color || !data.color.trim()) {
    errors.color = "Color is reqired";
  }
  return errors;
};

export const validateIncome = (
  data: IncomeFormData
): Record<string, string> => {
  const errors: Record<string, string> = {};
  // Helper: Sanitize and check string fields
  const sanitizeString = (value: any, maxLength: number = 100): string => {
    if (typeof value !== "string") return "";
    return value.trim().substring(0, maxLength);
  };
  // TTILE VALIDATION
  const title = sanitizeString(data.title);
  if (!title) {
    errors.title = "Title is required and cannot be empty or just spaces.";
  } else if (title.length < 3) {
    errors.title = "Title must be at least 3 characters long.";
  } else if (title.length > 50) {
    errors.title = "Title cannot exceed 50 characters.";
  }
  //AMOUNT VALIDATION
  const amount = data.amount;
  if (amount == null || isNaN(amount)) {
    errors.amount = "Amount is required and must be a valid number.";
  } else if (amount <= 0) {
    errors.amount = "Amount must be greater than 0.";
  } else if (amount > 10000000) {
    errors.amount = "Amount cannot exceed $1,000,0000.";
  }
  //AMOUNT VALIDATION
  if (!data.categoryId) {
    errors.category = "Category is required.Please select a category";
  }

  // DATE VALIDATION
  if (!data.date) {
    errors.date = "Date is required.";
  } else {
    const dateObj = new Date(data.date);
    if (isNaN(dateObj.getTime())) {
      errors.date = "Date must be a valid date (e.g., YYYY-MM-DD).";
      //for dev, comment the below line
      // } else if (dateObj > new Date()) {
      //   errors.date = "Date cannot be in the future.";
      // } else if (dateObj < new Date("2000-01-01")) {
      //   errors.date = "Date must be after 2000.";
    }
  }
  if (data.description) {
    const description = sanitizeString(data.description, 500); // Limit to 500 chars
    if (description.length > 500) {
      errors.description = "Description cannot exceed 500 characters.";
    }
    // Update data.description if sanitizing in-place
    data.description = description;
  }

  return errors;
};
