import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Plus, 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  Sliders, 
  Trash2, 
  Check, 
  X, 
  Calendar, 
  CreditCard, 
  ReceiptText, 
  Utensils, 
  Phone, 
  Mail, 
  IdCard,
  ChevronRight
} from 'lucide-react';
import { Member, Role, MemberPermissions } from '../../types';
import { Modal } from '../ui/Modal';
import { formatMonthDisplay } from '../../lib/accounting';

interface MemberListProps {
  isAddModalOpen?: boolean;
  setIsAddModalOpen?: (open: boolean) => void;
}

export const MemberList: React.FC<MemberListProps> = ({
  isAddModalOpen: externalAddOpen,
  setIsAddModalOpen: setExternalAddOpen,
}) => {
  const { 
    currentUser, 
    allMembers, 
    addMember, 
    updateMemberPermissions, 
    toggleMemberStatus, 
    removeMember, 
    monthlyCalculations, 
    meals, 
    expenses, 
    payments, 
    selectedMonth, 
    currentMess,
    t, 
    lang,
    isMonthClosed 
  } = useApp();

  const isAdmin = currentUser.role === 'admin';

  // Add Member Modal
  const [internalAddOpen, setInternalAddOpen] = useState(false);
  const isAddOpen = externalAddOpen !== undefined ? externalAddOpen : internalAddOpen;
  const setIsAddOpen = setExternalAddOpen || setInternalAddOpen;

  // Selected Member for Detail View (Requirement 22)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Selected Member for Permissions Edit (Requirement 3)
  const [permissionMember, setPermissionMember] = useState<Member | null>(null);
  const [tempPermissions, setTempPermissions] = useState<MemberPermissions | null>(null);

  // Add Member Form
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formStudentId, setFormStudentId] = useState('');
  const [formRole, setFormRole] = useState<Role>('member');

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    await addMember({
      name: formName.trim(),
      email: formEmail.trim() || `${formName.toLowerCase().replace(/\s+/g, '')}@student.edu`,
      phone: formPhone.trim() || undefined,
      studentId: formStudentId.trim() || undefined,
      role: formRole,
    });

    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormStudentId('');
    setIsAddOpen(false);
  };

  const openPermissionsModal = (member: Member, e: React.MouseEvent) => {
    e.stopPropagation();
    setPermissionMember(member);
    setTempPermissions({ ...member.permissions });
  };

  const handleSavePermissions = async () => {
    if (!permissionMember || !tempPermissions) return;
    await updateMemberPermissions(permissionMember.id, tempPermissions);
    setPermissionMember(null);
  };

  // Detailed account calculations for selected member
  const memberSummary = selectedMember 
    ? monthlyCalculations.memberResults[selectedMember.id] 
    : null;

  const memberMeals = selectedMember 
    ? meals.filter(m => m.memberId === selectedMember.id && m.monthId === selectedMonth)
    : [];

  const memberPayments = selectedMember
    ? payments.filter(p => p.memberId === selectedMember.id && p.monthId === selectedMonth)
    : [];

  const memberExpenses = selectedMember
    ? expenses.filter(e => e.paidBy === selectedMember.id && e.monthId === selectedMonth)
    : [];

  return (
    <div className="space-y-5 pb-24 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t.memberList}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {allMembers.length} Registered Members • {formatMonthDisplay(selectedMonth, lang)}
          </p>
        </div>

        {isAdmin && !isMonthClosed && (
          <button
            id="btn-add-member-main"
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addMember}</span>
          </button>
        )}
      </div>

      {/* MEMBER TABLE / CARDS (Requirement 21) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        
        {/* Table Header for medium screens */}
        <div className="hidden sm:grid grid-cols-12 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="col-span-4">Member</div>
          <div className="col-span-2 text-center">Meals</div>
          <div className="col-span-3 text-center">Paid</div>
          <div className="col-span-3 text-right">Balance</div>
        </div>

        {/* Member list items */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {allMembers.map((member) => {
            const summary = monthlyCalculations.memberResults[member.id];
            const isDisabled = member.status === 'disabled';

            return (
              <div
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className={`p-4 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                  isDisabled ? 'opacity-60 bg-slate-50/50 dark:bg-slate-900/50' : ''
                }`}
              >
                <div className="flex flex-col sm:grid sm:grid-cols-12 items-start sm:items-center justify-between gap-2.5">
                  
                  {/* Member Name & Role */}
                  <div className="sm:col-span-4 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-xs shrink-0 ${
                      member.role === 'admin' ? 'bg-emerald-600' : 'bg-indigo-600'
                    }`}>
                      {member.name.charAt(0)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {member.name}
                        </span>
                        {member.role === 'admin' && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                            Admin
                          </span>
                        )}
                        {isDisabled && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            Disabled
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">
                        {member.studentId ? `${member.studentId} • ` : ''}{member.phone || member.email}
                      </p>
                    </div>
                  </div>

                  {/* Meals (Mobile + Desktop) */}
                  <div className="sm:col-span-2 flex sm:justify-center items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <span className="sm:hidden font-semibold text-slate-400">Meals:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {summary?.totalMeals ?? 0}
                    </span>
                  </div>

                  {/* Paid */}
                  <div className="sm:col-span-3 flex sm:justify-center items-center gap-1.5 text-xs">
                    <span className="sm:hidden font-semibold text-slate-400">Paid:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {currentMess.currency}{(summary?.paid ?? 0).toLocaleString()}
                    </span>
                  </div>

                  {/* Balance & Actions */}
                  <div className="sm:col-span-3 flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      summary?.isAdvance
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                    }`}>
                      {summary?.balanceFormatted}
                    </span>

                    {/* Admin Permission quick button */}
                    {isAdmin && (
                      <button
                        onClick={(e) => openPermissionsModal(member, e)}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Permissions"
                      >
                        <Sliders className="w-4 h-4" />
                      </button>
                    )}

                    <ChevronRight className="w-4 h-4 text-slate-400 hidden sm:block" />
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MEMBER ACCOUNT MODAL (Requirement 22) */}
      <Modal
        isOpen={Boolean(selectedMember)}
        onClose={() => setSelectedMember(null)}
        title={selectedMember?.name || 'Member Account'}
        maxWidth="max-w-xl"
      >
        {selectedMember && memberSummary && (
          <div className="space-y-5 text-xs">
            
            {/* Header info */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">
                  {selectedMember.name} ({selectedMember.role})
                </p>
                <p className="text-slate-400">
                  {selectedMember.phone} • {selectedMember.email}
                </p>
                {selectedMember.studentId && (
                  <p className="text-slate-400">ID: {selectedMember.studentId}</p>
                )}
              </div>

              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full font-bold text-xs ${
                  memberSummary.isAdvance
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                }`}>
                  {memberSummary.balanceFormatted}
                </span>
              </div>
            </div>

            {/* Monthly Account Breakdown (Requirement 22) */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex justify-between font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-100 dark:border-slate-800">
                <span>{formatMonthDisplay(selectedMonth, lang)} Breakdown</span>
                <span>Amount</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600 dark:text-slate-400">Total Meals</span>
                <span className="font-bold text-slate-900 dark:text-white">{memberSummary.totalMeals} meals</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600 dark:text-slate-400">Meal Cost (@ {currentMess.currency}{monthlyCalculations.mealRate})</span>
                <span className="font-bold text-slate-900 dark:text-white">{currentMess.currency}{memberSummary.mealCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600 dark:text-slate-400">Other Cost / Shared Bills</span>
                <span className="font-bold text-slate-900 dark:text-white">{currentMess.currency}{memberSummary.otherCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-t border-slate-100 dark:border-slate-800 font-bold">
                <span className="text-slate-900 dark:text-white">Total Bill</span>
                <span className="text-slate-900 dark:text-white">{currentMess.currency}{memberSummary.totalBill.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 text-emerald-600 dark:text-emerald-400 font-bold">
                <span>Paid / Deposited</span>
                <span>+{currentMess.currency}{memberSummary.paid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5 pt-2 border-t border-slate-200 dark:border-slate-700 text-sm font-black">
                <span>Final Balance</span>
                <span className={memberSummary.isAdvance ? 'text-emerald-600' : 'text-amber-600'}>
                  {memberSummary.balanceFormatted}
                </span>
              </div>
            </div>

            {/* Payments History for member */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                Payments in {selectedMonth} ({memberPayments.length})
              </h4>
              {memberPayments.length === 0 ? (
                <p className="text-slate-400 py-2">No payments recorded this month.</p>
              ) : (
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {memberPayments.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{p.paymentMethod}</span>
                        <span className="text-slate-400 ml-2">{p.date}</span>
                        {p.transactionId && <span className="text-slate-400 ml-1">({p.transactionId})</span>}
                      </div>
                      <span className="font-bold text-emerald-600">+{currentMess.currency}{p.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Expenses added by member */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <ReceiptText className="w-4 h-4 text-amber-500" />
                Bazar &amp; Expenses logged by {selectedMember.name} ({memberExpenses.length})
              </h4>
              {memberExpenses.length === 0 ? (
                <p className="text-slate-400 py-2">No expenses logged by this member.</p>
              ) : (
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {memberExpenses.map(e => (
                    <div key={e.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{e.category}</span>
                        <span className="text-slate-400 ml-2">{e.description}</span>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">{currentMess.currency}{e.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Admin actions on member */}
            {isAdmin && selectedMember.id !== currentUser.id && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    toggleMemberStatus(selectedMember.id);
                    setSelectedMember(null);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  {selectedMember.status === 'active' ? 'Disable Member' : 'Activate Member'}
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Remove member ${selectedMember.name} from mess?`)) {
                      removeMember(selectedMember.id);
                      setSelectedMember(null);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 font-semibold hover:bg-rose-100 cursor-pointer"
                >
                  Remove Member
                </button>
              </div>
            )}

          </div>
        )}
      </Modal>

      {/* PERMISSIONS MODAL (Requirement 3) */}
      <Modal
        isOpen={Boolean(permissionMember && tempPermissions)}
        onClose={() => setPermissionMember(null)}
        title={`Permissions: ${permissionMember?.name}`}
      >
        {tempPermissions && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-500">
              Configure member permissions. Admin has full access.
            </p>

            <div className="space-y-2">
              {(Object.keys(tempPermissions) as Array<keyof MemberPermissions>).map((key) => {
                const labels: Record<keyof MemberPermissions, string> = {
                  addOwnMeal: t.permAddOwnMeal,
                  editOwnMeal: t.permEditOwnMeal,
                  addExpense: t.permAddExpense,
                  viewExpenses: t.permViewExpenses,
                  addPayment: t.permAddPayment,
                  viewPayments: t.permViewPayments,
                  viewMonthlyReport: t.permViewMonthlyReport,
                };

                const isChecked = tempPermissions[key];

                return (
                  <label
                    key={key}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {labels[key]}
                    </span>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        setTempPermissions({
                          ...tempPermissions,
                          [key]: e.target.checked,
                        });
                      }}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                  </label>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setPermissionMember(null)}
                className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-xl"
              >
                {t.cancel}
              </button>
              <button
                id="btn-save-member-permissions"
                type="button"
                onClick={handleSavePermissions}
                className="px-5 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs cursor-pointer"
              >
                {t.save}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ADD MEMBER MODAL */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title={t.addMember}
      >
        <form onSubmit={handleCreateMember} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Member Full Name *
            </label>
            <input
              id="input-member-name"
              type="text"
              required
              placeholder="e.g. Tanvir Ahmed"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              {t.phone}
            </label>
            <input
              id="input-member-phone"
              type="tel"
              placeholder="e.g. 01711223344"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              {t.email}
            </label>
            <input
              id="input-member-email"
              type="email"
              placeholder="e.g. student@hostel.edu"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              {t.studentId} (Optional)
            </label>
            <input
              id="input-member-studentid"
              type="text"
              placeholder="e.g. CSE-2023-45"
              value={formStudentId}
              onChange={(e) => setFormStudentId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormRole('member')}
                className={`py-2 rounded-xl font-bold transition-all cursor-pointer ${
                  formRole === 'member'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Member
              </button>
              <button
                type="button"
                onClick={() => setFormRole('admin')}
                className={`py-2 rounded-xl font-bold transition-all cursor-pointer ${
                  formRole === 'admin'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Admin / Manager
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-xl"
            >
              {t.cancel}
            </button>
            <button
              id="btn-submit-add-member"
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
