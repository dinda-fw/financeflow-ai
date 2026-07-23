import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useFinance } from '../hooks/useFinance';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';
import { 
  LayoutDashboard, 
  WalletCards, 
  Target, 
  PieChart, 
  Receipt, 
  LineChart,
  LogOut,
  TrendingUp
} from 'lucide-react';

export default function DashboardLayout() {
  const { logout, healthScore } = useFinance();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: ".", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, end: true },
    { to: "cashflow", label: "Cashflow & Accounts", icon: <WalletCards className="w-5 h-5" /> },
    { to: "goals", label: "Goals & Plan", icon: <Target className="w-5 h-5" /> },
    { to: "budgeting", label: "Budgeting", icon: <PieChart className="w-5 h-5" /> },
    { to: "receipts", label: "Receipts & Bills", icon: <Receipt className="w-5 h-5" /> },
    { to: "reports", label: "Reports & Insights", icon: <LineChart className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/40 bg-card hidden md:flex flex-col">
        <div className="h-16 flex items-center gap-2 px-6 border-b border-border/40">
          <div className="bg-primary/20 p-1.5 rounded-lg text-primary">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            FinanceFlow
          </span>
        </div>
        
        <div className="p-4 flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="p-4 border-t border-border/40">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive gap-3" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Mobile Header & Topbar */}
        <header className="h-16 border-b border-border/40 flex items-center justify-between px-6 bg-card shrink-0">
          <div className="md:hidden flex items-center gap-2">
             {/* Mobile minimal branding */}
            <div className="bg-primary/20 p-1.5 rounded-lg text-primary">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="hidden md:block">
            {/* Contextual Title can go here if needed */}
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-sm bg-secondary/30 px-3 py-1.5 rounded-full border border-white/5">
              <span className="text-muted-foreground">Health Score:</span>
              <span className={cn(
                "font-bold",
                healthScore >= 70 ? "text-success" : 
                healthScore >= 40 ? "text-warning" : "text-destructive"
              )}>
                {Math.round(healthScore)}
              </span>
            </div>
            {/* Avatar Mock */}
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              U
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-card border-t border-border/40 pb-safe z-50">
        <div className="flex justify-around p-2">
          {navItems.slice(0, 5).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg text-[10px] font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {item.icon}
              <span className="truncate w-14 text-center">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
