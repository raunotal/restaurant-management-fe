import classNames from "classnames";
import React, { Fragment, ReactNode, useState, useMemo } from "react";
import { orderBy } from "lodash";
import Icon from "../ui/icons/icon";

export type TableRow = Record<string, TableRowAction[] | React.ReactNode>;

export type TableRowAction = {
  title?: string;
  content: ReactNode;
  data?: string;
  position?: number;
  onClick: (data?: string) => void;
};

type SortDirection = "asc" | "desc";

interface TableProps {
  headers: string[];
  rows: TableRow[];
  className?: string;
}

export default function Table(props: TableProps) {
  const { headers, rows, className } = props;
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

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

  const sortedRows = useMemo(() => {
    if (!sortBy || rows.length === 0) return rows;

    return orderBy(
      rows,
      [
        (row) => {
          const value = row[sortBy];
          if (!Array.isArray(value)) {
            return typeof value === "string" ? value.toLowerCase() : value;
          }
          return "";
        },
      ],
      [sortDirection]
    );
  }, [rows, sortBy, sortDirection]);

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
    // }
  };

  return (
    <div className={classNames(className)}>
      <div className="-my-2 -mx-8 overflow-x-auto">
        <div className="py-2 px-8">
          <div className="rounded-lg shadow ring-1 ring-black ring-opacity-5 overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-gray-300 bg-gray-50">
                <tr>
                  {headers.map((head, index) => (
                    <th
                      scope="col"
                      className={classNames(
                        "px-3 py-3.5",
                        "text-gray-900 text-sm text-left",
                        {
                          "pl-6": index === 0,
                          "pr-6": index === headers.length - 1,
                          "cursor-pointer": index !== headers.length - 1, // Make header clickable for sorting except the last one
                        }
                      )}
                      key={`header-${index}`}
                      onClick={() => handleSort(index)}
                    >
                      <div className="flex items-center group">
                        {head}
                        {renderSortIndicator(index)}
                      </div>
                    </th>
                  ))}
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
                          {!isRowAction && (value as string)}
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
