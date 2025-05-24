
import { useAuth } from '@/context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  redirectTo?: string;
}

const ProtectedRoute = ({ redirectTo = '/auth' }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
