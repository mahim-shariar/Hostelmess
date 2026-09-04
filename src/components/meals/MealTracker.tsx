import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar as CalendarIcon, 
  Utensils, 
  Lock, 
  Check, 
  Plus, 
  Minus, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  User,
  Coffee,
  Sun,
  Moon
} from 'lucide-react';
import { formatMonthDisplay } from '../../lib/accounting';
import { Modal } from '../ui/Modal';

export const MealTracker: React.FC = () => {
  const { 
    currentUser, 
    allMembers, 
    meals, 
    saveMeal, 
    isMealLocked, 
    selectedMonth, 
    setSelectedMonth, 
    currentMess,
    t, 
    lang,
    isMonthClosed
  } = useApp();

  const isAdmin = currentUser.role === 'admin';
  const [selectedMemberId, setSelectedMemberId] = useState<string>(currentUser.id);
  const [editingDate, setEditingDate] = useState<string | null>(null);
  
  // Edit modal state
  const [editB, setEditB] = useState<0 | 0.5 | 1>(1);
  const [editL, setEditL] = useState<0 | 0.5 | 1>(1);
  const [editD, setEditD] = useState<0 | 0.5 | 1>(1);
  const [editGL, setEditGL] = useState<number>(0);
  const [editGD, setEditGD] = useState<number>(0);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Parse days in selectedMonth
  const [yearStr, monthStr] = selectedMonth.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const daysInMonth = new Date(year, month, 0).getDate();

  // Selected member object
  const targetMember = allMembers.find(m => m.id === selectedMemberId) || currentUser;

  // Build rows for each day in month
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `${selectedMonth}-${String(dayNum).padStart(2, '0')}`;
    const record = meals.find(m => m.memberId === selectedMemberId && m.date === dateStr);

    const b = record?.breakfast ?? 0;
    const l = record?.lunch ?? 0;
    const d = record?.dinner ?? 0;
    const gl = record?.guestLunch ?? 0;
    const gd = record?.guestDinner ?? 0;
    const total = b + l + d + gl + gd;

    return {
      dayNum,
      dateStr,
      b,
      l,
      d,
      gl,
      gd,
      total,
      hasRecord: Boolean(record),
    };
  });

  const totalMonthMeals = daysArray.reduce((acc, curr) => acc + curr.total, 0);

  const openEditModal = (day: typeof daysArray[0]) => {
    // If not admin, check if editing is permitted
    if (!isAdmin && (isMonthClosed || !currentUser.permissions.editOwnMeal)) {
      return;
    }
    setEditingDate(day.dateStr);
    setEditB(day.b as 0 | 0.5 | 1);
    setEditL(day.l as 0 | 0.5 | 1);
    setEditD(day.d as 0 | 0.5 | 1);
    setEditGL(day.gl);
    setEditGD(day.gd);
    setSaveStatus(null);
  };

  const handleSaveMealModal = async () => {
    if (!editingDate) return;
    setSaveStatus('Saving...');
    const res = await saveMeal(
      selectedMemberId,
      editingDate,
      editB,
      editL,
      editD,
      editGL,
      editGD
    );
    if (res.success) {
      setSaveStatus('Saved!');
      setTimeout(() => {
        setEditingDate(null);
        setSaveStatus(null);
      }, 500);
    } else {
      setSaveStatus(res.error || 'Failed to save');
    }
  };

  return (
    <div className="space-y-5 pb-24 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t.mealCalendar}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {formatMonthDisplay(selectedMonth, lang)} • {daysInMonth} Days
          </p>
        </div>

        {/* Admin member selector */}
        {isAdmin && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Member:</span>
            <select
              id="select-meal-member"
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none cursor-pointer"
            >
              {allMembers.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} {m.id === currentUser.id ? '(You)' : ''}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Summary Banner for Selected Member */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 font-bold">
            {targetMember.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {targetMember.name}
            </h3>
            <p className="text-xs text-slate-500">
              {daysArray.filter(d => d.total > 0).length} active meal days
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500 block">Total Meals</span>
          <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
            {totalMonthMeals}
          </span>
        </div>
      </div>

      {/* CALENDAR TABLE (Requirement 9) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
        
        {/* Table Header */}
        <div className="grid grid-cols-5 text-center text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 sm:p-3.5 border-b border-slate-200 dark:border-slate-800">
          <div className="text-left pl-2">{t.date}</div>
          <div>{t.breakfast}</div>
          <div>{t.lunch}</div>
          <div>{t.dinner}</div>
          <div className="text-right pr-2">{t.total}</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
          {daysArray.map((day) => {
            const isToday = day.dateStr === new Date().toISOString().split('T')[0];
            const isPast = day.dateStr < new Date().toISOString().split('T')[0];

            return (
              <div
                key={day.dateStr}
                onClick={() => openEditModal(day)}
                className={`grid grid-cols-5 items-center text-center py-3 px-2 transition-colors cursor-pointer ${
                  isToday 
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/30 font-semibold' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                {/* Date */}
                <div className="text-left pl-2 flex items-center gap-1.5 font-medium text-slate-900 dark:text-white">
                  <span>Day {day.dayNum}</span>
                  {isToday && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-600 text-white font-bold uppercase">
                      Today
                    </span>
                  )}
                </div>

                {/* Breakfast */}
                <div className="text-slate-700 dark:text-slate-300">
                  {day.b > 0 ? (
                    <span className="font-bold text-slate-900 dark:text-white">{day.b}</span>
                  ) : (
                    <span className="text-slate-300 dark:text-slate-600">0</span>
                  )}
                </div>

                {/* Lunch */}
                <div className="text-slate-700 dark:text-slate-300">
                  {day.l > 0 ? (
                    <span className="font-bold text-slate-900 dark:text-white">
                      {day.l}
                      {day.gl > 0 && <span className="text-emerald-600 font-normal"> +{day.gl}g</span>}
                    </span>
                  ) : (
                    <span className="text-slate-300 dark:text-slate-600">0</span>
                  )}
                </div>

                {/* Dinner */}
                <div className="text-slate-700 dark:text-slate-300">
                  {day.d > 0 ? (
                    <span className="font-bold text-slate-900 dark:text-white">
                      {day.d}
                      {day.gd > 0 && <span className="text-emerald-600 font-normal"> +{day.gd}g</span>}
                    </span>
                  ) : (
                    <span className="text-slate-300 dark:text-slate-600">0</span>
                  )}
                </div>

                {/* Total */}
                <div className="text-right pr-2">
                  <span className={`inline-block px-2 py-0.5 rounded-md font-black text-xs ${
                    day.total > 0 
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' 
                      : 'text-slate-400'
                  }`}>
                    {day.total}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* EDIT MEAL MODAL */}
      <Modal
        isOpen={Boolean(editingDate)}
        onClose={() => setEditingDate(null)}
        title={`Edit Meals: ${editingDate}`}
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            For {targetMember.name}. Tap to set 0, 0.5, or 1 meal.
          </p>

          {editingDate === new Date().toISOString().split('T')[0] && (
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
              ⏰ Cutoff rule: Lunch can be turned off/edited before <strong>9:00 AM</strong>, Dinner before <strong>4:00 PM</strong>.
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            
            {/* Breakfast */}
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                <Coffee className="w-3.5 h-3.5" /> {t.breakfast}
              </span>
              <div className="flex items-center gap-1 mt-1">
                {[0, 0.5, 1].map((val) => (
                  <button
                    key={val}
                    onClick={() => setEditB(val as 0 | 0.5 | 1)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      editB === val
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Lunch */}
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                <Sun className="w-3.5 h-3.5" /> {t.lunch}
              </span>
              <div className="flex items-center gap-1 mt-1">
                {[0, 0.5, 1].map((val) => (
                  <button
                    key={val}
                    onClick={() => setEditL(val as 0 | 0.5 | 1)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      editL === val
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Dinner */}
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                <Moon className="w-3.5 h-3.5" /> {t.dinner}
              </span>
              <div className="flex items-center gap-1 mt-1">
                {[0, 0.5, 1].map((val) => (
                  <button
                    key={val}
                    onClick={() => setEditD(val as 0 | 0.5 | 1)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      editD === val
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Guest Meals in edit modal */}
          {currentMess.settings.enableGuestMeals && (
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">Guest Meals</span>
                <p className="text-slate-400">Added to personal total</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="text-slate-500">Lunch:</span>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={editGL}
                    onChange={(e) => setEditGL(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="w-12 px-1.5 py-1 text-center bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-bold"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-500">Dinner:</span>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={editGD}
                    onChange={(e) => setEditGD(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="w-12 px-1.5 py-1 text-center bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Total preview in modal */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="font-semibold text-slate-600 dark:text-slate-400">New Day Total:</span>
            <span className="font-black text-sm text-emerald-600 dark:text-emerald-400">
              {editB + editL + editD + editGL + editGD} Meals
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setEditingDate(null)}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              {t.cancel}
            </button>
            <button
              id="btn-save-meal-calendar"
              onClick={handleSaveMealModal}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
            >
              {saveStatus || t.save}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
