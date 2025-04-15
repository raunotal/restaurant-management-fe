import classNames from "classnames";
import React, { Fragment, ReactNode, useState, useMemo } from "react";
import { orderBy } from "lodash";
import Icon from "../ui/icons/icon";
import { ComboboxElement } from "../ui/combobox";
import Input from "../ui/input";
import MultiCombobox from "../ui/multi-combox";

interface WithTextProp {
  props: {
    text: string;
    [key: string]: unknown;
  };
}

function isReactElementWithTextProp(
  value: unknown
): value is React.ReactElement & WithTextProp {
  return (
    React.isValidElement(value) &&
    value.props !== null &&
    typeof value.props === "object" &&
    "text" in value.props
  );
}

export type TableHeader = {
  title: string;
  filterType: TableFilterType;
};

export type TableRow = Record<string, TableRowAction[] | React.ReactNode>;

type TableRowAction = {
  title?: string;
  content: ReactNode;
  data?: string;
  position?: number;
  onClick: (data?: string) => void;
};

export enum TableFilterType {
  Input = "input",
  Combobox = "combobox",
  None = "none",
}

interface TableProps {
  headers: TableHeader[];
  rows: TableRow[];
  className?: string;
}

type SortDirection = "asc" | "desc";

export default function Table(props: TableProps) {
  const { headers, rows, className } = props;
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [inputFilter, setInputFilter] = useState<Record<number, string>>({});
  const [filterOptions, setFilterOptions] = useState<
    Record<number, ComboboxElement[]>
  >({});

  const handleSort = (headerIndex: number) => {
    if (headerIndex === headers.length - 1) return;

    const key = Object.keys(rows[0])[headerIndex];

    if (sortBy === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortDirection("asc");
    }
  };

  const renderSortIndicator = (headerIndex: number) => {
    const key = rows.length > 0 ? Object.keys(rows[0])[headerIndex] : null;

    if (headerIndex === headers.length - 1 || !key) return null;

    return (
      <span
        className={classNames(
          "flex items-center justify-center ml-2 w-5 h-5 rounded-[4px] opacity-0",
          {
            "bg-gray-200 opacity-100": sortBy === key,
            "group-hover:opacity-75": sortBy !== key,
          }
        )}
      >
        {sortDirection === "asc" ? (
          <Icon type="chevron-up" className="text-gray-600" size={16} />
        ) : (
          <Icon type="chevron-down" className="text-gray-600" size={16} />
        )}
      </span>
    );
  };

  const getComboboxData = (headerIndex: number) => {
    const key = Object.keys(rows[0])[headerIndex];

    const comboboxData: ComboboxElement[] = rows.map((row) => {
      const value = row[key];
      if (isReactElementWithTextProp(value)) {
        return { key: value.props.text, value: value.props.text };
      } else {
        return {
          key: value?.toString() || "-",
          value: value?.toString() || "-",
        };
      }
    });

    return comboboxData.filter(
      (value, index, self) =>
        index === self.findIndex((v) => v.key === value.key)
    );
  };

  const handleInputFilterChange = (headerIndex: number, value: string) => {
    setInputFilter((prevState) => ({
      ...prevState,
      [headerIndex]: value,
    }));
  };

  const handleComboboxFilterChange = (
    headerIndex: number,
    selected: ComboboxElement[]
  ) => {
    let updatedFilters = selected;
    const duplicate = selected.filter(
      (value, index, self) =>
        index !== self.findIndex((v) => v.key === value.key)
    );

    if (duplicate) {
      updatedFilters = selected.filter(
        (value) => !duplicate.some((v) => v.key === value.key)
      );
    }

    setFilterOptions((prevState) => ({
      ...prevState,
      [headerIndex]: updatedFilters,
    }));
  };

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const inputFilterPassed = Object.entries(inputFilter).every(
        ([index, value]) => {
          const key = Object.keys(row)[Number(index)];
          const rowValue = row[key];

          if (typeof rowValue === "string") {
            return rowValue.toLowerCase().includes(value.toLowerCase());
          } else if (isReactElementWithTextProp(rowValue)) {
            return rowValue.props.text
              .toLowerCase()
              .includes(value.toLowerCase());
          }
          return true;
        }
      );

      const comboboxFilterPassed = Object.entries(filterOptions).every(
        ([index, selectedOptions]) => {
          if (selectedOptions.length === 0) return true;

          const key = Object.keys(row)[Number(index)];
          const rowValue = row[key];

          let valueToCheck = "";
          if (typeof rowValue === "string") {
            valueToCheck = rowValue;
          } else if (isReactElementWithTextProp(rowValue)) {
            valueToCheck = rowValue.props.text;
          } else {
            return true;
          }

          return selectedOptions.some((option) => option.key === valueToCheck);
        }
      );

      return inputFilterPassed && comboboxFilterPassed;
    });
  }, [rows, inputFilter, filterOptions]);

  const sortedRows = useMemo(() => {
    if (!sortBy) return filteredRows;
    return orderBy(
      filteredRows,
      [
        (row) => {
          const value = row[sortBy];
          if (typeof value === "string") {
            return value.toLowerCase();
          } else if (isReactElementWithTextProp(value)) {
            return value.props.text.toLowerCase();
          }
          return value;
        },
      ],
      [sortDirection]
    );
  }, [filteredRows, sortBy, sortDirection]);

  return (
    <div className={classNames(className)}>
      <div className="-my-2 -mx-8 overflow-x-auto">
        <div className="py-2 px-8">
          <div className="rounded-lg shadow ring-1 ring-black ring-opacity-5 overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-gray-300 bg-gray-50">
                <tr>
                  {headers.map((head, index) => {
                    const comboboxData = getComboboxData(index);
                    const comboboxHasData = comboboxData.length > 1;
                    return (
                      <th
                        scope="col"
                        className={classNames(
                          "px-3 py-3.5",
                          "text-gray-900 text-sm text-left align-top",
                          {
                            "pl-6": index === 0,
                            "pr-6": index === headers.length - 1,
                            "cursor-pointer": index !== headers.length - 1,
                          }
                        )}
                        key={`header-${index}`}
                      >
                        <div
                          className="flex items-center group"
                          onClick={() => handleSort(index)}
                        >
                          {head.title}
                          {renderSortIndicator(index)}
                        </div>
                        {head.filterType === TableFilterType.Input && (
                          <Input
                            className="mt-2"
                            value={inputFilter[index] || ""}
                            onChange={(e) =>
                              handleInputFilterChange(index, e.target.value)
                            }
                            placeholder="Otsi..."
                          />
                        )}
                        {head.filterType === TableFilterType.Combobox &&
                          comboboxHasData && (
                            <MultiCombobox
                              data={comboboxData}
                              onChange={(data) =>
                                handleComboboxFilterChange(index, data)
                              }
                              selected={filterOptions[index] || []}
                              placeholder="Vali..."
                              className="mt-2"
                            />
                          )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="bg-white">
                {sortedRows.map((row, rowIndex) => (
                  <tr
                    key={`row-${rowIndex}`}
                    className="border-b border-gray-200 font-medium"
                  >
                    {Object.values(row).map((value, rowFieldIndex) => {
                      const isRowAction = Array.isArray(value);

                      return (
                        <td
                          className={classNames(
                            "px-3 py-4 text-gray-500 text-sm text-left",
                            {
                              "text-gray-900 pl-6": rowFieldIndex === 0,
                              "font-light":
                                rowFieldIndex !== 0 &&
                                rowFieldIndex !== Object.values(row).length - 1,
                              "text-indigo-600 pr-6 text-right flex gap-2 items-center justify-end":
                                rowFieldIndex === Object.values(row).length - 1,
                            }
                          )}
                          key={`row-${rowIndex}-${rowFieldIndex}`}
                        >
                          {!isRowAction && value}
                          {isRowAction &&
                            value.map((action, index) => (
                              <Fragment key={`${rowIndex}-action-${index}`}>
                                <span
                                  className="cursor-pointer tooltip"
                                  aria-label={action.title}
                                  onClick={() => action.onClick(action.data)}
                                  key={`${rowIndex}-action-${index}`}
                                >
                                  {action.title && (
                                    <span className="tooltiptext">
                                      {action.title}
                                    </span>
                                  )}
                                  {action.content}
                                </span>
                                {index !== value.length - 1 && <span> | </span>}
                              </Fragment>
                            ))}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
