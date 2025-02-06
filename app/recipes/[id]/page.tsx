"use client";

import RecipesFrom from "@/components/pages/recipes/recipes-form";
import services from "@/service/services";
import { notFound, useParams } from "next/navigation";
import React from "react";

export default function UpdateRecipesPage() {
  const id = useParams().id;
  const recipe = services.recipeService.useGet(id as string).data;

  if (!recipe) {
    notFound();
  }

  return <RecipesFrom recipe={recipe!} />;
}
