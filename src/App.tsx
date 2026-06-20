import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { MemberProvider, MemberProtectedRoute } from "@/modules/member";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import PageTransition from "@/components/PageTransition";
import { MomoChatBot } from "@/components/MomoChatBot";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { ScrollToTop } from "@/components/ScrollToTop";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

// Admin Pages
import Index from "./pages/Index";
import DashboardPage from "./pages/DashboardPage";
import FilesPage from "./pages/FilesPage";
import ViewPage from "./pages/ViewPage";
import PrintViewPage from "./pages/PrintViewPage";
import EditDocumentPage from "./pages/EditDocumentPage";
import CustomersPage from "./pages/CustomersPage";
import FeedbacksPage from "./pages/FeedbacksPage";
import GuidePage from "./pages/GuidePage";
import MembersPage from "./pages/MembersPage";
// NotFound removed - using ComingSoonPage for all undefined routes

// Public Pages
import PortalPage from "./pages/public/PortalPage";
import HomePage from "./pages/public/HomePage";
import ChaoxuanPage from "./pages/public/ChaoxuanPage";
import ReportPage from "./pages/public/ReportPage";

import NotePage from "./pages/public/NotePage";
import IntroPage from "./pages/public/IntroPage";
import GamesPage from "./pages/public/GamesPage";
import ComingSoonPage from "./pages/public/ComingSoonPage";
import UniversePage from "./pages/public/UniversePage";
import AboutPage from "./pages/public/AboutPage";
import PrivacyPolicyPage from "./pages/public/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/public/TermsOfServicePage";
import DiscoverPage from "./pages/public/DiscoverPage";

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
import DocumentationPage from "./pages/admin/DocumentationPage";

// Unified Member Pages (統一會員系統)
import {
  UnifiedAuthPage,
  UnifiedDashboard,
  UnifiedProfilePage,
  OAuthAuthorizePage,
} from "@/modules/member";

// Public Layout
import PublicLayout from "./components/public/PublicLayout";

// AI Portal Pages (AI 協作入口)
import {
  AIPortalPage,
  AIWorldviewPage,
  AICIPPage,
  AILanguagePage,
  AIQuickstartPage,
  AIDialoguePage,
  AISafetyPage,
  AIIntegrityPage,
} from "./pages/ai";

// MomoChao System Pages (默默超的元壹體系)
import {
  MomochaoSystemPage,
  MomochaoSystemAdvancedPage,
  MomochaoPhilosophyPage,
  MomochaoAboutPage,
  MomochaoEducationPage,
} from "./pages/momochao";

// Account Pages
import ProductsPage from "./pages/account/ProductsPage";

const queryClient = new QueryClient();

// Component to conditionally render chatbot on public pages
function ChatBotWrapper() {
  const location = useLocation();
  const publicRoutes = ["/", "/portal", "/home", "/chaoxuan", "/reports", "/games", "/universe", "/notes-public"];
  const isPublicRoute = publicRoutes.some(route => 
    route === "/" ? location.pathname === "/" : location.pathname.startsWith(route)
  );
  
  if (!isPublicRoute) return null;
  return <MomoChatBot />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
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
              <Route path="/reports" element={<ReportPage />} />
              <Route path="/intro" element={<IntroPage />} />
              
              <Route path="/games" element={<GamesPage />} />
              <Route path="/notes/:shareLink" element={<NotePage />} />
              <Route path="/universe" element={<UniversePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsOfServicePage />} />
              <Route path="/notes-public" element={<ComingSoonPage />} />
              <Route path="/discover" element={<DiscoverPage />} />
              
              {/* AI Portal routes - AI 協作入口 */}
              <Route path="/ai" element={<AIPortalPage />} />
              <Route path="/ai/worldview" element={<AIWorldviewPage />} />
              <Route path="/ai/cip" element={<AICIPPage />} />
              <Route path="/ai/language" element={<AILanguagePage />} />
              <Route path="/ai/quickstart" element={<AIQuickstartPage />} />
              <Route path="/ai/dialogue" element={<AIDialoguePage />} />
              <Route path="/ai/safety" element={<AISafetyPage />} />
              <Route path="/ai/integrity" element={<AIIntegrityPage />} />
              
              {/* MomoChao System routes - 默默超的元壹體系 */}
              <Route path="/momochao-system" element={<MomochaoSystemPage />} />
              <Route path="/momochao-system-advanced" element={<MomochaoSystemAdvancedPage />} />
              <Route path="/momochao-system/philosophy" element={<MomochaoPhilosophyPage />} />
              <Route path="/momochao-system/about" element={<MomochaoAboutPage />} />
              <Route path="/momochao-system/education" element={<MomochaoEducationPage />} />
              
              {/* Unified Auth routes - 統一會員系統（共用主站導航） */}
              <Route path="/auth/login" element={<PublicLayout><UnifiedAuthPage /></PublicLayout>} />
              <Route path="/oauth/authorize" element={<PublicLayout><OAuthAuthorizePage /></PublicLayout>} />
              <Route path="/account" element={<MemberProtectedRoute><PublicLayout><UnifiedDashboard /></PublicLayout></MemberProtectedRoute>} />
              <Route path="/account/profile" element={<MemberProtectedRoute><PublicLayout><UnifiedProfilePage /></PublicLayout></MemberProtectedRoute>} />
              <Route path="/account/products" element={<MemberProtectedRoute><PublicLayout><ProductsPage /></PublicLayout></MemberProtectedRoute>} />
              
              {/* Legacy member routes — redirect to unified system */}
              <Route path="/member/auth" element={<Navigate to="/auth/login" replace />} />
              <Route path="/member" element={<Navigate to="/account" replace />} />
              <Route path="/member/profile" element={<Navigate to="/account/profile" replace />} />
              
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
              <Route path="/admin/documentation" element={<ProtectedRoute><DocumentationPage /></ProtectedRoute>} />
              
              {/* Legacy admin auth route — redirect to unified login */}
              <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
              <Route path="/view/:shareLink" element={<ViewPage />} />
              <Route path="/print/:shareLink" element={<PrintViewPage />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<ComingSoonPage />} />
            </Routes>
          </PageTransition>
          <ChatBotWrapper />
          <PWAInstallPrompt />
          <CookieConsentBanner />
          <GoogleAnalytics />
        </BrowserRouter>
      </TooltipProvider>
    </MemberProvider>
  </QueryClientProvider>
);

export default App;
