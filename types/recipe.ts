import { z } from "zod";
import { recipeCategorySchema } from "./recipe-category";

export const recipeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Retsepti nimi ei tohi olla tühi"),
  imageUrl: z.string().url().optional(),
  comments: z.string().optional(),
  preparationTime: z.number().int().positive().optional(),
  isActive: z.boolean().default(false),
  category: recipeCategorySchema.optional(),
  ingredients: z
    .array(
      z.object({
        // Define RecipeIngredient schema here if needed
      })
    )
    .optional(),
  recipes: z
    .array(
      z.object({
        // Define RecipeRecipe schema here if needed
      })
    )
    .optional(),
  inRecipes: z
    .array(
      z.object({
        // Define RecipeRecipe schema here if needed
      })
    )
    .optional(),
  preparationInstructions: z
    .array(
      z.object({
        // Define PreparationInstructions schema here if needed
      })
    )
    .optional(),
});

// Recipe mutation schema (omitting id and relations)
export const recipeMutationSchema = recipeSchema
  .omit({
    id: true,
  })
  .extend({
    categoryId: z.string().optional(),
  });

export type Recipe = z.infer<typeof recipeSchema>;
export type RecipeMutation = z.infer<typeof recipeMutationSchema>;
