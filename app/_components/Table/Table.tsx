"use client";
import React, { useState } from "react";
import Pagination from "./_component/Pagination";
import CardBox from "../CardBox";
import CardBoxComponentEmpty from "../CardBox/Component/Empty";
import Image from "next/image";

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  kind?: string;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  showPaging?: boolean;
  perPage?: number;
  loading: boolean;
  total: number;
  onPageChange: (page: number) => void;
}

const GenericTable = <T,>({
  data,
  columns,
  showPaging = true,
  perPage = 5,
  loading,
  total,
  onPageChange,
}: TableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalCount = total;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  const paginatedData = data.slice(perPage * (currentPage - 1), perPage * currentPage);

  return (
    <div className="w-full">
      {loading && (
        <CardBox>
          <CardBoxComponentEmpty />
        </CardBox>
      )}
      {!loading && (
        <div className="overflow-x-auto">
          <table className="w-full hidden lg:table">
            <thead>
              <tr className="bg-gray-50">
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    scope="col"
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.map((item, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td key={String(column.key)} className="px-4 py-3">
                      {column.kind === "image" && typeof item[column.key] === "string" ? (
                        <Image src={item[column.key] as string} alt="crypto" width={40} height={40} />
                      ) : column.render ? (
                        column.render(item)
                      ) : (
                        item[column.key] as React.ReactNode
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="lg:hidden space-y-4">
            {paginatedData.map((item, index) => (
              <div key={index} className="bg-white shadow rounded-lg p-4 space-y-3">
                {columns.map((column) => (
                  <div key={String(column.key)} className="flex items-start">
                    <span className="text-sm font-medium text-gray-500 w-1/3">
                      {column.label}:
                    </span>
                    <div className="w-2/3">
                      {column.kind === "image" && typeof item[column.key] === "string" ? (
                        <Image src={item[column.key] as string} alt="crypto" width={40} height={40} />
                      ) : column.render ? (
                        column.render(item)
                      ) : (
                        <span className="text-sm text-gray-900">
                          {item[column.key] as React.ReactNode}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      {showPaging && totalCount > perPage && (
        <div className="mt-4">
          <Pagination
            totalCount={totalCount}
            itemsPerPage={perPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default GenericTable;
