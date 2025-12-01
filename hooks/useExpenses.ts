import { useQuery } from "@tanstack/react-query";
import { expenseAPI } from "@/lib/api";
export const useExpensesWithCategories = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["expensesWithCategories", page, limit],
    queryFn: () => expenseAPI.list(page, limit),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};
