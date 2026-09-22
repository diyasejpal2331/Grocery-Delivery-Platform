import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, MapPin, ShoppingCart, Heart } from 'lucide-react';
import { productService } from '../../services/productService';
import { Category } from '../../types/Product';

export const Footer: React.FC = () => {
  const location = useLocation();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    productService.getCategories().then(setCategories).catch(() => setCategories([]));
  }, [location.pathname]);

  if (
    location.pathname.startsWith('/admin') ||
    location.pathname === '/dashboard' ||
    location.pathname === '/user/dashboard' ||
    location.pathname === '/customer/dashboard'
  ) {
    return null;
  }
  return (
    <footer
      style={{
        backgroundColor: '#1f2937',
        color: '#f9fafb',
        paddingTop: '3.5rem',
        paddingBottom: '2rem',
        marginTop: '4rem',
        borderTop: '4px solid var(--primary)',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
        }}
      >
        {/* Brand info matching header logo */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                border: '2px solid var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
              }}
            >
              <ShoppingCart size={20} color="var(--primary)" />
            </div>
            <span style={{ fontSize: '1.3rem', fontWeight: 800 }}>
              grocery <span style={{ color: 'var(--primary)' }}>Shopping</span>
            </span>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1rem' }}>
            Your comfort is our business. We bring farm-fresh organic produce, dairy, and household essentials directly to your door with up to 70% off everyday discounts.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#ffffff' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: '#9ca3af' }}>
            <li><Link to="/" style={{ color: '#9ca3af' }}>Home</Link></li>
            <li><Link to="/products" style={{ color: '#9ca3af' }}>Categories</Link></li>
            <li><Link to="/orders" style={{ color: '#9ca3af' }}>Track Orders</Link></li>
            <li><Link to="/profile" style={{ color: '#9ca3af' }}>My Profile</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#ffffff' }}>Categories</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: '#9ca3af' }}>
            {categories.length > 0 ? (
              categories.slice(0, 5).map((cat) => (
                <li key={cat._id}>
                  <Link to={`/products?category=${encodeURIComponent(cat._id)}`} style={{ color: '#9ca3af' }}>
                    {cat.name}
                  </Link>
                </li>
              ))
            ) : (
              <li>
                <Link to="/products" style={{ color: '#9ca3af' }}>
                  All Categories
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#ffffff' }}>Contact Info</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem', color: '#9ca3af' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={15} color="var(--primary)" /> <span>+8100-12345-1234</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={15} color="var(--primary)" /> <span>example@mail.com</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={15} color="var(--primary)" /> <span>12980 Mignal Hill Road California</span>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1280px',
          margin: '2.5rem auto 0',
          padding: '1.5rem 1.5rem 0',
          borderTop: '1px solid #374151',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: '#9ca3af',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <p>© {new Date().getFullYear()} grocery Shopping. All rights reserved.</p>
        <p style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          Crafted with <Heart size={14} color="var(--primary)" fill="var(--primary)" /> for healthy living
        </p>
      </div>
    </footer>
  );
};
