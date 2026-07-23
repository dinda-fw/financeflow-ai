import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { TrendingUp, ShieldCheck, Zap, BrainCircuit, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Abstract Background */}
      <div className="absolute top-0 -left-1/4 w-[150%] h-[100%] z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute top-[40%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-secondary/30 blur-[150px]" />
      </div>

      {/* Navbar */}
      <nav className="container mx-auto px-6 py-6 relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary/20 p-2 rounded-xl text-primary">
            <TrendingUp className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            FinanceFlow AI
          </span>
        </div>
        <Button onClick={() => navigate('/auth')}>Sign In</Button>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 relative z-10 flex-1 flex flex-col items-center justify-center text-center mt-12 mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary mb-8 animate-in slide-in-from-bottom-4 duration-700">
          <Zap className="w-4 h-4" />
          <span className="text-sm font-medium">FinanceFlow v2.0 is now live</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mb-8 leading-tight animate-in slide-in-from-bottom-6 duration-700 delay-100">
          Master Your Cashflow with <span className="bg-gradient-to-r from-blue-400 to-primary bg-clip-text text-transparent">Real-Time AI Intelligence</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mb-12 animate-in slide-in-from-bottom-8 duration-700 delay-200">
          Stop wondering where your money went. Auto-sync your banks, snap receipts with Gemini AI, and hit your financial goals faster than ever.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 animate-in slide-in-from-bottom-10 duration-700 delay-300">
          <Button size="lg" onClick={() => navigate('/auth')} className="h-14 px-8 text-lg font-semibold gap-2">
            Try Live Demo <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left w-full max-w-5xl">
          <div className="p-6 rounded-2xl glass-card border border-white/5 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Bank Sync</h3>
            <p className="text-muted-foreground leading-relaxed">Connect your accounts securely. Watch your balances update in real-time across all your wallets and banks.</p>
          </div>
          
          <div className="p-6 rounded-2xl glass-card border border-white/5 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">AI Coach</h3>
            <p className="text-muted-foreground leading-relaxed">Gemini 2.5 analyzes your spending patterns and warns you before you break your budget limits.</p>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-white/5 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Smart Goals</h3>
            <p className="text-muted-foreground leading-relaxed">Set savings targets and watch your progress bar fill up as the AI helps optimize your monthly allocations.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
