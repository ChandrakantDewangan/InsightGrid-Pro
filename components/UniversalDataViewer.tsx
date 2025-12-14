import React, { useState, useMemo, useEffect } from 'react';
import { 
  ColumnDef, 
  DataRow, 
  FilterState, 
  SortState, 
  ChartConfig, 
  ChartType 
} from '../types';
import { 
  filterData, 
  sortData, 
  groupData, 
  downloadCSV 
} from '../services/dataUtils';
import { analyzeDataWithGemini } from '../services/geminiService';
import { DataTable } from './DataTable';
import { DataChart } from './DataChart';
import { Button } from './ui/Button';
import { 
  Download, 
  BarChart2, 
  Table as TableIcon, 
  Settings, 
  Filter, 
  Sparkles,
  Layout,
  RefreshCw,
  X
} from 'lucide-react';

interface UniversalDataViewerProps {
  initialData: DataRow[];
  columns: ColumnDef[];
  title?: string;
}

export const UniversalDataViewer: React.FC<UniversalDataViewerProps> = ({ 
  initialData, 
  columns, 
  title = "Data Report" 
}) => {
  // --- State ---
  const [viewMode, setViewMode] = useState<'table' | 'chart' | 'split'>('split');
  const [data] = useState<DataRow[]>(initialData);
  const [filters, setFilters] = useState<FilterState[]>([]);
  const [sortModel, setSortModel] = useState<SortState | null>(null);
  const [groupBy, setGroupBy] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  
  // AI State
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Chart Config
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    type: 'bar',
    xAxisKey: columns.find(c => c.type === 'string' || c.type === 'date')?.field || '',
    yAxisKeys: [columns.find(c => c.type === 'number' || c.type === 'currency')?.field || ''],
    showLegend: true,
    showGrid: true,
  });

  // --- Derived Data ---
  const processedData = useMemo(() => {
    let result = filterData(data, filters);
    
    // If grouping is active, we aggregate first
    if (groupBy) {
      result = groupData(result, groupBy, columns);
    }
    
    // Then sort
    result = sortData(result, sortModel);
    
    return result;
  }, [data, filters, sortModel, groupBy, columns]);

  // --- Handlers ---

  const handleSort = (field: string) => {
    setSortModel(prev => {
      if (prev?.field === field) {
        return prev.direction === 'asc' 
          ? { field, direction: 'desc' } 
          : null;
      }
      return { field, direction: 'asc' };
    });
  };

  const handleAddFilter = () => {
    const firstCol = columns[0].field;
    setFilters([...filters, { field: firstCol, operator: 'contains', value: '' }]);
  };

  const updateFilter = (index: number, key: keyof FilterState, val: any) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], [key]: val };
    setFilters(newFilters);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleDownload = () => {
    downloadCSV(processedData, `${title.replace(/\s+/g, '_')}_export.csv`);
  };

  const handleAiAnalyze = async () => {
    setIsAnalyzing(true);
    setAiInsight(null);
    const result = await analyzeDataWithGemini(processedData, columns);
    setAiInsight(result);
    setIsAnalyzing(false);
  };

  // --- Render ---

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900 overflow-hidden">
      
      {/* Header Toolbar */}
      <header className="flex-none bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
             <Layout size={20} />
          </div>
          <h1 className="text-xl font-bold text-gray-800">{title}</h1>
          <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-100 text-xs text-gray-500 font-medium border border-gray-200">
            {processedData.length} rows
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1 mr-4">
             <button 
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'table' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                title="Table View"
             >
                <TableIcon size={18} />
             </button>
             <button 
                onClick={() => setViewMode('split')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'split' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                title="Split View"
             >
                <Layout size={18} />
             </button>
             <button 
                onClick={() => setViewMode('chart')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'chart' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                title="Chart View"
             >
                <BarChart2 size={18} />
             </button>
          </div>

          <Button 
            variant="secondary" 
            size="sm" 
            icon={<Sparkles size={16} className={isAnalyzing ? "animate-spin text-purple-500" : "text-purple-500"} />}
            onClick={handleAiAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? 'Analyzing...' : 'Ask AI'}
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            icon={<Download size={16} />}
            onClick={handleDownload}
          >
            Export
          </Button>
          
          <Button 
            variant={showControls ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setShowControls(!showControls)}
            icon={<Settings size={16} />}
          >
            Config
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Configuration Sidebar */}
        {showControls && (
          <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto flex-none flex flex-col">
            <div className="p-4 border-b border-gray-100">
               <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                 <Filter size={16} /> Filters & Grouping
               </h3>
               
               {/* Grouping */}
               <div className="mb-6">
                 <label className="block text-xs font-medium text-gray-500 mb-1">Group By</label>
                 <select 
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={groupBy || ''}
                    onChange={(e) => setGroupBy(e.target.value || null)}
                 >
                    <option value="">None (Flat Table)</option>
                    {columns.filter(c => c.type === 'string' || c.type === 'boolean').map(c => (
                      <option key={c.field} value={c.field}>{c.headerName}</option>
                    ))}
                 </select>
               </div>

               {/* Filters */}
               <div className="space-y-3">
                 <div className="flex justify-between items-center">
                    <label className="text-xs font-medium text-gray-500">Active Filters</label>
                    <button onClick={handleAddFilter} className="text-xs text-blue-600 hover:underline font-medium">+ Add Filter</button>
                 </div>
                 {filters.map((filter, idx) => (
                   <div key={idx} className="p-3 bg-gray-50 rounded-md border border-gray-200 relative group">
                      <button 
                        onClick={() => removeFilter(idx)}
                        className="absolute top-1 right-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                      <select 
                        className="w-full mb-2 text-xs border-gray-300 rounded bg-white py-1"
                        value={filter.field}
                        onChange={(e) => updateFilter(idx, 'field', e.target.value)}
                      >
                         {columns.map(c => <option key={c.field} value={c.field}>{c.headerName}</option>)}
                      </select>
                      <div className="flex gap-2">
                        <select 
                          className="w-1/3 text-xs border-gray-300 rounded bg-white py-1"
                          value={filter.operator}
                          onChange={(e) => updateFilter(idx, 'operator', e.target.value)}
                        >
                          <option value="contains">Contains</option>
                          <option value="equals">Equals</option>
                          <option value="gt">Greater &gt;</option>
                          <option value="lt">Less &lt;</option>
                        </select>
                        <input 
                          type="text" 
                          className="w-2/3 text-xs border-gray-300 rounded px-2 py-1"
                          placeholder="Value"
                          value={filter.value}
                          onChange={(e) => updateFilter(idx, 'value', e.target.value)}
                        />
                      </div>
                   </div>
                 ))}
                 {filters.length === 0 && (
                   <div className="text-xs text-gray-400 italic text-center py-2">No active filters</div>
                 )}
               </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                 <BarChart2 size={16} /> Chart Configuration
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Chart Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['bar', 'line', 'area', 'pie', 'scatter'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setChartConfig(prev => ({...prev, type: t as ChartType}))}
                        className={`text-xs py-1.5 px-2 rounded border capitalize ${
                          chartConfig.type === t 
                          ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' 
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                   <label className="block text-xs font-medium text-gray-500 mb-1">X Axis (Category)</label>
                   <select 
                      className="w-full border border-gray-300 rounded-md p-2 text-sm"
                      value={chartConfig.xAxisKey}
                      onChange={(e) => setChartConfig(prev => ({...prev, xAxisKey: e.target.value}))}
                   >
                      {columns.map(c => (
                        <option key={c.field} value={c.field}>{c.headerName}</option>
                      ))}
                   </select>
                </div>

                <div>
                   <label className="block text-xs font-medium text-gray-500 mb-1">Y Axis (Values)</label>
                   <select 
                      className="w-full border border-gray-300 rounded-md p-2 text-sm"
                      value={chartConfig.yAxisKeys[0]}
                      onChange={(e) => setChartConfig(prev => ({...prev, yAxisKeys: [e.target.value]}))}
                   >
                      {columns.filter(c => c.type === 'number' || c.type === 'currency').map(c => (
                        <option key={c.field} value={c.field}>{c.headerName}</option>
                      ))}
                   </select>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Visualization Area */}
        <main className="flex-1 overflow-hidden bg-gray-50 p-4 flex flex-col gap-4">
          
          {/* AI Insight Box */}
          {aiInsight && (
             <div className="flex-none bg-gradient-to-r from-purple-50 to-white p-4 rounded-lg border border-purple-100 shadow-sm relative animate-fade-in">
                <button 
                  onClick={() => setAiInsight(null)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
                <div className="flex gap-3">
                   <div className="mt-1 text-purple-600">
                      <Sparkles size={20} />
                   </div>
                   <div>
                      <h4 className="font-semibold text-purple-900 mb-1">AI Data Insights</h4>
                      <div className="text-sm text-gray-700 prose prose-sm max-w-none">
                         <pre className="whitespace-pre-wrap font-sans text-sm">{aiInsight}</pre>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {/* Views */}
          <div className="flex-1 flex gap-4 min-h-0">
             
             {/* Grid View */}
             {(viewMode === 'table' || viewMode === 'split') && (
               <div className={`flex-1 flex flex-col min-w-0 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
                  <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h2 className="font-semibold text-gray-700 text-sm">Data Grid</h2>
                    {groupBy && <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Grouped by {groupBy}</span>}
                  </div>
                  <div className="flex-1 overflow-auto">
                    <DataTable 
                      data={processedData} 
                      columns={columns}
                      sortModel={sortModel}
                      onSortChange={handleSort}
                    />
                  </div>
                  <div className="p-2 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 text-right">
                    Showing {processedData.length} records
                  </div>
               </div>
             )}

             {/* Chart View */}
             {(viewMode === 'chart' || viewMode === 'split') && (
               <div className={`flex-1 flex flex-col min-w-0 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
                  <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h2 className="font-semibold text-gray-700 text-sm">Visualization</h2>
                  </div>
                  <div className="flex-1 p-4 min-h-[300px]">
                    <DataChart data={processedData} config={chartConfig} />
                  </div>
               </div>
             )}
          </div>
        </main>
      </div>
    </div>
  );
};
