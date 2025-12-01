"use client";
import { CategoryForm } from "@/components/categoreis/CategoryForm";
import { CategoryFormData } from "@/types/category";
import {
  GetCategoryById,
  UpdateCategoriesMutation,
} from "@/hooks/useCategories";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CategoryFormSkeleton } from "@/components/skeleton/category/categoryFormSkeleton";

export default function EditCategoryPage() {
  const { id } = useParams<{ id: string }>();
  const updateMutation = UpdateCategoriesMutation();
  const { data: getCategoriesById, isPending } = GetCategoryById(id);
  const [isloading, setloading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (error) setTimeout(() => setError(""), 3000);
  }, [error]);

  if (isPending) {
    return (
      <>
        <CategoryFormSkeleton />
      </>
    );
  }
  //if no category found
  if (!getCategoriesById?.data) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-destructive">
              Category Not Found
            </h2>
            <p className="text-muted-foreground mt-2">
              The category you&aposre trying to edit doesn&apost exist.
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

  const category = getCategoriesById.data;
  const initialData = {
    name: category?.name,
    description: category?.description,
    color: category?.color,
  };
  //hanlde update for submittng edited category
  const handleSubmit = async (data: CategoryFormData) => {
    if (!category?._id) {
      setError("CategoryId Not Found!");
      return;
    }
    setloading(true);
    try {
      const res = await updateMutation.mutateAsync({
        id: category._id,
        data: data,
      });
      //redirect if success
      if (res.success) router.push("/dashboard/categories");
    } finally {
      setloading(false);
    }
  };
  const handleCancel = () => {
    router.push("/dashboard/categories");
  };
  return (
    <>
      {error && (
        <div
          className={`w-full max-w-md mx-auto mb-4 p-4 text-center rounded bg-red-100 text-red-800`}
        >
          {error}
        </div>
      )}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Edit Category</h1>
            <p className="text-muted-foreground mt-2">
              Update the details of your category
            </p>
          </div>
          <CategoryForm
            initialData={initialData}
            isEdit={true}
            onSubmit={handleSubmit}
            isLoading={isloading}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </>
  );
}
