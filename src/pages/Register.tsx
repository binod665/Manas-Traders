import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, User, Phone, MapPin, UserPlus, ArrowLeft, AlertCircle, CheckCircle2, ShieldCheck, MailCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SEO } from '../components/ui/SEO';

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('9848500000');
  const [addressLine, setAddressLine] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [verificationRequired, setVerificationRequired] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const res = await register(email, password, fullName, phone, addressLine);
    setLoading(false);

    if (res.success) {
      if (res.requiresEmailVerification) {
        setVerificationRequired(true);
      } else {
        navigate('/dashboard');
      }
    } else {
      setErrorMessage(res.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 sm:p-6 transition-colors">
      <SEO
        title="Register Customer Account | Manas Traders Tikapur"
        description="Create your customer account with Manas Traders Tikapur to save delivery addresses and track grocery orders."
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-700 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#0B7A3D] to-slate-900 p-8 text-white text-center relative">
          <Link
            to="/"
            className="absolute left-4 top-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1 text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Store</span>
          </Link>

          <h1 className="font-playfair text-2xl font-bold tracking-tight">Create Customer Account</h1>
          <p className="text-xs text-emerald-100 mt-1">Join 2,500+ happy households & shopkeepers in Tikapur</p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {verificationRequired ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#0B7A3D] flex items-center justify-center mx-auto">
                <MailCheck className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Verify Your Email Address</h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                A verification link has been sent to <strong className="text-slate-900 dark:text-white">{email}</strong>.
                Please check your inbox to activate your account.
              </p>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full py-3 rounded-2xl bg-[#0B7A3D] text-white font-bold text-xs shadow-md"
              >
                Proceed to Login
              </button>
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
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Full Name / नाम
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Binod Bhandari"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B7A3D]"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="binod@example.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B7A3D]"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="9848500665"
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B7A3D]"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Delivery Address (Tikapur)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                      placeholder="e.g. Tikapur-01, Hospital Road, Kailali"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B7A3D]"
                    />
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B7A3D]"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0B7A3D]"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  <ShieldCheck className="w-4 h-4 text-[#0B7A3D]" />
                  <span>Your information is encrypted & used only for grocery order delivery.</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-[#0B7A3D] hover:bg-[#086130] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#0B7A3D]/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 mt-4"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Register Account</span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          <div className="text-center text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-4">
            Already have an account?{' '}
            <Link to="/login" className="font-extrabold text-[#0B7A3D] dark:text-emerald-400 hover:underline">
              Sign In Instead
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
