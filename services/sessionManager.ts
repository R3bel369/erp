
import { ERPData, UserRole, AuditEntry, InventoryItem, Sale, ERPSettings, Expense, Employee } from '../types';

const STORAGE_KEY = 'nexus_erp_data_v2';

const INITIAL_DATA: ERPData = {
  inventory: [
    { id: '1', sku: 'SKU-001', name: 'MacBook Pro M3', quantity: 15, cost: 1200, price: 1999 },
    { id: '2', sku: 'SKU-002', name: 'Dell UltraSharp Monitor', quantity: 5, cost: 300, price: 499 },
    { id: '3', sku: 'SKU-003', name: 'Logitech MX Master 3', quantity: 50, cost: 45, price: 99 }
  ],
  sales: [],
  employees: [
    { id: '1', name: 'Sarah Chen', role: 'Sales Lead', hourlyRate: 35, hoursWorked: 160 },
    { id: '2', name: 'Alex Rivera', role: 'Inventory Manager', hourlyRate: 28, hoursWorked: 155 }
  ],
  expenses: [],
  auditLogs: [],
  settings: {
    vatRate: 15
  },
  user: null
};

const PREDEFINED_USERS = [
  { email: 'admin@erp.com', password: 'admin123', role: UserRole.ADMIN },
  { email: 'staff@erp.com', password: 'staff123', role: UserRole.STAFF }
];

export class SessionManager {
  static getData(): ERPData {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      this.saveData(INITIAL_DATA);
      return INITIAL_DATA;
    }
    return JSON.parse(raw);
  }

  static saveData(data: ERPData): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  static addAuditLog(action: string): void {
    const data = this.getData();
    if (!data.user) return;
    const entry: AuditEntry = {
      id: Date.now().toString(),
      user: data.user.email,
      action,
      timestamp: new Date().toISOString()
    };
    data.auditLogs = [entry, ...data.auditLogs].slice(0, 100); // Keep last 100
    this.saveData(data);
  }

  static login(email: string, password: string): ERPData | null {
    const userMatch = PREDEFINED_USERS.find(u => u.email === email && u.password === password);
    if (!userMatch) return null;

    const data = this.getData();
    data.user = { 
      email: userMatch.email, 
      role: userMatch.role,
      businessName: 'Nexus Global ERP',
      isLoggedIn: true 
    };
    this.saveData(data);
    this.addAuditLog('User Logged In');
    return data;
  }

  static logout(): ERPData {
    this.addAuditLog('User Logged Out');
    const data = this.getData();
    data.user = null;
    this.saveData(data);
    return data;
  }

  static updateInventory(items: InventoryItem[]): ERPData {
    const data = this.getData();
    data.inventory = items;
    this.saveData(data);
    return data;
  }

  static addSale(sale: Sale, updatedInventory: InventoryItem[]): ERPData {
    const data = this.getData();
    data.sales = [sale, ...data.sales];
    data.inventory = updatedInventory;
    this.saveData(data);
    this.addAuditLog(`Processed Sale: ${sale.itemName} x ${sale.quantitySold}`);
    return data;
  }

  static addExpense(expense: Expense): ERPData {
    const data = this.getData();
    data.expenses = [expense, ...data.expenses];
    this.saveData(data);
    this.addAuditLog(`Expense Logged: $${expense.amount} (${expense.category})`);
    return data;
  }

  // Fix: Added updateEmployees method to resolve the property access error in App.tsx
  static updateEmployees(employees: Employee[]): ERPData {
    const data = this.getData();
    data.employees = employees;
    this.saveData(data);
    this.addAuditLog(`Personnel records updated: ${employees.length} entries`);
    return data;
  }

  static updateSettings(settings: ERPSettings): ERPData {
    const data = this.getData();
    data.settings = settings;
    this.saveData(data);
    this.addAuditLog(`Settings Updated: VAT Rate ${settings.vatRate}%`);
    return data;
  }
}
