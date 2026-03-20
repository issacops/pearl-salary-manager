import React from 'react';

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  loading?: boolean;
  error?: string;
  className?: string;
  noPadding?: boolean;
}

export function ChartContainer({ title, subtitle, children, actions, loading, error, className = '', noPadding = false }: ChartContainerProps) {
  return (
    <div className={`bg-white border border-slate-200 rounded-xl ${className}`}>
      <div className="p-4 pb-3 border-b border-slate-100">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      </div>
      <div className={noPadding ? '' : 'p-4'}>
        {error ? (
          <div className="flex items-center justify-center h-48 text-red-500">{error}</div>
        ) : loading ? (
          <div className="flex items-center justify-center h-48"><div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full" /></div>
        ) : children}
      </div>
    </div>
  );
}

export default ChartContainer;
