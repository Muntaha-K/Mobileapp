import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import {
  accounts as seedAccounts,
  beneficiaries as seedBeneficiaries,
  billers as seedBillers,
  cards as seedCards,
  transactions as seedTransactions,
  user,
} from '@/data/mock';
import type {
  Account,
  Beneficiary,
  Biller,
  Card,
  Transaction,
} from '@/data/types';

let idCounter = 1000;
const nextId = (prefix: string) => `${prefix}_${++idCounter}`;

interface TransferInput {
  fromAccountId: string;
  toName: string;
  toIban: string;
  amount: number;
  note?: string;
  category?: Transaction['category'];
}

interface AppState {
  // auth
  isAuthenticated: boolean;
  hasOnboarded: boolean;
  login: (passcode: string) => boolean;
  loginBiometric: () => void;
  logout: () => void;
  completeOnboarding: () => void;

  // data
  user: typeof user;
  accounts: Account[];
  cards: Card[];
  transactions: Transaction[];
  beneficiaries: Beneficiary[];
  billers: Biller[];

  // selectors
  totalBalance: number;
  accountById: (id: string) => Account | undefined;
  cardById: (id: string) => Card | undefined;
  transactionsForAccount: (id: string) => Transaction[];

  // actions
  makeTransfer: (input: TransferInput) => Transaction;
  payBill: (billerId: string, fromAccountId: string, amount: number) => Transaction;
  toggleCardFreeze: (cardId: string) => void;
  addBeneficiary: (b: Omit<Beneficiary, 'id'>) => Beneficiary;
  removeBeneficiary: (id: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setAuth] = useState(false);
  const [hasOnboarded, setOnboarded] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>(seedAccounts);
  const [cards, setCards] = useState<Card[]>(seedCards);
  const [transactions, setTransactions] = useState<Transaction[]>(seedTransactions);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(seedBeneficiaries);
  const [billers] = useState<Biller[]>(seedBillers);

  const login = useCallback((passcode: string) => {
    const ok = passcode === user.passcode;
    if (ok) setAuth(true);
    return ok;
  }, []);

  const loginBiometric = useCallback(() => setAuth(true), []);
  const logout = useCallback(() => setAuth(false), []);
  const completeOnboarding = useCallback(() => setOnboarded(true), []);

  const accountById = useCallback(
    (id: string) => accounts.find((a) => a.id === id),
    [accounts],
  );
  const cardById = useCallback((id: string) => cards.find((c) => c.id === id), [cards]);

  const transactionsForAccount = useCallback(
    (id: string) =>
      transactions
        .filter((t) => t.accountId === id)
        .sort((a, b) => +new Date(b.date) - +new Date(a.date)),
    [transactions],
  );

  const debitAccount = useCallback((accountId: string, amount: number) => {
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === accountId
          ? { ...a, balance: a.balance - amount, available: a.available - amount }
          : a,
      ),
    );
  }, []);

  const makeTransfer = useCallback(
    (input: TransferInput): Transaction => {
      const tx: Transaction = {
        id: nextId('t'),
        accountId: input.fromAccountId,
        title: `Transfer to ${input.toName}`,
        subtitle: input.note || 'Local transfer',
        category: input.category ?? 'transfer',
        amount: -Math.abs(input.amount),
        date: new Date().toISOString(),
      };
      debitAccount(input.fromAccountId, Math.abs(input.amount));
      setTransactions((prev) => [tx, ...prev]);
      return tx;
    },
    [debitAccount],
  );

  const payBill = useCallback(
    (billerId: string, fromAccountId: string, amount: number): Transaction => {
      const biller = billers.find((b) => b.id === billerId);
      const tx: Transaction = {
        id: nextId('t'),
        accountId: fromAccountId,
        title: `${biller?.name ?? 'Bill'} payment`,
        subtitle: 'Bill payment',
        category: 'utilities',
        amount: -Math.abs(amount),
        date: new Date().toISOString(),
      };
      debitAccount(fromAccountId, Math.abs(amount));
      setTransactions((prev) => [tx, ...prev]);
      return tx;
    },
    [billers, debitAccount],
  );

  const toggleCardFreeze = useCallback((cardId: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, frozen: !c.frozen } : c)),
    );
  }, []);

  const addBeneficiary = useCallback((b: Omit<Beneficiary, 'id'>): Beneficiary => {
    const created: Beneficiary = { ...b, id: nextId('b') };
    setBeneficiaries((prev) => [created, ...prev]);
    return created;
  }, []);

  const removeBeneficiary = useCallback((id: string) => {
    setBeneficiaries((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const totalBalance = useMemo(
    () => accounts.reduce((sum, a) => sum + a.balance, 0),
    [accounts],
  );

  const value = useMemo<AppState>(
    () => ({
      isAuthenticated,
      hasOnboarded,
      login,
      loginBiometric,
      logout,
      completeOnboarding,
      user,
      accounts,
      cards,
      transactions,
      beneficiaries,
      billers,
      totalBalance,
      accountById,
      cardById,
      transactionsForAccount,
      makeTransfer,
      payBill,
      toggleCardFreeze,
      addBeneficiary,
      removeBeneficiary,
    }),
    [
      isAuthenticated,
      hasOnboarded,
      login,
      loginBiometric,
      logout,
      completeOnboarding,
      accounts,
      cards,
      transactions,
      beneficiaries,
      billers,
      totalBalance,
      accountById,
      cardById,
      transactionsForAccount,
      makeTransfer,
      payBill,
      toggleCardFreeze,
      addBeneficiary,
      removeBeneficiary,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
}
