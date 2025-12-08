"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useDeleteIncomeById, useGetIncome } from "@/hooks/useIncome";
import { useCategories } from "@/hooks/useCategories";
import { CategoriesResponse } from "@/types/category";
import { useEffect, useState } from "react";
import { icons } from "@/components/ui/icon";
import IncomeSkeleton from "@/components/skeleton/income/incomeListSkeleton";
import { useFeedBackStore } from "@/app/store/feedBackstore";
import { IncomeResponse } from "@/types/income";

export default function IncomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>();
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const deleteIncomeMutation = useDeleteIncomeById();
  const { message, type, clearFeedback } = useFeedBackStore();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "5", 10);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  //remove message after 3 Sec
  useEffect(() => {
    if (message) {
      setTimeout(() => clearFeedback(), 3000);
    }
  }, [message, clearFeedback]);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    if (searchTerm) params.set("search", searchTerm);
    else params.delete("search");

    if (selectedCategory) params.set("category", selectedCategory);
    else params.delete("category");
    router.replace(`/dashboard/income?${params.toString()}`);
  };

  const {
    data: incomesWithCategories,
    isPending,
    isError,
  } = useGetIncome(page, limit, search, category);

  const { data: categoires } = useCategories<CategoriesResponse>();
  if (isPending) {
    return (
      <>
        <IncomeSkeleton />
      </>
    );
  }
  // console.log(incomesWithCategories);
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this income?")) {
      return;
    }
    const idRegex = /^[0-9a-fA-F]{24}$/;
    if (!idRegex.test(id)) {
      useFeedBackStore.getState().setFeedbacks("Invalid Category!", "error");
      return;
    }
    const res: IncomeResponse = await deleteIncomeMutation.mutateAsync(id);
    useFeedBackStore
      .getState()
      .setFeedbacks(res.message, res.success ? "success" : "error");
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`/dashboard/income?${params.toString()}`);
  };

  const totalAmount = incomesWithCategories?.data.reduce(
    (sum, income) => sum + income.amount,
    0
  );

  const totalPages = incomesWithCategories?.pagination?.totalPage || 1;
  const getPageNumber = () => {
    const pages = [];
    const visiblePage = 5;
    //startpage = Math.max(1, currentPage - 5/2 )
    let startPage = Math.max(1, page - Math.floor(visiblePage / 2));
    const endPage = Math.min(totalPages, startPage + visiblePage - 1);
    // Adjust if we're near the end
    if (endPage - startPage + 1 < visiblePage) {
      startPage = Math.max(1, endPage - visiblePage + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };
  return (
    <>
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
      <div className="p-6 space-y-6 max-h-screen overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Income</h1>
            <p className="text-muted-foreground">
              Track and manage your income
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/income/add">Add Income</Link>
          </Button>
        </div>
        {/* filters and stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Filtered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <p>${totalAmount?.toFixed(2)}</p>
              </div>
              <p className="text-xs text-muted-foreground">Number of incomes</p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <div className="space-x-1 flex gap-2 flex-col md:flex-row">
                  <Input
                    placeholder="Search incomes..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 p-2"
                  />
                  <Button
                    type="button"
                    disabled={isPending}
                    className="w-10 md:w-20"
                    onClick={handleSearch}
                  >
                    filter
                  </Button>
                </div>
                <select
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input 
                          bg-background px-3 py-2 text-sm ring-offset-background 
                          focus-visible:outline-none focus-visible:ring-2 
                          focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="All">All Categories</option>

                  {categoires?.incomeCategories.map((ic) => (
                    <option key={ic._id} value={ic._id}>
                      {ic.name}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 gap-4 ">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>All Income</CardTitle>
              <CardDescription>
                Your Income history and transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 min-h-[600px]">
                {incomesWithCategories?.data.map((ic) => {
                  return (
                    <div
                      key={ic._id}
                      className="flex justify-between items-center border rounded-lg gap-4 p-4"
                    >
                      <div className="flex items-center gap-3">
                        {/* ICON */}
                        <div
                          style={{
                            background: ic?.categoryDetails?.color,
                          }}
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                        >
                          {icons.map((icon, index) => (
                            <div key={index}>
                              {
                                icon[
                                  ic?.categoryDetails?.name as keyof typeof icon
                                ]
                              }
                              {ic?.categoryDetails?.name &&
                                !(ic?.categoryDetails?.name in icon) &&
                                icon.other}
                            </div>
                          ))}
                        </div>
                        {/* DETAILS */}
                        <div>
                          <p className=" font-medium">{ic.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {ic.categoryDetails?.name}
                            {new Date(ic.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {ic.description}
                          </p>
                        </div>
                      </div>
                      {/* ACTION  */}
                      <div className="space-x-4">
                        <Button type="button">
                          <Link href={`/dashboard/income/${ic._id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                        <Button
                          type="button"
                          onClick={() => handleDelete(ic._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </div>
              <div className="flex justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                >
                  <ChevronLeft />
                </Button>
                <div className="space-x-2">
                  {getPageNumber().map((page) => (
                    <Button
                      key={page}
                      variant="outline"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                >
                  <ChevronRight />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
