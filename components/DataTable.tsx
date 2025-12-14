import React from 'react';
import { ColumnDef, DataRow, SortState } from '../types';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';

interface DataTableProps {
  data: DataRow[];
  columns: ColumnDef[];
  sortModel: SortState | null;
  onSortChange: (field: string) => void;
}

export const DataTable: React.FC<DataTableProps> = ({ 
  data, 
  columns, 
  sortModel, 
  onSortChange 
}) => {
  if (data.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No data available to display.
      </div>
    );
  }

  const visibleColumns = columns.filter(c => !c.hide);

  return (
    <div className="overflow-x-auto border rounded-lg border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {visibleColumns.map((col) => (
              <th
                key={col.field}
                scope="col"
                className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
                style={{ width: col.width }}
                onClick={() => onSortChange(col.field)}
              >
                <div className="flex items-center space-x-1">
                  <span>{col.headerName}</span>
                  <span className="text-gray-400 group-hover:text-gray-600">
                    {sortModel?.field === col.field ? (
                      sortModel.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    ) : (
                      <ChevronsUpDown size={14} className="opacity-0 group-hover:opacity-100" />
                    )}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
              {visibleColumns.map((col) => {
                const val = row[col.field];
                let displayVal = val;
                
                if (col.type === 'currency' && typeof val === 'number') {
                    displayVal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
                } else if (col.type === 'date' && val) {
                    displayVal = new Date(val).toLocaleDateString();
                }

                return (
                  <td key={`${rowIndex}-${col.field}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {displayVal}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
