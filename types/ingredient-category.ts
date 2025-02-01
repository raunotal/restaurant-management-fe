import { z } from "zod";

export type IngredientCategory = {
  id: string;
  name: string;
  description?: string;
};

export type CreateIngredientCategoryDTO = Omit<IngredientCategory, "id">;

export const createIngredientCategorySchema: z.ZodType<CreateIngredientCategoryDTO> = z.object({
  name: z.string().min(1, "Kategooria nimi ei tohi olla tühi"),
  description: z.string().optional(),
});
