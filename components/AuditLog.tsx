
import React from 'react';
import { AuditEntry } from '../types';

interface AuditLogProps {
  logs: AuditEntry[];
}

export const AuditLog: React.FC<AuditLogProps> = ({ logs }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">System Audit Trail</h2>
          <p className="text-slate-500">Immutable record of all business critical operations.</p>
        </div>
        <div className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">
          Admin Level Access Required
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Timestamp</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Principal User</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Operation Detail</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase text-right">Integrity Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-xs text-slate-500">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                  {log.user}
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold">
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-mono text-[10px] text-slate-300">
                  SHA-256_{log.id.substr(0, 8)}...
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="py-20 text-center text-slate-400 italic">No events logged in this session.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
