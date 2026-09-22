import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ProductGrid } from '../components/product/ProductGrid';
import { productService } from '../services/productService';
import { Product, Category } from '../types/Product';

export const Home: React.FC = () => {
  const location = useLocation();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Live countdown timer state (29 Days 15 Hours 25 Mins 08 Secs matching image)
  const [timeLeft, setTimeLeft] = useState({
    days: 29,
    hours: 15,
    minutes: 25,
    seconds: 8,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadHomeData = async () => {
      try {
        const [prods, cats] = await Promise.all([
          productService.getProducts({ sortBy: 'popular' }),
          productService.getCategories(),
        ]);
        if (isMounted) {
          setFeaturedProducts(prods);
          setCategories(cats);
        }
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    loadHomeData();

    return () => {
      isMounted = false;
    };
  }, [location.pathname, location.key]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
      {/* Golden Yellow Hero Banner Section matching reference image */}
      <section
        style={{
          backgroundColor: '#ebad34',
          borderRadius: '16px',
          padding: '3.5rem 3rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          alignItems: 'center',
          gap: '2.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Left Text Content */}
        <div style={{ zIndex: 2 }}>
          {/* Red Pill Badge: "Your Comfort is Our Business" */}
          <div
            style={{
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              display: 'inline-block',
              padding: '0.45rem 1.25rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.9rem',
              marginBottom: '1.25rem',
              boxShadow: '0 4px 10px rgba(225, 27, 34, 0.2)',
            }}
          >
            Your Comfort is Our Business
          </div>

          {/* Headline: "We Bring the Store to Your Door" */}
          <h1
            style={{
              fontSize: '3.2rem',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.1,
              marginBottom: '1rem',
              letterSpacing: '-0.02em',
            }}
          >
          We Bring the<br />Store to Your Door
          </h1>

          {/* Subheadline: "NOW! GET 25% OFF ON ALL ITEM" */}
          <p
            style={{
              color: '#ffffff',
              fontSize: '1.15rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              marginBottom: '2rem',
              opacity: 0.95,
            }}
          >
            {/* NOW! GET 25% OFF ON ALL ITEM */}
          </p>

          {/* Red CTA Button: "Shop Now" */}
          <Link
            to="/products"
            className="btn btn-primary"
            style={{
              padding: '0.8rem 2.2rem',
              fontSize: '1.05rem',
              borderRadius: '10px',
              backgroundColor: 'var(--primary)',
            }}
          >
            Shop Now
          </Link>
        </div>

        {/* Right Fresh Produce Image matching reference graphic */}
        <div
          style={{
            width:'350px',
            height:'380px',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            src="/image1.jpg"
            alt="Fresh Vegetables Basket"
            style={{
              //width: '900px',
              height: '380px',
              objectFit: 'cover',
              marginLeft:'450px',
              marginRight:'300px',
              borderRadius:'10px',
              //marginTop: '100px',
              //marginBottom: '30px',
              filter: 'drop-shadow(0 15px 25px rgba(0, 0, 0, 0.15))',
            }}
          />
        </div>
      </section>

      {/* DEAL OF THE DAY Section matching reference image */}
      <section>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          <div style={{ maxWidth: '520px' }}>
            <h2
              style={{
                fontSize: '2rem',
                fontWeight: 800,
                color: 'var(--secondary)',
                letterSpacing: '-0.02em',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
              }}
            >
              DEAL OF THE DAY
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Adipisicing elit, sed do eiusmod tempor incididunt ut labore magna aliqua. Ut enim ad minim ven quis nostrud exercitation.
            </p>
          </div>

          {/* Countdown Timer (Days : Hours : Minutes : Seconds) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--secondary)', display: 'block', lineHeight: 1 }}>
                {timeLeft.days.toString().padStart(2, '0')}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Days</span>
            </div>

            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)' }}>:</span>

            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--secondary)', display: 'block', lineHeight: 1 }}>
                {timeLeft.hours.toString().padStart(2, '0')}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Hours</span>
            </div>

            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)' }}>:</span>

            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--secondary)', display: 'block', lineHeight: 1 }}>
                {timeLeft.minutes.toString().padStart(2, '0')}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Minutes</span>
            </div>

            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)' }}>:</span>

            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--secondary)', display: 'block', lineHeight: 1 }}>
                {timeLeft.seconds.toString().padStart(2, '0')}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Seconds</span>
            </div>
          </div>
        </div>

        {/* Product Cards Row */}
        <ProductGrid products={featuredProducts.slice(0, 5)} loading={loading} />
      </section>

      {/* Explore All Categories Section */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--secondary)' }}>Popular Categories</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>Browse fresh produce by category</p>
          </div>
          <Link to="/products" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.92rem' }}>
            View All Categories →
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/products?category=${encodeURIComponent(cat._id)}`}
              style={{
                backgroundColor: '#f9fafb',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '1.25rem 1rem',
                textAlign: 'center',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'var(--transition)',
              }}
            >
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '0.2rem' }}>{cat.name}</h4>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Explore Collection</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
