export type Role = 'admin' | 'member';

export type MealValue = 0 | 0.5 | 1;

export interface MemberPermissions {
  addOwnMeal: boolean;
  editOwnMeal: boolean;
  addExpense: boolean;
  viewExpenses: boolean;
  addPayment: boolean;
  viewPayments: boolean;
  viewMonthlyReport: boolean;
}

export const DEFAULT_MEMBER_PERMISSIONS: MemberPermissions = {
  addOwnMeal: true,
  editOwnMeal: true,
  addExpense: false,
  viewExpenses: true,
  addPayment: true, // Members can submit their own deposits
  viewPayments: true,
  viewMonthlyReport: true,
};

export const ADMIN_PERMISSIONS: MemberPermissions = {
  addOwnMeal: true,
  editOwnMeal: true,
  addExpense: true,
  viewExpenses: true,
  addPayment: true,
  viewPayments: true,
  viewMonthlyReport: true,
};

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  photoURL?: string;
  activeMessId?: string;
  createdAt: number;
}

export interface MessSettings {
  currency: string;
  mealCutoff: {
    breakfast: string; // e.g. "22:00" prev night
    lunch: string;     // e.g. "09:00"
    dinner: string;    // e.g. "15:00"
  };
  breakfastWeight?: number;
  enableGuestMeals: boolean;
  expenseApprovalMode: 'automatic' | 'require_approval';
  categories: {
    food: string[];
    bills: string[];
    other: string[];
  };
}

export interface Mess {
  id: string;
  name: string;
  location?: string;
  adminId: string;
  adminName: string;
  phone: string;
  email: string;
  currency: string;
  inviteCode: string;
  settings: MessSettings;
  createdAt: number;
}

export interface Member {
  id: string;
  userId: string;
  messId: string;
  name: string;
  email: string;
  phone?: string;
  studentId?: string;
  photoURL?: string;
  role: Role;
  status: 'active' | 'disabled';
  joiningDate: string; // YYYY-MM-DD
  permissions: MemberPermissions;
  previousBalance?: number; // Advance (+) or Due (-) from previous months
}

export interface MealRecord {
  id: string;
  messId: string;
  memberId: string;
  memberName: string;
  date: string; // YYYY-MM-DD
  breakfast: MealValue;
  lunch: MealValue;
  dinner: MealValue;
  guestLunch?: number;
  guestDinner?: number;
  total: number;
  monthId: string; // YYYY-MM
  updatedAt?: number;
  updatedBy?: string;
}

export type ExpenseCategoryType = 'food' | 'bills' | 'other';

export interface ExpenseRecord {
  id: string;
  messId: string;
  amount: number;
  type: ExpenseCategoryType;
  category: string;
  description: string;
  date: string; // YYYY-MM-DD
  paidBy: string; // memberId or userId
  paidByName: string;
  paymentMethod: 'Cash' | 'bKash' | 'Nagad' | 'Bank' | 'Other';
  receiptUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  monthId: string; // YYYY-MM
  createdAt: number;
}

export interface PaymentRecord {
  id: string;
  messId: string;
  memberId: string;
  memberName: string;
  amount: number;
  date: string; // YYYY-MM-DD
  paymentMethod: 'Cash' | 'bKash' | 'Nagad' | 'Bank' | 'Other';
  transactionId?: string;
  note?: string;
  monthId: string; // YYYY-MM
  createdAt: number;
}

export interface MonthlyAccount {
  monthId: string; // YYYY-MM
  messId: string;
  isClosed: boolean;
  closedAt?: number;
  closedBy?: string;
  totalMeals: number;
  totalFoodExpense: number;
  totalOtherExpense: number;
  mealRate: number;
  totalPayments: number;
  totalDue: number;
  totalAdvance: number;
  summaryPerMember?: Record<string, {
    meals: number;
    mealCost: number;
    otherCost: number;
    totalBill: number;
    paid: number;
    balance: number; // positive = advance, negative = due
  }>;
}

export interface NoticeItem {
  id: string;
  messId: string;
  title: string;
  content: string;
  authorName: string;
  authorId: string;
  createdAt: number;
  priority?: 'normal' | 'urgent';
  date?: string;
}

export type Notice = NoticeItem;

export interface AuditLogItem {
  id: string;
  messId: string;
  action: string;
  userId: string;
  userName: string;
  target?: string;
  oldValue?: string;
  newValue?: string;
  details?: string;
  timestamp: number;
}

export type AuditLog = AuditLogItem;

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'meal_lock' | 'notice' | 'payment';
  timestamp: number;
  read: boolean;
}

export interface BazaarDutyItem {
  date: string; // YYYY-MM-DD
  assignedMemberIds: string[];
  assignedNames: string[];
  estimatedBudget?: number;
  notes?: string;
  isCompleted?: boolean;
}

export interface BazarCashHandover {
  id: string;
  messId: string;
  monthId: string; // YYYY-MM
  date: string; // YYYY-MM-DD
  shopperId: string;
  shopperName: string;
  cashTaken: number; // e.g. 3000 taka taken for bazar
  actualSpent?: number; // e.g. 2750 taka
  cashReturned?: number; // e.g. 250 taka returned to manager fund
  status: 'shopping' | 'settled';
  note?: string;
  createdAt: number;
}

export interface FirstWeekBazarDeposit {
  id: string;
  messId: string;
  monthId: string; // YYYY-MM
  memberId: string;
  memberName: string;
  requiredAmount: number; // 1000 taka default
  paidAmount: number; // 1000 or custom
  status: 'paid' | 'pending';
  paidDate?: string;
  paymentMethod?: 'Cash' | 'bKash' | 'Nagad' | 'Bank' | 'Other';
  transactionId?: string;
}
