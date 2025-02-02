import { z } from "zod";
import { RecipeCategory, recipeCategorySchema } from "./recipe-category";

type RecipeType = {
  id: string;
  name: string;
  preparationTime: number;
  category: RecipeCategory | null;
  isActive: boolean;
};

type CreateRecipeDTOType = Omit<RecipeType, "id" | "category"> & {
  categoryId: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const recipeSchema: z.ZodType<RecipeType> = z.object({
  id: z.string(),
  name: z.string().min(1, "Retsepti nimi ei tohi olla tühi"),
  preparationTime: z.number().positive(),
  category: z.union([recipeCategorySchema, z.null()]),
  isActive: z.boolean(),
});

export const createRecipeSchema: z.ZodType<CreateRecipeDTOType> = z.object({
  name: z.string().min(1, "Retsepti nimi ei tohi olla tühi"),
  preparationTime: z.number().positive(),
  categoryId: z.string(),
  isActive: z.boolean(),
});

export type Recipe = z.infer<typeof recipeSchema>;
export type CreateRecipeDTO = z.infer<typeof createRecipeSchema>;
