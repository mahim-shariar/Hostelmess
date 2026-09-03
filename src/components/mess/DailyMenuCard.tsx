import React from 'react';
import { useApp } from '../../context/AppContext';
import { UtensilsCrossed, Clock, ChefHat, Edit3, Share2, Sparkles } from 'lucide-react';

export const DailyMenuCard: React.FC = () => {
  const { 
    dailyMenus, 
    setIsEditMenuModalOpen, 
    setIsCookSummaryOpen,
    currentUser 
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayMenu = dailyMenus[todayStr] || {
    date: todayStr,
    breakfast: 'Egg Omelette / Paratha / Khichuri',
    lunch: 'Desi Chicken Curry, Masoor Dal, Alu Bharta & Steamed Rice',
    dinner: 'Rui Fish Jhol, Mixed Seasonal Vegetables & Steamed Rice',
    cookNotes: 'Lunch serving starts at 1:30 PM.',
    servingTimes: {
      breakfast: '08:30 AM',
      lunch: '01:30 PM',
      dinner: '09:00 PM',
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Today&apos;s Meal Menu
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
                Fresh Cooked
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Check what&apos;s cooking before meal cutoff
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <button
            id="btn-open-cook-sheet"
            onClick={() => setIsCookSummaryOpen(true)}
            title="Cook Meal Sheet & WhatsApp"
            className="p-2 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            id="btn-edit-daily-menu"
            onClick={() => setIsEditMenuModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit Menu</span>
          </button>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Lunch */}
        <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <UtensilsCrossed className="w-3.5 h-3.5" />
                Lunch (দুপুর)
              </span>
              {todayMenu.servingTimes?.lunch && (
                <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {todayMenu.servingTimes.lunch}
                </span>
              )}
            </div>
            <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
              {todayMenu.lunch || 'Standard Mess Lunch'}
            </p>
          </div>
        </div>

        {/* Dinner */}
        <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                <UtensilsCrossed className="w-3.5 h-3.5" />
                Dinner (রাত)
              </span>
              {todayMenu.servingTimes?.dinner && (
                <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {todayMenu.servingTimes.dinner}
                </span>
              )}
            </div>
            <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
              {todayMenu.dinner || 'Standard Mess Dinner'}
            </p>
          </div>
        </div>
      </div>

      {/* Breakfast & Cook Note Banner */}
      {(todayMenu.breakfast || todayMenu.cookNotes) && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300">
          {todayMenu.breakfast && (
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Breakfast:</span>
              <span className="text-slate-500 dark:text-slate-400">{todayMenu.breakfast}</span>
            </div>
          )}
          {todayMenu.cookNotes && (
            <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 bg-amber-50/80 dark:bg-amber-950/40 px-2.5 py-1 rounded-xl text-[11px]">
              <Sparkles className="w-3 h-3 shrink-0" />
              <span className="truncate">{todayMenu.cookNotes}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
