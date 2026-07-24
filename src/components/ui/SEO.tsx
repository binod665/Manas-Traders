import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: string;
}

export function SEO({
  title,
  description = 'Manas Traders is the premier grocery store and wholesale supplier in Tikapur, Kailali, Nepal. Order fresh rice, edible oil, spices, pulses, and household supplies.',
  keywords = 'Manas Traders, Tikapur grocery, Kailali grocery, Nepal wholesale grocery, Jeera Rice Tikapur, Mustard Oil Kailali',
  image = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80',
  type = 'website',
}: SEOProps) {
  useEffect(() => {
    const fullTitle = `${title} | Manas Traders Tikapur`;
    document.title = fullTitle;

    // Helper to update or create meta tags
    const updateMetaTag = (selector: string, attrName: string, attrValue: string, content: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard Meta Tags
    updateMetaTag('meta[name="description"]', 'name', 'description', description);
    updateMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords);

    // OpenGraph Tags
    updateMetaTag('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    updateMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    updateMetaTag('meta[property="og:image"]', 'property', 'og:image', image);
    updateMetaTag('meta[property="og:type"]', 'property', 'og:type', type);

    // Twitter Card Tags
    updateMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    updateMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    updateMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', image);

  }, [title, description, keywords, image, type]);

  return null;
}
