import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Megaphone, 
  Settings, 
  HelpCircle, 
  Globe, 
  Users, 
  Clock, 
  Plus, 
  Trash2, 
  Check, 
  Building2, 
  DollarSign, 
  ShieldCheck, 
  FileText,
  Lock
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Notice } from '../../types';

interface MoreSettingsProps {
  onOpenTutorial: () => void;
  onGoToReports: () => void;
}

export const MoreSettings: React.FC<MoreSettingsProps> = ({ 
  onOpenTutorial, 
  onGoToReports 
}) => {
  const { 
    currentUser, 
    setCurrentUser, 
    allMembers, 
    currentMess, 
    updateMess, 
    notices, 
    addNotice, 
    deleteNotice, 
    lang, 
    setLang, 
    t 
  } = useApp();

  const isAdmin = currentUser.role === 'admin';

  // Notices Modal
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');

  // Settings Modal
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [messName, setMessName] = useState(currentMess?.name || '');
  const [messCurrency, setMessCurrency] = useState(currentMess?.currency || '৳');
  const [breakfastWeight, setBreakfastWeight] = useState<number>(currentMess?.settings?.breakfastWeight ?? 1);
  const [guestMealsEnabled, setGuestMealsEnabled] = useState<boolean>(currentMess?.settings?.enableGuestMeals ?? true);
  const [bCutoff, setBCutoff] = useState<string>(currentMess?.settings?.mealCutoff?.breakfast || '22:00');
  const [lCutoff, setLCutoff] = useState<string>(currentMess?.settings?.mealCutoff?.lunch || '09:00');
  const [dCutoff, setDCutoff] = useState<string>(currentMess?.settings?.mealCutoff?.dinner || '15:00');

  useEffect(() => {
    if (currentMess) {
      setMessName(currentMess.name);
      setMessCurrency(currentMess.currency || '৳');
      setBreakfastWeight(currentMess.settings?.breakfastWeight ?? 1);
      setGuestMealsEnabled(currentMess.settings?.enableGuestMeals ?? true);
      setBCutoff(currentMess.settings?.mealCutoff?.breakfast || '22:00');
      setLCutoff(currentMess.settings?.mealCutoff?.lunch || '09:00');
      setDCutoff(currentMess.settings?.mealCutoff?.dinner || '15:00');
    }
  }, [currentMess]);

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;

    await addNotice(noticeTitle.trim(), noticeContent.trim());
    setNoticeTitle('');
    setNoticeContent('');
    setNoticeModalOpen(false);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateMess({
      name: messName.trim() || currentMess.name,
      currency: messCurrency.trim() || '৳',
      settings: {
        ...currentMess.settings,
        breakfastWeight,
        enableGuestMeals: guestMealsEnabled,
        mealCutoff: {
          breakfast: bCutoff,
          lunch: lCutoff,
          dinner: dCutoff,
        },
      }
    });
    setSettingsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-200">
      
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          {t.navMore} &amp; Settings
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Preferences, notices, reports &amp; mess configurations
        </p>
      </div>

      {/* QUICK SWITCH USER DEMO BAR */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Switch Active Profile (Demo / Testing)
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
            Current: {currentUser.name} ({currentUser.role})
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {allMembers.slice(0, 4).map(m => (
            <button
              key={m.id}
              onClick={() => setCurrentUser(m)}
              className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                currentUser.id === m.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{m.name.split(' ')[0]}</span>
              <span className="text-[10px] opacity-75 font-normal">({m.role === 'admin' ? 'Admin' : 'Member'})</span>
            </button>
          ))}
        </div>
      </div>

      {/* NOTICE BOARD (Requirement 27) */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {t.noticeBoard}
              </h3>
              <p className="text-xs text-slate-400">Important updates &amp; announcements</p>
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={() => setNoticeModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.addNotice}</span>
            </button>
          )}
        </div>

        {notices.length === 0 ? (
          <p className="text-xs text-slate-400 py-2">No notices posted yet.</p>
        ) : (
          <div className="space-y-2.5">
            {notices.map(n => (
              <div
                key={n.id}
                className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 text-xs space-y-1 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-amber-100">
                    {n.title}
                  </span>
                  <span className="text-[10px] text-slate-400">{n.date}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300">
                  {n.content}
                </p>
                {isAdmin && (
                  <button
                    onClick={() => deleteNotice(n.id)}
                    className="absolute top-2.5 right-2 text-slate-400 hover:text-rose-600 p-1"
                    title="Delete notice"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MORE MENU OPTIONS */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs divide-y divide-slate-100 dark:divide-slate-800 text-xs">
        
        {/* Monthly Reports */}
        <div 
          onClick={onGoToReports}
          className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">{t.monthlyReport}</p>
              <p className="text-slate-400">PDF printable report &amp; CSV export</p>
            </div>
          </div>
          <span className="text-slate-400 font-bold">→</span>
        </div>

        {/* Mess Settings (Admin only) */}
        {isAdmin && (
          <div 
            onClick={() => setSettingsModalOpen(true)}
            className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{t.settings}</p>
                <p className="text-slate-400">Cutoff times, breakfast weight, currency</p>
              </div>
            </div>
            <span className="text-slate-400 font-bold">→</span>
          </div>
        )}

        {/* Language switch */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Language / ভাষা</p>
              <p className="text-slate-400">Toggle English or বাংলা</p>
            </div>
          </div>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-lg font-bold text-xs ${
                lang === 'en' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-xs' : 'text-slate-400'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang('bn')}
              className={`px-3 py-1 rounded-lg font-bold text-xs ${
                lang === 'bn' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-xs' : 'text-slate-400'
              }`}
            >
              বাংলা
            </button>
          </div>
        </div>

        {/* Tutorial Replay */}
        <div 
          onClick={onOpenTutorial}
          className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">{t.howAppWorks}</p>
              <p className="text-slate-400">View the 4-step interactive walkthrough</p>
            </div>
          </div>
          <span className="text-slate-400 font-bold">→</span>
        </div>

      </div>

      {/* POST NOTICE MODAL */}
      <Modal
        isOpen={noticeModalOpen}
        onClose={() => setNoticeModalOpen(false)}
        title={t.addNotice}
      >
        <form onSubmit={handleCreateNotice} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Bazar Duty Schedule for Friday"
              value={noticeTitle}
              onChange={(e) => setNoticeTitle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Message Content *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Write the notice details here..."
              value={noticeContent}
              onChange={(e) => setNoticeContent(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setNoticeModalOpen(false)}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-xl"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs cursor-pointer"
            >
              Post Notice
            </button>
          </div>
        </form>
      </Modal>

      {/* MESS SETTINGS MODAL */}
      <Modal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        title={t.settings}
      >
        <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
          
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Mess / Hostel Name
            </label>
            <input
              type="text"
              required
              value={messName}
              onChange={(e) => setMessName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                required
                value={messCurrency}
                onChange={(e) => setMessCurrency(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Breakfast Weight
              </label>
              <select
                value={breakfastWeight}
                onChange={(e) => setBreakfastWeight(parseFloat(e.target.value) as 0.5 | 1)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none"
              >
                <option value={1}>1 Full Meal</option>
                <option value={0.5}>0.5 Half Meal</option>
              </select>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">
              Daily Meal Cutoff Times
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-[11px] text-slate-500 block mb-1">Breakfast</span>
                <input
                  type="time"
                  value={bCutoff}
                  onChange={(e) => setBCutoff(e.target.value)}
                  className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg p-1.5 text-xs font-semibold"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block mb-1">Lunch</span>
                <input
                  type="time"
                  value={lCutoff}
                  onChange={(e) => setLCutoff(e.target.value)}
                  className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg p-1.5 text-xs font-semibold"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block mb-1">Dinner</span>
                <input
                  type="time"
                  value={dCutoff}
                  onChange={(e) => setDCutoff(e.target.value)}
                  className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg p-1.5 text-xs font-semibold"
                />
              </div>
            </div>
          </div>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 cursor-pointer">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Allow Members to log Guest Meals
            </span>
            <input
              type="checkbox"
              checked={guestMealsEnabled}
              onChange={(e) => setGuestMealsEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
          </label>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setSettingsModalOpen(false)}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-xl"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs cursor-pointer"
            >
              {t.save}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
