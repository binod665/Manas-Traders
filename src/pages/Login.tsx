import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, LogIn, ArrowLeft, CheckCircle2, AlertCircle, Store, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SEO } from '../components/ui/SEO';

export function Login() {
  const { login, loginAsDemoCustomer, loginAsDemoAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = (location.state as any)?.from || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const savedEmail = localStorage.getItem('manas_remember_me');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    const res = await login(email, password, rememberMe);
    setLoading(false);

    if (res.success) {
      setSuccessMessage('Logged in successfully! Redirecting...');
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 600);
    } else {
      setErrorMessage(res.error || 'Failed to login. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 sm:p-6 transition-colors">
      <SEO
        title="Customer Login | Manas Traders Tikapur"
        description="Log into your Manas Traders account to manage your grocery orders, saved addresses, and wishlist."
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-700 overflow-hidden"
      >
        {/* Header Branding Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-[#0B7A3D] to-slate-900 p-8 text-white text-center relative">
          <Link
            to="/"
            className="absolute left-4 top-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1 text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Store</span>
          </Link>

          <div className="w-14 h-14 rounded-2xl bg-[#0B7A3D] border border-emerald-400/30 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Store className="w-8 h-8 text-[#FFC107]" />
          </div>

          <h1 className="font-playfair text-2xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-xs text-emerald-100 mt-1">Sign in to your Manas Traders account</p>
        </div>

        {/* Login Form */}
        <div className="p-6 sm:p-8 space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2.5 font-bold">
              <CheckCircle2 className="w-4 h-4 text-[#0B7A3D]" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B7A3D]"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-[#0B7A3D] dark:text-emerald-400 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B7A3D]"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0B7A3D] focus:ring-[#0B7A3D]"
                />
                <span>Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-[#0B7A3D] hover:bg-[#086130] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#0B7A3D]/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Account Quick Buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
              Instant Demo Logins
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  loginAsDemoCustomer();
                  navigate('/dashboard');
                }}
                className="py-2 px-3 rounded-xl bg-emerald-50 dark:bg-slate-900 text-[#0B7A3D] dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-slate-700 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Demo Customer</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  loginAsDemoAdmin('admin');
                  navigate('/admin');
                }}
                className="py-2 px-3 rounded-xl bg-amber-50 dark:bg-slate-900 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-slate-700 hover:bg-amber-100 transition-colors flex items-center justify-center gap-1.5"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Demo Admin</span>
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-600 dark:text-slate-400">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-extrabold text-[#0B7A3D] dark:text-emerald-400 hover:underline">
              Create Account
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
