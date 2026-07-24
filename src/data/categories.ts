export interface Category {
  id: string;
  name: string;
  nepaliName: string;
  icon: string;
  color: string;
  itemCount: number;
  image: string;
  popularItems: string[];
}

export const CATEGORIES: Category[] = [
  {
    id: 'rice-atta-ghee',
    name: 'Rice, Atta & Ghee',
    nepaliName: 'चामल, पिठो र घिउ',
    icon: 'Wheat',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    itemCount: 42,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
    popularItems: ['Jeera Masino Rice', 'Chakki Atta', 'Pure Cow Ghee', 'Basmati Rice'],
  },
  {
    id: 'fresh-veggies',
    name: 'Fresh Vegetables & Fruits',
    nepaliName: 'ताजा तरकारी र फलफूल',
    icon: 'Apple',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    itemCount: 38,
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80',
    popularItems: ['Local Onions', 'Potatoes', 'Mustard Greens', 'Fresh Apples'],
  },
  {
    id: 'pulses-daal',
    name: 'Pulses & Daal',
    nepaliName: 'दाल र गेडागुडी',
    icon: 'Bean',
    color: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    itemCount: 29,
    image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=400&q=80',
    popularItems: ['Rahar Daal', 'Kalo Maas', 'Yellow Moong', 'Local Rajma'],
  },
  {
    id: 'cooking-oils',
    name: 'Edible Oils & Cooking',
    nepaliName: 'खाना पकाउने तेल',
    icon: 'Droplet',
    color: 'bg-amber-50 text-amber-800 border-amber-200',
    itemCount: 24,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80',
    popularItems: ['Mustard Oil (तोरीको तेल)', 'Sunflower Oil', 'Soyabean Oil'],
  },
  {
    id: 'spices-masala',
    name: 'Spices & Masala',
    nepaliName: 'मसला तथा नुन',
    icon: 'Flame',
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    itemCount: 35,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80',
    popularItems: ['Turmeric Powder', 'Meat Masala', 'Garam Masala', 'Iodized Salt'],
  },
  {
    id: 'tea-beverages',
    name: 'Tea, Coffee & Drinks',
    nepaliName: 'चिया, कफी र पेय पदार्थ',
    icon: 'Coffee',
    color: 'bg-teal-50 text-teal-800 border-teal-200',
    itemCount: 31,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&q=80',
    popularItems: ['CTC Dust Tea', 'Green Tea', 'Instant Coffee', 'Cold Drinks'],
  },
  {
    id: 'dairy-bakery',
    name: 'Dairy, Milk & Bakery',
    nepaliName: 'दूध, दही र बेकरी',
    icon: 'Milk',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    itemCount: 22,
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&q=80',
    popularItems: ['Fresh Dairy Milk', 'Paneer', 'Curd (दही)', 'Fresh Bread'],
  },
  {
    id: 'snacks-noodles',
    name: 'Snacks & Instant Food',
    nepaliName: 'खाजा र चाउचाउ',
    icon: 'UtensilsCrossed',
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    itemCount: 45,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80',
    popularItems: ['Wai Wai Noodles', 'Current Noodles', 'Digestive Biscuits', 'Bhujia'],
  },
];
