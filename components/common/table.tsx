import classNames from "classnames";

interface TableProps {
  headers: string[];
  rows: Record<string, string>[];
  className?: string;
}

export default function Table(props: TableProps) {
  const { headers, rows, className } = props;
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
                {rows.map((row, index) => (
                  <tr
                    key={`row-${index}`}
                    className="border-b border-gray-200 font-medium"
                  >
                    {Object.values(row).map((value, index) => (
                      <td
                        className={classNames(
                          "px-3 py-4 text-gray-500 text-sm text-left",
                          {
                            "text-gray-900 pl-6": index === 0,
                            "font-light":
                              index !== 0 &&
                              index !== Object.values(row).length - 1,
                            "text-indigo-600 pr-6 text-right":
                              index === Object.values(row).length - 1,
                          }
                        )}
                        key={`row-${index}-${value}`}
                      >
                        {value}
                      </td>
                    ))}
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
