"use client";

import { TableRow } from "@/components/common/table";
import SettingsPage from "@/components/layout/settings-page";
import SupplierModal from "@/components/pages/suppliers/supplier-modal";
import services from "@/service/services";
import React, { useState } from "react";

export default function SuppliersPage() {
  const suppliers = services.supplierService.useGetAll().data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<string>();

  const tableHeaders = ["Nimi", "Aadress", ""];
  const tableRows: TableRow[] = suppliers.map((supplier) => ({
    name: supplier.name,
    address: supplier.address,
    actions: [
      {
        content: "Muuda",
        data: supplier.id,
        onClick: (data) => {
          setSelectedSupplier(data);
          setIsModalOpen(true);
        },
      },
    ],
  }));

  const toggleModal = () => {
    if (isModalOpen) {
      setSelectedSupplier(undefined);
    }
    setIsModalOpen((prevState) => !prevState);
  };

  const supplierToEdit = suppliers.find(
    (supplier) => supplier.id === selectedSupplier
  );

  return (
    <>
      <SupplierModal
        isOpen={isModalOpen}
        setIsOpen={toggleModal}
        supplier={supplierToEdit}
      />
      <SettingsPage
        title="Tarnijad"
        description="Siin saad hallata tarnijaid."
        tableData={tableRows}
        tableHeaders={tableHeaders}
        data={suppliers}
        toggleModal={toggleModal}
      />
    </>
  );
}
