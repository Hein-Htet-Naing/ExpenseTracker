"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { ReportFilters as ReportFiltersType } from "@/types/report";
import { ReportFilters } from "@/components/report/ReportFilters";
import { ExpenseSummaryCards } from "@/components/report/ExpenseSummary";
import { useExpenseReportByFilter } from "@/hooks/useReports";
import { MonthlySpendingChart } from "@/components/report/MonthlySpendingChart";

export default function ReaportPage() {
  const [filters, setFilters] = useState<ReportFiltersType>({});
  const {
    data: expenseSummaryCards,
    isPending,
    isError,
  } = useExpenseReportByFilter(filters);
  console.log(expenseSummaryCards?.data?.monthlyBreakDown);
  // console.log(expenseSummaryCards);
  const handleFiltersChange = (newFilters: ReportFiltersType) => {
    setFilters(newFilters);
  };
  const handleResetFilters = () => {
    setFilters({});
  };

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between items-center md:items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Expense Reports
            </h1>
            <p className="text-muted-foreground">
              Analyze your spending patterns and trends
            </p>
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
          {!isPending && expenseSummaryCards?.success && (
            <>
              <ExpenseSummaryCards summary={expenseSummaryCards.data.summary} />
              <MonthlySpendingChart
                monthlySpending={
                  expenseSummaryCards?.data?.monthlyBreakDown ?? []
                }
              />
            </>
          )}

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
      </div>
    </>
  );
}
