import React from 'react';
import { UniversalDataViewer } from './components/UniversalDataViewer';
import { ColumnDef, DataRow } from './types';

// Mock Data Generation
const generateMockData = (count: number): DataRow[] => {
  const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America'];
  const products = ['Enterprise License', 'Basic Subscription', 'Pro Tools', 'Consulting Hours'];
  const statuses = ['Active', 'Pending', 'Closed', 'Renewed'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
    region: regions[Math.floor(Math.random() * regions.length)],
    product: products[Math.floor(Math.random() * products.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    sales: Math.floor(Math.random() * 10000) + 1000,
    profit: Math.floor(Math.random() * 3000) + 500,
    satisfaction: Math.floor(Math.random() * 100),
  }));
};

const columns: ColumnDef[] = [
  { field: 'id', headerName: 'ID', type: 'number', width: 80 },
  { field: 'date', headerName: 'Transaction Date', type: 'date', width: 150 },
  { field: 'region', headerName: 'Region', type: 'string', width: 150 },
  { field: 'product', headerName: 'Product', type: 'string', width: 200 },
  { field: 'status', headerName: 'Status', type: 'string', width: 120 },
  { field: 'sales', headerName: 'Sales Amount', type: 'currency', width: 150 },
  { field: 'profit', headerName: 'Profit', type: 'currency', width: 150 },
  { field: 'satisfaction', headerName: 'CSAT Score', type: 'number', width: 120 },
];

const mockData = generateMockData(250);

const App: React.FC = () => {
  return (
    <div className="h-full">
      <UniversalDataViewer 
        initialData={mockData} 
        columns={columns} 
        title="Q3 Sales Performance Report"
      />
    </div>
  );
};

export default App;
