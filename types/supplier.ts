import { z } from "zod";

type SupplierType = {
  id: string;
  name: string;
  address?: string;
};

type CreateSupplierDTOType = Omit<SupplierType, "id">;

export const supplierSchema: z.ZodType<SupplierType> = z.object({
  id: z.string(),
  name: z.string().min(1, "Tarnija nimi ei tohi olla tühi"),
  address: z.string().optional(),
});

export const createSupplierSchema: z.ZodType<CreateSupplierDTOType> = z.object({
  name: z.string().min(1, "Tarnija nimi ei tohi olla tühi"),
  address: z.string().optional(),
});

export type Supplier = z.infer<typeof supplierSchema>;
export type CreateSupplierDTO = z.infer<typeof createSupplierSchema>;
