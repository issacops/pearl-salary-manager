/**
 * Pearl Dental Dashboard - Type Definitions
 * Comprehensive type system for the Super User Dashboard
 */

import { Employee, PayrollHistory } from './index';

// ============================================
// DASHBOARD NAVIGATION
// ============================================

export type DashboardTab = 'overview' | 'employees' | 'payroll' | 'attendance';

export interface NavigationItem {
  id: DashboardTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

// ============================================
// KPI CARDS
// ============================================

export interface TrendData {
  value: number;
  percentage: number;
  direction: 'up' | 'down' | 'neutral';
  label?: string;
  comparisonPeriod?: string;
}

export interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  prefix?: string;
  suffix?: string;
  trend?: TrendData;
  icon?: React.ReactNode;
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  loading?: boolean;
  sparklineData?: number[];
  className?: string;
}

export interface KPICardsRowProps {
  cards: KPICardProps[];
  columns?: 2 | 3 | 4;
  className?: string;
}

// ============================================
// PERIOD SELECTOR
// ============================================

export interface PeriodSelectorProps {
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onRefresh?: () => void;
  loading?: boolean;
  className?: string;
}

// ============================================
// CHARTS
// ============================================

export interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  loading?: boolean;
  error?: string;
  empty?: boolean;
  emptyMessage?: string;
  className?: string;
}

export interface LineChartProps {
  data: ChartDataPoint[];
  xKey: string;
  yKey: string;
  color?: string;
  gradient?: boolean;
  showDots?: boolean;
  showGrid?: boolean;
  height?: number;
  animated?: boolean;
  className?: string;
}

export interface AreaChartProps extends LineChartProps {
  fillOpacity?: number;
}

export interface BarChartProps {
  data: ChartDataPoint[];
  xKey: string;
  yKeys: string[];
  colors?: string[];
  stacked?: boolean;
  horizontal?: boolean;
  showValues?: boolean;
  height?: number;
  animated?: boolean;
  className?: string;
}

export interface DonutChartProps {
  data: PieDataPoint[];
  innerRadius?: number;
  outerRadius?: number;
  showLabels?: boolean;
  showLegend?: boolean;
  legendPosition?: 'top' | 'right' | 'bottom';
  height?: number;
  animated?: boolean;
  className?: string;
}

export interface GaugeChartProps {
  value: number;
  max?: number;
  min?: number;
  color?: string;
  showValue?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface HeatmapCell {
  value: number;
  label?: string;
}

export interface HeatmapChartProps {
  data: HeatmapCell[][];
  rowLabels: string[];
  columnLabels: string[];
  colorScale?: [string, string];
  showValues?: boolean;
  className?: string;
}

export interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  showArea?: boolean;
  className?: string;
}

// ============================================
// DATA TABLES
// ============================================

export interface ColumnDef<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  sortable?: boolean;
  defaultSortKey?: string;
  defaultSortDirection?: 'asc' | 'desc';
  filterable?: boolean;
  filterPlaceholder?: string;
  pagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  loading?: boolean;
  className?: string;
}

// ============================================
// OVERVIEW TAB
// ============================================

export interface OverviewStats {
  totalEmployees: number;
  employeesTrend: TrendData;
  monthlyPayroll: number;
  payrollTrend: TrendData;
  avgDaysWorked: number;
  daysWorkedTrend: TrendData;
  payslipsGenerated: number;
  payslipsTrend?: TrendData;
}

export interface PayrollTrendPoint {
  month: string;
  year: number;
  amount: number;
  employeeCount: number;
}

export interface DepartmentDistribution {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface EarningsBreakdown {
  basic: number;
  hra: number;
  conveyance: number;
  medical: number;
  specialAllowance: number;
  lta: number;
  custom: number;
}

export interface DeductionsBreakdown {
  pf: number;
  insurance: number;
  professionalTax: number;
  incomeTax: number;
  custom: number;
}

export interface InsightAlert {
  id: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ============================================
// EMPLOYEE ANALYTICS
// ============================================

export interface EmployeeStats {
  totalActive: number;
  newHiresMTD: number;
  avgTenure: number;
  avgTenureUnit: 'days' | 'months' | 'years';
  avgSalary: number;
  medianSalary: number;
  salaryRange: {
    min: number;
    max: number;
  };
}

export interface DesignationDistribution {
  designation: string;
  count: number;
  percentage: number;
  avgSalary: number;
}

export interface SalaryBracket {
  range: string;
  min: number;
  max: number;
  count: number;
  employees: string[];
}

export interface EmployeeTableRow {
  id: number;
  name: string;
  designation: string;
  department: string;
  salary: number;
  joinDate: string;
  tenure: string;
  status: 'active' | 'inactive' | 'on_leave';
}

// ============================================
// PAYROLL INSIGHTS
// ============================================

export interface PayrollStats {
  totalGross: number;
  totalEarnings: number;
  totalDeductions: number;
  netPay: number;
  earningsBreakdown: EarningsBreakdown;
  deductionsBreakdown: DeductionsBreakdown;
}

export interface WaterfallPoint {
  label: string;
  value: number;
  type: 'total' | 'positive' | 'negative';
}

export interface DepartmentCost {
  department: string;
  totalCost: number;
  avgSalary: number;
  employeeCount: number;
  percentage: number;
}

export interface PayrollTableRow {
  employeeId: number;
  employeeName: string;
  designation: string;
  grossSalary: number;
  totalEarnings: number;
  totalDeductions: number;
  netPay: number;
  percentage: number;
}

// ============================================
// ATTENDANCE ANALYTICS
// ============================================

export interface AttendanceStats {
  attendanceRate: number;
  avgDaysWorked: number;
  perfectAttendance: number;
  totalLOPDays: number;
  attendanceTrend: TrendData;
}

export interface AttendanceBucket {
  label: string;
  range: [number, number];
  count: number;
  employees: string[];
  color: string;
}

export interface EmployeeAttendance {
  employeeId: number;
  employeeName: string;
  designation: string;
  daysWorked: number;
  maxDays: number;
  attendanceRate: number;
  lopDays: number;
  status: 'excellent' | 'good' | 'average' | 'poor';
}

export interface MonthlyAttendance {
  month: number;
  year: number;
  daysWorked: number;
  maxDays: number;
}

export interface AttendanceHeatmapData {
  employeeName: string;
  monthlyData: MonthlyAttendance[];
}

// ============================================
// HISTORICAL TRENDS
// ============================================

export interface MonthlyTrend {
  month: number;
  year: number;
  label: string;
  payroll: number;
  employeeCount: number;
  avgSalary: number;
  avgAttendance: number;
}

export interface ComparisonData {
  current: number;
  previous: number;
  change: number;
  changePercentage: number;
  trend: 'up' | 'down' | 'neutral';
}

// ============================================
// DASHBOARD CONTEXT
// ============================================

export interface DashboardContext {
  selectedMonth: number;
  selectedYear: number;
  employees: Employee[];
  history: PayrollHistory[];
  loading: boolean;
  refresh: () => void;
}

// ============================================
// FORMATTING UTILITIES
// ============================================

export interface FormatOptions {
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  notation?: 'standard' | 'compact';
}

export interface DateFormatOptions {
  format?: 'short' | 'medium' | 'long' | 'full';
  locale?: string;
}

// ============================================
// EXPORT TYPES
// ============================================

export interface ExportOptions {
  format: 'csv' | 'pdf' | 'json' | 'excel';
  includeHeaders?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  sections?: ('summary' | 'employees' | 'payroll' | 'attendance')[];
}

// ============================================
// CHART DATA TYPES
// ============================================

export interface ChartDataPoint {
  [key: string]: string | number;
}

export interface PieDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface SeriesData {
  name: string;
  data: number[];
  color?: string;
}

// ============================================
// ANIMATION TYPES
// ============================================

export interface AnimationConfig {
  duration: number;
  delay?: number;
  easing: string;
  fill?: 'forwards' | 'backwards' | 'both' | 'none';
}

export interface StaggerConfig {
  baseDelay: number;
  increment: number;
}

// ============================================
// RESPONSIVE TYPES
// ============================================

export interface BreakpointConfig {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export type Breakpoint = keyof BreakpointConfig;

export interface ResponsiveValue<T> {
  base: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}

// ============================================
// THEME TYPES
// ============================================

export type ThemeMode = 'dark' | 'light';

export interface ThemeConfig {
  mode: ThemeMode;
  colors: typeof import('../lib/tokens').tokens.colors;
  toggle: () => void;
}

export default {};