import { z } from "zod";

type IngredientCategoryType = {
  id: string;
  name: string;
  description?: string;
};

type CreateIngredientCategoryDTOType = Omit<IngredientCategoryType, "id">;

export const ingredientCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Koostisaine kategooria nimi ei tohi olla tühi"),
  description: z.string().optional(),
}) satisfies z.ZodType<IngredientCategoryType>;

export const createIngredientCategorySchema = z.object({
  name: z.string().min(1, "Koostisaine kategooria nimi ei tohi olla tühi"),
  description: z.string().optional(),
}) satisfies z.ZodType<CreateIngredientCategoryDTOType>;

export type IngredientCategory = z.infer<typeof ingredientCategorySchema>;
export type CreateIngredientCategoryDTO = z.infer<
  typeof createIngredientCategorySchema
>;
