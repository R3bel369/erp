
import React, { useState } from 'react';
import { Employee } from '../types';

interface HRProps {
  employees: Employee[];
  onUpdate: (employees: Employee[]) => void;
}

export const HR: React.FC<HRProps> = ({ employees, onUpdate }) => {
  const [payrollSummary, setPayrollSummary] = useState<{ [key: string]: number } | null>(null);

  const calculatePayroll = () => {
    const summary: { [key: string]: number } = {};
    employees.forEach(emp => {
      summary[emp.id] = emp.hourlyRate * emp.hoursWorked;
    });
    setPayrollSummary(summary);
  };

  const updateHours = (id: string, hours: number) => {
    onUpdate(employees.map(e => e.id === id ? { ...e, hoursWorked: hours } : e));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Personnel & Payroll</h2>
          <p className="text-slate-500">Track labor costs and employee efficiency metrics.</p>
        </div>
        <button 
          onClick={calculatePayroll}
          className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold flex items-center hover:bg-slate-800 transition-all shadow-md"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Generate Payroll
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((emp) => (
          <div key={emp.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-emerald-500 transition-all">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                {emp.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{emp.name}</h3>
                <p className="text-xs text-slate-500">{emp.role}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Hourly Rate</p>
                <p className="font-bold text-slate-700">${emp.hourlyRate}/hr</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Hours Logged</p>
                <input 
                  type="number" 
                  value={emp.hoursWorked}
                  onChange={(e) => updateHours(emp.id, Number(e.target.value))}
                  className="w-full bg-slate-50 rounded border border-slate-100 px-2 py-1 font-bold text-slate-700 outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {payrollSummary && payrollSummary[emp.id] && (
              <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100 animate-fade-in">
                <p className="text-[10px] font-bold text-emerald-600 uppercase">Estimated Monthly Payout</p>
                <p className="text-2xl font-black text-emerald-700">${payrollSummary[emp.id].toLocaleString()}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {employees.length === 0 && (
        <div className="bg-white p-20 rounded-2xl border border-slate-100 text-center text-slate-400">
          No employees found in records.
        </div>
      )}
    </div>
  );
};
