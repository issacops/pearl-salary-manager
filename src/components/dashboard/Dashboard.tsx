import React, { useState, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import { OverviewTab } from './overview/OverviewTab';
import { EmployeesTab } from './employees/EmployeesTab';
import { PayrollTab } from './payroll/PayrollTab';
import { AttendanceTab } from './attendance/AttendanceTab';
import { DashboardTab } from '@/types/dashboard';
import { getEmployees, getHistory, getSettings } from '@/lib/store';

const TABS: { id: DashboardTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'employees', label: 'Employees' },
  { id: 'payroll', label: 'Payroll' },
  { id: 'attendance', label: 'Attendance' }
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface DashboardProps {
  className?: string;
  selectedMonth: number;
  selectedYear: number;
  onMonthYearChange: (month: number, year: number) => void;
}

export function Dashboard({ className = '', selectedMonth, selectedYear, onMonthYearChange }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [refreshKey, setRefreshKey] = useState(0);

  const data = useMemo(() => {
    return {
      employees: getEmployees(),
      history: getHistory(),
      settings: getSettings()
    };
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(k => k + 1);
  };

  const renderTab = () => {
    const tabProps = {
      employees: data.employees,
      history: data.history,
      settings: data.settings,
      selectedMonth,
      selectedYear
    };

    switch (activeTab) {
      case 'overview':
        return <OverviewTab {...tabProps} />;
      case 'employees':
        return <EmployeesTab {...tabProps} />;
      case 'payroll':
        return <PayrollTab {...tabProps} />;
      case 'attendance':
        return <AttendanceTab {...tabProps} />;
      default:
        return null;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm border border-slate-200">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => {
              console.log('DEBUG: Dashboard month selector changed to:', e.target.value, 'selectedYear:', selectedYear);
              onMonthYearChange(Number(e.target.value), selectedYear);
            }}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {MONTHS.map((month, index) => (
              <option key={month} value={index + 1}>{month}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => onMonthYearChange(selectedMonth, Number(e.target.value))}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {[2024, 2025, 2026].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh data"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div key={refreshKey}>
        {renderTab()}
      </div>
    </div>
  );
}

export default Dashboard;
