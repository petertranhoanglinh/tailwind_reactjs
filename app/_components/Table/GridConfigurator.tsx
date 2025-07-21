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
      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
      >
        Save Module
      </button>
    </div>
  );
};

export default GridConfigurator;