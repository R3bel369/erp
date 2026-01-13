
import React, { useState } from 'react';
import { AppView, ERPData, UserRole, Sale, InventoryItem, Expense, ERPSettings } from './types';
import { SessionManager } from './services/sessionManager';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { Sales } from './components/Sales';
import { HR } from './components/HR';
import { Financials } from './components/Financials';
import { AIInsights } from './components/AIInsights';
import { AuditLog } from './components/AuditLog';
import { Auth } from './components/Auth';
import { Toast } from './components/Toast';

const App: React.FC = () => {
  const [data, setData] = useState<ERPData>(SessionManager.getData());
  const [activeView, setActiveView] = useState<AppView>(AppView.DASHBOARD);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = (email: string, password: string) => {
    const newData = SessionManager.login(email, password);
    if (newData) {
      setData(newData);
      setLoginError(null);
      setToast({ message: `Access granted: Authenticated as ${newData.user?.role}`, type: 'success' });
    } else {
      setLoginError("Invalid credentials. Please use the predefined Admin or Staff accounts.");
    }
  };

  const handleLogout = () => {
    const newData = SessionManager.logout();
    setData(newData);
    setActiveView(AppView.DASHBOARD);
  };

  const handleInventoryUpdate = (items: InventoryItem[]) => {
    const newData = SessionManager.updateInventory(items);
    setData(newData);
    setToast({ message: 'Inventory state synchronized.', type: 'success' });
  };

  const handleSaleComplete = (sale: Sale, updatedInventory: InventoryItem[]) => {
    const newData = SessionManager.addSale(sale, updatedInventory);
    setData(newData);
    setToast({ message: 'Transaction verified and logged.', type: 'success' });
  };

  const handleExpenseAdd = (expense: Expense) => {
    const newData = SessionManager.addExpense(expense);
    setData(newData);
  };

  const handleSettingsUpdate = (settings: ERPSettings) => {
    const newData = SessionManager.updateSettings(settings);
    setData(newData);
    setToast({ message: 'System settings updated.', type: 'success' });
  };

  if (!data.user?.isLoggedIn) {
    return <Auth onLogin={handleLogin} error={loginError} />;
  }

  const renderView = () => {
    switch (activeView) {
      case AppView.DASHBOARD:
        return <Dashboard data={data} />;
      case AppView.INVENTORY:
        return <Inventory items={data.inventory} userRole={data.user!.role} onUpdate={handleInventoryUpdate} />;
      case AppView.SALES:
        return <Sales inventory={data.inventory} sales={data.sales} settings={data.settings} onSaleComplete={handleSaleComplete} />;
      case AppView.AI_INSIGHTS:
        return <AIInsights data={data} />;
      case AppView.HR:
        return <HR employees={data.employees} onUpdate={(e) => setData(SessionManager.updateEmployees(e))} />;
      case AppView.FINANCIALS:
        return <Financials data={data} onExpenseAdd={handleExpenseAdd} onSettingsUpdate={handleSettingsUpdate} />;
      case AppView.AUDIT_LOG:
        return <AuditLog logs={data.auditLogs} />;
      default:
        return <Dashboard data={data} />;
    }
  };

  return (
    <Layout 
      activeView={activeView} 
      onViewChange={setActiveView} 
      onLogout={handleLogout}
      businessName={data.user.businessName}
      userEmail={data.user.email}
      userRole={data.user.role}
      data={data}
    >
      {renderView()}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </Layout>
  );
};

export default App;
