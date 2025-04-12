"use client";

import React, { useState } from "react";
import { TableRow } from "@/components/common/table";
import SettingsPage from "@/components/layout/settings-page";
import services from "@/service/services";
import IngredientCategoriesModal from "@/components/pages/ingredient-categories/ingredient-categories-modal";

export default function IngredientCategoriesPage() {
  const ingredientCategories =
    services.ingredientCategoryService.useGetAll().data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIngredientCategory, setSelectedIngredientCategory] =
    useState<string>();

  const tableHeaders = ["Nimi", "Kirjeldus", ""];
  const tableRows: TableRow[] = ingredientCategories.map(
    (ingredientCategory) => ({
      name: ingredientCategory.name,
      description: ingredientCategory.description,
      actions: [
        {
          content: "Muuda",
          data: ingredientCategory.id,
          onClick: (data) => {
            setSelectedIngredientCategory(data);
            setIsModalOpen(true);
          },
        },
      ],
    })
  );

  const toggleModal = () => {
    if (isModalOpen) {
      setSelectedIngredientCategory(undefined);
    }
    setIsModalOpen((prevState) => !prevState);
  };

  const ingredientCategoryToEdit = ingredientCategories.find(
    (ingredientCategory) => ingredientCategory.id === selectedIngredientCategory
  );

  return (
    <>
      <IngredientCategoriesModal
        isOpen={isModalOpen}
        setIsOpen={toggleModal}
        ingredientCategory={ingredientCategoryToEdit}
      />
      <SettingsPage
        title="Tooraine kategooriad"
        description="Siin saad hallata tooraine kategooriaid"
        tableData={tableRows}
        tableHeaders={tableHeaders}
        data={ingredientCategories}
        toggleModal={toggleModal}
      />
    </>
  );
}
