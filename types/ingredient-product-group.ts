import { z } from "zod";

export type IngredientProductGroupType = {
  id: string;
  name: string;
  description?: string;
};

type CreateIngredientProductGroupDTOType = Omit<IngredientProductGroupType, "id">;

export const ingredientProductGroupSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Tooraine tooterühma nimi ei tohi olla tühi"),
  description: z.string().optional(),
}) satisfies z.ZodType<IngredientProductGroupType>;

export const createIngredientProductGroupSchema = z.object({
  name: z.string().min(1, "Tooraine tooterühma nimi ei tohi olla tühi"),
  description: z.string().optional(),
}) satisfies z.ZodType<CreateIngredientProductGroupDTOType>;

export type IngredientProductGroup = z.infer<typeof ingredientProductGroupSchema>;
export type CreateIngredientProductGroupDTO = z.infer<
  typeof createIngredientProductGroupSchema
>;
