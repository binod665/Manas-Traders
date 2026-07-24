import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const reviews = [
    {
      id: 1,
      name: 'Ramesh Chaudhary',
      role: 'Local Resident, Tikapur-01',
      rating: 5,
      comment: 'Manas Traders is our family’s go-to store for monthly rice sacks and mustard oil. Always genuine quality and polite service!',
    },
    {
      id: 2,
      name: 'Binod Bhandari',
      role: 'Hotel & Restaurant Owner',
      rating: 5,
      comment: 'We buy bulk pulses, spices, and Wai Wai boxes at wholesale prices for our kitchen. Delivery and order loading in Tikapur is very prompt.',
    },
    {
      id: 3,
      name: 'Sunita Joshi',
      role: 'Household Buyer, Kailali',
      rating: 5,
      comment: 'I call 9848500664 before leaving home, and my grocery list is already packed when I arrive at the store. Super convenient!',
    },
  ];

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-[#0B7A3D] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Customer Testimonials
        </span>
        <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
          What Our Local Customers Say
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm mt-1">
          Read feedback from local families and commercial partners in Tikapur, Kailali.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev, idx) => (
          <motion.div
            key={rev.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-700 text-xs sm:text-sm italic leading-relaxed">
                "{rev.comment}"
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-xs">{rev.name}</h4>
                <p className="text-[11px] text-slate-500">{rev.role}</p>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0B7A3D] bg-emerald-50 px-2 py-0.5 rounded-md">
                <CheckCircle2 className="w-3 h-3" />
                Verified Buyer
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
