import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, PhoneCall, Truck, HeartHandshake, MapPin } from 'lucide-react';
import { BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { useStoreInfo } from '../../hooks/useStoreInfo';

export const WhyChooseUs: React.FC = () => {
  const { storeInfo } = useStoreInfo();

  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#0B7A3D]" />,
      title: '100% Genuine Quality',
      description: 'Directly sourced grains, fresh daily milk, unadulterated spices, and branded kitchen products.',
    },
    {
      icon: <PhoneCall className="w-6 h-6 text-[#FFC107]" />,
      title: 'Quick Phone Ordering',
      description: 'Call 9848500664 or 9824600477 to prepare your grocery list ahead of time.',
    },
    {
      icon: <Truck className="w-6 h-6 text-[#0B7A3D]" />,
      title: 'Retail & Bulk Wholesale',
      description: 'Unbeatable bulk rates for local Tikapur hotels, hostels, eateries, and retail shopkeepers.',
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-teal-600" />,
      title: 'Trusted Local Business',
      description: 'Serving Tikapur, Kailali, Nepal with transparent pricing and community respect.',
    },
  ];

  return (
    <section className="py-12 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0B7A3D] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Our Commitment
          </span>
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
            Why Tikapur Chooses {storeInfo.name}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Dedicated to bringing reliable food products and friendly service to every home in Sudurpashchim.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-200/80 hover:border-[#0B7A3D] transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">{item.title}</h3>
              <p className="text-slate-600 text-xs leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
