import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Grid,
  ShoppingCart,
  Clock,
  User as UserIcon,
  LogOut,
  Search,
  Star,
  Plus,
  Check,
  MapPin,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Bell,
  Settings,
  Package,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { Product, Category } from '../types/Product';
import { Order } from '../types/Order';
import { getImageUrl } from '../utils/imageUtils';

export const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { cartItems, totalAmount, addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [categories, setCategories] = useState<Category[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [addedItemIds, setAddedItemIds] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    let isMounted = true;
    const fetchDashboardData = async () => {
      try {
        const [cats, prods, orders] = await Promise.all([
          productService.getCategories(),
          productService.getProducts({ sortBy: 'popular' }),
          orderService.getMyOrders(),
        ]);
        if (isMounted) {
          setCategories(cats);
          setPopularProducts(prods);
          setRecentOrders(orders);
        }
      } catch (err) {
        console.error('Failed to load user dashboard data:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, [location.pathname, location.key]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setAddedItemIds((prev) => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [product._id]: false }));
    }, 1500);
  };

  const deliveryFee = totalAmount > 500 || totalAmount === 0 ? 0 : 40;
  const tax = Math.round(totalAmount * 0.05);
  const grandTotal = totalAmount + deliveryFee + tax;

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        margin: '-2rem -1.5rem',
      }}
    >
      {/* ---------------------------------------------------- */}
      {/* 1. LEFT SIDEBAR NAVIGATION                             */}
      {/* ---------------------------------------------------- */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #f1f5f9',
          padding: '2rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 50,
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none', paddingLeft: '0.5rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(225, 27, 34, 0.25)',
              }}
            >
              <ShoppingCart size={22} color="#ffffff" />
            </div>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              grocery <span style={{ color: 'var(--primary)' }}>Shopping</span>
            </span>
          </Link>

          {/* Nav Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <Link
              to="/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.85rem 1.1rem',
                borderRadius: '14px',
                backgroundColor: '#ebad34',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.95rem',
                textDecoration: 'none',
                boxShadow: '0 6px 14px rgba(235, 173, 52, 0.3)',
              }}
            >
              <LayoutDashboard size={20} />
              Dashboard
            </Link>

            <Link
              to="/products"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.85rem 1.1rem',
                borderRadius: '14px',
                color: '#64748b',
                fontWeight: 600,
                fontSize: '0.95rem',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <ShoppingBag size={20} />
              Shop Products
            </Link>

            <Link
              to="/products"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.85rem 1.1rem',
                borderRadius: '14px',
                color: '#64748b',
                fontWeight: 600,
                fontSize: '0.95rem',
                textDecoration: 'none',
              }}
            >
              <Grid size={20} />
              Categories
            </Link>

            <Link
              to="/cart"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1.1rem',
                borderRadius: '14px',
                color: '#64748b',
                fontWeight: 600,
                fontSize: '0.95rem',
                textDecoration: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <ShoppingCart size={20} />
                My Cart
              </div>
              {cartItems.length > 0 && (
                <span
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '999px',
                  }}
                >
                  {cartItems.length}
                </span>
              )}
            </Link>

            <Link
              to="/orders"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.85rem 1.1rem',
                borderRadius: '14px',
                color: '#64748b',
                fontWeight: 600,
                fontSize: '0.95rem',
                textDecoration: 'none',
              }}
            >
              <Clock size={20} />
              Order History
            </Link>

            <Link
              to="/profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.85rem 1.1rem',
                borderRadius: '14px',
                color: '#64748b',
                fontWeight: 600,
                fontSize: '0.95rem',
                textDecoration: 'none',
              }}
            >
              <UserIcon size={20} />
              My Profile
            </Link>
          </nav>
        </div>

        {/* Bottom Sidebar Promo Card & Logout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div
            style={{
              backgroundColor: '#fef3c7',
              borderRadius: '18px',
              padding: '1.25rem 1rem',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid #fde68a',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: '#f59e0b',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem',
              }}
            >
              <Sparkles size={20} />
            </div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#92400e', marginBottom: '0.35rem' }}>
              Fresh Rewards Card
            </h4>
            <p style={{ fontSize: '0.78rem', color: '#b45309', lineHeight: 1.4, marginBottom: '0.85rem' }}>
              Get extra discounts on fresh daily organic produce!
            </p>
            <Link
              to="/products"
              style={{
                display: 'inline-block',
                backgroundColor: '#ffffff',
                color: '#b45309',
                fontWeight: 800,
                fontSize: '0.8rem',
                padding: '0.45rem 1rem',
                borderRadius: '10px',
                textDecoration: 'none',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
              }}
            >
              Explore Offers
            </Link>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              color: '#ef4444',
              backgroundColor: '#fef2f2',
              fontWeight: 700,
              fontSize: '0.9rem',
              border: 'none',
              cursor: 'pointer',
              width: '100%',
              justifyContent: 'center',
            }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* ---------------------------------------------------- */}
      {/* 2. MAIN CONTENT AREA (MIDDLE)                          */}
      {/* ---------------------------------------------------- */}
      <main
        style={{
          flex: 1,
          padding: '2rem 2rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          maxWidth: 'calc(100% - 620px)',
        }}
      >
        {/* Header Section: Greeting + Search Bar */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.2rem' }}>
              Hello, {user?.name || 'Customer'} 👋
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              What fresh groceries would you like to order today?
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
            <input
              type="text"
              placeholder="What do you want to buy today..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.6rem',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                fontSize: '0.88rem',
                outline: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
            />
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
              }}
            />
          </form>
        </header>

        {/* Promotional Banner matching Golden 2nd reference banner */}
        <section
          style={{
            backgroundColor: '#ebad34',
            borderRadius: '24px',
            padding: '2.5rem 2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 12px 24px rgba(235, 173, 52, 0.25)',
          }}
        >
          <div style={{ zIndex: 2, maxWidth: '380px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, marginBottom: '0.75rem' }}>
              Fresh Groceries Delivered Up To 25% Off
            </h2>
            <p style={{ color: '#ffffff', fontSize: '0.92rem', opacity: 0.95, marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Get organic vegetables, fruits, and dairy products delivered straight to your doorstep in minutes.
            </p>
            <Link
              to="/products"
              className="btn"
              style={{
                backgroundColor: '#ffffff',
                color: '#ebad34',
                fontWeight: 800,
                padding: '0.75rem 1.8rem',
                borderRadius: '14px',
                fontSize: '0.92rem',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              Shop Now <ArrowRight size={16} />
            </Link>
          </div>

          <div
            style={{
              position: 'relative',
              width: '240px',
              height: '180px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="/image1.jpg"
              alt="Fresh Produce"
              style={{
                width: '260px',
                height: '180px',
                objectFit: 'cover',
                borderRadius: '16px',
                boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
              }}
            />
          </div>
        </section>

        {/* Category Section */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Category</h3>
            <Link to="/products" style={{ color: '#ebad34', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              View all <ChevronRight size={16} />
            </Link>
          </div>

          {categories.length === 0 ? (
            <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '1.5rem', textAlign: 'center', border: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>No categories created yet.</p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: '1rem',
              }}
            >
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/products?category=${encodeURIComponent(cat.name)}`}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '18px',
                    padding: '1.25rem 0.85rem',
                    textAlign: 'center',
                    textDecoration: 'none',
                    color: '#0f172a',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    border: '1px solid #f1f5f9',
                    transition: 'transform 0.2s ease, boxShadow 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.65rem',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      backgroundColor: '#fffbeb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                    }}
                  >
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                    ) : (
                      '🛒'
                    )}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Popular Products Section */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Popular Products</h3>
            <Link to="/products" style={{ color: '#ebad34', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              View all <ChevronRight size={16} />
            </Link>
          </div>

          {popularProducts.length === 0 ? (
            <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '1.5rem', textAlign: 'center', border: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>No products available yet.</p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {popularProducts.slice(0, 6).map((prod) => {
                const isAdded = addedItemIds[prod._id];
                return (
                  <div
                    key={prod._id}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '20px',
                      padding: '1rem',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                      border: '1px solid #f1f5f9',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                    }}
                  >
                    {/* Badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: '#ef4444',
                        color: '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '8px',
                        zIndex: 2,
                      }}
                    >
                      15% OFF
                    </div>

                    <Link to={`/products/${prod._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div style={{ height: '140px', width: '100%', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img
                          src={getImageUrl(prod.image)}
                          alt={prod.name}
                          style={{ maxHeight: '130px', maxWidth: '100%', objectFit: 'contain', borderRadius: '12px' }}
                        />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                        <Star size={14} fill="#f59e0b" color="#f59e0b" />
                        <span>{prod.rating || '4.8'}</span>
                      </div>

                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem', height: '2.4em', overflow: 'hidden', lineHeight: 1.2 }}>
                        {prod.name}
                      </h4>
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                        ₹{prod.price}
                      </span>

                      <button
                        onClick={() => handleAddToCart(prod)}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '12px',
                          backgroundColor: isAdded ? '#10b981' : '#ebad34',
                          color: '#ffffff',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease',
                        }}
                        title="Add to Cart"
                      >
                        {isAdded ? <Check size={18} /> : <Plus size={20} />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Recent Orders Section */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Recent Orders</h3>
            <Link to="/orders" style={{ color: '#ebad34', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              View all <ChevronRight size={16} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                padding: '2rem',
                textAlign: 'center',
                border: '1px solid #f1f5f9',
              }}
            >
              <Package size={36} color="#94a3b8" style={{ marginBottom: '0.5rem' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>No orders yet</h4>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>You haven't placed any grocery orders yet.</p>
              <Link
                to="/products"
                className="btn"
                style={{
                  backgroundColor: '#ebad34',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '10px',
                  textDecoration: 'none',
                }}
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {recentOrders.slice(0, 3).map((ord) => (
                <Link
                  key={ord._id}
                  to={`/orders/${ord._id}`}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '18px',
                    padding: '1.1rem 1.3rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textDecoration: 'none',
                    color: 'inherit',
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        backgroundColor: '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#64748b',
                      }}
                    >
                      <Package size={22} />
                    </div>
                    <div>
                      <h5 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                        Order #{ord._id.slice(-6)}
                      </h5>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        {ord.orderItems?.length || 1} Items • {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>
                      ₹{ord.totalPrice}
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '6px',
                        backgroundColor:
                          ord.status === 'Delivered'
                            ? '#dcfce7'
                            : ord.status === 'Out for Delivery'
                            ? '#e0f2fe'
                            : '#fef3c7',
                        color:
                          ord.status === 'Delivered'
                            ? '#15803d'
                            : ord.status === 'Out for Delivery'
                            ? '#0369a1'
                            : '#b45309',
                      }}
                    >
                      {ord.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ---------------------------------------------------- */}
      {/* 3. RIGHT-SIDE INFORMATION PANEL                        */}
      {/* ---------------------------------------------------- */}
      <aside
        style={{
          width: '360px',
          backgroundColor: '#ffffff',
          borderLeft: '1px solid #f1f5f9',
          padding: '2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
          flexShrink: 0,
        }}
      >
        {/* Top Control Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem' }}>
          <button
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              cursor: 'pointer',
            }}
          >
            <Bell size={18} />
          </button>
          <Link
            to="/profile"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              textDecoration: 'none',
            }}
          >
            <Settings size={18} />
          </Link>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1rem',
            }}
          >
            {user?.name.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>

        {/* Customer Profile & Address Card */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            borderRadius: '20px',
            padding: '1.25rem',
            border: '1px solid #f1f5f9',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.1rem',
              }}
            >
              {user?.name.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>{user?.name || 'Customer'}</h4>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{user?.email || 'customer@example.com'}</span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                Your Address
              </span>
              <Link to="/profile" style={{ fontSize: '0.78rem', color: '#ebad34', fontWeight: 700, textDecoration: 'none' }}>
                Change
              </Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: '#334155', lineHeight: 1.4 }}>
              <MapPin size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>
                {typeof user?.address === 'object' && user?.address && user.address.street
                  ? `${user.address.street}, ${user.address.city || ''} ${user.address.pincode ? `- ${user.address.pincode}` : ''}`
                  : typeof user?.address === 'string' && user.address.trim()
                  ? user.address
                  : '45 Green Garden Layout, Bangalore - 560034'}
              </span>
            </div>
          </div>
        </div>

        {/* Live Order Menu / Cart Summary */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>Current Order</h3>
            <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
              {cartItems.length} items
            </span>
          </div>

          {cartItems.length === 0 ? (
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                padding: '2.5rem 1rem',
                textAlign: 'center',
                border: '1.5px dashed #cbd5e1',
                marginTop: '0.5rem',
              }}
            >
              <ShoppingCart size={40} color="#cbd5e1" style={{ marginBottom: '0.75rem' }} />
              <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Your cart is empty
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
                Add fresh grocery items to build your current order.
              </p>
              <Link
                to="/products"
                className="btn"
                style={{
                  backgroundColor: '#ebad34',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  padding: '0.65rem 1.4rem',
                  borderRadius: '12px',
                  textDecoration: 'none',
                }}
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              {/* Cart Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '280px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                {cartItems.map((item) => (
                  <div
                    key={item.product._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: '14px',
                      padding: '0.65rem 0.85rem',
                      border: '1px solid #f1f5f9',
                    }}
                  >
                    <img
                      src={getImageUrl(item.product.image)}
                      alt={item.product.name}
                      style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.product.name}
                      </h5>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        x{item.quantity}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
                      ₹{item.product.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown & Checkout Button */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem', marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b' }}>
                  <span>Subtotal</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b' }}>
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b' }}>
                  <span>Tax (5%)</span>
                  <span>₹{tax}</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    paddingTop: '0.6rem',
                    borderTop: '1px solid #f1f5f9',
                    marginTop: '0.2rem',
                  }}
                >
                  <span>Total</span>
                  <span>₹{grandTotal}</span>
                </div>

                <Link
                  to="/checkout"
                  className="btn"
                  style={{
                    backgroundColor: '#ebad34',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    padding: '0.85rem',
                    borderRadius: '14px',
                    textAlign: 'center',
                    textDecoration: 'none',
                    marginTop: '0.75rem',
                    boxShadow: '0 6px 16px rgba(235, 173, 52, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default UserDashboard;
