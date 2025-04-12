"use client";

import { TableRow } from "@/components/common/table";
import SettingsPage from "@/components/layout/settings-page";
import UnitModal from "@/components/pages/units/unit-modal";
import services from "@/service/services";
import React, { useState } from "react";

export default function UnitsPage() {
  const units = services.unitService.useGetAll().data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<string>();

  const tableHeaders = ["Nimi", "Lühend", "Pea ühik", "Suhe", ""];
  const tableRows: TableRow[] = units.map((unit) => ({
    name: unit.name,
    displayName: unit.displayName,
    parentUnit: unit.parentUnit?.name,
    ratio: unit.ratio === 0 ? "-" : unit.ratio,
    actions: [
      {
        content: "Muuda",
        data: unit.id,
        onClick: (data) => {
          setSelectedUnit(data);
          setIsModalOpen(true);
        },
      },
    ],
  }));

  const toggleModal = () => {
    if (isModalOpen) {
      setSelectedUnit(undefined);
    }
    setIsModalOpen((prevState) => !prevState);
  };
  const unitToEdit = units.find((unit) => unit.id === selectedUnit);

  return (
    <>
      <UnitModal
        isOpen={isModalOpen}
        setIsOpen={toggleModal}
        unit={unitToEdit}
      />
      <SettingsPage
        title="Ühikud"
        description="Siin saad hallata ühikuid"
        tableData={tableRows}
        tableHeaders={tableHeaders}
        data={units}
        toggleModal={toggleModal}
      />
    </>
  );
}
