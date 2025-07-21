"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../_stores/store";
import { fetchCryptoAction } from "../../_stores/crypto/cryptoSlice";
import { mdiBitcoin, mdiUpdate } from "@mdi/js";
import CardBox from "../../_components/CardBox";
import SectionMain from "../../_components/Section/Main";
import SectionTitleLineWithButton from "../../_components/Section/TitleLineWithButton";
import GenericTable, { Filter, TableColumn } from "../../_components/Table/Table";
import { formatNumber, toUpperLower } from "../../_utils/formatUtils";

import styled from 'styled-components'
import Icon from "../../_components/Icon";
import { _initCardBoxModel } from "../../_models/cardbox.model";
import CardBoxModal from "../../_components/CardBox/Modal";
import DynamicFormFields, { FieldConfig } from "../../_components/Table/_component/DynamicFormFields";


const Wrapper = styled.div`
  color: red;
  text-align: center;
`



interface CryptoData {
  name: string;
  image: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  action: string;
}




export default function CryptoPage() {
  const Red = () => <Wrapper>Home Pages</Wrapper>;
  const [initCardBoxModel, setInitCardBoxModel] = useState(_initCardBoxModel);
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((state: RootState) => state.crypto);
  const totalCount = items.length;
  const formattedItems : any[]= items.map((item) => ({
    ...item,
    price: formatNumber(item.current_price),
    total_volume: formatNumber(item.total_volume),
    market_cap: formatNumber(item.market_cap),
    symbol: toUpperLower(item.symbol, "upper"),
  }));
  const handleSubmit = (values) => {
    console.log("Submitted values:", values);
  };
  const handelOnchangeFilter = (filter: Filter) => {
    dispatch(fetchCryptoAction({ currency: "usd", per_page: filter.skip, page: filter.page }));
  };
  useEffect(() => {
    dispatch(fetchCryptoAction({ currency: "usd", per_page: 20, page: 1 }));
  }, [dispatch]);
  
  const handleUpdate = (row: CryptoData) => {
    setInitCardBoxModel({
      ..._initCardBoxModel,
      message: "Do you want to edit " + row.name,
      isActive: true,
      onClose: (confirmed: boolean) => {
        if (confirmed) {
          setInitCardBoxModel(prev => ({ ...prev, isActive: false }));
          alert(row.name)
        } else {
          setInitCardBoxModel(prev => ({ ...prev, isActive: false }));
        }
      }
    });
  }
  const renderUpdateColumn = (row: CryptoData) => {
    return (
      <button onClick={() => handleUpdate(row)} className="cursor-pointer">
        <Icon path={mdiUpdate}></Icon>
      </button>
    );
  };

  const columns: TableColumn<CryptoData>[] = [
    { key: "name", label: "Name", isSort: true },
    { key: "image", label: "Icon", kind: "image" },
    { key: "symbol", label: "Symbol" },
    { key: "current_price", label: "Current Price ($)" },
    { key: "market_cap", label: "Market Cap ($)" },
    { key: "total_volume", label: "Total Volume ($)" },
    { key: "action", label: "Action", render: renderUpdateColumn },
  ];

  const formFieldsConfig: FieldConfig[] = [
    {
      name: 'regDate',
      label: 'Reg Date',
      type: 'date',
      icon: 'mdiCalendarAlert',
    },
    {
      name: 'symbol',
      label: 'Symbol',
      type: 'text',
      placeholder: 'Symbol search ...',
      icon: 'mdiBitcoin',
    },
    {
      name: 'volume',
      label: 'Volume',
      type: 'text',
      placeholder: 'Volume search ...',
      icon: 'mdiCashMultiple'
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'All', value: '' },
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
      ]
    },
    {
      name: 'agree',
      label: 'Agree?',
      type: 'checkbox'
    }
  ];

  return (
    <SectionMain>
      <CardBoxModal
        title="Save Member"
        buttonColor={initCardBoxModel.buttonColor}
        buttonLabel={initCardBoxModel.buttonLabel}
        isActive={initCardBoxModel.isActive}
        isAction={initCardBoxModel.isAction}
        onClose={initCardBoxModel.onClose} // <--- Cần có dòng này
      >
        <p>
          {initCardBoxModel.message}
        </p>
      </CardBoxModal>
      <Red /> {/* Gọi component Red tại đây */}
      <SectionTitleLineWithButton icon={mdiBitcoin} title="Crypto Price" main />
      <CardBox>
      <DynamicFormFields config={formFieldsConfig} onSubmit={handleSubmit} />
      </CardBox>
      <CardBox className="mb-6" hasTable>
        <GenericTable
          data={formattedItems}
          columns={columns}
          showPaging={true}
          perPage={5}
          loading={loading}
          total={totalCount}
          onChangeFilter={handelOnchangeFilter}
        />
      </CardBox>
    </SectionMain>
  );
}
