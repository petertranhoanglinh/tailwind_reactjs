"use client";
import React, { useEffect, useState } from 'react';
import { GridConfig } from '../../../_type/types';
import girdService from '../../../_services/gird.service';
import DynamicFormFields from '../../../_components/Table/_component/DynamicFormFields';
import GenericTable from '../../../_components/Table/Table';
import CardBox from '../../../_components/CardBox';
import SectionMain from '../../../_components/Section/Main';
import CardBoxModal from '../../../_components/CardBox/Modal';
import type { ColorButtonKey } from '../../../_interfaces';
import Button from '../../../_components/Button';

const mapDataTypeToInputType = (dataType: string):
  'text' | 'date' | 'select' | 'checkbox' | 'number' | 'email' => {
  switch (dataType) {
    case 'date': return 'date';
    case 'date-range': return 'date';
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
    submit: false,
    modal: false,
  });
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'add'>('view');
  const [currentRow, setCurrentRow] = useState<any>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  // Set default modal button properties based on mode
  const getModalButtonProps = (): { buttonColor: ColorButtonKey; buttonLabel: string } => {
    switch (modalMode) {
      case 'add':
        return { buttonColor: 'info', buttonLabel: 'Add' };
      case 'edit':
        return { buttonColor: 'warning', buttonLabel: 'Save' };
      case 'view':
      default:
        return { buttonColor: 'info', buttonLabel: 'OK' };
    }
  };

  const { buttonColor, buttonLabel } = getModalButtonProps();

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
      // Tạo bản sao của values và loại bỏ các filter rỗng
      const cleanedFilters = Object.entries(values).reduce((acc, [key, value]) => {
        // Chỉ giữ lại các giá trị không rỗng và không null
        if (value !== "" && value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);

      setFilters(cleanedFilters);

    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const handleActionClick = (row: any, action: string) => {
    if (action === 'edit') {
      setCurrentRow(row);
      setModalMode('edit');
      const initialValues: Record<string, any> = {};
      selectedConfig?.columns.forEach(column => {
        initialValues[column.fieldName] = row[column.fieldName];
      });
      setFormValues(initialValues);
      setModalOpen(true);
    } else if (action === 'view') {
      setCurrentRow(row);
      setModalMode('view');
      setModalOpen(true);
    }
  };

  const handleAddNew = () => {
    setCurrentRow(null);
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

  const modalFormFields = selectedConfig?.columns.map(column => {
    // Lấy filter tương ứng nếu có
    const matchingFilter = selectedConfig?.filters?.find(
      f => f.fieldName === column.fieldName
    );

    // Tạo config cơ bản từ column
    const baseLabel = column.displayName || column.fieldName;
    const baseConfig = {
      name: column.fieldName,
      label: baseLabel,
      type: mapDataTypeToInputType(column.dataType),
      placeholder: `Enter ${baseLabel}`,
      required: true,
      value: formValues[column.fieldName],
      disabled: modalMode === 'view',
      onChange: (value: any) => handleFormChange(column.fieldName, value)
    };

    // Nếu có filter, merge có chọn lọc
    return matchingFilter ? {
      ...baseConfig,
      ...(matchingFilter.displayName && {
        label: matchingFilter.displayName,
        placeholder: `Enter ${matchingFilter.displayName}`
      }),
      ...(matchingFilter.filterType && {
        type: mapDataTypeToInputType(matchingFilter.filterType)
      }),
      options: matchingFilter.options || [] || false
    } : {
      ...baseConfig,
      options: []
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
            setFilters({});
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

      <CardBoxModal
        title={`${modalMode === 'add' ? 'Add New' : modalMode === 'edit' ? 'Edit' : 'View'} Record`}
        buttonColor={buttonColor}
        buttonLabel={buttonLabel}
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
                  {field.options?.map((option: any) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'checkbox' ? (
                <input
                  type="checkbox"
                  checked={field.value || false}
                  onChange={(e) => field.onChange(e.target.checked)}
                  disabled={field.disabled}
                  className="h-5 w-5"
                />
              ) : (
                <input
                  type={field.type}
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