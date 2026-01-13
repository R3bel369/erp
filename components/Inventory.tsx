
import React, { useState } from 'react';
import { InventoryItem, UserRole } from '../types';
import { Toast } from './Toast';
import { ScannerModal } from './ScannerModal';
import { SessionManager } from '../services/sessionManager';

interface InventoryProps {
  items: InventoryItem[];
  userRole: UserRole;
  onUpdate: (items: InventoryItem[]) => void;
}

export const Inventory: React.FC<InventoryProps> = ({ items, userRole, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    name: '', sku: '', quantity: 0, cost: 0, price: 0
  });

  const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim());
      const imported: InventoryItem[] = lines.slice(1).map(line => {
        const [name, sku, qty, cost, price] = line.split(',');
        return {
          id: Math.random().toString(36).substr(2, 9),
          name: name.trim(),
          sku: sku.trim(),
          quantity: parseInt(qty),
          cost: parseFloat(cost),
          price: parseFloat(price)
        };
      });
      onUpdate([...imported, ...items]);
      SessionManager.addAuditLog(`Bulk Imported ${imported.length} Items`);
    };
    reader.readAsText(file);
  };

  const handleScan = (code: string) => {
    setShowScanner(false);
    setError(`Item identified: ${code}. Link to database pending...`);
    SessionManager.addAuditLog(`Scanner Used: Identfied ${code}`);
  };

  const calculateStockOut = (item: InventoryItem) => {
    // Simulated prediction: 1 unit sold per day baseline
    const days = Math.floor(item.quantity / 1.5);
    return days < 3 ? 'URGENT' : `${days} days`;
  };

  return (
    <div className="space-y-6">
      {error && <Toast message={error} type="error" onClose={() => setError(null)} />}
      {showScanner && <ScannerModal onClose={() => setShowScanner(false)} onScan={handleScan} />}
      
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Inventory Intel</h2>
          <p className="text-slate-500">Managing {items.length} active stock units.</p>
        </div>
        <div className="flex gap-2">
          <label className="cursor-pointer bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center">
            📥 Import CSV
            <input type="file" accept=".csv" className="hidden" onChange={handleCsvImport} />
          </label>
          <button 
            onClick={() => setShowScanner(true)}
            className="bg-slate-50 text-slate-900 border border-slate-200 px-4 py-2.5 rounded-xl font-bold hover:bg-slate-100 transition-all flex items-center"
          >
            📸 Scan IoT
          </button>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
          >
            + Add SKU
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Product Details</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">SKU</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase text-right">Current Qty</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase text-center">Predicted Stock-out</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase text-right">MSRP</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="text-[10px] text-slate-400">Database Entry: #{item.id.substr(0, 6)}</p>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{item.sku}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-black ${item.quantity < 5 ? 'text-red-500' : 'text-slate-900'}`}>
                      {item.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${item.quantity < 5 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-blue-50 text-blue-600'}`}>
                      {calculateStockOut(item)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-black text-emerald-600">${item.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
