"use client";

import IngredientFrom from "@/components/pages/ingredients/ingredients-form";
import services from "@/service/services";
import { notFound, useSearchParams } from "next/navigation";

export default function CreateIngredientPage() {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  if (!id) {
    return <IngredientFrom />;
  }

  const ingredient = services.ingredientService.useGet(id as string).data;

  if (!ingredient) {
    notFound();
  }

  ingredient.id = "";
  ingredient.name = "";
  return <IngredientFrom ingredient={ingredient} />;
}
