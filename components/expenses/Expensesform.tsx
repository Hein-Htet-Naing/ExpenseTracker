import { ExpenseFormData } from "@/types/expense";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { validateExpense } from "@/lib/validation";
import { Button } from "../ui/button";
import { useCategories } from "@/hooks/useCategories";

interface ExpenseFormProps {
  initialData?: Partial<ExpenseFormData>;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export const Expenseform: React.FC<ExpenseFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  isEdit,
  onCancel,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<ExpenseFormData>({
    title: "",
    amount: 0,
    categoryId: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    ...initialData,
  });
  const { data: categories } = useCategories();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validateExpenseError = validateExpense(formData);
    if (Object.keys(validateExpenseError).length > 0) {
      setErrors(validateExpenseError);
      return;
    }
    try {
      await onSubmit(formData);
    } catch (error: any) {
      setErrors({
        submit:
          error.response?.data?.message ||
          "Failed to save expense. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>{!isEdit ? "Add New Expense" : " Edit Expense"} </CardTitle>
        <CardDescription>
          {!isEdit
            ? "Enter the details of your new expense"
            : "Enter the details of a expense"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              Expense Title
            </Label>
            <Input
              id="title"
              name="title"
              type="text"
              value={formData.title || ""}
              placeholder="e.g., Groceries, Movie Tickets, etc."
              onChange={handleChange}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>
          {/* Amount & Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium">
                Amount *
              </Label>
              <div className="relative flex gap-4 justify-between items-center">
                <div>$</div>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="w-full"
                  value={formData.amount || ""}
                  onChange={handleChange}
                />
              </div>
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Categories *
              </Label>
              <select
                id="categoryId"
                name="categoryId"
                onChange={handleChange}
                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none 
                  focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 
                }${errors.category ? "border-destructive" : ""}`}
              >
                <option value="">Select a category</option>
                {categories?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category}</p>
              )}
            </div>
          </div>
          {/* Date */}
          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-medium">
              Date *
            </label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date.split("T")[0]}
              onChange={handleChange}
            />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date}</p>
            )}
          </div>
          {/* Categoreis */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              placeholder="Add any additional details about this expense..."
              onChange={handleChange}
              rows={3}
            ></Textarea>
          </div>
          <div className="space-x-2">
            <Button type="submit" className="sm:order-2">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEdit ? "Updating..." : "Adding..."}
                </>
              ) : isEdit ? (
                "Update Expense"
              ) : (
                " Add Expense"
              )}
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="sm:order-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
