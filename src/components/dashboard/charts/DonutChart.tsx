import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface PieDataPoint { name: string; value: number; color?: string; }
interface DonutChartProps { data: PieDataPoint[]; innerRadius?: number; outerRadius?: number; showLabels?: boolean; showLegend?: boolean; legendPosition?: 'top' | 'right' | 'bottom' | 'left'; height?: number; animated?: boolean; className?: string; }

const defaultColors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#f97316', '#14b8a6'];

function CustomTooltip(props: any, total: number) {
  const { active, payload } = props;
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    const percentage = ((item.value / total) * 100).toFixed(1);
    return (
      <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-lg">
        <p className="text-xs text-slate-500 mb-1">{item.name}</p>
        <p className="text-sm font-semibold text-slate-900">{item.value}</p>
        <p className="text-xs text-indigo-600">{percentage}%</p>
      </div>
    );
  }
  return null;
}

function Legend({ data, total, showLegend }: { data: PieDataPoint[]; total: number; showLegend: boolean }) {
  if (!showLegend) return null;
  return (
    <div className="flex flex-col gap-2 ml-4">
      {data.map((item, index) => {
        const color = item.color || defaultColors[index % defaultColors.length];
        const percentage = ((item.value / total) * 100).toFixed(1);
        return (
          <div key={item.name} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: color }} />
            <span className="text-sm text-slate-600 truncate flex-1">{item.name}</span>
            <span className="text-sm font-medium text-slate-900">{percentage}%</span>
          </div>
        );
      })}
    </div>
  );
}

export function DonutChart({ data, innerRadius = 50, outerRadius = 80, showLabels = false, showLegend = true, legendPosition = 'right', height = 200, animated = true, className = '' }: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  return (
    <div className={`flex ${legendPosition === 'right' ? 'flex-row items-center' : 'flex-col'} ${className}`}>
      <div style={{ height, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={innerRadius} outerRadius={outerRadius} paddingAngle={2} dataKey="value" isAnimationActive={animated} labelLine={showLabels}>
              {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color || defaultColors[index % defaultColors.length]} stroke="transparent" />)}
            </Pie>
            <Tooltip content={(props) => CustomTooltip(props, total)} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <Legend data={data} total={total} showLegend={showLegend} />
    </div>
  );
}

export default DonutChart;
