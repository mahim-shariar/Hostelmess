import { 
  Mess, 
  Member, 
  MealRecord, 
  ExpenseRecord, 
  PaymentRecord, 
  NoticeItem, 
  AuditLogItem, 
  DEFAULT_MEMBER_PERMISSIONS, 
  BazaarDutyItem,
  BazarCashHandover,
  FirstWeekBazarDeposit
} from '../types';

export const DEFAULT_MESS_ID = '';

export const INITIAL_MESS: Mess = {
  id: '',
  name: '',
  location: '',
  adminId: '',
  adminName: '',
  phone: '',
  email: '',
  currency: '৳',
  inviteCode: '',
  createdAt: 0,
  settings: {
    currency: '৳',
    mealCutoff: {
      breakfast: '22:00', // 10 PM prev night
      lunch: '09:00',     // 9 AM
      dinner: '16:00',    // 4 PM
    },
    enableGuestMeals: true,
    expenseApprovalMode: 'automatic',
    categories: {
      food: ['Bazar', 'Rice', 'Fish', 'Meat', 'Vegetables', 'Grocery', 'Oil & Spices', 'Other'],
      bills: ['Gas', 'Electricity', 'Water', 'Internet', 'Maid / Cook'],
      other: ['Cleaning', 'Repair', 'Miscellaneous'],
    },
  },
};

export const DEFAULT_MEMBER: Member = {
  id: '',
  userId: '',
  messId: '',
  name: 'Member',
  email: '',
  role: 'member',
  status: 'active',
  joiningDate: new Date().toISOString().split('T')[0],
  permissions: DEFAULT_MEMBER_PERMISSIONS,
  previousBalance: 0,
};

export const INITIAL_MEMBERS: Member[] = [];

export function generateInitialMeals(): MealRecord[] {
  return [];
}

export const INITIAL_EXPENSES: ExpenseRecord[] = [];

export const INITIAL_PAYMENTS: PaymentRecord[] = [];

export const INITIAL_NOTICES: NoticeItem[] = [];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [];

export const INITIAL_BAZAAR_DUTIES: Record<string, BazaarDutyItem> = {};

export const INITIAL_FIRST_WEEK_DEPOSITS: FirstWeekBazarDeposit[] = [];

export const INITIAL_BAZAR_HANDOVERS: BazarCashHandover[] = [];
