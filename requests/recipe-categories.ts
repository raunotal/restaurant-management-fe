import { Endpoint } from "@/config/endpoints";
import { QueryKey } from "@/config/query-keys";
import { API } from "@/lib/api-client";
import { RecipeCategory } from "@/types/recipe-category";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const getRecipeCategories = async () => {
  return (await API.get<RecipeCategory[]>(Endpoint.RecipeCategories)).data;
};

const createRecipeCategory = async (data: RecipeCategory) => {
  return (await API.post<RecipeCategory>(Endpoint.RecipeCategories, data)).data;
};

const updateRecipeCategory = async (data: RecipeCategory) => {
  return (
    await API.patch<RecipeCategory>(
      `${Endpoint.RecipeCategories}/${data.id}`,
      data
    )
  ).data;
};

const deleteRecipeCategory = async (id: string) => {
  return await API.delete(`${Endpoint.RecipeCategories}/${id}`);
};

export const useRecipeCategories = () => {
  const { data } = useQuery({
    queryKey: [QueryKey.RecipeCategories],
    queryFn: getRecipeCategories,
  });
  return { recipeCategories: data };
};

export const useCreateRecipeCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRecipeCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.RecipeCategories],
      });
    },
  });
};

export const useUpdateRecipeCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRecipeCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.RecipeCategories],
      });
    },
  });
};

export const useDeleteRecipeCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRecipeCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.RecipeCategories],
      });
    },
  });
};
