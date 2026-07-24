import { SEO } from '../components/ui/SEO';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { ShoppingCart, Truck, PackageCheck, PhoneCall, Check, Building, Sparkles } from 'lucide-react';
import { useStoreInfo } from '../hooks/useStoreInfo';

export function Services() {
  const { storeInfo, primaryPhone } = useStoreInfo();

  return (
    <div className="py-12 bg-slate-50 min-h-[80vh]">
      <SEO
        title="Services & Wholesale"
        description="Grocery retail and wholesale distribution services provided by Manas Traders in Tikapur, Kailali, Nepal."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="emerald">Services Overview</Badge>
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-slate-900">
            Retail Groceries & Wholesale Distribution
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Tailored supply solutions for everyday homes and commercial business clients in Kailali district.
          </p>
        </div>

        {/* 2 Main Service Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service 1: Retail */}
          <Card className="p-8 space-y-6 border-emerald-100 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <Badge variant="emerald">Retail Grocery Shopping</Badge>
              <h2 className="text-2xl font-bold font-playfair text-slate-900">Daily Home Essentials</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Walk into our Tikapur store for all your kitchen and home requirements. We stock fresh rice, lentil pulses (daal), mustard oil, ghee, sugar, salt, packed snacks, spices, beverages, and personal hygiene products.
              </p>

              <div className="pt-2 space-y-2 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Fair and transparent retail prices</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Pre-order by phone for express pickup</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Genuine branded packaged items</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <a href={`tel:${primaryPhone}`}>
                <Button variant="primary" size="md" icon={<PhoneCall className="w-4 h-4" />}>
                  Call Retail Counter: {primaryPhone}
                </Button>
              </a>
            </div>
          </Card>

          {/* Service 2: Wholesale */}
          <Card className="p-8 space-y-6 border-amber-100 bg-slate-900 text-white flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                <Building className="w-6 h-6" />
              </div>
              <Badge variant="amber">Wholesale Supply</Badge>
              <h2 className="text-2xl font-bold font-playfair text-white">Commercial Wholesale Supply</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                We partner with local hotels, restaurants, sweet shops, hostels, canteens, and small retail shopkeepers across Kailali to deliver high-volume orders with bulk price benefits.
              </p>

              <div className="pt-2 space-y-2 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>50kg rice bags, oil tins, sugar sacks & spice cartons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Custom quotes for recurring institutional supply</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Flexible loading & transportation coordination</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800">
              <Link to="/contact">
                <Button variant="secondary" size="md">
                  Submit Wholesale Inquiry
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Process Banner */}
        <Card className="p-8 bg-emerald-50/50 border-emerald-100 text-center space-y-6">
          <Badge variant="emerald">Simple Ordering Process</Badge>
          <h3 className="text-2xl font-bold font-playfair text-slate-900">How to Order from Manas Traders</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm mb-3">1</span>
              <h4 className="font-bold text-slate-900 mb-1">Call or Message</h4>
              <p className="text-xs text-slate-600">Reach out via phone (+977 9848500664 / 9824600477) or online form.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm mb-3">2</span>
              <h4 className="font-bold text-slate-900 mb-1">Order Packing</h4>
              <p className="text-xs text-slate-600">Our team prepares your grocery items with care in Tikapur.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm mb-3">3</span>
              <h4 className="font-bold text-slate-900 mb-1">Pickup or Delivery</h4>
              <p className="text-xs text-slate-600">Collect at store counter or arrange local transportation.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
