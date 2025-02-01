import { Endpoints } from "@/config/endpoints";
import { API } from "@/lib/api-client";
import { CreateSupplierDTO, Supplier } from "@/types/supplier";
import { useCustomMutation, useCustomQuery } from "./base";
import { QueryKey } from "@/config/query-keys";
import { UseMutationOptions } from "@tanstack/react-query";

const getSuppliers = async () => {
  return (await API.get<Supplier[]>(Endpoints.Suppliers)).data;
};

const createSupplier = async (data: CreateSupplierDTO) => {
  return (await API.post<Supplier>(Endpoints.Suppliers, data)).data;
};

const updateSupplier = async (data: Supplier) => {
  return (await API.patch<Supplier>(`${Endpoints.Suppliers}/${data.id}`, data))
    .data;
};

const deleteSupplier = async (data: Supplier): Promise<Supplier> => {
  return await API.delete(`${Endpoints.Suppliers}/${data.id}`);
};

export const useSuppliers = () => {
  return useCustomQuery<Supplier[]>(QueryKey.Suppliers, getSuppliers);
};

export const useCreateSupplier = (
  options?: Omit<
    UseMutationOptions<CreateSupplierDTO, Error, CreateSupplierDTO>,
    "mutationFn"
  >
) => {
  return useCustomMutation<CreateSupplierDTO>(
    QueryKey.Suppliers,
    createSupplier,
    options
  );
};

export const useUpdateSupplier = (
  options?: Omit<UseMutationOptions<Supplier, Error, Supplier>, "mutationFn">
) => {
  return useCustomMutation<Supplier>(
    QueryKey.Suppliers,
    updateSupplier,
    options
  );
};

export const useDeleteSupplier = (
  options?: Omit<UseMutationOptions<Supplier, Error, Supplier>, "mutationFn">
) => {
  return useCustomMutation<Supplier>(
    QueryKey.Suppliers,
    deleteSupplier,
    options
  );
};
