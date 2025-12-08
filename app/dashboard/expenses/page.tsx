"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { icons } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { expenseAPI } from "@/lib/api";
import { Expense } from "@/types/expense";
import { useCategories } from "@/hooks/useCategories";
import { useExpensesWithCategories } from "@/hooks/useExpenses";
import { ExpensesSkeleton } from "@/components/skeleton/expense/expenseListSkeleton";
import { CategoriesResponse } from "@/types/category";
export default function ExpensesPage() {
  const [page, setPage] = useState<number>(1);
  const [expense, setExpense] = useState<Expense[]>([]);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [loadingDelete, setloadingDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  //fetch expenses with categories
  const { data: categories } = useCategories<CategoriesResponse>();
  const { data: expensesWithCategories, isPending } = useExpensesWithCategories(
    page,
    5
  );
  useEffect(() => {
    const fetchExpense = async () => {
      if (expensesWithCategories) {
        setExpense(expensesWithCategories.data);
        setTotalPage(expensesWithCategories.pagination?.totalPage);
      }
    };
    fetchExpense();
  }, [expensesWithCategories]);
  if (isPending) {
    return (
      <>
        <ExpensesSkeleton />
      </>
    );
  }
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) {
      return;
    }
    setloadingDelete(true);
    try {
      const response = await expenseAPI.delete(id);
      if (response.success) {
        alert(response.message);
      }
    } catch (error: any) {
      alert("Failed to delete expense. Please try again.");
    } finally {
      setloadingDelete(false);
    }
  };

  const filteredExpenses = expense.filter((expense) => {
    const matchesSearch =
      expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      expense.categoryDetails?._id === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const totalAmount = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const hanldeNextPage = () => {
    if (page < totalPage) {
      setPage(page + 1);
    }
  };
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const hanldePageNumber = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const getPageNumber = () => {
    const pages = [];
    const visiblePage = 5;
    //startpage = Math.max(1, currentPage - 5/2 )
    let startPage = Math.max(1, page - Math.floor(visiblePage / 2));
    const endPage = Math.min(totalPage, startPage + visiblePage - 1);
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
    <div className="p-6 space-y-6 max-h-screen overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground">
            Manage and track your expenses
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/expenses/add">Add Expense</Link>
        </Button>
      </div>

      {/* Filters and Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Filtered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {expense.length} expenses
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 p-2"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input 
                bg-background px-3 py-2 text-sm ring-offset-background 
                focus-visible:outline-none focus-visible:ring-2 
                focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="All">All Categories</option>
                {categories?.categories?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expenses List */}
      <Card>
        <CardHeader>
          <CardTitle>All Expenses</CardTitle>
          <CardDescription>
            Your expense history and transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredExpenses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No expenses found.</p>
              <Button className="mt-2" asChild>
                <Link href="/dashboard/expenses/add">
                  Add your first expense
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-4 min-h-[600px]">
                {filteredExpenses.map((expense) => (
                  <div
                    key={expense._id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      {/* icons */}
                      <div
                        style={{ background: expense.categoryDetails?.color }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center`}
                      >
                        {icons.map((icon, index) => (
                          <div key={index}>
                            {
                              icon[
                                expense.categoryDetails
                                  ?.name as keyof typeof icon
                              ]
                            }
                            {expense?.categoryDetails?.name &&
                              !(expense?.categoryDetails?.name in icon) &&
                              icon.other}
                          </div>
                        ))}
                      </div>
                      {/* Details */}
                      <div>
                        <p className="font-medium">{expense.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {expense?.categoryDetails?.name}
                          {new Date(expense.date).toLocaleDateString()}
                        </p>
                        {expense.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {expense.description}
                          </p>
                        )}
                      </div>
                    </div>
                    {/* Action */}
                    <div className="text-right">
                      <p className="font-medium text-lg">
                        ${expense.amount.toFixed(2)}
                      </p>
                      <div className="flex space-x-2 mt-2">
                        <Button variant="outline" size="sm">
                          <Link
                            href={`/dashboard/expenses/${expense._id}/edit`}
                          >
                            Edit
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(expense._id)}
                          className="text-destructive"
                        >
                          {loadingDelete ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                          ) : (
                            "  Delete"
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* pagination */}
              <div className="">
                <div className="mt-4 text-sm text-muted-foreground">
                  Page {page} of {totalPage}
                </div>
                <div className="flex justify-center items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                  >
                    <ChevronLeft />
                  </Button>
                  <div className="space-x-2">
                    {getPageNumber().map((page) => (
                      <Button
                        key={page}
                        variant="outline"
                        onClick={() => hanldePageNumber(page)}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" onClick={hanldeNextPage}>
                    <ChevronRight />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
