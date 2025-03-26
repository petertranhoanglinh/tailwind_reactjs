"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../_stores/store";
import { searchMemberAction } from "../../../_stores/member/memberSearchSlice";
import { mdiAccount, mdiCalendarAlert, mdiEmber } from "@mdi/js";
import CardBox from "../../../_components/CardBox";
import SectionMain from "../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../_components/Section/TitleLineWithButton";
import GenericTable, { TableColumn } from "../../../_components/Table/Table";
import FormSearch from "../../../_components/FormField/FormSearch";
import FormField from "../../../_components/FormField";
import { Field } from "formik";
import FormGrid from "../../../_components/FormField/FormGrid";
import { MemberModel } from "../../../_models/member.model";




const columns: TableColumn<MemberModel>[] = [
  { key: "userid", label: "ID" },
  { key: "username", label: "Name" },
  { key: "email", label: "Email" },
  { key: "regDate", label: "Registration Date" },
  { key: "mobile", label: "Mobile" },
  { key: "rName", label: "Sponsor" },

];

export default function MemberSearchPage() {
  const dispatch = useDispatch<AppDispatch>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [page, setPage] = useState(1);
  const { items, loading } = useSelector((state: RootState) => state.searchMember);
  const initdata = { name: "", email: "", startDate: "" };
  const [hideFields] = useState<Record<string, boolean>>({
    isRegDate: false,
    isName: false,
    isEmail: false,
  });
  const handleSubmit = (values) => {
    search(values.name, 1);
  };
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    search("", newPage)
  };
  const search = (username: string, page: number) => {
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
      page: page - 1,
      len: 10,
    };
    dispatch(searchMemberAction(params));
  }
  useEffect(() => {
    search("", 1)
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
            <>
              <FormGrid columns={3}>
                {!hiddenFields.isName && (
                  <FormField label="Name" labelFor="name" icon={mdiEmber}>
                    {({ className }) => (
                      <Field name="name" id="name" placeholder="Name search ..." className={className} />
                    )}
                  </FormField>
                )}
                {!hiddenFields.isRegDate && (
                  <>
                    <FormField label="Start Date" labelFor="startDate" icon={mdiCalendarAlert}>
                      {({ className }) => (
                        <Field name="startDate" id="startDate" type="date" className={className} />
                      )}
                    </FormField>
                    <FormField label="engDate" labelFor="endDate" icon={mdiCalendarAlert}>
                      {({ className }) => (
                        <Field name="endDate" id="endDate" type="date" className={className} />
                      )}
                    </FormField>
                  </>

                )}



              </FormGrid>

              <FormGrid columns={3}>

                {!hiddenFields.isEmail && (
                  <FormField label="Email" labelFor="email" icon={mdiEmber}>
                    {({ className }) => (
                      <Field name="email" id="email" placeholder="Email search ..." className={className} />
                    )}
                  </FormField>
                )}
              </FormGrid>


            </>


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
          total={
            items.length
          }

          onPageChange={handlePageChange}
        />
      </CardBox>
    </SectionMain>
  );
}
