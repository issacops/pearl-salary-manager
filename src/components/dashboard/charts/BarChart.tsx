import React from 'react';
import { BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

interface ChartDataPoint { [key: string]: string | number; }
interface BarChartProps { data: ChartDataPoint[]; xKey: string; yKey: string; color?: string; colors?: string[]; horizontal?: boolean; showValues?: boolean; height?: number; animated?: boolean; className?: string; }
interface TooltipPayload { value: number | string; }
interface CustomTooltipProps { active?: boolean; payload?: TooltipPayload[]; label?: string; }

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-lg">
        <p className="text-xs text-slate-500 mb-1">{label}</p>
        <p className="text-sm font-semibold text-slate-900">
          {typeof payload[0].value === 'number' ? `₹${payload[0].value.toLocaleString('en-IN')}` : payload[0].value}
        </p>
      </div>
    );
  }
  return null;
}

function getBarColorFn(index: number, colors: string[] | undefined, color: string): string {
  if (colors) return colors[index % colors.length];
  if (Array.isArray(color)) return color[index % color.length];
  return color;
}

export function BarChart({ data, xKey, yKey, color = '#6366f1', colors, horizontal = false, showValues = false, height = 200, animated = true, className = '' }: BarChartProps) {
  return (
    <div className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBar data={data} layout={horizontal ? 'vertical' : 'horizontal'} margin={{ top: 10, right: 10, left: horizontal ? 10 : 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" horizontal={!horizontal} vertical={horizontal} />
          {horizontal ? (
            <>
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={v => v >= 100000 ? `${(v / 100000).toFixed(1)}L` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)} />
              <YAxis type="category" dataKey={xKey} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} width={100} />
            </>
          ) : (
            <>
              <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={v => v >= 100000 ? `${(v / 100000).toFixed(1)}L` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)} dx={-10} />
            </>
          )}
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey={yKey} radius={[4, 4, 0, 0]} maxBarSize={60} isAnimationActive={animated}>
            {data.map((_, index) => <Cell key={`cell-${index}`} fill={getBarColorFn(index, colors, color)} />)}
            {showValues && <LabelList dataKey={yKey} position="top" style={{ fill: '#64748b', fontSize: 11 }} />}
          </Bar>
        </RechartsBar>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChart;
