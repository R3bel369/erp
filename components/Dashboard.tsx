
import React, { useState } from 'react';
import { ERPData, UserRole } from '../types';
import { getBusinessInsights } from '../services/geminiService';

interface DashboardProps {
  data: ERPData;
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isAdmin = data.user?.role === UserRole.ADMIN;

  const totalRevenue = data.sales.reduce((sum, s) => sum + s.totalPrice, 0);
  const totalCost = data.sales.reduce((sum, s) => sum + s.costBasis, 0);
  const grossProfit = totalRevenue - totalCost;
  const activeOrders = data.sales.length;
  const criticalStock = data.inventory.filter(i => i.quantity < 10).length;

  const handleGenerateInsights = async () => {
    setLoading(true);
    const result = await getBusinessInsights(data);
    setInsight(result);
    setLoading(false);
  };

  const allKpis = [
    { label: 'Total Sales', value: `$${totalRevenue.toLocaleString()}`, color: 'text-emerald-600', bg: 'bg-emerald-50', roles: [UserRole.ADMIN, UserRole.STAFF] },
    { label: 'Stock Status', value: `${data.inventory.length} SKUs`, color: 'text-blue-600', bg: 'bg-blue-50', roles: [UserRole.ADMIN, UserRole.STAFF] },
    { label: 'Total Profit', value: `$${grossProfit.toLocaleString()}`, color: 'text-purple-600', bg: 'bg-purple-50', roles: [UserRole.ADMIN] },
    { label: 'Critical Stock', value: criticalStock, color: 'text-red-600', bg: 'bg-red-50', roles: [UserRole.ADMIN] },
  ];

  const kpis = allKpis.filter(k => k.roles.includes(data.user?.role || UserRole.STAFF));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* KPI Ribbon */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${kpis.length} gap-6`}>
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-transform hover:-translate-y-1">
            <p className="text-sm font-medium text-slate-500 mb-1">{kpi.label}</p>
            <p className={`text-3xl font-extrabold ${kpi.color}`}>{kpi.value}</p>
            <div className={`h-1.5 w-full ${kpi.bg} mt-4 rounded-full overflow-hidden`}>
              <div className={`h-full ${kpi.color.replace('text', 'bg')} w-2/3`} />
            </div>
          </div>
        ))}
      </div>

      {/* AI Integration Layer - Admin Only or Everyone? Prompt implies Intelligence Layer belongs to Dashboard, keeping for now */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Nexus Intelligence Engine</h3>
            <p className="text-slate-500">Real-time summaries powered by Google Gemini</p>
          </div>
          <button 
            onClick={handleGenerateInsights}
            disabled={loading}
            className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white px-6 py-3 rounded-xl font-semibold flex items-center transition-all"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
            {loading ? 'Analyzing Data...' : 'Gemini Insights'}
          </button>
        </div>
        <div className="p-8 bg-slate-50/50 min-h-[140px] flex items-center justify-center">
          {insight ? (
            <div className="w-full animate-fade-in">
               <p className="text-lg text-slate-700 leading-relaxed italic">"{insight}"</p>
            </div>
          ) : (
            <p className="text-slate-400 text-sm">Click "Gemini Insights" for a strategic business health analysis.</p>
          )}
        </div>
      </section>

      {/* Recent Activity Mini-List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h4 className="font-bold text-lg mb-4">Recent Sales Activity</h4>
          {data.sales.length > 0 ? (
            <div className="space-y-4">
              {data.sales.slice(0, 4).map(sale => (
                <div key={sale.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                  <div>
                    <p className="font-bold text-slate-900">{sale.itemName}</p>
                    <p className="text-xs text-slate-500">{new Date(sale.timestamp).toLocaleDateString()}</p>
                  </div>
                  <p className="font-bold text-emerald-600">+${sale.totalPrice.toFixed(2)}</p>
                </div>
              ))}
            </div>
          ) : (
             <div className="py-12 text-center text-slate-400">No sales recorded yet.</div>
          )}
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h4 className="font-bold text-lg mb-4">Inventory Health</h4>
          <div className="space-y-4">
            {data.inventory.sort((a, b) => a.quantity - b.quantity).slice(0, 4).map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                <div>
                  <p className="font-bold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">SKU: {item.sku}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${item.quantity < 10 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                  {item.quantity} units
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
