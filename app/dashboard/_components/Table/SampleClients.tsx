"use client";

import { mdiEye, mdiTrashCan } from "@mdi/js";
import React, { useState } from "react";
import { Client } from "../../../_interfaces";
import Button from "../../../_components/Button";
import Buttons from "../../../_components/Buttons";

import UserAvatar from "../UserAvatar";

type Props = {
  clients: Client[];
  showPaging?: boolean; 
};

const TableSampleClients = ({ clients , showPaging }: Props) => {
  const perPage = 5;

  const numPages = clients.length / perPage;

  const pagesList: number[] = [];

  for (let i = 0; i < numPages; i++) {
    pagesList.push(i);
  }

  const [currentPage, setCurrentPage] = useState(0);
  const clientsPaginated = clients.slice(
    perPage * currentPage,
    perPage * (currentPage + 1),
  );




  return (
    <>
     

      
      <table>
        <thead>
          <tr>
            <th />
            <th>Name</th>
            <th>Company</th>
            <th>City</th>
            <th>Progress</th>
            <th>Created</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {clientsPaginated.map((client: Client) => (
            <tr key={client.id}>
              <td className="border-b-0 lg:w-6 before:hidden">
                <UserAvatar
                  username={client.name}
                  className="w-24 h-24 mx-auto lg:w-6 lg:h-6"
                />
              </td>
              <td data-label="Name">{client.name}</td>
              <td data-label="Company">{client.company}</td>
              <td data-label="City">{client.city}</td>
              <td data-label="Progress" className="lg:w-32">
                <progress
                  className="flex w-2/5 self-center lg:w-full"
                  max="100"
                  value={client.progress}
                >
                  {client.progress}
                </progress>
              </td>
              <td data-label="Created" className="lg:w-1 whitespace-nowrap">
                <small className="text-gray-500 dark:text-slate-400">
                  {client.created}
                </small>
              </td>
             
            </tr>
          ))}
        </tbody>
      </table>
      {showPaging && ( 
        <div className="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between py-3 md:py-0">
            <Buttons>
              {pagesList.map((page) => (
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
            <small className="mt-6 md:mt-0">
              Page {currentPage + 1} of {numPages}
            </small>
          </div>
        </div>
      )}
    </>
  );
};

export default TableSampleClients;