export type GridColumn = {
  fieldName: string;
  displayName: string;
  dataType: 'string' | 'number' | 'date' | 'boolean' | 'select';
  visible?: boolean;
};

export type FilterType 
= 'text' | 'select' | 'date-range' | 'number-range' 
| 'boolean' | 'checkbox' | 'switch' | 'custom' | 'date' |
'number' | 'email';

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


// types/erp-data.ts

export interface ERPData {
  id: string;
  module: string; // Reference to grid_config.module
  recordType: string; // "order", "invoice", etc.
  fieldValues: Record<string, any>; // Dynamic fields data
  metadata: Metadata;
}

export interface Metadata {
  createdAt: Date;
  createdBy: string;
  lastModifiedBy?: string;
  lastModified?: Date;
  // ... other audit fields
}