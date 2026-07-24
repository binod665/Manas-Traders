import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Send, CheckCircle2, ShieldCheck, BellRing } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Newsletter: React.FC = () => {
  const { t } = useTranslation();
  const [inputVal, setInputVal] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setSubscribed(true);
      setInputVal('');
    }
  };

  return (
    <section className="py-12 my-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-r from-slate-900 via-[#0B7A3D] to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        {/* Background Decorative Rings */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 text-[#FFC107] flex items-center justify-center mx-auto shadow-inner">
            <BellRing className="w-6 h-6" />
          </div>

          <h2 className="font-playfair text-3xl sm:text-4xl font-extrabold tracking-tight">
            {t('newsletter.title')}
          </h2>

          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            {t('newsletter.subtitle')}
          </p>

          {subscribed ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-emerald-800/90 border border-emerald-500/50 p-4 rounded-2xl flex items-center justify-center gap-3 text-white text-sm font-bold"
            >
              <CheckCircle2 className="w-5 h-5 text-[#FFC107]" />
              <span>Namaste! Subscribed successfully for Tikapur market updates.</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <div className="relative flex-1">
                <input
                  type="text"
                  required
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder={t('newsletter.placeholder')}
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-slate-300 text-xs sm:text-sm focus:outline-none focus:bg-white/20 focus:ring-2 focus:ring-[#FFC107]"
                />
                <Mail className="w-4 h-4 text-slate-300 absolute left-3.5 top-4" />
              </div>

              <button
                type="submit"
                className="px-6 py-3.5 rounded-2xl bg-[#FFC107] hover:bg-[#e0a800] text-slate-950 font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0 shadow-lg"
              >
                <span>{t('newsletter.button')}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="flex items-center justify-center gap-2 text-xs text-emerald-200 pt-2">
            <ShieldCheck className="w-4 h-4 text-[#FFC107]" />
            <span>{t('newsletter.disclaimer')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
