import { useState, useEffect, useRef, useMemo } from 'react';
import { useFinance } from '../../hooks/useFinance';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { parseReceiptWithAI } from '../../lib/gemini';
import { formatIDR, cn } from '../../lib/utils';
import { UploadCloud, Receipt, Plus, CheckCircle2, Circle, AlertOctagon, ShieldAlert } from 'lucide-react';

export default function AIReceipts() {
  const { state, toggleBill, addBill, addTransaction, mapToMacroCategory, limits, spentMacro, togglePanicMode } = useFinance();
  
  const [aiKey, setAiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('gemini_api_key') || '');
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [manualTxModal, setManualTxModal] = useState(false);
  const [txForm, setTxForm] = useState({ merchant: '', amount: '', category: 'Food & Groceries' });
  const [overspendAlert, setOverspendAlert] = useState({ isOpen: false, msg: '' });

  const handleAiKeyBlur = () => {
    localStorage.setItem('gemini_api_key', aiKey);
  };

  const handleAddTx = (tx: { merchant: string; amount: number; category: string; ai_advice?: string }) => {
    const macroCat = mapToMacroCategory(tx.category);
    const limit = limits[macroCat as keyof typeof limits];
    const previousSpent = spentMacro[macroCat as keyof typeof spentMacro];

    addTransaction({
      merchant: tx.merchant,
      amount: tx.amount,
      category: tx.category,
      ai_advice: tx.ai_advice,
      date: new Date().toISOString(),
      accountId: 'acc_bca' // Default deductor
    });

    if (previousSpent + tx.amount > limit) {
      setOverspendAlert({
        isOpen: true,
        msg: tx.ai_advice || `Warning: Your macro budget for '${macroCat}' has exceeded 100%! Consider reducing non-essential expenses.`
      });
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txForm.merchant || !txForm.amount) return;
    handleAddTx({
      merchant: txForm.merchant,
      amount: Number(txForm.amount),
      category: txForm.category
    });
    setManualTxModal(false);
    setTxForm({ merchant: '', amount: '', category: 'Food & Groceries' });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!aiKey) {
      alert("Please enter a Gemini API Key first!");
      return;
    }

    setIsScanning(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        try {
          const result = await parseReceiptWithAI(aiKey, base64);
          handleAddTx({
            merchant: result.merchant || 'Unknown Merchant',
            amount: Number(result.amount) || 0,
            category: result.category || 'Wants',
            ai_advice: result.ai_advice
          });
        } catch (err) {
          alert("Failed to parse receipt with AI.");
        } finally {
          setIsScanning(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Receipts & Bills</h2>
          <p className="text-muted-foreground mt-1 text-sm">Scan receipts or manage recurring bills.</p>
        </div>
      </div>

      {!aiKey && (
        <Card className="border-warning ring-1 ring-warning/50 bg-warning/5">
          <CardHeader className="py-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <AlertOctagon className="text-warning shrink-0" />
                <p className="text-sm font-medium text-warning-foreground/80">Gemini API Key missing. Required for Vision Scanner.</p>
              </div>
              <Input 
                type="password" 
                placeholder="AIzaSy..." 
                className="max-w-[250px] bg-background"
                value={aiKey}
                onChange={(e) => setAiKey(e.target.value)}
                onBlur={handleAiKeyBlur}
              />
            </div>
          </CardHeader>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* AI Scanner */}
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" />
              AI Receipt Scanner
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4">
            
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileUpload} 
            />

            <div 
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all hover:bg-secondary/30 hover:border-primary/50 min-h-[250px]",
                isScanning ? "opacity-50 pointer-events-none animate-pulse" : ""
              )}
            >
              <UploadCloud className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="font-medium text-lg">{isScanning ? "Analyzing with Gemini..." : "Click or Drag Receipt Here"}</p>
              <p className="text-sm text-muted-foreground mt-2">JPEG, PNG supported. AI extracts merchant, amount, and gives coaching.</p>
            </div>

            <div className="flex items-center gap-4 py-2">
              <div className="h-px bg-border flex-1" />
              <span className="text-xs text-muted-foreground font-medium uppercase">OR</span>
              <div className="h-px bg-border flex-1" />
            </div>

            <Button variant="secondary" className="w-full h-12" onClick={() => setManualTxModal(true)}>
              <Plus className="w-5 h-5 mr-2" /> Manual Input
            </Button>
          </CardContent>
        </Card>

        {/* Bill Checklist */}
        <Card className="h-full border-white/5 bg-secondary/5">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Monthly Bills Checklist</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => {
              const name = prompt("Bill Name?");
              const amt = prompt("Amount (Rp)?");
              if (name && amt) addBill(name, Number(amt));
            }}>
              <Plus className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {state.bills.map(bill => (
                <div 
                  key={bill.id} 
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border border-white/5 transition-all cursor-pointer hover:border-white/10",
                    bill.paid ? "bg-background opacity-60" : "bg-card shadow-sm"
                  )} 
                  onClick={() => toggleBill(bill.id)}
                >
                  <div className="flex items-center gap-4">
                    {bill.paid ? <CheckCircle2 className="w-6 h-6 text-success shrink-0" /> : <Circle className="w-6 h-6 text-muted-foreground shrink-0" />}
                    <div>
                      <span className={cn("font-semibold block", bill.paid && "line-through text-muted-foreground")}>{bill.name}</span>
                      <span className="text-xs text-muted-foreground">Auto-deducts from BCA</span>
                    </div>
                  </div>
                  <span className="font-bold">{formatIDR(bill.amount)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>

      <Modal isOpen={manualTxModal} onClose={() => setManualTxModal(false)} title="Manual Expense">
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Merchant</label>
            <Input required value={txForm.merchant} onChange={e => setTxForm({...txForm, merchant: e.target.value})} placeholder="e.g. Tokopedia" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount (Rp)</label>
            <Input required type="number" value={txForm.amount} onChange={e => setTxForm({...txForm, amount: e.target.value})} placeholder="50000" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={txForm.category}
              onChange={e => setTxForm({...txForm, category: e.target.value})}
            >
              {state.budgets.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
              <option value="Needs">Needs (Uncategorized)</option>
              <option value="Wants">Wants (Uncategorized)</option>
            </select>
          </div>
          <Button type="submit" className="w-full mt-4">Save</Button>
        </form>
      </Modal>

      {/* Overspend Alert Modal */}
      <Modal 
        isOpen={overspendAlert.isOpen} 
        onClose={() => setOverspendAlert({ isOpen: false, msg: '' })} 
        title="⚠️ AI Active Guard Alert"
        variant="destructive"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-destructive/10 rounded-xl border border-destructive/20">
            <ShieldAlert className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
            <p className="text-destructive-foreground/90 font-medium leading-relaxed">
              {overspendAlert.msg}
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setOverspendAlert({ isOpen: false, msg: '' })}>
              I Understand
            </Button>
            <Button variant="destructive" onClick={() => {
              togglePanicMode();
              setOverspendAlert({ isOpen: false, msg: '' });
            }}>
              Enable Panic Mode
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
