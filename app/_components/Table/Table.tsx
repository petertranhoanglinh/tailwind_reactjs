"use client";
import React, { useRef, useState } from "react";
import Pagination from "./_component/Pagination";
import CardBox from "../CardBox";
import CardBoxComponentEmpty from "../CardBox/Component/Empty";
import Image from "next/image";
import IconRounded from "../Icon/Rounded";
import Icon from "../Icon";
import { mdiChevronDown, mdiChevronUp } from "@mdi/js";

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  kind?: string;
  icon?: string;
  render?: (item: T) => React.ReactNode;
  isSort?: boolean;

}

export interface Filter {
  filter: any
  page: number,
  skip: number,
  sort: any
}

interface GenericTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  showPaging?: boolean;
  perPage?: number;
  loading: boolean;
  total: number;
  onClickAction?: (row: T, key: string) => void;
  onChangeFilter?: (filter: Filter) => void;
}

const GenericTable = <T,>({
  data,
  columns,
  showPaging = true,
  perPage = 5,
  loading,
  total,
  onClickAction,
  onChangeFilter

}: GenericTableProps<T>) => {
  const totalCount = total;
  const defaultFilter: Filter = {
    filter: {},
    skip: 20,
    page: 1,
    sort: {}
  }
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [sortState, setSortState] = useState({ key: '', direction: 'asc' });
  const [filter, setFilter] = useState(defaultFilter)
  const handlePageChange = (page: number) => {
    setFilter({
      ...filter,
      page: page
    });
    const newFilter = {
      ...filter,
      page: page
    };
    onChangeFilter?.(newFilter);
  };
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };
  const descByFields = (key) => {
    setSortState((prev) => {
      const direction = prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc';
      alert("sort " + key +  "  " + direction)
      return { key, direction };
    });
  };
  const handleMouseUp = () => setIsDragging(false);
  return (
    <>
      {loading && (
        <CardBox>
          <CardBoxComponentEmpty title="loading ..." />
        </CardBox>
      )}
      {!loading && (
        <div ref={scrollRef}
          className="overflow-x-auto cursor-grab"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp} >
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={String(column.key)}>
                    {column.isSort ? (
                      <button
                        type="button"
                        onClick={() => descByFields(column.key)}
                        className="flex items-center justify-center w-full h-full p-2 cursor-pointer"
                      >
                        {column.label}

                        <Icon
                          path={sortState.direction === 'asc' ? mdiChevronUp : mdiChevronDown}
                          w="w-10"
                          h={"h-12"}
                          className="ml-2"
                        />

                      </button>
                    ) : (
                      column.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td key={String(column.key)} data-label={String(column.label)}>
                      {column.kind === "image" && typeof item[column.key] === "string" ? (
                        <Image src={item[column.key] as string} alt={"img_" + column.label} width={40} height={40} />
                      ) : column.kind === "action" ? (
                        <button onClick={() => onClickAction?.(item, String(column.key))}>  {column.render ? (
                          column.render(item)
                        ) : (
                          column.icon && <IconRounded icon={column.icon} color="light" className="mr-3 cursor-pointer" bg />
                        )} </button>
                      )
                        : column.render ? (
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
        </div>
      )}
      {showPaging && totalCount > perPage && (
        <div className="mt-4">
          <Pagination
            totalCount={500}
            itemsPerPage={filter.skip}
            currentPage={filter.page}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
};

export default GenericTable;
