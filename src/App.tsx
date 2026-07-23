import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useFinance } from './hooks/useFinance';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import BankOnboarding from './pages/BankOnboarding';
import DashboardLayout from './layouts/DashboardLayout';

// Dashboard Views
import DashboardOverview from './components/dashboard/DashboardOverview';
import CashflowAccounts from './components/dashboard/CashflowAccounts';
import GoalsPlan from './components/dashboard/GoalsPlan';
import Budgeting from './components/dashboard/Budgeting';
import AIReceipts from './components/dashboard/AIReceipts';
import ReportsInsights from './components/dashboard/ReportsInsights';

function App() {
  const { state } = useFinance();

  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={!state.isAuthenticated ? <LandingPage /> : <Navigate to="/app" />} />
        <Route path="/auth" element={!state.isAuthenticated ? <AuthPage /> : <Navigate to={state.hasOnboardedBank ? "/app" : "/onboarding"} />} />
        
        {/* Onboarding Flow */}
        <Route path="/onboarding" element={state.isAuthenticated && !state.hasOnboardedBank ? <BankOnboarding /> : <Navigate to="/app" />} />

        {/* Dashboard Routes */}
        <Route path="/app" element={state.isAuthenticated && state.hasOnboardedBank ? <DashboardLayout /> : <Navigate to="/auth" />}>
          <Route index element={<DashboardOverview />} />
          <Route path="cashflow" element={<CashflowAccounts />} />
          <Route path="goals" element={<GoalsPlan />} />
          <Route path="budgeting" element={<Budgeting />} />
          <Route path="receipts" element={<AIReceipts />} />
          <Route path="reports" element={<ReportsInsights />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
