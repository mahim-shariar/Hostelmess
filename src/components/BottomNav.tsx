import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home, 
  LayoutDashboard, 
  UtensilsCrossed, 
  ReceiptText, 
  Users, 
  CreditCard, 
  MoreHorizontal 
} from 'lucide-react';

export type NavTab = 'home' | 'dashboard' | 'meals' | 'expenses' | 'members' | 'account' | 'more';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const { currentUser, t } = useApp();
  const isAdmin = currentUser.role === 'admin';

  // Member tabs: Home, Meals, Account, More
  // Admin tabs: Dashboard, Meals, Expenses, Members, More
  const tabs = isAdmin
    ? [
        { id: 'dashboard' as NavTab, label: t.managerDashboard.split(' ')[0], icon: LayoutDashboard },
        { id: 'meals' as NavTab, label: t.navMeals, icon: UtensilsCrossed },
        { id: 'expenses' as NavTab, label: t.navExpenses, icon: ReceiptText },
        { id: 'members' as NavTab, label: t.navMembers, icon: Users },
        { id: 'more' as NavTab, label: t.navMore, icon: MoreHorizontal },
      ]
    : [
        { id: 'home' as NavTab, label: t.navHome, icon: Home },
        { id: 'meals' as NavTab, label: t.navMeals, icon: UtensilsCrossed },
        { id: 'account' as NavTab, label: t.navAccount, icon: CreditCard },
        { id: 'more' as NavTab, label: t.navMore, icon: MoreHorizontal },
      ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 safe-area-bottom">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 min-h-[44px] transition-all cursor-pointer active:scale-95 select-none ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${
                isActive ? 'bg-emerald-50 dark:bg-emerald-950/60 scale-105' : ''
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] tracking-tight mt-0.5 whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
