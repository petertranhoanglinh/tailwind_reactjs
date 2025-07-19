export type GridColumn = {
  fieldName: string;
  displayName: string;
  dataType: 'string' | 'number' | 'date' | 'boolean';
  visible?: boolean;
};

export type FilterType = 'text' | 'select' | 'date-range' | 'number-range' | 'boolean';

export type FilterOption = {
  value: string;
  label: string;
};

export type GridFilter = {
  fieldName: string;
  displayName: string;
  filterType: FilterType;
  options?: FilterOption[];
  defaultValue?: any;
};

export type GridConfig = {
  id:string
  module: string;
  columns: GridColumn[];
  filters: GridFilter[];
};



export interface GridDataResponse {
  rows: Record<string, any>[];
  columns: GridColumn[];
}