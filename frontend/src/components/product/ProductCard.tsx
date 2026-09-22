import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Check, Plus, Eye } from 'lucide-react';
import { Product } from '../../types/Product';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../utils/imageUtils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const cartItem = cartItems.find((item) => item.product._id === product._id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/products/${product._id}`);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: '#f9fafb',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        transition: 'var(--transition)',
        boxShadow: isHovered ? 'var(--shadow-md)' : 'none',
      }}
    >
      <Link to={`/products/${product._id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Product Image & Hover Action Overlay */}
        <div
          style={{
            width: '100%',
            height: '160px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            overflow: 'hidden',
          }}
        >
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            style={{
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain',
              transition: 'transform 0.3s ease',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
          />

          {/* Hover Buttons Overlay (Add To Cart & Quick View) matching image */}
          {isHovered && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(2px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                borderRadius: '8px',
                animation: 'fadeIn 0.2s ease',
              }}
            >
              <button
                onClick={handleAdd}
                className="btn btn-primary"
                style={{
                  padding: '0.45rem 1.1rem',
                  fontSize: '0.85rem',
                  borderRadius: '9999px',
                }}
              >
                {quantityInCart > 0 ? (
                  <>
                    <Check size={14} /> Added ({quantityInCart})
                  </>
                ) : (
                  'Add To Cart'
                )}
              </button>

              <button
                onClick={handleQuickView}
                className="btn btn-dark"
                style={{
                  padding: '0.35rem 0.9rem',
                  fontSize: '0.78rem',
                  borderRadius: '9999px',
                  backgroundColor: '#1f2937',
                }}
              >
                <Eye size={12} /> Quick View
              </button>
            </div>
          )}
        </div>

        {/* Rating Badge (Green star rating ★ 4.0 matching reference image) */}
        <div style={{ marginBottom: '0.4rem' }}>
          <span
            style={{
              backgroundColor: '#22c55e',
              color: '#ffffff',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.15rem 0.45rem',
              borderRadius: '4px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.2rem',
            }}
          >
            ★ {product.rating || '4.0'}
          </span>
        </div>

        {/* Product Title, Subtitle, & Price */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 'auto' }}>
          <div>
            <h3
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                lineHeight: '1.2',
                marginBottom: '0.15rem',
              }}
            >
              {product.name}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
              {product.categoryName || 'Grocery & Staples'}
            </span>
          </div>

          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827' }}>
            ₹{product.price}
          </span>
        </div>
      </Link>
    </div>
  );
};
