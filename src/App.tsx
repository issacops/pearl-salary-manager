import { useState, useEffect, useCallback } from 'react';
import { Users, FileText, History, Save, Calculator, Download, X, Plus, Trash2, Settings as SettingsIcon, RefreshCw, LayoutDashboard } from 'lucide-react';
import { Employee, Settings as SettingsType, PayrollHistory, CustomItem, DEFAULT_SETTINGS } from '@/types';
import {
  initializeStore,
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getHistory,
  getSettings,
  updateSettings,
  generatePayrollHistory,
  exportAllData,
  importData
} from '@/lib/store';
import {
  calculateSalary,
  getMaxWorkableDays,
  getAttendanceInfo,
  CalculationMethod,
  MONTH_NAMES
} from '@/lib/payroll';
import { generatePayslipPDF } from '@/lib/pdf';
import { Dashboard } from '@/components/dashboard/Dashboard';

type Tab = 'employees' | 'payroll' | 'history' | 'settings' | 'dashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('payroll');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [history, setHistory] = useState<PayrollHistory[]>([]);
  const [settings, setSettings] = useState<SettingsType>(DEFAULT_SETTINGS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  // Payroll Form State
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [calculationMethod, setCalculationMethod] = useState<CalculationMethod>('actual_workable_days');
  const [daysWorked, setDaysWorked] = useState<Record<number, string>>({});

  const loadData = useCallback(() => {
    initializeStore();
    setEmployees(getEmployees());
    setHistory(getHistory());
    setSettings(getSettings());
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Initialize days worked for employees
  useEffect(() => {
    const initialDays: Record<number, string> = {};
    employees.forEach(emp => {
      if (daysWorked[emp.id] === undefined) {
        initialDays[emp.id] = '26';
      }
    });
    if (Object.keys(initialDays).length > 0) {
      setDaysWorked(prev => ({ ...prev, ...initialDays }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employees]);

  const handleSettingsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      updateSettings(settings);
      alert('Settings saved successfully');
    } catch {
      alert('Failed to save settings');
    }
  };

  const handleEmployeeSave = async (emp: Omit<Employee, 'id'> & { id?: number }) => {
    try {
      if (emp.id === 0 || emp.id === undefined) {
        // Create
        createEmployee(emp as Omit<Employee, 'id'>);
        alert('Employee added successfully');
      } else {
        // Update
        updateEmployee(emp.id, emp);
        alert('Employee updated successfully');
      }
      setIsModalOpen(false);
      setEditingEmployee(null);
      setEmployees(getEmployees());
    } catch {
      alert('Failed to save employee');
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      deleteEmployee(id);
      alert('Employee deleted successfully');
      setEmployees(getEmployees());
    } catch {
      alert('Failed to delete employee');
    }
  };

  const handleGeneratePayroll = async () => {
    if (employees.length === 0) {
      alert('No employees to process');
      return;
    }

    setGenerating(true);
    setProgress({ current: 0, total: employees.length });

    try {
      const { days: maxWorkableDays } = getMaxWorkableDays(selectedMonth, selectedYear, calculationMethod);
      const historyEntries: Omit<PayrollHistory, 'id'>[] = [];

      for (let i = 0; i < employees.length; i++) {
        const emp = employees[i];
        const actualDaysWorked = parseFloat(daysWorked[emp.id] || '0') || 0;
        const salary = calculateSalary(emp, actualDaysWorked, maxWorkableDays);

        // Store minimal data - PDF will be regenerated on download
        historyEntries.push({
          employee_id: emp.id,
          name: emp.name,
          designation: emp.designation,
          month: selectedMonth,
          year: selectedYear,
          actual_days_worked: actualDaysWorked,
          net_pay: salary.netPay,
          pdf_path: '', // PDF regenerated on demand
          calculation_method: calculationMethod
        });

        setProgress({ current: i + 1, total: employees.length });
      }

      // Save to history
      generatePayrollHistory(historyEntries);
      setHistory(getHistory());
      
      alert(`Successfully generated payslips for ${historyEntries.length} employees!`);
      setActiveTab('history');
    } catch (error) {
      console.error('Error generating payroll:', error);
      alert('Failed to generate payroll: ' + (error as Error).message);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPayslip = async (entry: PayrollHistory) => {
    // Find the employee
    const emp = employees.find(e => e.id === entry.employee_id);
    if (!emp) {
      alert('Employee not found');
      return;
    }

    try {
      // Get calculation method and max workable days
      const method = entry.calculation_method || 'actual_workable_days';
      const { days: maxWorkableDays } = getMaxWorkableDays(entry.month, entry.year, method);
      
      // Calculate salary
      const salary = calculateSalary(emp, entry.actual_days_worked, maxWorkableDays);
      const attendance = getAttendanceInfo(entry.actual_days_worked, maxWorkableDays);

      // Generate PDF on demand
      const pdfDataUrl = await generatePayslipPDF({
        employee: emp,
        settings,
        month: entry.month,
        year: entry.year,
        salary,
        attendance
      });

      // Trigger download
      const link = document.createElement('a');
      link.href = pdfDataUrl;
      link.download = `Payslip_${entry.name.replace(/\s+/g, '_')}_${MONTH_NAMES[entry.month - 1]}_${entry.year}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating payslip:', error);
      alert('Failed to generate payslip: ' + (error as Error).message);
    }
  };

  const handleExportData = () => {
    const data = exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pearl-dental-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        importData(data);
        loadData();
        alert('Data imported successfully!');
      } catch {
        alert('Failed to import data. Please check the file format.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-900 to-indigo-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                <span className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🦷</span>
                </span>
                Pearl Dental Solutions
              </h1>
              <p className="text-indigo-200 text-sm mt-1">Salary & Payroll Management System</p>
            </div>
            <nav className="flex flex-wrap gap-1 bg-indigo-800/50 p-1 rounded-lg">
              {[
                { id: 'payroll', icon: Calculator, label: 'Process Payroll' },
                { id: 'employees', icon: Users, label: 'Employees' },
                { id: 'history', icon: History, label: 'History' },
                { id: 'settings', icon: SettingsIcon, label: 'Settings' },
                { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-white text-indigo-900 shadow-md'
                      : 'text-indigo-100 hover:bg-indigo-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <Dashboard />
        )}

        {/* Payroll Processing Tab */}
        {activeTab === 'payroll' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-indigo-600" />
                Payroll Period
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Month</label>
                  <select 
                    value={selectedMonth} 
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border bg-white"
                  >
                    {MONTH_NAMES.map((name, i) => (
                      <option key={i + 1} value={i + 1}>{name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
                  <input 
                    type="number" 
                    value={selectedYear} 
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    min={2000}
                    max={2100}
                    className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Calculation Method</label>
                  <select 
                    value={calculationMethod} 
                    onChange={(e) => setCalculationMethod(e.target.value as CalculationMethod)}
                    className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border bg-white"
                  >
                    <option value="actual_workable_days">Actual Workable Days (Excl. Sundays)</option>
                    <option value="fixed_26_days">Fixed 26 Days</option>
                    <option value="fixed_30_days">Fixed 30 Days</option>
                    <option value="total_calendar_days">Total Calendar Days</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Employee Attendance</h2>
                  <p className="text-sm text-slate-500 mt-1">Enter days worked for each employee</p>
                </div>
                <button 
                  onClick={handleGeneratePayroll}
                  disabled={generating || employees.length === 0}
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
                >
                  {generating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Generating {progress.current}/{progress.total}...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Calculate & Generate Payslips
                    </>
                  )}
                </button>
              </div>
              
              {employees.length === 0 ? (
                <div className="p-12 text-center">
                  <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 mb-4">No employees found</p>
                  <button 
                    onClick={() => setActiveTab('employees')}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Add Employees →
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wider">
                        <th className="p-4 font-semibold">Employee</th>
                        <th className="p-4 font-semibold">Designation</th>
                        <th className="p-4 font-semibold text-right">Target Gross</th>
                        <th className="p-4 font-semibold text-right">Days Worked</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {employees.map(emp => (
                        <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4">
                            <div className="font-medium text-slate-900">{emp.name}</div>
                            <div className="text-xs text-slate-500">{emp.designation}</div>
                          </td>
                          <td className="p-4 text-slate-600">{emp.designation}</td>
                          <td className="p-4 text-slate-600 text-right">₹{emp.target_gross_salary.toLocaleString()}</td>
                          <td className="p-4">
                            <input 
                              type="number" 
                              step="0.5"
                              min="0"
                              max="31"
                              value={daysWorked[emp.id] || ''}
                              onChange={(e) => setDaysWorked({...daysWorked, [emp.id]: e.target.value})}
                              placeholder="Days"
                              className="w-24 rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border text-right ml-auto block"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Employees Tab */}
        {activeTab === 'employees' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-indigo-600" />
                  Employee Management
                </h2>
                <p className="text-sm text-slate-500 mt-1">Manage employee details, salary structures, and allowances.</p>
              </div>
              <button 
                onClick={() => { setEditingEmployee(null); setIsModalOpen(true); }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-md"
              >
                <Plus className="w-4 h-4" /> Add Employee
              </button>
            </div>
            
            {employees.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 mb-4">No employees yet</p>
                <button 
                  onClick={() => { setEditingEmployee(null); setIsModalOpen(true); }}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Add your first employee →
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
                      <th className="p-4 font-semibold">Name</th>
                      <th className="p-4 font-semibold">Designation</th>
                      <th className="p-4 font-semibold text-right">Target Gross</th>
                      <th className="p-4 font-semibold text-right">Basic</th>
                      <th className="p-4 font-semibold text-right">HRA</th>
                      <th className="p-4 font-semibold text-right">Conveyance</th>
                      <th className="p-4 font-semibold text-right">Medical</th>
                      <th className="p-4 font-semibold text-right">Special</th>
                      <th className="p-4 font-semibold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm">
                    {employees.map(emp => (
                      <tr key={emp.id} className="hover:bg-slate-50">
                        <td className="p-4 font-medium text-slate-900">{emp.name}</td>
                        <td className="p-4 text-slate-600">{emp.designation}</td>
                        <td className="p-4 text-slate-600 text-right">₹{emp.target_gross_salary.toLocaleString()}</td>
                        <td className="p-4 text-slate-600 text-right">₹{emp.basic_salary.toLocaleString()}</td>
                        <td className="p-4 text-slate-600 text-right">₹{emp.hra.toLocaleString()}</td>
                        <td className="p-4 text-slate-600 text-right">₹{emp.conveyance.toLocaleString()}</td>
                        <td className="p-4 text-slate-600 text-right">₹{emp.medical.toLocaleString()}</td>
                        <td className={`p-4 text-right font-medium ${emp.special_allowance < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                          ₹{emp.special_allowance.toLocaleString()}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button 
                              onClick={() => { setEditingEmployee(emp); setIsModalOpen(true); }}
                              className="text-indigo-600 hover:text-indigo-900 text-sm font-medium px-3 py-1 rounded hover:bg-indigo-50 transition-colors"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteEmployee(emp.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                <History className="w-5 h-5 mr-2 text-indigo-600" />
                Payroll History
              </h2>
              {history.length > 0 && (
                <p className="text-sm text-slate-500 mt-1">{history.length} payslips generated</p>
              )}
            </div>
            
            {history.length === 0 ? (
              <div className="p-12 text-center">
                <History className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 mb-4">No payroll history yet</p>
                <button 
                  onClick={() => setActiveTab('payroll')}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Generate your first payroll →
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wider">
                      <th className="p-4 font-semibold">Period</th>
                      <th className="p-4 font-semibold">Employee</th>
                      <th className="p-4 font-semibold text-right">Days Worked</th>
                      <th className="p-4 font-semibold text-right">Net Pay</th>
                      <th className="p-4 font-semibold text-center">Payslip</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {history.map(record => (
                      <tr key={record.id} className="hover:bg-slate-50">
                        <td className="p-4 text-slate-900 font-medium">
                          {MONTH_NAMES[record.month - 1]} {record.year}
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-slate-900">{record.name}</div>
                          <div className="text-xs text-slate-500">{record.designation}</div>
                        </td>
                        <td className="p-4 text-slate-600 text-right">{record.actual_days_worked}</td>
                        <td className="p-4 font-semibold text-emerald-600 text-right">
                          ₹{record.net_pay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => handleDownloadPayslip(record)}
                            className="inline-flex items-center justify-center text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-lg transition-colors"
                            title="Download Payslip"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                  <SettingsIcon className="w-5 h-5 mr-2 text-indigo-600" />
                  Company Settings
                </h2>
                <p className="text-sm text-slate-500 mt-1">Configure your company details for payslips</p>
              </div>
              <form onSubmit={handleSettingsSave} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={settings.company_name}
                      onChange={e => setSettings({...settings, company_name: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Address Line 1</label>
                    <input
                      type="text"
                      value={settings.address_line1}
                      onChange={e => setSettings({...settings, address_line1: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Address Line 2</label>
                    <input
                      type="text"
                      value={settings.address_line2}
                      onChange={e => setSettings({...settings, address_line2: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">City, State, ZIP</label>
                    <input
                      type="text"
                      value={settings.city_state_zip}
                      onChange={e => setSettings({...settings, city_state_zip: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Logo URL</label>
                    <input
                      type="url"
                      value={settings.logo_url}
                      onChange={e => setSettings({...settings, logo_url: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="https://example.com/logo.png"
                    />
                    <p className="text-xs text-slate-500 mt-1">Provide a direct URL to your company logo image.</p>
                  </div>
                  {settings.logo_url && (
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-slate-700 mb-2">Logo Preview:</p>
                      <div className="border border-slate-200 p-4 rounded-lg bg-slate-50 inline-block">
                        <img 
                          src={settings.logo_url} 
                          alt="Logo Preview" 
                          className="max-h-16 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }} 
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-end pt-4 border-t border-slate-200">
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-md"
                  >
                    <Save className="w-4 h-4" /> Save Settings
                  </button>
                </div>
              </form>
            </div>

            {/* Data Management */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                  Data Management
                </h2>
                <p className="text-sm text-slate-500 mt-1">Backup and restore your payroll data</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleExportData}
                    className="bg-slate-100 text-slate-700 px-4 py-2.5 rounded-lg font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Export Data (JSON)
                  </button>
                  <label className="bg-slate-100 text-slate-700 px-4 py-2.5 rounded-lg font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                    <FileText className="w-4 h-4" /> Import Data (JSON)
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportData}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-slate-500">
                  Export creates a backup of all employees, history, and settings. Import will merge or replace existing data.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEmployee(null);
        }}
        employee={editingEmployee}
        onSave={handleEmployeeSave}
      />
    </div>
  );
}

// Employee Modal Component
interface EmployeeModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (emp: Omit<Employee, 'id'> & { id?: number }) => Promise<void>;
}

const DEFAULT_EMPLOYEE: Omit<Employee, 'id'> = {
  name: '', designation: '', target_gross_salary: 0, basic_salary: 0, hra: 0, conveyance: 0, medical: 0, special_allowance: 0,
  emp_no: '', date_joined: '', department: '', sub_department: '', payment_mode: '', bank_name: '', bank_ifsc: '', bank_account: '',
  pan: '', uan: '', pf_number: '', date_of_birth: '', lta: 0, pf_employee: 0, employee_insurance: 0, professional_tax: 0, income_tax: 0,
  custom_earnings: '[]', custom_deductions: '[]'
};

function EmployeeModal({ employee, isOpen, onClose, onSave }: EmployeeModalProps) {
  const [emp, setEmp] = useState<Omit<Employee, 'id'>>(DEFAULT_EMPLOYEE);
  const [customEarnings, setCustomEarnings] = useState<CustomItem[]>([]);
  const [customDeductions, setCustomDeductions] = useState<CustomItem[]>([]);

  useEffect(() => {
    if (employee) {
      setEmp(employee);
      try {
        setCustomEarnings(JSON.parse(employee.custom_earnings || '[]'));
      } catch { setCustomEarnings([]); }
      try {
        setCustomDeductions(JSON.parse(employee.custom_deductions || '[]'));
      } catch { setCustomDeductions([]); }
    } else {
      setEmp(DEFAULT_EMPLOYEE);
      setCustomEarnings([]);
      setCustomDeductions([]);
    }
  }, [employee, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof Omit<Employee, 'id'>, value: string) => {
    const numFields: (keyof Omit<Employee, 'id'>)[] = ['target_gross_salary', 'basic_salary', 'hra', 'conveyance', 'medical', 'special_allowance', 'lta', 'pf_employee', 'employee_insurance', 'professional_tax', 'income_tax'];
    if (numFields.includes(field)) {
      setEmp({ ...emp, [field]: parseFloat(value) || 0 });
    } else {
      setEmp({ ...emp, [field]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      ...emp,
      custom_earnings: JSON.stringify(customEarnings),
      custom_deductions: JSON.stringify(customDeductions)
    });
  };

  const numberInputClass = "w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent";
  const textInputClass = "w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent";

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl my-8 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex justify-between items-center p-6 border-b border-slate-200 z-10">
          <h2 className="text-xl font-semibold text-slate-800">
            {employee ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Details */}
            <div className="col-span-full">
              <h3 className="text-sm font-semibold text-slate-500 uppercase mb-4 flex items-center">
                <Users className="w-4 h-4 mr-2" /> Basic Details
              </h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
              <input required type="text" value={emp.name} onChange={e => handleChange('name', e.target.value)} className={textInputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Employee No</label>
              <input type="text" value={emp.emp_no || ''} onChange={e => handleChange('emp_no', e.target.value)} className={textInputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Designation *</label>
              <input required type="text" value={emp.designation} onChange={e => handleChange('designation', e.target.value)} className={textInputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <input type="text" value={emp.department || ''} onChange={e => handleChange('department', e.target.value)} className={textInputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sub Department</label>
              <input type="text" value={emp.sub_department || ''} onChange={e => handleChange('sub_department', e.target.value)} className={textInputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date Joined</label>
              <input type="date" value={emp.date_joined || ''} onChange={e => handleChange('date_joined', e.target.value)} className={textInputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
              <input type="date" value={emp.date_of_birth || ''} onChange={e => handleChange('date_of_birth', e.target.value)} className={textInputClass} />
            </div>

            {/* Bank & Tax Details */}
            <div className="col-span-full mt-4">
              <h3 className="text-sm font-semibold text-slate-500 uppercase mb-4 flex items-center">
                <FileText className="w-4 h-4 mr-2" /> Bank & Tax Details
              </h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Payment Mode</label>
              <input type="text" value={emp.payment_mode || ''} onChange={e => handleChange('payment_mode', e.target.value)} className={textInputClass} placeholder="Bank Transfer" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bank Name</label>
              <input type="text" value={emp.bank_name || ''} onChange={e => handleChange('bank_name', e.target.value)} className={textInputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bank Account</label>
              <input type="text" value={emp.bank_account || ''} onChange={e => handleChange('bank_account', e.target.value)} className={textInputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bank IFSC</label>
              <input type="text" value={emp.bank_ifsc || ''} onChange={e => handleChange('bank_ifsc', e.target.value)} className={textInputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">PAN</label>
              <input type="text" value={emp.pan || ''} onChange={e => handleChange('pan', e.target.value)} className={textInputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">UAN</label>
              <input type="text" value={emp.uan || ''} onChange={e => handleChange('uan', e.target.value)} className={textInputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">PF Number</label>
              <input type="text" value={emp.pf_number || ''} onChange={e => handleChange('pf_number', e.target.value)} className={textInputClass} />
            </div>

            {/* Salary Structure */}
            <div className="col-span-full mt-4">
              <h3 className="text-sm font-semibold text-slate-500 uppercase mb-4 flex items-center">
                <Calculator className="w-4 h-4 mr-2" /> Salary Structure (Monthly)
              </h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Target Gross Salary</label>
              <input type="number" value={emp.target_gross_salary} onChange={e => handleChange('target_gross_salary', e.target.value)} className={numberInputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Basic Salary</label>
              <input type="number" value={emp.basic_salary} onChange={e => handleChange('basic_salary', e.target.value)} className={numberInputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">HRA</label>
              <input type="number" value={emp.hra} onChange={e => handleChange('hra', e.target.value)} className={numberInputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Conveyance</label>
              <input type="number" value={emp.conveyance} onChange={e => handleChange('conveyance', e.target.value)} className={numberInputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Medical</label>
              <input type="number" value={emp.medical} onChange={e => handleChange('medical', e.target.value)} className={numberInputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Leave Travel Allowance (LTA)</label>
              <input type="number" value={emp.lta || 0} onChange={e => handleChange('lta', e.target.value)} className={numberInputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Special Allowance</label>
              <input type="number" value={emp.special_allowance} onChange={e => handleChange('special_allowance', e.target.value)} className={numberInputClass} />
            </div>

            {/* Deductions */}
            <div className="col-span-full mt-4">
              <h3 className="text-sm font-semibold text-slate-500 uppercase mb-4 flex items-center">
                <Trash2 className="w-4 h-4 mr-2" /> Deductions (Monthly)
              </h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">PF Employee</label>
              <input type="number" value={emp.pf_employee || 0} onChange={e => handleChange('pf_employee', e.target.value)} className={numberInputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Employee Insurance</label>
              <input type="number" value={emp.employee_insurance || 0} onChange={e => handleChange('employee_insurance', e.target.value)} className={numberInputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Professional Tax</label>
              <input type="number" value={emp.professional_tax || 0} onChange={e => handleChange('professional_tax', e.target.value)} className={numberInputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Income Tax</label>
              <input type="number" value={emp.income_tax || 0} onChange={e => handleChange('income_tax', e.target.value)} className={numberInputClass} />
            </div>

            {/* Custom Earnings */}
            <div className="col-span-full mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase flex items-center">
                  <Plus className="w-4 h-4 mr-2" /> Custom Earnings
                </h3>
                <button type="button" onClick={() => setCustomEarnings([...customEarnings, { name: '', amount: 0 }])} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
                  <Plus className="w-4 h-4 mr-1" /> Add
                </button>
              </div>
              {customEarnings.map((item, index) => (
                <div key={`ce-${index}`} className="flex gap-4 items-end mb-3">
                  <div className="flex-1">
                    <input type="text" placeholder="Name" value={item.name} onChange={e => { const newArr = [...customEarnings]; newArr[index].name = e.target.value; setCustomEarnings(newArr); }} className={textInputClass} />
                  </div>
                  <div className="flex-1">
                    <input type="number" placeholder="Amount" value={item.amount} onChange={e => { const newArr = [...customEarnings]; newArr[index].amount = parseFloat(e.target.value) || 0; setCustomEarnings(newArr); }} className={numberInputClass} />
                  </div>
                  <button type="button" onClick={() => setCustomEarnings(customEarnings.filter((_, i) => i !== index))} className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Custom Deductions */}
            <div className="col-span-full mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase flex items-center">
                  <Plus className="w-4 h-4 mr-2" /> Custom Deductions
                </h3>
                <button type="button" onClick={() => setCustomDeductions([...customDeductions, { name: '', amount: 0 }])} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
                  <Plus className="w-4 h-4 mr-1" /> Add
                </button>
              </div>
              {customDeductions.map((item, index) => (
                <div key={`cd-${index}`} className="flex gap-4 items-end mb-3">
                  <div className="flex-1">
                    <input type="text" placeholder="Name" value={item.name} onChange={e => { const newArr = [...customDeductions]; newArr[index].name = e.target.value; setCustomDeductions(newArr); }} className={textInputClass} />
                  </div>
                  <div className="flex-1">
                    <input type="number" placeholder="Amount" value={item.amount} onChange={e => { const newArr = [...customDeductions]; newArr[index].amount = parseFloat(e.target.value) || 0; setCustomDeductions(newArr); }} className={numberInputClass} />
                  </div>
                  <button type="button" onClick={() => setCustomDeductions(customDeductions.filter((_, i) => i !== index))} className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50">Cancel</button>
            <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
