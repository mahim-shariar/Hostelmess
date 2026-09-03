import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingCart, Calendar, UserCheck, PlusCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface BazaarDutyCardProps {
  onOpenAddExpense?: () => void;
}

export const BazaarDutyCard: React.FC<BazaarDutyCardProps> = ({ onOpenAddExpense }) => {
  const { 
    bazaarDuties, 
    setIsEditBazaarModalOpen, 
    currentMess, 
    currentUser,
    allMembers 
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const todayDuty = bazaarDuties[todayStr] || {
    date: todayStr,
    assignedMemberIds: ['user_rahim_member', 'user_tanvir_member'],
    assignedNames: ['Rahim', 'Tanvir'],
    estimatedBudget: 2200,
    notes: 'Fresh vegetables, broiler chicken & cooking oil',
    isCompleted: false,
  };

  const tomorrowDuty = bazaarDuties[tomorrowStr] || {
    date: tomorrowStr,
    assignedMemberIds: ['user_shakib_member'],
    assignedNames: ['Shakib'],
    estimatedBudget: 3500,
    notes: 'Friday Special bazar',
    isCompleted: false,
  };

  const isCurrentMemberAssignedToday = todayDuty.assignedMemberIds?.includes(currentUser.id);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Daily Bazar Duty
              </h3>
              {isCurrentMemberAssignedToday && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                  Your Turn Today!
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Rotating grocery shopping schedule
            </p>
          </div>
        </div>

        <button
          id="btn-edit-bazaar-duty"
          onClick={() => setIsEditBazaarModalOpen(true)}
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
        >
          Change Duty
        </button>
      </div>

      {/* Duty Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Today's Duty */}
        <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
              Today&apos;s Shopper(s)
            </span>
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
              Budget: {currentMess.currency}{todayDuty.estimatedBudget || 2000}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300">
              <UserCheck className="w-4 h-4" />
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {todayDuty.assignedNames && todayDuty.assignedNames.length > 0 
                ? todayDuty.assignedNames.join(' & ') 
                : 'Unassigned'}
            </p>
          </div>

          {todayDuty.notes && (
            <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
              📝 {todayDuty.notes}
            </p>
          )}
        </div>

        {/* Tomorrow's Duty */}
        <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
              Tomorrow&apos;s Shopper
            </span>
            <span className="text-[11px] text-slate-400">Next Rotation</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
              <Calendar className="w-4 h-4" />
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {tomorrowDuty.assignedNames && tomorrowDuty.assignedNames.length > 0 
                ? tomorrowDuty.assignedNames.join(' & ') 
                : 'Next in rotation'}
            </p>
          </div>

          {tomorrowDuty.notes && (
            <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
              📝 {tomorrowDuty.notes}
            </p>
          )}
        </div>
      </div>

      {/* Action to log bazaar cost directly */}
      {onOpenAddExpense && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Did you finish today&apos;s shopping?
          </span>
          <button
            id="btn-log-bazaar-expense"
            onClick={onOpenAddExpense}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Record Bazar Cost</span>
          </button>
        </div>
      )}
    </div>
  );
};
