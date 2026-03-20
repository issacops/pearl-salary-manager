import React, { useEffect, useState, useId } from 'react';
import { TrendIndicator } from './TrendIndicator';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  prefix?: string;
  suffix?: string;
  trend?: {
    value: number;
    percentage: number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  icon?: React.ReactNode;
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  loading?: boolean;
  sparklineData?: number[];
  className?: string;
}

export function KPICard({
  title, value, subtitle, prefix = '', suffix = '',
  trend, icon, color = 'default', size = 'md',
  onClick, loading = false, sparklineData, className = ''
}: KPICardProps) {
  const [displayValue, setDisplayValue] = useState<number | string>(0);

  useEffect(() => {
    if (typeof value === 'number') {
      let start = 0;
      const duration = 1000;
      const startTime = performance.now();
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        start = value * eased;
        setDisplayValue(Math.round(start));
        if (progress < 1) requestAnimationFrame(animate);
        else setDisplayValue(value);
      };
      requestAnimationFrame(animate);
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  const colorStyles: Record<string, { bg: string; text: string; border: string }> = {
    default: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
    primary: { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-200' },
    success: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
    warning: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200' },
    danger: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
    info: { bg: 'bg-cyan-100', text: 'text-cyan-600', border: 'border-cyan-200' }
  };

  const sizeClasses = {
    sm: { padding: 'p-3', title: 'text-xs', value: 'text-xl', icon: 'w-8 h-8' },
    md: { padding: 'p-4', title: 'text-xs', value: 'text-2xl', icon: 'w-10 h-10' },
    lg: { padding: 'p-6', title: 'text-sm', value: 'text-3xl', icon: 'w-12 h-12' }
  };

  const styles = colorStyles[color] || colorStyles.default;

  if (loading) {
    return (
      <div className={`bg-white border ${styles.border} rounded-xl ${sizeClasses[size].padding}`}>
        <div className="animate-pulse"><div className="h-3 w-20 bg-slate-200 rounded mb-3" /><div className="h-8 w-24 bg-slate-200 rounded mb-2" /><div className="h-3 w-16 bg-slate-200 rounded" /></div>
      </div>
    );
  }

  return (
    <div className={`bg-white border ${styles.border} rounded-xl ${sizeClasses[size].padding} transition-all hover:shadow-md ${onClick ? 'cursor-pointer' : ''} ${className}`}>
      <div className="flex items-start justify-between mb-2">
        <span className={`${sizeClasses[size].title} font-medium text-slate-500 uppercase tracking-wide`}>{title}</span>
        {icon && <div className={`${sizeClasses[size].icon} ${styles.bg} rounded-lg flex items-center justify-center ${styles.text}`}>{icon}</div>}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className={`${sizeClasses[size].value} font-bold text-slate-900 tabular-nums tracking-tight`}>
            {prefix && <span className="text-slate-400 mr-0.5">{prefix}</span>}
            {typeof displayValue === 'number' ? displayValue.toLocaleString('en-IN') : displayValue}
            {suffix && <span className="text-slate-400 ml-0.5">{suffix}</span>}
          </div>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          {trend && <div className="mt-2"><TrendIndicator percentage={trend.percentage} direction={trend.direction} label={trend.label} size="sm" /></div>}
        </div>
      </div>
    </div>
  );
}

export default KPICard;
