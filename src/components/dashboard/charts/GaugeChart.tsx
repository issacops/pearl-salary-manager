import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface GaugeChartProps { value: number; max?: number; min?: number; color?: string; showValue?: boolean; label?: string; size?: 'sm' | 'md' | 'lg'; className?: string; }

export function GaugeChart({ value, max = 100, min = 0, color, showValue = true, label, size = 'md', className = '' }: GaugeChartProps) {
  const clampedValue = Math.min(Math.max(value, min), max);
  const percentage = ((clampedValue - min) / (max - min)) * 100;

  const sizeConfig = { sm: { width: 120, height: 80, outerRadius: 50, innerRadius: 35, fontSize: 'text-lg' }, md: { width: 160, height: 100, outerRadius: 70, innerRadius: 50, fontSize: 'text-2xl' }, lg: { width: 200, height: 130, outerRadius: 90, innerRadius: 65, fontSize: 'text-3xl' } };
  const { width, height, outerRadius, innerRadius, fontSize } = sizeConfig[size];

  const getColor = () => {
    if (color) return color;
    if (percentage >= 95) return '#22c55e';
    if (percentage >= 85) return '#06b6d4';
    if (percentage >= 75) return '#f59e0b';
    return '#ef4444';
  };

  const gaugeColor = getColor();
  const data = [{ value: percentage }, { value: 100 - percentage }];

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      <div style={{ width, height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="70%" startAngle={180} endAngle={0} innerRadius={innerRadius} outerRadius={outerRadius} paddingAngle={0} dataKey="value" isAnimationActive={true}>
              <Cell key="gauge" fill={gaugeColor} stroke="transparent" />
              <Cell key="empty" fill="#e2e8f0" stroke="transparent" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2" style={{ height }}>
          {showValue && <span className={`${fontSize} font-bold text-slate-900 tabular-nums`}>{percentage.toFixed(1)}%</span>}
          {label && <span className="text-xs text-slate-500">{label}</span>}
        </div>
      </div>
      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /><span>95-100%</span></div>
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-500" /><span>85-94%</span></div>
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /><span>75-84%</span></div>
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /><span>&lt;75%</span></div>
      </div>
    </div>
  );
}

export default GaugeChart;
