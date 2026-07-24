import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, CheckCircle2, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SEO } from '../components/ui/SEO';

export function ResetPassword() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const res = await resetPassword(newPassword);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } else {
      setErrorMessage(res.error || 'Password reset failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 sm:p-6 transition-colors">
      <SEO
        title="Reset Password | Manas Traders Tikapur"
        description="Set a new password for your account."
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-700 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-slate-900 via-[#0B7A3D] to-slate-900 p-8 text-white text-center relative">
          <Link
            to="/login"
            className="absolute left-4 top-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1 text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Login</span>
          </Link>
          <h1 className="font-playfair text-2xl font-bold tracking-tight">Set New Password</h1>
          <p className="text-xs text-emerald-100 mt-1">Type your new secure password below</p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {success ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-[#0B7A3D] mx-auto" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Password Reset Successful!</h2>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Your password has been updated. Redirecting to sign in...
              </p>
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B7A3D]"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B7A3D]"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>
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
                      <KeyRound className="w-4 h-4" />
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
