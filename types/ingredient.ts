import { z } from "zod";
import {
  IngredientCategory,
  ingredientCategorySchema,
} from "./ingredient-category";
import { Supplier, supplierSchema } from "./supplier";
import { Unit, unitSchema } from "./unit";

type IngredientType = {
  id: string;
  name: string;
  grossQuantity?: number;
  netQuantity?: number;
  unit: Unit;
  purchasePrice?: number;
  category: IngredientCategory;
  supplier: Supplier;
  imageUrl?: string;
  isActive: boolean;
  comments?: string;
};

type CreateIngredientDTOType = Omit<
  IngredientType,
  "id" | "category" | "supplier" | "unit"
> & {
  categoryId: string;
  supplierId: string;
  unitId: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ingredientSchema: z.ZodType<IngredientType> = z.object({
  id: z.string(),
  name: z.string().min(1, "Tooraine nimi ei tohi olla tühi"),
  grossQuantity: z.number().nonnegative().optional(),
  netQuantity: z.number().nonnegative().optional(),
  purchasePrice: z.number().nonnegative().optional(),
  category: ingredientCategorySchema,
  supplier: supplierSchema,
  unit: unitSchema,
  imageUrl: z.string().optional(),
  isActive: z.boolean(),
  comments: z.string().optional(),
});

export const createIngredientSchema: z.ZodType<CreateIngredientDTOType> =
  z.object({
    name: z.string().min(1, "Tooraine nimi ei tohi olla tühi"),
    grossQuantity: z.number().nonnegative(),
    netQuantity: z.number().nonnegative(),
    purchasePrice: z.number().nonnegative(),
    categoryId: z.string().nonempty(),
    supplierId: z.string().nonempty(),
    unitId: z.string().nonempty(),
    imageUrl: z.string().optional(),
    isActive: z.boolean(),
    comments: z.string().optional(),
  });

export type Ingredient = z.infer<typeof ingredientSchema>;
export type CreateIngredientDTO = z.infer<typeof createIngredientSchema>;
