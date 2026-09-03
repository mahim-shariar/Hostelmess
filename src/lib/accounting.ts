import { MealRecord, ExpenseRecord, PaymentRecord, Member } from '../types';

export interface MemberCalculationResult {
  memberId: string;
  memberName: string;
  personalMeals: number;
  guestMeals: number;
  totalMeals: number;
  mealCost: number;
  otherCost: number;
  totalBill: number;
  paid: number;
  previousBalance: number;
  netBalance: number; // positive = advance, negative = due
  isAdvance: boolean;
  balanceFormatted: string; // e.g. "৳450 Advance" or "৳300 Due"
}

export interface MonthlyTotalsResult {
  totalMembers: number;
  totalMeals: number;
  totalFoodExpense: number;
  totalOtherExpense: number;
  totalExpense: number;
  mealRate: number;
  totalPayments: number;
  totalDue: number;
  totalAdvance: number;
  memberResults: Record<string, MemberCalculationResult>;
}

/**
 * Calculates accurate, crash-proof hostel/mess accounts
 */
export function calculateMonthAccounts(
  members: Member[],
  meals: MealRecord[],
  expenses: ExpenseRecord[],
  payments: PaymentRecord[],
  currency: string = '৳'
): MonthlyTotalsResult {
  // 1. Calculate Meals per member
  const memberMealMap: Record<string, { personal: number; guest: number; total: number }> = {};
  
  members.forEach(m => {
    memberMealMap[m.id] = { personal: 0, guest: 0, total: 0 };
  });

  let totalMeals = 0;
  meals.forEach(m => {
    const personal = (m.breakfast || 0) + (m.lunch || 0) + (m.dinner || 0);
    const guest = (m.guestLunch || 0) + (m.guestDinner || 0);
    const sum = personal + guest;
    
    if (!memberMealMap[m.memberId]) {
      memberMealMap[m.memberId] = { personal: 0, guest: 0, total: 0 };
    }
    
    memberMealMap[m.memberId].personal += personal;
    memberMealMap[m.memberId].guest += guest;
    memberMealMap[m.memberId].total += sum;
    totalMeals += sum;
  });

  // 2. Expenses (Only approved ones)
  const approvedExpenses = expenses.filter(e => e.status === 'approved');
  let totalFoodExpense = 0;
  let totalOtherExpense = 0;

  approvedExpenses.forEach(e => {
    if (e.type === 'food') {
      totalFoodExpense += Number(e.amount) || 0;
    } else {
      totalOtherExpense += Number(e.amount) || 0;
    }
  });

  const totalExpense = totalFoodExpense + totalOtherExpense;

  // 3. Meal Rate: Total Food Expenses ÷ Total Meals
  // Avoid division by zero!
  const mealRate = totalMeals > 0 ? totalFoodExpense / totalMeals : 0;

  // 4. Other costs per active member
  const activeMembers = members.filter(m => m.status === 'active');
  const activeCount = activeMembers.length > 0 ? activeMembers.length : (members.length || 1);
  const otherCostPerMember = totalOtherExpense / activeCount;

  // 5. Payments per member
  const memberPaymentMap: Record<string, number> = {};
  members.forEach(m => {
    memberPaymentMap[m.id] = 0;
  });

  let totalPayments = 0;
  payments.forEach(p => {
    const amt = Number(p.amount) || 0;
    memberPaymentMap[p.memberId] = (memberPaymentMap[p.memberId] || 0) + amt;
    totalPayments += amt;
  });

  // 6. Member by member calculation
  const memberResults: Record<string, MemberCalculationResult> = {};
  let totalDue = 0;
  let totalAdvance = 0;

  members.forEach(m => {
    const mealData = memberMealMap[m.id] || { personal: 0, guest: 0, total: 0 };
    const mealCost = Math.round(mealData.total * mealRate);
    // Other cost applies to active members, or 0 if disabled
    const otherCost = m.status === 'active' ? Math.round(otherCostPerMember) : 0;
    const totalBill = mealCost + otherCost;
    const paid = memberPaymentMap[m.id] || 0;
    const prevBal = m.previousBalance || 0;

    // Net balance: (Paid + Previous Balance) - Total Bill
    // If positive: Advance (extra money paid)
    // If negative: Due (money owed)
    const netBalance = (paid + prevBal) - totalBill;
    const isAdvance = netBalance >= 0;
    const absDiff = Math.abs(netBalance);

    if (netBalance < 0) {
      totalDue += absDiff;
    } else {
      totalAdvance += absDiff;
    }

    memberResults[m.id] = {
      memberId: m.id,
      memberName: m.name,
      personalMeals: mealData.personal,
      guestMeals: mealData.guest,
      totalMeals: mealData.total,
      mealCost,
      otherCost,
      totalBill,
      paid,
      previousBalance: prevBal,
      netBalance,
      isAdvance,
      balanceFormatted: isAdvance 
        ? `${currency}${absDiff.toLocaleString()} Advance` 
        : `${currency}${absDiff.toLocaleString()} Due`,
    };
  });

  return {
    totalMembers: members.length,
    totalMeals,
    totalFoodExpense,
    totalOtherExpense,
    totalExpense,
    mealRate: Math.round(mealRate * 100) / 100, // 2 decimals
    totalPayments,
    totalDue,
    totalAdvance,
    memberResults,
  };
}

/**
 * Format balance without negative sign
 */
export function formatBalanceDisplay(amount: number, currency: string = '৳'): { text: string; isAdvance: boolean; isZero: boolean } {
  if (Math.abs(amount) < 0.01) {
    return { text: `${currency}0 Balanced`, isAdvance: true, isZero: true };
  }
  if (amount > 0) {
    return { text: `${currency}${Math.round(amount).toLocaleString()} Advance`, isAdvance: true, isZero: false };
  }
  return { text: `${currency}${Math.round(Math.abs(amount)).toLocaleString()} Due`, isAdvance: false, isZero: false };
}

/**
 * Get current month string YYYY-MM
 */
export function getCurrentMonthId(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Format month display e.g. "September 2026"
 */
export function formatMonthDisplay(monthId: string, lang: 'en' | 'bn' = 'en'): string {
  const [year, monthStr] = monthId.split('-');
  const monthIdx = parseInt(monthStr, 10) - 1;
  
  const enMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const bnMonths = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];

  if (lang === 'bn') {
    return `${bnMonths[monthIdx] || ''} ${year}`;
  }
  return `${enMonths[monthIdx] || ''} ${year}`;
}
