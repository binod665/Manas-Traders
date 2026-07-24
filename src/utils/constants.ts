import { StoreContactInfo, NavItem } from '../types';

export const STORE_INFO: StoreContactInfo = {
  name: 'Manas Traders',
  domain: 'manastraders.com.np',
  address: {
    city: 'Tikapur',
    district: 'Kailali',
    country: 'Nepal',
    fullAddress: 'Main Market Road, Tikapur-01, Kailali, Sudurpashchim Province, Nepal',
  },
  phones: ['9848500665', '9824600477'],
  email: 'info@manastraders.com.np',
  openingHours: [
    { days: 'Sunday - Friday', time: '6:00 AM - 8:30 PM' },
    { days: 'Saturday', time: '7:00 AM - 7:00 PM' },
  ],
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Store Info & Hours', path: '/store-info' },
  { label: 'Services & Wholesale', path: '/services' },
  { label: 'Contact Us', path: '/contact' },
];

export const HIGHLIGHTS = [
  {
    id: 'fresh-quality',
    title: '100% Authentic Quality',
    description: 'Fresh daily essentials, verified regional spices, and branded kitchen staples directly sourced for Tikapur homes.',
    iconName: 'ShieldCheck',
  },
  {
    id: 'wholesale-retail',
    title: 'Retail & Wholesale',
    description: 'Unbeatable rates for both household daily shopping and bulk business supplier needs across Kailali district.',
    iconName: 'ShoppingBag',
  },
  {
    id: 'fast-service',
    title: 'Prompt Local Service',
    description: 'Friendly customer service with quick phone orders and convenient local store pickup in Tikapur Market.',
    iconName: 'PhoneCall',
  },
  {
    id: 'community-trust',
    title: 'Trusted Community Partner',
    description: 'Proudly serving families, local eateries, and institutions in Sudurpashchim with transparent pricing.',
    iconName: 'HeartHandshake',
  },
];
