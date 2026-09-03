import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { 
  Building2, 
  KeyRound, 
  PlusCircle, 
  MapPin, 
  Phone, 
  DollarSign, 
  Clock, 
  Check, 
  Copy, 
  AlertCircle, 
  CheckCircle2,
  User,
  Hash
} from 'lucide-react';

export const JoinOrCreateMessModal: React.FC = () => {
  const { 
    isJoinCreateMessOpen, 
    setIsJoinCreateMessOpen, 
    currentMess,
    currentUser,
    authUser,
    createMess, 
    joinMessByCode 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'join' | 'create'>('join');

  // Join form state
  const [joinCode, setJoinCode] = useState('');
  const [joinMemberName, setJoinMemberName] = useState(authUser?.displayName || currentUser?.name || '');
  const [joinPhone, setJoinPhone] = useState(currentUser?.phone || '');
  const [joinStudentId, setJoinStudentId] = useState('');

  // Create form state
  const [messName, setMessName] = useState('');
  const [location, setLocation] = useState('');
  const [managerName, setManagerName] = useState(authUser?.displayName || currentUser?.name || 'Manager');
  const [managerPhone, setManagerPhone] = useState('01712345678');
  const [currency, setCurrency] = useState('৳');
  const [lunchCutoff, setLunchCutoff] = useState('09:00');
  const [dinnerCutoff, setDinnerCutoff] = useState('16:00');

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ title: string; code: string; messName: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!joinCode.trim()) {
      setError('Please enter the mess unique code');
      return;
    }
    if (!joinMemberName.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    try {
      const res = await joinMessByCode(joinCode.trim(), joinMemberName.trim(), joinPhone.trim(), joinStudentId.trim());
      if (res.success) {
        setSuccessInfo({
          title: 'Successfully Joined Mess!',
          code: joinCode.trim().toUpperCase(),
          messName: res.messName || currentMess.name
        });
        setTimeout(() => {
          setIsJoinCreateMessOpen(false);
          setSuccessInfo(null);
        }, 1500);
      } else {
        setError(res.error || `Mess with code "${joinCode.trim().toUpperCase()}" was not found. Please verify with your manager.`);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to join mess');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!messName.trim()) {
      setError('Please enter the mess name');
      return;
    }

    setLoading(true);
    try {
      const generatedCode = await createMess(
        messName.trim(),
        managerName.trim() || 'Manager',
        managerPhone.trim() || '',
        authUser?.email || 'manager@hostel.edu',
        currency.trim() || '৳',
        location.trim() || 'Hostel Premises',
        lunchCutoff,
        dinnerCutoff
      );

      setSuccessInfo({
        title: 'Mess Created Successfully!',
        code: generatedCode,
        messName: messName.trim()
      });

      // Auto copy code
      try {
        navigator.clipboard.writeText(generatedCode);
        setCopied(true);
      } catch {}

      setTimeout(() => {
        setIsJoinCreateMessOpen(false);
        setSuccessInfo(null);
      }, 2000);
    } catch (err: any) {
      setError(err?.message || 'Failed to create mess');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isJoinCreateMessOpen}
      onClose={() => setIsJoinCreateMessOpen(false)}
      title="Hostel & Mess Onboarding"
    >
      <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
        
        {/* Success Modal Confirmation */}
        {successInfo ? (
          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {successInfo.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                You are now in <span className="font-bold text-emerald-700 dark:text-emerald-400">{successInfo.messName}</span>
              </p>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block text-left">
                  Mess Unique Code
                </span>
                <span className="font-mono font-black text-base text-emerald-600 dark:text-emerald-400">
                  {successInfo.code}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(successInfo.code)}
                className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 flex items-center gap-1 font-bold text-xs cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Share this code with your fellow room members so they can join!
            </p>
          </div>
        ) : (
          <>
            {/* Tab switchers */}
            <div className="grid grid-cols-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('join');
                  setError(null);
                }}
                className={`py-2.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'join'
                    ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Join Mess</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('create');
                  setError(null);
                }}
                className={`py-2.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'create'
                    ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Mess</span>
              </button>
            </div>

            {/* Error banner */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* TAB 1: JOIN MESS */}
            {activeTab === 'join' && (
              <form onSubmit={handleJoin} className="space-y-3.5">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Have a mess code from your manager? Enter the unique code below to join your hostel mess directly.
                  </p>
                </div>

                <div>
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    Mess Unique Code *
                  </label>
                  <div className="relative">
                    <Hash className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. MAHIM2026 or MESS-9421"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-900 dark:text-white font-mono font-bold tracking-wider uppercase focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    (Try demo code: <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">MAHIM2026</span>)
                  </span>
                </div>

                <div>
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tanvir Ahmed"
                      value={joinMemberName}
                      onChange={(e) => setJoinMemberName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="017xxxxxxxx"
                      value={joinPhone}
                      onChange={(e) => setJoinPhone(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      Room / Student ID
                    </label>
                    <input
                      type="text"
                      placeholder="Room 304"
                      value={joinStudentId}
                      onChange={(e) => setJoinStudentId(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  id="btn-join-mess-confirm"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50 mt-3"
                >
                  <KeyRound className="w-4 h-4" />
                  {loading ? 'Joining Mess...' : 'Join Mess Now'}
                </button>
              </form>
            )}

            {/* TAB 2: CREATE MESS */}
            {activeTab === 'create' && (
              <form onSubmit={handleCreate} className="space-y-3">
                <div>
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    Mess / Hostel Name *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Padma Student Mess"
                      value={messName}
                      onChange={(e) => setMessName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    Location / Address
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="e.g. House 12, Road 4, Mirpur 10, Dhaka"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      Manager Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={managerName}
                      onChange={(e) => setManagerName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      Manager Phone
                    </label>
                    <input
                      type="tel"
                      value={managerPhone}
                      onChange={(e) => setManagerPhone(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      Currency Symbol
                    </label>
                    <input
                      type="text"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      Lunch Cutoff Time
                    </label>
                    <input
                      type="time"
                      value={lunchCutoff}
                      onChange={(e) => setLunchCutoff(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <span className="text-[10px] text-slate-400">Off meal before 9:00 AM</span>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    Dinner Cutoff Time
                  </label>
                  <input
                    type="time"
                    value={dinnerCutoff}
                    onChange={(e) => setDinnerCutoff(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] text-slate-400">Off meal before 4:00 PM</span>
                </div>

                <button
                  type="submit"
                  id="btn-create-mess-confirm"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50 mt-3"
                >
                  <PlusCircle className="w-4 h-4" />
                  {loading ? 'Creating Mess...' : 'Create Mess & Generate Code'}
                </button>
              </form>
            )}
          </>
        )}

      </div>
    </Modal>
  );
};
