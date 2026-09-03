import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Utensils, ShoppingBag, CreditCard, Scale, HelpCircle, CheckCircle2, ChevronRight, X } from 'lucide-react';

export const TutorialModal: React.FC = () => {
  const { tutorialOpen, setTutorialOpen, t, currentMess } = useApp();
  const [currentStep, setCurrentStep] = useState(0);

  if (!tutorialOpen) return null;

  const steps = [
    {
      icon: <HelpCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />,
      title: t.tut1Title,
      desc: t.tut1Desc,
      tip: `Current Mess: "${currentMess.name}" (Invite Code: ${currentMess.inviteCode}). Members can use this code to join in seconds!`,
    },
    {
      icon: <Utensils className="w-8 h-8 text-amber-500 dark:text-amber-400" />,
      title: t.tut2Title,
      desc: t.tut2Desc,
      tip: 'Tap Breakfast, Lunch, or Dinner directly from the home screen. Full meal is 1, half meal is 0.5, or turn it off with 0.',
    },
    {
      icon: <ShoppingBag className="w-8 h-8 text-rose-500 dark:text-rose-400" />,
      title: t.tut3Title,
      desc: t.tut3Desc,
      tip: 'Bazar costs like rice, fish, chicken, and vegetables automatically feed into the monthly meal rate.',
    },
    {
      icon: <CreditCard className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />,
      title: t.tut4Title,
      desc: t.tut4Desc,
      tip: 'Record payments via bKash, Nagad, Cash, or Bank transfer. Enter transaction references to avoid disputes.',
    },
    {
      icon: <Scale className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />,
      title: t.tut5Title,
      desc: t.tut5Desc,
      tip: 'Formula: Total Food Expenses ÷ Total Meals = Meal Rate. E.g., ৳50,000 ÷ 1,000 meals = ৳50/meal.',
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />,
      title: t.tut6Title,
      desc: t.tut6Desc,
      tip: 'Your balance always reads clearly as "Advance" (money you deposited ahead) or "Due" (money owed). No confusing negatives!',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    localStorage.setItem('mess_tutorial_seen', 'true');
    setTutorialOpen(false);
  };

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div 
        id="tutorial-modal"
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden"
      >
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentStep
                    ? 'w-7 bg-emerald-600 dark:bg-emerald-400'
                    : idx < currentStep
                    ? 'w-2 bg-emerald-300 dark:bg-emerald-700'
                    : 'w-2 bg-slate-200 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>
          <button
            id="btn-skip-tutorial"
            onClick={handleClose}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1 rounded-md transition-colors"
          >
            {t.skipTutorial}
          </button>
        </div>

        {/* Icon & Title */}
        <div className="flex flex-col items-center text-center space-y-4 py-2">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800/80 flex items-center justify-center shadow-inner border border-slate-100 dark:border-slate-800">
            {step.icon}
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {step.title}
          </h3>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-md">
            {step.desc}
          </p>

          <div className="w-full bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
              Pro Tip:
            </span>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {step.tip}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            id="btn-tutorial-prev"
            disabled={currentStep === 0}
            onClick={() => setCurrentStep(prev => prev - 1)}
            className={`text-sm font-medium px-4 py-2 rounded-xl transition-colors ${
              currentStep === 0
                ? 'opacity-0 pointer-events-none'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {t.back}
          </button>

          <button
            id="btn-tutorial-next"
            onClick={handleNext}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
          >
            <span>{currentStep === steps.length - 1 ? t.gotIt : t.next}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
