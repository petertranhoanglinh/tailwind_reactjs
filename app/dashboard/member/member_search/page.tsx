"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../_stores/store";
import { searchMemberAction } from "../../../_stores/member/memberSearchSlice";
import { mdiAccount, mdiCalendarAlert, mdiDelete, mdiEmber, mdiPencil } from "@mdi/js";
import CardBox from "../../../_components/CardBox";
import SectionMain from "../../../_components/Section/Main";
import SectionTitleLineWithButton from "../../../_components/Section/TitleLineWithButton";
import GenericTable, { TableColumn } from "../../../_components/Table/Table";
import FormSearch from "../../../_components/FormField/FormSearch";
import FormField from "../../../_components/FormField";
import { Field } from "formik";
import FormGrid from "../../../_components/FormField/FormGrid";
import { MemberModel } from "../../../_models/member.model";
import { formatDateToYYYYMMDD, rankConstant, removeKeysContainingIs, stepKindConstantSearchUser } from "../../../_utils/_constant";
import { _initCardBoxModel } from "../../../_models/cardbox.model";
import CardBoxModal from "../../../_components/CardBox/Modal";

const columns: TableColumn<MemberModel>[] = [
  { key: "edit", label: "Edit", kind: 'action', icon: mdiPencil },
  { key: "delete", label: "Delete", kind: 'action', icon: mdiDelete },
  { key: "userid", label: "Member ID" },
  { key: "username", label: "Member Name" },
  { key: "regDate", label: "Reg Date" },
  { key: "rankName", label: "Rank" },
  { key: "mobile", label: "Mobile" },
  { key: "rName", label: "Sponsor" },
  { key: "pName", label: "Placement" }
];
const initparams = {
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
  value: "",
  workUser: "",
  page: 0,
  len: 10,
};
export default function MemberSearchPage() {
  const dispatch = useDispatch<AppDispatch>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [page, setPage] = useState(1);
  const { items, loading } = useSelector((state: RootState) => state.searchMember);
  const initdata = { username: "", startDate: "", endDate: "", chkuserid: "0" };
  const [initCardBoxModel, setInitCardBoxModel] = useState(_initCardBoxModel);
  const [hideFields] = useState<Record<string, boolean>>({
    is_Reg_Date: false,
    is_User_Name: false,
    is_Step: false,
    is_Rank: false
  });
  const handleSubmit = (values) => {
    searchparams(values);
  };
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    search("", newPage)
  };
  const search = (username: string, page: number) => {
    dispatch(searchMemberAction({ ...initparams, value: username, page: page - 1 }));
  }

  const handleModalActionCancel = () =>{
    setInitCardBoxModel(prev => ({ ...prev, isActive: false }));
  }

  const handleClickRow = (row: MemberModel , kind :  string) => {
    if(kind == "edit"){
      setInitCardBoxModel({..._initCardBoxModel , message :"Do you want to edit " + row.username , isActive : true});
      console.log(row);
    }
    if(kind == "delete"){
      setInitCardBoxModel({..._initCardBoxModel , buttonColor : "danger" ,  message :"Do you want to delete " + row.username , isActive : true});
      console.log(row);
    }
  }
  const searchparams = (values) => {
    const params = {
      ...initparams,
      ...values,
      value: values.username,
      username: '',
      startDate: formatDateToYYYYMMDD(values.startDate),
      endDate: formatDateToYYYYMMDD(values.endDate)
    }
    dispatch(searchMemberAction(removeKeysContainingIs(params)));
  }
  const handleModalActionConfirm = () => {
    setInitCardBoxModel(prev => ({ ...prev, isActive: false }));
    setTimeout(() => {
        setInitCardBoxModel(prev => ({ ...prev, isActive: true , message : "Update member suscess" , isAction : false , buttonColor : "success" })); 
    }, 1000);
    
  };
  useEffect(() => {
    search("", 1)
  }, [dispatch]);
  return (
    <>
      <CardBoxModal
        title="Save Member"
        buttonColor={initCardBoxModel.buttonColor}
        buttonLabel={initCardBoxModel.buttonLabel}
        isActive={initCardBoxModel.isActive}
        onConfirm={handleModalActionConfirm}
        onCancel={handleModalActionCancel}
        isAction={initCardBoxModel.isAction}
      >
        <p>
          {initCardBoxModel.message}
        </p>
      </CardBoxModal>
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
                  {!hiddenFields.is_User_Name && (
                    <FormField label="User Name" labelFor="username" icon={mdiEmber}>
                      {({ className }) => (
                        <Field name="username" id="username" placeholder="Name search ..." className={className} />
                      )}
                    </FormField>
                  )}
                  {!hiddenFields.is_Reg_Date && (
                    <>
                      <FormField label="Start Date" labelFor="startDate" icon={mdiCalendarAlert}>
                        {({ className }) => (
                          <Field name="startDate" id="startDate" type="date" className={className} />
                        )}
                      </FormField>
                      <FormField label="End Date" labelFor="endDate" icon={mdiCalendarAlert}>
                        {({ className }) => (
                          <Field name="endDate" id="endDate" type="date" className={className} />
                        )}
                      </FormField>
                    </>
                  )}
                </FormGrid>
                <FormGrid columns={3}>
                  {!hiddenFields.is_Step && (
                    <FormField label="Step" labelFor="chkuserid" icon={mdiAccount}>
                      {({ className }) => (
                        <Field name="chkuserid" id="chkuserid" component="select" className={className}>
                          {stepKindConstantSearchUser.map((option, index) => (
                            <option key={index} value={option.value}>{option.label}</option>
                          ))}
                        </Field>
                      )}
                    </FormField>

                  )}

                  {!hiddenFields.is_Rank && (
                    <FormField label="Rank" labelFor="rankCd" icon={mdiAccount}>
                      {({ className }) => (
                        <Field name="rankCd" id="rankCd" component="select" className={className}>
                          {rankConstant.map((option, index) => (
                            <option key={index} value={option.value}>{option.label}</option>
                          ))}
                        </Field>
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
            perPage={10}
            loading={loading}
            total={
              items.length
            }
            onClickAction={handleClickRow}
            onPageChange={handlePageChange}
          />
        </CardBox>
      </SectionMain>
    </>

  );
}
