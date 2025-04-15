"use client";

import {
  TableFilterType,
  TableHeader,
  TableRow,
} from "@/components/common/table";
import SettingsPage from "@/components/layout/settings-page";
import RecipeCategoriesModal from "@/components/pages/recipe-categories/recipe-categories-modal";
import services from "@/service/services";
import React, { useState } from "react";

export default function RecipeCategoriesPage() {
  const recipeCategories = services.recipeCategoryService.useGetAll().data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipeCategory, setSelectedRecipeCategory] =
    useState<string>();

  const tableHeaders: TableHeader[] = [
    { title: "Nimi", filterType: TableFilterType.Input },
    { title: "Kirjeldus", filterType: TableFilterType.None },
    { title: "", filterType: TableFilterType.None },
  ];
  const tableRows: TableRow[] = recipeCategories.map((recipeCategory) => ({
    name: recipeCategory.name,
    description: recipeCategory.description,
    actions: [
      {
        content: "Muuda",
        data: recipeCategory.id,
        onClick: (data) => {
          setSelectedRecipeCategory(data);
          setIsModalOpen(true);
        },
      },
    ],
  }));

  const toggleModal = () => {
    if (isModalOpen) {
      setSelectedRecipeCategory(undefined);
    }
    setIsModalOpen((prevState) => !prevState);
  };

  const recipeCategoryToEdit = recipeCategories.find(
    (recipeCategory) => recipeCategory.id === selectedRecipeCategory
  );

  return (
    <>
      <RecipeCategoriesModal
        isOpen={isModalOpen}
        setIsOpen={toggleModal}
        recipeCategory={recipeCategoryToEdit}
      />
      <SettingsPage
        title="Retsepti kategooriad"
        description="Siin saad hallata retsepti kategooriaid"
        tableData={tableRows}
        tableHeaders={tableHeaders}
        data={recipeCategories}
        toggleModal={toggleModal}
      />
    </>
  );
}
