import { ColumnDef, DataRow, FilterState, GroupState, SortState, AggregationResult } from '../types';

export const filterData = (data: DataRow[], filters: FilterState[]): DataRow[] => {
  if (!filters.length) return data;

  return data.filter((row) => {
    return filters.every((filter) => {
      const cellValue = row[filter.field];
      const filterValue = filter.value;

      if (filter.operator === 'contains') {
        return String(cellValue).toLowerCase().includes(String(filterValue).toLowerCase());
      }
      if (filter.operator === 'equals') {
        // loose equality for string/number match
        // eslint-disable-next-line eqeqeq
        return cellValue == filterValue;
      }
      if (filter.operator === 'gt') {
        return Number(cellValue) > Number(filterValue);
      }
      if (filter.operator === 'lt') {
        return Number(cellValue) < Number(filterValue);
      }
      return true;
    });
  });
};

export const sortData = (data: DataRow[], sort: SortState | null): DataRow[] => {
  if (!sort) return data;

  return [...data].sort((a, b) => {
    const valA = a[sort.field];
    const valB = b[sort.field];

    if (valA < valB) return sort.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sort.direction === 'asc' ? 1 : -1;
    return 0;
  });
};

export const groupData = (data: DataRow[], groupByField: string | null, columns: ColumnDef[]): AggregationResult[] => {
  if (!groupByField) return [];

  const groups: Record<string, AggregationResult> = {};

  data.forEach((row) => {
    const groupKey = String(row[groupByField]);
    
    if (!groups[groupKey]) {
      groups[groupKey] = {
        _groupKey: groupKey,
        _count: 0,
        [groupByField]: row[groupByField], // Preserve the grouping key value
      };
      // Initialize numeric columns for aggregation
      columns.forEach(col => {
        if (col.type === 'number' || col.type === 'currency') {
          groups[groupKey][col.field] = 0;
        } else if (col.field !== groupByField) {
           // For non-numeric, non-group columns, we might pick the first value or leave blank
           groups[groupKey][col.field] = row[col.field]; 
        }
      });
    }

    const group = groups[groupKey];
    group._count += 1;

    // Aggregate numeric values (Summation)
    columns.forEach(col => {
      if (col.type === 'number' || col.type === 'currency') {
        group[col.field] += (Number(row[col.field]) || 0);
      }
    });
  });

  return Object.values(groups);
};

export const downloadCSV = (data: DataRow[], filename: string) => {
  if (!data.length) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(fieldName => {
      const val = row[fieldName];
      // Escape quotes and wrap in quotes if contains comma
      const stringVal = String(val === null || val === undefined ? '' : val);
      return `"${stringVal.replace(/"/g, '""')}"`;
    }).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
