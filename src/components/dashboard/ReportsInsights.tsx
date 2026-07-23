import { useState, useEffect, useRef, useMemo } from 'react';
import { useFinance } from '../../hooks/useFinance';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatIDR, cn } from '../../lib/utils';
import { BrainCircuit, Download, FileText, Printer, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { generateFinancialInsights } from '../../lib/gemini';

export default function ReportsInsights() {
  const { state, spentMacro, totalNetWorth } = useFinance();
  const [reportType, setReportType] = useState<'Weekly' | 'Monthly'>('Monthly');
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY_PART1 && import.meta.env.VITE_GEMINI_API_KEY_PART2) 
    ? import.meta.env.VITE_GEMINI_API_KEY_PART1 + import.meta.env.VITE_GEMINI_API_KEY_PART2 
    : localStorage.getItem('gemini_api_key');

  useEffect(() => {
    if (apiKey && state.transactions.length > 0) {
      setLoadingInsights(true);
      generateFinancialInsights(apiKey, state.transactions, state.budgets, state.goals)
        .then(res => setAiInsights(res))
        .catch(err => console.error(err))
        .finally(() => setLoadingInsights(false));
    }
  }, [apiKey, state.transactions, state.budgets, state.goals]);
  
  // Data for the Bar Chart
  const categoryData = state.budgets.map(b => ({
    name: b.name,
    Spent: b.spent,
    Limit: b.limit,
  })).concat([
    { name: 'Needs (Misc)', Spent: spentMacro.Needs - state.budgets.filter(b=>['Food & Groceries', 'Transport'].includes(b.name)).reduce((a,b)=>a+b.spent,0), Limit: state.income * 0.5 },
    { name: 'Wants (Misc)', Spent: spentMacro.Wants - state.budgets.filter(b=>['Entertainment', 'Subscriptions'].includes(b.name)).reduce((a,b)=>a+b.spent,0), Limit: state.income * 0.3 },
  ]);

  const downloadCSV = () => {
    let csv = 'ID,Merchant,Amount,Category,Date,AccountID\n';
    state.transactions.forEach(tx => {
      csv += `${tx.id},"${tx.merchant}",${tx.amount},"${tx.category}","${tx.date}",${tx.accountId || ''}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FinanceFlow_${reportType}_Transactions_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 print:space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Laporan & Insight AI</h2>
          <p className="text-muted-foreground mt-1 text-sm">Analisis perilaku mendalam dan ekspor laporan.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-secondary/30 p-1 rounded-lg border border-border">
            <button 
              className={cn("px-4 py-1.5 text-sm rounded-md font-medium transition-colors", reportType === 'Weekly' ? "bg-background shadow text-foreground" : "text-muted-foreground")}
              onClick={() => setReportType('Weekly')}
            >
              Laporan Mingguan
            </button>
            <button 
              className={cn("px-4 py-1.5 text-sm rounded-md font-medium transition-colors", reportType === 'Monthly' ? "bg-background shadow text-foreground" : "text-muted-foreground")}
              onClick={() => setReportType('Monthly')}
            >
              Laporan Bulanan
            </button>
          </div>
          <Button variant="outline" size="sm" onClick={downloadCSV} className="gap-2">
            <Download className="w-4 h-4" /> CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
            <Printer className="w-4 h-4" /> PDF
          </Button>
        </div>
      </div>

      <div className="hidden print:block mb-8 text-center text-black">
        <h1 className="text-3xl font-bold">Laporan FinanceFlow AI</h1>
        <p className="text-sm mt-2">Dibuat pada {format(new Date(), 'dd MMMM yyyy')}</p>
        <div className="mt-4 flex justify-between border-b pb-4">
          <div>
            <strong>Total Kekayaan:</strong> {formatIDR(totalNetWorth)}
          </div>
          <div>
            <strong>Periode:</strong> {reportType === 'Monthly' ? 'Bulanan' : 'Mingguan'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Deep AI Advisor */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="h-full bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-primary" />
                Penasihat Keuangan AI
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {loadingInsights ? (
                <div className="space-y-4 py-4 animate-pulse">
                  <div className="h-24 bg-card rounded-xl border border-border"></div>
                  <div className="h-24 bg-card rounded-xl border border-border"></div>
                  <div className="h-24 bg-card rounded-xl border border-border"></div>
                  <p className="text-center text-xs text-muted-foreground mt-2">Gemini AI is analyzing your cashflow...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
                    <h4 className="font-semibold text-sm mb-2 text-warning flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4" /> Peringatan Kebocoran Dana
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {aiInsights?.money_leak || "Tidak ada kebocoran berarti bulan ini. Pertahankan!"}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
                    <h4 className="font-semibold text-sm mb-2 text-primary flex items-center gap-2">
                      <BrainCircuit className="w-4 h-4" /> Saran Praktis
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {aiInsights?.actionable_advice || "Tingkatkan porsi tabunganmu jika memungkinkan."}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
                    <h4 className="font-semibold text-sm mb-2 text-emerald-500 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Tagihan Mendatang
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {aiInsights?.upcoming_bills || "Semua tagihan rutin tampaknya aman terkendali."}
                    </p>
                  </div>
                </div>
              )}

            </CardContent>
          </Card>
        </div>

        {/* Bar Chart Analytics */}
        <div className="lg:col-span-8">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Pengeluaran vs Limit per Kategori</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="var(--color-muted-foreground)" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      angle={-45} 
                      textAnchor="end" 
                    />
                    <YAxis 
                      stroke="var(--color-muted-foreground)" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `Rp ${value / 1000000}M`} 
                    />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '8px' }}
                      itemStyle={{ color: 'var(--color-foreground)' }}
                      formatter={(value: any) => formatIDR(value)}
                      cursor={{ fill: 'rgb(255 255 255 / 0.05)' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="Spent" fill="var(--color-primary)" radius={[4, 4, 0, 0]} maxBarSize={50} />
                    <Bar dataKey="Limit" fill="var(--color-muted)" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
