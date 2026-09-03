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
  Wifi, 
  WifiOff, 
  Copy, 
  Check, 
  ChevronDown, 
  ShieldCheck, 
  UserCheck, 
  Share2,
  Sparkles,
  LogIn,
  PlusCircle,
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
    switchDemoProfile, 
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
    setIsJoinCreateMessOpen
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentMess.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const months = ['2026-07', '2026-08', '2026-09', '2026-10'];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Left: Mess Logo & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-sm shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-slate-900 dark:text-white truncate text-sm sm:text-base tracking-tight">
                  {currentMess.name}
                </h1>
                {isMonthClosed && (
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300">
                    Closed
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <button
                  id="btn-copy-invite-code"
                  onClick={handleCopyCode}
                  title="Click to copy Mess Invite Code"
                  className="inline-flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  <span className="font-mono font-medium text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    #{currentMess.inviteCode}
                  </span>
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                </button>

                <span className="hidden md:inline text-slate-300 dark:text-slate-700">•</span>

                {/* Online/Offline status */}
                <div className="hidden md:flex items-center gap-1">
                  {isOnline ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                      <Wifi className="w-3 h-3" />
                      {t.online}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400">
                      <WifiOff className="w-3 h-3" />
                      {t.offline}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Center: Month Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-xl p-0.5 border border-slate-200/60 dark:border-slate-700/60 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-500 ml-2 shrink-0 hidden xs:block" />
            <select
              id="select-month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent font-medium text-slate-700 dark:text-slate-200 px-2 py-1.5 rounded-lg focus:outline-none cursor-pointer"
            >
              {months.map(m => (
                <option key={m} value={m} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
                  {formatMonthDisplay(m, lang)}
                </option>
              ))}
            </select>
          </div>

          {/* Right: Actions & User Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

            {/* Join / Create Mess Button */}
            <button
              id="btn-join-create-mess"
              onClick={() => setIsJoinCreateMessOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors cursor-pointer"
              title="Join or Create a Mess"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Join / Create Mess</span>
            </button>
            
            {/* Language Switch */}
            <button
              id="btn-switch-lang"
              onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{lang === 'en' ? 'বাংলা' : 'EN'}</span>
            </button>

            {/* Theme Switch */}
            <button
              id="btn-switch-theme"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                id="btn-notifications"
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </button>

              {/* Notification Popover */}
              {notifDropdownOpen && (
                <div 
                  id="notifications-popover"
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-in fade-in"
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Notifications
                    </span>
                    <button 
                      onClick={onOpenNotices} 
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
              )}
            </div>

            {/* Quick Profile / Demo Account Switcher */}
            <div className="relative">
              <button
                id="btn-profile-menu"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
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
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile dropdown */}
              {profileDropdownOpen && (
                <div 
                  id="profile-dropdown"
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-in fade-in"
                >
                  <div className="pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {t.switchRole}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">Test as Admin or Member</p>
                  </div>

                  <div className="space-y-1">
                    {allMembers.slice(0, 5).map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          switchDemoProfile(m.id);
                          setProfileDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                          currentUser.id === m.id
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {m.role === 'admin' ? (
                            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <UserCheck className="w-4 h-4 text-indigo-500 shrink-0" />
                          )}
                          <span className="truncate">{m.name}</span>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          m.role === 'admin' ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          {m.role}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
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
                        <span>{authUser ? 'Firebase Account' : 'Sign In / Google Auth'}</span>
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
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
