import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0B7A3D] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Verifying security session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md text-center shadow-xl border border-slate-200 dark:border-slate-700">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
            !
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Access Restricted</h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mb-6">
            You do not have the required role ({allowedRoles.join(', ')}) to view this portal.
          </p>
          <a
            href="#/"
            className="inline-block px-5 py-2.5 rounded-2xl bg-[#0B7A3D] text-white text-xs font-bold shadow-md hover:bg-[#086130] transition-all"
          >
            Return to Store
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
