import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FolderTree } from 'lucide-react';
import { ProductFilter } from '../components/product/ProductFilter';
import { ProductGrid } from '../components/product/ProductGrid';
import { productService } from '../services/productService';
import { Product, Category, ProductFilterParams } from '../types/Product';
import { getImageUrl } from '../utils/imageUtils';

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryParam = searchParams.get('category') || undefined;
  const searchParam = searchParams.get('search') || undefined;
  const minPriceParam = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPriceParam = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const sortByParam = (searchParams.get('sortBy') as any) || 'popular';

  const filters: ProductFilterParams = useMemo(() => ({
    category: categoryParam,
    search: searchParam,
    minPrice: minPriceParam,
    maxPrice: maxPriceParam,
    sortBy: sortByParam,
  }), [categoryParam, searchParam, minPriceParam, maxPriceParam, sortByParam]);

  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const [prods, cats] = await Promise.all([
          productService.getProducts(filters),
          productService.getCategories(),
        ]);
        if (isMounted) {
          setProducts(prods);
          setCategories(cats);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCatalog();

    return () => {
      isMounted = false;
    };
  }, [categoryParam, searchParam, minPriceParam, maxPriceParam, sortByParam]);

  const handleFilterChange = (newFilters: ProductFilterParams) => {
    const newParams: Record<string, string> = {};
    if (newFilters.category && newFilters.category !== 'all') newParams.category = newFilters.category;
    if (newFilters.search) newParams.search = newFilters.search;
    if (newFilters.minPrice) newParams.minPrice = String(newFilters.minPrice);
    if (newFilters.maxPrice) newParams.maxPrice = String(newFilters.maxPrice);
    if (newFilters.sortBy && newFilters.sortBy !== 'popular') newParams.sortBy = newFilters.sortBy;
    setSearchParams(newParams);
  };

  const handleReset = () => {
    setSearchParams({});
  };

  const isAllCategoriesView = (!filters.category || filters.category === 'all') && !filters.search;

  const selectedCategoryObj = categories.find(
    (c) => c._id === filters.category || c.name.toLowerCase() === filters.category?.toLowerCase()
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)' }}>
          {filters.search
            ? `Search Results for "${filters.search}"`
            : isAllCategoriesView
            ? 'All Categories'
            : selectedCategoryObj
            ? selectedCategoryObj.name
            : 'Filtered Groceries'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          {isAllCategoriesView
            ? `Browse all ${categories.length} available grocery categories`
            : `Showing ${products.length} farm-fresh items available for instant 15-min delivery`}
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
          {isAllCategoriesView ? (
            loading ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="glass-card"
                    style={{
                      height: '180px',
                      borderRadius: '20px',
                      backgroundColor: '#ffffff',
                      animation: 'pulse 1.5s infinite ease-in-out',
                    }}
                  />
                ))}
              </div>
            ) : categories.length === 0 ? (
              <div
                className="glass-card"
                style={{
                  textAlign: 'center',
                  padding: '4rem 2rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                }}
              >
                <FolderTree size={40} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--secondary)' }}>
                  No categories found
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  There are currently no categories available.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: '1.5rem',
                }}
              >
                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    onClick={() => handleFilterChange({ ...filters, category: cat._id })}
                    className="glass-card animate-fade-in"
                    style={{
                      padding: '1.5rem',
                      borderRadius: '20px',
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--border)',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '14px',
                          backgroundColor: 'var(--primary-light)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '1rem',
                        }}
                      >
                        {cat.image ? (
                          <img
                            src={getImageUrl(cat.image)}
                            alt={cat.name}
                            style={{ width: '36px', height: '36px', objectFit: 'contain' }}
                          />
                        ) : (
                          <FolderTree size={26} color="var(--primary)" />
                        )}
                      </div>

                      <h3
                        style={{
                          fontSize: '1.15rem',
                          fontWeight: 800,
                          color: 'var(--secondary)',
                          marginBottom: '0.4rem',
                        }}
                      >
                        {cat.name}
                      </h3>

                      <p
                        style={{
                          fontSize: '0.85rem',
                          color: 'var(--text-muted)',
                          lineHeight: 1.45,
                        }}
                      >
                        {cat.description || 'Explore fresh produce items in this category.'}
                      </p>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '0.75rem',
                        borderTop: '1px solid var(--border)',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: 'var(--primary-hover)',
                        }}
                      >
                        Browse Category →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <ProductGrid products={products} loading={loading} />
          )}
        </div>
      </div>
    </div>
  );
};
