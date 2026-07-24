import { SEO } from '../components/ui/SEO';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useStoreInfo } from '../hooks/useStoreInfo';
import { Clock, MapPin, Phone, ShieldCheck, Truck, CreditCard, ShoppingBag } from 'lucide-react';

export function StoreInfo() {
  const { storeInfo, primaryPhone, secondaryPhone } = useStoreInfo();

  return (
    <div className="py-12 bg-slate-50 min-h-[80vh]">
      <SEO
        title="Store Info & Opening Hours"
        description="Check store hours, phone numbers, and location details for Manas Traders in Tikapur, Kailali, Nepal."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="emerald">Store Details</Badge>
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-slate-900">
            Location, Hours & Contact Information
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Everything you need to visit or place a phone order with <strong className="text-slate-900">{storeInfo.name}</strong> in Tikapur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Operating Hours */}
          <Card className="p-6 space-y-4 border-emerald-100">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-playfair">Store Opening Hours</h2>
            <div className="space-y-3 pt-2 text-sm">
              {storeInfo.openingHours.map((hours, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-none">
                  <span className="text-slate-600 font-medium">{hours.days}</span>
                  <span className="font-bold text-emerald-700">{hours.time}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 pt-2">
              Note: Early morning phone orders are accepted starting at 6:00 AM.
            </p>
          </Card>

          {/* Card 2: Phone Contacts */}
          <Card className="p-6 space-y-4 border-amber-100">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <Phone className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-playfair">Direct Phone Lines</h2>
            <div className="space-y-3 pt-2 text-sm">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 block">Primary Contact</span>
                <a href={`tel:${primaryPhone}`} className="text-lg font-bold text-slate-900 hover:text-emerald-600">
                  +977 {primaryPhone}
                </a>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 block">Secondary Contact</span>
                <a href={`tel:${secondaryPhone}`} className="text-lg font-bold text-slate-900 hover:text-emerald-600">
                  +977 {secondaryPhone}
                </a>
              </div>
            </div>
            <a href={`tel:${primaryPhone}`} className="block pt-2">
              <Button variant="secondary" size="md" className="w-full">
                Call Direct Now
              </Button>
            </a>
          </Card>

          {/* Card 3: Address & Location */}
          <Card className="p-6 space-y-4 border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
              <MapPin className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-playfair">Physical Address</h2>
            <div className="text-sm space-y-2 text-slate-600">
              <p className="font-semibold text-slate-900">{storeInfo.name}</p>
              <p>{storeInfo.address.fullAddress}</p>
              <p className="text-xs text-slate-500">
                Location: Tikapur Market, Kailali District, Sudurpashchim Province, Nepal
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Easy Store Pickup Available
              </span>
            </div>
          </Card>
        </div>

        {/* Additional Services Banner */}
        <Card className="bg-slate-900 text-white p-8 rounded-3xl space-y-6">
          <h3 className="text-2xl font-bold font-playfair text-white">
            Accepted Payments & Ordering Services
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white">Payment Options</h4>
                <p className="text-xs text-slate-400">Cash, Fonepay QR, eSewa, Bank Transfer</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white">Bulk Pickups</h4>
                <p className="text-xs text-slate-400">Order ahead by phone for rapid loading</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-teal-400 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white">Local Wholesale Supply</h4>
                <p className="text-xs text-slate-400">Arranged for Tikapur area businesses</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
