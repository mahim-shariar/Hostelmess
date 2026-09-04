import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Utensils, 
  ShoppingBag, 
  CreditCard, 
  Scale, 
  AlertCircle, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  Plus, 
  Megaphone,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  ReceiptText,
  Clock,
  ExternalLink
} from 'lucide-react';
import { formatMonthDisplay } from '../../lib/accounting';
import { Modal } from '../ui/Modal';
import confetti from 'canvas-confetti';
import { BazaarDutyCard } from '../mess/BazaarDutyCard';
import { QuickBazaarWidget } from '../expenses/QuickBazaarWidget';

interface AdminDashboardProps {
  onGoToMeals: () => void;
  onGoToExpenses: () => void;
  onGoToMembers: () => void;
  onOpenAddExpense: () => void;
  onOpenQuickBazaar?: () => void;
  onOpenAddPayment: () => void;
  onOpenAddMember: () => void;
  onOpenNotices: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onGoToMeals,
  onGoToExpenses,
  onGoToMembers,
  onOpenAddExpense,
  onOpenQuickBazaar,
  onOpenAddPayment,
  onOpenAddMember,
  onOpenNotices,
}) => {
  const { 
    currentMess, 
    selectedMonth, 
    allMembers, 
    meals, 
    expenses, 
    monthlyCalculations, 
    isMonthClosed, 
    closeMonth, 
    reopenMonth,
    t, 
    lang 
  } = useApp();

  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [reopenModalOpen, setReopenModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Today's total meals across all members
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysMealsCount = meals
    .filter(m => m.date === todayStr)
    .reduce((acc, curr) => acc + (curr.total || 0), 0);

  // Pending expenses count
  const pendingExpenses = expenses.filter(e => e.status === 'pending');

  const handleCloseMonthAction = async () => {
    setIsProcessing(true);
    await closeMonth(selectedMonth);
    setIsProcessing(false);
    setCloseModalOpen(false);
    confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 } });
  };

  const handleReopenMonthAction = async () => {
    setIsProcessing(true);
    await reopenMonth(selectedMonth);
    setIsProcessing(false);
    setReopenModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-200">
      
      {/* Month Header & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {t.managerDashboard}
            </span>
            {isMonthClosed ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                <Lock className="w-3 h-3" /> Closed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                <Unlock className="w-3 h-3" /> Active / Open
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatMonthDisplay(selectedMonth, lang)}
          </h2>
        </div>

        {/* Close / Reopen Month CTA */}
        <div className="flex items-center gap-2">
          {isMonthClosed ? (
            <button
              id="btn-reopen-month"
              onClick={() => setReopenModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>{t.reopenMonth}</span>
            </button>
          ) : (
            <button
              id="btn-close-month"
              onClick={() => setCloseModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-600/20 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{t.closeMonth}</span>
            </button>
          )}
        </div>
      </div>

      {/* Pending approvals alert (if any) */}
      {pendingExpenses.length > 0 && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-100">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-bold">
                {pendingExpenses.length} Expense(s) waiting for approval
              </p>
              <p className="text-[11px] text-amber-700 dark:text-amber-300">
                Total: {currentMess.currency}{pendingExpenses.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={onGoToExpenses}
            className="text-xs font-bold text-amber-800 dark:text-amber-200 bg-amber-200/60 dark:bg-amber-900/60 px-3 py-1.5 rounded-xl hover:bg-amber-300 dark:hover:bg-amber-800 transition-colors cursor-pointer"
          >
            Review →
          </button>
        </div>
      )}

      {/* 9 MAIN STATS CARDS (Requirement 20) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2.5 sm:gap-4">
        
        {/* 1. Members */}
        <div 
          onClick={onGoToMembers}
          className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>{t.membersCount}</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
            {monthlyCalculations.totalMembers}
          </p>
          <span className="text-[10px] text-slate-400">Active students</span>
        </div>

        {/* 2. Today's Meals */}
        <div 
          onClick={onGoToMeals}
          className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>{t.todaysTotalMeals}</span>
            <Utensils className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
            {todaysMealsCount}
          </p>
          <span className="text-[10px] text-slate-400">{todayStr}</span>
        </div>

        {/* 3. Total Meals */}
        <div 
          onClick={onGoToMeals}
          className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>{t.totalMeals}</span>
            <Utensils className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {monthlyCalculations.totalMeals.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400">In {selectedMonth}</span>
        </div>

        {/* 4. Food Expense */}
        <div 
          onClick={onGoToExpenses}
          className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>{t.foodExpense}</span>
            <ShoppingBag className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
            {currentMess.currency}{monthlyCalculations.totalFoodExpense.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400">Bazar &amp; Groceries</span>
        </div>

        {/* 5. Other Expense */}
        <div 
          onClick={onGoToExpenses}
          className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-500 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>{t.otherExpense}</span>
            <ReceiptText className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
            {currentMess.currency}{monthlyCalculations.totalOtherExpense.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400">Gas, Net, Bills</span>
        </div>

        {/* 6. Meal Rate (HIGHLIGHT) */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-3.5 sm:p-4 rounded-2xl shadow-md shadow-emerald-600/20">
          <div className="flex items-center justify-between text-emerald-100 text-xs mb-1">
            <span className="font-semibold">{t.mealRate}</span>
            <Scale className="w-4 h-4" />
          </div>
          <p className="text-xl sm:text-3xl font-black">
            {currentMess.currency}{monthlyCalculations.mealRate}
          </p>
          <span className="text-[10px] text-emerald-100">
            Food Exp ÷ Total Meals
          </span>
        </div>

        {/* 7. Total Payments */}
        <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>{t.totalPayments}</span>
            <CreditCard className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {currentMess.currency}{monthlyCalculations.totalPayments.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400">Deposits collected</span>
        </div>

        {/* 8. Total Due */}
        <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>{t.totalDue}</span>
            <TrendingDown className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-rose-600 dark:text-rose-400">
            {currentMess.currency}{monthlyCalculations.totalDue.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400">To be collected</span>
        </div>

        {/* 9. Total Advance */}
        <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>{t.totalAdvance}</span>
            <TrendingUp className="w-4 h-4 text-cyan-500" />
          </div>
          <p className="text-lg sm:text-2xl font-black text-cyan-600 dark:text-cyan-400">
            {currentMess.currency}{monthlyCalculations.totalAdvance.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400">Prepaid balance</span>
        </div>

      </div>

      {/* QUICK ACTIONS ROW */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {t.quickActions}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            id="btn-admin-add-expense"
            onClick={onOpenQuickBazaar || onOpenAddExpense}
            className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs font-bold transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addExpense}</span>
          </button>

          <button
            id="btn-admin-record-payment"
            onClick={onOpenAddPayment}
            className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-800 dark:text-indigo-300 text-xs font-bold transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addPayment}</span>
          </button>

          <button
            id="btn-admin-add-member"
            onClick={onOpenAddMember}
            className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>{t.addMember}</span>
          </button>

          <button
            id="btn-admin-post-notice"
            onClick={onOpenNotices}
            className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-300 text-xs font-bold transition-colors cursor-pointer"
          >
            <Megaphone className="w-4 h-4" />
            <span>{t.addNotice}</span>
          </button>
        </div>
      </div>

      {/* DAILY BAZAAR INSTANT ENTRY WIDGET */}
      <QuickBazaarWidget onOpenDetailedModal={onOpenQuickBazaar || onOpenAddExpense} />

      {/* BAZAAR ROSTER */}
      <BazaarDutyCard 
        onOpenAddExpense={onOpenAddExpense}
        onOpenQuickBazaar={onOpenQuickBazaar} 
      />

      {/* QUICK MEMBER BALANCES PREVIEW (Top 5) */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Member Balances Overview
            </h3>
            <p className="text-xs text-slate-500">Fast snapshot of payments vs meals</p>
          </div>
          <button
            onClick={onGoToMembers}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            View All ({allMembers.length}) →
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {allMembers.slice(0, 5).map(member => {
            const summary = monthlyCalculations.memberResults[member.id];
            return (
              <div 
                key={member.id} 
                onClick={onGoToMembers}
                className="flex items-center justify-between py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl px-2 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{member.name}</p>
                    <p className="text-slate-400">{summary?.totalMeals ?? 0} meals • Paid: {currentMess.currency}{(summary?.paid ?? 0).toLocaleString()}</p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full font-bold ${
                  summary?.isAdvance
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                }`}>
                  {summary?.balanceFormatted}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* CLOSE MONTH CONFIRM MODAL */}
      <Modal
        isOpen={closeModalOpen}
        onClose={() => setCloseModalOpen(false)}
        title={`${t.closeMonth}: ${formatMonthDisplay(selectedMonth, lang)}`}
      >
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-100 text-xs">
            <p className="font-bold">{t.closeMonthConfirm}</p>
            <p className="mt-1">
              After closing:
              <br />• Members cannot edit meals for this month
              <br />• Old expenses &amp; payments cannot be modified
              <br />• The calculated meal rate of <strong>{currentMess.currency}{monthlyCalculations.mealRate}</strong> will be locked.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setCloseModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {t.cancel}
            </button>
            <button
              id="btn-confirm-close-month"
              disabled={isProcessing}
              onClick={handleCloseMonthAction}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm cursor-pointer"
            >
              {isProcessing ? 'Closing...' : t.closeMonth}
            </button>
          </div>
        </div>
      </Modal>

      {/* REOPEN MONTH CONFIRM MODAL */}
      <Modal
        isOpen={reopenModalOpen}
        onClose={() => setReopenModalOpen(false)}
        title={`${t.reopenMonth}: ${formatMonthDisplay(selectedMonth, lang)}`}
      >
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <p>
            Are you sure you want to reopen <strong>{formatMonthDisplay(selectedMonth, lang)}</strong>? Members with permissions will again be able to make edits.
          </p>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setReopenModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {t.cancel}
            </button>
            <button
              id="btn-confirm-reopen-month"
              disabled={isProcessing}
              onClick={handleReopenMonthAction}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm cursor-pointer"
            >
              {isProcessing ? 'Reopening...' : t.reopenMonth}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
