import { API } from "@/lib/api-client";
import {
  UseQueryOptions,
  UseMutationOptions,
  useMutation,
  useSuspenseQuery,
} from "@tanstack/react-query";
import axios from "axios";

export const useCustomQuery = <TData>(
  queryKey: string | string[],
  fetchFn: () => Promise<TData>,
  id?: string,
  options?: Omit<UseQueryOptions<TData, Error>, "queryKey" | "queryFn">
) => {
  const finalQueryKey = id ? [queryKey, id] : [queryKey];
  return useSuspenseQuery<TData, Error>({
    queryKey: finalQueryKey,
    queryFn: fetchFn,
    ...options,
  });
};

export const useCustomMutation = <TData, TResponse = TData>(
  queryKey: string | string[],
  mutationFn: (data: TData) => Promise<TResponse>,
  options?: Omit<UseMutationOptions<TResponse, Error, TData>, "mutationFn">
) => {
  return useMutation<TResponse, Error, TData>({
    ...options,
    mutationFn,
    onSuccess: (_, variables) => {
      options?.onSuccess?.(_, variables, { variables });
    },
  });
};

export const createDataService = <
  T extends { id: string },
  CreateDTO,
  UpdateDTO extends { id: string } = CreateDTO & { id: string }
>(
  endpoint: string
) => {
  const get = async (id: string) => {
    try {
      return (await API.get<T>(`${endpoint}/${id}`))?.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  };

  const getAll = async () => {
    return (await API.get<T[]>(endpoint)).data;
  };

  const create = async (data: CreateDTO) => {
    return (await API.post<T>(endpoint, data)).data;
  };

  const update = async (data: UpdateDTO) => {
    return (await API.patch<T>(`${endpoint}/${data.id}`, data)).data;
  };

  const remove = async (data: T): Promise<void> => {
    return await API.delete(`${endpoint}/${data.id}`);
  };

  const useGet = (id: string) =>
    useCustomQuery<T | null>(endpoint, () => get(id), id);
  const useGetAll = () => useCustomQuery<T[]>(endpoint, getAll);
  const useCreate = (
    options?: Omit<UseMutationOptions<T, Error, CreateDTO>, "mutationFn">
  ) => useCustomMutation<CreateDTO, T>(endpoint, create, options);
  const useUpdate = (
    options?: Omit<UseMutationOptions<T, Error, UpdateDTO>, "mutationFn">
  ) => useCustomMutation<UpdateDTO, T>(endpoint, update, options);
  const useDelete = (
    options?: Omit<UseMutationOptions<void, Error, T>, "mutationFn">
  ) => useCustomMutation<T, void>(endpoint, remove, options);

  return { useGet, useGetAll, useCreate, useUpdate, useDelete };
};
