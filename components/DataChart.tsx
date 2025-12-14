import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import { ChartConfig, DataRow } from '../types';

interface DataChartProps {
  data: DataRow[];
  config: ChartConfig;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const DataChart: React.FC<DataChartProps> = ({ data, config }) => {
  
  const ChartComponent = useMemo(() => {
    switch (config.type) {
      case 'bar': return BarChart;
      case 'line': return LineChart;
      case 'area': return AreaChart;
      case 'pie': return PieChart;
      case 'scatter': return ScatterChart;
      default: return BarChart;
    }
  }, [config.type]);

  if (!data || data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-gray-400">
        No data to visualize
      </div>
    );
  }

  // Pie charts are handled differently (single series usually)
  if (config.type === 'pie') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey={config.yAxisKeys[0]}
            nameKey={config.xAxisKey}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#3b82f6"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ChartComponent data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        {config.showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />}
        <XAxis 
            dataKey={config.xAxisKey} 
            tick={{fontSize: 12}} 
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
        />
        <YAxis 
            tick={{fontSize: 12}} 
            tickLine={false}
            axisLine={false}
        />
        <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
        {config.showLegend && <Legend />}
        
        {config.yAxisKeys.map((key, index) => {
            const color = COLORS[index % COLORS.length];
            if (config.type === 'bar') {
                return <Bar key={key} dataKey={key} fill={color} radius={[4, 4, 0, 0]} />;
            }
            if (config.type === 'line') {
                return <Line key={key} type="monotone" dataKey={key} stroke={color} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />;
            }
            if (config.type === 'area') {
                return <Area key={key} type="monotone" dataKey={key} fill={color} stroke={color} fillOpacity={0.3} />;
            }
            if (config.type === 'scatter') {
                return <Scatter key={key} name={key} dataKey={key} fill={color} />;
            }
            return null;
        })}
      </ChartComponent>
    </ResponsiveContainer>
  );
};
