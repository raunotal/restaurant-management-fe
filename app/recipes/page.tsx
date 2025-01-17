"use client";

import RecipeCategoryModal from "@/components/recipes/recipe-category-modal";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useState } from "react";

export default function RecipesPage() {
  const [showAddRecipes, setShowAddRecipes] = useState(false);

  const toggleAddRecipes = () => setShowAddRecipes((prevSate) => !prevSate);

  return (
    <>
      {showAddRecipes && (
        <RecipeCategoryModal isOpen onClose={toggleAddRecipes} />
      )}
      <main className="recipes-page">
        <div className="recipes-page__header">
          <h1>Retseptid</h1>
          <div className="recipes-page__header--right">
            <Button icon="plus" iconPosition="left" theme="dark" type="button">
              Lisa retsept
            </Button>
            <Button theme="dark" type="button" onClick={toggleAddRecipes}>
              Muuda kategooriaid
            </Button>
          </div>
        </div>
        <div className="recipes-page__content">
          <Input placeholder="Otsi retsepte" icon="search" />
          <div>badges</div>
          <div>categories</div>
          <div>recipes</div>
        </div>
      </main>
    </>
  );
}
