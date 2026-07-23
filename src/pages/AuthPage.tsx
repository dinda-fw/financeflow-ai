import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../hooks/useFinance';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ArrowLeft, UserCircle2, Eye, EyeOff, RefreshCw } from 'lucide-react';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, completeOnboarding } = useFinance();
  const [showPassword, setShowPassword] = useState(false);

  const handleFastPass = () => {
    login();
    completeOnboarding();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative">
      <div className="absolute top-8 left-8">
        <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Button>
      </div>

      <div className="w-full max-w-md animate-in zoom-in-95 duration-300">
        <Card className="border-white/10 shadow-2xl">
          <CardHeader className="text-center space-y-2 pb-6">
            <div className="mx-auto w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-2">
              <UserCircle2 className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <p className="text-muted-foreground text-sm">Sign in to manage your cashflow.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input placeholder="name@example.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} placeholder="••••••••" className="pr-10" />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Mock reCAPTCHA */}
            <div className="flex items-center justify-between bg-white border border-gray-300 rounded-sm p-3 shadow-sm h-[74px]">
              <div className="flex items-center gap-3">
                <input type="checkbox" className="w-6 h-6 border-gray-300 cursor-pointer accent-blue-600" />
                <span className="text-sm text-gray-800 font-medium">I'm not a robot</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <RefreshCw className="w-6 h-6 text-blue-600 mb-1" />
                <span className="text-[10px] text-gray-500 font-medium leading-none">reCAPTCHA</span>
                <span className="text-[8px] text-gray-400 mt-0.5 leading-none">Privacy - Terms</span>
              </div>
            </div>
            
            <Button className="w-full font-semibold" onClick={handleFastPass}>
              Sign In
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Belum punya akun? </span>
              <a href="#" className="text-primary hover:underline font-medium">Buat akun</a>
            </div>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button variant="outline" className="w-full border-primary/50 text-primary hover:bg-primary/10" onClick={handleFastPass}>
              Guest Fast Pass (Staging live Demo)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
