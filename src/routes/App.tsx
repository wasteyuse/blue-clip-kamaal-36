
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
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
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <Routes>
      {/* Public routes with main layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/apply" element={<ApplyPage />} />
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
      </Route>
      
      {/* Admin routes */}
      <Route path="/admin" element={<DashboardLayout />}>
        <Route index element={<AdminPanelPage />} />
      </Route>
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
