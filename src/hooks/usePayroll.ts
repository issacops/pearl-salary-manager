// Custom hooks for Pearl Dental Payroll System

import { useState, useEffect, useCallback } from 'react';
import { Employee, PayrollHistory, Settings, GeneratePayrollRequest } from '@/types';
import {
  initializeStore,
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getHistory,
  getSettings,
  updateSettings,
  generatePayrollHistory
} from '@/lib/store';
import {
  calculateSalary,
  getMaxWorkableDays,
  getAttendanceInfo
} from '@/lib/payroll';
import { generatePayslipPDF } from '@/lib/pdf';

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setEmployees(getEmployees());
    setLoading(false);
  }, []);

  useEffect(() => {
    initializeStore();
    refresh();
  }, [refresh]);

  const add = useCallback((employee: Omit<Employee, 'id'>) => {
    const newEmployee = createEmployee(employee);
    refresh();
    return newEmployee;
  }, [refresh]);

  const update = useCallback((id: number, updates: Partial<Employee>) => {
    const updated = updateEmployee(id, updates);
    refresh();
    return updated;
  }, [refresh]);

  const remove = useCallback((id: number) => {
    const success = deleteEmployee(id);
    refresh();
    return success;
  }, [refresh]);

  return { employees, loading, add, update, remove, refresh };
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    const data = getSettings();
    setSettings(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    initializeStore();
    refresh();
  }, [refresh]);

  const save = useCallback((newSettings: Settings) => {
    updateSettings(newSettings);
    setSettings(newSettings);
  }, []);

  return { settings, loading, save, refresh };
}

export function usePayrollHistory() {
  const [history, setHistory] = useState<PayrollHistory[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setHistory(getHistory());
    setLoading(false);
  }, []);

  useEffect(() => {
    initializeStore();
    refresh();
  }, [refresh]);

  const clear = useCallback(() => {
    setHistory([]);
  }, []);

  return { history, loading, refresh, clear };
}

export function usePayrollGenerator() {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const generate = useCallback(async (
    request: GeneratePayrollRequest,
    employees: Employee[],
    settings: Settings,
    onProgress?: (current: number, total: number) => void
  ): Promise<{ success: boolean; message: string; results?: PayrollHistory[] }> => {
    setGenerating(true);
    
    try {
      const { month, year, calculationMethod, employeeData } = request;
      const { days: maxWorkableDays } = getMaxWorkableDays(month, year, calculationMethod);
      
      const historyEntries: Omit<PayrollHistory, 'id'>[] = [];
      const total = employeeData.length;

      for (let i = 0; i < employeeData.length; i++) {
        const input = employeeData[i];
        const employee = employees.find(e => e.id === input.employee_id);
        
        if (!employee) continue;

        const actualDaysWorked = parseFloat(String(input.actual_days_worked)) || 0;
        const salary = calculateSalary(employee, actualDaysWorked, maxWorkableDays);
        const attendance = getAttendanceInfo(actualDaysWorked, maxWorkableDays);

        // Generate PDF (stored as base64 data URL)
        const pdfDataUrl = await generatePayslipPDF({
          employee,
          settings,
          month,
          year,
          salary,
          attendance
        });

        // Store with PDF as data URL
        historyEntries.push({
          employee_id: employee.id,
          name: employee.name,
          designation: employee.designation,
          month,
          year,
          actual_days_worked: actualDaysWorked,
          net_pay: salary.netPay,
          pdf_path: pdfDataUrl // Using data URL instead of file path
        });

        setProgress({ current: i + 1, total });
        onProgress?.(i + 1, total);
      }

      // Save all entries
      const savedEntries = generatePayrollHistory(historyEntries);
      
      setGenerating(false);
      return {
        success: true,
        message: `Successfully generated payslips for ${historyEntries.length} employees`,
        results: savedEntries
      };
    } catch (error) {
      setGenerating(false);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to generate payroll'
      };
    }
  }, []);

  return { generating, progress, generate };
}
