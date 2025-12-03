import { ReportFilters } from "@/types/report";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reportApi } from "@/lib/api";
export const useExpenseReportByFilter = (filters: ReportFilters) => {
  const serializedfilter = filters ? JSON.stringify(filters) : undefined;
  return useQuery({
    queryKey: ["expense-report", serializedfilter],
    queryFn: () => reportApi.getExpenseReport(filters),
    staleTime: 5 * 60 * 1000,
    enabled: !!filters,
  });
};
export const useRecentExpense = () => {
  return useQuery({
    queryKey: ["expense-recent"],
    queryFn: () => reportApi.getRecentExpense(),
    staleTime: 5 * 60 * 1000,
  });
};
// console.log("startDate:" + filters.startDate);
// console.log("endDate:" + filters.endDate);
// console.log("max Amount:" + filters.maxAmount);
// console.log("min Amount:" + filters.minAmount);
// console.log("categoriesIds Array:" + filters.categoryIds);
