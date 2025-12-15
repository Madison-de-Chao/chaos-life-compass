import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import PageTransition from "@/components/PageTransition";

// Admin Pages
import Index from "./pages/Index";
import FilesPage from "./pages/FilesPage";
import ViewPage from "./pages/ViewPage";
import PrintViewPage from "./pages/PrintViewPage";
import AuthPage from "./pages/AuthPage";
import EditDocumentPage from "./pages/EditDocumentPage";
import CustomersPage from "./pages/CustomersPage";
import FeedbacksPage from "./pages/FeedbacksPage";
import GuidePage from "./pages/GuidePage";
import NotFound from "./pages/NotFound";

// Public Pages
import HomePage from "./pages/public/HomePage";
import AboutPage from "./pages/public/AboutPage";
import MomoPage from "./pages/public/MomoPage";
import ChaoxuanPage from "./pages/public/ChaoxuanPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <PageTransition>
            <Routes>
              {/* Public routes - 虹靈御所前台 */}
              <Route path="/home" element={<HomePage />} />
              <Route path="/chaoxuan" element={<ChaoxuanPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/momo" element={<MomoPage />} />
              
              {/* Protected routes - Admin dashboard */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/files"
                element={
                  <ProtectedRoute>
                    <FilesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit"
                element={
                  <ProtectedRoute>
                    <EditDocumentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customers"
                element={
                  <ProtectedRoute>
                    <CustomersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/feedbacks"
                element={
                  <ProtectedRoute>
                    <FeedbacksPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/guide"
                element={
                  <ProtectedRoute>
                    <GuidePage />
                  </ProtectedRoute>
                }
              />
              
              {/* Auth & Public document routes */}
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/view/:shareLink" element={<ViewPage />} />
              <Route path="/print/:shareLink" element={<PrintViewPage />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageTransition>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
