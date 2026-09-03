import React from 'react';
import { Filter, RotateCcw, Search } from 'lucide-react';
import { Category, ProductFilterParams } from '../../types/Product';

interface ProductFilterProps {
  categories: Category[];
  filters: ProductFilterParams;
  onFilterChange: (newFilters: ProductFilterParams) => void;
  onReset: () => void;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  categories,
  filters,
  onFilterChange,
  onReset,
}) => {
  return (
    <div
      className="glass-card"
      style={{
        padding: '1.5rem',
        borderRadius: '16px',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={20} color="var(--primary)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--secondary)' }}>Filters</h3>
        </div>
        <button
          onClick={onReset}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
          }}
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {/* Category selector */}
      <div>
        <label style={{ fontSize: '0.875rem', fontWeight: 700, display: 'block', marginBottom: '0.6rem' }}>
          Categories
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <button
            onClick={() => onFilterChange({ ...filters, category: 'all' })}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
              textAlign: 'left',
              fontSize: '0.9rem',
              fontWeight: !filters.category || filters.category === 'all' ? 700 : 500,
              backgroundColor: !filters.category || filters.category === 'all' ? 'var(--primary-light)' : 'transparent',
              color: !filters.category || filters.category === 'all' ? 'var(--primary-hover)' : 'var(--text-main)',
              transition: 'var(--transition)',
            }}
          >
            All Categories
          </button>

          {categories.map((cat) => {
            const isSelected = filters.category === cat._id || filters.category === cat.name;
            return (
              <button
                key={cat._id}
                onClick={() => onFilterChange({ ...filters, category: cat._id })}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  textAlign: 'left',
                  fontSize: '0.9rem',
                  fontWeight: isSelected ? 700 : 500,
                  backgroundColor: isSelected ? 'var(--primary-light)' : 'transparent',
                  color: isSelected ? 'var(--primary-hover)' : 'var(--text-main)',
                  transition: 'var(--transition)',
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <label style={{ fontSize: '0.875rem', fontWeight: 700, display: 'block', marginBottom: '0.6rem' }}>
          Price Range (₹)
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) =>
              onFilterChange({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })
            }
            className="form-control"
            style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
          />
          <span style={{ color: 'var(--text-muted)' }}>-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) =>
              onFilterChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })
            }
            className="form-control"
            style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Sort By Filter */}
      <div>
        <label style={{ fontSize: '0.875rem', fontWeight: 700, display: 'block', marginBottom: '0.6rem' }}>
          Sort By
        </label>
        <select
          value={filters.sortBy || 'popular'}
          onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as any })}
          className="form-control"
          style={{ width: '100%', fontSize: '0.9rem' }}
        >
          <option value="popular">Most Popular</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Customer Rating</option>
        </select>
      </div>
    </div>
  );
};
