import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShoppingBag, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  ChevronRight, 
  ChevronDown, 
  Users, 
  DollarSign, 
  TrendingDown, 
  TrendingUp, 
  ShieldCheck, 
  Check, 
  Receipt,
  Sparkles,
  Info
} from 'lucide-react';
import { Modal } from '../ui/Modal';

interface BazarCashFundSectionProps {
  compact?: boolean;
}

export const BazarCashFundSection: React.FC<BazarCashFundSectionProps> = ({ compact = false }) => {
  const { 
    lang, 
    allMembers, 
    currentUser, 
    firstWeekDeposits, 
    bazarCashHandovers, 
    firstWeekTargetPerMember,
    totalFirstWeekCollected, 
    totalFirstWeekTarget, 
    totalBazarCashDisbursed, 
    totalBazarCashReturned, 
    remainingBazarCashInHand, 
    addBazarCashHandover, 
    settleBazarCashHandover, 
    markFirstWeekDeposit,
    selectedMonth,
    currentMess 
  } = useApp();

  const isBn = lang === 'bn';
  const isAdmin = currentUser.role === 'admin';

  const [expanded, setExpanded] = useState(!compact);
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'history'>('overview');

  // Modals
  const [isHandoverModalOpen, setIsHandoverModalOpen] = useState(false);
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [isPay1000ModalOpen, setIsPay1000ModalOpen] = useState(false);

  // Form states for Handing over Cash for Bazar
  const [selectedShopperId, setSelectedShopperId] = useState<string>(currentUser.id);
  const [cashTakenInput, setCashTakenInput] = useState<number>(3000);
  const [handoverNote, setHandoverNote] = useState<string>('Friday Fish & Meat Bazar');
  const [handoverDate, setHandoverDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Form state for settling a handover
  const [settlingHandoverId, setSettlingHandoverId] = useState<string | null>(null);
  const [actualSpentInput, setActualSpentInput] = useState<number>(2750);
  const [settleRecordExpense, setSettleRecordExpense] = useState<boolean>(true);

  // Form state for depositing 1,000 Tk starter fund
  const [depositMemberId, setDepositMemberId] = useState<string>(currentUser.id);
  const [depositAmount, setDepositAmount] = useState<number>(1000);
  const [depositMethod, setDepositMethod] = useState<'Cash' | 'bKash' | 'Nagad' | 'Bank'>('bKash');
  const [depositTrxId, setDepositTrxId] = useState<string>('');

  // Target handover for settlement
  const activeSettlingItem = bazarCashHandovers.find(h => h.id === settlingHandoverId);
  const calculatedReturned = activeSettlingItem 
    ? Math.max(0, activeSettlingItem.cashTaken - (actualSpentInput || 0))
    : 0;

  // Active shoppers who currently have cash in hand
  const activeShoppingHandovers = bazarCashHandovers.filter(
    h => h.status === 'shopping' && h.monthId === selectedMonth
  );

  // Check personal 1st-week status for the logged-in member
  const myDepositRecord = firstWeekDeposits.find(
    d => d.memberId === currentUser.id && d.monthId === selectedMonth
  );
  const myDepositPaid = myDepositRecord?.status === 'paid' && (myDepositRecord.paidAmount || 0) >= 1000;

  // Handler to open settle modal
  const handleOpenSettle = (handoverId: string) => {
    const item = bazarCashHandovers.find(h => h.id === handoverId);
    if (item) {
      setSettlingHandoverId(handoverId);
      setActualSpentInput(item.actualSpent > 0 ? item.actualSpent : item.cashTaken - 250);
      setIsSettleModalOpen(true);
    }
  };

  // Submit Handover
  const handleSubmitHandover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShopperId || cashTakenInput <= 0) return;
    const shopper = allMembers.find(m => m.id === selectedShopperId);
    const shopperName = shopper ? shopper.name : 'Shopper';

    await addBazarCashHandover(
      selectedShopperId,
      shopperName,
      Number(cashTakenInput),
      handoverNote,
      handoverDate
    );
    setIsHandoverModalOpen(false);
  };

  // Submit Settle
  const handleSubmitSettle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settlingHandoverId || !activeSettlingItem) return;

    await settleBazarCashHandover(
      settlingHandoverId,
      Number(actualSpentInput),
      Number(calculatedReturned),
      settleRecordExpense
    );
    setIsSettleModalOpen(false);
    setSettlingHandoverId(null);
  };

  // Submit 1000 Tk deposit
  const handleSubmitDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositMemberId || depositAmount <= 0) return;

    await markFirstWeekDeposit(
      depositMemberId,
      Number(depositAmount),
      depositMethod,
      depositTrxId
    );
    setIsPay1000ModalOpen(false);
    setDepositTrxId('');
  };

  // Paid members count
  const paidMembersCount = allMembers.filter(m => {
    const rec = firstWeekDeposits.find(d => d.memberId === m.id && d.monthId === selectedMonth);
    return rec?.status === 'paid';
  }).length;

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
      
      {/* Top Banner Header: Accessible & Transparent for Every Member */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 bg-linear-to-r from-emerald-500/10 via-teal-500/5 to-transparent">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm shadow-emerald-600/20 shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {isBn ? 'মেসের বাজার ফান্ড ও ক্যাশ ইন হ্যান্ড' : 'Mess Bazar Fund & Live Cash Float'}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {isBn ? 'স্বচ্ছ হিসাব' : '100% Transparent'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isBn 
                  ? '১ম সপ্তাহের ১,০০০ টাকা জমা, বাজার খরচ ও তহবিলের অবশিষ্ট ক্যাশ ব্যালেন্স'
                  : '1st-week ৳1,000 starter pool, cash taken for shopping & remaining fund balance'}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              type="button"
              id="btn-bazar-take-cash"
              onClick={() => setIsHandoverModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer active:scale-95"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{isBn ? 'বাজারের টাকা নিন (৳৩,০০০)' : 'Take Bazar Cash'}</span>
            </button>

            <button
              type="button"
              id="btn-bazar-pay-1000"
              onClick={() => {
                setDepositMemberId(currentUser.id);
                setIsPay1000ModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{isBn ? '১০০০ টাকা জমা দিন' : 'Deposit ৳1,000'}</span>
            </button>
          </div>

        </div>

        {/* 3 Core Highlight Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          
          {/* Card 1: Remaining Bazar Cash Left (Crucial Focus) */}
          <div className="p-3.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">
                {isBn ? 'মেসের অবশিষ্ট বাজার ক্যাশ' : 'Remaining Bazar Cash Left'}
              </span>
              <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-300 font-mono">
                {currentMess.currency}{remainingBazarCashInHand.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {isBn ? 'তহবিলে জমা আছে' : 'in cash box'}
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {isBn ? 'সকল সদস্য লাইভ দেখতে পাচ্ছে' : 'Live visible to all room members'}
              </span>
            </div>
          </div>

          {/* Card 2: 1st-Week ৳1,000 Pool */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                {isBn ? '১ম সপ্তাহের ১০০০ টাকা জমা' : '1st-Week ৳1,000 Pool'}
              </span>
              <Users className="w-4 h-4 text-slate-500" />
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
                {currentMess.currency}{totalFirstWeekCollected.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-500">
                / {currentMess.currency}{totalFirstWeekTarget.toLocaleString()}
              </span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
              <span>{paidMembersCount} of {allMembers.length} {isBn ? 'সদস্য জমা দিয়েছেন' : 'members paid'}</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {Math.round((totalFirstWeekCollected / (totalFirstWeekTarget || 1)) * 100)}%
              </span>
            </div>
          </div>

          {/* Card 3: Bazar Cash Taken vs Returned */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                {isBn ? 'বাজারের টাকা বিতরণ ও খরচ' : 'Bazar Cash Out / Returned'}
              </span>
              <Receipt className="w-4 h-4 text-slate-500" />
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
                {currentMess.currency}{totalBazarCashDisbursed.toLocaleString()}
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                ({currentMess.currency}{totalBazarCashReturned.toLocaleString()} {isBn ? 'ফেরত' : 'returned'})
              </span>
            </div>
            <div className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {activeShoppingHandovers.length > 0 ? (
                <span className="text-amber-600 dark:text-amber-400 font-semibold">
                  ⏳ {activeShoppingHandovers[0].shopperName} {isBn ? 'বাজারে গেছেন' : 'is currently shopping'}
                </span>
              ) : (
                <span>{isBn ? 'সব বাজারের উদ্বৃত্ত ফেরত ও নিষ্পত্তি সম্পন্ন' : 'All recent bazar cash settled'}</span>
              )}
            </div>
          </div>

        </div>

        {/* Member's Personal 1st-Week Status Indicator */}
        <div className="mt-3.5 p-2.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-slate-500 dark:text-slate-400 shrink-0">
              {isBn ? 'আপনার ১ম সপ্তাহের ১০০০ টাকা জমা:' : 'Your 1st-Week ৳1,000 Status:'}
            </span>
            {myDepositPaid ? (
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                <Check className="w-3 h-3" />
                <span>{isBn ? 'পরিশোধিত (৳১,০০০ জমা)' : 'Paid (৳1,000 Deposited)'}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                <AlertCircle className="w-3 h-3" />
                <span>{isBn ? 'বাকি আছে (১ম সপ্তাহে ১০০০ টাকা জমা দিন)' : 'Due (Please pay ৳1,000 in Week 1)'}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!myDepositPaid && (
              <button
                type="button"
                onClick={() => {
                  setDepositMemberId(currentUser.id);
                  setIsPay1000ModalOpen(true);
                }}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                {isBn ? 'এখনই জমা দিন →' : 'Pay ৳1,000 Now →'}
              </button>
            )}
            
            {/* Toggle expanded details */}
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <span>{expanded ? (isBn ? 'সংক্ষিপ্ত করুন' : 'Hide Details') : (isBn ? 'বিস্তারিত দেখুন' : 'View Full Details')}</span>
              {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

      </div>

      {/* Expandable Tabs: All Members 1,000 Tk Status & Cash Taken History */}
      {expanded && (
        <div className="p-4 sm:p-5 space-y-4 animate-in fade-in">
          
          {/* Sub Tab Switcher */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {isBn ? 'বাজার ক্যাশ ফ্লো সারাংশ' : 'Cash Flow Summary'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('members')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'members'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{isBn ? '১ম সপ্তাহের ১০০০ টাকা জমা তালিকা' : '1st-Week ৳1,000 List'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                {paidMembersCount}/{allMembers.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{isBn ? 'বাজারের জন্য নেওয়া টাকা ও ফেরত হিসাব' : 'Bazar Cash Out / In Log'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                {bazarCashHandovers.length}
              </span>
            </button>
          </div>

          {/* Tab 1: Overview Explanation with Real Math */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              
              {/* How it works Banner */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs leading-relaxed space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{isBn ? 'ব্যাচেলর মেসের বাস্তব বাজার নিয়ম কিভাবে কাজ করে?' : 'How the Bazar Cash System Works in Practice'}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  {isBn ? (
                    <>
                      <strong>১. ১ম সপ্তাহের ১,০০০ টাকা জমা:</strong> মাসের ১ম সপ্তাহে মেসের প্রত্যেকে ১,০০০ টাকা করে বাজার তহবিলে জমা দেয় (যেমন: {allMembers.length} জন সদস্য × ১,০০০ = মোট ৳{totalFirstWeekTarget.toLocaleString()})।<br />
                      <strong>২. বাজার করার জন্য টাকা নেওয়া:</strong> যেদিন যে সদস্য বাজারে যাবেন (যেমন শাকিল বা তানভীর), ম্যানেজার ফান্ড থেকে তিনি <strong>৳৩,০০০ টাকা ক্যাশ</strong> নেন।<br />
                      <strong>৩. অবশিষ্ট ক্যাশ ও উদ্বৃত্ত ফেরত:</strong> বাজার শেষে প্রকৃত খরচ (যেমন ৳২,৭৫০) হিসাব করে অবশিষ্ট টাকা (৳২৫০) মেসের তহবিলে ফেরত দেন। মেসের বাক্সে কত টাকা রইল তা <strong>সব সদস্য সরাসরি লাইভ</strong> দেখতে পারেন।
                    </>
                  ) : (
                    <>
                      <strong>1. 1st-Week ৳1,000 Starter Deposit:</strong> In the first week, every member contributes ৳1,000 to the central bazar fund (e.g. {allMembers.length} members × ৳1,000 = ৳{totalFirstWeekTarget.toLocaleString()}).<br />
                      <strong>2. Taking Cash for Market:</strong> When a member goes to market (e.g., today's bazar duty), they take <strong>৳3,000 in cash</strong> from the fund.<br />
                      <strong>3. Remaining Balance & Return:</strong> Once shopping is completed, the actual receipt is recorded (e.g. ৳2,750 spent), and leftover cash (৳250) is returned to the fund. <strong>All members can see the exact remaining cash in hand live!</strong>
                    </>
                  )}
                </p>
              </div>

              {/* Active Shopping Alert if someone took cash today */}
              {activeShoppingHandovers.length > 0 && (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 flex items-center justify-center font-bold shrink-0">
                      🛒
                    </div>
                    <div>
                      <p className="font-bold text-amber-900 dark:text-amber-200">
                        {activeShoppingHandovers[0].shopperName} {isBn ? 'বাজার করার জন্য টাকা নিয়েছেন' : 'has taken cash for bazar'}
                      </p>
                      <p className="text-amber-700 dark:text-amber-400">
                        {isBn ? 'টাকা নেওয়া হয়েছে:' : 'Cash taken:'} <strong>{currentMess.currency}{activeShoppingHandovers[0].cashTaken.toLocaleString()}</strong> ({activeShoppingHandovers[0].note || 'Market duty'})
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenSettle(activeShoppingHandovers[0].id)}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer self-start sm:self-center"
                  >
                    {isBn ? 'বাজার হিসাব নিষ্পত্তি ও উদ্বৃত্ত জমা' : 'Settle & Return Cash'}
                  </button>
                </div>
              )}

              {/* Quick Table of Recent Handovers */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-2.5">{isBn ? 'তারিখ' : 'Date'}</th>
                      <th className="p-2.5">{isBn ? 'বাজারকারী' : 'Shopper'}</th>
                      <th className="p-2.5">{isBn ? 'নেওয়া টাকা' : 'Cash Taken'}</th>
                      <th className="p-2.5">{isBn ? 'প্রকৃত খরচ' : 'Spent'}</th>
                      <th className="p-2.5">{isBn ? 'ফেরত দেওয়া হয়েছে' : 'Returned'}</th>
                      <th className="p-2.5">{isBn ? 'অবস্থা' : 'Status'}</th>
                      <th className="p-2.5 text-right">{isBn ? 'অ্যাকশন' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {bazarCashHandovers.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="p-2.5 font-mono text-slate-600 dark:text-slate-400">{item.date}</td>
                        <td className="p-2.5 font-bold text-slate-900 dark:text-white">{item.shopperName}</td>
                        <td className="p-2.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {currentMess.currency}{item.cashTaken.toLocaleString()}
                        </td>
                        <td className="p-2.5 font-mono text-slate-600 dark:text-slate-400">
                          {item.actualSpent > 0 ? `${currentMess.currency}${item.actualSpent.toLocaleString()}` : '—'}
                        </td>
                        <td className="p-2.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                          {item.cashReturned && item.cashReturned > 0 ? `+${currentMess.currency}${item.cashReturned.toLocaleString()}` : '—'}
                        </td>
                        <td className="p-2.5">
                          {item.status === 'shopping' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                              <Clock className="w-2.5 h-2.5" />
                              <span>{isBn ? 'বাজারে আছে' : 'Shopping'}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              <Check className="w-2.5 h-2.5" />
                              <span>{isBn ? 'নিষ্পন্ন' : 'Settled'}</span>
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 text-right">
                          {item.status === 'shopping' && (
                            <button
                              type="button"
                              onClick={() => handleOpenSettle(item.id)}
                              className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-100 font-bold text-[11px] cursor-pointer"
                            >
                              {isBn ? 'নিষ্পত্তি করুন' : 'Settle'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* Tab 2: 1st-Week ৳1,000 Status for Every Member */}
          {activeTab === 'members' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{isBn ? 'মাসের ১ম সপ্তাহে প্রত্যেক সদস্যের ১০০০ টাকা জমা স্ট্যাটাস:' : 'First week ৳1,000 starter deposit status per member:'}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {isBn ? `মোট সংগৃহীত: ${currentMess.currency}${totalFirstWeekCollected.toLocaleString()}` : `Total Collected: ${currentMess.currency}${totalFirstWeekCollected.toLocaleString()}`}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {allMembers.map((member) => {
                  const depositRecord = firstWeekDeposits.find(
                    d => d.memberId === member.id && d.monthId === selectedMonth
                  );
                  const isPaid = depositRecord?.status === 'paid' && (depositRecord.paidAmount || 0) >= 1000;

                  return (
                    <div 
                      key={member.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-colors ${
                        isPaid 
                          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shrink-0 ${
                          member.role === 'admin' ? 'bg-emerald-600' : 'bg-slate-600'
                        }`}>
                          {member.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white truncate">
                            {member.name} {member.id === currentUser.id && <span className="text-emerald-600 font-semibold">(You)</span>}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {isPaid 
                              ? `${depositRecord?.paymentMethod || 'Cash'} • ${depositRecord?.paidDate || 'Paid'}` 
                              : (isBn ? '১০০০ টাকা বাকি' : '৳1,000 Pending')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            <Check className="w-3 h-3" />
                            <span>{currentMess.currency}{depositRecord?.paidAmount || 1000} {isBn ? 'জমা' : 'Paid'}</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setDepositMemberId(member.id);
                              setIsPay1000ModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs transition-colors cursor-pointer"
                          >
                            {isBn ? 'জমা নিন' : 'Mark Paid'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: Detailed History Log */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{isBn ? 'বাজারের জন্য নেওয়া টাকা ও ফেরত দেওয়ার পূর্ণাঙ্গ লগ:' : 'Complete log of cash taken for market & returned to fund:'}</span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                  {isBn ? `অবশিষ্ট ক্যাশ: ${currentMess.currency}${remainingBazarCashInHand.toLocaleString()}` : `Left in Cash Box: ${currentMess.currency}${remainingBazarCashInHand.toLocaleString()}`}
                </span>
              </div>

              <div className="space-y-2">
                {bazarCashHandovers.map((item) => (
                  <div 
                    key={item.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {item.shopperName}
                        </span>
                        <span className="text-slate-400 font-mono">• {item.date}</span>
                        {item.status === 'shopping' ? (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                            {isBn ? 'বাজারে আছে' : 'Active'}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                            {isBn ? 'সম্পন্ন' : 'Settled'}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {item.note || 'Regular bazaar duty shopping'}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">{isBn ? 'নেওয়া টাকা' : 'Cash Taken'}</span>
                        <span className="font-bold text-slate-900 dark:text-white">{currentMess.currency}{item.cashTaken.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">{isBn ? 'প্রকৃত খরচ' : 'Spent'}</span>
                        <span className="text-slate-700 dark:text-slate-300">
                          {item.actualSpent > 0 ? `${currentMess.currency}${item.actualSpent.toLocaleString()}` : '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block uppercase">{isBn ? 'তহবিলে ফেরত' : 'Returned'}</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {item.cashReturned && item.cashReturned > 0 ? `${currentMess.currency}${item.cashReturned.toLocaleString()}` : '৳০'}
                        </span>
                      </div>
                      {item.status === 'shopping' && (
                        <button
                          type="button"
                          onClick={() => handleOpenSettle(item.id)}
                          className="ml-2 px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-xs cursor-pointer"
                        >
                          {isBn ? 'নিষ্পত্তি' : 'Settle'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* MODAL 1: Hand Over Cash for Bazar (e.g. Member takes ৳3,000 for today's market) */}
      <Modal
        isOpen={isHandoverModalOpen}
        onClose={() => setIsHandoverModalOpen(false)}
        title={isBn ? 'বাজার করার জন্য টাকা নিন / দিন' : 'Disburse Cash for Bazar'}
      >
        <form onSubmit={handleSubmitHandover} className="space-y-4">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
            <p className="font-semibold text-emerald-900 dark:text-emerald-200">
              {isBn 
                ? 'তহবিল থেকে বাজারের জন্য অগ্রিম টাকা উত্তোলন'
                : 'Taking advance cash from the 1st-week bazar starter fund'}
            </p>
            <p className="text-emerald-700 dark:text-emerald-400 mt-0.5">
              {isBn ? 'বর্তমান অবশিষ্ট ক্যাশ ব্যালেন্স:' : 'Current remaining cash in fund:'} <strong>{currentMess.currency}{remainingBazarCashInHand.toLocaleString()}</strong>
            </p>
          </div>

          {/* Select Shopper */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isBn ? 'কে বাজার করবেন (সদস্য নির্বাচন করুন):' : 'Who is doing bazar (Shopper):'}
            </label>
            <select
              value={selectedShopperId}
              onChange={(e) => setSelectedShopperId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {allMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} {m.id === currentUser.id ? '(You)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Cash Amount Taken with Quick Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isBn ? 'কত টাকা নিচ্ছেন (ক্যাশ টাকা):' : 'Cash Amount Taken (৳):'}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                {currentMess.currency}
              </span>
              <input
                type="number"
                min="100"
                step="50"
                value={cashTakenInput}
                onChange={(e) => setCashTakenInput(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="3000"
                required
              />
            </div>
            
            {/* Presets */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase">{isBn ? 'দ্রুত সিলেক্ট:' : 'Presets:'}</span>
              {[1500, 2000, 2500, 3000, 4000, 5000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setCashTakenInput(amt)}
                  className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    cashTakenInput === amt
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  ৳{amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Date & Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'তারিখ:' : 'Date:'}
              </label>
              <input
                type="date"
                value={handoverDate}
                onChange={(e) => setHandoverDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'বাজারের বিবরণ / নোট:' : 'Purpose / Note:'}
              </label>
              <input
                type="text"
                value={handoverNote}
                onChange={(e) => setHandoverNote(e.target.value)}
                placeholder="Friday Chicken, Fish & Veg"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* After Taking calculation preview */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
            <span className="text-slate-500">{isBn ? 'টাকা নেওয়ার পর তহবিলে অবশিষ্ট থাকবে:' : 'Remaining in fund after handover:'}</span>
            <span className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
              {currentMess.currency}{(remainingBazarCashInHand - (cashTakenInput || 0)).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsHandoverModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              {isBn ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              {isBn ? 'টাকা প্রদানের হিসাব সংরক্ষণ করুন' : 'Confirm Cash Handover'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: Settle Bazar & Return Cash */}
      <Modal
        isOpen={isSettleModalOpen}
        onClose={() => setIsSettleModalOpen(false)}
        title={isBn ? 'বাজারের হিসাব নিষ্পত্তি ও উদ্বৃত্ত টাকা ফেরত' : 'Settle Bazar & Return Leftover Cash'}
      >
        {activeSettlingItem && (
          <form onSubmit={handleSubmitSettle} className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{isBn ? 'বাজারকারী:' : 'Shopper:'}</span>
                <span className="font-bold text-slate-900 dark:text-white">{activeSettlingItem.shopperName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{isBn ? 'নেওয়া ক্যাশ টাকা:' : 'Initial Cash Taken:'}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{currentMess.currency}{activeSettlingItem.cashTaken.toLocaleString()}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'প্রকৃত কত টাকা বাজার খরচ হয়েছে:' : 'Actual Amount Spent at Market:'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                  {currentMess.currency}
                </span>
                <input
                  type="number"
                  min="0"
                  max={activeSettlingItem.cashTaken}
                  value={actualSpentInput}
                  onChange={(e) => setActualSpentInput(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            {/* Live Calculated Cash Return */}
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
                  {isBn ? 'তহবিলে ফেরত দেওয়া হচ্ছে (উদ্বৃত্ত ক্যাশ):' : 'Returning to Mess Cash Fund:'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {currentMess.currency}{activeSettlingItem.cashTaken} - {currentMess.currency}{actualSpentInput} =
                </span>
              </div>
              <span className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
                +{currentMess.currency}{calculatedReturned.toLocaleString()}
              </span>
            </div>

            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={settleRecordExpense}
                onChange={(e) => setSettleRecordExpense(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <span>
                {isBn 
                  ? 'এই খরচটি মেসের বাজার ব্যয়ের হিসেবে সরাসরি যুক্ত করুন (মিল রেটের জন্য)'
                  : 'Auto-record as approved mess bazar expense for meal rate calculation'}
              </span>
            </label>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsSettleModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 cursor-pointer"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                {isBn ? 'উদ্বৃত্ত ফেরত ও নিষ্পত্তি সম্পন্ন করুন' : 'Confirm Settlement & Return'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* MODAL 3: Pay 1st-Week ৳1,000 Starter Fund */}
      <Modal
        isOpen={isPay1000ModalOpen}
        onClose={() => setIsPay1000ModalOpen(false)}
        title={isBn ? '১ম সপ্তাহের ১,০০০ টাকা বাজার জমা' : 'Deposit 1st-Week ৳1,000 Bazar Fund'}
      >
        <form onSubmit={handleSubmitDeposit} className="space-y-4">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
            <p className="font-semibold text-emerald-900 dark:text-emerald-200">
              {isBn 
                ? 'মাসের প্রথম সপ্তাহে প্রত্যেক সদস্য ১,০০০ টাকা বাজার ফান্ডে জমা দেন।'
                : 'In the first week, each member deposits ৳1,000 to initiate the bazar fund.'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isBn ? 'সদস্য:' : 'Member:'}
            </label>
            <select
              value={depositMemberId}
              onChange={(e) => setDepositMemberId(e.target.value)}
              disabled={!isAdmin}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer disabled:opacity-80"
            >
              {allMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} {m.id === currentUser.id ? '(You)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isBn ? 'জমার পরিমাণ (টাকা):' : 'Amount (৳):'}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                {currentMess.currency}
              </span>
              <input
                type="number"
                min="100"
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'পেমেন্ট মাধ্যম:' : 'Method:'}
              </label>
              <select
                value={depositMethod}
                onChange={(e: any) => setDepositMethod(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="Cash">Cash (নগদ)</option>
                <option value="bKash">bKash (বিকাশ)</option>
                <option value="Nagad">Nagad (নগদ অ্যাপ)</option>
                <option value="Bank">Bank Transfer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'ট্রানজেকশন আইডি (ঐচ্ছিক):' : 'TrxID (Optional):'}
              </label>
              <input
                type="text"
                value={depositTrxId}
                onChange={(e) => setDepositTrxId(e.target.value)}
                placeholder="e.g. BK8912..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsPay1000ModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 cursor-pointer"
            >
              {isBn ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              {isBn ? '১০০০ টাকা জমা নিশ্চিত করুন' : 'Confirm ৳1,000 Deposit'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
