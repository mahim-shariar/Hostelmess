import React from 'react';
import { ShoppingBag, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface QuickBazaarFloatingButtonProps {
  onClick: () => void;
}

export const QuickBazaarFloatingButton: React.FC<QuickBazaarFloatingButtonProps> = ({ onClick }) => {
  const { lang, isMonthClosed } = useApp();

  if (isMonthClosed) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-8 right-4 sm:right-8 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button
        id="btn-quick-bazaar-fab"
        onClick={onClick}
        aria-label="Quick Add Bazar Expense"
        className="group relative flex items-center gap-2 pl-3.5 pr-4.5 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-700/30 hover:shadow-xl hover:shadow-emerald-700/40 active:scale-95 transition-all duration-200 cursor-pointer border border-emerald-400/20"
      >
        <div className="relative">
          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white text-emerald-700 flex items-center justify-center">
            <Plus className="w-2 h-2 stroke-[3]" />
          </div>
        </div>

        <span className="tracking-tight whitespace-nowrap">
          {lang === 'bn' ? '+ বাজার এন্ট্রি' : '+ Quick Bazar'}
        </span>

        {/* Subtle glowing ring effect */}
        <span className="absolute -inset-0.5 rounded-full bg-emerald-400/20 -z-10 group-hover:bg-emerald-400/30 blur-[2px] transition-all" />
      </button>
    </div>
  );
};
