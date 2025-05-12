
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const UnauthorizedPage = () => {
  const { userRole } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
        <div className="mb-6 text-gray-700">
          <p>You don't have permission to access this page.</p>
          {userRole && (
            <p className="mt-2">
              Your current role ({userRole}) doesn't have the necessary permissions.
            </p>
          )}
        </div>
        <div className="flex justify-center space-x-4">
          <Button asChild variant="default">
            <Link to="/">Go to Home</Link>
          </Button>
          {!userRole && (
            <Button asChild variant="outline">
              <Link to="/auth/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
