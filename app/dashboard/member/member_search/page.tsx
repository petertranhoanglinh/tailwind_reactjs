"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../_stores/store";
import { searchMemberAction } from "../../../_stores/member/memberSearchSlice";
import { mdiAccount, mdiCalendarAlert, mdiEmber } from "@mdi/js";
import CardBox from "../../../_components/CardBox";
import SectionMain from "../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../_components/Section/TitleLineWithButton";
import GenericTable from "../../../_components/Table/Table";
import FormSearch from "../../../_components/FormField/FormSearch";
import FormField from "../../../_components/FormField";
import { Field } from "formik";
import FormGrid from "../../../_components/FormField/FormGrid";

const columns = [
  { key: "userid", label: "ID" },
  { key: "username", label: "Name" },
  { key: "email", label: "Email" },
  { key: "regDate", label: "Registration Date" },
];

export default function MemberSearchPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((state: RootState) => state.searchMember);
  const initdata = { name: "", email: "", regDate: "" };
  const [hideFields] = useState<Record<string, boolean>>({
    isRegDate: false,
    isName: false,
    isEmail: false,
  });

  const handleSubmit = (values) => {
    console.log(values);
    search(values.name);
  };

  const search = (username : string) =>{
    const params = {
      comId: "REIZ",
      lang: "KR",
      startDate: "",
      endDate: "",
      chkuserid: "",
      userid: "0124090003",
      status: "",
      userKind: "",
      rankCd: "",
      rankMaxCd: "",
      cntCd: "",
      grpCd: "",
      ctrCd: "",
      chkCnt: "",
      chkGrp: "",
      chkValue: 0,
      value: username,
      workUser: "",
      page: 0,
      len: 10,
    };
    dispatch(searchMemberAction(params));
  }

  useEffect(() => {
    search("")
  }, [dispatch]);

  return (
    <SectionMain>
      <SectionTitleLineWithButton icon={mdiAccount} title="Member Search" main />
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
              {!hiddenFields.isName && (
                <FormField label="Name" labelFor="name" icon={mdiEmber}>
                  {({ className }) => (
                    <Field name="name" id="name" placeholder="Name search ..." className={className} />
                  )}
                </FormField>
              )}
              {!hiddenFields.isEmail && (
                <FormField label="Email" labelFor="email" icon={mdiEmber}>
                  {({ className }) => (
                    <Field name="email" id="email" placeholder="Email search ..." className={className} />
                  )}
                </FormField>
              )}
            </FormGrid>
          )}
        </FormSearch>
      </CardBox>
      <CardBox className="mb-6" hasTable>
        <GenericTable
          data={items}
          columns={columns}
          showPaging={true}
          perPage={5}
          loading={loading}
        />
      </CardBox>
    </SectionMain>
  );
}
