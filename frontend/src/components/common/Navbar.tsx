import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, MapPin, Mail, Phone, ShoppingCart, User as UserIcon, LogOut, ShieldCheck, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Modal } from './Modal';
import { productService } from '../../services/productService';
import { Category } from '../../types/Product';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
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

  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState<'about' | 'blog' | 'contact' | null>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      {/* Top Red Announcement Bar */}
      <div
        style={{
          backgroundColor: 'var(--topbar-bg)',
          color: '#ffffff',
          fontSize: '0.8rem',
          padding: '0.4rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ fontWeight: 600 }}>
          Get Up to 70% Discount Everyday
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.78rem', opacity: 0.95 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <MapPin size={13} /> 12980 Mignal Hill Road California, NA, 20110
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Mail size={13} /> example@mail.com
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Phone size={13} /> +8100-12345-1234
          </span>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid var(--border)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0.85rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}
        >
          {/* Left Navigation Links: Home, About Us, Categories, Blog, Contact Us */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.95rem', fontWeight: 700 }}>
            <Link to="/" style={{ color: 'var(--text-main)', transition: 'var(--transition)' }}>
              Home
            </Link>

            <button
              onClick={() => setActiveModal('about')}
              style={{ color: 'var(--text-main)', fontWeight: 700, transition: 'var(--transition)' }}
            >
              About Us
            </button>

            {/* Categories link (Replaced "Shop" with "Categories" as explicitly requested) */}
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => setShowCategoryDropdown(true)}
              onMouseLeave={() => setShowCategoryDropdown(false)}
            >
              <Link
                to="/products"
                style={{
                  color: 'var(--text-main)',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                Categories <ChevronDown size={14} />
              </Link>

              {/* Categories Dropdown Menu */}
              {showCategoryDropdown && (
                <div
                  className="glass-card animate-fade-in"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    width: '210px',
                    backgroundColor: '#ffffff',
                    padding: '0.5rem 0',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 200,
                  }}
                >
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <Link
                        key={cat._id}
                        to={`/products?category=${encodeURIComponent(cat._id)}`}
                        style={{ display: 'block', padding: '0.5rem 1rem', fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 600 }}
                      >
                        {cat.name}
                      </Link>
                    ))
                  ) : (
                    <span style={{ display: 'block', padding: '0.5rem 1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      No categories available
                    </span>
                  )}
                  <div style={{ borderTop: '1px solid var(--border)', margin: '0.25rem 0' }} />
                  <Link
                    to="/products"
                    style={{ display: 'block', padding: '0.5rem 1rem', fontSize: '0.88rem', color: 'var(--primary)', fontWeight: 700 }}
                  >
                    All Categories →
                  </Link>
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveModal('blog')}
              style={{ color: 'var(--text-main)', fontWeight: 700, transition: 'var(--transition)' }}
            >
              Blog
            </button>

            <button
              onClick={() => setActiveModal('contact')}
              style={{ color: 'var(--text-main)', fontWeight: 700, transition: 'var(--transition)' }}
            >
              Contact Us
            </button>
          </nav>

          {/* Center Logo matching reference design */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: '#ffffff',
                border: '2px solid var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
              }}
            >
              <ShoppingCart size={24} color="var(--primary)" />
            </div>
            <div style={{ lineHeight: 1.1 }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1f2937', letterSpacing: '-0.02em', display: 'block' }}>
                grocery <span style={{ color: 'var(--primary)' }}>Shopping</span>
              </span>
            </div>
          </Link>

          {/* Right Header Section: Search Input + Cart Button + Auth/Admin Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '200px' }}>
              <input
                type="text"
                placeholder="Serach Here..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.45rem 2.2rem 0.45rem 0.85rem',
                  borderRadius: '9999px',
                  border: 'none',
                  backgroundColor: '#f3f4f6',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Search size={15} />
              </button>
            </form>

            {/* Red CART Badge Button matching reference image */}
            <Link
              to="/cart"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--primary)',
                fontWeight: 800,
                fontSize: '0.9rem',
                textDecoration: 'none',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShoppingBag size={18} color="var(--primary)" />
              </div>
              <span>CART ({totalItems.toString().padStart(2, '0')})</span>
            </Link>

            {/* Account / Admin Portal Navigation */}
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderLeft: '1px solid var(--border)', paddingLeft: '0.8rem' }}>
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#7c3aed',
                      backgroundColor: '#f5f3ff',
                      padding: '0.35rem 0.65rem',
                      borderRadius: '6px',
                    }}
                  >
                    <ShieldCheck size={14} /> Admin
                  </Link>
                )}

                <Link
                  to="/dashboard"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: 'var(--primary-hover)',
                    backgroundColor: 'var(--primary-light)',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '6px',
                    textDecoration: 'none',
                  }}
                >
                  <ShoppingBag size={14} /> Dashboard
                </Link>

                <Link
                  to="/profile"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    color: 'var(--text-main)',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                    }}
                  >
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                </Link>

                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  title="Logout"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.25rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  borderLeft: '1px solid var(--border)',
                  paddingLeft: '0.8rem',
                }}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Interactive Information Modals for About Us, Blog, Contact Us */}
      <Modal isOpen={activeModal === 'about'} onClose={() => setActiveModal(null)} title="About Us - Grocery Shopping">
        <div style={{ lineHeight: 1.7, color: 'var(--text-main)' }}>
          <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 800 }}>Your Comfort is Our Business</h4>
          <p style={{ marginBottom: '1rem' }}>
            Grocery Shopping is your premier online supermarket dedicated to bringing farm-fresh vegetables, organic fruits, fresh bakery items, and household staples straight to your door within 15 minutes.
          </p>
          <p>
            We partner directly with certified local farmers and suppliers to guarantee unbeatable quality, freshness, and discounts up to 70% everyday.
          </p>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'blog'} onClose={() => setActiveModal(null)} title="Grocery & Healthy Living Blog">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ padding: '0.85rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
            <strong style={{ color: 'var(--primary)', display: 'block' }}>10 Fresh Vegetable Smoothies for Immunity</strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Published Aug 2026 • 5 min read</span>
          </div>
          <div style={{ padding: '0.85rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
            <strong style={{ color: 'var(--primary)', display: 'block' }}>Why Farm-Fresh Organic Staples Matter</strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Published Aug 2026 • 4 min read</span>
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'contact'} onClose={() => setActiveModal(null)} title="Contact Us">
        <div style={{ lineHeight: 1.7 }}>
          <p style={{ marginBottom: '1rem' }}>Have questions about your order or product freshness? Our support team is here 24/7!</p>
          <p><strong>Address:</strong> 12980 Mignal Hill Road California, NA, 20110</p>
          <p><strong>Email:</strong> example@mail.com</p>
          <p><strong>Phone:</strong> +8100-12345-1234</p>
        </div>
      </Modal>
    </>
  );
};
