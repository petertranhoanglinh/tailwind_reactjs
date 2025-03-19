import {
  mdiBitcoin
} from "@mdi/js";
import CardBox from "../../_components/CardBox";
import SectionMain from "../../_components/Section/Main";
import SectionTitleLineWithButton from "../../_components/Section/TitleLineWithButton";

import { getPageTitle } from "../../_lib/config";
import { Metadata } from "next";
import GenericTable from "../../_components/Table/Table";

export const metadata: Metadata = {
  title: getPageTitle("Cryto vui vẻ nè"),
};

const client = [
  { id: 1, name: "John Doe", company: "TechCorp", city: "New York", progress: 80, created: "2024-03-19" },
  { id: 2, name: "Jane Smith", company: "HealthInc", city: "Los Angeles", progress: 60, created: "2024-03-18" },
  { id: 3, name: "Alice Johnson", company: "SoftSolutions", city: "Chicago", progress: 90, created: "2024-03-17" },
];
const columns = [
  { key: "name", label: "Name" },
  { key: "company", label: "Company" },
  { key: "city", label: "City" },
  { key: "progress", label: "Progress" }, 
  { key: "created", label: "Created" },
];

export default function CryptoPage() {
  return (
    <SectionMain>
      <SectionTitleLineWithButton icon={mdiBitcoin} title="Cryto Price" main>
      </SectionTitleLineWithButton>
      <CardBox className="mb-6" hasTable>
      <GenericTable data={client} columns={columns} showPaging={true} perPage={3} />
      </CardBox>
    </SectionMain>
  );
}
