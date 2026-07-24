import { Link } from 'react-router-dom';
import { SEO } from '../components/ui/SEO';
import { Button } from '../components/ui/Button';
import { Home, ArrowLeft } from 'lucide-react';
import { BuildingStorefrontIcon } from '@heroicons/react/24/outline';

export function NotFound() {
  return (
    <div className="py-20 bg-slate-50 min-h-[70vh] flex items-center justify-center">
      <SEO title="Page Not Found" />

      <div className="text-center max-w-md mx-auto px-4 space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
          <BuildingStorefrontIcon className="w-9 h-9" />
        </div>

        <h1 className="font-playfair text-4xl font-bold text-slate-900">
          404 - Page Not Found
        </h1>

        <p className="text-slate-600 text-sm leading-relaxed">
          The page you are looking for does not exist or has been moved. You can return to our homepage or contact Manas Traders directly.
        </p>

        <div className="flex justify-center gap-3 pt-2">
          <Link to="/">
            <Button variant="primary" icon={<Home className="w-4 h-4" />}>
              Back to Homepage
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" icon={<ArrowLeft className="w-4 h-4" />}>
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
