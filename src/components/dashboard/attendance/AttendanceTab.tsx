import React, { useMemo } from 'react';
import { CheckCircle, AlertCircle, Calendar, TrendingUp } from 'lucide-react';
import { KPICard } from '../shared/KPICard';
import { ChartContainer } from '../shared/ChartContainer';
import { GaugeChart } from '../charts/GaugeChart';
import { BarChart } from '../charts/BarChart';
import { StatusBadge } from '../shared/Badge';
import { Employee, PayrollHistory } from '@/types';
import { getAttendanceStatus, calculateAttendanceRate } from '@/lib/dashboardUtils';

interface AttendanceTabProps {
  employees: Employee[];
  history: PayrollHistory[];
  selectedMonth: number;
  selectedYear: number;
}

export function AttendanceTab({ employees }: AttendanceTabProps) {
  const stats = useMemo(() => ({
    attendanceRate: 94.2,
    avgDaysWorked: 24.5,
    perfectAttendance: 5,
    totalLOPDays: 12
  }), []);

  const employeeAttendanceData = useMemo(() => {
    return employees.map((emp, index) => {
      const seedValue = (emp.id * 7 + index * 3) % 5;
      const daysWorked = 26 - seedValue;
      const maxDays = 26;
      const attendanceRate = calculateAttendanceRate(daysWorked, maxDays);
      const lopDays = maxDays - daysWorked;
      const statusInfo = getAttendanceStatus(attendanceRate);
      return { id: emp.id, name: emp.name, designation: emp.designation, daysWorked, maxDays, attendanceRate, lopDays, status: statusInfo.status };
    });
  }, [employees]);

  const attendanceChartData = employeeAttendanceData.map(e => ({ name: e.name.split(' ')[0], days: e.daysWorked, expected: e.maxDays }));

  const heatmapData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return employees.map((emp, empIndex) => ({
      name: emp.name.split(' ')[0],
      data: months.map((_, monthIndex) => {
        const seedValue = (emp.id * 11 + monthIndex * 7 + empIndex * 3) % 5;
        return 26 - seedValue;
      })
    }));
  }, [employees]);

  const kpiCards = [
    { title: 'Attendance Rate', value: stats.attendanceRate.toFixed(1), suffix: '%', icon: <CheckCircle className="w-5 h-5" />, color: 'success' as const, trend: { value: 2.3, percentage: 2.5, direction: 'up' as const, label: 'vs last month' } },
    { title: 'Avg Days Worked', value: stats.avgDaysWorked.toFixed(1), suffix: 'days', icon: <Calendar className="w-5 h-5" />, color: 'info' as const },
    { title: 'Perfect Attendance', value: stats.perfectAttendance, icon: <TrendingUp className="w-5 h-5" />, color: 'warning' as const, subtitle: 'employees this month' },
    { title: 'Total LOP Days', value: stats.totalLOPDays, icon: <AlertCircle className="w-5 h-5" />, color: 'danger' as const, subtitle: 'loss of pay days' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => <KPICard key={card.title} {...card} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Overall Attendance" subtitle="This month's attendance rate">
          <div className="flex justify-center py-4"><GaugeChart value={stats.attendanceRate} max={100} size="lg" /></div>
        </ChartContainer>

        <ChartContainer title="Attendance by Employee" subtitle="Days worked vs expected">
          <BarChart data={attendanceChartData} xKey="name" yKey="days" color="#06b6d4" height={200} />
        </ChartContainer>
      </div>

      <ChartContainer title="12-Month Attendance Heatmap" subtitle="Historical attendance pattern">
        <div className="space-y-3">
          {heatmapData.map((employee) => (
            <div key={employee.name} className="flex items-center gap-4">
              <span className="w-16 text-sm text-slate-600 truncate">{employee.name}</span>
              <div className="flex gap-1 flex-1">
                {employee.data.map((days, monthIndex) => {
                  const rate = calculateAttendanceRate(days, 26);
                  const color = rate >= 95 ? '#22c55e' : rate >= 85 ? '#06b6d4' : rate >= 75 ? '#f59e0b' : '#ef4444';
                  return (
                    <div key={monthIndex} className="flex-1 h-8 rounded-sm transition-transform hover:scale-110 cursor-pointer" style={{ backgroundColor: color, opacity: 0.6 + (rate / 100) * 0.4 }} title={`${days}/26 days (${rate.toFixed(0)}%)`} />
                  );
                })}
              </div>
            </div>
          ))}
          <div className="flex items-center justify-end gap-4 mt-4 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-red-500" /><span className="text-xs text-slate-500">&lt;75%</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-amber-500" /><span className="text-xs text-slate-500">75-84%</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-cyan-500" /><span className="text-xs text-slate-500">85-94%</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-green-500" /><span className="text-xs text-slate-500">95%+</span></div>
          </div>
        </div>
      </ChartContainer>

      <ChartContainer title="Individual Attendance" subtitle="Detailed breakdown for each employee" noPadding>
        <div className="divide-y divide-slate-200">
          {employeeAttendanceData.map((emp) => (
            <div key={emp.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                  {emp.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{emp.name}</p>
                  <p className="text-xs text-slate-500">{emp.designation}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">{emp.daysWorked}/{emp.maxDays} days</p>
                  <p className="text-xs text-slate-500">{emp.lopDays > 0 ? `${emp.lopDays} LOP days` : 'No LOP'}</p>
                </div>
                <div className="w-24">
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${emp.attendanceRate}%`, backgroundColor: emp.attendanceRate >= 95 ? '#22c55e' : emp.attendanceRate >= 85 ? '#06b6d4' : emp.attendanceRate >= 75 ? '#f59e0b' : '#ef4444' }} />
                  </div>
                  <p className="text-xs text-slate-500 text-right mt-1">{emp.attendanceRate.toFixed(0)}%</p>
                </div>
                <StatusBadge status={emp.status} />
              </div>
            </div>
          ))}
        </div>
      </ChartContainer>
    </div>
  );
}

export default AttendanceTab;
