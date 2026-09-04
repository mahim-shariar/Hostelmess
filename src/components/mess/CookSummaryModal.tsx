import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { 
  ChefHat, 
  Copy, 
  Check, 
  Share2, 
  MessageSquare, 
  Utensils, 
  Users, 
  ShoppingCart, 
  FileText 
} from 'lucide-react';
import { formatMonthDisplay } from '../../lib/accounting';

export const CookSummaryModal: React.FC = () => {
  const { 
    isCookSummaryOpen, 
    setIsCookSummaryOpen, 
    meals, 
    currentMess, 
    allMembers, 
    bazaarDuties,
    monthlyCalculations,
    selectedMonth,
    lang 
  } = useApp();

  const [tab, setTab] = useState<'cook' | 'monthly'>('cook');
  const [copied, setCopied] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  // Calculate today's meal totals for the cook
  const todayMeals = meals.filter(m => m.date === todayStr);

  const breakfastTotal = todayMeals.reduce((acc, curr) => acc + (curr.breakfast || 0), 0);
  const lunchRegular = todayMeals.reduce((acc, curr) => acc + (curr.lunch || 0), 0);
  const lunchGuest = todayMeals.reduce((acc, curr) => acc + (curr.guestLunch || 0), 0);
  const lunchTotal = lunchRegular + lunchGuest;

  const dinnerRegular = todayMeals.reduce((acc, curr) => acc + (curr.dinner || 0), 0);
  const dinnerGuest = todayMeals.reduce((acc, curr) => acc + (curr.guestDinner || 0), 0);
  const dinnerTotal = dinnerRegular + dinnerGuest;

  const grandTotal = breakfastTotal + lunchTotal + dinnerTotal;

  // Active bazaar duty
  const todayDuty = bazaarDuties[todayStr];

  // WhatsApp formatted string for today's cook sheet
  const generateCookText = () => {
    return `🏢 *${currentMess.name}*
📅 *Date:* ${todayStr}
🧑‍🍳 *Today's Cook Meal Sheet*
━━━━━━━━━━━━━━━━━━
🍳 *Breakfast:* ${breakfastTotal} plates
🍲 *Lunch:* ${lunchTotal} plates (Regular: ${lunchRegular}, Guest: ${lunchGuest})
🍛 *Dinner:* ${dinnerTotal} plates (Regular: ${dinnerRegular}, Guest: ${dinnerGuest})
━━━━━━━━━━━━━━━━━━
📊 *Total Plates Today:* ${grandTotal}
🛒 *Bazar Duty:* ${todayDuty?.assignedNames?.join(', ') || 'Self Managed'}

_Generated automatically via Hostel & Mess Manager_`;
  };

  // WhatsApp formatted string for monthly summary
  const generateMonthlyText = () => {
    let text = `📊 *${currentMess.name} - ${formatMonthDisplay(selectedMonth, lang)} Statement*\n`;
    text += `━━━━━━━━━━━━━━━━━━\n`;
    text += `🍲 Total Meals: ${monthlyCalculations.totalMeals}\n`;
    text += `💰 Food Bazar: ${currentMess.currency}${monthlyCalculations.totalFoodExpense.toLocaleString()}\n`;
    text += `⚡ Other Bills: ${currentMess.currency}${monthlyCalculations.totalOtherExpense.toLocaleString()}\n`;
    text += `📈 Current Meal Rate: ${currentMess.currency}${monthlyCalculations.mealRate} /meal\n`;
    text += `━━━━━━━━━━━━━━━━━━\n`;
    text += `*Member Accounts Summary:*\n`;

    allMembers.forEach(m => {
      const res = monthlyCalculations.memberResults[m.id];
      if (!res) return;
      const statusIcon = res.isAdvance ? '🟢 Advance' : res.balance < 0 ? '🔴 Due' : '⚪ Clear';
      text += `• *${m.name}*: ${res.totalMeals} meals | Cost: ${currentMess.currency}${res.totalBill} | Paid: ${currentMess.currency}${res.paid} | [${statusIcon}: ${currentMess.currency}${Math.abs(res.balance)}]\n`;
    });

    text += `━━━━━━━━━━━━━━━━━━\n`;
    text += `_Please clear pending dues on time._`;
    return text;
  };

  const activeText = tab === 'cook' ? generateCookText() : generateMonthlyText();

  const handleCopy = () => {
    navigator.clipboard.writeText(activeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(activeText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <Modal
      isOpen={isCookSummaryOpen}
      onClose={() => setIsCookSummaryOpen(false)}
      title="Cook's Meal Sheet & WhatsApp Share"
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        {/* Tab switch */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
          <button
            id="tab-cook-sheet"
            onClick={() => setTab('cook')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === 'cook'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Today&apos;s Cook Count</span>
          </button>
          <button
            id="tab-monthly-sheet"
            onClick={() => setTab('monthly')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === 'monthly'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Monthly Dues Statement</span>
          </button>
        </div>

        {/* Cook Plate Stat Cards if Cook tab */}
        {tab === 'cook' && (
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 text-center">
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                Breakfast
              </span>
              <p className="text-xl font-black text-amber-900 dark:text-amber-200 mt-0.5">
                {breakfastTotal}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/50 text-center">
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                Lunch Plates
              </span>
              <p className="text-xl font-black text-emerald-900 dark:text-emerald-200 mt-0.5">
                {lunchTotal}
              </p>
              {lunchGuest > 0 && (
                <span className="text-[10px] text-emerald-600">({lunchGuest} guest)</span>
              )}
            </div>

            <div className="p-3 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/50 text-center">
              <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider block">
                Dinner Plates
              </span>
              <p className="text-xl font-black text-indigo-900 dark:text-indigo-200 mt-0.5">
                {dinnerTotal}
              </p>
              {dinnerGuest > 0 && (
                <span className="text-[10px] text-indigo-600">({dinnerGuest} guest)</span>
              )}
            </div>
          </div>
        )}

        {/* Text Preview Box formatted ready for WhatsApp */}
        <div className="relative">
          <div className="bg-slate-900 text-emerald-300 font-mono text-xs p-4 rounded-2xl leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto border border-slate-800 shadow-inner">
            {activeText}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 pt-1">
          <button
            id="btn-copy-cook-text"
            onClick={handleCopy}
            className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
          </button>

          <button
            id="btn-share-whatsapp"
            onClick={handleShareWhatsApp}
            className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Share via WhatsApp</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
