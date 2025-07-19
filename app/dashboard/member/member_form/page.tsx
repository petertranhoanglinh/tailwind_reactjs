"use client";
import React, { useEffect, useState } from 'react';
import { GridConfig, GridDataResponse } from '../../../_type/types';
import girdService from '../../../_services/gird.service';
import DynamicFormFields from '../../../_components/Table/_component/DynamicFormFields';
import GenericTable from '../../../_components/Table/Table';
import CardBox from '../../../_components/CardBox';
import SectionMain from '../../../_components/Section/Main';

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
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    configs: false,
    data: false,
    submit: false
  });
  const [filters, setFilters] = useState<Record<string, any>>({});

  useEffect(() => {
    const loadConfigs = async () => {
      setLoading(prev => ({ ...prev, configs: true }));
      try {
        const configs = await girdService.loadGridConfig();
        setGridConfigs(configs);
      } catch (error) {
        console.error('Error loading configs:', error);
      } finally {
        setLoading(prev => ({ ...prev, configs: false }));
      }
    };
    loadConfigs();
  }, []);

  useEffect(() => {
    if (selectedConfig) {
      loadData();
    }
  }, [selectedConfig, filters]);

  const loadData = async () => {
    if (!selectedConfig) return;

    setLoading(prev => ({ ...prev, data: true }));
    try {
      const response = await girdService.loadGridData(selectedConfig.id, filters);
      setTableData(response.rows);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(prev => ({ ...prev, data: false }));
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(prev => ({ ...prev, submit: true }));
    try {
      // Apply form values as filters
      setFilters(values);
      console.log('Filters applied:', values);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const handleActionClick = (row: any, action: string) => {
    console.log(`Action ${action} clicked for row:`, row);
    if (action === 'edit') {
      // Handle edit action
    }
  };

  const tableColumns = selectedConfig?.columns.map(column => ({
    key: column.fieldName,
    label: column.displayName || column.fieldName,
    kind: column.dataType,
    isSort: true,
    // render: column.customRender 
    //   ? (item: any) => column.customRender(item[column.fieldName])
    //   : undefined,
  })) || [];

  const formFields = selectedConfig?.filters?.length
    ? selectedConfig.filters.map(filter => ({
      name: filter.fieldName,
      label: filter.displayName || filter.fieldName,
      type: mapDataTypeToInputType(filter.filterType),
      placeholder: `Enter ${filter.displayName || filter.fieldName}`,
      required: true,
      options: filter.options,
      defaultValue: filters[filter.fieldName] || ''
    }))
    : null;

  return (
    <SectionMain>
      <div className="flex items-center gap-4 mb-6">
        <select
          className="w-72 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          onChange={(e) => {
            const config = gridConfigs.find(c => c.id === e.target.value);
            setSelectedConfig(config || null);
            setFilters({}); // Reset filters when changing config
          }}
          value={selectedConfig?.id || ''}
          disabled={loading.configs}
        >
          <option value="">Select a configuration</option>
          {gridConfigs.map(config => (
            <option key={config.id} value={config.id}>
              {config.module || `Config ${config.id}`}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setSelectedConfig(null);
            setFilters({});
          }}
          className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
          disabled={!selectedConfig}
        >
          Reset
        </button>
      </div>

      {selectedConfig && (
        <>
          <CardBox>
            <DynamicFormFields
              config={formFields}
              onSubmit={handleSubmit}
              columns={2}
              submitButtonText="Apply Filters"
            />
          </CardBox>
          <CardBox className="mb-6" hasTable>

            <GenericTable
              data={tableData}
              columns={tableColumns}
              loading={loading.data}
              total={tableData.length}
              onClickAction={handleActionClick}
              showPaging={true}
              perPage={10}
            />
          </CardBox>
        </>



      )}
    </SectionMain>
  );
};

export default ConfigurableTableForm;