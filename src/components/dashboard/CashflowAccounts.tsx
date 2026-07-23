import { useState, useEffect, useRef, useMemo } from 'react';
import { useFinance } from '../../hooks/useFinance';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatIDR, cn } from '../../lib/utils';
import { WalletCards, Trash2, ArrowRightLeft, Calendar as CalIcon, Pencil, Check } from 'lucide-react';
import { format } from 'date-fns';
import { Input } from '../ui/Input';

export default function CashflowAccounts() {
  const { state, deleteTransaction, updateAccountBalance } = useFinance();
  const [period, setPeriod] = useState<'Weekly' | 'Monthly'>('Monthly');
  const [editingAccount, setEditingAccount] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const handleEditAccount = (id: string, balance: number) => {
    setEditingAccount(id);
    setEditValue(balance.toString());
  };

  const handleSaveAccount = (id: string) => {
    const val = Number(editValue);
    if (!isNaN(val)) updateAccountBalance(id, val);
    setEditingAccount(null);
  };

  // Filter transactions for the selected period (mock logic: assume they are already sorted and we just show everything as the 'period' since it's only July data)
  const displayTxs = state.transactions;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Cashflow & Accounts</h2>
        <div className="flex bg-secondary/30 p-1 rounded-lg border border-border">
          <button 
            className={cn("px-4 py-1.5 text-sm rounded-md font-medium transition-colors", period === 'Weekly' ? "bg-background shadow text-foreground" : "text-muted-foreground")}
            onClick={() => setPeriod('Weekly')}
          >
            Per Minggu
          </button>
          <button 
            className={cn("px-4 py-1.5 text-sm rounded-md font-medium transition-colors", period === 'Monthly' ? "bg-background shadow text-foreground" : "text-muted-foreground")}
            onClick={() => setPeriod('Monthly')}
          >
            Per Bulan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {state.accounts.map(acc => (
          <Card key={acc.id} className="relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <WalletCards className="w-16 h-16" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground font-medium">{acc.type}</CardTitle>
              <h3 className="text-xl font-bold">{acc.name}</h3>
            </CardHeader>
            <CardContent>
              {editingAccount === acc.id ? (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xl font-bold">Rp</span>
                  <Input
                    type="number"
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="h-8 w-32 font-bold bg-background text-lg"
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveAccount(acc.id)}
                  />
                  <button onClick={() => handleSaveAccount(acc.id)} className="text-primary hover:text-primary/80">
                    <Check className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-2 group/edit">
                  <div className="text-3xl font-extrabold tracking-tight">
                    {formatIDR(acc.balance)}
                  </div>
                  <button onClick={() => handleEditAccount(acc.id, acc.balance)} className="text-muted-foreground opacity-0 group-hover/edit:opacity-100 transition-opacity hover:text-primary">
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Transaction Ledger ({period})</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Detailed view of your income and expenses.</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowRightLeft className="w-4 h-4" /> Transfer
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {displayTxs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CalIcon className="w-8 h-8 mx-auto mb-2 opacity-20" />
                No transactions found for this period.
              </div>
            )}
            {displayTxs.map(tx => {
              const account = state.accounts.find(a => a.id === tx.accountId);
              
              return (
                <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-secondary/10 hover:bg-secondary/30 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex w-12 h-12 rounded-full bg-primary/10 items-center justify-center text-primary shrink-0">
                      <WalletCards className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-base">{tx.merchant}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary/50 text-muted-foreground">
                          {tx.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(tx.date), 'MMM dd, yyyy')}
                        </span>
                        {account && (
                          <span className="text-xs text-muted-foreground/80 hidden sm:inline">
                            • {account.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-lg text-foreground">
                      -{formatIDR(tx.amount)}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteTransaction(tx.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
