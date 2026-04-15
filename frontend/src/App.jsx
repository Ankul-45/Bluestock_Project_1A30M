import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AdminAnalyticsPage from "./pages/AdminAnalyticsPage";
import UserManagementPage from "./pages/UserManagementPage";
import StateAccessPage from "./pages/StateAccessPage";
import VillageBrowserPage from "./pages/VillageBrowserPage";
import B2BRegisterPage from "./pages/B2BRegisterPage";
import B2BDashboardPage from "./pages/B2BDashboardPage";
import ApiKeysPage from "./pages/ApiKeysPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
      <Route path="/admin/users" element={<UserManagementPage />} />
      <Route path="/admin/access" element={<StateAccessPage />} />
      <Route path="/admin/villages" element={<VillageBrowserPage />} />

      <Route path="/b2b/register" element={<B2BRegisterPage />} />
      <Route path="/b2b/dashboard" element={<B2BDashboardPage />} />
      <Route path="/b2b/keys" element={<ApiKeysPage />} />

      <Route path="/dashboard" element={<Navigate to="/admin/analytics" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
