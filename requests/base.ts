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

export const useCustomMutation = <
  TData extends { id?: string } | string,
  TResponse = TData
>(
  queryKey: string | string[],
  mutationFn: (data: TData) => Promise<TResponse>,
  options?: Omit<UseMutationOptions<TResponse, Error, TData>, "mutationFn">
) => {
  const queryClient = useQueryClient();

  return useMutation<TResponse, Error, TData>({
    mutationFn,
    ...options,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey:
          typeof variables === "object" && "id" in variables
            ? [queryKey, variables.id]
            : [queryKey],
      });
      options?.onSuccess?.(_, variables, { variables });
    },
  });
};
