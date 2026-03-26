import { z } from "zod";

export type RecipeCategoryType = {
  id: string;
  name: string;
  description?: string;
};

type CreateRecipeCategoryDTOType = Omit<RecipeCategoryType, "id">;

export const recipeCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Retsepti kategooria nimi ei tohi olla tühi"),
  description: z.string().optional(),
}) satisfies z.ZodType<RecipeCategoryType>;

export const createRecipeCategorySchema = z.object({
  name: z.string().min(1, "Retsepti kategooria nimi ei tohi olla tühi"),
  description: z.string().optional(),
}) satisfies z.ZodType<CreateRecipeCategoryDTOType>;

export type RecipeCategory = z.infer<typeof recipeCategorySchema>;
export type CreateRecipeCategoryDTO = z.infer<
  typeof createRecipeCategorySchema
>;
