import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductFilter } from '../components/product/ProductFilter';
import { ProductGrid } from '../components/product/ProductGrid';
import { productService, INITIAL_CATEGORIES } from '../services/productService';
import { Product, Category, ProductFilterParams } from '../types/Product';

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<ProductFilterParams>({
    category: searchParams.get('category') || undefined,
    search: searchParams.get('search') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    sortBy: (searchParams.get('sortBy') as any) || 'popular',
  });

  // Sync state when searchParams change from external sources (e.g. Navbar search bar)
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: searchParams.get('category') || undefined,
      search: searchParams.get('search') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      sortBy: (searchParams.get('sortBy') as any) || 'popular',
    }));
  }, [searchParams]);

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const [prods, cats] = await Promise.all([
          productService.getProducts(filters),
          productService.getCategories(),
        ]);
        setProducts(prods);
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [filters]);

  const handleFilterChange = (newFilters: ProductFilterParams) => {
    setFilters(newFilters);
    const newParams: Record<string, string> = {};
    if (newFilters.category && newFilters.category !== 'all') newParams.category = newFilters.category;
    if (newFilters.search) newParams.search = newFilters.search;
    if (newFilters.minPrice) newParams.minPrice = String(newFilters.minPrice);
    if (newFilters.maxPrice) newParams.maxPrice = String(newFilters.maxPrice);
    if (newFilters.sortBy) newParams.sortBy = newFilters.sortBy;
    setSearchParams(newParams);
  };

  const handleReset = () => {
    const resetFilters: ProductFilterParams = { sortBy: 'popular' };
    setFilters(resetFilters);
    setSearchParams({});
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)' }}>
          {filters.search
            ? `Search Results for "${filters.search}"`
            : filters.category && filters.category !== 'all'
            ? 'Filtered Groceries'
            : 'All Fresh Groceries'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Showing {products.length} farm-fresh items available for instant 15-min delivery
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: '2rem',
          alignItems: 'start',
        }}
      >
        <ProductFilter
          categories={categories}
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />

        <div>
          <ProductGrid products={products} loading={loading} />
        </div>
      </div>
    </div>
  );
};
