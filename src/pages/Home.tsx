import React from 'react';
import { SEO } from '../components/ui/SEO';
import { HeroBanner } from '../components/home/HeroBanner';
import { CategoriesGrid } from '../components/home/CategoriesGrid';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { PopularProducts } from '../components/home/PopularProducts';
import { LatestProducts } from '../components/home/LatestProducts';
import { OffersSection } from '../components/home/OffersSection';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { ReviewsSection } from '../components/home/ReviewsSection';
import { Newsletter } from '../components/home/Newsletter';
import { CTASection } from '../components/home/CTASection';

export function Home() {
  return (
    <div className="space-y-4">
      <SEO
        title="Home | Manas Traders Tikapur Kailali Nepal"
        description="Manas Traders - Premier grocery store & wholesale distribution hub in Tikapur, Kailali, Nepal. Fresh daily rice, mustard oil, pulses, and spices."
      />

      <HeroBanner />
      <CategoriesGrid />
      <FeaturedProducts />
      <OffersSection />
      <PopularProducts />
      <LatestProducts />
      <WhyChooseUs />
      <ReviewsSection />
      <Newsletter />
      <CTASection />
    </div>
  );
}
