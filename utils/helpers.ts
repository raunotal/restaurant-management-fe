import { TableRow } from "@/components/common/table";

export const sortTableRows = (rows: TableRow[], groupBy?: string) => {
  return rows.sort((a, b) => {
    if (groupBy) {
      if (
        a[groupBy] !== undefined &&
        b[groupBy] !== undefined &&
        a[groupBy]! < b[groupBy]!
      ) {
        return -1;
      }
      if (
        a[groupBy] !== undefined &&
        b[groupBy] !== undefined &&
        a[groupBy]! > b[groupBy]!
      ) {
        return 1;
      }
    }

    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    if (aKeys[0] < bKeys[0]) {
      return -1;
    }
    if (aKeys[0] > bKeys[0]) {
      return 1;
    }

    return 0;
  });
};

export const setEmptyToNull = <T extends object>(obj: T): T => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      value === "" || value === undefined ? null : value,
    ])
  ) as T;
};
