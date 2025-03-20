"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch ,  RootState} from "../../_stores/store";
import { fetchCryptoAction } from "../../_stores/crypto/cryptoSlice";
import { mdiBitcoin } from "@mdi/js";
import CardBox from "../../_components/CardBox";
import SectionMain from "../../_components/Section/Main";
import SectionTitleLineWithButton from "../../_components/Section/TitleLineWithButton";
import GenericTable from "../../_components/Table/Table";

const columns = [
  { key: "name", label: "Name" },
  { key: "image", label: "Icon" , kind : "image" },
  { key: "symbol", label: "Symbol" },
  { key: "current_price", label: "Current Price ($)" },
  { key: "market_cap", label: "Market Cap ($)" },
  { key: "total_volume", label: "Total Volume ($)" },
];

export default function CryptoPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((state: RootState) => state.crypto);

  useEffect(() => {
    dispatch(fetchCryptoAction({ currency: "usd", per_page: 200, page: 1 }));
  }, [dispatch]);

  return (
    <SectionMain>
      <SectionTitleLineWithButton icon={mdiBitcoin} title="Crypto Price" main />
      <CardBox className="mb-6" hasTable>
        <GenericTable data={items} columns={columns} showPaging={true} perPage={5}  loading = {!loading} />
      </CardBox>
    </SectionMain>
  );
}
