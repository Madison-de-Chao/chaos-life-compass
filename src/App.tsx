import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { MemberProvider } from "@/hooks/useMember";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { MemberProtectedRoute } from "@/components/MemberProtectedRoute";
import PageTransition from "@/components/PageTransition";
import { MomoChatBot } from "@/components/MomoChatBot";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { ScrollToTop } from "@/components/ScrollToTop";

// Admin Pages
import Index from "./pages/Index";
import DashboardPage from "./pages/DashboardPage";
import FilesPage from "./pages/FilesPage";
import ViewPage from "./pages/ViewPage";
import PrintViewPage from "./pages/PrintViewPage";
import AuthPage from "./pages/AuthPage";
import EditDocumentPage from "./pages/EditDocumentPage";
import CustomersPage from "./pages/CustomersPage";
import FeedbacksPage from "./pages/FeedbacksPage";
import GuidePage from "./pages/GuidePage";
import MembersPage from "./pages/MembersPage";
// NotFound removed - using ComingSoonPage for all undefined routes

// Public Pages
import PortalPage from "./pages/public/PortalPage";
import HomePage from "./pages/public/HomePage";
import AboutPage from "./pages/public/AboutPage";
import ChaoxuanPage from "./pages/public/ChaoxuanPage";
import ReportPage from "./pages/public/ReportPage";
import NotePage from "./pages/public/NotePage";
import GamesPage from "./pages/public/GamesPage";
import ComingSoonPage from "./pages/public/ComingSoonPage";
import UniversePage from "./pages/public/UniversePage";

// Admin Pages (additional)
import NotesPage from "./pages/NotesPage";
import EntitlementsPage from "./pages/admin/EntitlementsPage";
import ApiKeysPage from "./pages/admin/ApiKeysPage";
import OAuthClientsPage from "./pages/admin/OAuthClientsPage";
import ExternalApiTestPage from "./pages/admin/ExternalApiTestPage";
import ApiDocsPage from "./pages/admin/ApiDocsPage";
import AdminLogsPage from "./pages/admin/AdminLogsPage";
import PendingChangesPage from "./pages/admin/PendingChangesPage";
import IpBlacklistPage from "./pages/admin/IpBlacklistPage";

// Member Pages (Legacy - 虹靈御所專用)
import MemberAuthPage from "./pages/member/MemberAuthPage";
import MemberDashboard from "./pages/member/MemberDashboard";
import MemberProfilePage from "./pages/member/MemberProfilePage";

// Unified Member Pages (統一會員系統)
import UnifiedAuthPage from "./pages/member/UnifiedAuthPage";
import UnifiedDashboard from "./pages/member/UnifiedDashboard";
import UnifiedProfilePage from "./pages/member/UnifiedProfilePage";
import OAuthAuthorizePage from "./pages/member/OAuthAuthorizePage";

// Account Pages
import ProductsPage from "./pages/account/ProductsPage";

const queryClient = new QueryClient();

// Component to conditionally render chatbot on public pages
function ChatBotWrapper() {
  const location = useLocation();
  const publicRoutes = ["/", "/portal", "/home", "/chaoxuan", "/about", "/reports", "/games", "/universe", "/notes-public"];
  const isPublicRoute = publicRoutes.some(route => 
    route === "/" ? location.pathname === "/" : location.pathname.startsWith(route)
  );
  
  if (!isPublicRoute) return null;
  return <MomoChatBot />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <MemberProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <PageTransition>
              <Routes>
                {/* Public routes - 虹靈御所前台 */}
                <Route path="/" element={<PortalPage />} />
                <Route path="/portal" element={<PortalPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/chaoxuan" element={<ChaoxuanPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/reports" element={<ReportPage />} />
                <Route path="/games" element={<GamesPage />} />
                <Route path="/notes/:shareLink" element={<NotePage />} />
                <Route path="/universe" element={<UniversePage />} />
                <Route path="/notes-public" element={<ComingSoonPage />} />
                
                {/* Unified Auth routes - 統一會員系統 */}
                <Route path="/auth/login" element={<UnifiedAuthPage />} />
                <Route path="/oauth/authorize" element={<OAuthAuthorizePage />} />
                <Route path="/account" element={<MemberProtectedRoute><UnifiedDashboard /></MemberProtectedRoute>} />
                <Route path="/account/profile" element={<MemberProtectedRoute><UnifiedProfilePage /></MemberProtectedRoute>} />
                <Route path="/account/products" element={<MemberProtectedRoute><ProductsPage /></MemberProtectedRoute>} />
                
                {/* Member routes - 虹靈御所會員中心 (Legacy, redirects to unified) */}
                <Route path="/member/auth" element={<MemberAuthPage />} />
                <Route path="/member" element={<MemberProtectedRoute><MemberDashboard /></MemberProtectedRoute>} />
                <Route path="/member/profile" element={<MemberProtectedRoute><MemberProfilePage /></MemberProtectedRoute>} />
                
                {/* Protected routes - Admin dashboard */}
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/upload" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                <Route path="/files" element={<ProtectedRoute><FilesPage /></ProtectedRoute>} />
                <Route path="/edit" element={<ProtectedRoute><EditDocumentPage /></ProtectedRoute>} />
                <Route path="/customers" element={<ProtectedRoute><CustomersPage /></ProtectedRoute>} />
                <Route path="/feedbacks" element={<ProtectedRoute><FeedbacksPage /></ProtectedRoute>} />
                <Route path="/guide" element={<ProtectedRoute><GuidePage /></ProtectedRoute>} />
                <Route path="/members" element={<ProtectedRoute><MembersPage /></ProtectedRoute>} />
                <Route path="/notes" element={<ProtectedRoute><NotesPage /></ProtectedRoute>} />
                <Route path="/admin/entitlements" element={<ProtectedRoute><EntitlementsPage /></ProtectedRoute>} />
                <Route path="/admin/api-keys" element={<ProtectedRoute><ApiKeysPage /></ProtectedRoute>} />
                <Route path="/admin/oauth-clients" element={<ProtectedRoute><OAuthClientsPage /></ProtectedRoute>} />
                <Route path="/admin/external-api-test" element={<ProtectedRoute><ExternalApiTestPage /></ProtectedRoute>} />
                <Route path="/admin/api-docs" element={<ProtectedRoute><ApiDocsPage /></ProtectedRoute>} />
                <Route path="/admin/logs" element={<ProtectedRoute><AdminLogsPage /></ProtectedRoute>} />
                <Route path="/admin/pending-changes" element={<ProtectedRoute><PendingChangesPage /></ProtectedRoute>} />
                <Route path="/admin/ip-blacklist" element={<ProtectedRoute><IpBlacklistPage /></ProtectedRoute>} />
                
                {/* Auth & Public document routes */}
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/view/:shareLink" element={<ViewPage />} />
                <Route path="/print/:shareLink" element={<PrintViewPage />} />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<ComingSoonPage />} />
              </Routes>
            </PageTransition>
            <ChatBotWrapper />
            <PWAInstallPrompt />
          </BrowserRouter>
        </TooltipProvider>
      </MemberProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
