import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  KeyRound, 
  PlusCircle, 
  UtensilsCrossed, 
  ShoppingBag, 
  Calculator, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Smartphone, 
  FileText, 
  Sparkles, 
  Globe, 
  LogIn, 
  UserPlus, 
  ChefHat, 
  Check, 
  DollarSign,
  HelpCircle,
  ChevronDown,
  Wallet,
  Receipt,
  TrendingDown,
  TrendingUp,
  Coins
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { 
    lang, 
    setLang, 
    authUser, 
    openCreateMessFlow, 
    openJoinMessFlow, 
    openSignInFlow, 
    openSignUpFlow,
    setViewMode,
    currentMess 
  } = useApp();

  const isBn = lang === 'bn';

  // If user is already logged in and has created or joined a mess, directly go to dashboard without showing homepage
  useEffect(() => {
    const hasMess = localStorage.getItem('mess_user_has_mess') === 'true';
    if (authUser && hasMess) {
      setViewMode('app');
    }
  }, [authUser, setViewMode]);

  // Interactive Live Rate Calculator state for the demo teaser
  const [demoBazar, setDemoBazar] = useState<number>(12500);
  const [demoMeals, setDemoMeals] = useState<number>(250);
  const demoRate = demoMeals > 0 ? (demoBazar / demoMeals).toFixed(2) : '0.00';

  // Interactive 1st-Week ৳1,000 Bazar Fund & Live Cash Float Demo
  const [bazarDemoMembers, setBazarDemoMembers] = useState<number>(10);
  const [bazarDemoCashTaken, setBazarDemoCashTaken] = useState<number>(3000);
  const [bazarDemoActualSpent, setBazarDemoActualSpent] = useState<number>(2750);
  
  const bazarDemoTotalFund = bazarDemoMembers * 1000;
  const bazarDemoReturned = Math.max(0, bazarDemoCashTaken - bazarDemoActualSpent);
  const bazarDemoCashLeft = bazarDemoTotalFund - bazarDemoCashTaken + bazarDemoReturned;

  // Interactive sample meal toggles
  const [sampleBreakfast, setSampleBreakfast] = useState<boolean>(true);
  const [sampleLunch, setSampleLunch] = useState<boolean>(true);
  const [sampleDinner, setSampleDinner] = useState<boolean>(true);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white transition-colors duration-150">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-sm shadow-emerald-600/25 shrink-0 ring-1 ring-emerald-400/30">
              <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base sm:text-xl tracking-tight text-slate-900 dark:text-white">
                  Mess<span className="text-emerald-600 dark:text-emerald-400">Bari</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wider font-mono shrink-0">
                  {isBn ? 'মেসবাড়ি' : 'PLATFORM'}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block truncate font-medium">
                {isBn ? 'হোস্টেল ও ব্যাচেলর মেস অপারেটিং সিস্টেম' : 'Hostel & Bachelor Mess Operating System'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#bazar-fund" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-bold text-emerald-700 dark:text-emerald-400">
              {isBn ? '১০০০ টাকা বাজার ফান্ড' : '৳1,000 Bazar Fund'}
            </a>
            <a href="#features" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              {isBn ? 'ফিচারসমূহ' : 'Features'}
            </a>
            <a href="#how-it-works" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              {isBn ? 'কিভাবে কাজ করে' : 'How It Works'}
            </a>
            <a href="#calculator" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              {isBn ? 'হিসাব ক্যালকুলেটর' : 'Transparent Math'}
            </a>
            <a href="#faq" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              {isBn ? 'প্রশ্নোত্তর' : 'FAQ'}
            </a>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Language Switch */}
            <button
              id="btn-home-lang-switch"
              onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
              className="flex items-center gap-1 px-2 py-1.5 sm:px-2.5 sm:py-1.5 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer min-h-[36px]"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-mono text-[11px]">{lang === 'en' ? 'বাংলা' : 'EN'}</span>
            </button>

            {/* If user is already authenticated */}
            {authUser ? (
              <button
                id="btn-go-to-dashboard"
                onClick={() => setViewMode('app')}
                className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm shadow-emerald-600/20 transition-all cursor-pointer active:scale-95 whitespace-nowrap min-h-[36px]"
              >
                <span>{isBn ? 'ড্যাশবোর্ড' : 'Dashboard'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="flex items-center gap-1 sm:gap-1.5">
                <button
                  id="btn-home-signin"
                  onClick={openSignInFlow}
                  className="px-2 sm:px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl transition-colors cursor-pointer whitespace-nowrap min-h-[36px]"
                >
                  {isBn ? 'লগইন' : 'Sign In'}
                </button>
                <button
                  id="btn-home-signup"
                  onClick={openSignUpFlow}
                  className="flex items-center gap-1 px-2.5 sm:px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm shadow-emerald-600/20 transition-all cursor-pointer active:scale-95 whitespace-nowrap min-h-[36px]"
                >
                  <UserPlus className="w-3.5 h-3.5 shrink-0" />
                  <span>{isBn ? 'শুরু করুন' : 'Get Started'}</span>
                </button>
              </div>
            )}

          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-14 sm:pb-20 border-b border-slate-200 dark:border-slate-800 bg-linear-to-b from-emerald-50/40 via-transparent to-transparent dark:from-emerald-950/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{isBn ? 'হোস্টেল ও ব্যাচেলর মেস পরিচালনার পূর্ণাঙ্গ সমাধান' : 'Complete Hostel & Bachelor Mess Management Solution'}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight sm:leading-none max-w-4xl mx-auto">
            {isBn ? (
              <>
                মেসের খাবার, বাজার ও ব্যালেন্স হিসাব — <span className="text-emerald-600 dark:text-emerald-400">১০০% স্বচ্ছ ও নিখুঁত</span>
              </>
            ) : (
              <>
                Run Your Mess With <span className="text-emerald-600 dark:text-emerald-400">Zero Calculation Stress</span> and 100% Transparency
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {isBn
              ? 'নির্দিষ্ট সময়ের আগে মিল অন/অফ, রোস্টার অনুযায়ী বাজার দায়িত্ব, লাইভ মিল রেট ক্যালকুলেশন এবং সবার ব্যক্তিগত জমার হিসাব — আর কোনো খাতাপত্র বা ঝামেলার দরকার নেই।'
              : 'Effortlessly track daily meals before cutoff times, schedule turn-by-turn bazar duties, auto-compute live meal rates, and settle member deposits in seconds.'}
          </p>

          {/* Main Action Cards: Create Mess OR Join Mess */}
          <div className="mt-10 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            
            {/* Action 1: Create a Mess */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-500/80 dark:border-emerald-500/70 shadow-lg shadow-emerald-500/5 flex flex-col justify-between relative group hover:border-emerald-600 transition-all">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{isBn ? 'নতুন মেস তৈরি করুন' : 'Create a Mess'}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {isBn ? 'ম্যানেজার' : 'Manager'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                    {isBn
                      ? 'নতুন মেসের নাম, মিল কাট-অফ টাইম ও বাজার ক্যাটাগরি সেট করুন। মেসের কোড দিয়ে মেম্বারদের আমন্ত্রণ জানান।'
                      : 'Set up your mess name, daily meal cutoff hours, and invite roommates with an automatic 6-digit mess code.'}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                <button
                  id="btn-hero-create-mess"
                  type="button"
                  onClick={openCreateMessFlow}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isBn ? 'মেস তৈরি করুন' : 'Create a Mess'}</span>
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </button>
                <p className="text-[10px] text-slate-400 text-center">
                  {isBn ? 'প্রথমে একটি একাউন্ট তৈরি করতে হবে' : 'Requires quick account creation first'}
                </p>
              </div>
            </div>

            {/* Action 2: Join a Mess */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between relative group hover:border-slate-300 dark:hover:border-slate-700 transition-all">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{isBn ? 'মেসে যোগ দিন' : 'Join a Mess'}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {isBn ? 'বর্ডার / মেম্বার' : 'Member'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                    {isBn
                      ? 'ম্যানেজারের কাছ থেকে পাওয়া ৬ ডিজিটের ইনভাইট কোড দিয়ে যুক্ত হন। প্রতিদিনের মিল, বাজার ও ব্যালেন্স দেখুন।'
                      : 'Have a 6-digit mess code from your manager? Enter to join your room, toggle meals, and track your dues.'}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                <button
                  id="btn-hero-join-mess"
                  type="button"
                  onClick={openJoinMessFlow}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{isBn ? 'কোড দিয়ে জয়েন করুন' : 'Join with Mess Code'}</span>
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </button>
                <p className="text-[10px] text-slate-400 text-center">
                  {isBn ? 'প্রথমে একটি একাউন্ট তৈরি করতে হবে' : 'Requires quick account creation first'}
                </p>
              </div>
            </div>

          </div>

          {/* Already have an account row */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <span>{isBn ? 'ইতিমধ্যে একাউন্ট আছে?' : 'Already have an account?'}</span>
            <button
              id="btn-hero-login-link"
              type="button"
              onClick={openSignInFlow}
              className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              {isBn ? 'সাইন ইন করুন →' : 'Sign in to your account →'}
            </button>
          </div>

          {/* Trust points */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{isBn ? '১০০% ফ্রি ও আনলিমিটেড মেম্বার' : 'Free with Unlimited Members'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{isBn ? 'মোবাইল ফ্রেন্ডলি (বাংলা ও ইংলিশ)' : 'Mobile-First with Bangla & English'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{isBn ? 'নিরাপদ ক্লাউড ডাটাবেজ' : 'Secure Cloud Backup (Firebase)'}</span>
            </div>
          </div>

        </div>
      </section>

      {/* 1st-Week ৳1,000 Bazar Fund & Remaining Cash Float Showcase */}
      <section id="bazar-fund" className="py-14 sm:py-20 border-b border-slate-200 dark:border-slate-800 bg-linear-to-b from-white via-emerald-50/20 to-white dark:from-slate-900 dark:via-emerald-950/10 dark:to-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-3 shadow-xs">
              <Wallet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{isBn ? 'বাজার ফান্ড স্পেশাল ফিচার • ১ম সপ্তাহের নিয়ম' : 'Bazar Fund Feature • 1st Week Rule'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              {isBn ? (
                <>
                  ১ম সপ্তাহে <span className="text-emerald-600 dark:text-emerald-400">১,০০০ টাকা বাজার ফান্ড</span> ও লাইভ ক্যাশ হিসাব
                </>
              ) : (
                <>
                  1st-Week <span className="text-emerald-600 dark:text-emerald-400">৳1,000 Bazar Starter Pool</span> & Live Cash in Hand
                </>
              )}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
              {isBn
                ? 'মাসের প্রথম সপ্তাহে প্রত্যেকে ১,০০০ টাকা করে ফান্ডে দেয়। সেখান থেকে কেউ ৩,০০০ টাকা বাজারে নিলে কত টাকা খরচ হলো এবং মেসের বাক্সে কত টাকা ক্যাশ অবশিষ্ট রইল — তা সব মেম্বার তাদের মোবাইলে লাইভ দেখতে পান।'
                : 'Everyone contributes ৳1,000 starter deposit during week 1. When a shopper takes ৳3,000 for bazar, every single roommate instantly sees how much is spent and how much cash remains in hand!'}
            </p>
          </div>

          {/* Interactive Bazar Simulator */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md p-5 sm:p-8 space-y-6">
            
            {/* Top Stat highlight banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
                  <span>{isBn ? '১ম সপ্তাহের মোট তহবিল' : '1st Week Total Pool'}</span>
                  <Coins className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
                  ৳{bazarDemoTotalFund.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {bazarDemoMembers} {isBn ? 'জন × ১,০০০ টাকা' : 'members × ৳1,000'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
                  <span>{isBn ? 'বাজারে নেওয়া হয়েছে' : 'Taken for Bazar'}</span>
                  <TrendingDown className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
                  ৳{bazarDemoCashTaken.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {isBn ? `প্রকৃত খরচ ৳${bazarDemoActualSpent.toLocaleString()} (ফেরত ৳${bazarDemoReturned.toLocaleString()})` : `Spent ৳${bazarDemoActualSpent.toLocaleString()} (Refund ৳${bazarDemoReturned})`}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500 dark:bg-emerald-600 text-white shadow-sm">
                <div className="flex items-center justify-between text-xs text-emerald-100 font-medium mb-1">
                  <span>{isBn ? 'তহবিলে অবশিষ্ট ক্যাশ' : 'Remaining Cash in Hand'}</span>
                  <Wallet className="w-4 h-4 text-white" />
                </div>
                <div className="text-xl sm:text-2xl font-black font-mono">
                  ৳{bazarDemoCashLeft.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-100 mt-0.5 flex items-center gap-1 font-medium">
                  <Check className="w-3 h-3" />
                  <span>{isBn ? 'সবাই লাইভ দেখছে' : 'All members see live'}</span>
                </div>
              </div>

            </div>

            {/* Interactive Simulation Controls */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Adjust Inputs */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {isBn ? 'হিসাব পরীক্ষা করুন (সিমুলেটর)' : 'Try With Your Numbers (Interactive)'}
                </h4>

                {/* Control 1: Member Count */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>{isBn ? 'মেসের মেম্বার সংখ্যা:' : 'Mess Boarders Count:'}</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">{bazarDemoMembers} {isBn ? 'জন' : 'members'}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[6, 8, 10, 12, 15].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setBazarDemoMembers(count)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          bazarDemoMembers === count
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {count} {isBn ? 'জন' : 'persons'}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {isBn ? 'প্রত্যেকে ১ম সপ্তাহে ১,০০০ টাকা দিলে মোট তহবিল হবে ৳' + (bazarDemoMembers * 1000).toLocaleString() : `Each giving ৳1,000 creates ৳${(bazarDemoMembers * 1000).toLocaleString()} starter fund`}
                  </p>
                </div>

                {/* Control 2: Bazar Cash Taken */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>{isBn ? 'বাজারের জন্য মেম্বার নিয়েছে:' : 'Cash Given for Bazar Duty:'}</span>
                    <span className="font-mono text-amber-600 dark:text-amber-400">৳{bazarDemoCashTaken.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[2000, 3000, 4000, 5000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setBazarDemoCashTaken(amt);
                          if (bazarDemoActualSpent > amt) {
                            setBazarDemoActualSpent(amt);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          bazarDemoCashTaken === amt
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        ৳{amt.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Control 3: Actual Bazar Cost */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>{isBn ? 'বাজারে মোট খরচ হয়েছে:' : 'Actual Amount Spent at Market:'}</span>
                    <span className="font-mono text-slate-900 dark:text-white">৳{bazarDemoActualSpent.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={1000}
                    max={bazarDemoCashTaken}
                    step={50}
                    value={bazarDemoActualSpent}
                    onChange={(e) => setBazarDemoActualSpent(Number(e.target.value))}
                    className="w-full accent-emerald-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>৳1,000</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {isBn ? `বাক্স ফেরত: ৳${bazarDemoReturned.toLocaleString()}` : `Refund to Box: ৳${bazarDemoReturned}`}
                    </span>
                    <span>৳{bazarDemoCashTaken.toLocaleString()}</span>
                  </div>
                </div>

              </div>

              {/* Right Column: Visual Member Feed */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span>{isBn ? 'মেম্বারদের মোবাইল ভিউ (লাইভ)' : 'Members Live View'}</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                    {isBn ? '১০০% স্বচ্ছ' : '100% Transparent'}
                  </span>
                </div>

                {/* Sample Member Status cards */}
                <div className="space-y-2 text-xs">
                  
                  {/* Shopper Card */}
                  <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 dark:text-white">তানভীর আহমেদ</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200 font-bold">
                          {isBn ? 'আজকের বাজার' : 'Today Shopper'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {isBn ? `নেওয়া: ৳${bazarDemoCashTaken.toLocaleString()} • খরচ: ৳${bazarDemoActualSpent.toLocaleString()} • ফেরত: ৳${bazarDemoReturned.toLocaleString()}` : `Took ৳${bazarDemoCashTaken} • Spent ৳${bazarDemoActualSpent} • Return ৳${bazarDemoReturned}`}
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300">
                      {isBn ? 'হিসাব সম্পন্ন' : 'Settled'}
                    </span>
                  </div>

                  {/* Other members */}
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold flex items-center justify-center">
                        M
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">মাহিম ইসলাম</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                      ✓ {isBn ? '১ম সপ্তাহ ১,০০০ জমা' : '1st Week ৳1,000 Paid'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold flex items-center justify-center">
                        R
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">রাকিব হোসেন</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                      ✓ {isBn ? '১ম সপ্তাহ ১,০০০ জমা' : '1st Week ৳1,000 Paid'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 text-[10px] font-bold flex items-center justify-center">
                        S
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">সাব্বির রহমান</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      {isBn ? 'বাকি আছে' : 'Pending'}
                    </span>
                  </div>

                </div>

                {/* Micro note */}
                <p className="text-[10px] text-slate-500 dark:text-slate-400 pt-1 leading-relaxed">
                  💡 {isBn ? 'কারো হিসাব নিয়ে কোনো সন্দেহ বা ভুল বোঝাবুঝি থাকে না — লাইভ ব্যালেন্স সবসময় সবার চোখের সামনে থাকে।' : 'Eliminates all roommate disputes over bazaar cash leftovers. Real-time cash transparency.'}
                </p>

              </div>

            </div>

            {/* Bottom Action for Bazar Fund */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl">
              <div className="text-center sm:text-left">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {isBn ? 'আপনার মেসেও এই স্বচ্ছ হিসাব চালু করতে চান?' : 'Want this automated cash tracking in your hostel?'}
                </span>
                <p className="text-[11px] text-slate-500">
                  {isBn ? 'প্রথমে একাউন্ট তৈরি করে ম্যানেজার হিসেবে মেস তৈরি করুন বা কোড দিয়ে যোগ দিন।' : 'Sign up in seconds to start tracking 1st-week deposits and bazaar cash handovers.'}
                </p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={openCreateMessFlow}
                  className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all cursor-pointer text-center"
                >
                  {isBn ? 'মেস খুলুন' : 'Create Mess'}
                </button>
                <button
                  type="button"
                  onClick={openJoinMessFlow}
                  className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer text-center"
                >
                  {isBn ? 'কোড দিয়ে জয়েন' : 'Join Mess'}
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Interactive Transparent Math Teaser */}
      <section id="calculator" className="py-14 sm:py-20 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-2">
              <Calculator className="w-3.5 h-3.5" />
              <span>{isBn ? 'লাইভ হিসাব সিস্টেম' : 'Dynamic Accounting Engine'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {isBn ? 'স্বচ্ছ হিসাব: মিল রেট কিভাবে বের হয়?' : 'How Meal Rate is Automatically Calculated'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              {isBn
                ? 'মোট বাজার খরচকে মোট খাওয়া মিল সংখ্যা দিয়ে ভাগ করলেই তৈরি হয় নিখুঁত মিল রেট।'
                : 'Zero arguments or manual calculator mistakes. Meal rate dynamically recalculates every time bazaar cost is logged.'}
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            
            {/* Formula Banner */}
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 tracking-wider">
                  {isBn ? 'মূল হিসাবের সূত্র' : 'The Core Formula'}
                </span>
                <p className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {isBn ? 'মিল রেট = মোট খাদ্য/বাজার খরচ ÷ মোট মিল সংখ্যা' : 'Meal Rate = Total Food Expense ÷ Total Meals Eaten'}
                </p>
              </div>
              <div className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-mono font-black text-xl shadow-xs">
                ৳{demoRate} / {isBn ? 'মিল' : 'meal'}
              </div>
            </div>

            {/* Interactive Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              
              {/* Slider 1: Total Bazar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-emerald-600" />
                    {isBn ? 'মোট বাজার খরচ' : 'Total Bazar Expense'}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">৳{demoBazar.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={2000}
                  max={40000}
                  step={500}
                  value={demoBazar}
                  onChange={(e) => setDemoBazar(Number(e.target.value))}
                  className="w-full accent-emerald-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>৳2,000</span>
                  <span>৳20,000</span>
                  <span>৳40,000</span>
                </div>
              </div>

              {/* Slider 2: Total Meals */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <UtensilsCrossed className="w-4 h-4 text-emerald-600" />
                    {isBn ? 'মোট খাওয়া মিল' : 'Total Meals Eaten'}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">{demoMeals} {isBn ? 'টি মিল' : 'meals'}</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={800}
                  step={10}
                  value={demoMeals}
                  onChange={(e) => setDemoMeals(Number(e.target.value))}
                  className="w-full accent-emerald-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>50 meals</span>
                  <span>400 meals</span>
                  <span>800 meals</span>
                </div>
              </div>

            </div>

            {/* Sample Member Breakdown */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                {isBn ? 'উদাহরণ: একজন মেম্বারের ব্যক্তিগত হিসাব' : 'Example: Single Member Personal Statement'}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-1">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">{isBn ? 'খাওয়া মিল' : 'Meals Eaten'}</span>
                  <span className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">45 {isBn ? 'টি' : 'meals'}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">{isBn ? 'মিল খরচ' : 'Meal Cost'}</span>
                  <span className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">৳{(45 * Number(demoRate)).toFixed(0)}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">{isBn ? 'জমা দিয়েছেন' : 'Deposited'}</span>
                  <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">৳3,000</span>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block">{isBn ? 'অবশিষ্ট ব্যালেন্স' : 'Net Balance'}</span>
                  <span className="font-mono font-black text-xs text-emerald-700 dark:text-emerald-300">
                    +৳{(3000 - (45 * Number(demoRate))).toFixed(0)} {isBn ? '(জমা)' : '(Advance)'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-14 sm:py-20 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              {isBn ? 'সবকিছু এক প্ল্যাটফর্মে' : 'All-In-One Platform'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              {isBn ? (
                <>
                  যেসব কারণে মেসে <span className="text-emerald-600 dark:text-emerald-400">MessBari</span> সেরা পছন্দ
                </>
              ) : (
                <>
                  Why Hostels & Messes Run on <span className="text-emerald-600 dark:text-emerald-400">MessBari</span>
                </>
              )}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* Feature 1 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {isBn ? '১-ক্লিক মিল অন/অফ ও শেফ শিট' : '1-Tap Daily Meals & Cook Sheet'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isBn
                  ? 'সকাল, দুপুর ও রাতের মিল এক ট্যাপে অন বা অফ করুন। বাবুর্চির জন্য দৈনিক মোট প্লেট সংখ্যা সরাসরি হোয়াটসঅ্যাপে শেয়ার করার ব্যবস্থা।'
                  : 'Toggle breakfast, lunch, and dinner instantly. Automated daily plate count sheet generated for your cook with WhatsApp export.'}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {isBn ? 'বাজারের ডিউটি রোস্টার ও কুইক এন্ট্রি' : 'Bazaar Duty Roster & Quick Log'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isBn
                  ? 'কাদের আজ বাজারে যাওয়ার পালা তা ক্যালেন্ডারে রোস্টার করা থাকে। বাজার থেকে ফেরার সাথে সাথেই মোবাইল থেকে এক ক্লিকে খরচের হিসাব এন্ট্রি।'
                  : 'Auto-rotating market shopping duty assignments. Floating quick-add button logs items and cost right from the market in seconds.'}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {isBn ? 'অটোমেটিক কাট-অফ টাইমার' : 'Strict Cutoff Time Locks'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isBn
                  ? 'দুপুরের মিল সকাল ৯টা এবং রাতের মিল বিকেল ৪টায় স্বয়ংক্রিয়ভাবে লক হয়ে যায়। রান্নার পরে আর কেউ হঠাৎ মিল বন্ধ করতে পারবে না।'
                  : 'Lock meal changes after breakfast, lunch (9 AM), or dinner (4 PM) cutoffs. Prevents food waste and last-minute cancellations.'}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {isBn ? 'ব্যক্তিগত মেম্বার অ্যাকাউন্ট স্টেটমেন্ট' : 'Transparent Member Ledgers'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isBn
                  ? 'প্রত্যেক মেম্বার তার নিজের প্রোফাইলে মোট খাওয়া মিল, জমা দেওয়া টাকা ও অবশিষ্ট ব্যালেন্স লাইভ দেখতে পায়।'
                  : 'Every boarder accesses a personal monthly ledger showing exact meals eaten, deposits paid, guest meals, and remaining advance or due.'}
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {isBn ? 'মাসিক ক্লোজিং ও প্রিন্টযোগ্য রিপোর্ট' : 'Month Close & Exportable Reports'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isBn
                  ? 'মাস শেষে ম্যানেজার ১-ক্লিকে হিসাব ক্লোজ করতে পারেন। পূর্ণাঙ্গ মেস বিবরণী প্রিন্ট অথবা পিডিএফ সেভ করার চমৎকার সুবিধা।'
                  : 'Managers officially close the month to freeze accounts. Full printable and exportable summary tables with audit history.'}
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {isBn ? 'মোবাইল ফ্রেন্ডলি ও দ্বিভাষিক' : 'Mobile First & Bilingual'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isBn
                  ? 'যেকোনো মোবাইল বা ট্যাবলেটে অত্যন্ত দ্রুত কাজ করে। বাংলা ও ইংরেজি উভয় ভাষায় স্বাচ্ছন্দ্যে ব্যবহারযোগ্য।'
                  : 'Engineered specifically for smartphone browsers with light/dark modes and seamless Bengali (বাংলা) and English support.'}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-14 sm:py-20 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              {isBn ? 'সহজ ৩টি ধাপ' : 'Simple 3-Step Process'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              {isBn ? 'কিভাবে মেস শুরু করবেন?' : 'How to Get Started in 60 Seconds'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left space-y-3 relative">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center">
                1
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">
                {isBn ? 'একাউন্ট তৈরি করুন' : '1. Create Your Account'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isBn
                  ? 'গুগল দিয়ে ১-ক্লিকে অথবা আপনার নাম ও পাসওয়ার্ড দিয়ে মেসের ফ্রি একাউন্ট তৈরি করুন।'
                  : 'Sign up in 10 seconds via Google 1-tap or your name, email, and password.'}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left space-y-3 relative">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center">
                2
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">
                {isBn ? 'মেস তৈরি বা জয়েন করুন' : '2. Create or Join a Mess'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isBn
                  ? 'ম্যানেজার হিসেবে নতুন মেস খুলুন অথবা ম্যানেজারের দেওয়া ৬ সংখ্যার কোড দিয়ে জয়েন করুন।'
                  : 'Create a new mess as manager and get your code, or enter your manager’s invite code to join.'}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left space-y-3 relative">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center">
                3
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">
                {isBn ? 'মিল ও বাজারের হিসাব রাখুন' : '3. Track Meals & Relax'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isBn
                  ? 'প্রতিদিন মিল অন/অফ করুন, বাজার খরচ যুক্ত করুন আর লাইভ মিল রেটে ঝামেলামুক্ত মেস জীবন উপভোগ করুন।'
                  : 'Toggle meals, log daily bazaar costs, and let the system calculate fair live meal rates automatically.'}
              </p>
            </div>

          </div>

          {/* Dual Action CTA banner */}
          <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-emerald-600 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg shadow-emerald-600/20">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold">
                {isBn ? 'আজই মেসের হিসাব সহজ করুন!' : 'Ready to Take Control of Your Mess?'}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-md">
                {isBn
                  ? 'কোনো ক্রেডিট কার্ডের প্রয়োজন নেই। এখনই একাউন্ট খুলে আপনার মেস পরিচালনা শুরু করুন।'
                  : '100% free and easy to set up. Start your mess or join your roommates right now.'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={openCreateMessFlow}
                className="py-3 px-5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer text-center"
              >
                {isBn ? 'মেস তৈরি করুন' : 'Create a Mess'}
              </button>
              <button
                type="button"
                onClick={openJoinMessFlow}
                className="py-3 px-5 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-white border border-emerald-400/40 font-bold text-xs sm:text-sm transition-all cursor-pointer text-center"
              >
                {isBn ? 'মেসে যোগ দিন' : 'Join a Mess'}
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-14 sm:py-20 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              {isBn ? 'সাধারণ প্রশ্নোত্তর' : 'Frequently Asked Questions'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              {isBn ? 'আপনার প্রশ্নের উত্তর' : 'Common Questions'}
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: isBn ? 'মেস তৈরি করতে বা জয়েন করতে কি একাউন্ট তৈরি করা জরুরি?' : 'Do I need to create an account before creating or joining a mess?',
                a: isBn
                  ? 'হ্যাঁ, আপনার ব্যক্তিগত মিল, ডিপোজিট ব্যালেন্স ও মেস ডাটা সুরক্ষিত রাখার জন্য প্রথমে একটি একাউন্ট তৈরি করতে হবে (ইমেইল অথবা গুগল ১-ক্লিকে)।'
                  : 'Yes! To secure your personal meal logs, deposit balances, and mess roles, you must create a quick account first (via email or 1-click Google sign in).'
              },
              {
                q: isBn ? '১ম সপ্তাহের ১,০০০ টাকা বাজার ফান্ড ও অবশিষ্ট ক্যাশ হিসাব কিভাবে কাজ করে?' : 'How does the 1st-week ৳1,000 bazar starter pool and remaining cash work?',
                a: isBn
                  ? 'মাসের ১-৭ তারিখের মধ্যে প্রত্যেক মেম্বার ১,০০০ টাকা করে প্রাথমিক বাজার ফান্ডে জমা দেন। যে সদস্য বাজারে যাওয়ার জন্য টাকা নিবেন (যেমন ৩,০০০ টাকা), তার নাম ও টাকার পরিমাণ সিস্টেমে এন্ট্রি হয়। বাজার শেষে মোট খরচ বাদ দিয়ে মেসের ক্যাশ বক্সে আর কত টাকা অবশিষ্ট রয়েছে তা সাধারণ মেম্বার ও ম্যানেজার সবাই যার যার ফোন থেকে সরাসরি দেখতে পান।'
                  : 'Every member deposits ৳1,000 during the first week of the month to seed the bazaar cash float. When any member is handed money for shopping (e.g. ৳3,000), it is logged. Once the receipt is recorded and leftover change returned, the live remaining cash in hand is instantly visible to all mess members on their dashboard.'
              },
              {
                q: isBn ? 'গেস্ট বা মেহমানের মিল কিভাবে হিসাব করা হয়?' : 'How are guest meals handled in the calculation?',
                a: isBn
                  ? 'যেকোনো মেম্বার তাদের নামের সাথে অতিরিক্ত গেস্ট লাঞ্চ বা ডিনার যুক্ত করতে পারেন। এই গেস্ট মিলের খরচ সংশ্লিষ্ট মেম্বারের ব্যক্তিগত হিসাবেই যুক্ত হয়।'
                  : 'Members can record guest lunches or guest dinners. The cost of those guest meals is charged directly to that specific member.'
              },
              {
                q: isBn ? 'কাট-অফ টাইম পার হয়ে গেলে কি মিল পরিবর্তন করা যায়?' : 'Can meals be changed after the cutoff time passes?',
                a: isBn
                  ? 'কাট-অফ টাইমের পর সাধারণ মেম্বারদের জন্য মিল এডিটিং লক হয়ে যায় যাতে খাবার অপচয় না হয়। তবে মেস ম্যানেজার চাইলে প্রয়োজনে অ্যাডমিন প্যানেল থেকে সংশোধন করতে পারেন।'
                  : 'After cutoff hours, meals lock for members to prevent food waste. However, mess admins/managers can adjust meal counts if necessary.'
              },
              {
                q: isBn ? 'মাস শেষ হলে পূর্বের হিসাব কিভাবে সংরক্ষিত থাকে?' : 'How is data preserved when a month ends?',
                a: isBn
                  ? 'ম্যানেজার মাস ক্লোজ করলে ওই মাসের হিসাব ফ্রিজ হয়ে যায় এবং মেম্বারদের বাকি বা জমা ব্যালেন্স পরবর্তী মাসে অটোমেটিক অ্যাডভান্স/ডিউ হিসেবে স্থানান্তরিত হয়।'
                  : 'When the manager closes the month, calculations freeze, and member balances carry forward to the new month as opening balance.'
              }
            ].map((faq, idx) => (
              <div 
                key={idx}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${openFaq === idx ? 'rotate-180 text-emerald-600' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-xs">
              <UtensilsCrossed className="w-3.5 h-3.5" />
            </div>
            <span className="font-black text-slate-900 dark:text-white tracking-tight">
              Mess<span className="text-emerald-600 dark:text-emerald-400">Bari</span>
            </span>
            <span>•</span>
            <span>{isBn ? 'আধুনিক মেস ও ব্যাচেলর হোস্টেল প্ল্যাটফর্ম' : 'The modern operating system for hostels & messes'}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
              className="hover:text-emerald-600 cursor-pointer font-medium"
            >
              {lang === 'en' ? 'বাংলা সংস্করণ' : 'English Version'}
            </button>
            <span>•</span>
            <button
              onClick={openSignInFlow}
              className="hover:text-emerald-600 cursor-pointer font-medium"
            >
              {isBn ? 'লগইন' : 'Sign In'}
            </button>
            <span>•</span>
            <button
              onClick={openSignUpFlow}
              className="hover:text-emerald-600 cursor-pointer font-medium"
            >
              {isBn ? 'একাউন্ট খুলুন' : 'Create Account'}
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};
