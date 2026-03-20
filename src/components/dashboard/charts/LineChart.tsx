import React, { useId } from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface ChartDataPoint { [key: string]: string | number; }
interface LineChartProps { data: ChartDataPoint[]; xKey: string; yKey: string; color?: string; gradient?: boolean; showDots?: boolean; showGrid?: boolean; height?: number; animated?: boolean; className?: string; }
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

export function LineChart({ data, xKey, yKey, color = '#6366f1', gradient = true, showDots = true, showGrid = true, height = 200, animated = true, className = '' }: LineChartProps) {
  const gradientId = useId();
  return (
    <div className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.2} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          {showGrid && <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" vertical={false} />}
          <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={v => v >= 100000 ? `${(v / 100000).toFixed(1)}L` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)} dx={-10} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey={yKey} stroke={color} strokeWidth={2} fill={`url(#${gradientId})`} dot={showDots ? { fill: color, strokeWidth: 0, r: 4 } : false} activeDot={{ fill: color, strokeWidth: 2, stroke: '#fff', r: 6 }} isAnimationActive={animated} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LineChart;
