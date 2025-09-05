'use client';

import { useAuth } from '@/lib/authContext';
import LoginForm from './LoginForm';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, login, isLoading, error } = useAuth();

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-coffee-50 to-coffee-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-600 mx-auto mb-4"></div>
          <p className="text-coffee-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!user?.isAuthenticated) {
    return (
      <LoginForm
        onLogin={login}
        isLoading={isLoading}
        error={error ?? undefined}
      />
    );
  }

  // Show protected content if authenticated
  return <>{children}</>;
}