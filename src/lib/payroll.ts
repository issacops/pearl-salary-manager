// Payroll Calculation Utilities

import { getDaysInMonth, isSunday } from 'date-fns';
import { Employee, CustomItem } from '@/types';

export type CalculationMethod = 'actual_workable_days' | 'fixed_26_days' | 'fixed_30_days' | 'total_calendar_days';

export interface SalaryBreakdown {
  earnings: { name: string; amount: number }[];
  deductions: { name: string; amount: number }[];
  totalEarnings: number;
  totalDeductions: number;
  netPay: number;
  prorationFactor: number;
}

export interface AttendanceInfo {
  actualDaysWorked: number;
  maxWorkableDays: number;
  lossOfPayDays: number;
}

export function getMaxWorkableDays(
  month: number,
  year: number,
  method: CalculationMethod
): { days: number; description: string } {
  if (method === 'fixed_26_days') {
    return { days: 26, description: 'Fixed 26 Days' };
  }
  if (method === 'fixed_30_days') {
    return { days: 30, description: 'Fixed 30 Days' };
  }

  const date = new Date(year, month - 1);
  const totalDays = getDaysInMonth(date);

  if (method === 'total_calendar_days') {
    return { days: totalDays, description: 'Total Calendar Days' };
  }

  // actual_workable_days - exclude Sundays
  let sundays = 0;
  for (let i = 1; i <= totalDays; i++) {
    if (isSunday(new Date(year, month - 1, i))) {
      sundays++;
    }
  }
  return { days: totalDays - sundays, description: 'Actual Workable Days (excluding Sundays)' };
}

export function calculateSalary(
  employee: Employee,
  actualDaysWorked: number,
  maxWorkableDays: number
): SalaryBreakdown {
  // Calculate proration factor
  let prorationFactor = actualDaysWorked / maxWorkableDays;
  if (prorationFactor > 1) prorationFactor = 1;
  if (prorationFactor < 0) prorationFactor = 0;

  // Calculate LOP days and amount
  const lossOfPayDays = Math.max(0, maxWorkableDays - actualDaysWorked);
  const grossSalary = employee.target_gross_salary || (
    employee.basic_salary + employee.hra + employee.conveyance + 
    employee.medical + employee.special_allowance + (employee.lta || 0)
  );
  const dailyWage = grossSalary / maxWorkableDays;
  const lopAmount = dailyWage * lossOfPayDays;

  // Earnings (show full amounts, not prorated)
  const earnings: { name: string; amount: number }[] = [
    { name: 'Basic Salary', amount: employee.basic_salary },
    { name: 'House Rent Allowance (HRA)', amount: employee.hra },
    { name: 'Conveyance Allowance', amount: employee.conveyance },
    { name: 'Medical Allowance', amount: employee.medical },
    { name: 'Leave Travel Allowance (LTA)', amount: employee.lta || 0 },
    { name: 'Special Allowance', amount: employee.special_allowance }
  ];

  // Custom earnings
  try {
    const customEarnings: CustomItem[] = JSON.parse(employee.custom_earnings || '[]');
    customEarnings.forEach(item => {
      const amount = (parseFloat(String(item.amount)) || 0) * prorationFactor;
      if (amount !== 0) {
        earnings.push({ name: item.name, amount });
      }
    });
  } catch {
    // Ignore JSON parse errors
  }

  const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);

  // Deductions
  const proratedPf = (employee.pf_employee || 0) * prorationFactor;
  const proratedInsurance = (employee.employee_insurance || 0) * prorationFactor;
  const proratedPt = (employee.professional_tax || 0) * prorationFactor;
  const proratedIt = (employee.income_tax || 0) * prorationFactor;

  const deductions: { name: string; amount: number }[] = [
    { name: 'Loss of Pay (LOP)', amount: Math.round(lopAmount * 100) / 100 }
  ];

  // Only add statutory deductions if they exist
  if (proratedPf > 0) deductions.push({ name: 'PF Employee', amount: proratedPf });
  if (proratedInsurance > 0) deductions.push({ name: 'Employee Insurance', amount: proratedInsurance });
  if (proratedPt > 0) deductions.push({ name: 'Professional Tax', amount: proratedPt });
  if (proratedIt > 0) deductions.push({ name: 'Total Income Tax', amount: proratedIt });

  // Custom deductions
  try {
    const customDeductions: CustomItem[] = JSON.parse(employee.custom_deductions || '[]');
    customDeductions.forEach(item => {
      const amount = (parseFloat(String(item.amount)) || 0) * prorationFactor;
      if (amount !== 0) {
        deductions.push({ name: item.name, amount });
      }
    });
  } catch {
    // Ignore JSON parse errors
  }

  const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);

  const netPay = totalEarnings - totalDeductions;

  return {
    earnings,
    deductions,
    totalEarnings,
    totalDeductions,
    netPay,
    prorationFactor
  };
}

export function getAttendanceInfo(
  actualDaysWorked: number,
  maxWorkableDays: number
): AttendanceInfo {
  return {
    actualDaysWorked,
    maxWorkableDays,
    lossOfPayDays: Math.max(0, maxWorkableDays - actualDaysWorked)
  };
}

// Number to words conversion for INR
export function numberToWords(num: number): string {
  if (num < 0) return 'Negative ' + numberToWords(Math.abs(num));
  
  const a = [
    '', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ',
    'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ',
    'Seventeen ', 'Eighteen ', 'Nineteen '
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if ((num = Math.floor(num)).toString().length > 11) return 'Amount exceeds limit';
  
  const n = ('00000000000' + num).substr(-11).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return '';

  let str = '';
  str += (parseInt(n[1]) !== 0) ? (a[parseInt(n[1])] || b[parseInt(n[1][0])] + ' ' + a[parseInt(n[1][1])]) + 'Crore ' : '';
  str += (parseInt(n[2]) !== 0) ? (a[parseInt(n[2])] || b[parseInt(n[2][0])] + ' ' + a[parseInt(n[2][1])]) + 'Lakh ' : '';
  str += (parseInt(n[3]) !== 0) ? (a[parseInt(n[3])] || b[parseInt(n[3][0])] + ' ' + a[parseInt(n[3][1])]) + 'Thousand ' : '';
  str += (parseInt(n[4]) !== 0) ? (a[parseInt(n[4])] || b[parseInt(n[4][0])] + ' ' + a[parseInt(n[4][1])]) + 'Hundred ' : '';
  str += (parseInt(n[5]) !== 0) ? ((str !== '') ? 'and ' : '') + (a[parseInt(n[5])] || b[parseInt(n[5][0])] + ' ' + a[parseInt(n[5][1])]) + 'Only ' : '';
  
  return str.trim() || 'Zero';
}

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
