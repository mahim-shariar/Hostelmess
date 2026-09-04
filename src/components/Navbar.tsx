import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Users, 
  Calendar, 
  Globe, 
  Moon, 
  Sun, 
  Bell, 
  ChevronDown, 
  ShieldCheck, 
  UserCheck, 
  Sparkles,
  LogIn,
  KeyRound
} from 'lucide-react';
import { formatMonthDisplay } from '../lib/accounting';

interface NavbarProps {
  onOpenSettings: () => void;
  onOpenNotices: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSettings, onOpenNotices }) => {
  const { 
    currentMess, 
    currentUser, 
    allMembers, 
    selectedMonth, 
    setSelectedMonth, 
    lang, 
    setLang, 
    theme, 
    setTheme, 
    isOnline, 
    t, 
    notifications,
    markNotificationAsRead,
    isMonthClosed,
    setTutorialOpen,
    authUser,
    setIsAuthModalOpen,
    setIsJoinCreateMessOpen,
    logout
  } = useApp();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const months = ['2026-07', '2026-08', '2026-09', '2026-10'];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          
          {/* Left: App Brand & Logo */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-xs shrink-0">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            
            <div className="min-w-0">
              <span className="font-bold text-slate-900 dark:text-white text-xs xs:text-sm sm:text-base tracking-tight truncate block">
                {lang === 'bn' ? 'হোস্টেল মেস' : 'Hostel Mess'}
              </span>
            </div>
          </div>

          {/* Center: Month Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-xl p-0.5 border border-slate-200/60 dark:border-slate-700/60 text-xs shrink-0">
            <Calendar className="w-3.5 h-3.5 text-slate-500 ml-1.5 shrink-0 hidden xs:block" />
            <select
              id="select-month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent font-medium text-slate-700 dark:text-slate-200 px-1.5 py-1 sm:px-2 sm:py-1.5 text-[11px] sm:text-xs rounded-lg focus:outline-none cursor-pointer"
            >
              {months.map(m => (
                <option key={m} value={m} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
                  {formatMonthDisplay(m, lang)}
                </option>
              ))}
            </select>
          </div>

          {/* Right: Actions & User Switcher */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">

            {/* Language Switch */}
            <button
              id="btn-switch-lang"
              onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
              className="flex items-center gap-1 px-2 py-1.5 sm:px-2.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer active:scale-95"
              title="Switch Language"
            >
              <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[11px] sm:text-xs">{lang === 'en' ? 'বাং' : 'EN'}</span>
            </button>

            {/* Theme Switch */}
            <button
              id="btn-switch-theme"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 sm:p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer active:scale-90"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                id="btn-notifications"
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-1.5 sm:p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative cursor-pointer active:scale-90"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </button>

              {/* Notification Popover */}
              {notifDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40 bg-black/10 dark:bg-black/30 backdrop-blur-[1px]"
                    onClick={() => setNotifDropdownOpen(false)}
                  />
                  <div 
                    id="notifications-popover"
                    className="fixed inset-x-3 top-16 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 w-auto sm:w-80 max-w-[calc(100vw-24px)] bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-in fade-in"
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Notifications
                      </span>
                      <button 
                        onClick={() => {
                          onOpenNotices();
                          setNotifDropdownOpen(false);
                        }} 
                        className="text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
                      >
                        {t.notices}
                      </button>
                    </div>

                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-400 py-4 text-center">No notifications yet</p>
                      ) : (
                        notifications.slice(0, 5).map(n => (
                          <div 
                            key={n.id} 
                            onClick={() => markNotificationAsRead(n.id)}
                            className={`p-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                              n.read ? 'bg-slate-50/50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400' : 'bg-emerald-50/70 dark:bg-emerald-950/40 text-slate-800 dark:text-slate-200 border-l-2 border-emerald-500'
                            }`}
                          >
                            <p className="font-semibold text-slate-900 dark:text-white">{n.title}</p>
                            <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User Profile Menu */}
            <div className="relative">
              <button
                id="btn-profile-menu"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-1.5 p-1 sm:pl-2 sm:pr-2.5 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer active:scale-95"
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold text-white shadow-xs ${
                  currentUser.role === 'admin' ? 'bg-emerald-600' : 'bg-indigo-600'
                }`}>
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white leading-none">
                    {currentUser.name.split(' ')[0]}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    currentUser.role === 'admin' ? 'text-emerald-600 dark:text-emerald-400' : 'text-indigo-600 dark:text-indigo-400'
                  }`}>
                    {currentUser.role === 'admin' ? 'Admin' : 'Member'}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
              </button>

              {/* Profile dropdown */}
              {profileDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40 bg-black/10 dark:bg-black/30 backdrop-blur-[1px]"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div 
                    id="profile-dropdown"
                    className="fixed inset-x-3 top-16 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 w-auto sm:w-68 max-w-[calc(100vw-24px)] bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-in fade-in"
                  >
                    <div className="pb-3 mb-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-xs ${
                          currentUser.role === 'admin' ? 'bg-emerald-600' : 'bg-indigo-600'
                        }`}>
                          {currentUser.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {currentUser.name}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                              currentUser.role === 'admin' 
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' 
                                : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300'
                            }`}>
                              {currentUser.role === 'admin' ? 'Manager' : 'Member'}
                            </span>
                            <span className="text-[10px] text-slate-400 truncate">
                              {currentMess.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                  <div className="pt-1 space-y-1">
                    <button
                      id="btn-open-auth-menu"
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <LogIn className="w-4 h-4" />
                        <span>{authUser ? 'Account Status' : 'Sign In / Account'}</span>
                      </div>
                      {authUser && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                    </button>

                    <button
                      id="btn-open-join-create-mess-menu"
                      onClick={() => {
                        setIsJoinCreateMessOpen(true);
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <KeyRound className="w-4 h-4 text-slate-500" />
                      <span>Join or Create Mess</span>
                    </button>

                    <button
                      id="btn-open-tutorial-menu"
                      onClick={() => {
                        setTutorialOpen(true);
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>{t.tutorial}</span>
                    </button>
                    <button
                      id="btn-open-settings-menu"
                      onClick={() => {
                        onOpenSettings();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <Users className="w-4 h-4 text-slate-500" />
                      <span>{t.settings}</span>
                    </button>
                  </div>
                </div>
              </>
            )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
