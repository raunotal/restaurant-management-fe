import { Endpoints } from "@/config/endpoints";
import { Supplier, CreateSupplierDTO } from "@/types/supplier";
import { Unit, CreateUnitDTO } from "@/types/unit";
import {
  IngredientCategory,
  CreateIngredientCategoryDTO,
} from "@/types/ingredient-category";
import { createDataService } from "./base";

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

const services = {
  unitService,
  supplierService,
  ingredientCategoryService,
  recipeCategoryService,
};

export default services;
