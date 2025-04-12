"use client";

import IngredientFrom from "@/components/pages/ingredients/ingredients-form";
import services from "@/service/services";
import { useSearchParams } from "next/navigation";

export default function CreateIngredientPage() {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");
  const ingredient = services.ingredientService.useGet(id as string).data;

  if (!id || !ingredient) {
    return <IngredientFrom />;
  }

  ingredient.id = "";
  ingredient.name = "";
  return <IngredientFrom ingredient={ingredient} />;
}
