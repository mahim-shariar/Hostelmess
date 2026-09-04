import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Mess, 
  Member, 
  MealRecord, 
  ExpenseRecord, 
  PaymentRecord, 
  MonthlyAccount, 
  NoticeItem, 
  AuditLogItem, 
  NotificationItem, 
  Role,
  DEFAULT_MEMBER_PERMISSIONS,
  ADMIN_PERMISSIONS,
  BazaarDutyItem
} from '../types';
import { 
  INITIAL_MESS, 
  INITIAL_MEMBERS, 
  generateInitialMeals, 
  INITIAL_EXPENSES, 
  INITIAL_PAYMENTS, 
  INITIAL_NOTICES, 
  INITIAL_AUDIT_LOGS,
  INITIAL_BAZAAR_DUTIES
} from '../lib/initialData';
import { calculateMonthAccounts, getCurrentMonthId } from '../lib/accounting';
import { Language, translations } from '../lib/i18n';
import { 
  db, 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  FirebaseUser,
  handleFirestoreError,
  OperationType 
} from '../lib/firebase';

interface AppContextType {
  // Localization & Theme
  lang: Language;
  setLang: (lang: Language) => void;
  t: (typeof translations)['en'];
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  isOnline: boolean;

  // Authentication & User Profile
  authUser: FirebaseUser | null;
  authLoading: boolean;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  loginWithUsername: (usernameOrEmail: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signupWithUsername: (name: string, usernameOrEmail: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Onboarding & Deposit Modals
  isJoinCreateMessOpen: boolean;
  setIsJoinCreateMessOpen: (open: boolean) => void;
  isAddDepositModalOpen: boolean;
  setIsAddDepositModalOpen: (open: boolean) => void;
  isCookSummaryOpen: boolean;
  setIsCookSummaryOpen: (open: boolean) => void;
  isEditBazaarModalOpen: boolean;
  setIsEditBazaarModalOpen: (open: boolean) => void;

  // Daily Bazaar Duty Roster
  bazaarDuties: Record<string, BazaarDutyItem>;
  updateBazaarDuty: (date: string, duty: Partial<BazaarDutyItem>) => void;

  // Active User & Mess
  currentUser: Member;
  setCurrentUser: (member: Member) => void;
  allMembers: Member[];
  currentMess: Mess;
  updateMess: (updated: Partial<Mess>) => Promise<void>;
  createMess: (
    name: string, 
    adminName: string, 
    phone: string, 
    email: string, 
    currency?: string, 
    location?: string, 
    lunchCutoff?: string, 
    dinnerCutoff?: string
  ) => Promise<string>;
  joinMessByCode: (
    code: string, 
    memberName: string, 
    phone?: string, 
    studentId?: string
  ) => Promise<{ success: boolean; error?: string; messName?: string }>;

  // Selected Month
  selectedMonth: string; // YYYY-MM
  setSelectedMonth: (month: string) => void;

  // Data
  meals: MealRecord[];
  expenses: ExpenseRecord[];
  payments: PaymentRecord[];
  monthlyAccounts: Record<string, MonthlyAccount>;
  notices: NoticeItem[];
  auditLogs: AuditLogItem[];
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;

  // Calculations
  monthlyCalculations: ReturnType<typeof calculateMonthAccounts>;
  currentMemberSummary: ReturnType<typeof calculateMonthAccounts>['memberResults'][string] | undefined;

  // Meal Operations
  isMealLocked: (dateStr: string, mealType: 'breakfast' | 'lunch' | 'dinner') => boolean;
  saveMeal: (
    memberId: string, 
    date: string, 
    breakfast: 0 | 0.5 | 1, 
    lunch: 0 | 0.5 | 1, 
    dinner: 0 | 0.5 | 1,
    guestLunch?: number,
    guestDinner?: number
  ) => Promise<{ success: boolean; error?: string }>;

  // Expense Operations
  addExpense: (expense: Omit<ExpenseRecord, 'id' | 'createdAt' | 'messId' | 'monthId'>) => Promise<void>;
  updateExpenseStatus: (id: string, status: 'approved' | 'rejected') => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;

  // Payment Operations
  addPayment: (payment: Omit<PaymentRecord, 'id' | 'createdAt' | 'messId' | 'monthId'>) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;

  // Member Management (Admin)
  addMember: (memberData: { name: string; email: string; phone?: string; studentId?: string; role: Role }) => Promise<void>;
  updateMemberPermissions: (memberId: string, permissions: Member['permissions']) => Promise<void>;
  toggleMemberStatus: (memberId: string) => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;

  // Month Control
  closeMonth: (monthId: string) => Promise<void>;
  reopenMonth: (monthId: string) => Promise<void>;
  isMonthClosed: boolean;

  // Notices
  addNotice: (title: string, content: string, priority?: 'normal' | 'urgent') => Promise<void>;
  deleteNotice: (id: string) => Promise<void>;

  // Tutorial
  tutorialOpen: boolean;
  setTutorialOpen: (open: boolean) => void;

  // Switch demo profiles
  switchDemoProfile: (memberId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language & Theme
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('mess_lang') as Language) || 'en';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('mess_lang', newLang);
  };

  const t = translations[lang];

  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>(() => {
    return (localStorage.getItem('mess_theme') as 'light' | 'dark' | 'system') || 'light';
  });

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme);
    localStorage.setItem('mess_theme', newTheme);
  };

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      if (theme === 'dark') {
        root.classList.add('dark');
      } else if (theme === 'light') {
        root.classList.remove('dark');
      } else {
        if (mediaQuery.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    applyTheme();

    if (theme === 'system') {
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  // Online / offline detector
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Firebase Auth State
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isJoinCreateMessOpen, setIsJoinCreateMessOpen] = useState<boolean>(false);
  const [isAddDepositModalOpen, setIsAddDepositModalOpen] = useState<boolean>(false);
  const [isCookSummaryOpen, setIsCookSummaryOpen] = useState<boolean>(false);
  const [isEditBazaarModalOpen, setIsEditBazaarModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthUser(user);
      setAuthLoading(false);
      if (user) {
        // If user logged in, check user doc
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            if (userData.activeMessId) {
              // User has an active mess
            }
          }
        } catch (err) {
          console.warn('User profile fetch note:', err);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Auth Operations
  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (user) {
        // Upsert user profile
        try {
          const userDocRef = doc(db, 'users', user.uid);
          await setDoc(userDocRef, {
            id: user.uid,
            name: user.displayName || 'Mess Member',
            email: user.email || '',
            photoURL: user.photoURL || '',
            lastLogin: Date.now(),
          }, { merge: true });
        } catch (e) {
          console.warn('Profile save note:', e);
        }
      }
      return { success: true };
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      return { success: false, error: err?.message || 'Google sign-in was canceled or failed' };
    }
  };

  const loginWithUsername = async (usernameOrEmail: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // If username doesn't contain '@', append domain so Firebase Auth email/pass works seamlessly
      const email = usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail.toLowerCase().replace(/[^a-z0-9_]/g, '')}@hostelmess.local`;
      await signInWithEmailAndPassword(auth, email, pass);
      return { success: true };
    } catch (err: any) {
      console.error('Login error:', err);
      return { success: false, error: err?.message || 'Invalid username or password' };
    }
  };

  const signupWithUsername = async (name: string, usernameOrEmail: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const email = usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail.toLowerCase().replace(/[^a-z0-9_]/g, '')}@hostelmess.local`;
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const user = cred.user;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, {
          id: user.uid,
          name,
          email: user.email,
          username: usernameOrEmail,
          createdAt: Date.now(),
        }, { merge: true });
      }
      return { success: true };
    } catch (err: any) {
      console.error('Sign up error:', err);
      return { success: false, error: err?.message || 'Failed to create account' };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setAuthUser(null);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  // 2. Active Month
  const [selectedMonth, setSelectedMonth] = useState<string>(() => getCurrentMonthId());

  // 3. Core Entities State (Initialized from Local Storage or Demo seed)
  const [currentMess, setCurrentMess] = useState<Mess>(() => {
    const saved = localStorage.getItem('mess_data');
    return saved ? JSON.parse(saved) : INITIAL_MESS;
  });

  const [allMembers, setAllMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('mess_members');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [currentUser, setCurrentUser] = useState<Member>(() => {
    const saved = localStorage.getItem('mess_current_user_id');
    const members = allMembers;
    const found = members.find(m => m.id === saved);
    return found || members[0]; // Mahim (Manager) by default
  });

  const [meals, setMeals] = useState<MealRecord[]>(() => {
    const saved = localStorage.getItem('mess_meals');
    return saved ? JSON.parse(saved) : generateInitialMeals();
  });

  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    const saved = localStorage.getItem('mess_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem('mess_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [monthlyAccounts, setMonthlyAccounts] = useState<Record<string, MonthlyAccount>>(() => {
    const saved = localStorage.getItem('mess_monthly_accounts');
    return saved ? JSON.parse(saved) : {};
  });

  const [notices, setNotices] = useState<NoticeItem[]>(() => {
    const saved = localStorage.getItem('mess_notices');
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem('mess_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [bazaarDuties, setBazaarDuties] = useState<Record<string, BazaarDutyItem>>(() => {
    const saved = localStorage.getItem('mess_bazaar_duties');
    return saved ? JSON.parse(saved) : INITIAL_BAZAAR_DUTIES;
  });

  const updateBazaarDuty = (date: string, dutyUpdate: Partial<BazaarDutyItem>) => {
    setBazaarDuties(prev => {
      const existing = prev[date] || { date, assignedMemberIds: [], assignedNames: [] };
      const updated = {
        ...existing,
        ...dutyUpdate,
        date,
      };
      const next = { ...prev, [date]: updated };
      localStorage.setItem('mess_bazaar_duties', JSON.stringify(next));
      return next;
    });
    pushNotification('Bazaar Duty Updated', `Market duty roster for ${date} has been updated.`, 'info');
  };

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif_welcome',
      title: 'Welcome to Hostel & Mess Manager',
      message: 'Tap your breakfast, lunch or dinner to record today’s meal.',
      type: 'info',
      timestamp: Date.now() - 3600000,
      read: false,
    },
    {
      id: 'notif_rate',
      title: 'Auto Meal Rate Active',
      message: 'Meal rate is dynamically calculated based on approved Bazar expenses.',
      type: 'success',
      timestamp: Date.now() - 7200000,
      read: false,
    }
  ]);

  // First-time tutorial
  const [tutorialOpen, setTutorialOpen] = useState<boolean>(() => {
    return !localStorage.getItem('mess_tutorial_seen');
  });

  // Sync to local storage for fast instant offline reloads
  useEffect(() => {
    localStorage.setItem('mess_data', JSON.stringify(currentMess));
  }, [currentMess]);

  useEffect(() => {
    localStorage.setItem('mess_members', JSON.stringify(allMembers));
  }, [allMembers]);

  useEffect(() => {
    localStorage.setItem('mess_current_user_id', currentUser.id);
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('mess_meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem('mess_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('mess_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('mess_monthly_accounts', JSON.stringify(monthlyAccounts));
  }, [monthlyAccounts]);

  useEffect(() => {
    localStorage.setItem('mess_notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('mess_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Sync Firestore document in background when online
  useEffect(() => {
    if (!isOnline) return;
    const syncFirestore = async () => {
      try {
        const messRef = doc(db, 'messes', currentMess.id);
        await setDoc(messRef, {
          ...currentMess,
          updatedAt: Date.now(),
        }, { merge: true });
      } catch (err) {
        console.warn('Firestore sync note:', err);
      }
    };
    syncFirestore();
  }, [currentMess, isOnline]);

  // Push audit log helper
  const pushAuditLog = useCallback((action: string, target: string, oldValue?: string, newValue?: string) => {
    const item: AuditLogItem = {
      id: 'audit_' + Date.now() + Math.random().toString(36).substring(2, 5),
      messId: currentMess.id,
      action,
      userId: currentUser.id,
      userName: currentUser.name,
      target,
      oldValue,
      newValue,
      timestamp: Date.now(),
    };
    setAuditLogs(prev => [item, ...prev]);
  }, [currentMess.id, currentUser.id, currentUser.name]);

  // Push in-app notification helper
  const pushNotification = useCallback((title: string, message: string, type: NotificationItem['type']) => {
    const notif: NotificationItem = {
      id: 'notif_' + Date.now(),
      title,
      message,
      type,
      timestamp: Date.now(),
      read: false,
    };
    setNotifications(prev => [notif, ...prev]);
  }, []);

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Month accounts calculations
  const monthMeals = useMemo(() => meals.filter(m => m.monthId === selectedMonth), [meals, selectedMonth]);
  const monthExpenses = useMemo(() => expenses.filter(e => e.monthId === selectedMonth), [expenses, selectedMonth]);
  const monthPayments = useMemo(() => payments.filter(p => p.monthId === selectedMonth), [payments, selectedMonth]);

  const monthlyCalculations = useMemo(() => {
    return calculateMonthAccounts(allMembers, monthMeals, monthExpenses, monthPayments, currentMess.currency);
  }, [allMembers, monthMeals, monthExpenses, monthPayments, currentMess.currency]);

  const currentMemberSummary = useMemo(() => {
    return monthlyCalculations.memberResults[currentUser.id];
  }, [monthlyCalculations, currentUser.id]);

  const isMonthClosed = Boolean(monthlyAccounts[selectedMonth]?.isClosed);

  // Check if meal is locked based on cutoff time
  const isMealLocked = useCallback((dateStr: string, mealType: 'breakfast' | 'lunch' | 'dinner'): boolean => {
    if (currentUser.role === 'admin') return false; // Admin can always edit
    if (isMonthClosed) return true;

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Past dates are locked for members
    if (dateStr < todayStr) return true;
    
    // If it's today, check cutoff times
    if (dateStr === todayStr) {
      const currentHour = today.getHours();
      const currentMinute = today.getMinutes();
      const currentTimeVal = currentHour * 60 + currentMinute;

      const parseTime = (timeStr: string) => {
        const [h, m] = (timeStr || '00:00').split(':').map(Number);
        return h * 60 + m;
      };

      if (mealType === 'breakfast') {
        // Cutoff was previous night 10 PM (22:00)
        // Today morning after 07:00 AM breakfast is locked
        if (currentTimeVal > 7 * 60) return true;
      } else if (mealType === 'lunch') {
        const cutoff = parseTime(currentMess?.settings?.mealCutoff?.lunch || '09:00'); // 9:00 AM
        if (currentTimeVal > cutoff) return true;
      } else if (mealType === 'dinner') {
        const cutoff = parseTime(currentMess?.settings?.mealCutoff?.dinner || '16:00'); // 4:00 PM (16:00)
        if (currentTimeVal > cutoff) return true;
      }
    }

    return false;
  }, [currentUser.role, isMonthClosed, currentMess?.settings?.mealCutoff]);

  // Meal save operation
  const saveMeal = async (
    memberId: string, 
    date: string, 
    breakfast: 0 | 0.5 | 1, 
    lunch: 0 | 0.5 | 1, 
    dinner: 0 | 0.5 | 1,
    guestLunch: number = 0, 
    guestDinner: number = 0
  ): Promise<{ success: boolean; error?: string }> => {
    // Permission check
    if (currentUser.role !== 'admin') {
      if (memberId !== currentUser.id) {
        return { success: false, error: 'Cannot edit meals of another member' };
      }
      if (!currentUser.permissions.addOwnMeal && !currentUser.permissions.editOwnMeal) {
        return { success: false, error: 'Permission denied by Admin' };
      }
      if (isMonthClosed) {
        return { success: false, error: 'This month is closed' };
      }

      // Cutoff enforcement: Member can turn off or change lunch before 9am, dinner before 4pm
      const today = new Date().toISOString().split('T')[0];
      if (date === today) {
        const existing = meals.find(m => m.memberId === memberId && m.date === date);
        if (existing) {
          if (existing.lunch !== lunch && isMealLocked(date, 'lunch')) {
            return { success: false, error: 'Lunch is locked! Changes or turning off allowed before 9:00 AM only.' };
          }
          if (existing.dinner !== dinner && isMealLocked(date, 'dinner')) {
            return { success: false, error: 'Dinner is locked! Changes or turning off allowed before 4:00 PM only.' };
          }
        }
      }
    }

    const monthId = date.substring(0, 7);
    const total = breakfast + lunch + dinner + (guestLunch || 0) + (guestDinner || 0);
    const memberObj = allMembers.find(m => m.id === memberId);

    const newRecord: MealRecord = {
      id: `meal_${memberId}_${date}`,
      messId: currentMess.id,
      memberId,
      memberName: memberObj?.name || 'Member',
      date,
      breakfast,
      lunch,
      dinner,
      guestLunch,
      guestDinner,
      total,
      monthId,
      updatedAt: Date.now(),
      updatedBy: currentUser.name,
    };

    setMeals(prev => {
      const idx = prev.findIndex(m => m.memberId === memberId && m.date === date);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = newRecord;
        return updated;
      }
      return [...prev, newRecord];
    });

    pushAuditLog('Meal Saved', `${memberObj?.name || memberId} on ${date}`, undefined, `Total: ${total} meals`);
    
    // Background Firestore write
    if (isOnline) {
      try {
        const mealDoc = doc(db, 'messes', currentMess.id, 'meals', newRecord.id);
        await setDoc(mealDoc, newRecord, { merge: true });
      } catch (err) {
        console.warn('Firestore meal save error:', err);
      }
    }

    return { success: true };
  };

  // Add Expense
  const addExpense = async (expenseData: Omit<ExpenseRecord, 'id' | 'createdAt' | 'messId' | 'monthId'>) => {
    const isAutoApprove = currentMess.settings.expenseApprovalMode === 'automatic' || currentUser.role === 'admin';
    const status = isAutoApprove ? 'approved' : 'pending';
    const monthId = expenseData.date.substring(0, 7);

    const newExpense: ExpenseRecord = {
      ...expenseData,
      id: 'exp_' + Date.now() + Math.random().toString(36).substring(2, 6),
      messId: currentMess.id,
      status,
      monthId,
      createdAt: Date.now(),
    };

    setExpenses(prev => [newExpense, ...prev]);
    pushAuditLog('Expense Added', `${newExpense.category}: ${newExpense.description}`, undefined, `${currentMess.currency}${newExpense.amount}`);

    pushNotification(
      'Expense Recorded', 
      `${currentUser.name} added ${currentMess.currency}${newExpense.amount} for ${newExpense.category}`,
      'info'
    );

    if (isOnline) {
      try {
        const expDoc = doc(db, 'messes', currentMess.id, 'expenses', newExpense.id);
        await setDoc(expDoc, newExpense);
      } catch (err) {
        console.warn('Firestore expense error:', err);
      }
    }
  };

  const updateExpenseStatus = async (id: string, status: 'approved' | 'rejected') => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, status } : e));
    const targetExp = expenses.find(e => e.id === id);
    pushAuditLog(`Expense ${status.toUpperCase()}`, `${targetExp?.description}`, targetExp?.status, status);

    if (isOnline) {
      try {
        const expDoc = doc(db, 'messes', currentMess.id, 'expenses', id);
        await updateDoc(expDoc, { status });
      } catch (err) {
        console.warn('Firestore expense update error:', err);
      }
    }
  };

  const deleteExpense = async (id: string) => {
    const target = expenses.find(e => e.id === id);
    setExpenses(prev => prev.filter(e => e.id !== id));
    pushAuditLog('Expense Deleted', `${target?.category}: ${target?.description}`, `${currentMess.currency}${target?.amount}`);

    if (isOnline) {
      try {
        const expDoc = doc(db, 'messes', currentMess.id, 'expenses', id);
        await updateDoc(expDoc, { deleted: true });
      } catch (err) {
        console.warn('Firestore delete expense error:', err);
      }
    }
  };

  // Payment Operations
  const addPayment = async (paymentData: Omit<PaymentRecord, 'id' | 'createdAt' | 'messId' | 'monthId'>) => {
    const monthId = paymentData.date.substring(0, 7);
    const newPayment: PaymentRecord = {
      ...paymentData,
      id: 'pay_' + Date.now() + Math.random().toString(36).substring(2, 6),
      messId: currentMess.id,
      monthId,
      createdAt: Date.now(),
    };

    setPayments(prev => [newPayment, ...prev]);
    pushAuditLog('Payment Recorded', `${paymentData.memberName}`, undefined, `${currentMess.currency}${paymentData.amount} via ${paymentData.paymentMethod}`);
    
    pushNotification(
      'Payment Recorded',
      `${currentMess.currency}${paymentData.amount} deposit received from ${paymentData.memberName}`,
      'payment'
    );

    if (isOnline) {
      try {
        const payDoc = doc(db, 'messes', currentMess.id, 'payments', newPayment.id);
        await setDoc(payDoc, newPayment);
      } catch (err) {
        console.warn('Firestore payment error:', err);
      }
    }
  };

  const deletePayment = async (id: string) => {
    const target = payments.find(p => p.id === id);
    setPayments(prev => prev.filter(p => p.id !== id));
    pushAuditLog('Payment Deleted', `${target?.memberName}`, `${currentMess.currency}${target?.amount}`);
  };

  // Member Management
  const addMember = async (memberData: { name: string; email: string; phone?: string; studentId?: string; role: Role }) => {
    const newId = 'user_' + Date.now();
    const newMember: Member = {
      id: newId,
      userId: newId,
      messId: currentMess.id,
      name: memberData.name,
      email: memberData.email,
      phone: memberData.phone,
      studentId: memberData.studentId,
      role: memberData.role,
      status: 'active',
      joiningDate: new Date().toISOString().split('T')[0],
      permissions: memberData.role === 'admin' ? ADMIN_PERMISSIONS : DEFAULT_MEMBER_PERMISSIONS,
      previousBalance: 0,
    };

    setAllMembers(prev => [...prev, newMember]);
    pushAuditLog('Member Added', newMember.name, undefined, `Role: ${newMember.role}`);

    if (isOnline) {
      try {
        const memberDoc = doc(db, 'messes', currentMess.id, 'members', newMember.id);
        await setDoc(memberDoc, newMember);
      } catch (err) {
        console.warn('Firestore member add error:', err);
      }
    }
  };

  const updateMemberPermissions = async (memberId: string, permissions: Member['permissions']) => {
    setAllMembers(prev => prev.map(m => m.id === memberId ? { ...m, permissions } : m));
    const target = allMembers.find(m => m.id === memberId);
    pushAuditLog('Permissions Updated', `${target?.name}`);
  };

  const toggleMemberStatus = async (memberId: string) => {
    setAllMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        const nextStatus = m.status === 'active' ? 'disabled' : 'active';
        pushAuditLog('Member Status Changed', m.name, m.status, nextStatus);
        return { ...m, status: nextStatus };
      }
      return m;
    }));
  };

  const removeMember = async (memberId: string) => {
    const target = allMembers.find(m => m.id === memberId);
    setAllMembers(prev => prev.filter(m => m.id !== memberId));
    pushAuditLog('Member Removed', `${target?.name}`);
  };

  // Month Close / Reopen
  const closeMonth = async (monthId: string) => {
    const account: MonthlyAccount = {
      monthId,
      messId: currentMess.id,
      isClosed: true,
      closedAt: Date.now(),
      closedBy: currentUser.name,
      totalMeals: monthlyCalculations.totalMeals,
      totalFoodExpense: monthlyCalculations.totalFoodExpense,
      totalOtherExpense: monthlyCalculations.totalOtherExpense,
      mealRate: monthlyCalculations.mealRate,
      totalPayments: monthlyCalculations.totalPayments,
      totalDue: monthlyCalculations.totalDue,
      totalAdvance: monthlyCalculations.totalAdvance,
    };

    setMonthlyAccounts(prev => ({ ...prev, [monthId]: account }));
    pushAuditLog('Month Closed', monthId, 'Open', 'Closed');
    pushNotification('Month Closed', `${monthId} has been closed by Manager. Final meal rate: ${currentMess.currency}${monthlyCalculations.mealRate}`, 'warning');

    if (isOnline) {
      try {
        const acctDoc = doc(db, 'messes', currentMess.id, 'monthlyAccounts', monthId);
        await setDoc(acctDoc, account);
      } catch (err) {
        console.warn('Firestore close month error:', err);
      }
    }
  };

  const reopenMonth = async (monthId: string) => {
    setMonthlyAccounts(prev => {
      const next = { ...prev };
      if (next[monthId]) {
        next[monthId] = { ...next[monthId], isClosed: false };
      }
      return next;
    });
    pushAuditLog('Month Reopened', monthId, 'Closed', 'Open');
    pushNotification('Month Reopened', `${monthId} has been reopened by Manager.`, 'info');
  };

  // Notices
  const addNotice = async (title: string, content: string, priority: 'normal' | 'urgent' = 'normal') => {
    const newNotice: NoticeItem = {
      id: 'notice_' + Date.now(),
      messId: currentMess.id,
      title,
      content,
      authorName: currentUser.name,
      authorId: currentUser.id,
      createdAt: Date.now(),
      priority,
    };

    setNotices(prev => [newNotice, ...prev]);
    pushAuditLog('Notice Posted', title);
    pushNotification('New Notice', title, 'notice');

    if (isOnline) {
      try {
        const noticeDoc = doc(db, 'messes', currentMess.id, 'notices', newNotice.id);
        await setDoc(noticeDoc, newNotice);
      } catch (err) {
        console.warn('Firestore notice error:', err);
      }
    }
  };

  const deleteNotice = async (id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
  };

  // Mess Settings update
  const updateMess = async (updated: Partial<Mess>) => {
    setCurrentMess(prev => ({ ...prev, ...updated }));
    pushAuditLog('Mess Settings Updated', currentMess.name);
  };

  // Create Mess
  const createMess = async (
    name: string, 
    adminName: string, 
    phone: string, 
    email: string, 
    currency: string = '৳',
    location: string = 'Hostel Premises',
    lunchCutoff: string = '09:00',
    dinnerCutoff: string = '16:00'
  ): Promise<string> => {
    const newMessId = 'mess_' + Date.now();
    const inviteCode = name.substring(0, 4).toUpperCase() + Math.floor(1000 + Math.random() * 9000);
    const newAdminId = authUser ? `user_${authUser.uid}` : 'user_admin_' + Date.now();

    const newAdminMember: Member = {
      id: newAdminId,
      userId: newAdminId,
      messId: newMessId,
      name: adminName,
      email: email || authUser?.email || 'admin@hostel.edu',
      phone,
      role: 'admin',
      status: 'active',
      joiningDate: new Date().toISOString().split('T')[0],
      permissions: ADMIN_PERMISSIONS,
      previousBalance: 0,
    };

    const newMess: Mess = {
      id: newMessId,
      name,
      adminId: newAdminId,
      adminName,
      phone,
      email,
      currency,
      location,
      inviteCode,
      createdAt: Date.now(),
      settings: {
        currency,
        mealCutoff: {
          breakfast: '22:00',
          lunch: lunchCutoff || '09:00',
          dinner: dinnerCutoff || '16:00',
        },
        enableGuestMeals: true,
        expenseApprovalMode: 'automatic',
        categories: {
          food: ['Bazar', 'Rice', 'Fish', 'Meat', 'Vegetables', 'Grocery', 'Other'],
          bills: ['Gas', 'Electricity', 'Water', 'Internet'],
          other: ['Cleaning', 'Repair', 'Miscellaneous'],
        },
      },
    };

    setCurrentMess(newMess);
    setAllMembers([newAdminMember]);
    setCurrentUser(newAdminMember);
    setMeals([]);
    setExpenses([]);
    setPayments([]);
    setNotices([]);

    // Save to Firestore
    if (isOnline) {
      try {
        await setDoc(doc(db, 'messes', newMessId), newMess);
        await setDoc(doc(db, 'messes', newMessId, 'members', newAdminId), newAdminMember);
        if (authUser) {
          await setDoc(doc(db, 'users', authUser.uid), { activeMessId: newMessId }, { merge: true });
        }
      } catch (err) {
        console.warn('Firestore create mess note:', err);
      }
    }

    pushAuditLog('Mess Created', name, undefined, `Code: ${inviteCode}`);
    return inviteCode;
  };

  // Join Mess by invite code
  const joinMessByCode = async (
    code: string, 
    memberName: string, 
    phone?: string, 
    studentId?: string
  ): Promise<{ success: boolean; error?: string; messName?: string }> => {
    const cleanCode = code.trim().toUpperCase();

    // Check if matching current mess
    if (cleanCode === currentMess.inviteCode.toUpperCase()) {
      const newMemberId = authUser ? `user_${authUser.uid}` : 'user_' + Date.now();
      const newMember: Member = {
        id: newMemberId,
        userId: newMemberId,
        messId: currentMess.id,
        name: memberName,
        email: authUser?.email || `${memberName.toLowerCase().replace(/\s+/g, '')}@student.edu`,
        phone,
        studentId,
        role: 'member',
        status: 'active',
        joiningDate: new Date().toISOString().split('T')[0],
        permissions: DEFAULT_MEMBER_PERMISSIONS,
        previousBalance: 0,
      };

      setAllMembers(prev => {
        const exists = prev.some(m => m.id === newMemberId || m.name.toLowerCase() === memberName.toLowerCase());
        if (exists) return prev;
        return [...prev, newMember];
      });
      setCurrentUser(newMember);

      if (isOnline) {
        try {
          await setDoc(doc(db, 'messes', currentMess.id, 'members', newMemberId), newMember);
          if (authUser) {
            await setDoc(doc(db, 'users', authUser.uid), { activeMessId: currentMess.id }, { merge: true });
          }
        } catch (e) {
          console.warn('Firestore join member note:', e);
        }
      }

      pushAuditLog('Member Joined via Code', memberName, undefined, `Code: ${code}`);
      pushNotification('New Member Joined', `${memberName} joined the mess.`, 'info');
      return { success: true, messName: currentMess.name };
    }

    // Try Firestore query if online
    if (isOnline) {
      try {
        const q = query(collection(db, 'messes'), where('inviteCode', '==', cleanCode));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const messDoc = querySnapshot.docs[0];
          const fetchedMess = messDoc.data() as Mess;
          setCurrentMess(fetchedMess);

          const newMemberId = authUser ? `user_${authUser.uid}` : 'user_' + Date.now();
          const newMember: Member = {
            id: newMemberId,
            userId: newMemberId,
            messId: fetchedMess.id,
            name: memberName,
            email: authUser?.email || `${memberName.toLowerCase().replace(/\s+/g, '')}@student.edu`,
            phone,
            studentId,
            role: 'member',
            status: 'active',
            joiningDate: new Date().toISOString().split('T')[0],
            permissions: DEFAULT_MEMBER_PERMISSIONS,
            previousBalance: 0,
          };

          await setDoc(doc(db, 'messes', fetchedMess.id, 'members', newMemberId), newMember);
          setAllMembers(prev => [...prev, newMember]);
          setCurrentUser(newMember);

          return { success: true, messName: fetchedMess.name };
        }
      } catch (err: any) {
        console.warn('Query mess by code error:', err);
      }
    }

    return { success: false, error: `No mess found with code "${cleanCode}". Please verify with your mess manager.` };
  };

  // Demo profile switcher
  const switchDemoProfile = (memberId: string) => {
    const found = allMembers.find(m => m.id === memberId);
    if (found) {
      setCurrentUser(found);
    }
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        t,
        theme,
        setTheme,
        isOnline,
        authUser,
        authLoading,
        loginWithGoogle,
        loginWithUsername,
        signupWithUsername,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isJoinCreateMessOpen,
        setIsJoinCreateMessOpen,
        isAddDepositModalOpen,
        setIsAddDepositModalOpen,
        isCookSummaryOpen,
        setIsCookSummaryOpen,
        isEditBazaarModalOpen,
        setIsEditBazaarModalOpen,
        bazaarDuties,
        updateBazaarDuty,
        currentUser,
        setCurrentUser,
        allMembers,
        currentMess,
        updateMess,
        createMess,
        joinMessByCode,
        selectedMonth,
        setSelectedMonth,
        meals,
        expenses,
        payments,
        monthlyAccounts,
        notices,
        auditLogs,
        notifications,
        markNotificationAsRead,
        monthlyCalculations,
        currentMemberSummary,
        isMealLocked,
        saveMeal,
        addExpense,
        updateExpenseStatus,
        deleteExpense,
        addPayment,
        deletePayment,
        addMember,
        updateMemberPermissions,
        toggleMemberStatus,
        removeMember,
        closeMonth,
        reopenMonth,
        isMonthClosed,
        addNotice,
        deleteNotice,
        tutorialOpen,
        setTutorialOpen,
        switchDemoProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
