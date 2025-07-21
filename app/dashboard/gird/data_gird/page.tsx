"use client";
import React, { useEffect, useState } from 'react';
import { GridConfig } from '../../../_type/types';
import girdService from '../../../_services/gird.service';
import GenericTable from '../../../_components/Table/Table';
import CardBox from '../../../_components/CardBox';
import SectionMain from '../../../_components/Section/Main';
import CardBoxModal from '../../../_components/CardBox/Modal';
import Button from '../../../_components/Button';
// import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Thêm các kiểu filter mới
type FilterOperator = 'eq' | 'neq' | 'contains' | 'gt' | 'lt' | 'gte' | 'lte' | 'startswith' | 'endswith';

interface DynamicFilter {
  id: string;
  field: string;
  operator: FilterOperator;
  value: any;
}

const mapDataTypeToOperators = (dataType: string): FilterOperator[] => {
  switch (dataType) {
    case 'text':
      return ['eq', 'neq', 'contains', 'startswith', 'endswith'];
    case 'number':
      return ['eq', 'neq', 'gt', 'lt', 'gte', 'lte'];
    case 'date':
      return ['eq', 'neq', 'gt', 'lt', 'gte', 'lte'];
    case 'boolean':
      return ['eq', 'neq'];
    case 'select':
      return ['eq', 'neq'];
    default:
      return ['eq', 'neq', 'contains'];
  }
};

const operatorLabels: Record<FilterOperator, string> = {
  eq: 'Equals',
  neq: 'Not equals',
  contains: 'Contains',
  gt: 'Greater than',
  lt: 'Less than',
  gte: 'Greater than or equal',
  lte: 'Less than or equal',
  startswith: 'Starts with',
  endswith: 'Ends with'
};

const ConfigurableTableForm = () => {
  const [gridConfigs, setGridConfigs] = useState<GridConfig[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<GridConfig | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    configs: false,
    data: false,
    submit: false,
    modal: false,
  });
  const [dynamicFilters, setDynamicFilters] = useState<DynamicFilter[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'add'>('view');
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [availableFields, setAvailableFields] = useState<{ field: string; label: string; type: string }[]>([]);

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
      // Tạo danh sách các trường có thể filter
      const fields = selectedConfig.columns.map(column => ({
        field: column.fieldName,
        label: column.displayName || column.fieldName,
        type: column.dataType
      }));
      setAvailableFields(fields);
      loadData();
    }
  }, [selectedConfig, dynamicFilters]);

  const loadData = async () => {
    if (!selectedConfig) return;

    setLoading(prev => ({ ...prev, data: true }));
    try {
      // Phiên bản tạm thời - chỉ gửi filter đơn giản
      const simpleFilters: Record<string, string> = {};

      // dynamicFilters.forEach(f => {
      //   // Hiện tại chỉ sử dụng value, bỏ qua operator
      //   // Có thể thêm logic xử lý đặc biệt cho từng trường nếu cần
      //   if (f.value && f.value.toString().trim() !== '') {
      //     simpleFilters[f.field] = f.value.toString();
      //   }
      // });

      // // Gọi API với filter đơn giản
      // const response = await girdService.loadGridData(selectedConfig.id, simpleFilters);
      // setTableData(response.rows);

      // Phiên bản sau khi nâng cấp API có thể sẽ là:
      const advancedFilters = dynamicFilters.map(f => ({
        field: f.field,
        operator: f.operator, // Sẽ sử dụng sau khi API hỗ trợ
        value: f.value
      }));
      const response = await girdService.loadGridData(selectedConfig.id, { filters: advancedFilters });
      setTableData(response.rows);
      

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(prev => ({ ...prev, data: false }));
    }
  };

  const handleAddFilter = () => {
    if (availableFields.length === 0) return;
    const newFilter: DynamicFilter = {
      id: Date.now().toString(),
      field: availableFields[0].field,
      operator: 'eq',
      value: ''
    };
    setDynamicFilters([...dynamicFilters, newFilter]);
  };

  const handleRemoveFilter = (id: string) => {
    setDynamicFilters(dynamicFilters.filter(f => f.id !== id));
  };

  const handleFilterChange = (id: string, field: keyof DynamicFilter, value: any) => {
    setDynamicFilters(dynamicFilters.map(f => {
      if (f.id === id) {
        // Nếu thay đổi field, reset operator về mặc định
        if (field === 'field') {
          const fieldType = availableFields.find(af => af.field === value)?.type || 'text';
          const defaultOperator = mapDataTypeToOperators(fieldType)[0];
          return { ...f, field: value, operator: defaultOperator, value: '' };
        }
        return { ...f, [field]: value };
      }
      return f;
    }));
  };

  const handleActionClick = (row: any, action: string) => {
    if (action === 'edit') {
      setModalMode('edit');
      const initialValues: Record<string, any> = {};
      selectedConfig?.columns.forEach(column => {
        initialValues[column.fieldName] = row[column.fieldName];
      });
      setFormValues(initialValues);
      setModalOpen(true);
    } else if (action === 'view') {
      setModalMode('view');
      setModalOpen(true);
    }
  };

  const handleAddNew = () => {
    setModalMode('add');
    const initialValues: Record<string, any> = {};
    selectedConfig?.columns.forEach(column => {
      initialValues[column.fieldName] = '';
    });
    setFormValues(initialValues);
    setModalOpen(true);
  };

  const handleModalClose = (confirmed: boolean) => {
    setModalOpen(false);
    if (confirmed && modalMode !== 'view') {
      handleModalSubmit();
    }
  };

  const handleModalSubmit = async () => {
    setLoading(prev => ({ ...prev, modal: true }));
    try {
      if (modalMode === 'add') {
        await girdService.saveGridData(selectedConfig?.id || '', formValues);
      } else if (modalMode === 'edit') {
        // await girdService.updateGridData(
        //   selectedConfig?.id || '', 
        //   currentRow.id,
        //   formValues
        // );
      }
      await loadData();
    } catch (error) {
      console.error('Error saving data:', error);
    } finally {
      setLoading(prev => ({ ...prev, modal: false }));
    }
  };

  const handleFormChange = (fieldName: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const tableColumns = selectedConfig?.columns.map(column => ({
    key: column.fieldName,
    label: column.displayName || column.fieldName,
    kind: column.dataType,
    isSort: true,
  })) || [];

  const modalFormFields = selectedConfig?.columns.map(column => {
    const baseLabel = column.displayName || column.fieldName;
    return {
      name: column.fieldName,
      label: baseLabel,
      type: column.dataType,
      placeholder: `Enter ${baseLabel}`,
      required: true,
      value: formValues[column.fieldName],
      disabled: modalMode === 'view',
      onChange: (value: any) => handleFormChange(column.fieldName, value)
    };
  }) || [];

  return (
    <SectionMain>
      <div className="flex items-center gap-4 mb-6">
        <select
          className="w-72 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          onChange={(e) => {
            const config = gridConfigs.find(c => c.id === e.target.value);
            setSelectedConfig(config || null);
            setDynamicFilters([]);
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
            setDynamicFilters([]);
          }}
          className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
          disabled={!selectedConfig}
        >
          Reset
        </button>

        {selectedConfig && (
          <Button
            onClick={handleAddNew}
            label="Add New"
            color="info"
            className="ml-auto"
          />
        )}
      </div>

      {selectedConfig && (
        <>
          <CardBox>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Filters</h3>
                <Button
                  onClick={handleAddFilter}
                  label="Add Filter"
                  color="info"
                  // icon={<PlusIcon className="h-4 w-4" />}
                  small
                />
              </div>

              {dynamicFilters.length === 0 ? (
                <p className="text-gray-500 text-sm">No filters applied</p>
              ) : (
                <div className="space-y-3">
                  {dynamicFilters.map(filter => {
                    const fieldInfo = availableFields.find(f => f.field === filter.field);
                    const operators = mapDataTypeToOperators(fieldInfo?.type || 'text');

                    return (
                      <div key={filter.id} className="flex items-center gap-2">
                        <select
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                          value={filter.field}
                          onChange={(e) => handleFilterChange(filter.id, 'field', e.target.value)}
                        >
                          {availableFields.map(field => (
                            <option key={field.field} value={field.field}>
                              {field.label}
                            </option>
                          ))}
                        </select>

                        <select
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                          value={filter.operator}
                          onChange={(e) => handleFilterChange(filter.id, 'operator', e.target.value as FilterOperator)}
                        >
                          {operators.map(op => (
                            <option key={op} value={op}>
                              {operatorLabels[op]}
                            </option>
                          ))}
                        </select>

                        {fieldInfo?.type === 'select' ? (
                          <select
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                            value={filter.value}
                            onChange={(e) => handleFilterChange(filter.id, 'value', e.target.value)}
                          >
                            <option value="">Select value</option>
                            {/* Bạn có thể thêm options tùy theo field */}
                          </select>
                        ) : fieldInfo?.type === 'boolean' ? (
                          <select
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                            value={filter.value}
                            onChange={(e) => handleFilterChange(filter.id, 'value', e.target.value === 'true')}
                          >
                            <option value="">Select</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                        ) : (
                          <input
                            type={fieldInfo?.type === 'number' ? 'number' : 'text'}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                            value={filter.value}
                            onChange={(e) => handleFilterChange(filter.id, 'value', e.target.value)}
                            placeholder="Enter value"
                          />
                        )}

                        <button
                          onClick={() => handleRemoveFilter(filter.id)}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
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

      <CardBoxModal
        title={`${modalMode === 'add' ? 'Add New' : modalMode === 'edit' ? 'Edit' : 'View'} Record`}
        buttonColor="info"
        buttonLabel={modalMode === 'view' ? 'OK' : modalMode === 'add' ? 'Add' : 'Save'}
        isActive={modalOpen}
        onClose={handleModalClose}
      >
        <div className="space-y-4">
          {modalFormFields.map((field) => (
            <div key={field.name} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === 'select' ? (
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  disabled={field.disabled}
                >
                  <option value="">Select {field.label}</option>
                  {/* Thêm options tùy theo field */}
                </select>
              ) : field.type === 'boolean' ? (
                <input
                  type="checkbox"
                  checked={field.value || false}
                  onChange={(e) => field.onChange(e.target.checked)}
                  disabled={field.disabled}
                  className="h-5 w-5"
                />
              ) : (
                <input
                  type={field.type === 'number' ? 'number' : 'text'}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder={field.placeholder}
                  disabled={field.disabled}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              )}
            </div>
          ))}
        </div>
      </CardBoxModal>
    </SectionMain>
  );
};

export default ConfigurableTableForm;