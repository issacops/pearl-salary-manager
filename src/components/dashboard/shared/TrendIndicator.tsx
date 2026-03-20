import React from 'react';

interface TrendIndicatorProps {
  value?: number;
  percentage: number;
  direction: 'up' | 'down' | 'neutral';
  label?: string;
  size?: 'sm' | 'md';
  showPercentage?: boolean;
}

export function TrendIndicator({ percentage, direction, label, size = 'md', showPercentage = true }: TrendIndicatorProps) {
  const sizeClasses = size === 'sm' ? 'text-xs' : 'text-sm';

  const colors = {
    up: 'text-green-600 bg-green-100',
    down: 'text-red-600 bg-red-100',
    neutral: 'text-slate-500 bg-slate-100'
  };

  return (
    <div className={`flex items-center gap-1.5 ${sizeClasses}`}>
      <span className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded ${colors[direction]}`}>
        {direction === 'up' && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>}
        {direction === 'down' && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>}
        {direction === 'neutral' && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" /></svg>}
        {showPercentage && <span>{Math.abs(percentage).toFixed(1)}%</span>}
      </span>
      {label && <span className="text-slate-500">{label}</span>}
    </div>
  );
}

export default TrendIndicator;
