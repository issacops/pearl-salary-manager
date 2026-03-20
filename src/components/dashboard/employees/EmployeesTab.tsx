import React, { useMemo } from 'react';
import { UserPlus, Users, Clock, DollarSign } from 'lucide-react';
import { KPICard } from '../shared/KPICard';
import { ChartContainer } from '../shared/ChartContainer';
import { DataTable } from '../shared/DataTable';
import { StatusBadge } from '../shared/Badge';
import { BarChart } from '../charts/BarChart';
import { DonutChart } from '../charts/DonutChart';
import { Employee, PayrollHistory } from '@/types';
import { formatCurrency, calculateSalaryStats, calculateDesignationDistribution, calculateSalaryBrackets, calculateTenure } from '@/lib/dashboardUtils';

interface EmployeesTabProps {
  employees: Employee[];
  history: PayrollHistory[];
  selectedMonth: number;
  selectedYear: number;
}

export function EmployeesTab({ employees }: EmployeesTabProps) {
  const stats = useMemo(() => {
    const salaryStats = calculateSalaryStats(employees);
    return { totalActive: employees.length, newHiresMTD: 0, avgTenure: 1.5, avgSalary: salaryStats.mean };
  }, [employees]);

  const designationData = useMemo(() => {
    const dist = calculateDesignationDistribution(employees);
    const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];
    return dist.map((d, i) => ({ name: d.designation, value: d.count, color: colors[i % colors.length] }));
  }, [employees]);

  const salaryBracketData = useMemo(() => {
    const brackets = calculateSalaryBrackets(employees);
    return brackets.filter(b => b.count > 0).map(b => ({ name: b.range, value: b.count }));
  }, [employees]);

  const employeeTableData = useMemo(() => {
    return employees.map(emp => {
      const tenure = calculateTenure(emp.date_joined || new Date().toISOString());
      return {
        id: emp.id,
        name: emp.name,
        designation: emp.designation,
        department: emp.department || 'Unassigned',
        salary: emp.target_gross_salary,
        joinDate: emp.date_joined ? new Date(emp.date_joined).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-',
        tenure: tenure.formatted,
        status: 'active' as const
      };
    });
  }, [employees]);

  const tableColumns = [
    { key: 'name', header: 'Employee', sortable: true, render: (_: any, row: any) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
          {row.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
        </div>
        <span className="font-medium text-slate-900">{row.name}</span>
      </div>
    )},
    { key: 'designation', header: 'Designation', sortable: true },
    { key: 'department', header: 'Department', sortable: true },
    { key: 'salary', header: 'Salary', sortable: true, align: 'right' as const, render: (val: any) => (
      <span className="font-medium text-slate-900">{formatCurrency(Number(val), { compact: true })}</span>
    )},
    { key: 'tenure', header: 'Tenure', sortable: true },
    { key: 'status', header: 'Status', render: (_: any, row: any) => <StatusBadge status={row.status} /> }
  ];

  const kpiCards = [
    { title: 'Total Employees', value: stats.totalActive, icon: <Users className="w-5 h-5" />, color: 'primary' as const, subtitle: 'Active employees' },
    { title: 'New Hires', value: stats.newHiresMTD, icon: <UserPlus className="w-5 h-5" />, color: 'success' as const, subtitle: 'This month' },
    { title: 'Avg Tenure', value: `${stats.avgTenure.toFixed(1)}`, suffix: 'yrs', icon: <Clock className="w-5 h-5" />, color: 'info' as const },
    { title: 'Avg Salary', value: Math.round(stats.avgSalary), prefix: '₹', icon: <DollarSign className="w-5 h-5" />, color: 'warning' as const, trend: { value: 2500, percentage: 3.2, direction: 'up' as const, label: 'vs last month' } }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => <KPICard key={card.title} {...card} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Designation Distribution" subtitle="Employee count by role">
          <BarChart data={designationData} xKey="name" yKey="value" color="#6366f1" horizontal height={200} />
        </ChartContainer>

        <ChartContainer title="Salary Brackets" subtitle="Employees grouped by salary range">
          {salaryBracketData.length > 0 ? (
            <div className="h-[200px]"><DonutChart data={salaryBracketData} innerRadius={50} outerRadius={80} height={200} /></div>
          ) : (
            <div className="flex items-center justify-center h-48 text-slate-400">No salary data available</div>
          )}
        </ChartContainer>
      </div>

      <ChartContainer title="Employee Directory" subtitle="Complete list of all employees" noPadding>
        <DataTable
          data={employeeTableData}
          columns={tableColumns}
          pagination
          pageSize={10}
          filterable
          filterPlaceholder="Search employees..."
          emptyMessage="No employees found"
        />
      </ChartContainer>
    </div>
  );
}

export default EmployeesTab;
