import { useState, useEffect, useRef, useMemo } from 'react';
import { useFinance } from '../../hooks/useFinance';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { formatIDR } from '../../lib/utils';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Wallet, PiggyBank, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

export default function DashboardOverview() {
  const { state, totalNetWorth, spentMacro } = useFinance();

  // Mock data for the chart based on the recent transactions to simulate a trend
  const chartData = useMemo(() => {
    // Generate a quick mock trend
    const data = [];
    let base = totalNetWorth - 1500000;
    for(let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStr = date.toLocaleDateString('en-US', { weekday: 'short' });
      base += Math.random() * 500000 - 100000;
      data.push({
        name: dayStr,
        Balance: base,
      });
    }
    return data;
  }, [totalNetWorth]);

  const bankBalance = state.accounts.filter(a => a.type === 'Bank').reduce((a, b) => a + b.balance, 0);
  const walletBalance = state.accounts.filter(a => a.type === 'Wallet').reduce((a, b) => a + b.balance, 0);
  const savingsBalance = state.accounts.filter(a => a.type === 'Savings').reduce((a, b) => a + b.balance, 0);
  const totalSpent = spentMacro.Needs + spentMacro.Wants + spentMacro.Savings;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
      </div>
      
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Net Worth</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatIDR(totalNetWorth)}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center text-success">
              <ArrowUpRight className="w-3 h-3 mr-1" /> +2.5% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bank Accounts</CardTitle>
            <Wallet className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatIDR(bankBalance)}</div>
            <p className="text-xs text-muted-foreground mt-1 text-blue-500/80">
              Liquid Cash
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">E-Wallets</CardTitle>
            <Wallet className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatIDR(walletBalance)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              GoPay, ShopeePay
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings & Goals</CardTitle>
            <PiggyBank className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatIDR(savingsBalance)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Emergency & Targets
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        
        {/* Main Chart */}
        <Card className="col-span-1 lg:col-span-5">
          <CardHeader>
            <CardTitle>Net Worth Trend (7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(217.2, 91.2%, 59.8%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(217.2, 91.2%, 59.8%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Rp ${value / 1000000}M`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--color-foreground)' }}
                    formatter={(value: any) => [formatIDR(value), "Balance"]}
                  />
                  <Area type="monotone" dataKey="Balance" stroke="hsl(217.2, 91.2%, 59.8%)" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Summary */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>This Month</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Income</span>
                <span className="font-semibold text-success">{formatIDR(state.income)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Expenses</span>
                <span className="font-semibold text-destructive">{formatIDR(totalSpent)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <ArrowDownRight className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Recent Spending</p>
                  <p className="text-xs text-muted-foreground">{state.transactions.length} transactions</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {state.transactions.slice(0, 4).map(tx => (
                  <div key={tx.id} className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium truncate max-w-[120px]">{tx.merchant}</p>
                      <p className="text-xs text-muted-foreground">{tx.category}</p>
                    </div>
                    <span className="text-sm font-semibold">{formatIDR(tx.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
