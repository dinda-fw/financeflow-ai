export type TransactionCategory = 'Needs' | 'Wants' | 'Savings';

export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  category: TransactionCategory | string;
  date: string;
  item_summary?: string;
  ai_advice?: string;
  accountId?: string;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  paid: boolean;
  dueDate?: string;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  type: 'Bank' | 'Wallet' | 'Savings' | 'Credit';
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}

export interface CategoryBudget {
  id: string;
  name: string;
  limit: number;
  spent: number; // transient, calculated
}

export interface AppState {
  isAuthenticated: boolean;
  hasOnboardedBank: boolean;
  income: number;
  transactions: Transaction[];
  bills: Bill[];
  accounts: Account[];
  goals: Goal[];
  budgets: CategoryBudget[];
  panicMode: boolean;
}
