import { Endpoint } from "@/config/endpoints";
import { QueryKey } from "@/config/query-keys";
import { API } from "@/lib/api-client";
import { Unit } from "@/types/unit";
import { useCustomMutation, useCustomQuery } from "./base";
import { UseQueryOptions } from "@tanstack/react-query";

const getUnits = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return (await API.get<Unit[]>(Endpoint.Units)).data;
};

const createUnit = async (data: Unit) => {
  return (await API.post<Unit>(Endpoint.Units, data)).data;
};

const updateUnit = async (data: Unit) => {
  return (await API.patch<Unit>(`${Endpoint.Units}/${data.id}`, data)).data;
};

const deleteUnit = async (id: string): Promise<void> => {
  await API.delete(`${Endpoint.Units}/${id}`);
};

export const useUnits = (
  options?: Omit<UseQueryOptions<Unit[], Error>, "queryKey" | "queryFn">
) => {
  return useCustomQuery<Unit[]>(QueryKey.Units, getUnits, options);
};

export const useCreateUnit = () => {
  return useCustomMutation<Unit>(QueryKey.Units, createUnit);
};

export const useUpdateUnit = () => {
  return useCustomMutation<Unit>(QueryKey.Units, updateUnit);
};

export const useDeleteUnit = () => {
  return useCustomMutation(QueryKey.Units, deleteUnit);
};
