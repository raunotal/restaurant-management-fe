"use client";

import { TableFilterType, TableRow } from "@/components/common/table";
import SettingsPage from "@/components/layout/settings-page";
import SupplierModal from "@/components/pages/suppliers/supplier-modal";
import services from "@/service/services";
import React, { ReactNode, useState } from "react";

const getSupplierUrl = (address: string | undefined): string | ReactNode => {
  if (!address) {
    return "";
  }

  if (address.includes("https://")) {
    return (
      <a
        className="text-blue-500 hover:text-blue-700"
        href={address}
        target="_blank"
        rel="noopener noreferrer"
      >
        {address}
      </a>
    );
  }

  return address;
};

export default function SuppliersPage() {
  const suppliers = services.supplierService.useGetAll().data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<string>();

  const tableHeaders = [
    {
      title: "Nimi",
      filterType: TableFilterType.Input,
    },
    {
      title: "Aadress",
      filterType: TableFilterType.None,
    },
    {
      title: "",
      filterType: TableFilterType.None,
    },
  ];

  const tableRows: TableRow[] = suppliers.map((supplier) => ({
    name: supplier.name,
    url: getSupplierUrl(supplier.address),
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
