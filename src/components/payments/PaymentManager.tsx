import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CreditCard, 
  Plus, 
  Search, 
  CheckCircle2, 
  Trash2, 
  Calendar, 
  Hash, 
  FileText,
  User
} from 'lucide-react';
import { formatMonthDisplay } from '../../lib/accounting';
import { Modal } from '../ui/Modal';

interface PaymentManagerProps {
  isAddModalOpen?: boolean;
  setIsAddModalOpen?: (open: boolean) => void;
}

export const PaymentManager: React.FC<PaymentManagerProps> = ({
  isAddModalOpen: externalAddOpen,
  setIsAddModalOpen: setExternalAddOpen,
}) => {
  const { 
    currentUser, 
    allMembers, 
    payments, 
    addPayment, 
    deletePayment, 
    selectedMonth, 
    currentMess,
    t, 
    lang,
    isMonthClosed 
  } = useApp();

  const isAdmin = currentUser.role === 'admin';
  const canAddPayment = true; // Any member or admin can record/add deposit

  const [internalAddOpen, setInternalAddOpen] = useState(false);
  const isAddOpen = externalAddOpen !== undefined ? externalAddOpen : internalAddOpen;
  const setIsAddOpen = setExternalAddOpen || setInternalAddOpen;

  const [memberFilter, setMemberFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form states
  const [formMemberId, setFormMemberId] = useState<string>(currentUser.id);
  const [formAmount, setFormAmount] = useState<string>('3000');
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formMethod, setFormMethod] = useState<'Cash' | 'bKash' | 'Nagad' | 'Bank' | 'Other'>('bKash');
  const [formTrxId, setFormTrxId] = useState<string>('');
  const [formNote, setFormNote] = useState<string>('');

  // Filter payments for month
  const monthPayments = useMemo(() => {
    return payments.filter(p => p.monthId === selectedMonth);
  }, [payments, selectedMonth]);

  const totalCollected = useMemo(() => {
    return monthPayments.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  }, [monthPayments]);

  const filteredPayments = useMemo(() => {
    return monthPayments.filter(p => {
      if (memberFilter !== 'all' && p.memberId !== memberFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.memberName.toLowerCase().includes(q) ||
          (p.transactionId && p.transactionId.toLowerCase().includes(q)) ||
          (p.note && p.note.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [monthPayments, memberFilter, searchQuery]);

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(formAmount);
    if (!amountNum || amountNum <= 0) return;

    const targetMember = allMembers.find(m => m.id === formMemberId);

    await addPayment({
      memberId: formMemberId,
      memberName: targetMember?.name || 'Member',
      amount: amountNum,
      date: formDate,
      paymentMethod: formMethod,
      transactionId: formTrxId.trim() || undefined,
      note: formNote.trim() || undefined,
    });

    setFormAmount('');
    setFormTrxId('');
    setFormNote('');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-5 pb-24 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t.paymentsDeposits}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {formatMonthDisplay(selectedMonth, lang)}
          </p>
        </div>

        {canAddPayment && !isMonthClosed && (
          <button
            id="btn-add-payment-main"
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addPayment}</span>
          </button>
        )}
      </div>

      {/* TOTAL DEPOSITS BANNER */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-md shadow-emerald-600/20 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-emerald-100 uppercase tracking-wider block mb-1">
            Total Deposits Collected ({formatMonthDisplay(selectedMonth, lang)})
          </span>
          <span className="text-2xl sm:text-3xl font-black">
            {currentMess.currency}{totalCollected.toLocaleString()}
          </span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-white">
          <CreditCard className="w-6 h-6" />
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5">
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="input-search-payments"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search member, transaction id, note..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        <select
          id="filter-payment-member"
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

      {/* PAYMENTS LIST */}
      <div className="space-y-2.5">
        {filteredPayments.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-200/80 dark:border-slate-800 text-slate-400 text-xs">
            No payments recorded yet for this month.
          </div>
        ) : (
          filteredPayments.map((pay) => (
            <div
              key={pay.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 font-bold shrink-0">
                  {pay.paymentMethod === 'bKash' ? 'bK' : pay.paymentMethod === 'Nagad' ? 'Ng' : pay.paymentMethod.charAt(0)}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {pay.memberName}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {pay.paymentMethod}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">
                    {pay.date}
                    {pay.transactionId && ` • Trx: ${pay.transactionId}`}
                  </p>

                  {pay.note && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                      "{pay.note}"
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    +{currentMess.currency}{pay.amount.toLocaleString()}
                  </span>
                </div>

                {isAdmin && !isMonthClosed && (
                  <button
                    onClick={() => deletePayment(pay.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Delete payment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* RECORD PAYMENT MODAL */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title={t.addPayment}
      >
        <form onSubmit={handleCreatePayment} className="space-y-4 text-xs">
          
          {/* Member */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Member *
            </label>
            {isAdmin ? (
              <select
                id="select-payment-member"
                value={formMemberId}
                onChange={(e) => setFormMemberId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none"
              >
                {allMembers.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            ) : (
              <div className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-semibold flex items-center justify-between">
                <span>{currentUser.name} (You)</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded font-bold uppercase">Member</span>
              </div>
            )}
          </div>

          {/* Amount & Quick presets */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              {t.amount} ({currentMess.currency}) *
            </label>
            <input
              id="input-payment-amount"
              type="number"
              step="any"
              required
              placeholder="e.g. 3000"
              value={formAmount}
              onChange={(e) => setFormAmount(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
            {/* Quick amount presets */}
            <div className="flex items-center gap-1.5 mt-2">
              {[1000, 2000, 2500, 3000, 4000].map(preset => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setFormAmount(String(preset))}
                  className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  +{preset}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              {t.date}
            </label>
            <input
              id="input-payment-date"
              type="date"
              required
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              {t.paymentMethod}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['bKash', 'Nagad', 'Cash', 'Bank'].map(method => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setFormMethod(method as any)}
                  className={`py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    formMethod === method
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Trx ID */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              {t.transactionId}
            </label>
            <input
              id="input-payment-trx"
              type="text"
              placeholder="e.g. BK9A8149XX or Cash Receipt"
              value={formTrxId}
              onChange={(e) => setFormTrxId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          {/* Note */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              {t.note}
            </label>
            <input
              id="input-payment-note"
              type="text"
              placeholder="e.g. Advance for September"
              value={formNote}
              onChange={(e) => setFormNote(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-xl"
            >
              {t.cancel}
            </button>
            <button
              id="btn-submit-add-payment"
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
