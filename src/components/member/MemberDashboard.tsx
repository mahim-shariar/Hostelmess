import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Utensils, 
  Coffee, 
  Sun, 
  Moon, 
  Plus, 
  Minus, 
  Lock, 
  TrendingUp, 
  CreditCard, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ReceiptText,
  DollarSign,
  Megaphone,
  Wallet,
  XCircle
} from 'lucide-react';
import { formatMonthDisplay } from '../../lib/accounting';
import { BazaarDutyCard } from '../mess/BazaarDutyCard';
import { QuickBazaarWidget } from '../expenses/QuickBazaarWidget';
import { BazarCashFundSection } from '../bazar/BazarCashFundSection';

interface MemberDashboardProps {
  onGoToMeals: () => void;
  onGoToAccount: () => void;
  onAddExpense?: () => void;
  onOpenQuickBazaar?: () => void;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({ 
  onGoToMeals, 
  onGoToAccount,
  onAddExpense,
  onOpenQuickBazaar 
}) => {
  const { 
    currentUser, 
    currentMess, 
    selectedMonth, 
    meals, 
    saveMeal, 
    isMealLocked, 
    currentMemberSummary, 
    monthlyCalculations,
    notices,
    t, 
    lang,
    isMonthClosed,
    setIsAddDepositModalOpen
  } = useApp();

  const [saving, setSaving] = useState(false);
  const [showGuestSection, setShowGuestSection] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Today's date string YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  // Find today's meal record for currentUser
  const todayRecord = meals.find(m => m.memberId === currentUser.id && m.date === todayStr);

  const breakfastVal = todayRecord?.breakfast ?? 1;
  const lunchVal = todayRecord?.lunch ?? 1;
  const dinnerVal = todayRecord?.dinner ?? 1;
  const guestLunchVal = todayRecord?.guestLunch ?? 0;
  const guestDinnerVal = todayRecord?.guestDinner ?? 0;

  const todayTotal = (breakfastVal || 0) + (lunchVal || 0) + (dinnerVal || 0) + (guestLunchVal || 0) + (guestDinnerVal || 0);

  // Cutoff checks
  const isBreakfastLocked = isMealLocked(todayStr, 'breakfast');
  const isLunchLocked = isMealLocked(todayStr, 'lunch');
  const isDinnerLocked = isMealLocked(todayStr, 'dinner');

  const handleToggleMeal = async (type: 'breakfast' | 'lunch' | 'dinner', nextVal: 0 | 0.5 | 1) => {
    setSaving(true);
    const newB = type === 'breakfast' ? nextVal : breakfastVal;
    const newL = type === 'lunch' ? nextVal : lunchVal;
    const newD = type === 'dinner' ? nextVal : dinnerVal;

    const res = await saveMeal(
      currentUser.id, 
      todayStr, 
      newB, 
      newL, 
      newD, 
      guestLunchVal, 
      guestDinnerVal
    );

    setSaving(false);
    if (res.success) {
      setFeedbackMessage('Meal updated in 1 tap!');
      setTimeout(() => setFeedbackMessage(null), 2500);
    } else if (res.error) {
      setFeedbackMessage(res.error);
      setTimeout(() => setFeedbackMessage(null), 3000);
    }
  };

  const handleGuestChange = async (type: 'lunch' | 'dinner', delta: number) => {
    const curVal = type === 'lunch' ? guestLunchVal : guestDinnerVal;
    const nextVal = Math.max(0, curVal + delta);
    const newGL = type === 'lunch' ? nextVal : guestLunchVal;
    const newGD = type === 'dinner' ? nextVal : guestDinnerVal;

    setSaving(true);
    await saveMeal(
      currentUser.id,
      todayStr,
      breakfastVal,
      lunchVal,
      dinnerVal,
      newGL,
      newGD
    );
    setSaving(false);
  };

  // Quick helper to cycle 0 -> 1 -> 0.5 -> 0
  const getNextVal = (val: number): 0 | 0.5 | 1 => {
    if (val === 1) return 0.5;
    if (val === 0.5) return 0;
    return 1;
  };

  const latestNotice = notices[0];

  return (
    <div className="space-y-5 pb-24 animate-in fade-in duration-200">
      
      {/* Month & Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            {formatMonthDisplay(selectedMonth, lang)}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Hi, {currentUser.name.split(' ')[0]} 👋
          </h2>
        </div>

        {/* Currency & Quick status */}
        <div className="text-right">
          <span className="text-xs text-slate-500 dark:text-slate-400">Current Rate</span>
          <p className="text-base font-bold text-slate-900 dark:text-white">
            {currentMess.currency}{monthlyCalculations.mealRate} <span className="text-xs font-normal text-slate-500">/meal</span>
          </p>
        </div>
      </div>

      {/* Latest Notice Banner (if any) */}
      {latestNotice && (
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 text-amber-900 dark:text-amber-100 text-xs">
          <Megaphone className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <span className="font-bold">{latestNotice.title}: </span>
            <span className="text-slate-700 dark:text-slate-300">{latestNotice.content}</span>
          </div>
        </div>
      )}

      {/* TODAY'S MEALS CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {t.todaysMeals}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {todayStr} • {t.recordInSeconds}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
              {todayTotal} {todayTotal === 1 ? 'Meal' : 'Meals'}
            </span>
          </div>
        </div>

        {/* Feedback message banner */}
        {feedbackMessage && (
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* Cutoff Rules Info Banner */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-300">
          <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            <strong>Meal Off Rules:</strong> Lunch can be turned off before <strong>9:00 AM</strong> • Dinner before <strong>4:00 PM</strong>.
          </span>
        </div>

        {/* 3 Meal Buttons: Breakfast, Lunch, Dinner */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-1">
          
          {/* Breakfast */}
          <div className="flex flex-col items-center">
            <button
              id="btn-toggle-breakfast"
              disabled={isBreakfastLocked || isMonthClosed || saving}
              onClick={() => handleToggleMeal('breakfast', getNextVal(breakfastVal))}
              className={`w-full aspect-4/3 rounded-2xl flex flex-col items-center justify-center gap-1.5 p-2 transition-all cursor-pointer active:scale-95 ${
                isBreakfastLocked
                  ? 'bg-slate-100 dark:bg-slate-800/60 opacity-70 cursor-not-allowed text-slate-400'
                  : breakfastVal > 0
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <div className="flex items-center gap-1">
                <Coffee className="w-4 h-4" />
                {isBreakfastLocked && <Lock className="w-3 h-3 text-slate-400" />}
              </div>
              <span className="text-xs font-semibold">{t.breakfast}</span>
              <span className="text-xs font-black tracking-wider uppercase">
                {breakfastVal === 1 ? '1' : breakfastVal === 0.5 ? '0.5' : 'OFF'}
              </span>
            </button>
            <span className="text-[10px] text-slate-400 mt-1">
              {isBreakfastLocked ? 'Locked' : 'Tap to toggle'}
            </span>
          </div>

          {/* Lunch */}
          <div className="flex flex-col items-center">
            <button
              id="btn-toggle-lunch"
              disabled={isLunchLocked || isMonthClosed || saving}
              onClick={() => handleToggleMeal('lunch', getNextVal(lunchVal))}
              className={`w-full aspect-4/3 rounded-2xl flex flex-col items-center justify-center gap-1.5 p-2 transition-all cursor-pointer active:scale-95 ${
                isLunchLocked
                  ? 'bg-slate-100 dark:bg-slate-800/60 opacity-70 cursor-not-allowed text-slate-400'
                  : lunchVal > 0
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <div className="flex items-center gap-1">
                <Sun className="w-4 h-4" />
                {isLunchLocked && <Lock className="w-3 h-3 text-slate-400" />}
              </div>
              <span className="text-xs font-semibold">{t.lunch}</span>
              <span className="text-xs font-black tracking-wider uppercase">
                {lunchVal === 1 ? '1' : lunchVal === 0.5 ? '0.5' : 'OFF'}
              </span>
            </button>
            <div className="flex flex-col items-center mt-1">
              <span className="text-[10px] text-slate-400">
                {isLunchLocked ? 'Locked (9 AM)' : 'Before 9 AM'}
              </span>
              {!isLunchLocked && lunchVal > 0 && (
                <button
                  id="btn-off-lunch"
                  onClick={() => handleToggleMeal('lunch', 0)}
                  disabled={saving}
                  className="mt-0.5 text-[10px] font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                >
                  Turn OFF
                </button>
              )}
            </div>
          </div>

          {/* Dinner */}
          <div className="flex flex-col items-center">
            <button
              id="btn-toggle-dinner"
              disabled={isDinnerLocked || isMonthClosed || saving}
              onClick={() => handleToggleMeal('dinner', getNextVal(dinnerVal))}
              className={`w-full aspect-4/3 rounded-2xl flex flex-col items-center justify-center gap-1.5 p-2 transition-all cursor-pointer active:scale-95 ${
                isDinnerLocked
                  ? 'bg-slate-100 dark:bg-slate-800/60 opacity-70 cursor-not-allowed text-slate-400'
                  : dinnerVal > 0
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <div className="flex items-center gap-1">
                <Moon className="w-4 h-4" />
                {isDinnerLocked && <Lock className="w-3 h-3 text-slate-400" />}
              </div>
              <span className="text-xs font-semibold">{t.dinner}</span>
              <span className="text-xs font-black tracking-wider uppercase">
                {dinnerVal === 1 ? '1' : dinnerVal === 0.5 ? '0.5' : 'OFF'}
              </span>
            </button>
            <div className="flex flex-col items-center mt-1">
              <span className="text-[10px] text-slate-400">
                {isDinnerLocked ? 'Locked (4 PM)' : 'Before 4 PM'}
              </span>
              {!isDinnerLocked && dinnerVal > 0 && (
                <button
                  id="btn-off-dinner"
                  onClick={() => handleToggleMeal('dinner', 0)}
                  disabled={saving}
                  className="mt-0.5 text-[10px] font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                >
                  Turn OFF
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Guest Meals Section (Accordion) */}
        {currentMess.settings.enableGuestMeals && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              id="btn-toggle-guest-section"
              onClick={() => setShowGuestSection(!showGuestSection)}
              className="flex items-center justify-between w-full text-xs font-medium text-slate-600 dark:text-slate-300 py-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <span>{t.guestMeal}</span>
                {(guestLunchVal > 0 || guestDinnerVal > 0) && (
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                    +{guestLunchVal + guestDinnerVal}
                  </span>
                )}
              </span>
              {showGuestSection ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showGuestSection && (
              <div className="grid grid-cols-2 gap-3 pt-3">
                {/* Guest Lunch */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{t.guestLunch}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleGuestChange('lunch', -1)}
                      disabled={guestLunchVal <= 0 || saving}
                      className="p-1 rounded-lg bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-xs disabled:opacity-30 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold min-w-4 text-center">{guestLunchVal}</span>
                    <button
                      onClick={() => handleGuestChange('lunch', 1)}
                      disabled={saving}
                      className="p-1 rounded-lg bg-emerald-600 text-white shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Guest Dinner */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{t.guestDinner}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleGuestChange('dinner', -1)}
                      disabled={guestDinnerVal <= 0 || saving}
                      className="p-1 rounded-lg bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-xs disabled:opacity-30 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold min-w-4 text-center">{guestDinnerVal}</span>
                    <button
                      onClick={() => handleGuestChange('dinner', 1)}
                      disabled={saving}
                      className="p-1 rounded-lg bg-emerald-600 text-white shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 1ST-WEEK ৳1,000 BAZAR STARTER FUND & REMAINING CASH IN HAND (Live for every member) */}
      <BazarCashFundSection />

      {/* DAILY BAZAAR INSTANT ENTRY WIDGET */}
      <QuickBazaarWidget onOpenDetailedModal={onOpenQuickBazaar || onAddExpense} />

      {/* DAILY BAZAAR (MARKET) DUTY ROSTER */}
      <BazaarDutyCard 
        onOpenAddExpense={onAddExpense}
        onOpenQuickBazaar={onOpenQuickBazaar}
      />

      {/* MY MONTHLY SUMMARY CARD (Requirement 7) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base tracking-tight">
              {t.myMonthlySummary}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {formatMonthDisplay(selectedMonth, lang)}
            </p>
          </div>

          {/* Balance Badge */}
          <div className="text-right">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
              currentMemberSummary?.isAdvance
                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
            }`}>
              {currentMemberSummary?.balanceFormatted || `${currentMess.currency}0 Balanced`}
            </span>
          </div>
        </div>

        {/* Clean Line Items (Exactly as requested) */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
          
          {/* Meals */}
          <div className="flex items-center justify-between py-2.5">
            <span className="text-slate-600 dark:text-slate-400">{t.meals}</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {currentMemberSummary?.totalMeals ?? 0}
            </span>
          </div>

          {/* Meal Rate */}
          <div className="flex items-center justify-between py-2.5">
            <span className="text-slate-600 dark:text-slate-400">{t.mealRate}</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {currentMess.currency}{monthlyCalculations.mealRate}
            </span>
          </div>

          {/* Meal Cost */}
          <div className="flex items-center justify-between py-2.5">
            <span className="text-slate-600 dark:text-slate-400">{t.mealCost}</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {currentMess.currency}{(currentMemberSummary?.mealCost ?? 0).toLocaleString()}
            </span>
          </div>

          {/* Other Cost */}
          <div className="flex items-center justify-between py-2.5">
            <span className="text-slate-600 dark:text-slate-400">{t.otherCost}</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {currentMess.currency}{(currentMemberSummary?.otherCost ?? 0).toLocaleString()}
            </span>
          </div>

          {/* Paid */}
          <div className="flex items-center justify-between py-2.5">
            <span className="text-slate-600 dark:text-slate-400">{t.paid}</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {currentMess.currency}{(currentMemberSummary?.paid ?? 0).toLocaleString()}
            </span>
          </div>

          {/* Final Balance (Big highlight) */}
          <div className="flex items-center justify-between py-3 pt-3.5">
            <div>
              <span className="font-bold text-slate-900 dark:text-white text-base">
                {t.balance}
              </span>
              <p className="text-[11px] text-slate-400">
                {currentMemberSummary?.isAdvance ? 'Money left in deposit' : 'Remaining bill to pay'}
              </p>
            </div>
            
            <div className="text-right">
              <span className={`text-lg sm:text-xl font-black ${
                currentMemberSummary?.isAdvance
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}>
                {currentMemberSummary?.balanceFormatted}
              </span>
            </div>
          </div>

        </div>

        {/* Actions: Add Deposit & View Full History */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <button
            id="btn-member-add-deposit"
            onClick={() => setIsAddDepositModalOpen(true)}
            className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <Wallet className="w-4 h-4" />
            <span>Add My Deposit ({currentMess.currency})</span>
          </button>

          <button
            id="btn-view-account-details"
            onClick={onGoToAccount}
            className="py-3 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200/60 dark:border-slate-700 transition-colors cursor-pointer text-center"
          >
            Full Account History →
          </button>
        </div>
      </div>

      {/* Quick Links / Action Pills */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
        <button
          id="btn-quick-add-deposit-card"
          onClick={() => setIsAddDepositModalOpen(true)}
          className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all cursor-pointer shadow-xs text-left"
        >
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Give Deposit</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Record amount paid</p>
          </div>
        </button>

        <button
          id="btn-quick-meals"
          onClick={onGoToMeals}
          className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all cursor-pointer shadow-xs text-left"
        >
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.mealCalendar}</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">View past days &amp; total</p>
          </div>
        </button>

        {currentUser.permissions.addExpense && onAddExpense && (
          <button
            id="btn-quick-add-expense"
            onClick={onAddExpense}
            className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all cursor-pointer shadow-xs text-left"
          >
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shrink-0">
              <ReceiptText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.addExpense}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Log bazar or bills</p>
            </div>
          </button>
        )}
      </div>

    </div>
  );
};
