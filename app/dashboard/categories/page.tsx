"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useFeedBackStore } from "@/app/store/feedBackstore";
import { DeleteCategoriesMutation, useCategories } from "@/hooks/useCategories";
import { CategoriesListSkeleton } from "@/components/skeleton/category/categoryListSkeleton";

//need to add Edit and Delete functionality

export default function CategoriesPage() {
  const { message, type, clearFeedback } = useFeedBackStore();
  const { data: categories, isPending, error } = useCategories();
  const deleteMutation = DeleteCategoriesMutation();
  const [searchTerm, setSearchTerm] = useState<string>("");
  useEffect(() => {
    if (message) {
      setTimeout(() => clearFeedback(), 3000);
    }
  }, [message, clearFeedback]);
  if (isPending) {
    return (
      <>
        <CategoriesListSkeleton />
      </>
    );
  }
  const filterCategories = categories?.filter(
    (category) =>
      category.name
        .toLocaleLowerCase()
        .includes(searchTerm.toLocaleLowerCase()) ||
      category.description
        ?.toLocaleLowerCase()
        .includes(searchTerm.toLocaleLowerCase())
  );

  if (error) {
    return (
      <>
        <div className="text-center py-8">
          <h2 className="text-2xl text-destructive font-bold">
            Error Loading Categories
          </h2>
          <p className="text-muted-foreground mt-2">
            Failed to load categories.Please Try again
          </p>
          <Button className="mt-2" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </>
    );
  }

  //handeling the delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }
    const idRegex = /^[0-9a-fA-F]{24}$/;
    if (!idRegex.test(id)) {
      useFeedBackStore.getState().setFeedbacks("Invalid Category!", "error");
      return;
    }
    try {
      await deleteMutation.mutateAsync(id);
      useFeedBackStore
        .getState()
        .setFeedbacks("Successfully delete category", "success");
    } catch (error) {
      useFeedBackStore
        .getState()
        .setFeedbacks("Failed to delete category", "error");
    }
  };
  return (
    <div className="p-6 space-y-6 max-h-screen overflow-y-auto no-scrollbar">
      {message && (
        <div
          className={`w-full max-w-md mx-auto mb-4 p-4 text-center rounded ${
            type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
          onClick={clearFeedback}
        >
          {message}
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Manage your expense categories
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/categories/add">Add Category</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium">
            Search Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories by name or description..."
            className="max-w-md"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <CardDescription>
            Manage your expense categories and their colors
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filterCategories?.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">
                {searchTerm
                  ? "No categories found for the search term."
                  : "No categories available. Please add a category."}
              </p>
              {!searchTerm && (
                <Button className="mt-2" asChild>
                  <Link href="/dashboard/categories/add">
                    Create your first category
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
              {filterCategories?.map((category) => (
                <Card key={category._id}>
                  <CardContent>
                    <div className="flex flex-col items-center justify-between space-y-2">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <h3 className="font-semibold">{category.name}</h3>
                      </div>
                      <div className="flex space-x-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <Link
                            href={`/dashboard/categories/${category._id}/edit`}
                          >
                            Edit
                          </Link>
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:bg-destructive"
                          onClick={() => handleDelete(category._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
