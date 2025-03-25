"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../_stores/store";
import { fetchCryptoAction } from "../../_stores/crypto/cryptoSlice";
import { mdiBitcoin, mdiCalendarAlert, mdiCashMultiple } from "@mdi/js";
import CardBox from "../../_components/CardBox";
import SectionMain from "../../_components/Section/Main";
import SectionTitleLineWithButton from "../../_components/Section/TitleLineWithButton";
import GenericTable from "../../_components/Table/Table";
import FormSearch from "../../_components/FormField/FormSearch";
import FormField from "../../_components/FormField";
import { Field } from "formik";
import FormGrid from "../../_components/FormField/FormGrid";
import { formatNumber , toUpperLower } from "../../_utils/formatUtils";

const columns = [
  { key: "name", label: "Name" },
  { key: "image", label: "Icon", kind: "image" },
  { key: "symbol", label: "Symbol" },
  { key: "current_price", label: "Current Price ($)" },
  { key: "market_cap", label: "Market Cap ($)" },
  { key: "total_volume", label: "Total Volume ($)" },
];

export default function CryptoPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((state: RootState) => state.crypto);
  const  totalCount = items.length;
  const formattedItems = items.map((item) => ({
    ...item,
    price: formatNumber(item.current_price),
    total_volume : formatNumber(item.total_volume) ,
    market_cap : formatNumber(item.market_cap),
    symbol : toUpperLower(item.symbol , "upper"),
  }));
  const initdata = { symbol: "", volume: "", regDate: "" };
  const [hideFields] = useState<Record<string, boolean>>({
    isRegDate: false,
    isSymbol: false,
    isVolume: false,
  });
  const handleSubmit = (values) => {
    console.log("Submitted values:", values);
  };
  const handlePageChange = (newPage: number) => {
    console.log(newPage);
  };
  useEffect(() => {
    dispatch(fetchCryptoAction({ currency: "usd", per_page: 200, page: 1 }));
  }, [dispatch]);

  return (
    <SectionMain>
      <SectionTitleLineWithButton icon={mdiBitcoin} title="Crypto Price" main />
      <CardBox>
        <FormSearch
          initdata={initdata}
          handleSubmit={handleSubmit}
          hideFields={hideFields}
        >
          {(hiddenFields) => (
            <FormGrid columns={3}>
              {!hiddenFields.isRegDate && (
                <FormField label="Reg Date" labelFor="regDate" icon={mdiCalendarAlert}>
                  {({ className }) => (
                    <Field name="regDate" id="regDate" type="date" className={className} />
                  )}
                </FormField>
              )}
              {!hiddenFields.isSymbol && (
                <FormField label="Symbol" labelFor="symbol" icon={mdiBitcoin}>
                  {({ className }) => (
                    <Field name="symbol" id="symbol" placeholder="Symbol search ..." className={className} />
                  )}
                </FormField>
              )}
              {!hiddenFields.isVolume && (
                <FormField label="Volume" labelFor="volume" icon={mdiCashMultiple}>
                  {({ className }) => (
                    <Field name="volume" id="volume" placeholder="Volume search ..." className={className} />
                  )}
                </FormField>
              )}
            </FormGrid>
          )}
        </FormSearch>
      </CardBox>
      <CardBox className="mb-6" hasTable>
        <GenericTable
          data={formattedItems}
          columns={columns}
          showPaging={true}
          perPage={5}
          loading={loading}
          total={totalCount}
          onPageChange={handlePageChange} 
        />
      </CardBox>
    </SectionMain>
  );
}
