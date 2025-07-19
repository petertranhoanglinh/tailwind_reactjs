"use client";
import React, { useEffect, useState } from 'react';
import { GridConfig } from '../../../_type/types';
import girdService from '../../../_services/gird.service';
import DynamicFormFields from '../../../_components/Table/_component/DynamicFormFields';
import GenericTable from '../../../_components/Table/Table';
import { options } from 'numeral';

// Type cho dữ liệu mẫu
type SampleData = {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: Date;
};

// Hàm ánh xạ kiểu dữ liệu sang loại input - DI CHUYỂN LÊN TRÊN
const mapDataTypeToInputType = (dataType: string): 
  'text' | 'date' | 'select' | 'checkbox' | 'number' | 'email' => {
  switch (dataType) {
    case 'date': return 'date';
    case 'boolean': return 'checkbox';
    case 'number': return 'number';
    case 'email': return 'email';
    case 'select': return 'select';
    default: return 'text';
  }
};

const ConfigurableTableForm = () => {
  const [gridConfigs, setGridConfigs] = useState<GridConfig[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<GridConfig | null>(null);
  const [data, setData] = useState<SampleData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadConfigs = async () => {
      setLoading(true);
      try {
        const configs = await girdService.loadGridConfig();
        setGridConfigs(configs);
      } catch (error) {
        console.error('Error loading configs:', error);
      } finally {
        setLoading(false);
      }
    };
    loadConfigs();
  }, []);

  useEffect(() => {
    if (selectedConfig) {
      loadData();
    }
  }, [selectedConfig]);

  const loadData = async () => {
    setLoading(true);
    try {
      const mockData: SampleData[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          status: 'Active',
          createdAt: new Date(),
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          status: 'Inactive',
          createdAt: new Date(),
        },
      ];
      setData(mockData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      console.log('Form submitted:', values);
      await loadData();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleActionClick = (row: SampleData, action: string) => {
    console.log(`Action ${action} clicked for row:`, row);
  };
  const tableColumns = selectedConfig?.columns.map(column => ({
    key: column.fieldName as keyof SampleData,
    label: column.fieldName || column.fieldName,
    kind: column.dataType,
    isSort: true,
  })) || [];
  const formFields = selectedConfig?.filters.map(filter => ({
    name: filter.fieldName,
    label: filter.displayName || filter.fieldName,
    type: mapDataTypeToInputType(filter.filterType),
    placeholder: `Enter ${filter.displayName || filter.fieldName}`,
    required: true,
    options: filter.options
  })) || [];

  return (
     <div className="p-4">
      <div className="flex items-center gap-4 mb-6">
        <select
          className="w-72 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          onChange={(e) => {
            const config = gridConfigs.find(c => c.id === e.target.value);
            setSelectedConfig(config || null);
          }}
          value={selectedConfig?.id || ''}
          disabled={loading}
        >
          <option value="">Select a configuration</option>
          {gridConfigs.map(config => (
            <option key={config.id} value={config.id}>
              {config.module || `Config ${config.id}`}
            </option>
          ))}
        </select>

        <button
          onClick={() => setSelectedConfig(null)}
          className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Reset
        </button>
      </div>

      {selectedConfig && (
        <>
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="mb-4 text-xl font-semibold">Form</h2>
            <DynamicFormFields
              config={formFields}
              onSubmit={handleSubmit}
              columns={2}
            />
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="mb-4 text-xl font-semibold">Data Table</h2>
            <GenericTable<SampleData>
              data={data}
              columns={tableColumns}
              loading={loading}
              total={data.length}
              onClickAction={handleActionClick}
              showPaging={true}
              perPage={10}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ConfigurableTableForm;