
export enum AppView {
  DASHBOARD = 'dashboard',
  INVENTORY = 'inventory',
  SALES = 'sales',
  HR = 'hr',
  FINANCIALS = 'financials',
  AI_INSIGHTS = 'ai_insights',
  AUDIT_LOG = 'audit_log',
  SETTINGS = 'settings'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF'
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  cost: number;
  price: number;
  predictedStockOutDays?: number; // Calculated field
}

export interface Sale {
  id: string;
  itemId: string;
  itemName: string;
  quantitySold: number;
  totalPrice: number;
  costBasis: number;
  taxAmount: number;
  timestamp: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  hourlyRate: number;
  hoursWorked: number;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  status: 'PENDING' | 'PROCESSED';
}

export interface AuditEntry {
  id: string;
  user: string;
  action: string;
  timestamp: string;
}

export interface UserSession {
  email: string;
  role: UserRole;
  businessName: string;
  isLoggedIn: boolean;
}

export interface ERPSettings {
  vatRate: number;
}

export interface ERPData {
  inventory: InventoryItem[];
  sales: Sale[];
  employees: Employee[];
  expenses: Expense[];
  auditLogs: AuditEntry[];
  settings: ERPSettings;
  user: UserSession | null;
}
