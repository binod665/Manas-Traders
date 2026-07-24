import { MapPin, Phone, Clock, Globe } from 'lucide-react';
import { useStoreInfo } from '../../hooks/useStoreInfo';

export function TopBar() {
  const { storeInfo, primaryPhone, secondaryPhone } = useStoreInfo();

  return (
    <div className="bg-slate-900 text-slate-300 text-xs py-2 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>{storeInfo.address.city}, {storeInfo.address.district}, {storeInfo.address.country}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Sun - Fri: 6:00 AM - 8:30 PM</span>
          </div>
          <a
            href={`https://${storeInfo.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1 text-slate-400 hover:text-emerald-300 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
            <span>{storeInfo.domain}</span>
          </a>
        </div>

        <div className="flex items-center gap-3 font-semibold text-white">
          <span className="text-slate-400 text-xs font-normal">Call Us:</span>
          <a
            href={`tel:${primaryPhone}`}
            className="flex items-center gap-1 hover:text-emerald-400 transition-colors bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700"
          >
            <Phone className="w-3 h-3 text-emerald-400" />
            <span>{primaryPhone}</span>
          </a>
          <a
            href={`tel:${secondaryPhone}`}
            className="hidden sm:flex items-center gap-1 hover:text-emerald-400 transition-colors bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700"
          >
            <Phone className="w-3 h-3 text-emerald-400" />
            <span>{secondaryPhone}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
