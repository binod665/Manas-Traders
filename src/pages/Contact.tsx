import React, { useState } from 'react';
import { SEO } from '../components/ui/SEO';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useStoreInfo } from '../hooks/useStoreInfo';
import { submitInquiry } from '../services/supabase';
import { ContactFormData } from '../types';
import {
  Phone,
  MapPin,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  MessageCircle,
  ExternalLink,
  Store,
  Sparkles,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

export function Contact() {
  const { storeInfo } = useStoreInfo();
  const phonePrimary = '9848500665';
  const phoneSecondary = '9824600477';

  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general',
  });

  const [status, setStatus] = useState<{
    submitting: boolean;
    success: boolean;
    error: string | null;
  }>({
    submitting: false,
    success: false,
    error: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setStatus({
        submitting: false,
        success: false,
        error: 'Please fill in all required fields (Full Name, Phone Number, and Message).',
      });
      return;
    }

    setStatus({ submitting: true, success: false, error: null });

    try {
      const { error } = await submitInquiry(formData);
      if (error) {
        throw error;
      }
      setStatus({ submitting: false, success: true, error: null });
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        subject: '',
        message: '',
        inquiryType: 'general',
      });
    } catch (err: any) {
      console.error('Contact submission error:', err);
      setStatus({
        submitting: false,
        success: false,
        error: err.message || 'Failed to send inquiry to Supabase database. Please call us directly.',
      });
    }
  };

  const whatsappUrl = `https://wa.me/977${phonePrimary}?text=${encodeURIComponent(
    'Namaste Manas Traders! I have an inquiry regarding grocery items / wholesale rates.'
  )}`;
  const facebookUrl = 'https://facebook.com/manastraders.tikapur';
  const messengerUrl = 'https://m.me/manastraders.tikapur';

  return (
    <div className="py-10 bg-slate-50/60 min-h-screen">
      <SEO
        title="Contact Us | Manas Traders Tikapur Kailali Nepal"
        description="Contact Manas Traders in Tikapur, Kailali, Nepal. Call 9848500665 or 9824600477 for grocery shopping, daily home supplies, and wholesale bulk orders. Send an online inquiry via Supabase."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="emerald" className="px-3 py-1 text-xs">
            <Store className="w-3.5 h-3.5 inline mr-1" />
            Contact & Location Directory
          </Badge>
          <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Contact <span className="text-[#0B7A3D]">Manas Traders</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Located in Tikapur, Kailali, Nepal. Reach out to us for daily grocery supplies, home delivery orders, market rates, or wholesale bulk inquiries.
          </p>
        </div>

        {/* Quick Social & Direct Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* WhatsApp Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-2xl shadow-md transition-all transform hover:-translate-y-0.5 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <span className="text-xs font-semibold text-emerald-100 block">WhatsApp Us</span>
                <span className="text-sm font-extrabold text-white">+977 {phonePrimary}</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 opacity-80 group-hover:opacity-100" />
          </a>

          {/* Facebook Page Button */}
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-2xl shadow-md transition-all transform hover:-translate-y-0.5 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <div className="text-left">
                <span className="text-xs font-semibold text-blue-100 block">Facebook Page</span>
                <span className="text-sm font-extrabold text-white">Manas Traders Tikapur</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 opacity-80 group-hover:opacity-100" />
          </a>

          {/* Messenger Button */}
          <a
            href={messengerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-[#0084FF] hover:bg-[#0078e6] text-white rounded-2xl shadow-md transition-all transform hover:-translate-y-0.5 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.085.3 2.239.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26 6.559-6.963 3.13 3.259 5.889-3.259-6.56 6.964z" />
                </svg>
              </div>
              <div className="text-left">
                <span className="text-xs font-semibold text-sky-100 block">Messenger Chat</span>
                <span className="text-sm font-extrabold text-white">Direct Chat Online</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 opacity-80 group-hover:opacity-100" />
          </a>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Direct Info & Hours */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="bg-slate-900 text-white p-7 sm:p-8 space-y-6 border-slate-800 shadow-xl rounded-3xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-2xl font-bold font-playfair text-white">Manas Traders</h2>
                  <p className="text-xs text-emerald-400 font-semibold mt-0.5">Tikapur, Kailali, Nepal</p>
                </div>
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>

              <div className="space-y-5 text-sm">
                {/* Address */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-slate-800 text-emerald-400 flex items-center justify-center shrink-0 border border-slate-700">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium block uppercase tracking-wider">Store Address</span>
                    <p className="text-slate-100 font-semibold mt-0.5">{storeInfo.address.fullAddress}</p>
                    <span className="text-xs text-slate-400">Tikapur-01, Kailali, Sudurpashchim, Nepal</span>
                  </div>
                </div>

                {/* Phone Numbers */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-slate-800 text-amber-400 flex items-center justify-center shrink-0 border border-slate-700">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium block uppercase tracking-wider">Store Contact Phones</span>
                    <div className="mt-1 space-y-1">
                      <a
                        href={`tel:${phonePrimary}`}
                        className="text-amber-300 hover:text-amber-200 font-extrabold text-base block transition-colors"
                      >
                        +977 {phonePrimary}
                      </a>
                      <a
                        href={`tel:${phoneSecondary}`}
                        className="text-amber-300 hover:text-amber-200 font-extrabold text-base block transition-colors"
                      >
                        +977 {phoneSecondary}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Store Hours */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-slate-800 text-sky-400 flex items-center justify-center shrink-0 border border-slate-700">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="w-full">
                    <span className="text-xs text-slate-400 font-medium block uppercase tracking-wider">Operating Store Hours</span>
                    <div className="mt-2 bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80 space-y-2 text-xs">
                      <div className="flex justify-between items-center text-slate-200">
                        <span className="font-semibold text-slate-300">Sunday - Friday</span>
                        <span className="font-extrabold text-amber-400">6:00 AM - 8:30 PM</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-200 pt-1.5 border-t border-slate-700/60">
                        <span className="font-semibold text-slate-300">Saturday</span>
                        <span className="font-extrabold text-amber-400">7:00 AM - 7:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-slate-800 text-purple-400 flex items-center justify-center shrink-0 border border-slate-700">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium block uppercase tracking-wider">Official Email</span>
                    <a href={`mailto:${storeInfo.email}`} className="text-slate-200 hover:text-emerald-300 font-medium text-xs mt-0.5 block">
                      {storeInfo.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Direct Call Quick Bar */}
              <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-3">
                <a href={`tel:${phonePrimary}`} className="w-full">
                  <button
                    type="button"
                    className="w-full py-2.5 bg-[#0B7A3D] hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call {phonePrimary}
                  </button>
                </a>
                <a href={`tel:${phoneSecondary}`} className="w-full">
                  <button
                    type="button"
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    Call {phoneSecondary}
                  </button>
                </a>
              </div>
            </Card>
          </div>

          {/* Right Column: Supabase Contact Form */}
          <div className="lg:col-span-7">
            <Card className="p-7 sm:p-8 border-slate-200/80 shadow-lg rounded-3xl space-y-6 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-2xl font-bold font-playfair text-slate-900">Send an Online Inquiry</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Your message will be sent directly to our Supabase store management inbox.
                  </p>
                </div>
                <div className="p-2 bg-emerald-50 text-[#0B7A3D] rounded-2xl border border-emerald-100">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </div>
              </div>

              {status.success && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold text-emerald-900">Namaste! Inquiry successfully received.</strong>
                    <p className="text-xs text-emerald-700 mt-1">
                      Thank you for contacting Manas Traders Tikapur. Our store team will reach out to you at{' '}
                      <span className="font-bold">{formData.phone || 'your phone number'}</span> shortly.
                    </p>
                  </div>
                </div>
              )}

              {status.error && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold text-rose-900">Submission Error</strong>
                    <p className="text-xs text-rose-700 mt-1">{status.error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Binod Bhandari"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-[#0B7A3D] text-xs bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 9848500665"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-[#0B7A3D] text-xs bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Inquiry Type
                    </label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value as any })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-[#0B7A3D] text-xs bg-slate-50/50 font-medium"
                    >
                      <option value="general">General Grocery Inquiry</option>
                      <option value="wholesale">Wholesale & Bulk Order Rate</option>
                      <option value="delivery">Tikapur Home Delivery / Pickup</option>
                      <option value="feedback">Feedback or Product Suggestion</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. name@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-[#0B7A3D] text-xs bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subject / Topic
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Inquiry regarding wholesale prices for Rice 25kg & Mustard Oil"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-[#0B7A3D] text-xs bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Message or Grocery List <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your message or grocery item list here..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-[#0B7A3D] text-xs bg-slate-50/50"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={status.submitting}
                  variant="primary"
                  size="lg"
                  className="w-full font-bold shadow-md"
                  icon={<Send className="w-4 h-4" />}
                >
                  {status.submitting ? 'Submitting to Supabase Database...' : 'Submit Inquiry Form'}
                </Button>
              </form>
            </Card>
          </div>
        </div>

        {/* Embedded Interactive Google Map Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-bold font-playfair text-slate-900 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-[#0B7A3D]" />
                Find Us on Google Map
              </h2>
              <p className="text-xs text-slate-500">
                Main Market Road, Tikapur-01, Kailali, Sudurpashchim Province, Nepal
              </p>
            </div>
            <a
              href="https://maps.google.com/?q=Tikapur+Kailali+Nepal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shrink-0"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="w-full h-80 sm:h-96 rounded-3xl overflow-hidden border border-slate-200/90 shadow-lg relative bg-slate-100">
            <iframe
              title="Manas Traders Google Map Tikapur Kailali Nepal"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14088.19069279766!2d81.1186!3d28.5132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39a2123e4210cb3d%3A0xb5e571e72e1e3e78!2sTikapur%2C%20Nepal!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
