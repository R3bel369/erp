
import React, { useState } from 'react';
import { InventoryItem, Sale, ERPSettings } from '../types';
import { Toast } from './Toast';

interface SalesProps {
  inventory: InventoryItem[];
  sales: Sale[];
  settings: ERPSettings;
  onSaleComplete: (sale: Sale, updatedInventory: InventoryItem[]) => void;
}

export const Sales: React.FC<SalesProps> = ({ inventory, sales, settings, onSaleComplete }) => {
  const [selectedItemId, setSelectedItemId] = useState('');
  const [qtySold, setQtySold] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const handleSaleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item = inventory.find(i => i.id === selectedItemId);
    
    if (!item) return;

    if (qtySold > item.quantity) {
      setError(`Stock Error: Only ${item.quantity} units available.`);
      return;
    }

    const subtotal = item.price * qtySold;
    const tax = subtotal * (settings.vatRate / 100);

    const newSale: Sale = {
      id: Date.now().toString(),
      itemId: item.id,
      itemName: item.name,
      quantitySold: qtySold,
      totalPrice: subtotal + tax,
      costBasis: item.cost * qtySold,
      taxAmount: tax,
      timestamp: new Date().toISOString()
    };

    const updatedInventory = inventory.map(i => 
      i.id === item.id ? { ...i, quantity: i.quantity - qtySold } : i
    );

    onSaleComplete(newSale, updatedInventory);
    setSelectedItemId('');
    setQtySold(1);
  };

  const printInvoice = (sale: Sale) => {
    const printContent = `
      NEXUS ERP - OFFICIAL INVOICE
      ----------------------------
      Date: ${new Date(sale.timestamp).toLocaleString()}
      ID: ${sale.id}
      
      Item: ${sale.itemName}
      Qty: ${sale.quantitySold}
      Subtotal: $${(sale.totalPrice - sale.taxAmount).toFixed(2)}
      Tax (${settings.vatRate}%): $${sale.taxAmount.toFixed(2)}
      
      GRAND TOTAL: $${sale.totalPrice.toFixed(2)}
      ----------------------------
      Thank you for your business.
    `;
    const win = window.open('', '', 'width=400,height=600');
    win?.document.write(`<pre>${printContent}</pre>`);
    win?.print();
    win?.close();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {error && <Toast type="error" message={error} onClose={() => setError(null)} />}
      
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <h2 className="text-2xl font-black text-slate-900 mb-6">Point of Sale</h2>
          <form onSubmit={handleSaleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Product</label>
              <select 
                required
                value={selectedItemId}
                onChange={e => setSelectedItemId(e.target.value)}
                className="w-full p-4 rounded-2xl border border-slate-100 focus:ring-4 focus:ring-emerald-500/10 outline-none bg-slate-50 font-bold"
              >
                <option value="">Inventory Lookup...</option>
                {inventory.map(item => (
                  <option key={item.id} value={item.id} disabled={item.quantity === 0}>
                    {item.name} — ${item.price.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Quantity</label>
              <input required type="number" min="1" value={qtySold} onChange={e => setQtySold(Number(e.target.value))} className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 font-bold" />
            </div>

            {selectedItemId && (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-2">
                <div className="flex justify-between text-xs font-bold text-emerald-600">
                  <span>Subtotal:</span>
                  <span>$${((inventory.find(i => i.id === selectedItemId)?.price || 0) * qtySold).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-emerald-600">
                  <span>VAT (${settings.vatRate}%):</span>
                  <span>$${(((inventory.find(i => i.id === selectedItemId)?.price || 0) * qtySold) * (settings.vatRate/100)).toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-emerald-200 flex justify-between">
                  <span className="font-black text-emerald-900 uppercase text-xs">Total Due:</span>
                  <span className="font-black text-emerald-900">
                    $${(((inventory.find(i => i.id === selectedItemId)?.price || 0) * qtySold) * (1 + settings.vatRate/100)).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            <button type="submit" disabled={!selectedItemId} className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl transition-all shadow-xl disabled:opacity-50">
              ⚡ Finalize Transaction
            </button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
             <h2 className="text-xl font-black text-slate-900">POS Ledger</h2>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase">Item</th>
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase text-right">Tax Paid</th>
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase text-right">Revenue</th>
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase text-center">Invoicing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-4">
                    <p className="font-bold text-slate-900">{sale.itemName}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-black">x{sale.quantitySold}</p>
                  </td>
                  <td className="px-8 py-4 text-right text-xs font-bold text-slate-400">${sale.taxAmount.toFixed(2)}</td>
                  <td className="px-8 py-4 text-right font-black text-emerald-600">${sale.totalPrice.toFixed(2)}</td>
                  <td className="px-8 py-4 text-center">
                    <button onClick={() => printInvoice(sale)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all text-xl" title="Print Invoice">📄</button>
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
