import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Plus, Minus, ShoppingCart, ArrowLeft, ShieldCheck, Leaf, Truck } from 'lucide-react';
import { productService } from '../services/productService';
import { Product } from '../types/Product';
import { useCart } from '../context/CartContext';
import { Loader } from '../components/common/Loader';

import { getImageUrl } from '../utils/imageUtils';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <Loader fullScreen text="Fetching product specs..." />;

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2>Product not found</h2>
        <button onClick={() => navigate('/products')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Products
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: 'var(--text-muted)',
          fontWeight: 600,
          fontSize: '0.9rem',
          width: 'fit-content',
        }}
      >
        <ArrowLeft size={16} /> Back to Catalog
      </button>

      <div
        className="glass-card"
        style={{
          padding: '2rem',
          borderRadius: '24px',
          backgroundColor: '#ffffff',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
        }}
      >
        {/* Product Image Gallery */}
        <div style={{ position: 'relative' }}>
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            style={{
              width: '100%',
              borderRadius: '20px',
              objectFit: 'cover',
              maxHeight: '420px',
              backgroundColor: '#f8fafc',
            }}
          />
          {product.isOrganic && (
            <span
              className="badge badge-green"
              style={{ position: 'absolute', top: '16px', left: '16px', fontSize: '0.85rem' }}
            >
              <Leaf size={14} style={{ marginRight: '4px' }} /> 100% Organic Certified
            </span>
          )}
        </div>

        {/* Product Info & Action Box */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {product.categoryName || 'Produce'}
            </span>

            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--secondary)', margin: '0.25rem 0 0.75rem', lineHeight: 1.2 }}>
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#d97706', fontWeight: 700 }}>
                <Star size={18} fill="#f59e0b" color="#f59e0b" />
                <span>{product.rating || 4.8}</span>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                ({product.numReviews || 120} verified customer reviews)
              </span>
            </div>

            {/* Price Box */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary-hover)' }}>
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  ₹{product.originalPrice}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="badge badge-amber" style={{ fontSize: '0.85rem' }}>
                  Save {discountPercent}%
                </span>
              )}
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                Unit: <strong>{product.unit}</strong>
              </span>
            </div>

            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1rem', marginBottom: '2rem' }}>
              {product.description}
            </p>

            {/* Quantity Picker & Add to Cart */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  backgroundColor: '#f1f5f9',
                  padding: '0.5rem 0.85rem',
                  borderRadius: '12px',
                }}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ padding: '0.2rem', display: 'flex', alignItems: 'center' }}
                >
                  <Minus size={16} />
                </button>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', minWidth: '30px', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ padding: '0.2rem', display: 'flex', alignItems: 'center' }}
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="btn btn-primary"
                style={{ flex: 1, padding: '0.9rem 1.5rem', fontSize: '1.05rem' }}
              >
                <ShoppingCart size={20} />
                {added ? 'Added to Cart ✓' : 'Add to Cart'}
              </button>
            </div>
          </div>

          {/* Delivery Guarantees */}
          <div
            style={{
              padding: '1.25rem',
              backgroundColor: '#f8fafc',
              borderRadius: '16px',
              border: '1px solid var(--border)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              fontSize: '0.85rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Truck size={20} color="var(--primary)" />
              <div>
                <strong style={{ display: 'block', color: 'var(--text-main)' }}>Fast 15-Min Delivery</strong>
                <span style={{ color: 'var(--text-muted)' }}>Express doorstep arrival</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <ShieldCheck size={20} color="var(--primary)" />
              <div>
                <strong style={{ display: 'block', color: 'var(--text-main)' }}>Freshness Guaranteed</strong>
                <span style={{ color: 'var(--text-muted)' }}>100% Quality inspected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
