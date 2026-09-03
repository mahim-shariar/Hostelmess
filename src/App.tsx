import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav, NavTab } from './components/BottomNav';
import { MemberDashboard } from './components/member/MemberDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { MealTracker } from './components/meals/MealTracker';
import { ExpenseManager } from './components/expenses/ExpenseManager';
import { PaymentManager } from './components/payments/PaymentManager';
import { MemberList } from './components/members/MemberList';
import { MonthlyReport } from './components/reports/MonthlyReport';
import { MoreSettings } from './components/more/MoreSettings';
import { TutorialModal } from './components/TutorialModal';
import { Toast } from './components/ui/Toast';
import { AuthModal } from './components/auth/AuthModal';
import { JoinOrCreateMessModal } from './components/mess/JoinOrCreateMessModal';
import { AddDepositModal } from './components/payments/AddDepositModal';

const AppContent: React.FC = () => {
  const { 
    currentUser, 
    setTutorialOpen, 
    currentMess, 
    t,
    setIsJoinCreateMessOpen,
    authUser 
  } = useApp();
  const isAdmin = currentUser.role === 'admin';

  // First-time visitor or fresh session: show Join or Create Mess modal
  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem('mess_welcome_shown');
    if (!hasSeenWelcome) {
      setIsJoinCreateMessOpen(true);
      sessionStorage.setItem('mess_welcome_shown', 'true');
    }
  }, []);

  // Navigation state
  const [activeTab, setActiveTab] = useState<NavTab>(isAdmin ? 'dashboard' : 'home');

  // Sync tab if user changes between admin and member
  useEffect(() => {
    if (isAdmin && activeTab === 'home') {
      setActiveTab('dashboard');
    } else if (!isAdmin && (activeTab === 'dashboard' || activeTab === 'members')) {
      setActiveTab('home');
    }
  }, [isAdmin]);

  // Global modals triggered from quick action buttons
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  // Render current tab content
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <MemberDashboard
            onGoToMeals={() => setActiveTab('meals')}
            onGoToAccount={() => setActiveTab('account')}
            onAddExpense={() => {
              setActiveTab('expenses');
              setIsAddExpenseOpen(true);
            }}
          />
        );

      case 'dashboard':
        return (
          <AdminDashboard
            onGoToMeals={() => setActiveTab('meals')}
            onGoToExpenses={() => setActiveTab('expenses')}
            onGoToMembers={() => setActiveTab('members')}
            onOpenAddExpense={() => {
              setActiveTab('expenses');
              setIsAddExpenseOpen(true);
            }}
            onOpenAddPayment={() => {
              setActiveTab('more');
              setIsAddPaymentOpen(true);
            }}
            onOpenAddMember={() => {
              setActiveTab('members');
              setIsAddMemberOpen(true);
            }}
            onOpenNotices={() => setActiveTab('more')}
          />
        );

      case 'meals':
        return <MealTracker />;

      case 'expenses':
        return (
          <ExpenseManager
            isAddModalOpen={isAddExpenseOpen}
            setIsAddModalOpen={setIsAddExpenseOpen}
          />
        );

      case 'members':
        return (
          <MemberList
            isAddModalOpen={isAddMemberOpen}
            setIsAddModalOpen={setIsAddMemberOpen}
          />
        );

      case 'account':
        return (
          <PaymentManager
            isAddModalOpen={isAddPaymentOpen}
            setIsAddModalOpen={setIsAddPaymentOpen}
          />
        );

      case 'more':
        return (
          <div className="space-y-6">
            <MoreSettings
              onOpenTutorial={() => setTutorialOpen(true)}
              onGoToReports={() => setActiveTab('dashboard')}
            />
            {/* Show Monthly Report in More section */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <MonthlyReport />
            </div>
          </div>
        );

      default:
        return <MemberDashboard onGoToMeals={() => setActiveTab('meals')} onGoToAccount={() => setActiveTab('account')} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150">
      {/* Top Navbar */}
      <Navbar
        onOpenSettings={() => setActiveTab('more')}
        onOpenNotices={() => setActiveTab('more')}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-4 sm:py-6">
        {renderContent()}
      </main>

      {/* Payment modal if opened directly from Admin Quick actions */}
      {isAddPaymentOpen && activeTab !== 'account' && (
        <PaymentManager
          isAddModalOpen={isAddPaymentOpen}
          setIsAddModalOpen={setIsAddPaymentOpen}
        />
      )}

      {/* Interactive First-time Walkthrough / Tutorial */}
      <TutorialModal />

      {/* Authentication Modal (Google / Username & Password) */}
      <AuthModal />

      {/* Join or Create Mess Modal (Code / Name & Location) */}
      <JoinOrCreateMessModal />

      {/* Member Deposit Modal */}
      <AddDepositModal />

      {/* Notification Toast */}
      <Toast />

      {/* Bottom Mobile Navigation */}
      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
