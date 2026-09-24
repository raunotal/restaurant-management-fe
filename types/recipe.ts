import { z } from "zod";
import { RecipeCategory, recipeCategorySchema } from "./recipe-category";
import {
  RecipeProductGroup,
  recipeProductGroupSchema,
} from "./recipe-product-group";

type RecipeType = {
  id: string;
  name: string;
  preparationTime?: number;
  category: RecipeCategory;
  productGroup?: RecipeProductGroup | null;
  isActive: boolean;
  imageUrl?: string;
  comments?: string;
};

type CreateRecipeDTOType = Omit<RecipeType, "id" | "category" | "productGroup"> & {
  categoryId: string;
  productGroupId?: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const recipeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Retsepti nimi ei tohi olla tühi"),
  preparationTime: z.number().nonnegative().optional(),
  category: recipeCategorySchema,
  productGroup: recipeProductGroupSchema.nullable().optional(),
  isActive: z.boolean(),
  imageUrl: z.string().optional(),
  comments: z.string().optional(),
}) satisfies z.ZodType<RecipeType>;

export const createRecipeSchema = z.object({
  name: z.string().min(1, "Retsepti nimi ei tohi olla tühi"),
  preparationTime: z.number().nonnegative().optional(),
  categoryId: z.string().min(1),
  productGroupId: z.string().optional(),
  isActive: z.boolean(),
  imageUrl: z.string().optional(),
  comments: z.string().optional(),
}) satisfies z.ZodType<CreateRecipeDTOType>;

export type Recipe = z.infer<typeof recipeSchema>;
export type CreateRecipeDTO = z.infer<typeof createRecipeSchema>;
