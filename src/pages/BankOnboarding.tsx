import { useState, useEffect, useRef, useMemo } from 'react';
import { useFinance } from '../hooks/useFinance';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Building2, Wallet, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';

export default function BankOnboarding() {
  const { completeOnboarding } = useFinance();
  const [syncing, setSyncing] = useState<string | null>(null);
  const [synced, setSynced] = useState<string[]>([]);

  const handleSync = (bankId: string) => {
    setSyncing(bankId);
    // Simulate API delay
    setTimeout(() => {
      setSyncing(null);
      setSynced((prev: string[]) => [...prev, bankId]);
    }, 1500);
  };

  const handleFinish = () => {
    completeOnboarding();
  };

  const institutions = [
    { id: 'bca', name: 'Bank BCA', type: 'Bank', icon: <Building2 className="w-5 h-5 text-blue-500" /> },
    { id: 'mandiri', name: 'Bank Mandiri', type: 'Bank', icon: <Building2 className="w-5 h-5 text-yellow-500" /> },
    { id: 'gopay', name: 'GoPay', type: 'E-Wallet', icon: <Wallet className="w-5 h-5 text-green-500" /> },
    { id: 'shopee', name: 'ShopeePay', type: 'E-Wallet', icon: <Wallet className="w-5 h-5 text-orange-500" /> },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-500">
        
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mb-4 border border-emerald-500/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Securely Link Your Accounts</h1>
          <p className="text-muted-foreground">FinanceFlow uses bank-level encryption to safely sync your transactions.</p>
        </div>

        <Card className="border-white/10">
          <CardHeader>
            <CardTitle className="text-lg">Select Institutions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {institutions.map(inst => (
              <div key={inst.id} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-secondary/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-background rounded-lg border border-border">
                    {inst.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{inst.name}</h3>
                    <p className="text-xs text-muted-foreground">{inst.type}</p>
                  </div>
                </div>
                
                {synced.includes(inst.id) ? (
                  <div className="flex items-center gap-2 text-success font-medium text-sm">
                    <CheckCircle2 className="w-4 h-4" /> Connected
                  </div>
                ) : (
                  <Button 
                    variant={syncing === inst.id ? "secondary" : "outline"}
                    size="sm" 
                    onClick={() => handleSync(inst.id)}
                    disabled={syncing !== null}
                    className="min-w-[80px]"
                  >
                    {syncing === inst.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Connect"}
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="mt-8">
          <Button 
            className="w-full h-12 text-lg font-bold shadow-lg" 
            onClick={handleFinish}
          >
            {synced.length > 0 ? "Continue to Dashboard" : "Skip for Now"}
          </Button>
        </div>
      </div>
    </div>
  );
}
