// Data Store - Handles localStorage persistence for the payroll system
// This provides a simple API-compatible interface for data operations

import { Employee, PayrollHistory, Settings, SEED_EMPLOYEES, DEFAULT_SETTINGS } from '@/types';

const STORAGE_KEYS = {
  EMPLOYEES: 'pearl_dental_employees',
  HISTORY: 'pearl_dental_history',
  SETTINGS: 'pearl_dental_settings',
  INITIALIZED: 'pearl_dental_initialized',
  HISTORY_COUNTER: 'pearl_dental_history_counter'
} as const;

function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to localStorage:`, error);
  }
}

// Initialize with seed data if empty
export function initializeStore(): void {
  const initialized = getItem(STORAGE_KEYS.INITIALIZED, false);
  if (!initialized) {
    const employeesWithIds = SEED_EMPLOYEES.map((emp, index) => ({
      ...emp,
      id: index + 1
    }));
    setItem(STORAGE_KEYS.EMPLOYEES, employeesWithIds);
    setItem(STORAGE_KEYS.HISTORY, []);
    setItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    setItem(STORAGE_KEYS.INITIALIZED, true);
    setItem(STORAGE_KEYS.HISTORY_COUNTER, 0);
  }
}

// Employees API
export function getEmployees(): Employee[] {
  return getItem<Employee[]>(STORAGE_KEYS.EMPLOYEES, []);
}

export function getEmployee(id: number): Employee | undefined {
  const employees = getEmployees();
  return employees.find(e => e.id === id);
}

export function createEmployee(employee: Omit<Employee, 'id'>): Employee {
  const employees = getEmployees();
  const newId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
  const newEmployee = { ...employee, id: newId };
  employees.push(newEmployee);
  setItem(STORAGE_KEYS.EMPLOYEES, employees);
  return newEmployee;
}

export function updateEmployee(id: number, updates: Partial<Employee>): Employee | null {
  const employees = getEmployees();
  const index = employees.findIndex(e => e.id === id);
  if (index === -1) return null;
  employees[index] = { ...employees[index], ...updates };
  setItem(STORAGE_KEYS.EMPLOYEES, employees);
  return employees[index];
}

export function deleteEmployee(id: number): boolean {
  const employees = getEmployees();
  const filtered = employees.filter(e => e.id !== id);
  if (filtered.length === employees.length) return false;
  setItem(STORAGE_KEYS.EMPLOYEES, filtered);
  return true;
}

// Settings API
export function getSettings(): Settings {
  return getItem<Settings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
}

export function updateSettings(settings: Settings): Settings {
  setItem(STORAGE_KEYS.SETTINGS, settings);
  return settings;
}

// History API
export function getHistory(): PayrollHistory[] {
  return getItem<PayrollHistory[]>(STORAGE_KEYS.HISTORY, []);
}

export function addHistoryEntry(entry: Omit<PayrollHistory, 'id'>): PayrollHistory {
  const history = getHistory();
  const counter = getItem(STORAGE_KEYS.HISTORY_COUNTER, 0);
  const newEntry = { ...entry, id: counter + 1 };
  history.push(newEntry);
  setItem(STORAGE_KEYS.HISTORY, history);
  setItem(STORAGE_KEYS.HISTORY_COUNTER, counter + 1);
  return newEntry;
}

export function clearHistory(): void {
  setItem(STORAGE_KEYS.HISTORY, []);
}

// Bulk payroll generation
export function generatePayrollHistory(
  entries: Omit<PayrollHistory, 'id'>[]
): PayrollHistory[] {
  const history = getHistory();
  const counter = getItem<number>(STORAGE_KEYS.HISTORY_COUNTER, 0);
  
  const newEntries = entries.map((entry, index) => ({
    ...entry,
    id: counter + index + 1
  }));
  
  history.push(...newEntries);
  setItem(STORAGE_KEYS.HISTORY, history);
  setItem(STORAGE_KEYS.HISTORY_COUNTER, counter + entries.length);
  
  return newEntries;
}

// Export data for backup
export function exportAllData(): {
  employees: Employee[];
  history: PayrollHistory[];
  settings: Settings;
} {
  return {
    employees: getEmployees(),
    history: getHistory(),
    settings: getSettings()
  };
}

// Import data from backup
export function importData(data: {
  employees?: Employee[];
  history?: PayrollHistory[];
  settings?: Settings;
}): void {
  if (data.employees) setItem(STORAGE_KEYS.EMPLOYEES, data.employees);
  if (data.history) {
    setItem(STORAGE_KEYS.HISTORY, data.history);
    const maxId = data.history.reduce((max, entry) => Math.max(max, entry.id), 0);
    setItem(STORAGE_KEYS.HISTORY_COUNTER, maxId);
  }
  if (data.settings) setItem(STORAGE_KEYS.SETTINGS, data.settings);
}

// Reset to factory settings
export function resetToFactory(): void {
  setItem(STORAGE_KEYS.INITIALIZED, false);
  initializeStore();
}
