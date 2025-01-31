"use client";

import Table, { TableRow } from "@/components/common/table";
import UnitModal from "@/components/pages/units/unit-modal";
import Button from "@/components/ui/button";
import { UNITS_TABLE_DATA } from "@/mock/mock-data";
import { useUnits } from "@/requests/units";
import React, { useState } from "react";

export default function Units() {
  const { data: units } = useUnits();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<string>();

  const tableHeaders = UNITS_TABLE_DATA.headers;
  const tableRows: TableRow[] = units.map((unit) => ({
    name: unit.name,
    displayName: unit.displayName,
    parentUnit: unit.parentUnit?.name,
    ratio: unit.ratio === 0 ? "-" : unit.ratio,
    actions: [
      {
        text: "Muuda",
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
      <div className="flex items-center">
        <div className="flex-1">
          <h3>Ühikud</h3>
          <p className="text-gray-600 text-sm mt-2">
            Siin saad hallata ühikuid
          </p>
        </div>
        <div>
          <Button onClick={toggleModal}>Lisa uus</Button>
        </div>
      </div>
      <Table
        className="mt-8"
        headers={tableHeaders}
        rows={tableRows}
        groupBy="parentUnit"
      />
    </>
  );
}
