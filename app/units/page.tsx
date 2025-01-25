"use client";

import Table from "@/components/common/table";
import Header from "@/components/layout/header";
import AddUnitModal from "@/components/pages/units/add-unit-modal";
import Button from "@/components/ui/button";
import { UNITS_TABLE_DATA } from "@/mock/mock-data";
import React, { useState } from "react";

export default function Units() {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleIsAdding = () => setIsAdding((prevState) => !prevState);

  const tableHeaders = UNITS_TABLE_DATA.headers;
  const tableRows = UNITS_TABLE_DATA.rows;

  return (
    <>
      <AddUnitModal isOpen={isAdding} setIsOpen={setIsAdding} />
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
      <Table className="mt-8" headers={tableHeaders} rows={tableRows} />
    </>
  );
}
