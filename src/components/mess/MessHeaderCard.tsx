import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Users, 
  Copy, 
  Check, 
  Share2, 
  KeyRound, 
  WifiOff, 
  Lock, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { formatMonthDisplay } from '../../lib/accounting';

interface MessHeaderCardProps {
  className?: string;
}

export const MessHeaderCard: React.FC<MessHeaderCardProps> = ({ className = '' }) => {
  const { 
    currentMess, 
    allMembers, 
    isMonthClosed, 
    selectedMonth, 
    lang, 
    isOnline, 
    setIsJoinCreateMessOpen 
  } = useApp();

  const [copied, setCopied] = useState(false);

  const inviteCode = currentMess.inviteCode;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareInvite = async () => {
    const shareText = `Join our hostel mess "${currentMess.name}" on Hostel Mess Manager! Use Invite Code: #${inviteCode}`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: currentMess.name,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // user cancelled or share failed, fallback to whatsapp
      }
    }

    // WhatsApp fallback
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section 
      id="mess-header-section"
      aria-label="Mess details and invitation"
      className={`bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs mb-5 space-y-3.5 transition-colors ${className}`}
    >
      {/* Top Part: Mess Info, Badges & Switch Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Mess Avatar & Name */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-xs shrink-0">
            <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg tracking-tight truncate">
                {currentMess.name}
              </h1>

              {isMonthClosed ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300">
                  <Lock className="w-3 h-3" />
                  Closed
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
                  <CheckCircle2 className="w-3 h-3" />
                  Active Month
                </span>
              )}
            </div>

            {/* Subtitle meta */}
            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
              <span className="inline-flex items-center gap-1 font-medium">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                {allMembers.length} {lang === 'bn' ? 'সদস্য' : 'Members'}
              </span>

              <span className="text-slate-300 dark:text-slate-700">•</span>

              <span className="font-medium text-slate-600 dark:text-slate-300">
                {formatMonthDisplay(selectedMonth, lang)}
              </span>

              <span className="text-slate-300 dark:text-slate-700">•</span>

              <span className="inline-flex items-center gap-1">
                {isOnline ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400">Synced</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 text-amber-500" />
                    <span className="text-[11px] text-amber-600 dark:text-amber-400">Offline</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Switch / Join Mess button */}
        <div className="shrink-0 flex sm:self-center">
          <button
            id="btn-switch-mess-header"
            onClick={() => setIsJoinCreateMessOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 sm:py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 transition-colors cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{lang === 'bn' ? 'মেস পরিবর্তন / যুক্ত হন' : 'Switch / Join Mess'}</span>
          </button>
        </div>

      </div>

      {/* Bottom Part: Dedicated Invitation Section */}
      <div className="bg-gradient-to-r from-emerald-50/70 via-teal-50/50 to-emerald-50/70 dark:from-emerald-950/30 dark:via-slate-800/40 dark:to-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/60 rounded-xl sm:rounded-2xl p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
        
        {/* Code info */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-emerald-100/80 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                {lang === 'bn' ? 'মেস আমন্ত্রণ কোড' : 'Mess Invite Code'}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono font-bold text-sm sm:text-base text-emerald-900 dark:text-emerald-100 bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded-lg border border-emerald-200/80 dark:border-emerald-800/80 select-all">
                #{inviteCode}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate hidden xs:inline">
                {lang === 'bn' ? 'মেম্বার যুক্ত করতে কোডটি শেয়ার করুন' : 'Share with roommates to join'}
              </span>
            </div>
          </div>
        </div>

        {/* Copy & Share Action Buttons */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
          <button
            id="btn-copy-mess-invite"
            onClick={handleCopyCode}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 sm:py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              copied 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>{lang === 'bn' ? 'কপি হয়েছে!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>{lang === 'bn' ? 'কোড কপি' : 'Copy Code'}</span>
              </>
            )}
          </button>

          <button
            id="btn-share-mess-invite"
            onClick={handleShareInvite}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 sm:py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'শেয়ার করুন' : 'Share'}</span>
          </button>
        </div>

      </div>

    </section>
  );
};
