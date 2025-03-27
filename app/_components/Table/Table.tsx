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
    <>
      {loading && (
        <CardBox>
          <CardBoxComponentEmpty title="loading ..." />
        </CardBox>
      )}
      {!loading && (
        <>
          <table>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td key={String(column.key)} data-label={String(column.label)}>
                      {column.kind === "image" && typeof item[column.key] === "string" ? (
                        <Image src={item[column.key] as string} alt={"img_" + column.label} width={40} height={40} />
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
          {data.length == 0 && (
            <CardBox>
              <CardBoxComponentEmpty title="Empty Data" />
            </CardBox>
          )}
        </>
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
    </>
  );
};

export default GenericTable;
