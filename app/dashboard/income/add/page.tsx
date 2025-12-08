"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ExpenseFormSkeleton } from "@/components/skeleton/expense/expenseFormskeleton";
import { Incomeform } from "@/components/incomes/IncomeForm";
import { useCreateIncomes } from "@/hooks/useIncome";
import { IncomeFormData } from "@/types/income";
import { useFeedBackStore } from "@/app/store/feedBackstore";

export default function AddExpensePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const createIncomeMutation = useCreateIncomes();
  const handleAddIncomeSubmit = async (data: IncomeFormData) => {
    setIsLoading(true);
    try {
      const res = await createIncomeMutation.mutateAsync(data);
      useFeedBackStore
        .getState()
        .setFeedbacks(res.message, res.success ? "success" : "error");
      router.push("/dashboard/income");
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return <ExpenseFormSkeleton />;
  }
  const handleCancel = () => {
    router.push("/dashboard/incomes");
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Add New Income</h1>
          <p className="text-muted-foreground mt-2">
            Track your spending by adding a new income
          </p>
        </div>

        <Incomeform
          onSubmit={handleAddIncomeSubmit}
          isLoading={isLoading}
          isEdit={false}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
