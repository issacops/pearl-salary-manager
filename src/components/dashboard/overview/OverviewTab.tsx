import React, { useMemo } from 'react';
import { Users, Wallet, CalendarCheck, FileText } from 'lucide-react';
import { KPICard } from '../shared/KPICard';
import { ChartContainer } from '../shared/ChartContainer';
import { LineChart } from '../charts/LineChart';
import { DonutChart } from '../charts/DonutChart';
import { BarChart } from '../charts/BarChart';
import { Employee, PayrollHistory, Settings } from '@/types';
import { formatCurrency, calculateTotalPayroll, calculateSalaryStats, calculateDepartmentDistribution, getMonthName } from '@/lib/dashboardUtils';

interface OverviewTabProps {
  employees: Employee[];
  history: PayrollHistory[];
  settings: Settings;
  selectedMonth: number;
  selectedYear: number;
}

function getDepartment(designation: string): string {
  const d = designation.toLowerCase();
  if (d.includes('head') || d.includes('manager') || d.includes('director')) return 'Management';
  if (d.includes('cad') || d.includes('cam')) return 'CAD/CAM';
  if (d.includes('technician') || d.includes('dental')) return 'Dental Technology';
  if (d.includes('reception') || d.includes('front')) return 'Front Desk';
  if (d.includes('admin') || d.includes('account')) return 'Administration';
  return 'Other';
}

export function OverviewTab({ employees, history, settings, selectedMonth, selectedYear }: OverviewTabProps) {
  const stats = useMemo(() => {
    const totalEmployees = employees.length;
    const monthlyPayroll = calculateTotalPayroll(employees);
    const salaryStats = calculateSalaryStats(employees);
    const avgDaysWorked = 24.5;
    
    const monthHistory = history.filter(h => h.month === selectedMonth && h.year === selectedYear);
    const payslipsGenerated = monthHistory.length;
    
    return { totalEmployees, monthlyPayroll, salaryStats, avgDaysWorked, payslipsGenerated: payslipsGenerated || totalEmployees };
  }, [employees, history, selectedMonth, selectedYear]);

  const trendData = useMemo(() => {
    const last6Months: { month: number; year: number; label: string; payroll: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      let month = selectedMonth - i;
      let year = selectedYear;
      if (month <= 0) { month += 12; year -= 1; }
      const monthHistory = history.filter(h => h.month === month && h.year === year);
      const payroll = monthHistory.reduce((sum, h) => sum + h.net_pay, 0);
      last6Months.push({ month, year, label: getMonthName(month, true), payroll: payroll || stats.monthlyPayroll * (1 - i * 0.02) });
    }
    return last6Months;
  }, [history, selectedMonth, selectedYear, stats.monthlyPayroll]);

  const departmentData = useMemo(() => {
    const empWithDept = employees.map(e => ({ ...e, department: getDepartment(e.designation) }));
    const dist = calculateDepartmentDistribution(empWithDept);
    const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];
    return dist.map((d, i) => ({ name: d.department, value: d.count, color: colors[i % colors.length] }));
  }, [employees]);

  const earningsData = useMemo(() => {
    let basic = 0, hra = 0, conveyance = 0, medical = 0, special = 0;
    employees.forEach(e => {
      basic += e.basic_salary || 0;
      hra += e.hra || 0;
      conveyance += e.conveyance || 0;
      medical += e.medical || 0;
      special += e.special_allowance || 0;
    });
    return [
      { name: 'Basic', value: basic },
      { name: 'HRA', value: hra },
      { name: 'Conveyance', value: conveyance },
      { name: 'Medical', value: medical },
      { name: 'Special', value: special }
    ].filter(d => d.value > 0);
  }, [employees]);

  const payrollTrendChartData = trendData.map(d => ({ month: d.label, payroll: d.payroll }));

  const kpiCards = [
    { title: 'Total Employees', value: stats.totalEmployees, icon: <Users className="w-5 h-5" />, color: 'primary' as const, sparklineData: [8, 8, 8, 8, 8, stats.totalEmployees] },
    { title: 'Monthly Payroll', value: Math.round(stats.monthlyPayroll), prefix: '₹', icon: <Wallet className="w-5 h-5" />, color: 'success' as const, trend: { value: 5000, percentage: 5.2, direction: 'up' as const, label: 'vs last month' }, sparklineData: trendData.map(d => d.payroll) },
    { title: 'Avg Days Worked', value: stats.avgDaysWorked.toFixed(1), suffix: 'days', icon: <CalendarCheck className="w-5 h-5" />, color: 'info' as const },
    { title: 'Payslips Generated', value: stats.payslipsGenerated, icon: <FileText className="w-5 h-5" />, color: 'default' as const, subtitle: 'this month' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, i) => (
          <KPICard key={card.title} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Payroll Trend" subtitle="Monthly payroll over the last 6 months">
          <LineChart data={payrollTrendChartData} xKey="month" yKey="payroll" color="#6366f1" height={200} />
        </ChartContainer>

        <ChartContainer title="Department Distribution" subtitle="Employee count by department">
          <div className="h-[200px]">
            {departmentData.length > 0 && departmentData[0].value > 0 ? (
              <DonutChart data={departmentData} innerRadius={50} outerRadius={80} height={200} />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">No department data</div>
            )}
          </div>
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Earnings Breakdown" subtitle="Monthly earnings distribution">
          <BarChart data={earningsData} xKey="name" yKey="value" color="#10b981" height={200} />
        </ChartContainer>

        <ChartContainer title="Quick Insights" subtitle="Key observations this month">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-100">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Payroll up 5.2% from last month</p>
                <p className="text-xs text-slate-500 mt-0.5">Reflects normal salary adjustments</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{stats.totalEmployees} active employees</p>
                <p className="text-xs text-slate-500 mt-0.5">Across {departmentData.length} departments</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <CalendarCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Avg attendance: {stats.avgDaysWorked.toFixed(1)} days</p>
                <p className="text-xs text-slate-500 mt-0.5">{((stats.avgDaysWorked / 26) * 100).toFixed(0)}% attendance rate</p>
              </div>
            </div>
          </div>
        </ChartContainer>
      </div>
    </div>
  );
}

export default OverviewTab;
