"use client";

import IngredientFrom from "@/components/pages/ingredients/ingredients-form";
import services from "@/service/services";
import { notFound, useParams } from "next/navigation";
import React from "react";

export default function UpdateIngredientPage() {
  const { id } = useParams();
  const ingredient = services.ingredientService.useGet(id as string).data;

  if (!ingredient) {
    notFound();
  }

  return <IngredientFrom ingredient={ingredient!} />;
}
