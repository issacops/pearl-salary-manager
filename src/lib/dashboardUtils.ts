/**
 * Pearl Dental Dashboard - Utility Functions
 * Calculation and formatting utilities for analytics
 */

import { Employee, PayrollHistory } from '@/types';

// ============================================
// NUMBER FORMATTING
// ============================================

/**
 * Format number as Indian currency (₹)
 */
export function formatCurrency(
  value: number,
  options?: {
    compact?: boolean;
    decimals?: number;
    showSymbol?: boolean;
  }
): string {
  const { compact = false, decimals = 0, showSymbol = true } = options || {};
  
  const formatter = new Intl.NumberFormat('en-IN', {
    style: compact ? 'decimal' : 'currency',
    currency: 'INR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    notation: compact ? 'compact' : 'standard',
    compactDisplay: 'short',
  });
  
  const formatted = formatter.format(value);
  
  if (compact && showSymbol) {
    return `₹${formatted}`;
  }
  
  return formatted;
}

/**
 * Format number with locale
 */
export function formatNumber(
  value: number,
  options?: {
    decimals?: number;
    compact?: boolean;
    locale?: string;
  }
): string {
  const { decimals = 0, compact = false, locale = 'en-IN' } = options || {};
  
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    notation: compact ? 'compact' : 'standard',
  }).format(value);
}

/**
 * Format percentage
 */
export function formatPercentage(
  value: number,
  options?: {
    decimals?: number;
    showSign?: boolean;
  }
): string {
  const { decimals = 1, showSign = false } = options || {};
  
  const formatted = `${value.toFixed(decimals)}%`;
  
  if (showSign && value > 0) {
    return `+${formatted}`;
  }
  
  return formatted;
}

// ============================================
// DATE FORMATTING
// ============================================

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Format month and year
 */
export function formatMonthYear(month: number, year: number, short = false): string {
  const monthName = short ? MONTH_NAMES_SHORT[month - 1] : MONTH_NAMES[month - 1];
  return `${monthName} ${year}`;
}

/**
 * Get month name
 */
export function getMonthName(month: number, short = false): string {
  return short ? MONTH_NAMES_SHORT[month - 1] : MONTH_NAMES[month - 1];
}

/**
 * Calculate tenure from join date
 */
export function calculateTenure(joinDate: string): {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  formatted: string;
} {
  const start = new Date(joinDate);
  const now = new Date();
  
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();
  
  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  const totalDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  let formatted = '';
  if (years > 0) {
    formatted += `${years} yr${years > 1 ? 's' : ''}`;
  }
  if (months > 0) {
    formatted += `${formatted ? ' ' : ''}${months} mo${months > 1 ? 's' : ''}`;
  }
  if (years === 0 && months === 0) {
    formatted = `${days} day${days > 1 ? 's' : ''}`;
  }
  
  return { years, months, days, totalDays, formatted };
}

// ============================================
// PAYROLL CALCULATIONS
// ============================================

/**
 * Calculate total payroll cost
 */
export function calculateTotalPayroll(employees: Employee[]): number {
  return employees.reduce((sum, emp) => sum + emp.target_gross_salary, 0);
}

/**
 * Calculate salary statistics
 */
export function calculateSalaryStats(employees: Employee[]): {
  mean: number;
  median: number;
  min: number;
  max: number;
  range: number;
  total: number;
} {
  const salaries = employees.map(e => e.target_gross_salary).sort((a, b) => a - b);
  const total = salaries.reduce((sum, s) => sum + s, 0);
  const mean = total / salaries.length;
  
  const median = salaries.length % 2 === 0
    ? (salaries[salaries.length / 2 - 1] + salaries[salaries.length / 2]) / 2
    : salaries[Math.floor(salaries.length / 2)];
  
  return {
    mean,
    median,
    min: salaries[0] || 0,
    max: salaries[salaries.length - 1] || 0,
    range: (salaries[salaries.length - 1] || 0) - (salaries[0] || 0),
    total,
  };
}

/**
 * Group employees by designation
 */
export function groupByDesignation(employees: Employee[]): Map<string, Employee[]> {
  const groups = new Map<string, Employee[]>();
  
  employees.forEach(emp => {
    const designation = emp.designation || 'Unassigned';
    if (!groups.has(designation)) {
      groups.set(designation, []);
    }
    groups.get(designation)!.push(emp);
  });
  
  return groups;
}

/**
 * Group employees by department
 */
export function groupByDepartment(employees: Employee[]): Map<string, Employee[]> {
  const groups = new Map<string, Employee[]>();
  
  employees.forEach(emp => {
    const department = emp.department || 'Unassigned';
    if (!groups.has(department)) {
      groups.set(department, []);
    }
    groups.get(department)!.push(emp);
  });
  
  return groups;
}

/**
 * Calculate designation distribution
 */
export function calculateDesignationDistribution(employees: Employee[]): {
  designation: string;
  count: number;
  percentage: number;
  avgSalary: number;
}[] {
  const groups = groupByDesignation(employees);
  const total = employees.length;
  
  return Array.from(groups.entries()).map(([designation, empList]) => {
    const totalSalary = empList.reduce((sum, e) => sum + e.target_gross_salary, 0);
    return {
      designation,
      count: empList.length,
      percentage: (empList.length / total) * 100,
      avgSalary: totalSalary / empList.length,
    };
  }).sort((a, b) => b.count - a.count);
}

/**
 * Calculate department distribution
 */
export function calculateDepartmentDistribution(employees: Employee[]): {
  department: string;
  count: number;
  percentage: number;
  totalSalary: number;
  avgSalary: number;
}[] {
  const groups = groupByDepartment(employees);
  const total = employees.length;
  
  return Array.from(groups.entries()).map(([department, empList]) => {
    const totalSalary = empList.reduce((sum, e) => sum + e.target_gross_salary, 0);
    return {
      department,
      count: empList.length,
      percentage: (empList.length / total) * 100,
      totalSalary,
      avgSalary: totalSalary / empList.length,
    };
  }).sort((a, b) => b.totalSalary - a.totalSalary);
}

// ============================================
// SALARY BRACKETS
// ============================================

const SALARY_BRACKETS = [
  { range: '₹0 - ₹15,000', min: 0, max: 15000, label: 'Entry Level' },
  { range: '₹15,001 - ₹25,000', min: 15001, max: 25000, label: 'Junior Level' },
  { range: '₹25,001 - ₹50,000', min: 25001, max: 50000, label: 'Mid Level' },
  { range: '₹50,001+', min: 50001, max: Infinity, label: 'Senior Level' },
];

/**
 * Calculate salary bracket distribution
 */
export function calculateSalaryBrackets(employees: Employee[]): {
  range: string;
  label: string;
  count: number;
  percentage: number;
  employees: string[];
}[] {
  const total = employees.length;
  
  return SALARY_BRACKETS.map(bracket => {
    const matching = employees.filter(
      e => e.target_gross_salary >= bracket.min && e.target_gross_salary <= bracket.max
    );
    
    return {
      range: bracket.range,
      label: bracket.label,
      count: matching.length,
      percentage: (matching.length / total) * 100,
      employees: matching.map(e => e.name),
    };
  });
}

// ============================================
// ATTENDANCE CALCULATIONS
// ============================================

/**
 * Calculate attendance rate
 */
export function calculateAttendanceRate(actualDays: number, maxDays: number): number {
  if (maxDays === 0) return 0;
  return (actualDays / maxDays) * 100;
}

/**
 * Get attendance status
 */
export function getAttendanceStatus(rate: number): {
  status: 'excellent' | 'good' | 'average' | 'poor';
  color: string;
  label: string;
} {
  if (rate >= 95) {
    return { status: 'excellent', color: '#22c55e', label: 'Excellent' };
  } else if (rate >= 85) {
    return { status: 'good', color: '#06b6d4', label: 'Good' };
  } else if (rate >= 75) {
    return { status: 'average', color: '#f59e0b', label: 'Average' };
  } else {
    return { status: 'poor', color: '#ef4444', label: 'Needs Improvement' };
  }
}

/**
 * Calculate LOP (Loss of Pay) days
 */
export function calculateLOPDays(actualDays: number, maxDays: number): number {
  return Math.max(0, maxDays - actualDays);
}

/**
 * Calculate LOP impact (monetary)
 */
export function calculateLOPImpact(
  actualDays: number,
  maxDays: number,
  grossSalary: number
): number {
  const lopDays = calculateLOPDays(actualDays, maxDays);
  const dailyRate = grossSalary / maxDays;
  return lopDays * dailyRate;
}

// ============================================
// TREND CALCULATIONS
// ============================================

/**
 * Calculate month-over-month change
 */
export function calculateMoMChange(
  current: number,
  previous: number
): {
  value: number;
  percentage: number;
  trend: 'up' | 'down' | 'neutral';
} {
  if (previous === 0) {
    return { value: current, percentage: 0, trend: 'neutral' };
  }
  
  const change = current - previous;
  const percentage = Math.abs((change / previous) * 100);
  const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';
  
  return { value: Math.abs(change), percentage, trend };
}

/**
 * Calculate payroll trend from history
 */
export function calculatePayrollTrend(
  history: PayrollHistory[],
  months: number = 6
): {
  labels: string[];
  data: number[];
  trend: 'increasing' | 'decreasing' | 'stable';
  growthRate: number;
} {
  // Group by month-year
  const monthlyData = new Map<string, number>();
  
  history.forEach(record => {
    const key = `${record.year}-${String(record.month).padStart(2, '0')}`;
    monthlyData.set(key, (monthlyData.get(key) || 0) + record.net_pay);
  });
  
  // Sort and get last N months
  const sorted = Array.from(monthlyData.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-months);
  
  const labels = sorted.map(([key]) => {
    const [year, month] = key.split('-');
    return getMonthName(parseInt(month), true);
  });
  
  const data = sorted.map(([, value]) => value);
  
  // Calculate trend
  const first = data[0] || 0;
  const last = data[data.length - 1] || 0;
  const growthRate = first !== 0 ? ((last - first) / first) * 100 : 0;
  
  let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
  if (growthRate > 5) trend = 'increasing';
  else if (growthRate < -5) trend = 'decreasing';
  
  return { labels, data, trend, growthRate };
}

// ============================================
// EARNINGS & DEDUCTIONS
// ============================================

/**
 * Calculate earnings breakdown for all employees
 */
export function calculateEarningsBreakdown(employees: Employee[]): {
  basic: number;
  hra: number;
  conveyance: number;
  medical: number;
  specialAllowance: number;
  lta: number;
  custom: number;
  total: number;
} {
  let basic = 0, hra = 0, conveyance = 0, medical = 0;
  let specialAllowance = 0, lta = 0, custom = 0;
  
  employees.forEach(emp => {
    basic += emp.basic_salary || 0;
    hra += emp.hra || 0;
    conveyance += emp.conveyance || 0;
    medical += emp.medical || 0;
    specialAllowance += emp.special_allowance || 0;
    lta += emp.lta || 0;
    
    // Parse custom earnings
    try {
      const customEarnings = JSON.parse(emp.custom_earnings || '[]');
      customEarnings.forEach((item: { amount: number }) => {
        custom += item.amount || 0;
      });
    } catch (_e) {
      // Ignore JSON parse errors
    }
  });
  
  const total = basic + hra + conveyance + medical + specialAllowance + lta + custom;
  
  return {
    basic,
    hra,
    conveyance,
    medical,
    specialAllowance,
    lta,
    custom,
    total,
  };
}

/**
 * Calculate deductions breakdown for all employees
 */
export function calculateDeductionsBreakdown(employees: Employee[]): {
  pf: number;
  insurance: number;
  professionalTax: number;
  incomeTax: number;
  custom: number;
  total: number;
} {
  let pf = 0, insurance = 0, professionalTax = 0, incomeTax = 0, custom = 0;
  
  employees.forEach(emp => {
    pf += emp.pf_employee || 0;
    insurance += emp.employee_insurance || 0;
    professionalTax += emp.professional_tax || 0;
    incomeTax += emp.income_tax || 0;
    
    // Parse custom deductions
    try {
      const customDeductions = JSON.parse(emp.custom_deductions || '[]');
      customDeductions.forEach((item: { amount: number }) => {
        custom += item.amount || 0;
      });
    } catch (_e) {
      // Ignore JSON parse errors
    }
  });
  
  const total = pf + insurance + professionalTax + incomeTax + custom;
  
  return {
    pf,
    insurance,
    professionalTax,
    incomeTax,
    custom,
    total,
  };
}

// ============================================
// CHART DATA HELPERS
// ============================================

/**
 * Get chart colors
 */
export function getChartColors(count: number): string[] {
  const colors = [
    '#6366f1', '#8b5cf6', '#06b6d4', '#10b981',
    '#f59e0b', '#ec4899', '#f97316', '#14b8a6',
  ];
  return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
}

/**
 * Generate waterfall data for gross to net flow
 */
export function generateWaterfallData(
  gross: number,
  deductions: { name: string; amount: number }[],
  net: number
): { name: string; value: number; type: 'total' | 'negative' | 'positive' }[] {
  const data: { name: string; value: number; type: 'total' | 'negative' | 'positive' }[] = [
    { name: 'Gross', value: gross, type: 'total' },
  ];
  
  deductions.forEach(d => {
    data.push({ name: d.name, value: d.amount, type: 'negative' });
  });
  
  data.push({ name: 'Net Pay', value: net, type: 'total' });
  
  return data;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Clamp number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Round to decimal places
 */
export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limit);
    }
  };
}

export default {
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatMonthYear,
  getMonthName,
  calculateTenure,
  calculateTotalPayroll,
  calculateSalaryStats,
  groupByDesignation,
  groupByDepartment,
  calculateDesignationDistribution,
  calculateDepartmentDistribution,
  calculateSalaryBrackets,
  calculateAttendanceRate,
  getAttendanceStatus,
  calculateLOPDays,
  calculateLOPImpact,
  calculateMoMChange,
  calculatePayrollTrend,
  calculateEarningsBreakdown,
  calculateDeductionsBreakdown,
  getChartColors,
  generateWaterfallData,
  generateId,
  clamp,
  roundTo,
  debounce,
  throttle,
};