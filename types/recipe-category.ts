import { z } from "zod";

export const recipeCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Kategooria nimi ei tohi olla tühi"),
});

export const recipeCategoryMutationSchema = recipeCategorySchema.omit({
  id: true,
});

export type RecipeCategory = z.infer<typeof recipeCategorySchema>;
export type RecipeCategoryMutation = z.infer<
  typeof recipeCategoryMutationSchema
>;
