import { Endpoints } from "@/config/endpoints";
import { Supplier, CreateSupplierDTO } from "@/types/supplier";
import { Unit, CreateUnitDTO } from "@/types/unit";
import {
  IngredientCategory,
  CreateIngredientCategoryDTO,
} from "@/types/ingredient-category";
import { createDataService } from "./base";
import { CreateRecipeDTO, Recipe } from "@/types/recipe";

const unitService = createDataService<Unit, CreateUnitDTO>(Endpoints.Units);
const supplierService = createDataService<Supplier, CreateSupplierDTO>(
  Endpoints.Suppliers
);
const ingredientCategoryService = createDataService<
  IngredientCategory,
  CreateIngredientCategoryDTO
>(Endpoints.IngredientCategories);

const recipeCategoryService = createDataService<
  IngredientCategory,
  CreateIngredientCategoryDTO
>(Endpoints.RecipeCategories);

const recipeService = createDataService<Recipe, CreateRecipeDTO>(
  Endpoints.Recipes
);

const services = {
  unitService,
  supplierService,
  ingredientCategoryService,
  recipeCategoryService,
  recipeService,
};

export default services;
