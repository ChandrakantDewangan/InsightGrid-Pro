export type DataType = 'string' | 'number' | 'date' | 'boolean' | 'currency';

export interface ColumnDef {
  field: string;
  headerName: string;
  type: DataType;
  width?: number;
  hide?: boolean;
}

export type DataRow = Record<string, any>;

export interface FilterState {
  field: string;
  operator: 'contains' | 'equals' | 'gt' | 'lt' | 'true' | 'false';
  value: string | number;
}

export interface SortState {
  field: string;
  direction: 'asc' | 'desc';
}

export interface GroupState {
  field: string;
  expanded?: boolean; // For future tree expansion features
}

export type ChartType = 'bar' | 'line' | 'area' | 'pie' | 'scatter';

export interface ChartConfig {
  type: ChartType;
  xAxisKey: string;
  yAxisKeys: string[];
  showLegend: boolean;
  showGrid: boolean;
}

export interface AggregationResult {
  [key: string]: any;
  _count: number;
  _groupKey: string;
}
