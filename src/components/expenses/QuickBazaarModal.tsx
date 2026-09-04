import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { 
  ShoppingBag, 
  Calendar, 
  User, 
  CreditCard, 
  Check, 
  Sparkles, 
  Plus, 
  AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuickBazaarModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultShopperId?: string;
  onSuccess?: () => void;
}

const QUICK_BAZAAR_CHIPS = [
  'Chicken & Vegetables',
  'Fish & Bazar',
  'Rice & Oil',
  'Eggs & Potatoes',
  'Fresh Veg & Spices',
  'Breakfast items'
];

export const QuickBazaarModal: React.FC<QuickBazaarModalProps> = ({
  isOpen,
  onClose,
  defaultShopperId,
  onSuccess
}) => {
  const { 
    currentUser, 
    allMembers, 
    addExpense, 
    currentMess, 
    isMonthClosed,
    t,
    lang 
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(todayStr);
  const [paidBy, setPaidBy] = useState<string>(defaultShopperId || currentUser.id);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'bKash' | 'Nagad' | 'Bank'>('Cash');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Sync shopper if defaultShopperId or currentUser changes
  useEffect(() => {
    if (isOpen) {
      setPaidBy(defaultShopperId || currentUser.id);
      setDate(todayStr);
      setError(null);
      setSuccess(false);
    }
  }, [isOpen, defaultShopperId, currentUser.id, todayStr]);

  const handleChipClick = (chip: string) => {
    if (!description) {
      setDescription(chip);
    } else if (!description.toLowerCase().includes(chip.toLowerCase())) {
      setDescription(`${description}, ${chip}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);

    if (!amountNum || amountNum <= 0) {
      setError(lang === 'bn' ? 'সঠিক টাকার পরিমাণ লিখুন' : 'Please enter a valid expense amount');
      return;
    }

    if (isMonthClosed) {
      setError(lang === 'bn' ? 'এই মাসের হিসাব বন্ধ করা হয়েছে' : 'Current month is closed for new entries');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payer = allMembers.find(m => m.id === paidBy) || currentUser;
      const isAdmin = currentUser.role === 'admin';
      const autoApprove = currentMess.settings.expenseApprovalMode === 'automatic';

      await addExpense({
        amount: amountNum,
        type: 'food',
        category: 'Bazar',
        description: description.trim() || (lang === 'bn' ? 'দৈনিক বাজার' : 'Daily Bazar'),
        date,
        paidBy: payer.id,
        paidByName: payer.name,
        paymentMethod,
        status: isAdmin || autoApprove ? 'approved' : 'pending'
      });

      setSuccess(true);
      confetti({ particleCount: 35, spread: 45, origin: { y: 0.7 } });

      setTimeout(() => {
        setAmount('');
        setDescription('');
        setLoading(false);
        setSuccess(false);
        onClose();
        if (onSuccess) onSuccess();
      }, 700);

    } catch (err: any) {
      setError(err?.message || 'Failed to record expense. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={lang === 'bn' ? 'তাত্ক্ষণিক বাজার এন্ট্রি' : 'Quick Bazar Entry'}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs font-bold animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              {lang === 'bn' 
                ? `বাজার খরচ ${currentMess.currency}${amount} সফলভাবে যোগ হয়েছে!` 
                : `Bazar cost of ${currentMess.currency}${amount} recorded successfully!`}
            </span>
          </div>
        )}

        {/* 1. Large Amount Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            {lang === 'bn' ? 'বাজারের মোট খরচ *' : 'Total Bazar Cost *'}
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xl font-black text-emerald-600 dark:text-emerald-400">
              {currentMess.currency}
            </span>
            <input
              type="number"
              step="any"
              min="1"
              required
              autoFocus
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-black text-2xl tracking-tight focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
            />
          </div>
        </div>

        {/* 2. Items Bought / Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            {lang === 'bn' ? 'কী কী কেনা হয়েছে? (নোট)' : 'What was bought? (Items / Note)'}
          </label>
          <input
            type="text"
            placeholder={lang === 'bn' ? 'যেমন: মুরগি ২কেজি, ডিম, সবজি, সয়াবিন তেল' : 'e.g. Broiler chicken 2kg, eggs, fresh veg, oil'}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />

          {/* Quick chips */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {QUICK_BAZAAR_CHIPS.map(chip => (
              <button
                type="button"
                key={chip}
                onClick={() => handleChipClick(chip)}
                className="px-2 py-0.8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-[10px] font-medium transition-colors cursor-pointer"
              >
                + {chip}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Shopper & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Shopper / Paid By */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>{lang === 'bn' ? 'বাজার কে করেছেন?' : 'Shopper (Paid By)'}</span>
              </span>
            </label>
            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {allMembers.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} {m.id === currentUser.id ? '(You)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{lang === 'bn' ? 'বাজারের তারিখ' : 'Date'}</span>
              </span>
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* 4. Payment Method */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            <span className="flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-slate-400" />
              <span>{lang === 'bn' ? 'পরিশোধ মাধ্যম' : 'Payment Method'}</span>
            </span>
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(['Cash', 'bKash', 'Nagad', 'Bank'] as const).map(method => (
              <button
                type="button"
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  paymentMethod === method
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Submit button */}
        <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {lang === 'bn' ? 'বাতিল' : 'Cancel'}
          </button>
          <button
            type="submit"
            id="btn-submit-quick-bazaar"
            disabled={loading || !amount}
            className="flex-1 sm:flex-none px-6 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <span>{lang === 'bn' ? 'সংরক্ষণ হচ্ছে...' : 'Saving...'}</span>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>{lang === 'bn' ? 'বাজার খরচ সংরক্ষণ করুন' : 'Record Bazar Cost'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
