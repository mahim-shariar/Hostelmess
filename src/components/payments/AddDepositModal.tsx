import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  Hash, 
  FileText, 
  CheckCircle2, 
  User,
  Wallet
} from 'lucide-react';

export const AddDepositModal: React.FC = () => {
  const { 
    isAddDepositModalOpen, 
    setIsAddDepositModalOpen, 
    currentUser, 
    allMembers, 
    addPayment, 
    currentMess,
    t 
  } = useApp();

  const isAdmin = currentUser.role === 'admin';

  // Form states
  const [memberId, setMemberId] = useState<string>(currentUser.id);
  const [amount, setAmount] = useState<string>('2000');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [method, setMethod] = useState<'bKash' | 'Nagad' | 'Cash' | 'Bank' | 'Rocket' | 'Other'>('bKash');
  const [trxId, setTrxId] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const selectedTargetMember = allMembers.find(m => m.id === memberId) || currentUser;

  const handleQuickAddAmount = (add: number) => {
    const current = parseFloat(amount) || 0;
    setAmount(String(current + add));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return;

    setLoading(true);
    await addPayment({
      memberId: isAdmin ? memberId : currentUser.id,
      memberName: isAdmin ? selectedTargetMember.name : currentUser.name,
      amount: numAmount,
      date,
      paymentMethod: method as any,
      transactionId: trxId.trim() || undefined,
      note: note.trim() || undefined,
    });

    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setIsAddDepositModalOpen(false);
      setAmount('2000');
      setTrxId('');
      setNote('');
    }, 1000);
  };

  return (
    <Modal
      isOpen={isAddDepositModalOpen}
      onClose={() => setIsAddDepositModalOpen(false)}
      title="Add Deposit / Payment"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        
        {success ? (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              Deposit of {currentMess.currency}{amount} Recorded!
            </p>
            <p className="text-xs text-slate-500">
              Your balance and payment ledger have been updated.
            </p>
          </div>
        ) : (
          <>
            {/* Member display or selector */}
            {isAdmin ? (
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Depositing Member *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <select
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {allMembers.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name} {m.id === currentUser.id ? '(You)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Recording deposit for</span>
                    <span className="font-bold text-slate-900 dark:text-white text-xs">{currentUser.name}</span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                  Member Deposit
                </span>
              </div>
            )}

            {/* Deposit Amount */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Deposit Amount ({currentMess.currency}) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 font-bold text-emerald-600 text-sm">
                  {currentMess.currency}
                </span>
                <input
                  type="number"
                  required
                  min="1"
                  step="any"
                  placeholder="e.g. 3000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-3 py-2 text-slate-900 dark:text-white font-black text-base focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Quick Amount Chips */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {[500, 1000, 2000, 3000, 5000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(String(val))}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-600 text-slate-600 dark:text-slate-300 font-semibold text-[11px] transition-colors cursor-pointer"
                  >
                    +{val}
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Payment Method */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Deposit Date *
                </label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-2 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Payment Method *
                </label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="bKash">bKash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Cash">Cash to Manager</option>
                  <option value="Bank">Bank Transfer</option>
                  <option value="Rocket">Rocket</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Trx ID / Reference */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Transaction ID / Reference (Optional)
              </label>
              <div className="relative">
                <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. 9J29X4K1 or Received Cash by Hand"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Deposit Note (Optional)
              </label>
              <div className="relative">
                <FileText className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. Advance deposit for monthly meals"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              id="btn-submit-member-deposit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50 mt-3"
            >
              <Wallet className="w-4 h-4" />
              {loading ? 'Submitting Deposit...' : `Confirm Deposit (${currentMess.currency}${amount})`}
            </button>
          </>
        )}

      </form>
    </Modal>
  );
};
