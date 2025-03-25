"use client";
import React, { useState } from "react";
import Pagination from "./_component/Pagination";
import CardBox from "../CardBox";
import CardBoxComponentEmpty from "../CardBox/Component/Empty";
import Image from "next/image";

interface TableColumn<T> {
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
  total :number;
}

const GenericTable = <T,>({ data, columns, showPaging = true, perPage = 5, loading  , total}: TableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalCount = total;

  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedData = data.slice(perPage * (currentPage - 1), perPage * currentPage);

  return (
    <>
      {loading && (
        <CardBox>
          <CardBoxComponentEmpty />
        </CardBox>
      )}
      {!loading && (
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={String(column.key)}>
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
      )}
      {showPaging && totalCount > perPage && (
        <Pagination totalCount={totalCount} itemsPerPage={perPage} currentPage={currentPage} onPageChange={handlePageChange} />
      )}
    </>
  );
};

export default GenericTable;