# InsightGrid Pro - Universal Data Viewer

InsightGrid Pro is a powerful, React-based data analysis component designed to provide enterprise-level reporting capabilities. It combines a robust data grid, dynamic visualization, and AI-powered insights into a single, easy-to-integrate component.

## Features

- **Advanced Data Grid**:
  - Sortable columns.
  - Automatic formatting for **Currency**, **Dates**, and **Numbers**.
  - Responsive table layout.
- **Dynamic Visualization**:
  - Integrated charts using **Recharts**.
  - Supported types: **Bar**, **Line**, **Area**, **Pie**, **Scatter**.
  - User-configurable X and Y axes via the settings panel.
- **Data Manipulation**:
  - **Filtering**: Multi-condition filtering (Contains, Equals, Greater Than, Less Than).
  - **Grouping**: Aggregate data by categorical fields with automatic summation of numeric columns.
- **AI Integration**:
  - Built-in integration with **Google Gemini API** (`gemini-2.5-flash`).
  - Generates qualitative insights, trend analysis, and anomaly detection based on the currently filtered dataset.
- **Export**:
  - One-click **CSV export** of processed (filtered/grouped) data.
- **View Modes**:
  - Toggle between Table-only, Chart-only, or Split views.

## Usage

### 1. Installation

Ensure you have the required dependencies installed:

```bash
npm install react react-dom lucide-react recharts @google/genai
```

### 2. Basic Implementation

Import the `UniversalDataViewer` and define your columns and data.

```tsx
import { UniversalDataViewer } from './components/UniversalDataViewer';
import { ColumnDef } from './types';

// 1. Define Columns
const columns: ColumnDef[] = [
  { field: 'id', headerName: 'ID', type: 'number', width: 80 },
  { field: 'name', headerName: 'Customer Name', type: 'string' },
  { field: 'role', headerName: 'Role', type: 'string' },
  { field: 'salary', headerName: 'Salary', type: 'currency' },
  { field: 'joinDate', headerName: 'Joined', type: 'date' },
];

// 2. Prepare Data
const data = [
  { id: 1, name: 'Alice', role: 'Dev', salary: 120000, joinDate: '2023-01-15' },
  { id: 2, name: 'Bob', role: 'Manager', salary: 150000, joinDate: '2022-11-01' },
  // ... more data
];

// 3. Render Component
function App() {
  return (
    <div style={{ height: '100vh' }}>
      <UniversalDataViewer 
        initialData={data} 
        columns={columns} 
        title="Employee Report"
      />
    </div>
  );
}
```

### 3. API Reference

#### `UniversalDataViewer` Props

| Prop | Type | Description |
|------|------|-------------|
| `initialData` | `DataRow[]` | Array of JSON objects containing the raw data. |
| `columns` | `ColumnDef[]` | Configuration for columns (headers, types, visibility). |
| `title` | `string` | (Optional) Title displayed in the header. Default: "Data Report". |

#### `ColumnDef` Configuration

| Property | Type | Description |
|----------|------|-------------|
| `field` | `string` | The key in the data object. |
| `headerName` | `string` | Text displayed in the table header. |
| `type` | `DataType` | One of: `'string' \| 'number' \| 'date' \| 'boolean' \| 'currency'`. Controls formatting and filter logic. |
| `width` | `number` | (Optional) Specific width for the column in pixels. |
| `hide` | `boolean` | (Optional) If true, column is hidden from the grid but available for charts. |

## Environment Variables

To enable AI insights, you must provide a valid Google GenAI API key in your environment.

```env
API_KEY=your_gemini_api_key_here
```

## Architecture

- **`components/UniversalDataViewer.tsx`**: Main container managing state (filters, sort, view mode) and orchestration.
- **`components/DataTable.tsx`**: Presentation component for the grid using standard HTML tables with Tailwind styling.
- **`components/DataChart.tsx`**: Wrapper around Recharts for dynamic plotting.
- **`services/dataUtils.ts`**: Core logic for client-side filtering, sorting, and grouping.
- **`services/geminiService.ts`**: Interface for the Google GenAI SDK.
