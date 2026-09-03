import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileSpreadsheet, 
  Printer, 
  Download, 
  History, 
  Search, 
  ShieldAlert, 
  CheckCircle, 
  Calendar,
  Layers,
  ArrowDownToLine,
  Activity
} from 'lucide-react';
import { formatMonthDisplay } from '../../lib/accounting';

export const MonthlyReport: React.FC = () => {
  const { 
    currentMess, 
    allMembers, 
    monthlyCalculations, 
    auditLogs, 
    selectedMonth, 
    t, 
    lang 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'sheet' | 'audit'>('sheet');
  const [auditFilter, setAuditFilter] = useState<string>('all');

  // Export CSV function
  const handleExportCSV = () => {
    const headers = [
      'Member Name',
      'Phone',
      'Total Meals',
      `Meal Rate (${currentMess.currency})`,
      `Meal Cost (${currentMess.currency})`,
      `Other Cost (${currentMess.currency})`,
      `Total Cost (${currentMess.currency})`,
      `Total Paid (${currentMess.currency})`,
      'Balance Status',
      `Balance Amount (${currentMess.currency})`
    ];

    const rows = allMembers.map(m => {
      const res = monthlyCalculations.memberResults[m.id];
      return [
        `"${m.name}"`,
        `"${m.phone || ''}"`,
        res?.totalMeals ?? 0,
        monthlyCalculations.mealRate,
        res?.mealCost ?? 0,
        res?.otherCost ?? 0,
        res?.totalBill ?? 0,
        res?.paid ?? 0,
        res?.isAdvance ? 'Advance' : 'Due',
        res?.balance ?? 0
      ];
    });

    // Add totals row
    rows.push([
      '"TOTAL"',
      '""',
      monthlyCalculations.totalMeals,
      monthlyCalculations.mealRate,
      monthlyCalculations.totalFoodExpense,
      monthlyCalculations.totalOtherExpense,
      monthlyCalculations.totalExpense,
      monthlyCalculations.totalPayments,
      `"Advance: ${monthlyCalculations.totalAdvance} | Due: ${monthlyCalculations.totalDue}"`,
      monthlyCalculations.totalPayments - monthlyCalculations.totalExpense
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${currentMess.name.replace(/\s+/g, '_')}_Report_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredLogs = auditLogs.filter(log => {
    if (auditFilter !== 'all' && log.action !== auditFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-200">
      
      {/* Top Controls & Export Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t.monthlyReport}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {currentMess.name} • {formatMonthDisplay(selectedMonth, lang)}
          </p>
        </div>

        {/* Tab switcher: Sheet vs Audit */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('sheet')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'sheet'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Accounting Sheet
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Audit Log ({auditLogs.length})
            </button>
          </div>

          {activeTab === 'sheet' && (
            <div className="flex items-center gap-2">
              <button
                id="btn-export-csv"
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                <ArrowDownToLine className="w-4 h-4" />
                <span>CSV / Excel</span>
              </button>
              <button
                id="btn-print-report"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print PDF</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {activeTab === 'sheet' ? (
        <>
          {/* PRINTABLE HEADER FOR PRINT MODE */}
          <div className="hidden print:block text-center border-b pb-4 mb-4">
            <h1 className="text-2xl font-black">{currentMess.name}</h1>
            <p className="text-sm text-slate-600">Monthly Statement for {formatMonthDisplay(selectedMonth, 'en')}</p>
            <p className="text-xs text-slate-500">Meal Rate: {currentMess.currency}{monthlyCalculations.mealRate} • Total Meals: {monthlyCalculations.totalMeals}</p>
          </div>

          {/* MESS FINANCIAL SUMMARY BAR (Requirement 23) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] text-slate-400 font-semibold block">{t.totalMeals}</span>
              <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {monthlyCalculations.totalMeals}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] text-slate-400 font-semibold block">{t.mealRate}</span>
              <span className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400">
                {currentMess.currency}{monthlyCalculations.mealRate}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] text-slate-400 font-semibold block">{t.totalExpense}</span>
              <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {currentMess.currency}{monthlyCalculations.totalExpense.toLocaleString()}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] text-slate-400 font-semibold block">{t.totalPayments}</span>
              <span className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400">
                {currentMess.currency}{monthlyCalculations.totalPayments.toLocaleString()}
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] text-slate-400 font-semibold block">Total Due / Advance</span>
              <span className="text-xs font-bold block text-rose-600">
                Due: {currentMess.currency}{monthlyCalculations.totalDue.toLocaleString()}
              </span>
              <span className="text-xs font-bold block text-cyan-600">
                Adv: {currentMess.currency}{monthlyCalculations.totalAdvance.toLocaleString()}
              </span>
            </div>
          </div>

          {/* FINAL ACCOUNTING TABLE (Requirement 23) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 font-bold uppercase tracking-wider text-slate-500">
                  <th className="p-3.5 pl-4">Member</th>
                  <th className="p-3.5 text-center">Meals</th>
                  <th className="p-3.5 text-right">Meal Cost</th>
                  <th className="p-3.5 text-right">Other Cost</th>
                  <th className="p-3.5 text-right">Total Cost</th>
                  <th className="p-3.5 text-right">Paid</th>
                  <th className="p-3.5 text-right pr-4">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {allMembers.map((member) => {
                  const res = monthlyCalculations.memberResults[member.id];
                  return (
                    <tr key={member.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-3.5 pl-4 font-bold text-slate-900 dark:text-white">
                        {member.name}
                      </td>
                      <td className="p-3.5 text-center text-slate-700 dark:text-slate-300">
                        {res?.totalMeals ?? 0}
                      </td>
                      <td className="p-3.5 text-right text-slate-700 dark:text-slate-300">
                        {currentMess.currency}{(res?.mealCost ?? 0).toLocaleString()}
                      </td>
                      <td className="p-3.5 text-right text-slate-700 dark:text-slate-300">
                        {currentMess.currency}{(res?.otherCost ?? 0).toLocaleString()}
                      </td>
                      <td className="p-3.5 text-right font-semibold text-slate-900 dark:text-white">
                        {currentMess.currency}{(res?.totalBill ?? 0).toLocaleString()}
                      </td>
                      <td className="p-3.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                        {currentMess.currency}{(res?.paid ?? 0).toLocaleString()}
                      </td>
                      <td className="p-3.5 text-right pr-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                          res?.isAdvance
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        }`}>
                          {res?.balanceFormatted}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {/* TOTAL FOOTER ROW */}
                <tr className="bg-slate-50 dark:bg-slate-800/80 font-black text-slate-900 dark:text-white border-t-2 border-slate-300 dark:border-slate-700">
                  <td className="p-3.5 pl-4 uppercase">Total</td>
                  <td className="p-3.5 text-center">{monthlyCalculations.totalMeals}</td>
                  <td className="p-3.5 text-right">{currentMess.currency}{monthlyCalculations.totalFoodExpense.toLocaleString()}</td>
                  <td className="p-3.5 text-right">{currentMess.currency}{monthlyCalculations.totalOtherExpense.toLocaleString()}</td>
                  <td className="p-3.5 text-right">{currentMess.currency}{monthlyCalculations.totalExpense.toLocaleString()}</td>
                  <td className="p-3.5 text-right text-emerald-600 dark:text-emerald-400">
                    {currentMess.currency}{monthlyCalculations.totalPayments.toLocaleString()}
                  </td>
                  <td className="p-3.5 text-right pr-4">
                    <span className="text-[11px]">
                      Adv: {monthlyCalculations.totalAdvance} / Due: {monthlyCalculations.totalDue}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* AUDIT LOG VIEW (Requirement 25) */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Audit trail tracks meal updates, expenses, payments and month closings.
            </span>
            <select
              value={auditFilter}
              onChange={(e) => setAuditFilter(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-1.5 focus:outline-none"
            >
              <option value="all">All Actions</option>
              <option value="meal_update">Meal Updates</option>
              <option value="expense_add">Expense Added</option>
              <option value="payment_add">Payment Added</option>
              <option value="month_close">Month Closed</option>
            </select>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 divide-y divide-slate-100 dark:divide-slate-800">
            {filteredLogs.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-400">No logs recorded yet.</p>
            ) : (
              filteredLogs.map(log => (
                <div key={log.id} className="py-3 flex items-start gap-3 text-xs">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 text-slate-600 dark:text-slate-400">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {log.details}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      By <span className="font-medium text-slate-600 dark:text-slate-300">{log.userName}</span> • {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
};
