import { useState, useEffect, useRef, useMemo } from 'react';
import { useFinance } from '../../hooks/useFinance';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Progress } from '../ui/Progress';
import { Input } from '../ui/Input';
import { formatIDR, cn } from '../../lib/utils';
import { PieChart, AlertCircle, Pencil, Check } from 'lucide-react';

export default function Budgeting() {
  const { state, setIncome, updateBudgetLimit, limits, spentMacro } = useFinance();
  const [editingBudget, setEditingBudget] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const handleEditBudget = (id: string, currentLimit: number) => {
    setEditingBudget(id);
    setEditValue(currentLimit.toString());
  };

  const handleSaveBudget = (id: string) => {
    const val = Number(editValue);
    if (!isNaN(val)) updateBudgetLimit(id, val);
    setEditingBudget(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Budgeting & Allocations</h2>
          <p className="text-muted-foreground mt-1 text-sm">Manage macro limits and granular category budgets.</p>
        </div>
        <div className="flex items-center gap-3 bg-secondary/20 p-2 rounded-xl border border-white/5">
          <span className="text-sm font-medium text-muted-foreground pl-2">Monthly Income:</span>
          <Input 
            type="number" 
            value={state.income} 
            onChange={e => setIncome(Number(e.target.value))}
            className="w-40 font-bold bg-background"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* 50/30/20 Macro */}
        <div className="md:col-span-5 space-y-6">
          <Card className="h-full">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-primary" />
                Macro Allocation (50/30/20)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"/>Needs (50%)</span>
                  <span className="text-muted-foreground font-medium">
                    {formatIDR(spentMacro.Needs)} <span className="text-xs">/ {formatIDR(limits.Needs)}</span>
                  </span>
                </div>
                <Progress 
                  value={(spentMacro.Needs / limits.Needs) * 100} 
                  indicatorColor={spentMacro.Needs > limits.Needs ? "bg-destructive" : "bg-blue-500"} 
                  className="h-3"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500"/>Wants (30%)</span>
                  <span className="text-muted-foreground font-medium">
                    {formatIDR(spentMacro.Wants)} <span className="text-xs">/ {formatIDR(limits.Wants)}</span>
                  </span>
                </div>
                <Progress 
                  value={(spentMacro.Wants / (limits.Wants || 1)) * 100} 
                  indicatorColor={spentMacro.Wants > limits.Wants ? "bg-destructive" : "bg-purple-500"} 
                  className="h-3"
                />
                {state.panicMode && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Wants budget is 0 in Panic Mode!</p>}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"/>Savings (20%)</span>
                  <span className="text-muted-foreground font-medium">
                    {formatIDR(spentMacro.Savings)} <span className="text-xs">/ {formatIDR(limits.Savings)}</span>
                  </span>
                </div>
                <Progress 
                  value={(spentMacro.Savings / limits.Savings) * 100} 
                  indicatorColor="bg-emerald-500" 
                  className="h-3"
                />
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Granular Categories */}
        <div className="md:col-span-7">
          <Card className="h-full border-white/5 bg-secondary/5">
            <CardHeader>
              <CardTitle>Granular Category Budgets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {state.budgets.map(budget => {
                  const pct = Math.min(100, (budget.spent / budget.limit) * 100);
                  const isDanger = pct > 90;
                  const isWarning = pct > 75 && !isDanger;
                  
                  return (
                    <div key={budget.id} className="space-y-2">
                      <div className="flex justify-between text-sm items-end">
                        <span className="font-semibold">{budget.name}</span>
                        <div className="text-right flex items-center gap-2">
                          <span className={cn(
                            "font-bold",
                            isDanger ? "text-destructive" : isWarning ? "text-warning" : "text-foreground"
                          )}>
                            {formatIDR(budget.spent)}
                          </span>
                          
                          {editingBudget === budget.id ? (
                            <div className="flex items-center gap-1 ml-1">
                              <span className="text-muted-foreground text-xs">of</span>
                              <Input
                                type="number"
                                autoFocus
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="h-6 w-24 text-xs px-1 py-0 bg-background"
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveBudget(budget.id)}
                              />
                              <button onClick={() => handleSaveBudget(budget.id)} className="text-primary hover:text-primary/80">
                                <Check className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 ml-1 group">
                              <span className="text-muted-foreground text-xs">of {formatIDR(budget.limit)}</span>
                              <button onClick={() => handleEditBudget(budget.id, budget.limit)} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary">
                                <Pencil className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <Progress 
                        value={pct} 
                        indicatorColor={isDanger ? "bg-destructive" : isWarning ? "bg-warning" : "bg-primary"} 
                        className="h-2 bg-background"
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
