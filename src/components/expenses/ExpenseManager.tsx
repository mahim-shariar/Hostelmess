import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ReceiptText, 
  Plus, 
  Search, 
  Filter, 
  Check, 
  X, 
  Trash2, 
  ShoppingBag, 
  Zap, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Image as ImageIcon,
  ChevronDown
} from 'lucide-react';
import { formatMonthDisplay } from '../../lib/accounting';
import { Modal } from '../ui/Modal';
import { ExpenseCategoryType } from '../../types';

interface ExpenseManagerProps {
  isAddModalOpen?: boolean;
  setIsAddModalOpen?: (open: boolean) => void;
}

export const ExpenseManager: React.FC<ExpenseManagerProps> = ({
  isAddModalOpen: externalAddOpen,
  setIsAddModalOpen: setExternalAddOpen,
}) => {
  const { 
    currentUser, 
    allMembers, 
    expenses, 
    addExpense, 
    updateExpenseStatus, 
    deleteExpense, 
    selectedMonth, 
    currentMess, 
    updateMess,
    t, 
    lang,
    isMonthClosed
  } = useApp();

  const isAdmin = currentUser.role === 'admin';
  const canAddExpense = isAdmin || currentUser.permissions.addExpense;

  // Local Add Modal state if not managed externally
  const [internalAddOpen, setInternalAddOpen] = useState(false);
  const isAddOpen = externalAddOpen !== undefined ? externalAddOpen : internalAddOpen;
  const setIsAddOpen = setExternalAddOpen || setInternalAddOpen;

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [memberFilter, setMemberFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form states for Add Expense
  const [formAmount, setFormAmount] = useState<string>('');
  const [formType, setFormType] = useState<ExpenseCategoryType>('food');
  const [formCategory, setFormCategory] = useState<string>('Bazar');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formPaidBy, setFormPaidBy] = useState<string>(currentUser.id);
  const [formPaymentMethod, setFormPaymentMethod] = useState<'Cash' | 'bKash' | 'Nagad' | 'Bank' | 'Other'>('Cash');
  const [formReceiptUrl, setFormReceiptUrl] = useState<string>('');

  // Filter expenses for selected month
  const monthExpenses = useMemo(() => {
    return expenses.filter(e => e.monthId === selectedMonth);
  }, [expenses, selectedMonth]);

  // Approved totals
  const totalApprovedFood = useMemo(() => {
    return monthExpenses
      .filter(e => e.status === 'approved' && e.type === 'food')
      .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  }, [monthExpenses]);

  const totalApprovedBills = useMemo(() => {
    return monthExpenses
      .filter(e => e.status === 'approved' && e.type !== 'food')
      .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  }, [monthExpenses]);

  const totalApproved = totalApprovedFood + totalApprovedBills;

  // Apply filters
  const filteredExpenses = useMemo(() => {
    return monthExpenses.filter(e => {
      if (categoryFilter !== 'all' && e.category !== categoryFilter && e.type !== categoryFilter) return false;
      if (memberFilter !== 'all' && e.paidBy !== memberFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          e.description.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.paidByName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [monthExpenses, categoryFilter, memberFilter, searchQuery]);

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(formAmount);
    if (!amountNum || amountNum <= 0) return;

    const paidMember = allMembers.find(m => m.id === formPaidBy);

    await addExpense({
      amount: amountNum,
      type: formType,
      category: formCategory,
      description: formDescription.trim() || formCategory,
      date: formDate,
      paidBy: formPaidBy,
      paidByName: paidMember?.name || 'Member',
      paymentMethod: formPaymentMethod,
      receiptUrl: formReceiptUrl.trim() || undefined,
      status: currentMess.settings.expenseApprovalMode === 'automatic' || isAdmin ? 'approved' : 'pending',
    });

    // Reset form
    setFormAmount('');
    setFormDescription('');
    setFormReceiptUrl('');
    setIsAddOpen(false);
  };

  const handleToggleApprovalMode = async () => {
    const nextMode = currentMess.settings.expenseApprovalMode === 'automatic' ? 'require_approval' : 'automatic';
    await updateMess({
      settings: {
        ...currentMess.settings,
        expenseApprovalMode: nextMode,
      }
    });
  };

  return (
    <div className="space-y-5 pb-24 animate-in fade-in duration-200">
      
      {/* Header & Total Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t.expenseManagement}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {formatMonthDisplay(selectedMonth, lang)}
          </p>
        </div>

        {canAddExpense && !isMonthClosed && (
          <button
            id="btn-add-expense-main"
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addExpense}</span>
          </button>
        )}
      </div>

      {/* TOTAL EXPENSE HIGHLIGHT (Requirement 13) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {t.totalExpense}
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {currentMess.currency}{totalApproved.toLocaleString()}
          </span>
        </div>

        {/* Food vs Bills breakdown */}
        <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/40">
            <span className="text-slate-500 dark:text-slate-400 block">{t.foodExpense} (Bazar)</span>
            <span className="text-base font-bold text-rose-600 dark:text-rose-400">
              {currentMess.currency}{totalApprovedFood.toLocaleString()}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40">
            <span className="text-slate-500 dark:text-slate-400 block">{t.otherExpense} (Bills)</span>
            <span className="text-base font-bold text-amber-600 dark:text-amber-400">
              {currentMess.currency}{totalApprovedBills.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Approval Setting for Admin (Requirement 14) */}
        {isAdmin && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Approval Setting:</span>
              <span className="text-slate-500">
                {currentMess.settings.expenseApprovalMode === 'automatic' 
                  ? t.autoApproval 
                  : t.requireApproval}
              </span>
            </div>
            <button
              onClick={handleToggleApprovalMode}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              Switch Mode
            </button>
          </div>
        )}
      </div>

      {/* FILTER & SEARCH CONTROLS */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5">
        
        {/* Search input */}
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="input-search-expense"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`${t.search} expenses...`}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        {/* Category filter */}
        <select
          id="filter-expense-category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
        >
          <option value="all">All Categories</option>
          <option value="food">All Food (Bazar)</option>
          <option value="bills">All Utility Bills</option>
          <option value="Bazar">Bazar</option>
          <option value="Rice">Rice</option>
          <option value="Fish">Fish</option>
          <option value="Meat">Meat</option>
          <option value="Gas">Gas</option>
          <option value="Internet">Internet</option>
        </select>

        {/* Member filter */}
        <select
          id="filter-expense-member"
          value={memberFilter}
          onChange={(e) => setMemberFilter(e.target.value)}
          className="w-full sm:w-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
        >
          <option value="all">All Members</option>
          {allMembers.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      {/* EXPENSE LIST */}
      <div className="space-y-2.5">
        {filteredExpenses.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-200/80 dark:border-slate-800 text-slate-400 text-xs">
            No expenses found for this selection.
          </div>
        ) : (
          filteredExpenses.map((exp) => {
            const isFood = exp.type === 'food';
            const isPending = exp.status === 'pending';

            return (
              <div
                key={exp.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    isFood 
                      ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600' 
                      : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600'
                  }`}>
                    {isFood ? <ShoppingBag className="w-5 h-5" /> : <ReceiptText className="w-5 h-5" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {exp.category}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {exp.date}
                      </span>
                      {isPending ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                          {t.pending}
                        </span>
                      ) : exp.status === 'rejected' ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
                          {t.rejected}
                        </span>
                      ) : null}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {exp.description}
                    </p>

                    <p className="text-[11px] text-slate-400">
                      Paid by <span className="font-semibold text-slate-600 dark:text-slate-300">{exp.paidByName}</span> via {exp.paymentMethod}
                    </p>
                  </div>
                </div>

                {/* Amount & Admin action buttons */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  <div className="text-left sm:text-right">
                    <span className="text-base font-black text-slate-900 dark:text-white block">
                      {currentMess.currency}{exp.amount.toLocaleString()}
                    </span>
                  </div>

                  {/* Admin Approval controls */}
                  {isAdmin && isPending && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateExpenseStatus(exp.id, 'approved')}
                        className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 transition-colors cursor-pointer"
                        title="Approve"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => updateExpenseStatus(exp.id, 'rejected')}
                        className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 hover:bg-rose-200 transition-colors cursor-pointer"
                        title="Reject"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Admin delete button */}
                  {isAdmin && !isMonthClosed && (
                    <button
                      onClick={() => deleteExpense(exp.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete expense"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ADD EXPENSE MODAL */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title={t.addExpense}
      >
        <form onSubmit={handleCreateExpense} className="space-y-4 text-xs">
          
          {/* Amount */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              {t.amount} ({currentMess.currency}) *
            </label>
            <input
              id="input-expense-amount"
              type="number"
              step="any"
              required
              placeholder="e.g. 2500"
              value={formAmount}
              onChange={(e) => setFormAmount(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Type Toggle: Food vs Bills vs Other */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Expense Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setFormType('food');
                  setFormCategory('Bazar');
                }}
                className={`py-2 rounded-xl font-bold transition-all cursor-pointer ${
                  formType === 'food'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Food (Bazar)
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormType('bills');
                  setFormCategory('Gas');
                }}
                className={`py-2 rounded-xl font-bold transition-all cursor-pointer ${
                  formType === 'bills'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Utility Bills
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormType('other');
                  setFormCategory('Cleaning');
                }}
                className={`py-2 rounded-xl font-bold transition-all cursor-pointer ${
                  formType === 'other'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Other Cost
              </button>
            </div>
          </div>

          {/* Category Select */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              {t.category}
            </label>
            <select
              id="select-expense-cat"
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none"
            >
              {currentMess.settings.categories[formType].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              {t.description}
            </label>
            <input
              id="input-expense-desc"
              type="text"
              placeholder="e.g. 5kg rice, 2kg chicken, spices"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          {/* Date & Paid By */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {t.date}
              </label>
              <input
                id="input-expense-date"
                type="date"
                required
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {t.paidBy}
              </label>
              <select
                id="select-expense-paid-by"
                value={formPaidBy}
                onChange={(e) => setFormPaidBy(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
              >
                {allMembers.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              {t.paymentMethod}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['Cash', 'bKash', 'Nagad', 'Bank'].map(method => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setFormPaymentMethod(method as any)}
                  className={`py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                    formPaymentMethod === method
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Receipt / Photo */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              {t.receiptPhoto}
            </label>
            <input
              id="input-expense-receipt"
              type="text"
              placeholder="e.g. Receipt notes or photo URL"
              value={formReceiptUrl}
              onChange={(e) => setFormReceiptUrl(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-xl"
            >
              {t.cancel}
            </button>
            <button
              id="btn-submit-add-expense"
              type="submit"
              className="px-5 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs cursor-pointer"
            >
              {t.save}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
