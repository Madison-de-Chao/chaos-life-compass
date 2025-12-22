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
import NotFound from "./pages/NotFound";

// Public Pages
import PortalPage from "./pages/public/PortalPage";
import HomePage from "./pages/public/HomePage";
import AboutPage from "./pages/public/AboutPage";
import MomoPage from "./pages/public/MomoPage";
import ChaoxuanPage from "./pages/public/ChaoxuanPage";
import ReportPage from "./pages/public/ReportPage";
import NotePage from "./pages/public/NotePage";

// Admin Pages (additional)
import NotesPage from "./pages/NotesPage";
import EntitlementsPage from "./pages/admin/EntitlementsPage";
import ApiKeysPage from "./pages/admin/ApiKeysPage";
import ExternalApiTestPage from "./pages/admin/ExternalApiTestPage";
import ApiDocsPage from "./pages/admin/ApiDocsPage";
import AdminLogsPage from "./pages/admin/AdminLogsPage";

// Member Pages
import MemberAuthPage from "./pages/member/MemberAuthPage";
import MemberDashboard from "./pages/member/MemberDashboard";
import MemberProfilePage from "./pages/member/MemberProfilePage";

// Account Pages
import ProductsPage from "./pages/account/ProductsPage";

const queryClient = new QueryClient();

// Component to conditionally render chatbot on public pages
function ChatBotWrapper() {
  const location = useLocation();
  const publicRoutes = ["/", "/portal", "/home", "/chaoxuan", "/about", "/momo", "/reports"];
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
            <PageTransition>
              <Routes>
                {/* Public routes - 虹靈御所前台 */}
                <Route path="/" element={<PortalPage />} />
                <Route path="/portal" element={<PortalPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/chaoxuan" element={<ChaoxuanPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/momo" element={<MomoPage />} />
                <Route path="/reports" element={<ReportPage />} />
                <Route path="/notes/:shareLink" element={<NotePage />} />
                
                {/* Member routes - 會員中心 */}
                <Route path="/member/auth" element={<MemberAuthPage />} />
                <Route path="/member" element={<MemberProtectedRoute><MemberDashboard /></MemberProtectedRoute>} />
                <Route path="/member/profile" element={<MemberProtectedRoute><MemberProfilePage /></MemberProtectedRoute>} />
                
                {/* Account routes - 帳號相關 */}
                <Route path="/account/products" element={<MemberProtectedRoute><ProductsPage /></MemberProtectedRoute>} />
                
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
                <Route path="/admin/external-api-test" element={<ProtectedRoute><ExternalApiTestPage /></ProtectedRoute>} />
                <Route path="/admin/api-docs" element={<ProtectedRoute><ApiDocsPage /></ProtectedRoute>} />
                <Route path="/admin/logs" element={<ProtectedRoute><AdminLogsPage /></ProtectedRoute>} />
                
                {/* Auth & Public document routes */}
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/view/:shareLink" element={<ViewPage />} />
                <Route path="/print/:shareLink" element={<PrintViewPage />} />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PageTransition>
            <ChatBotWrapper />
          </BrowserRouter>
        </TooltipProvider>
      </MemberProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
