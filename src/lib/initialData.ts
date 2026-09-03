import { 
  Mess, 
  Member, 
  MealRecord, 
  ExpenseRecord, 
  PaymentRecord, 
  NoticeItem, 
  AuditLogItem, 
  DEFAULT_MEMBER_PERMISSIONS, 
  ADMIN_PERMISSIONS,
  DailyMenu,
  BazaarDutyItem
} from '../types';

export const DEMO_MESS_ID = 'mess_padma_2026';

export const INITIAL_MESS: Mess = {
  id: DEMO_MESS_ID,
  name: 'Padma Student Mess',
  location: 'Mirpur-10, Dhaka',
  adminId: 'user_mahim_admin',
  adminName: 'Mahim',
  phone: '+8801712345678',
  email: 'mahim@hostel.edu',
  currency: '৳',
  inviteCode: 'MAHIM2026',
  createdAt: Date.now() - 30 * 86400000,
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

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'user_mahim_admin',
    userId: 'user_mahim_admin',
    messId: DEMO_MESS_ID,
    name: 'Mahim (Manager)',
    email: 'mahim@hostel.edu',
    phone: '01711223344',
    studentId: 'CSE-2021-01',
    role: 'admin',
    status: 'active',
    joiningDate: '2026-01-01',
    permissions: ADMIN_PERMISSIONS,
    previousBalance: 0,
  },
  {
    id: 'user_rahim_member',
    userId: 'user_rahim_member',
    messId: DEMO_MESS_ID,
    name: 'Rahim',
    email: 'rahim@hostel.edu',
    phone: '01811223344',
    studentId: 'EEE-2021-14',
    role: 'member',
    status: 'active',
    joiningDate: '2026-01-01',
    permissions: {
      ...DEFAULT_MEMBER_PERMISSIONS,
      addExpense: true, // permitted to do bazar
    },
    previousBalance: 200, // 200 advance from last month
  },
  {
    id: 'user_karim_member',
    userId: 'user_karim_member',
    messId: DEMO_MESS_ID,
    name: 'Karim',
    email: 'karim@hostel.edu',
    phone: '01911223344',
    studentId: 'BBA-2022-09',
    role: 'member',
    status: 'active',
    joiningDate: '2026-02-01',
    permissions: DEFAULT_MEMBER_PERMISSIONS,
    previousBalance: -150, // 150 due from last month
  },
  {
    id: 'user_tanvir_member',
    userId: 'user_tanvir_member',
    messId: DEMO_MESS_ID,
    name: 'Tanvir',
    email: 'tanvir@hostel.edu',
    phone: '01611223344',
    studentId: 'ME-2022-42',
    role: 'member',
    status: 'active',
    joiningDate: '2026-03-01',
    permissions: DEFAULT_MEMBER_PERMISSIONS,
    previousBalance: 0,
  },
  {
    id: 'user_sabbir_member',
    userId: 'user_sabbir_member',
    messId: DEMO_MESS_ID,
    name: 'Sabbir',
    email: 'sabbir@hostel.edu',
    phone: '01511223344',
    studentId: 'CE-2023-05',
    role: 'member',
    status: 'active',
    joiningDate: '2026-04-01',
    permissions: DEFAULT_MEMBER_PERMISSIONS,
    previousBalance: 100,
  },
];

// Helper to generate September 2026 sample meals up to today (Sep 3)
export function generateInitialMeals(): MealRecord[] {
  const meals: MealRecord[] = [];
  const dates = ['2026-09-01', '2026-09-02', '2026-09-03'];

  INITIAL_MEMBERS.forEach((member) => {
    dates.forEach((date, dayIdx) => {
      // realistic values
      const b = (dayIdx === 1 && member.name.includes('Karim')) ? 0 : 1;
      const l = 1;
      const d = 1;
      const gL = (dayIdx === 1 && member.name.includes('Mahim')) ? 1 : 0;
      const gD = 0;
      const total = b + l + d + gL + gD;

      meals.push({
        id: `meal_${member.id}_${date}`,
        messId: DEMO_MESS_ID,
        memberId: member.id,
        memberName: member.name,
        date,
        breakfast: b as 0 | 0.5 | 1,
        lunch: l as 0 | 0.5 | 1,
        dinner: d as 0 | 0.5 | 1,
        guestLunch: gL,
        guestDinner: gD,
        total,
        monthId: '2026-09',
        updatedAt: Date.now(),
        updatedBy: member.name,
      });
    });
  });

  return meals;
}

export const INITIAL_EXPENSES: ExpenseRecord[] = [
  {
    id: 'exp_01',
    messId: DEMO_MESS_ID,
    amount: 2500,
    type: 'food',
    category: 'Bazar',
    description: 'Fresh vegetables, eggs, onions & spices (Kawran Bazar)',
    date: '2026-09-01',
    paidBy: 'user_rahim_member',
    paidByName: 'Rahim',
    paymentMethod: 'Cash',
    status: 'approved',
    monthId: '2026-09',
    createdAt: Date.now() - 2 * 86400000,
  },
  {
    id: 'exp_02',
    messId: DEMO_MESS_ID,
    amount: 3200,
    type: 'food',
    category: 'Meat',
    description: '4kg broiler chicken & 2kg beef',
    date: '2026-09-01',
    paidBy: 'user_mahim_admin',
    paidByName: 'Mahim (Manager)',
    paymentMethod: 'bKash',
    status: 'approved',
    monthId: '2026-09',
    createdAt: Date.now() - 2 * 86400000,
  },
  {
    id: 'exp_03',
    messId: DEMO_MESS_ID,
    amount: 3400,
    type: 'food',
    category: 'Rice',
    description: 'Miniket Rice 50kg bag',
    date: '2026-09-02',
    paidBy: 'user_mahim_admin',
    paidByName: 'Mahim (Manager)',
    paymentMethod: 'Cash',
    status: 'approved',
    monthId: '2026-09',
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'exp_04',
    messId: DEMO_MESS_ID,
    amount: 1400,
    type: 'bills',
    category: 'Gas',
    description: 'LPG Gas cylinder 12kg refill',
    date: '2026-09-02',
    paidBy: 'user_mahim_admin',
    paidByName: 'Mahim (Manager)',
    paymentMethod: 'bKash',
    status: 'approved',
    monthId: '2026-09',
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'exp_05',
    messId: DEMO_MESS_ID,
    amount: 1000,
    type: 'bills',
    category: 'Internet',
    description: 'Optic Fiber Broadband Internet 25Mbps (September)',
    date: '2026-09-03',
    paidBy: 'user_mahim_admin',
    paidByName: 'Mahim (Manager)',
    paymentMethod: 'bKash',
    status: 'approved',
    monthId: '2026-09',
    createdAt: Date.now() - 10000000,
  },
  {
    id: 'exp_06',
    messId: DEMO_MESS_ID,
    amount: 1800,
    type: 'food',
    category: 'Fish',
    description: 'Rui fish 3kg & Prawns',
    date: '2026-09-03',
    paidBy: 'user_rahim_member',
    paidByName: 'Rahim',
    paymentMethod: 'Nagad',
    status: 'approved',
    monthId: '2026-09',
    createdAt: Date.now() - 5000000,
  },
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay_01',
    messId: DEMO_MESS_ID,
    memberId: 'user_mahim_admin',
    memberName: 'Mahim (Manager)',
    amount: 3000,
    date: '2026-09-01',
    paymentMethod: 'Cash',
    note: 'Initial advance for September bazar',
    monthId: '2026-09',
    createdAt: Date.now() - 2 * 86400000,
  },
  {
    id: 'pay_02',
    messId: DEMO_MESS_ID,
    memberId: 'user_rahim_member',
    memberName: 'Rahim',
    amount: 3000,
    date: '2026-09-01',
    paymentMethod: 'bKash',
    transactionId: 'BK9A8149XX',
    note: 'bKash deposit September',
    monthId: '2026-09',
    createdAt: Date.now() - 2 * 86400000,
  },
  {
    id: 'pay_03',
    messId: DEMO_MESS_ID,
    memberId: 'user_karim_member',
    memberName: 'Karim',
    amount: 2500,
    date: '2026-09-02',
    paymentMethod: 'Nagad',
    transactionId: 'NG77123901',
    note: 'Nagad cash in',
    monthId: '2026-09',
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'pay_04',
    messId: DEMO_MESS_ID,
    memberId: 'user_tanvir_member',
    memberName: 'Tanvir',
    amount: 3000,
    date: '2026-09-02',
    paymentMethod: 'Bank',
    transactionId: 'IBBL-09823',
    note: 'Islami Bank transfer',
    monthId: '2026-09',
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'pay_05',
    messId: DEMO_MESS_ID,
    memberId: 'user_sabbir_member',
    memberName: 'Sabbir',
    amount: 2500,
    date: '2026-09-03',
    paymentMethod: 'Cash',
    note: 'Hand cash given to manager',
    monthId: '2026-09',
    createdAt: Date.now() - 10000000,
  },
];

export const INITIAL_NOTICES: NoticeItem[] = [
  {
    id: 'notice_01',
    messId: DEMO_MESS_ID,
    title: 'Monthly Mess Meeting & Bazar Duty',
    content: 'All members please attend the monthly meeting this Friday at 9:00 PM in the dining room. Next week bazar schedule will be finalized.',
    authorName: 'Mahim (Manager)',
    authorId: 'user_mahim_admin',
    createdAt: Date.now() - 86400000,
    priority: 'urgent',
  },
  {
    id: 'notice_02',
    messId: DEMO_MESS_ID,
    title: 'Tomorrow lunch will be served at 1:30 PM',
    content: 'Due to Friday Jummah prayer, tomorrow lunch will start at 1:30 PM. Please update your meal counts before 9:00 AM morning.',
    authorName: 'Mahim (Manager)',
    authorId: 'user_mahim_admin',
    createdAt: Date.now() - 40000000,
    priority: 'normal',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'audit_01',
    messId: DEMO_MESS_ID,
    action: 'Mess Created',
    userId: 'user_mahim_admin',
    userName: 'Mahim',
    target: 'Padma Student Mess',
    newValue: 'Invite Code: MAHIM2026',
    timestamp: Date.now() - 30 * 86400000,
  },
  {
    id: 'audit_02',
    messId: DEMO_MESS_ID,
    action: 'Expense Added',
    userId: 'user_rahim_member',
    userName: 'Rahim',
    target: 'Bazar: Fresh vegetables, eggs',
    newValue: '৳2,500',
    timestamp: Date.now() - 2 * 86400000,
  },
  {
    id: 'audit_03',
    messId: DEMO_MESS_ID,
    action: 'Payment Added',
    userId: 'user_karim_member',
    userName: 'Karim',
    target: 'Payment deposit',
    newValue: '৳2,500 via Nagad',
    timestamp: Date.now() - 86400000,
  },
];

const todayIso = new Date().toISOString().split('T')[0];
const tomorrowDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];

export const INITIAL_DAILY_MENUS: Record<string, DailyMenu> = {
  [todayIso]: {
    date: todayIso,
    breakfast: 'Egg Omelette / Paratha / Khichuri',
    lunch: 'Desi Chicken Curry, Masoor Dal, Alu Bharta & Steamed Rice',
    dinner: 'Rui Fish Jhol, Mixed Seasonal Vegetables & Steamed Rice',
    cookNotes: 'Lunch starts at 1:30 PM. Please turn off meals before cutoff times if you will not eat.',
    servingTimes: {
      breakfast: '08:30 AM',
      lunch: '01:30 PM',
      dinner: '09:00 PM',
    },
    updatedAt: Date.now(),
  },
  [tomorrowDate]: {
    date: tomorrowDate,
    breakfast: 'Roti / Dal & Dim',
    lunch: 'Beef Curry, Bhuna Khichuri & Begun Bhaja',
    dinner: 'Egg Curry, Dal & Rice',
    cookNotes: 'Friday Special Bhuna Khichuri & Beef for lunch.',
    servingTimes: {
      breakfast: '09:00 AM',
      lunch: '02:00 PM',
      dinner: '09:30 PM',
    },
    updatedAt: Date.now(),
  }
};

export const INITIAL_BAZAAR_DUTIES: Record<string, BazaarDutyItem> = {
  [todayIso]: {
    date: todayIso,
    assignedMemberIds: ['user_rahim_member', 'user_tanvir_member'],
    assignedNames: ['Rahim', 'Tanvir'],
    estimatedBudget: 2200,
    notes: 'Buy 2kg broiler chicken, 1kg dal, potatoes, green chilies and cooking oil.',
    isCompleted: false,
  },
  [tomorrowDate]: {
    date: tomorrowDate,
    assignedMemberIds: ['user_shakib_member'],
    assignedNames: ['Shakib'],
    estimatedBudget: 3500,
    notes: 'Friday bazaar: 2kg fresh beef, aromatic rice, spices and salad.',
    isCompleted: false,
  }
};
