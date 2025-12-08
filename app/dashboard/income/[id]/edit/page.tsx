"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Incomeform } from "@/components/incomes/IncomeForm";
import { useGetIncomeById, useUpdateIncomeById } from "@/hooks/useIncome";
import { IncomeFormData } from "@/types/income";
import { useFeedBackStore } from "@/app/store/feedBackstore";
import { Button } from "@/components/ui/button";
import IncomeFormSkeleton from "@/components/skeleton/income/incomeFormSkeleton";
export default function AddExpensePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const { data: getIncomeById, isPending } = useGetIncomeById(id);
  const updateIncomeMutation = useUpdateIncomeById();
  if (isPending) {
    return (
      <>
        <IncomeFormSkeleton />
      </>
    );
  }
  if (!getIncomeById?.data) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-destructive">
              Income Not Found
            </h2>
            <p className="text-muted-foreground mt-2">
              The Income you&aposre trying to edit doesn&apost exist.
            </p>
            <Button
              onClick={() => router.push("/dashboard/expenses")}
              className="mt-4"
            >
              Back to Income Page.
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const income = getIncomeById?.data;
  const initialData = {
    title: income?.title,
    amount: income?.amount,
    categoryId: income?.categoryDetails?._id,
    source: income?.source,
    date: income?.date,
    description: income?.description,
  };

  const handleUpdateIncomeSubmit = async (data: IncomeFormData) => {
    setIsLoading(true);
    try {
      const res = await updateIncomeMutation.mutateAsync({ id, data });
      useFeedBackStore
        .getState()
        .setFeedbacks(res.message, res.success ? "success" : "error");
      router.push("/dashboard/income");
    } finally {
      setIsLoading(false);
    }
  };
  const handleCancel = () => {
    router.push("/dashboard/income");
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Edit Income</h1>
          <p className="text-muted-foreground mt-2">
            Update the details of your income
          </p>
        </div>

        <Incomeform
          onSubmit={handleUpdateIncomeSubmit}
          isLoading={isLoading}
          isEdit={true}
          onCancel={handleCancel}
          initialData={initialData}
        />
      </div>
    </div>
  );
}
