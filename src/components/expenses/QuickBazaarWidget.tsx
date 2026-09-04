import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShoppingBag, 
  Plus, 
  Check, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuickBazaarWidgetProps {
  onOpenDetailedModal?: () => void;
}

export const QuickBazaarWidget: React.FC<QuickBazaarWidgetProps> = ({ onOpenDetailedModal }) => {
  const { 
    currentUser, 
    allMembers, 
    expenses, 
    addExpense, 
    currentMess, 
    isMonthClosed,
    selectedMonth,
    t, 
    lang 
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Today's food/bazaar expenses
  const todaysBazaarExpenses = useMemo(() => {
    return expenses.filter(e => e.date === todayStr && (e.type === 'food' || e.category === 'Bazar'));
  }, [expenses, todayStr]);

  const todaysTotalBazaar = useMemo(() => {
    return todaysBazaarExpenses
      .filter(e => e.status !== 'rejected')
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  }, [todaysBazaarExpenses]);

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);

    if (!amountNum || amountNum <= 0) {
      setFeedback(lang === 'bn' ? 'টাকার পরিমাণ লিখুন' : 'Enter amount');
      setIsSuccess(false);
      return;
    }

    if (isMonthClosed) {
      setFeedback(lang === 'bn' ? 'মাস বন্ধ আছে' : 'Month is closed');
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const isAdmin = currentUser.role === 'admin';
      const autoApprove = currentMess.settings.expenseApprovalMode === 'automatic';

      await addExpense({
        amount: amountNum,
        type: 'food',
        category: 'Bazar',
        description: description.trim() || (lang === 'bn' ? 'আজকের বাজার' : "Today's Bazar"),
        date: todayStr,
        paidBy: currentUser.id,
        paidByName: currentUser.name,
        paymentMethod: 'Cash',
        status: isAdmin || autoApprove ? 'approved' : 'pending'
      });

      confetti({ particleCount: 25, spread: 35, origin: { y: 0.8 } });
      setAmount('');
      setDescription('');
      setIsSuccess(true);
      setFeedback(lang === 'bn' ? 'বাজার খরচ যোগ হয়েছে!' : 'Bazar logged instantly!');

      setTimeout(() => {
        setFeedback(null);
        setIsSuccess(false);
      }, 3000);
    } catch (err: any) {
      setIsSuccess(false);
      setFeedback(err?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/90 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs border border-emerald-500/20 dark:border-emerald-500/20 space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                {lang === 'bn' ? 'দ্রুত বাজার এন্ট্রি' : 'Quick Bazar Entry'}
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50">
                Instant Log
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {lang === 'bn' ? 'পেজ না বদলিয়েই খরচ এন্ট্রি করুন' : 'Record daily shopping without leaving this page'}
            </p>
          </div>
        </div>

        {/* Today's Bazar tally */}
        <div className="text-right shrink-0">
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
            {lang === 'bn' ? 'আজকের বাজার' : "Today's Total"}
          </span>
          <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
            {currentMess.currency}{todaysTotalBazaar.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Inline Quick Form */}
      <form onSubmit={handleQuickSubmit} className="flex flex-col sm:flex-row gap-2">
        {/* Amount Input */}
        <div className="relative sm:w-36 shrink-0">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-emerald-600 dark:text-emerald-400 text-sm">
            {currentMess.currency}
          </span>
          <input
            type="number"
            step="any"
            min="1"
            required
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full pl-8 pr-3 py-2 sm:py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Items Input */}
        <div className="flex-1 min-w-0">
          <input
            type="text"
            placeholder={lang === 'bn' ? 'যেমন: মুরগি, আলু, তেল' : 'e.g. Chicken, fresh veg, eggs, oil'}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 sm:py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          id="btn-widget-quick-save-bazaar"
          disabled={loading || !amount}
          className="px-4 py-2 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          {loading ? (
            <span>...</span>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'যোগ করুন' : 'Add Bazar'}</span>
            </>
          )}
        </button>

        {/* More options button */}
        {onOpenDetailedModal && (
          <button
            type="button"
            id="btn-widget-open-detailed"
            onClick={onOpenDetailedModal}
            className="px-2.5 py-2 sm:py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium text-xs transition-colors cursor-pointer shrink-0"
            title="More options (date, shopper, payment method)"
          >
            {lang === 'bn' ? 'বিস্তারিত' : 'More'}
          </button>
        )}
      </form>

      {/* Feedback status */}
      {feedback && (
        <div className={`flex items-center gap-1.5 text-xs font-semibold animate-in fade-in ${
          isSuccess ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
        }`}>
          {isSuccess ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
          <span>{feedback}</span>
        </div>
      )}

      {/* Today's mini list if any bazaar logged today */}
      {todaysBazaarExpenses.length > 0 && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1.5">
            <span>{lang === 'bn' ? 'আজকের এন্ট্রি' : "Today's Logs"}</span>
            <span>{todaysBazaarExpenses.length} {todaysBazaarExpenses.length === 1 ? 'record' : 'records'}</span>
          </div>
          <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
            {todaysBazaarExpenses.map(item => (
              <div 
                key={item.id}
                className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-50 dark:bg-slate-800/50"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="font-bold text-slate-700 dark:text-slate-300 truncate">
                    {item.description}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    ({item.paidByName.split(' ')[0]})
                  </span>
                </div>
                <span className="font-black text-slate-900 dark:text-white shrink-0 ml-2">
                  {currentMess.currency}{Number(item.amount).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
