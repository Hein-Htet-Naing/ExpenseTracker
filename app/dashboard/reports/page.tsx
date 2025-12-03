"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { ReportFilters as ReportFiltersType } from "@/types/report";
import { ReportFilters } from "@/components/report/ReportFilters";
import { ExpenseSummaryCards } from "@/components/report/ExpenseSummary";
import { useExpenseReportByFilter, useRecentExpense } from "@/hooks/useReports";
import { MonthlySpendingChart } from "@/components/report/MonthlySpendingChart";
import { CategorySpendingChart } from "@/components/report/CategorySpendingChart";
import { Button } from "@/components/ui/button";
import { Expense } from "@/types/expense";
import { icons } from "@/components/ui/icon";
export default function ReaportPage() {
  const [filters, setFilters] = useState<ReportFiltersType>({});
  const {
    data: expenseSummaryCards,
    isPending,
    isError,
  } = useExpenseReportByFilter(filters);
  const { data: recentExpense, isLoading } = useRecentExpense();
  // console.log(recentExpense);
  // console.log(expenseSummaryCards?.data?.monthlyBreakDown);
  // console.log(expenseSummaryCards);
  const handleFiltersChange = (newFilters: ReportFiltersType) => {
    setFilters(newFilters);
  };
  const handleResetFilters = () => {
    setFilters({});
  };

  if (isError) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-destructive">
            Error Loading Reports
          </h2>
          <p className="text-muted-foreground mt-2">
            Failed to load report data. Please try again.
          </p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 space-y-6 max-h-screen overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex flex-col items-center md:items-start gap-4 ">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Expense Reports
            </h1>
            <p className="text-muted-foreground">
              Analyze your spending patterns and trends
            </p>
          </div>
        </div>
        <ReportFilters
          filters={filters}
          onFilterChange={handleFiltersChange}
          onReset={handleResetFilters}
        />
        {isPending && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Generating report...</span>
          </div>
        )}

        {/* flex flex-col lg:flex-row gap-4 m-4 */}
        {!isPending && expenseSummaryCards?.success && (
          <>
            <ExpenseSummaryCards summary={expenseSummaryCards.data.summary} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CategorySpendingChart
                categorySpending={
                  expenseSummaryCards?.data?.categoryBreakDown ?? []
                }
              />
              <MonthlySpendingChart
                monthlySpending={
                  expenseSummaryCards?.data?.monthlyBreakDown ?? []
                }
              />
            </div>
          </>
        )}
        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>
              Latest expense transactions included in this report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              {recentExpense?.data?.length > 0 ? (
                recentExpense?.data?.map((expense: Expense) => {
                  return (
                    <div
                      key={expense._id}
                      className="flex items-center justify-between p-3 border rounded-lg gap-3"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full" />
                        {icons.map((icon, index) => (
                          <div
                            key={index}
                            style={{
                              backgroundColor:
                                expense.categoryDetails?.color || "#ccc",
                            }}
                            className="p-2 rounded-full"
                          >
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
                        <div>
                          <p className="font-medium">{expense.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {expense.categoryDetails?.name}
                            {new Date(expense.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${expense.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No Recent Expenses Found
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {!isPending && (!expenseSummaryCards?.success || isError) && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                No report data available. Try adjusting your filters.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
