import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { AppState, Transaction, Goal } from '../types';

const INITIAL_INCOME = 3000000; // Increased for a more robust demo

function useFinanceLogic() {
  const [state, setState] = useState<AppState>(() => {
    // Clear old state specifically for this migration
    if (!localStorage.getItem('financeFlow_v3_migrated')) {
      localStorage.removeItem('financeFlowState');
      localStorage.setItem('financeFlow_v3_migrated', 'true');
    }

    const saved = localStorage.getItem('financeFlowState');
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Seed Data with 2026 dates
    const now = new Date();
    // Helper to generate a date a few days ago
    const daysAgo = (days: number) => {
      const d = new Date(now);
      d.setDate(d.getDate() - days);
      return d.toISOString();
    };

    return {
      isAuthenticated: false,
      hasOnboardedBank: false,
      income: INITIAL_INCOME,
      panicMode: false,
      accounts: [
        { id: 'acc_bca', name: 'Bank BCA', balance: 1200000, type: 'Bank' },
        { id: 'acc_gopay', name: 'GoPay', balance: 300000, type: 'Wallet' },
        { id: 'acc_savings', name: 'Emergency Savings Pool', balance: 1500000, type: 'Savings' },
      ],
      goals: [
        { id: 'g1', name: 'Laptop Gaming/Kerja', targetAmount: 5000000, currentAmount: 1500000, deadline: '2026-12-31T00:00:00.000Z' }
      ],
      budgets: [
        { id: 'cat_food', name: 'Food & Groceries', limit: 1200000, spent: 0 },
        { id: 'cat_trans', name: 'Transport', limit: 300000, spent: 0 },
        { id: 'cat_ent', name: 'Entertainment', limit: 400000, spent: 0 },
        { id: 'cat_subs', name: 'Subscriptions', limit: 100000, spent: 0 },
      ],
      transactions: [
        { id: 'tx1', merchant: 'Supermarket', amount: 150000, category: 'Food & Groceries', date: daysAgo(1), accountId: 'acc_bca' },
        { id: 'tx2', merchant: 'Gojek Ride', amount: 15000, category: 'Transport', date: daysAgo(2), accountId: 'acc_gopay' },
        { id: 'tx3', merchant: 'Netflix', amount: 59000, category: 'Subscriptions', date: daysAgo(3), accountId: 'acc_bca' },
        { id: 'tx4', merchant: 'Coffee Shop', amount: 25000, category: 'Food & Groceries', date: daysAgo(4), accountId: 'acc_gopay' },
        { id: 'tx5', merchant: 'Cinema XXI', amount: 50000, category: 'Entertainment', date: daysAgo(5), accountId: 'acc_bca' },
        { id: 'tx6', merchant: 'Steam Games', amount: 120000, category: 'Entertainment', date: daysAgo(10), accountId: 'acc_bca' },
      ],
      bills: [
        { id: 'b1', name: 'Kuota Internet', amount: 50000, paid: true },
        { id: 'b2', name: 'Uang Kos', amount: 800000, paid: false },
        { id: 'b3', name: 'Listrik/Air', amount: 150000, paid: false },
      ]
    };
  });

  useEffect(() => {
    localStorage.setItem('financeFlowState', JSON.stringify(state));
  }, [state]);

  const login = () => setState(s => ({ ...s, isAuthenticated: true }));
  const logout = () => setState(s => ({ ...s, isAuthenticated: false, hasOnboardedBank: false }));
  const completeOnboarding = () => setState(s => ({ ...s, hasOnboardedBank: true }));
  
  const setIncome = (income: number) => setState(s => ({ ...s, income }));
  const togglePanicMode = () => setState(s => ({ ...s, panicMode: !s.panicMode }));

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTx = { ...t, id: Math.random().toString(36).substring(7) };
    setState(s => {
      // Deduct from appropriate account if specified
      let newAccounts = [...s.accounts];
      if (t.accountId) {
        newAccounts = newAccounts.map(acc => 
          acc.id === t.accountId ? { ...acc, balance: acc.balance - t.amount } : acc
        );
      }
      return {
        ...s,
        accounts: newAccounts,
        transactions: [newTx, ...s.transactions]
      };
    });
    return newTx;
  };

  const deleteTransaction = (id: string) => {
    setState(s => ({
      ...s,
      transactions: s.transactions.filter(tx => tx.id !== id)
    }));
  };

  const toggleBill = (id: string) => {
    setState(s => {
      const bill = s.bills.find(b => b.id === id);
      if (!bill) return s;

      const newBills = s.bills.map(b => 
        b.id === id ? { ...b, paid: !b.paid } : b
      );

      let newTxs = [...s.transactions];
      
      if (!bill.paid) {
        newTxs = [{
          id: `tx_${id}`,
          merchant: `Bill: ${bill.name}`,
          amount: bill.amount,
          category: 'Needs',
          date: new Date().toISOString(),
          accountId: 'acc_bca' // default deduction
        }, ...newTxs];
      } else {
        newTxs = newTxs.filter(tx => tx.id !== `tx_${id}`);
      }

      return {
        ...s,
        bills: newBills,
        transactions: newTxs
      };
    });
  };

  const addBill = (name: string, amount: number) => {
    setState(s => ({
      ...s,
      bills: [...s.bills, { id: Math.random().toString(36).substring(7), name, amount, paid: false }]
    }));
  };

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    setState(s => ({
      ...s,
      goals: [...s.goals, { ...goal, id: Math.random().toString(36).substring(7) }]
    }));
  };

  const updateBudgetLimit = (id: string, limit: number) => {
    setState(s => ({
      ...s,
      budgets: s.budgets.map(b => b.id === id ? { ...b, limit } : b)
    }));
  };

  const updateAccountBalance = (id: string, balance: number) => {
    setState(s => ({
      ...s,
      accounts: s.accounts.map(a => a.id === id ? { ...a, balance } : a)
    }));
  };

  const updateGoalAmount = (id: string, currentAmount: number, targetAmount: number) => {
    setState(s => ({
      ...s,
      goals: s.goals.map(g => g.id === id ? { ...g, currentAmount, targetAmount } : g)
    }));
  };

  const resetData = () => {
    localStorage.removeItem('financeFlowState');
    window.location.reload();
  };

  // 50/30/20 Calculations
  const limits = {
    Needs: state.panicMode ? state.income * 0.8 : state.income * 0.5,
    Wants: state.panicMode ? 0 : state.income * 0.3,
    Savings: state.panicMode ? state.income * 0.2 : state.income * 0.2,
  };

  // Helper for categorizing transactions back to 50/30/20 loosely for legacy features
  const mapToMacroCategory = (cat: string) => {
    if (['Food & Groceries', 'Transport', 'Needs'].includes(cat)) return 'Needs';
    if (['Entertainment', 'Subscriptions', 'Wants'].includes(cat)) return 'Wants';
    return 'Savings';
  };

  const spentMacro = state.transactions.reduce((acc, tx) => {
    const macro = mapToMacroCategory(tx.category);
    acc[macro] = (acc[macro] || 0) + tx.amount;
    return acc;
  }, { Needs: 0, Wants: 0, Savings: 0 } as Record<string, number>);

  const healthScore = Math.max(0, Math.min(100, 
    100 - (spentMacro.Needs > limits.Needs ? 20 : 0) 
        - (spentMacro.Wants > limits.Wants ? 30 : 0)
        + (spentMacro.Savings >= limits.Savings ? 10 : 0)
        - (spentMacro.Wants === 0 && !state.panicMode ? -10 : 0)
  ));

  const totalNetWorth = state.accounts.reduce((acc, a) => acc + a.balance, 0);

  // Dynamic budget spent calc
  const populatedBudgets = state.budgets.map(b => {
    const spent = state.transactions
      .filter(tx => tx.category === b.name)
      .reduce((sum, tx) => sum + tx.amount, 0);
    return { ...b, spent };
  });

  return {
    state: { ...state, budgets: populatedBudgets },
    login,
    logout,
    completeOnboarding,
    setIncome,
    togglePanicMode,
    addTransaction,
    deleteTransaction,
    toggleBill,
    addBill,
    addGoal,
    resetData,
    updateBudgetLimit,
    updateAccountBalance,
    updateGoalAmount,
    limits,
    spentMacro,
    healthScore,
    totalNetWorth,
    mapToMacroCategory
  };
}

type FinanceContextType = ReturnType<typeof useFinanceLogic>;
const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const finance = useFinanceLogic();
  return <FinanceContext.Provider value={finance}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within FinanceProvider');
  return context;
}
