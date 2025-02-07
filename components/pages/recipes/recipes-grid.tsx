"use client";

import services from "@/service/services";
import { Recipe } from "@/types/recipe";
import Image from "next/image";
import { useRouter } from "next/navigation";
import placeholderImage from "@/assets/images/recipe-placeholder.jpg";
import Badge from "@/components/ui/badge";

const RecipeGridItem = (recipe: Recipe) => {
  const { name, id, category, isActive, preparationTime } = recipe;
  const router = useRouter();

  return (
    <div
      className="max-w-[343px] h-[374px] cursor-pointer rounded-2xl overflow-hidden bg-white shadow-xl"
      onClick={() => router.push(`/recipes/${id}`)}
    >
      <Image
        src={recipe.imageUrl || placeholderImage}
        alt={recipe.name}
        width={400}
        height={400}
        className="h-1/2 object-cover"
      />
      <div className="mt-8 px-6 pb-6 text-[14px] h-1/2">
        <div className="flex font-semibold justify-between">
          <span className="text-indigo-500">{category?.name}</span>
          {!!preparationTime && (
            <span className="text-indigo-700">{preparationTime} min</span>
          )}
        </div>
        <Badge
          className="mt-1"
          text={isActive ? "Aktiivne" : "Mitteaktiivne"}
          color={isActive ? "active" : undefined}
          dot
        />
        <h3 className="mt-4 text-lg">{name}</h3>
      </div>
    </div>
  );
};

export default function RecipesGrid() {
  const recipes = services.recipeService.useGetAll().data;
  return (
    <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {recipes.map((recipe) => (
        <RecipeGridItem key={recipe.id} {...recipe} />
      ))}
    </div>
  );
}
