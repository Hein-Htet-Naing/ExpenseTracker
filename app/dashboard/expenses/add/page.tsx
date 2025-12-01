"use client";
import React from "react";
import { Expenseform } from "@/components/expenses/Expensesform";
import { expenseAPI } from "@/lib/api";
import { ExpenseFormData } from "@/types/expense";
import { useRouter } from "next/navigation";
import { ExpenseFormSkeleton } from "@/components/skeleton/expense/expenseFormskeleton";

export default function AddExpensePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleAddExpenseSubmit = async (data: ExpenseFormData) => {
    setIsLoading(true);
    try {
      await expenseAPI.create(data);
      router.push("/dashboard/expenses");
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return <ExpenseFormSkeleton />;
  }
  const handleCancel = () => {
    router.push("/dashboard/expenses");
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Add New Expense</h1>
          <p className="text-muted-foreground mt-2">
            Track your spending by adding a new expense
          </p>
        </div>

        <Expenseform
          onSubmit={handleAddExpenseSubmit}
          isLoading={isLoading}
          isEdit={false}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
