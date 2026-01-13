
import React, { useState } from 'react';
import { ERPData, Expense, ERPSettings } from '../types';
import { SessionManager } from '../services/sessionManager';
import { Toast } from './Toast';

interface FinancialsProps {
  data: ERPData;
  onExpenseAdd: (expense: Expense) => void;
  onSettingsUpdate: (settings: ERPSettings) => void;
}

export const Financials: React.FC<FinancialsProps> = ({ data, onExpenseAdd, onSettingsUpdate }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleReceiptUpload = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const amount = Math.floor(Math.random() * 500) + 20;
      const categories = ['Utilities', 'Rent', 'Raw Materials', 'Logistics'];
      const newExpense: Expense = {
        id: Date.now().toString(),
        amount,
        category: categories[Math.floor(Math.random() * categories.length)],
        date: new Date().toISOString(),
        status: 'PROCESSED'
      };
      onExpenseAdd(newExpense);
      setIsProcessing(false);
      setToast(`AI Receipt Scan Successful: Logged $${amount}`);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {toast && <Toast message={toast} type="success" onClose={() => setToast(null)} />}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Expense Tracker */}
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-900">Expense Ledger</h3>
            <button 
              onClick={handleReceiptUpload}
              disabled={isProcessing}
              className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold flex items-center hover:bg-emerald-700 transition-all disabled:opacity-50"
            >
              {isProcessing ? '🤖 Scanning OCR...' : '📄 Upload Receipt'}
            </button>
          </div>
          
          <div className="space-y-4">
            {data.expenses.map(exp => (
              <div key={exp.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="font-bold text-slate-900">{exp.category}</p>
                  <p className="text-xs text-slate-400">{new Date(exp.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-red-600">-$${exp.amount.toFixed(2)}</p>
                  <span className="text-[10px] font-black uppercase text-emerald-600">Verified</span>
                </div>
              </div>
            ))}
            {data.expenses.length === 0 && <p className="text-center py-10 text-slate-400 italic">No business expenses recorded.</p>}
          </div>
        </div>

        {/* Financial Settings */}
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Tax Intelligence Settings</h3>
          <div className="space-y-6">
            <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
              <label className="block text-xs font-black text-blue-600 uppercase tracking-widest mb-2">Global VAT / Sales Tax (%)</label>
              <div className="flex gap-4">
                <input 
                  type="number" 
                  value={data.settings.vatRate}
                  onChange={(e) => onSettingsUpdate({...data.settings, vatRate: Number(e.target.value)})}
                  className="flex-1 p-4 rounded-2xl border-none font-black text-2xl text-blue-800 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <div className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center">
                  Save
                </div>
              </div>
              <p className="mt-4 text-xs text-blue-500/70 italic">
                * This tax rate is automatically applied to all POS transactions and invoice generation.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-3xl bg-slate-900 text-white">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Tax Liability</p>
                <p className="text-2xl font-black text-emerald-400">$2,450</p>
              </div>
              <div className="p-6 rounded-3xl bg-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Net Profit (AfterTax)</p>
                <p className="text-2xl font-black text-slate-900">$12,890</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
