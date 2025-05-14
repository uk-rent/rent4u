
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/user.types";

type ProtectedRouteProps = {
  requiredRole?: UserRole;
  redirectPath?: string;
};

const ProtectedRoute = ({ 
  requiredRole,
  redirectPath = '/auth/login'
}: ProtectedRouteProps) => {
  const { user, userRole, loading } = useAuth();
  const location = useLocation();

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Check if user has required role (if specified)
  if (requiredRole && userRole !== requiredRole && userRole !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
