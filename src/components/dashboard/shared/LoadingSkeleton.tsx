import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'shimmer' | 'pulse' | 'none';
}

export function LoadingSkeleton({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'shimmer'
}: LoadingSkeletonProps) {
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  const animationClasses = {
    shimmer: 'skeleton',
    pulse: 'animate-pulse bg-[var(--bg-elevated)]',
    none: ''
  };

  const style: React.CSSProperties = {
    width: width ?? (variant === 'text' ? '100%' : undefined),
    height: height ?? (variant === 'text' ? '1rem' : undefined)
  };

  return (
    <div 
      className={`${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
}

export function KPICardSkeleton() {
  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--glass-border)] rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <LoadingSkeleton variant="text" width="60%" className="h-3" />
        <LoadingSkeleton variant="circular" width={40} height={40} />
      </div>
      <LoadingSkeleton variant="text" width="40%" className="h-8 mb-2" />
      <LoadingSkeleton variant="text" width="30%" className="h-3" />
    </div>
  );
}

export function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--glass-border)] rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <LoadingSkeleton variant="text" width="40%" className="h-5" />
        <LoadingSkeleton variant="rectangular" width={100} height={32} />
      </div>
      <LoadingSkeleton variant="rectangular" width="100%" height={height - 80} />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--glass-border)] rounded-xl overflow-hidden">
      <div className="p-4 border-b border-[var(--glass-border)]">
        <LoadingSkeleton variant="text" width="30%" className="h-5" />
      </div>
      <div className="divide-y divide-[var(--glass-border)]">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex gap-4">
            <LoadingSkeleton variant="circular" width={40} height={40} />
            <div className="flex-1 space-y-2">
              <LoadingSkeleton variant="text" width="30%" className="h-4" />
              <LoadingSkeleton variant="text" width="20%" className="h-3" />
            </div>
            <LoadingSkeleton variant="text" width="15%" className="h-4" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default LoadingSkeleton;
