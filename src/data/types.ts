/** Domain types for the anb simulation app. */

export type AccountType = 'current' | 'savings' | 'investment';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  iban: string;
  number: string;
  balance: number;
  available: number;
  currency: string;
}

export type CardType = 'visa' | 'mastercard' | 'mada';
export type CardKind = 'debit' | 'credit';

export interface Card {
  id: string;
  label: string;
  type: CardType;
  kind: CardKind;
  number: string; // full number, masked in UI
  holder: string;
  expiry: string; // MM/YY
  balance: number; // for credit: outstanding, for debit: linked account balance
  limit?: number; // credit limit
  linkedAccountId?: string;
  frozen: boolean;
  gradient: [string, string];
}

export type TxCategory =
  | 'transfer'
  | 'salary'
  | 'shopping'
  | 'dining'
  | 'groceries'
  | 'utilities'
  | 'fuel'
  | 'atm'
  | 'fees'
  | 'refund'
  | 'other';

export interface Transaction {
  id: string;
  accountId: string;
  title: string;
  subtitle?: string;
  category: TxCategory;
  amount: number; // negative = debit, positive = credit
  date: string; // ISO
  pending?: boolean;
}

export type BeneficiaryChannel = 'local' | 'international';

export interface Beneficiary {
  id: string;
  name: string;
  bank: string;
  iban: string;
  channel: BeneficiaryChannel;
  nickname?: string;
  favorite?: boolean;
}

export type BillerCategory =
  | 'telecom'
  | 'electricity'
  | 'water'
  | 'government'
  | 'internet'
  | 'traffic';

export interface Biller {
  id: string;
  name: string;
  category: BillerCategory;
  account: string;
  dueAmount?: number;
  dueDate?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string; // Ionicons name
  route: string;
}
