import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, ShieldCheck, Heart, Lock } from 'lucide-react';
import { BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { useStoreInfo } from '../../hooks/useStoreInfo';

export function Footer() {
  const { storeInfo, primaryPhone, secondaryPhone } = useStoreInfo();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: 'Home', path: '/' },
    { label: 'Products Catalog', path: '/products' },
    { label: 'Categories', path: '/categories' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact Us', path: '/contact' },
    { label: 'Admin Portal', path: '/admin' },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t-4 border-[#0B7A3D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Store Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B7A3D] flex items-center justify-center text-white">
                <BuildingStorefrontIcon className="w-6 h-6" />
              </div>
              <span className="font-playfair text-2xl font-bold text-white tracking-tight">
                {storeInfo.name}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your trusted partner for fresh grocery items, daily household supplies, and bulk wholesale distribution in Tikapur, Kailali, Nepal.
            </p>
            <div className="pt-2 flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#FFC107]" />
              <span>Registered Business in Tikapur, Kailali</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white text-base font-bold tracking-wide uppercase text-xs">
              Quick Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="hover:text-[#FFC107] transition-colors flex items-center gap-2"
                  >
                    <span className="text-emerald-500 text-xs">›</span>
                    <span>{item.label}</span>
                    {item.path === '/admin' && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        Admin
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Store Location & Contact */}
          <div className="space-y-4">
            <h3 className="text-white text-base font-bold tracking-wide uppercase text-xs">
              Location & Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">{storeInfo.address.fullAddress}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#FFC107] shrink-0" />
                <div className="flex flex-col">
                  <a href={`tel:${primaryPhone}`} className="hover:text-[#FFC107] font-semibold transition-colors">
                    +977 {primaryPhone}
                  </a>
                  <a href={`tel:${secondaryPhone}`} className="hover:text-[#FFC107] font-semibold transition-colors">
                    +977 {secondaryPhone}
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-emerald-400 shrink-0" />
                <a
                  href={`https://${storeInfo.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline"
                >
                  {storeInfo.domain}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Opening Hours */}
          <div className="space-y-4">
            <h3 className="text-white text-base font-bold tracking-wide uppercase text-xs">
              Opening Hours
            </h3>
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-3 text-xs">
              {storeInfo.openingHours.map((schedule, index) => (
                <div key={index} className="flex justify-between items-center border-b border-slate-700/60 pb-2 last:border-none last:pb-0">
                  <span className="text-slate-400 font-medium">{schedule.days}</span>
                  <span className="text-[#FFC107] font-bold">{schedule.time}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 italic">
              * Open early for morning grocery runs and bulk wholesale orders.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} {storeInfo.name} ({storeInfo.domain}). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-slate-400 hover:text-emerald-400 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin Dashboard</span>
            </Link>
            <div className="flex items-center gap-1 text-slate-400">
              <span>Serving Tikapur, Kailali, Nepal</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
