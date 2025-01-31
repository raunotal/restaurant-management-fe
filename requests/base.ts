import {
  UseQueryOptions,
  UseMutationOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

export const useCustomQuery = <TData>(
  queryKey: string | string[],
  fetchFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, Error>, "queryKey" | "queryFn">
) => {
  return useSuspenseQuery<TData, Error>({
    queryKey: [queryKey],
    queryFn: fetchFn,
    ...options,
  });
};

export const useCustomMutation = <TData, TResponse = TData>(
  queryKey: string | string[],
  mutationFn: (data: TData) => Promise<TResponse>,
  options?: Omit<UseMutationOptions<TResponse, Error, TData>, "mutationFn">
) => {
  const queryClient = useQueryClient();

  return useMutation<TResponse, Error, TData>({
    ...options,
    mutationFn,
    onSuccess: (_, variables) => {
      console.log("onSuccess", queryKey, variables);

      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
      options?.onSuccess?.(_, variables, { variables });
    },
  });
};
