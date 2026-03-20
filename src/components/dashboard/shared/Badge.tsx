import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'default';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

export function Badge({ children, variant = 'default', className = '', dot = false }: BadgeProps) {
  const variantClasses = {
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-cyan-100 text-cyan-700',
    default: 'bg-slate-100 text-slate-600'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${variant === 'success' ? 'bg-green-500' : variant === 'warning' ? 'bg-amber-500' : variant === 'danger' ? 'bg-red-500' : variant === 'info' ? 'bg-cyan-500' : 'bg-slate-500'}`} />}
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: 'active' | 'inactive' | 'on_leave' | 'excellent' | 'good' | 'average' | 'poor' }) {
  const config: Record<string, { variant: BadgeVariant; label: string }> = {
    active: { variant: 'success', label: 'Active' },
    inactive: { variant: 'danger', label: 'Inactive' },
    on_leave: { variant: 'warning', label: 'On Leave' },
    excellent: { variant: 'success', label: 'Excellent' },
    good: { variant: 'info', label: 'Good' },
    average: { variant: 'warning', label: 'Average' },
    poor: { variant: 'danger', label: 'Needs Improvement' }
  };
  const { variant, label } = config[status] || { variant: 'default', label: status };
  return <Badge variant={variant} dot>{label}</Badge>;
}

export default Badge;
