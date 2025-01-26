"use client";

import Table from "@/components/common/table";
import UnitModal from "@/components/pages/units/unit-modal";
import Button from "@/components/ui/button";
import { UNITS_TABLE_DATA } from "@/mock/mock-data";
import { useUnits } from "@/requests/units";
import React, { useState } from "react";

export default function Units() {
  const { data: units } = useUnits();
  const [isAdding, setIsAdding] = useState(true);

  const handleIsAdding = () => setIsAdding((prevState) => !prevState);

  const tableHeaders = UNITS_TABLE_DATA.headers;
  const tableRows = units.map((unit) => ({
    name: unit.name,
    displayName: unit.displayName,
    parentUnit: unit.parentUnit?.name,
    ratio: unit.ratio,
    actions: [
      {
        text: "Muuda",
        onClick: () => console.log("Edit"),
      },
    ],
  }));

  return (
    <>
      <UnitModal isOpen={isAdding} setIsOpen={setIsAdding} />
      <div className="flex items-center">
        <div className="flex-1">
          <h3>Ühikud</h3>
          <p className="text-gray-600 text-sm mt-2">
            Siin saad hallata ühikuid
          </p>
        </div>
        <div>
          <Button onClick={handleIsAdding}>Lisa uus</Button>
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
