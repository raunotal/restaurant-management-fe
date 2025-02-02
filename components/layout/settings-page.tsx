import Table, { TableRow } from "@/components/common/table";
import PageHeader from "./page-header";

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
      <PageHeader
        title={title}
        description={description}
        onClick={toggleModal}
      />
      <Table
        className="mt-8"
        headers={tableHeaders}
        rows={tableData}
        groupBy="parentUnit"
      />
    </>
  );
}
