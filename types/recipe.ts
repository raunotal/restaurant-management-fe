import { z } from "zod";
import { RecipeCategory, recipeCategorySchema } from "./recipe-category";

type RecipeType = {
  id: string;
  name: string;
  preparationTime?: number;
  category: RecipeCategory;
  isActive: boolean;
  imageUrl?: string;
  comments?: string;
};

type CreateRecipeDTOType = Omit<RecipeType, "id" | "category"> & {
  categoryId: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const recipeSchema: z.ZodType<RecipeType> = z.object({
  id: z.string(),
  name: z.string().min(1, "Retsepti nimi ei tohi olla tühi"),
  preparationTime: z.number().nonnegative().optional(),
  category: recipeCategorySchema,
  isActive: z.boolean(),
  imageUrl: z.string().optional(),
  comments: z.string().optional(),
});

export const createRecipeSchema: z.ZodType<CreateRecipeDTOType> = z.object({
  name: z.string().min(1, "Retsepti nimi ei tohi olla tühi"),
  preparationTime: z.number().nonnegative().optional(),
  categoryId: z.string().nonempty(),
  isActive: z.boolean(),
  imageUrl: z.string().optional(),
  comments: z.string().optional(),
});

export type Recipe = z.infer<typeof recipeSchema>;
export type CreateRecipeDTO = z.infer<typeof createRecipeSchema>;
