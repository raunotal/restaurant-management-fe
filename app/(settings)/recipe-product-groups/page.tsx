"use client";

import {
  TableFilterType,
  TableHeader,
  TableRow,
} from "@/components/common/table";
import SettingsPage from "@/components/layout/settings-page";
import RecipeProductGroupsModal from "@/components/pages/recipe-product-groups/recipe-product-groups-modal";
import services from "@/service/services";
import React, { useState } from "react";

export default function RecipeProductGroupsPage() {
  const recipeProductGroups =
    services.recipeProductGroupService.useGetAll().data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipeProductGroup, setSelectedRecipeProductGroup] =
    useState<string>();

  const tableHeaders: TableHeader[] = [
    { title: "Nimi", filterType: TableFilterType.Input },
    { title: "Kirjeldus", filterType: TableFilterType.None },
    { title: "", filterType: TableFilterType.None },
  ];
  const tableRows: TableRow[] = recipeProductGroups.map(
    (recipeProductGroup) => ({
      name: recipeProductGroup.name,
      description: recipeProductGroup.description,
      actions: [
        {
          content: "Muuda",
          data: recipeProductGroup.id,
          onClick: (data) => {
            setSelectedRecipeProductGroup(data);
            setIsModalOpen(true);
          },
        },
      ],
    })
  );

  const toggleModal = () => {
    if (isModalOpen) {
      setSelectedRecipeProductGroup(undefined);
    }
    setIsModalOpen((prevState) => !prevState);
  };

  const recipeProductGroupToEdit = recipeProductGroups.find(
    (recipeProductGroup) => recipeProductGroup.id === selectedRecipeProductGroup
  );

  return (
    <>
      <RecipeProductGroupsModal
        isOpen={isModalOpen}
        setIsOpen={toggleModal}
        recipeProductGroup={recipeProductGroupToEdit}
      />
      <SettingsPage
        title="Retsepti tooterühmad"
        description="Siin saad hallata retsepti tooterühmi"
        tableData={tableRows}
        tableHeaders={tableHeaders}
        data={recipeProductGroups}
        toggleModal={toggleModal}
      />
    </>
  );
}
