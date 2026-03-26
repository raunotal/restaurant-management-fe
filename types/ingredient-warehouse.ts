import { z } from "zod";

type IngredientWarehouseType = {
  id: string;
  name: string;
  description?: string;
};

type CreateIngredientWarehouseDTOType = Omit<IngredientWarehouseType, "id">;

export const ingredientWarehouseSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Koostisaine ladu nimi ei tohi olla tühi"),
  description: z.string().optional(),
}) satisfies z.ZodType<IngredientWarehouseType>;

export const createIngredientWarehouseSchema = z.object({
  name: z.string().min(1, "Koostisaine ladu nimi ei tohi olla tühi"),
  description: z.string().optional(),
}) satisfies z.ZodType<CreateIngredientWarehouseDTOType>;

export type IngredientWarehouse = z.infer<typeof ingredientWarehouseSchema>;
export type CreateIngredientWarehouseDTO = z.infer<
  typeof createIngredientWarehouseSchema
>;
