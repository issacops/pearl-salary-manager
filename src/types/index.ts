// Type definitions for Pearl Dental Payroll System

export interface Employee {
  id: number;
  name: string;
  designation: string;
  target_gross_salary: number;
  basic_salary: number;
  hra: number;
  conveyance: number;
  medical: number;
  special_allowance: number;
  emp_no?: string;
  date_joined?: string;
  department?: string;
  sub_department?: string;
  payment_mode?: string;
  bank_name?: string;
  bank_ifsc?: string;
  bank_account?: string;
  pan?: string;
  uan?: string;
  pf_number?: string;
  date_of_birth?: string;
  lta?: number;
  pf_employee?: number;
  employee_insurance?: number;
  professional_tax?: number;
  income_tax?: number;
  custom_earnings?: string;
  custom_deductions?: string;
}

export interface PayrollHistory {
  id: number;
  employee_id: number;
  name: string;
  designation: string;
  month: number;
  year: number;
  actual_days_worked: number;
  net_pay: number;
  pdf_path: string;
  calculation_method?: 'actual_workable_days' | 'fixed_26_days' | 'fixed_30_days' | 'total_calendar_days';
}

export interface Settings {
  company_name: string;
  address_line1: string;
  address_line2: string;
  city_state_zip: string;
  logo_url: string;
}

export interface PayrollInput {
  employee_id: number;
  actual_days_worked: number;
}

export interface GeneratePayrollRequest {
  month: number;
  year: number;
  calculationMethod: 'actual_workable_days' | 'fixed_26_days' | 'fixed_30_days' | 'total_calendar_days';
  employeeData: PayrollInput[];
}

export interface CustomItem {
  name: string;
  amount: number;
}

export const DEFAULT_SETTINGS: Settings = {
  company_name: 'PEARL DENTAL SOLUTIONS',
  address_line1: '123 DENTAL CLINIC ROAD',
  address_line2: 'HEALTHCARE DISTRICT',
  city_state_zip: 'CITY STATE 123456',
  logo_url: ''
};

export const SEED_EMPLOYEES: Omit<Employee, 'id'>[] = [
  { name: "Tinkle", designation: "Production Head", target_gross_salary: 50000, basic_salary: 16500, hra: 8250, conveyance: 2500, medical: 2500, special_allowance: 20250 },
  { name: "Jomon", designation: "Marketing & Operations Head", target_gross_salary: 50000, basic_salary: 16500, hra: 8250, conveyance: 2500, medical: 2500, special_allowance: 20250 },
  { name: "Jacob", designation: "Maintenance & Admin Head", target_gross_salary: 50000, basic_salary: 16500, hra: 8250, conveyance: 2500, medical: 2500, special_allowance: 20250 },
  { name: "Eldhose TA", designation: "CadCam Technician", target_gross_salary: 15000, basic_salary: 15000, hra: 0, conveyance: 0, medical: 0, special_allowance: 0 },
  { name: "Vijeesh Baby", designation: "CadCam Technician", target_gross_salary: 15000, basic_salary: 15000, hra: 0, conveyance: 0, medical: 0, special_allowance: 0 },
  { name: "Simi Aji", designation: "Dental Technician", target_gross_salary: 36000, basic_salary: 16500, hra: 8250, conveyance: 2500, medical: 2500, special_allowance: 6250 },
  { name: "Eldhose George", designation: "Dental Technician", target_gross_salary: 17000, basic_salary: 16500, hra: 8250, conveyance: 2500, medical: 2500, special_allowance: -12750 },
  { name: "Ivin Jacob", designation: "Dental Technician", target_gross_salary: 6000, basic_salary: 16500, hra: 8250, conveyance: 2500, medical: 2500, special_allowance: -23750 }
];
