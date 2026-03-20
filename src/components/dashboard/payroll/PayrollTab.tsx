import React, { useMemo } from 'react';
import { DollarSign, TrendingDown, TrendingUp, PieChart } from 'lucide-react';
import { KPICard } from '../shared/KPICard';
import { ChartContainer } from '../shared/ChartContainer';
import { BarChart } from '../charts/BarChart';
import { Employee, PayrollHistory, Settings } from '@/types';
import { formatCurrency, calculateTotalPayroll, calculateEarningsBreakdown, calculateDeductionsBreakdown, calculateDepartmentDistribution } from '@/lib/dashboardUtils';

interface PayrollTabProps {
  employees: Employee[];
  history: PayrollHistory[];
  settings: Settings;
  selectedMonth: number;
  selectedYear: number;
}

export function PayrollTab({ employees }: PayrollTabProps) {
  const stats = useMemo(() => {
    const totalGross = calculateTotalPayroll(employees);
    const earnings = calculateEarningsBreakdown(employees);
    const deductions = calculateDeductionsBreakdown(employees);
    const netPay = totalGross - deductions.total;
    return { totalGross, totalEarnings: earnings.total, totalDeductions: deductions.total, netPay, earningsBreakdown: earnings, deductionsBreakdown: deductions };
  }, [employees]);

  const departmentCostData = useMemo(() => {
    const dist = calculateDepartmentDistribution(employees);
    return dist.map(d => ({ name: d.department || 'Other', value: d.totalSalary }));
  }, [employees]);

  const earningsChartData = [
    { name: 'Basic', value: stats.earningsBreakdown.basic },
    { name: 'HRA', value: stats.earningsBreakdown.hra },
    { name: 'Conveyance', value: stats.earningsBreakdown.conveyance },
    { name: 'Medical', value: stats.earningsBreakdown.medical },
    { name: 'Special', value: stats.earningsBreakdown.specialAllowance }
  ].filter(d => d.value > 0);

  const deductionsChartData = [
    { name: 'PF', value: stats.deductionsBreakdown.pf },
    { name: 'Insurance', value: stats.deductionsBreakdown.insurance },
    { name: 'Prof Tax', value: stats.deductionsBreakdown.professionalTax },
    { name: 'Income Tax', value: stats.deductionsBreakdown.incomeTax }
  ].filter(d => d.value > 0);

  const kpiCards = [
    { title: 'Total Gross', value: Math.round(stats.totalGross), prefix: '₹', icon: <DollarSign className="w-5 h-5" />, color: 'primary' as const, trend: { value: 12000, percentage: 5.0, direction: 'up' as const, label: 'vs last month' } },
    { title: 'Total Earnings', value: Math.round(stats.totalEarnings), prefix: '₹', icon: <TrendingUp className="w-5 h-5" />, color: 'success' as const, subtitle: 'Including all allowances' },
    { title: 'Total Deductions', value: Math.round(stats.totalDeductions), prefix: '₹', icon: <TrendingDown className="w-5 h-5" />, color: 'danger' as const, subtitle: 'Taxes and deductions' },
    { title: 'Net Pay', value: Math.round(stats.netPay), prefix: '₹', icon: <PieChart className="w-5 h-5" />, color: 'info' as const, trend: { value: 10000, percentage: 4.8, direction: 'up' as const, label: 'vs last month' } }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => <KPICard key={card.title} {...card} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Earnings Breakdown" subtitle="Component-wise earnings">
          <BarChart data={earningsChartData} xKey="name" yKey="value" color="#10b981" horizontal height={200} />
        </ChartContainer>

        <ChartContainer title="Deductions Breakdown" subtitle="Component-wise deductions">
          <BarChart data={deductionsChartData} xKey="name" yKey="value" color="#ef4444" horizontal height={200} />
        </ChartContainer>
      </div>

      <ChartContainer title="Cost by Department" subtitle="Monthly payroll cost distribution across departments">
        <BarChart data={departmentCostData} xKey="name" yKey="value" color="#8b5cf6" height={200} />
      </ChartContainer>
    </div>
  );
}

export default PayrollTab;
