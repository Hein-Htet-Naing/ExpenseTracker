import { categoryAPI } from "@/lib/api";
import { CategoryFormData } from "@/types/category";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCategories = <T = any>() => {
  return useQuery<T>({
    queryKey: ["categories"],
    queryFn: categoryAPI.getAll,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};

export const useCreateCategories = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CategoryFormData) => categoryAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
export const GetCategoryById = (id: string) => {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: () => categoryAPI.getById(id),
    staleTime: 5 * 60 * 1000,
  });
};

export const UpdateCategoriesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryFormData }) =>
      categoryAPI.update(id, data),
    onSuccess: (updatedCategory) => {
      queryClient.setQueryData(
        ["categories", updatedCategory.data?._id],
        updatedCategory
      );
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const DeleteCategoriesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoryAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["expensesWithCategories"] });
      queryClient.invalidateQueries({ queryKey: ["incomesWithCategories"] });
    },
  });
};
