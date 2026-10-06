"use client";

import {
  TableFilterType,
  TableHeader,
  TableRow,
} from "@/components/common/table";
import SettingsPage from "@/components/layout/settings-page";
import IngredientProductGroupsModal from "@/components/pages/ingredient-product-groups/ingredient-product-groups-modal";
import services from "@/service/services";
import React, { useState } from "react";

export default function IngredientProductGroupsPage() {
  const ingredientProductGroups =
    services.ingredientProductGroupService.useGetAll().data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIngredientProductGroup, setSelectedIngredientProductGroup] =
    useState<string>();

  const tableHeaders: TableHeader[] = [
    { title: "Nimi", filterType: TableFilterType.Input },
    { title: "Kirjeldus", filterType: TableFilterType.None },
    { title: "", filterType: TableFilterType.None },
  ];
  const tableRows: TableRow[] = ingredientProductGroups.map(
    (ingredientProductGroup) => ({
      name: ingredientProductGroup.name,
      description: ingredientProductGroup.description,
      actions: [
        {
          content: "Muuda",
          data: ingredientProductGroup.id,
          onClick: (data) => {
            setSelectedIngredientProductGroup(data);
            setIsModalOpen(true);
          },
        },
      ],
    })
  );

  const toggleModal = () => {
    if (isModalOpen) {
      setSelectedIngredientProductGroup(undefined);
    }
    setIsModalOpen((prevState) => !prevState);
  };

  const ingredientProductGroupToEdit = ingredientProductGroups.find(
    (ingredientProductGroup) => ingredientProductGroup.id === selectedIngredientProductGroup
  );

  return (
    <>
      <IngredientProductGroupsModal
        isOpen={isModalOpen}
        setIsOpen={toggleModal}
        ingredientProductGroup={ingredientProductGroupToEdit}
      />
      <SettingsPage
        title="Tooraine tooterühmad"
        description="Siin saad hallata tooraine tooterühmi"
        tableData={tableRows}
        tableHeaders={tableHeaders}
        data={ingredientProductGroups}
        toggleModal={toggleModal}
      />
    </>
  );
}
