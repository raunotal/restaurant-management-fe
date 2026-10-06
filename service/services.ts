import { Endpoints } from "@/config/endpoints";
import { Supplier, CreateSupplierDTO } from "@/types/supplier";
import { Unit, CreateUnitDTO } from "@/types/unit";
import {
  IngredientCategory,
  CreateIngredientCategoryDTO,
} from "@/types/ingredient-category";
import { createDataService } from "./base";
import { CreateRecipeDTO, Recipe } from "@/types/recipe";
import {
  CreateRecipeProductGroupDTO,
  RecipeProductGroup,
} from "@/types/recipe-product-group";
import { CreateIngredientDTO, Ingredient } from "@/types/ingredient";
import {
  CreateIngredientProductGroupDTO,
  IngredientProductGroup,
} from "@/types/ingredient-product-group";
import { CreateIngredientWarehouseDTO, IngredientWarehouse } from "@/types/ingredient-warehouse";

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

const recipeProductGroupService = createDataService<
  RecipeProductGroup,
  CreateRecipeProductGroupDTO
>(Endpoints.RecipeProductGroups);

const ingredientProductGroupService = createDataService<
  IngredientProductGroup,
  CreateIngredientProductGroupDTO
>(Endpoints.IngredientProductGroups);

const recipeService = createDataService<Recipe, CreateRecipeDTO>(
  Endpoints.Recipes
);

const ingredientService = createDataService<Ingredient, CreateIngredientDTO>(
  Endpoints.Ingredients
);

const ingredientWarehouseService = createDataService<IngredientWarehouse,CreateIngredientWarehouseDTO>(
  Endpoints.IngredientWarehouses
);

const services = {
  unitService,
  supplierService,
  ingredientCategoryService,
  ingredientProductGroupService,
  recipeCategoryService,
  recipeProductGroupService,
  recipeService,
  ingredientService,
  ingredientWarehouseService,
};

export default services;
