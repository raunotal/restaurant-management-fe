import { Endpoints } from "@/config/endpoints";
import { QueryKey } from "@/config/query-keys";
import { API } from "@/lib/api-client";
import { CreateUnitDTO, Unit } from "@/types/unit";
import { useCustomMutation, useCustomQuery } from "./base";
import { UseMutationOptions } from "@tanstack/react-query";

const getUnits = async () => {
  return (await API.get<Unit[]>(Endpoints.Units)).data;
};

const createUnit = async (data: CreateUnitDTO) => {
  return (await API.post<Unit>(Endpoints.Units, data)).data;
};

const updateUnit = async (data: Unit) => {
  return (await API.patch<Unit>(`${Endpoints.Units}/${data.id}`, data)).data;
};

const deleteUnit = async (data: Unit): Promise<Unit> => {
  return await API.delete(`${Endpoints.Units}/${data.id}`);
};

export const useUnits = () => {
  return useCustomQuery<Unit[]>(QueryKey.Units, getUnits);
};

export const useCreateUnit = (
  options?: Omit<
    UseMutationOptions<CreateUnitDTO, Error, CreateUnitDTO>,
    "mutationFn"
  >
) => {
  return useCustomMutation<CreateUnitDTO>(QueryKey.Units, createUnit, options);
};

export const useUpdateUnit = (
  options?: Omit<UseMutationOptions<Unit, Error, Unit>, "mutationFn">
) => {
  return useCustomMutation<Unit>(QueryKey.Units, updateUnit, options);
};

export const useDeleteUnit = (
  options?: Omit<UseMutationOptions<Unit, Error, Unit>, "mutationFn">
) => {
  return useCustomMutation<Unit>(QueryKey.Units, deleteUnit, options);
};
