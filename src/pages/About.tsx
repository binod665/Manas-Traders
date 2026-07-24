import { SEO } from '../components/ui/SEO';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useStoreInfo } from '../hooks/useStoreInfo';
import { BuildingStorefrontIcon, UserGroupIcon, HeartIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { MapPin, Phone, Globe } from 'lucide-react';

export function About() {
  const { storeInfo, primaryPhone, secondaryPhone } = useStoreInfo();

  return (
    <div className="py-12 bg-slate-50 min-h-[80vh]">
      <SEO
        title="About Us"
        description="Learn more about Manas Traders - Premier grocery store and wholesale supplier in Tikapur, Kailali, Nepal."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="emerald">About Our Store</Badge>
          <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
            Serving Tikapur with Honesty and Quality
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            <strong className="text-slate-900">{storeInfo.name}</strong> is a dedicated grocery store and wholesale distribution hub located in Tikapur, Kailali, Sudurpashchim Province, Nepal.
          </p>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <Card className="p-8 space-y-4">
              <h2 className="text-2xl font-bold font-playfair text-slate-900">
                Our Story & Mission
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Founded with a vision to provide dependable, genuine, and high-quality food products to families and businesses in Kailali, Manas Traders has built a solid reputation for fair pricing and customer satisfaction.
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Whether you need everyday groceries like premium rice, edible oils, pulses, tea, and spices, or bulk wholesale supply for your hotel, retail counter, or eatery, we ensure you receive pristine quality with every transaction.
              </p>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card hoverEffect={false} className="p-6 bg-emerald-50/60 border-emerald-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3">
                  <ShieldCheckIcon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">Authentic Quality</h3>
                <p className="text-xs text-slate-600">Sourced directly from verified manufacturers and trusted regional suppliers.</p>
              </Card>

              <Card hoverEffect={false} className="p-6 bg-amber-50/60 border-amber-100">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center mb-3">
                  <UserGroupIcon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">Community First</h3>
                <p className="text-xs text-slate-600">Committed to long-term relationships with local households in Tikapur.</p>
              </Card>
            </div>
          </div>

          {/* Right Info Box */}
          <div className="lg:col-span-5">
            <Card className="bg-slate-900 text-white p-8 space-y-6 border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                  <BuildingStorefrontIcon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-playfair text-white">{storeInfo.name}</h3>
                  <p className="text-xs text-emerald-400 font-medium">Tikapur, Kailali, Nepal</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs text-slate-400">Address</span>
                    <span className="font-medium text-slate-200">{storeInfo.address.fullAddress}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs text-slate-400">Phone Contacts</span>
                    <span className="font-medium text-amber-300 block">{primaryPhone}</span>
                    <span className="font-medium text-amber-300 block">{secondaryPhone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs text-slate-400">Official Web Domain</span>
                    <a href={`https://${storeInfo.domain}`} target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-medium hover:underline">
                      {storeInfo.domain}
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
