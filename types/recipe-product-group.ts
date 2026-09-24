import { z } from "zod";

export type RecipeProductGroupType = {
  id: string;
  name: string;
  description?: string;
};

type CreateRecipeProductGroupDTOType = Omit<RecipeProductGroupType, "id">;

export const recipeProductGroupSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Retsepti tooterühma nimi ei tohi olla tühi"),
  description: z.string().optional(),
}) satisfies z.ZodType<RecipeProductGroupType>;

export const createRecipeProductGroupSchema = z.object({
  name: z.string().min(1, "Retsepti tooterühma nimi ei tohi olla tühi"),
  description: z.string().optional(),
}) satisfies z.ZodType<CreateRecipeProductGroupDTOType>;

export type RecipeProductGroup = z.infer<typeof recipeProductGroupSchema>;
export type CreateRecipeProductGroupDTO = z.infer<
  typeof createRecipeProductGroupSchema
>;
