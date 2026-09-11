import type {
  Account,
  Beneficiary,
  Biller,
  Card,
  QuickAction,
  Transaction,
} from './types';

export const user = {
  name: 'Sara Al Otaibi',
  firstName: 'Sara',
  greetingAr: 'أهلاً',
  memberSince: '2019',
  avatarColor: '#0B7D6E',
  passcode: '1234', // simulation only
};

export const accounts: Account[] = [
  {
    id: 'acc_current',
    name: 'anb Current Account',
    type: 'current',
    iban: 'SA03 8000 0000 6080 1016 7519',
    number: '608010167519',
    balance: 48250.75,
    available: 47250.75,
    currency: 'SAR',
  },
  {
    id: 'acc_savings',
    name: 'anb Savings Account',
    type: 'savings',
    iban: 'SA44 8000 0000 6080 1099 2210',
    number: '608010992210',
    balance: 126400.0,
    available: 126400.0,
    currency: 'SAR',
  },
  {
    id: 'acc_invest',
    name: 'anb Tayseer Investment',
    type: 'investment',
    iban: 'SA71 8000 0000 6080 1044 7781',
    number: '608010447781',
    balance: 73920.4,
    available: 12000.0,
    currency: 'SAR',
  },
];

export const cards: Card[] = [
  {
    id: 'card_visa_signature',
    label: 'anb Visa Signature',
    type: 'visa',
    kind: 'credit',
    number: '4532 8891 2210 7788',
    holder: 'SARA AL OTAIBI',
    expiry: '08/28',
    balance: 3420.5, // outstanding
    limit: 40000,
    frozen: false,
    gradient: ['#1F86F0', '#0A3E9E'],
  },
  {
    id: 'card_mada_debit',
    label: 'anb mada Debit',
    type: 'mada',
    kind: 'debit',
    number: '5588 4412 9087 3311',
    holder: 'SARA AL OTAIBI',
    expiry: '02/27',
    balance: 48250.75,
    linkedAccountId: 'acc_current',
    frozen: false,
    gradient: ['#123E5A', '#0A2233'],
  },
  {
    id: 'card_world_mc',
    label: 'anb World Mastercard',
    type: 'mastercard',
    kind: 'credit',
    number: '5412 7788 1123 4590',
    holder: 'SARA AL OTAIBI',
    expiry: '11/26',
    balance: 12750.0,
    limit: 60000,
    frozen: true,
    gradient: ['#16324F', '#0A1B2E'],
  },
];

const now = new Date('2026-09-11T10:30:00');
function daysAgo(n: number, h = 12, m = 0): string {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

export const transactions: Transaction[] = [
  { id: 't1', accountId: 'acc_current', title: 'Jarir Bookstore', subtitle: 'Shopping', category: 'shopping', amount: -289.0, date: daysAgo(0, 9, 12) },
  { id: 't2', accountId: 'acc_current', title: 'Careem', subtitle: 'Transport', category: 'other', amount: -37.5, date: daysAgo(0, 8, 40) },
  { id: 't3', accountId: 'acc_current', title: 'STC Pay top-up', subtitle: 'Transfer', category: 'transfer', amount: -200.0, date: daysAgo(0, 8, 5), pending: true },
  { id: 't4', accountId: 'acc_current', title: 'Panda Hypermarket', subtitle: 'Groceries', category: 'groceries', amount: -412.35, date: daysAgo(1, 19, 22) },
  { id: 't5', accountId: 'acc_current', title: 'ADNOC Station', subtitle: 'Fuel', category: 'fuel', amount: -95.0, date: daysAgo(1, 17, 10) },
  { id: 't6', accountId: 'acc_current', title: 'Refund — Noon.com', subtitle: 'Refund', category: 'refund', amount: 149.0, date: daysAgo(2, 14, 0) },
  { id: 't7', accountId: 'acc_current', title: 'The Cheesecake Factory', subtitle: 'Dining', category: 'dining', amount: -218.75, date: daysAgo(2, 21, 30) },
  { id: 't8', accountId: 'acc_current', title: 'Monthly Salary', subtitle: 'Salary — Aramco', category: 'salary', amount: 22500.0, date: daysAgo(3, 0, 1) },
  { id: 't9', accountId: 'acc_current', title: 'SEC Electricity', subtitle: 'Utilities', category: 'utilities', amount: -344.2, date: daysAgo(4, 11, 0) },
  { id: 't10', accountId: 'acc_current', title: 'ATM Withdrawal', subtitle: 'anb ATM — Olaya', category: 'atm', amount: -1500.0, date: daysAgo(5, 13, 45) },
  { id: 't11', accountId: 'acc_current', title: 'Transfer to Ahmed', subtitle: 'Local transfer', category: 'transfer', amount: -750.0, date: daysAgo(6, 10, 15) },
  { id: 't12', accountId: 'acc_current', title: 'Amazon.sa', subtitle: 'Shopping', category: 'shopping', amount: -132.99, date: daysAgo(7, 16, 20) },

  { id: 's1', accountId: 'acc_savings', title: 'Standing order — Savings', subtitle: 'From Current', category: 'transfer', amount: 3000.0, date: daysAgo(3, 1, 0) },
  { id: 's2', accountId: 'acc_savings', title: 'Profit distribution', subtitle: 'Quarterly', category: 'salary', amount: 612.4, date: daysAgo(10, 0, 30) },

  { id: 'i1', accountId: 'acc_invest', title: 'Fund purchase — anb Tayseer', subtitle: 'Investment', category: 'transfer', amount: -5000.0, date: daysAgo(8, 12, 0) },
  { id: 'i2', accountId: 'acc_invest', title: 'Unit valuation gain', subtitle: 'Market', category: 'refund', amount: 920.4, date: daysAgo(1, 12, 0) },
];

export const beneficiaries: Beneficiary[] = [
  { id: 'b1', name: 'Ahmed Al Qahtani', bank: 'Al Rajhi Bank', iban: 'SA92 8000 0000 6080 1099 3321', channel: 'local', nickname: 'Ahmed', favorite: true },
  { id: 'b2', name: 'Noura Al Harbi', bank: 'anb', iban: 'SA03 8000 0000 6080 1055 1290', channel: 'local', nickname: 'Noura', favorite: true },
  { id: 'b3', name: 'Faisal Trading Est.', bank: 'Riyad Bank', iban: 'SA55 2000 0000 1234 5678 9012', channel: 'local' },
  { id: 'b4', name: 'James Carter', bank: 'HSBC UK', iban: 'GB29 NWBK 6016 1331 9268 19', channel: 'international' },
  { id: 'b5', name: 'Layla Mansour', bank: 'Emirates NBD', iban: 'AE07 0331 2345 6789 0123 456', channel: 'international' },
];

export const billers: Biller[] = [
  { id: 'bill_stc', name: 'STC', category: 'telecom', account: '0555••••21', dueAmount: 289.0, dueDate: '2026-09-18' },
  { id: 'bill_sec', name: 'Saudi Electricity', category: 'electricity', account: '3001••••88', dueAmount: 344.2, dueDate: '2026-09-20' },
  { id: 'bill_nwc', name: 'National Water Co.', category: 'water', account: '7788••••10' },
  { id: 'bill_mobily', name: 'Mobily Internet', category: 'internet', account: '0560••••55', dueAmount: 199.0, dueDate: '2026-09-25' },
  { id: 'bill_absher', name: 'Absher — Traffic Violations', category: 'traffic', account: '1098••••34', dueAmount: 500.0 },
  { id: 'bill_muqeem', name: 'Government Services', category: 'government', account: 'GOV••••77' },
];

export const quickActions: QuickAction[] = [
  { id: 'qa_transfer', label: 'Transfer', icon: 'swap-horizontal', route: '/transfer/new' },
  { id: 'qa_bills', label: 'Pay Bills', icon: 'receipt-outline', route: '/bills' },
  { id: 'qa_cards', label: 'Cards', icon: 'card-outline', route: '/(tabs)/cards' },
  { id: 'qa_beneficiaries', label: 'Beneficiaries', icon: 'people-outline', route: '/beneficiaries' },
];

export const insights = {
  spentThisMonth: 4682.34,
  budget: 8000,
  topCategory: 'Groceries',
  incomeThisMonth: 22500,
};
