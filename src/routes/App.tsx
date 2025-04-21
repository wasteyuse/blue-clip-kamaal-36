import { Routes, Route } from 'react-router-dom';
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AdminLayout } from "@/components/admin/AdminLayout";
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ApplyPage from '@/pages/ApplyPage';
import DashboardPage from '@/pages/DashboardPage';
import ContentPage from '@/pages/ContentPage';
import AssetsPage from '@/pages/AssetsPage';
import SubmitContentPage from '@/pages/SubmitContentPage';
import MyEarningsPage from '@/pages/MyEarningsPage';
import AdminPanelPage from '@/pages/AdminPanelPage';
import AffiliatePage from '@/pages/AffiliatePage';
import PayoutsPage from '@/pages/PayoutsPage';
import NotFound from '@/pages/NotFound';
import HowItWorksPage from '@/pages/HowItWorksPage';
import CreatorsPage from '@/pages/CreatorsPage';
import FAQPage from '@/pages/FAQPage';
import GuidelinesPage from '@/pages/GuidelinesPage';
import PayoutRulesPage from '@/pages/PayoutRulesPage';
import AboutPage from '@/pages/AboutPage';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';

// Admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UsersPage from '@/pages/admin/Users';
import AdminAssetsPage from '@/pages/admin/Assets';
import AdminPayoutsPage from '@/pages/admin/Payouts';
import ApprovalsPage from '@/pages/admin/Approvals';
import AffiliatesPage from '@/pages/admin/Affiliates';
import PaymentSettingsPage from '@/pages/admin/Settings';
import EarningsPage from '@/pages/admin/Earnings';

function App() {
  return (
    <Routes>
      {/* Public routes with main layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/apply" element={<ApplyPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/creators" element={<CreatorsPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/guidelines" element={<GuidelinesPage />} />
        <Route path="/payout-rules" element={<PayoutRulesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Route>
      
      {/* Authentication routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Dashboard routes */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="content" element={<ContentPage />} />
        <Route path="submit" element={<SubmitContentPage />} />
        <Route path="earnings" element={<MyEarningsPage />} />
        <Route path="assets" element={<AssetsPage />} />
        <Route path="affiliate" element={<AffiliatePage />} />
        <Route path="payouts" element={<PayoutsPage />} />
        <Route path="settings" element={<UserSettings />} />
      </Route>
      
      {/* Admin routes - Using AdminLayout with Outlet */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminPanelPage />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="assets" element={<AdminAssetsPage />} />
        <Route path="payouts" element={<AdminPayoutsPage />} />
        <Route path="approvals" element={<ApprovalsPage />} />
        <Route path="affiliates" element={<AffiliatesPage />} />
        <Route path="settings" element={<PaymentSettingsPage />} />
        <Route path="earnings" element={<EarningsPage />} />
      </Route>
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
