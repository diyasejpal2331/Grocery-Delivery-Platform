import React from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '../../types/Product';
import { ShoppingBag } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, loading }) => {
  if (loading) {
    return (
      <div className="grid-products">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="glass-card"
            style={{
              height: '320px',
              borderRadius: '16px',
              backgroundColor: '#ffffff',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '160px',
                backgroundColor: '#e2e8f0',
                borderRadius: '12px',
                animation: 'pulse 1.5s infinite ease-in-out',
              }}
            />
            <div style={{ width: '40%', height: '14px', backgroundColor: '#e2e8f0', borderRadius: '4px' }} />
            <div style={{ width: '80%', height: '20px', backgroundColor: '#e2e8f0', borderRadius: '4px' }} />
            <div style={{ width: '50%', height: '24px', backgroundColor: '#e2e8f0', borderRadius: '4px', marginTop: 'auto' }} />
          </div>
        ))}
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div
        className="glass-card"
        style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          margin: '1rem 0',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
          }}
        >
          <ShoppingBag size={32} />
        </div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          No groceries found
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '400px', margin: '0 auto' }}>
          We couldn't find any products matching your search criteria. Try removing some filters or search for another term.
        </p>
      </div>
    );
  }

  return (
    <div className="grid-products">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};
