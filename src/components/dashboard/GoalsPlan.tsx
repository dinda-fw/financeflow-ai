import { useState, useEffect, useRef, useMemo } from 'react';
import { useFinance } from '../../hooks/useFinance';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Progress } from '../ui/Progress';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { formatIDR } from '../../lib/utils';
import { Target, Plus, Calendar as CalIcon, TrendingUp, Pencil, Check } from 'lucide-react';
import { format } from 'date-fns';

export default function GoalsPlan() {
  const { state, addGoal, updateGoalAmount } = useFinance();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', targetAmount: '', deadline: '' });
  
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [editCurrent, setEditCurrent] = useState<string>('');
  const [editTarget, setEditTarget] = useState<string>('');

  const handleEditGoal = (id: string, currentAmount: number, targetAmount: number) => {
    setEditingGoal(id);
    setEditCurrent(currentAmount.toString());
    setEditTarget(targetAmount.toString());
  };

  const handleSaveGoal = (id: string) => {
    const cur = Number(editCurrent);
    const tgt = Number(editTarget);
    if (!isNaN(cur) && !isNaN(tgt)) updateGoalAmount(id, cur, tgt);
    setEditingGoal(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.targetAmount) return;
    
    addGoal({
      name: form.name,
      targetAmount: Number(form.targetAmount),
      currentAmount: 0,
      deadline: form.deadline ? new Date(form.deadline).toISOString() : undefined
    });
    setModalOpen(false);
    setForm({ name: '', targetAmount: '', deadline: '' });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Goals & Plan</h2>
          <p className="text-muted-foreground mt-1 text-sm">Set targets and let AI optimize your savings rate.</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> New Goal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {state.goals.map(goal => {
          const percent = Math.min(100, Math.max(0, (goal.currentAmount / goal.targetAmount) * 100));
          return (
            <Card key={goal.id} className="relative overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/20 rounded-xl text-primary">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{goal.name}</CardTitle>
                      {goal.deadline && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                          <CalIcon className="w-3.5 h-3.5" />
                          Target: {format(new Date(goal.deadline), 'MMMM yyyy')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-foreground">{Math.round(percent)}%</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  {editingGoal === goal.id ? (
                    <div className="flex flex-col gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs w-16">Current:</span>
                        <Input type="number" autoFocus value={editCurrent} onChange={(e) => setEditCurrent(e.target.value)} className="h-7 text-xs bg-background" onKeyDown={(e) => e.key === 'Enter' && handleSaveGoal(goal.id)} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs w-16">Target:</span>
                        <Input type="number" value={editTarget} onChange={(e) => setEditTarget(e.target.value)} className="h-7 text-xs bg-background" onKeyDown={(e) => e.key === 'Enter' && handleSaveGoal(goal.id)} />
                        <button onClick={() => handleSaveGoal(goal.id)} className="text-primary hover:text-primary/80 shrink-0">
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between text-sm mb-2 group/edit items-center">
                      <div>
                        <span className="font-medium">{formatIDR(goal.currentAmount)}</span>
                        <span className="text-muted-foreground ml-1">of {formatIDR(goal.targetAmount)}</span>
                      </div>
                      <button onClick={() => handleEditGoal(goal.id, goal.currentAmount, goal.targetAmount)} className="text-muted-foreground opacity-0 group-hover/edit:opacity-100 transition-opacity hover:text-primary">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  <Progress value={percent} className="h-3" />
                </div>
                
                <div className="p-3 bg-secondary/30 rounded-lg border border-border flex gap-3 items-start">
                  <TrendingUp className="w-4 h-4 text-emerald-500 mt-0.5" />
                  <div className="text-xs text-muted-foreground">
                    <strong className="text-foreground">AI Suggestion:</strong> Save {formatIDR(goal.targetAmount / 6)} per month to hit your target early.
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Financial Goal">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Goal Name</label>
            <Input required placeholder="e.g. Dana Darurat" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Target Amount (Rp)</label>
            <Input required type="number" placeholder="10000000" value={form.targetAmount} onChange={e => setForm({...form, targetAmount: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Target Deadline (Optional)</label>
            <Input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} />
          </div>
          <Button type="submit" className="w-full">Create Goal</Button>
        </form>
      </Modal>

    </div>
  );
}
