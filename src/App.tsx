
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import HowItWorksPage from "./pages/HowItWorksPage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import UpdatePasswordPage from "./pages/auth/UpdatePasswordPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
            <Route path="/auth/update-password" element={<UpdatePasswordPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected Tenant Routes */}
            <Route element={<ProtectedRoute requiredRole="tenant" />}>
              <Route path="/saved-properties" element={<div>Saved Properties Page</div>} />
            </Route>

            {/* Protected Landlord Routes */}
            <Route element={<ProtectedRoute requiredRole="landlord" />}>
              <Route path="/my-properties" element={<div>My Properties Page</div>} />
              <Route path="/publish-property" element={<div>Publish Property Page</div>} />
            </Route>

            {/* Protected Routes for Any User */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<div>Profile Page</div>} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute requiredRole="admin" />}>
              <Route path="/admin" element={<div>Admin Dashboard</div>} />
              <Route path="/admin/properties" element={<div>Admin Properties</div>} />
              <Route path="/admin/users" element={<div>Admin Users</div>} />
            </Route>

            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
