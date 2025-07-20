import { useState, useEffect } from 'react';
import { FilterOption, FilterType, GridColumn, GridConfig, GridFilter } from '../../_type/types';

// Type definitions

type GridConfiguratorProps = {
  initialConfig?: GridConfig | null;
  onSave: (config: GridConfig) => void;
  modules?: string[];
};

const GridConfigurator = ({
  initialConfig = null,
  onSave,
  modules = []
}: GridConfiguratorProps) => {
  const [module, setModule] = useState<string>('');
  const [columns, setColumns] = useState<GridColumn[]>([]);
  const [filters, setFilters] = useState<GridFilter[]>([]);
  const [tempOptionInputs, setTempOptionInputs] = useState<{ [key: number]: string }>({});

  // Initialize with default values
  useEffect(() => {
    if (initialConfig) {
      setModule(initialConfig.module);
      setColumns(initialConfig.columns || []);
      setFilters(initialConfig.filters || []);
    }
  }, [initialConfig]);

  // Column handlers
  const addColumn = () => {
    setColumns([...columns, {
      fieldName: `field_${columns.length + 1}`,
      displayName: '',
      dataType: 'string',
      visible: true
    }]);
  };

  const updateColumn = <K extends keyof GridColumn>(
    index: number,
    key: K,
    value: GridColumn[K]
  ) => {
    const newColumns = [...columns];
    newColumns[index][key] = value;
    setColumns(newColumns);
  };

  const removeColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  // Filter handlers
  const addFilter = () => {
    setFilters([...filters, {
      fieldName: columns.length > 0 ? columns[0].fieldName : '',
      displayName: columns.length > 0 ? columns[0].displayName : '',
      filterType: 'text',
      options: [],
      defaultValue: ''
    }]);
  };

  const updateFilter = <K extends keyof GridFilter>(
    index: number,
    key: K,
    value: GridFilter[K]
  ) => {
    const newFilters = [...filters];
    const column = columns?.find(col => col.fieldName === newFilters[index].fieldName);

    // Cập nhật giá trị filter
    newFilters[index][key] = value;
   

    // Xử lý khi thay đổi filterType
    if (key === 'filterType') {
      if (value !== 'select') {
        newFilters[index].options = [{label : "selected" , value : ''}];
      }
       newFilters[index].filterType = value;
    }

    setFilters(newFilters);
  };
  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  // Handle adding multiple options at once
  const handleAddOptions = (filterIndex: number) => {
    const inputText = tempOptionInputs[filterIndex] || '';
    if (!inputText.trim()) return;

    const newOptions = [
      ...(filters[filterIndex].options || []),
      ...inputText.split('\n')
        .filter(line => line.includes(':'))
        .map(line => {
          const [value, ...labelParts] = line.split(':');
          const label = labelParts.join(':').trim();
          return {
            value: value.trim(),
            label: label || value.trim()
          };
        })
        .filter(opt => opt.value) // Remove empty values
        .reduce((unique, opt) => {
          if (!unique.some(o => o.value === opt.value)) {
            unique.push(opt);
          }
          return unique;
        }, [] as FilterOption[]) // Remove duplicates
    ];

    updateFilter(filterIndex, 'options', newOptions);
    setTempOptionInputs({ ...tempOptionInputs, [filterIndex]: '' });
  };

  // Get suitable filter types based on column data type
  const getFilterTypesForColumn = (dataType: GridColumn['dataType']): FilterType[] => {
    switch (dataType) {
      case 'number':
        return ['text', 'number-range'];
      case 'date':
        return ['date-range'];
      case 'boolean':
        return ['boolean'];
      default:
        return ['text', 'select'];
    }
  };

  // Save handler
  const handleSave = () => {
    if (!module) {
      alert('Please enter a module');
      return;
    }

    onSave({
      id:"",
      module,
      columns,
      filters
    });
  };

  // Render options input area for select filters
  const renderOptionsInput = (filterIndex: number) => (
    <div className="mt-2">
      <label className="block text-sm text-gray-500 mb-1">
        Nhập options (mỗi dòng 1 option, định dạng "value:label")
      </label>
      <textarea
        value={tempOptionInputs[filterIndex] || ''}
        onChange={(e) => setTempOptionInputs({
          ...tempOptionInputs,
          [filterIndex]: e.target.value
        })}
        placeholder={`Ví dụ:
active:Hoạt động
inactive:Ngừng hoạt động
pending:Đang chờ xử lý`}
        className="w-full p-2 border border-gray-300 rounded-md h-24 text-sm"
      />
      <button
        onClick={() => handleAddOptions(filterIndex)}
        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
      >
        Thêm Options
      </button>

      <div className="mt-2">
        <label className="block text-sm text-gray-500 mb-1">Options đã thêm:</label>
        <div className="flex flex-wrap gap-2">
          {filters[filterIndex].options?.length ? (
            filters[filterIndex].options?.map((option, i) => (
              <span
                key={i}
                className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-full text-sm"
              >
                {option.label} ({option.value})
                <button
                  onClick={() => {
                    const newOptions = filters[filterIndex].options?.filter((_, idx) => idx !== i) || [];
                    updateFilter(filterIndex, 'options', newOptions);
                  }}
                  className="ml-1 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-400">Chưa có options</span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
      {/* Module Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Module *
        </label>
        {modules.length > 0 ? (
          <select
            value={module}
            onChange={(e) => setModule(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select module</option>
            {modules.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={module}
            onChange={(e) => setModule(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        )}
      </div>

      {/* Columns Configuration */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Columns</h3>
          <button
            onClick={addColumn}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Add Column
          </button>
        </div>

        <div className="space-y-4">
          {columns.map((col, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 items-end">
              <div className="col-span-4">
                <label className="block text-sm text-gray-500 mb-1">Field Name</label>
                <input
                  type="text"
                  value={col.fieldName}
                  onChange={(e) => {
                    const lowerCaseValue = e.target.value.toLowerCase();
                    updateColumn(index, 'fieldName', lowerCaseValue);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                  pattern="[a-z0-9_]*"
                  title="Only lowercase letters, numbers and underscores allowed"
                />
              </div>

              <div className="col-span-4">
                <label className="block text-sm text-gray-500 mb-1">Display Name</label>
                <input
                  type="text"
                  value={col.displayName}
                  onChange={(e) => updateColumn(index, 'displayName', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="col-span-3">
                <label className="block text-sm text-gray-500 mb-1">Data Type</label>
                <select
                  value={col.dataType}
                  onChange={(e) => updateColumn(index, 'dataType', e.target.value as GridColumn['dataType'])}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="string">Text</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="boolean">Boolean</option>
                </select>
              </div>

              <div className="col-span-1">
                <button
                  onClick={() => removeColumn(index)}
                  className="w-full p-2 text-red-500 hover:text-red-700"
                  aria-label="Remove column"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters Configuration */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Filters</h3>
          <button
            onClick={addFilter}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            disabled={columns.length === 0}
          >
            Add Filter
          </button>
        </div>

        <div className="space-y-6">
          {filters.map((filter, index) => {
            const column = columns.find(c => c.fieldName === filter.fieldName);
            const filterTypes = column ? getFilterTypesForColumn(column.dataType) : [];

            return (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="grid grid-cols-12 gap-4 items-end">
                  <div className="col-span-4">
                    <label className="block text-sm text-gray-500 mb-1">Field</label>
                    <select
                      value={filter.fieldName}
                      onChange={(e) => {
                        const selectedColumn = columns.find(c => c.fieldName === e.target.value);
                        updateFilter(index, 'fieldName', e.target.value);
                        updateFilter(index, 'displayName', selectedColumn?.displayName || '');
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select field</option>
                      {columns.map((col) => (
                        <option key={col.fieldName} value={col.fieldName}>
                          {col.displayName || col.fieldName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-4">
                    <label className="block text-sm text-gray-500 mb-1">Filter Type</label>
                    <select
                      value={filter.filterType}
                      onChange={(e) => updateFilter(index, 'filterType', e.target.value as FilterType)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      disabled={!filter.fieldName}
                    >
                        <option key='' value={""}>
                          Select type
                        </option>
                      {filterTypes.map(type => (
                        <option key={type} value={type}>
                          {type === 'text' ? 'Text' :
                            type === 'select' ? 'Select' :
                              type === 'date-range' ? 'Date Range' :
                                type === 'number-range' ? 'Number Range' :
                                  'Boolean'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-3">
                    <label className="block text-sm text-gray-500 mb-1">Default Value</label>
                    <input
                      type="text"
                      value={filter.defaultValue || ''}
                      onChange={(e) => updateFilter(index, 'defaultValue', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="col-span-1">
                    <button
                      onClick={() => removeFilter(index)}
                      className="w-full p-2 text-red-500 hover:text-red-700"
                      aria-label="Remove filter"
                    >
                      ×
                    </button>
                  </div>
                </div>

                {/* Options input for select filter */}
                {filter.filterType === 'select' && renderOptionsInput(index)}
              </div>
            );
          })}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
      >
        Save Configuration
      </button>
    </div>
  );
};

export default GridConfigurator;