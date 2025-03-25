"use client";

import React, { useState } from "react";
import Pagination from "./_component/Pagination";
import CardBox from "../CardBox";
import CardBoxComponentEmpty from "../CardBox/Component/Empty";

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
  loading: boolean ;
}

const GenericTable = <T,>({ data, columns, showPaging = true, perPage = 5 , loading }: TableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1); 
  const numPages = Math.ceil(data.length / perPage);
  const paginatedData = data.slice(perPage * (currentPage - 1), perPage * currentPage);

  return (
    <>
     {loading && (
        <CardBox>
         <CardBoxComponentEmpty />
        </CardBox>
     )}
    {!loading && (<table>
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
                    <img src={item[column.key] as string} alt="crypto" width={40} height={40} />
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
      </table>)}
      

      {showPaging && numPages > 1 && (
        <Pagination numPages={numPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      )}
    </>
  );
};

export default GenericTable;
