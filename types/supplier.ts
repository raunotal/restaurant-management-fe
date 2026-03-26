import { z } from "zod";

type SupplierType = {
  id: string;
  name: string;
  address?: string;
  contact?: string;
  deliveryTerms?: string;
};

type CreateSupplierDTOType = Omit<SupplierType, "id">;

export const supplierSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Tarnija nimi ei tohi olla tühi"),
  address: z.string().optional(),
  contact: z.string().optional(),
  deliveryTerms: z.string().optional(),
}) satisfies z.ZodType<SupplierType>;

export const createSupplierSchema = z.object({
  name: z.string().min(1, "Tarnija nimi ei tohi olla tühi"),
  address: z.string().optional(),
  contact: z.string().optional(),
  deliveryTerms: z.string().optional(),
}) satisfies z.ZodType<CreateSupplierDTOType>;

export type Supplier = z.infer<typeof supplierSchema>;
export type CreateSupplierDTO = z.infer<typeof createSupplierSchema>;
