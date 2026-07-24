import { useState, useEffect } from 'react';
import { Product, PRODUCTS } from '../data/products';
import { Category, CATEGORIES } from '../data/categories';
import {
  getProductsFromSupabase,
  getCategoriesFromSupabase,
  isSupabaseConfigured,
} from '../services/supabase';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFromSupabase, setIsFromSupabase] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!isSupabaseConfigured()) {
        setLoading(false);
        return;
      }

      try {
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          getProductsFromSupabase(),
          getCategoriesFromSupabase(),
        ]);

        if (isMounted) {
          if (fetchedProducts && fetchedProducts.length > 0) {
            setProducts(fetchedProducts);
            setIsFromSupabase(true);
          }
          if (fetchedCategories && fetchedCategories.length > 0) {
            setCategories(fetchedCategories);
          }
        }
      } catch (err) {
        console.error('Failed loading data from Supabase:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    products,
    categories,
    loading,
    isFromSupabase,
  };
}
