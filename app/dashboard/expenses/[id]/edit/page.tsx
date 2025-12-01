"use client";

import { useEffect, useState } from "react";
import { Expense, ExpenseFormData, ExpenseRespone } from "@/types/expense";
import { expenseAPI } from "@/lib/api";
import { useParams } from "next/navigation";
import { Expenseform } from "@/components/expenses/Expensesform";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
export default function EitExpnesePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [error, setErrors] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExpensebyId = async () => {
      if (!id) return setErrors("No Id founded!");
      const fetchbyId = await expenseAPI.getbyid(id);
      setExpense(fetchbyId);
    };
    fetchExpensebyId();
  }, [id]);
  if (!expense) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-destructive">
              Expense Not Found
            </h2>
            <p className="text-muted-foreground mt-2">
              The expense you&aposre trying to edit doesn&apost exist.
            </p>
            <Button
              onClick={() => router.push("/dashboard/expenses")}
              className="mt-4"
            >
              Back to Expenses
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const initialData = {
    title: expense?.title,
    amount: expense?.amount,
    categoryId: expense?.categoryId,
    date: expense?.date,
    description: expense?.description || "",
  };

  const handleEditSubmit = async (data: ExpenseFormData) => {
    setLoading(true);
    try {
      await expenseAPI.update(id, data);
      router.push("/dashboard/expenses");
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    router.push("/dashboard/expenses");
  };

  return (
    <>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Edit Expense</h1>
            <p className="text-muted-foreground mt-2">
              Update the details of your expense
            </p>
          </div>

          <Expenseform
            onSubmit={handleEditSubmit}
            isLoading={loading}
            initialData={initialData}
            isEdit={true}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </>
  );
}
