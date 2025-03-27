import { SelectDropDownModel } from "../_models/selectdropdown.model";


export const stepKindConstantSearchUser: SelectDropDownModel[] = [
    { label: "Selected", value: "0" },
    { label: "Direct Placement", value: "2" },
    { label: "Placement Group", value: "3" },
    { label: "Direct Sponsor", value: "5" },
    { label: "Sponsor Group", value: "6" },
];

export const rankConstant: SelectDropDownModel[] = [
    { label: "All", value: "" },
    { label: "Distributor", value: "0120" },
    { label: "Exclusive Distributor", value: "0130" },
    { label: "Director", value: "0140" },
    { label: "Executive Director", value: "0150" },
];

export const removeKeysContainingIs = (params: Record<string, unknown>): Record<string, unknown> => {
    return Object.fromEntries(
      Object.entries(params).filter(([key]) => !key.toLowerCase().includes("is"))
    );
  };

  export const formatDateToYYYYMMDD = (dateString: string): string => {
    return dateString.replace(/-/g, '');
};
  