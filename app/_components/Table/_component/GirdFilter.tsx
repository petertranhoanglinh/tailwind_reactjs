import { useState } from 'react';

interface FilterOption {
  value: string;
  label: string;
}

interface GridFilterProps {
  fieldName: string;
  displayName: string;
  filterType: 'text' | 'select' | 'date-range' | 'number-range';
  options?: FilterOption[];
  value: any;
  onChange: (value: any) => void;
}

const GridFilter = ({
  fieldName,
  displayName,
  filterType,
  options = [],
  value,
  onChange
}: GridFilterProps) => {
  const renderFilterInput = () => {
    switch (filterType) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder={`Filter by ${displayName}`}
          />
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">All {displayName}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'date-range':
        return (
          <div className="flex space-x-2">
            <input
              type="date"
              value={value?.[0] || ''}
              onChange={(e) => onChange([e.target.value, value?.[1] || ''])}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="date"
              value={value?.[1] || ''}
              onChange={(e) => onChange([value?.[0] || '', e.target.value])}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        );

      case 'number-range':
        return (
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={value?.[0] || ''}
              onChange={(e) => onChange([e.target.value, value?.[1] || ''])}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              placeholder="Max"
              value={value?.[1] || ''}
              onChange={(e) => onChange([value?.[0] || '', e.target.value])}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {displayName}
      </label>
      {renderFilterInput()}
    </div>
  );
};

export default GridFilter;