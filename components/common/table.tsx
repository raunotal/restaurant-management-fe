import { sortTableRows } from "@/utils/helpers";
import classNames from "classnames";
import React, { Fragment, ReactNode } from "react";

export type TableRow = Record<string, TableRowAction[] | React.ReactNode>;

export type TableRowAction = {
  title?: string;
  content: ReactNode;
  data?: string;
  position?: number;
  onClick: (data?: string) => void;
};

interface TableProps {
  groupBy?: string;
  headers: string[];
  rows: TableRow[];
  className?: string;
}

export default function Table(props: TableProps) {
  const { groupBy, headers, rows, className } = props;
  const sortedRows = sortTableRows(rows, groupBy);

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
                        }
                      )}
                      key={`header-${index}`}
                    >
                      {head}
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
