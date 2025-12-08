"use client";

import { useFeedBackStore } from "@/app/store/feedBackstore";
import { CategoryForm } from "@/components/categoreis/CategoryForm";
import { useCreateCategories } from "@/hooks/useCategories";
import { CategoryFormData } from "@/types/category";
import { useRouter } from "next/navigation";
import React from "react";
export default function AddCategoryPage() {
  const router = useRouter();
  const [isloading, setloading] = React.useState<boolean>(false);
  const createCategorymutation = useCreateCategories();

  const handleAddCategoriesSubmit = async (data: CategoryFormData) => {
    setloading(true);
    console.log(data);
    try {
      const res = await createCategorymutation.mutateAsync(data);
      useFeedBackStore
        .getState()
        .setFeedbacks(res.message!, res.success ? "success" : "error");
      router.push("/dashboard/categories");
    } catch (error: any) {
      setloading(false);
      console.error("Failed to create category:", error);
      throw error;
    }
    setloading(false);
  };
  const handleCancel = () => {
    router.push("/dashboard/categories");
  };
  return (
    <>
      <div className="px-6 py-4 max-h-screen overflow-y-auto no-scrollbar">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">
              Create Category
            </h1>
            <p className="text-muted-foreground mt-2">
              Create a new category for your expenses
            </p>
          </div>
          <CategoryForm
            onSubmit={handleAddCategoriesSubmit}
            isLoading={isloading}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </>
  );
}
