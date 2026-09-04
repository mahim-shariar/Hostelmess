import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { ShoppingCart, Users, Calendar, DollarSign, ListChecks } from 'lucide-react';

export const EditBazaarModal: React.FC = () => {
  const { 
    isEditBazaarModalOpen, 
    setIsEditBazaarModalOpen, 
    bazaarDuties, 
    updateBazaarDuty,
    allMembers,
    currentMess 
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [date, setDate] = useState(todayStr);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [budget, setBudget] = useState<number>(2000);
  const [notes, setNotes] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isEditBazaarModalOpen) {
      const existing = bazaarDuties[date];
      if (existing) {
        setSelectedMemberIds(existing.assignedMemberIds || []);
        setBudget(existing.estimatedBudget || 2000);
        setNotes(existing.notes || '');
        setIsCompleted(existing.isCompleted || false);
      } else {
        setSelectedMemberIds([]);
        setBudget(2000);
        setNotes('');
        setIsCompleted(false);
      }
    }
  }, [date, isEditBazaarModalOpen, bazaarDuties]);

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMemberIds(prev => {
      if (prev.includes(memberId)) {
        return prev.filter(id => id !== memberId);
      } else {
        return [...prev, memberId];
      }
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedNames = selectedMemberIds
      .map(id => allMembers.find(m => m.id === id)?.name || '')
      .filter(Boolean);

    updateBazaarDuty(date, {
      assignedMemberIds: selectedMemberIds,
      assignedNames,
      estimatedBudget: Number(budget) || 0,
      notes,
      isCompleted,
    });

    setIsEditBazaarModalOpen(false);
  };

  return (
    <Modal
      isOpen={isEditBazaarModalOpen}
      onClose={() => setIsEditBazaarModalOpen(false)}
      title="Assign Bazar (Market) Duty"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSave} className="space-y-4">
        {/* Date Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Duty Date</span>
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setDate(todayStr)}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                date === todayStr
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setDate(tomorrowStr)}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                date === tomorrowStr
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              Tomorrow
            </button>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1 py-1 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Member Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>Assigned Shopper(s)</span>
            </span>
            <span className="text-[11px] text-slate-400">Select 1 or more</span>
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700">
            {allMembers.filter(m => m.status === 'active').map(m => {
              const isSelected = selectedMemberIds.includes(m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => toggleMemberSelection(m.id)}
                  className={`flex items-center gap-2 p-2 rounded-xl text-xs font-medium border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center text-[10px] ${
                    isSelected ? 'bg-white text-emerald-600 font-black' : 'border border-slate-300'
                  }`}>
                    {isSelected ? '✓' : ''}
                  </div>
                  <span className="truncate">{m.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Estimated Budget */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
            <span>Estimated Budget ({currentMess.currency})</span>
          </label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            placeholder="2000"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-emerald-500"
          />
        </div>

        {/* Shopping list / Grocery items */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
            <ListChecks className="w-3.5 h-3.5 text-slate-400" />
            <span>Shopping List &amp; Items to Buy</span>
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. 2kg Chicken, 1kg dal, potatoes, green chilies, onions"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-emerald-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => setIsEditBazaarModalOpen(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs cursor-pointer transition-colors"
          >
            Save Duty Roster
          </button>
        </div>
      </form>
    </Modal>
  );
};
