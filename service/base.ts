import { API } from "@/lib/api-client";
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
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
      options?.onSuccess?.(_, variables, { variables });
    },
  });
};

export const createDataService = <
  T extends { id: string },
  CreateDTO,
  UpdateDTO extends { id: string } = T
>(
  endpoint: string
) => {
  const getAll = async () => {
    return (await API.get<T[]>(endpoint)).data;
  };

  const create = async (data: CreateDTO) => {
    return (await API.post<T>(endpoint, data)).data;
  };

  const update = async (data: UpdateDTO) => {
    return (await API.patch<T>(`${endpoint}/${data.id}`, data)).data;
  };

  const remove = async (data: T): Promise<T> => {
    return await API.delete(`${endpoint}/${data.id}`);
  };

  const useGetAll = () => useCustomQuery<T[]>(endpoint, getAll);
  const useCreate = (
    options?: Omit<UseMutationOptions<T, Error, CreateDTO>, "mutationFn">
  ) => useCustomMutation<CreateDTO, T>(endpoint, create, options);
  const useUpdate = (
    options?: Omit<UseMutationOptions<T, Error, UpdateDTO>, "mutationFn">
  ) => useCustomMutation<UpdateDTO, T>(endpoint, update, options);
  const useDelete = (
    options?: Omit<UseMutationOptions<T, Error, T>, "mutationFn">
  ) => useCustomMutation<T>(endpoint, remove, options);

  return { useGetAll, useCreate, useUpdate, useDelete };
};
