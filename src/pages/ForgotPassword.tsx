import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, ArrowLeft, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SEO } from '../components/ui/SEO';

export function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setMessage('');
    setLoading(true);

    const res = await forgotPassword(email);
    setLoading(false);

    if (res.success) {
      setMessage(res.message || 'Password reset link sent to your email.');
    } else {
      setErrorMessage(res.error || 'Failed to send reset link.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 sm:p-6 transition-colors">
      <SEO
        title="Forgot Password | Manas Traders Tikapur"
        description="Reset your password for your Manas Traders account."
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
          <h1 className="font-playfair text-2xl font-bold tracking-tight">Forgot Password?</h1>
          <p className="text-xs text-emerald-100 mt-1">Enter your registered email to receive a password recovery link</p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {message && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2.5 font-bold">
              <CheckCircle2 className="w-5 h-5 text-[#0B7A3D] shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
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
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B7A3D]"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
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
                  <Send className="w-4 h-4" />
                  <span>Send Reset Link</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-4">
            Remembered your password?{' '}
            <Link to="/login" className="font-extrabold text-[#0B7A3D] dark:text-emerald-400 hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
