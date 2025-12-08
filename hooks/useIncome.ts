import { incomeApi } from "@/lib/api";
import { IncomeFormData } from "@/types/income";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

export const useGetIncome = (
  page: number,
  limit: number,
  search?: string,
  category?: string
) => {
  return useQuery({
    queryKey: ["incomeWithCategories", page, limit, search, category],
    queryFn: () => incomeApi.getAll(page, limit, search, category),
    staleTime: 5 * 6 * 1000,
    refetchOnWindowFocus: true,
  });
};

export const useCreateIncomes = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IncomeFormData) => incomeApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomesWithCategories"] });
    },
  });
};

export const useGetIncomeById = (id: string) => {
  return useQuery({
    queryKey: ["incomeWithCategories", id],
    queryFn: () => incomeApi.getById(id),
    staleTime: 5 * 6 * 1000,
  });
};

export const useUpdateIncomeById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IncomeFormData }) =>
      incomeApi.update(id, data),
    onSuccess: (updatedIncome) => {
      queryClient.setQueryData(
        ["incomesWithCategories", updatedIncome.data?._id],
        updatedIncome
      );
      queryClient.invalidateQueries({ queryKey: ["incomesWithCategories"] });
    },
  });
};

export const useDeleteIncomeById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => incomeApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomeWithCategories"] });
    },
  });
};
