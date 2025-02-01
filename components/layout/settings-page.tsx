"use client";

import Table, { TableRow } from "@/components/common/table";
import Button from "@/components/ui/button";

type SettingsPageProps<T extends { id: string }> = {
  title: string;
  description: string;
  tableData: TableRow[];
  tableHeaders: string[];
  data: T[];
  toggleModal: () => void;
};

export default function SettingsPage<T extends { id: string }>(
  props: SettingsPageProps<T>
) {
  const { description, tableData, tableHeaders, title, toggleModal } = props;

  return (
    <>
      <div className="flex items-center">
        <div className="flex-1">
          <h3>{title}</h3>
          <p className="text-gray-600 text-sm mt-2">{description}</p>
        </div>
        <div>
          <Button onClick={toggleModal}>Lisa uus</Button>
        </div>
      </div>
      <Table
        className="mt-8"
        headers={tableHeaders}
        rows={tableData}
        groupBy="parentUnit"
      />
    </>
  );
}
