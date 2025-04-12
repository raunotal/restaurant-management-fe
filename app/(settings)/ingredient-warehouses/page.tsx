"use client";

import React, { useState } from "react";
import { TableRow } from "@/components/common/table";
import SettingsPage from "@/components/layout/settings-page";
import services from "@/service/services";
import IngredientWarehouseModal from "@/components/pages/ingredient-warehouses/ingredient-warehouse-modal";

export default function IngredientWarehousesPage() {
  const ingredientWarehouses =
    services.ingredientWarehouseService.useGetAll().data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIngredientWarehouse, setSelectedIngredientWarehouse] =
    useState<string>();

  const tableHeaders = ["Nimi", "Kirjeldus", ""];
  const tableRows: TableRow[] = ingredientWarehouses.map(
    (ingredientWarehouse) => ({
      name: ingredientWarehouse.name,
      description: ingredientWarehouse.description,
      actions: [
        {
          content: "Muuda",
          data: ingredientWarehouse.id,
          onClick: (data) => {
            setSelectedIngredientWarehouse(data);
            setIsModalOpen(true);
          },
        },
      ],
    })
  );

  const toggleModal = () => {
    if (isModalOpen) {
      setSelectedIngredientWarehouse(undefined);
    }
    setIsModalOpen((prevState) => !prevState);
  };

  const ingredientWarehouseToEdit = ingredientWarehouses.find(
    (ingredientWarehouse) =>
      ingredientWarehouse.id === selectedIngredientWarehouse
  );

  return (
    <>
      <IngredientWarehouseModal
        isOpen={isModalOpen}
        setIsOpen={toggleModal}
        ingredientWarehouse={ingredientWarehouseToEdit}
      />
      <SettingsPage
        title="Tooraine laod"
        description="Siin saad hallata tooraine ladusid"
        tableData={tableRows}
        tableHeaders={tableHeaders}
        data={ingredientWarehouses}
        toggleModal={toggleModal}
      />
    </>
  );
}
