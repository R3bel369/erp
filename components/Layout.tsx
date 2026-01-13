
import React, { useState } from 'react';
import { AppView, UserRole, ERPData } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  onViewChange: (view: AppView) => void;
  onLogout: () => void;
  businessName: string;
  userEmail: string;
  userRole: UserRole;
  data: ERPData;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, activeView, onViewChange, onLogout, businessName, userEmail, userRole, data
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  const lowStockItems = data.inventory.filter(i => i.quantity < 5);

  const menuItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: '📊', roles: [UserRole.ADMIN, UserRole.STAFF] },
    { id: AppView.INVENTORY, label: 'Inventory', icon: '📦', roles: [UserRole.ADMIN, UserRole.STAFF] },
    { id: AppView.SALES, label: 'Sales & POS', icon: '💰', roles: [UserRole.ADMIN, UserRole.STAFF] },
    { id: AppView.AI_INSIGHTS, label: 'AI Insights', icon: '📈', roles: [UserRole.ADMIN, UserRole.STAFF] },
    { id: AppView.HR, label: 'HR & Payroll', icon: '👥', roles: [UserRole.ADMIN] },
    { id: AppView.FINANCIALS, label: 'Financials', icon: '💎', roles: [UserRole.ADMIN] },
    { id: AppView.AUDIT_LOG, label: 'Audit Log', icon: '📋', roles: [UserRole.ADMIN] },
    { id: AppView.SETTINGS, label: 'Settings', icon: '⚙️', roles: [UserRole.ADMIN] },
  ].filter(item => item.roles.includes(userRole));

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-slate-900 text-slate-300 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col`}>
        <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/20">N</div>
          {isSidebarOpen && <h1 className="text-xl font-bold text-white tracking-tight">Nexus ERP</h1>}
        </div>
        
        <nav className="flex-1 mt-6 px-3 space-y-2 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center p-3 rounded-xl transition-all ${
                activeView === item.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'hover:bg-slate-800'
              }`}
            >
              <span className="text-xl w-6 h-6 flex items-center justify-center shrink-0">{item.icon}</span>
              {isSidebarOpen && <span className="ml-3 font-semibold text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={onLogout} className="w-full flex items-center p-3 rounded-xl hover:bg-slate-800 transition-all text-red-400">
            <span className="text-xl w-6 h-6 flex items-center justify-center shrink-0">🚪</span>
            {isSidebarOpen && <span className="ml-3 font-semibold text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-xl hover:bg-slate-50 text-slate-400">☰</button>
            <div>
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{activeView.replace('_', ' ')}</h2>
              <p className="text-lg font-bold text-slate-900">{businessName}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-all relative"
              >
                <span className="text-xl">🔔</span>
                {lowStockItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
                    {lowStockItems.length}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-100 shadow-2xl rounded-2xl z-50 overflow-hidden">
                  <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <span className="font-bold text-slate-900">Notifications</span>
                    <button onClick={() => setShowNotifications(false)}>✕</button>
                  </div>
                  <div className="max-h-60 overflow-y-auto p-2 space-y-2">
                    {lowStockItems.length > 0 ? lowStockItems.map(i => (
                      <div key={i.id} className="p-3 bg-red-50 rounded-xl border border-red-100">
                        <p className="text-sm font-bold text-red-700">Stock Alert: {i.name}</p>
                        <p className="text-xs text-red-600">Only {i.quantity} units remaining.</p>
                      </div>
                    )) : (
                      <p className="p-8 text-center text-slate-400 text-sm italic">All systems operational.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3 bg-slate-50 p-1.5 pr-4 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-lg">👤</div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900 leading-none">{userEmail.split('@')[0]}</p>
                <p className="text-[10px] font-black uppercase text-slate-400">{userRole}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 no-scrollbar bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
};
