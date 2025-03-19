"use client";

import React, { useState } from "react";
import Button from "../Button";
import Buttons from "../Buttons";

interface TableColumn<T> {
  key: keyof T;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  showPaging?: boolean;
  perPage?: number;
}

const GenericTable = <T,>({ data, columns, showPaging = true, perPage = 5 }: TableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(0);
  const numPages = Math.ceil(data.length / perPage);
  const paginatedData = data.slice(perPage * currentPage, perPage * (currentPage + 1));

  return (
    <>
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
                  {column.render ? column.render(item) : (item[column.key] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {showPaging && numPages > 1 && (
        <div className="p-3 border-t border-gray-100 dark:border-slate-800">
          <Buttons>
            {Array.from({ length: numPages }, (_, page) => (
              <Button
                key={page}
                active={page === currentPage}
                label={(page + 1).toString()}
                color={page === currentPage ? "lightDark" : "whiteDark"}
                small
                onClick={() => setCurrentPage(page)}
                isGrouped
              />
            ))}
          </Buttons>
          <small className="mt-6">Page {currentPage + 1} of {numPages}</small>
        </div>
      )}
    </>
  );
};

export default GenericTable;
