import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';

export const Cart: React.FC = () => {
  const { cartItems, clearCart, totalItems } = useCart();

  if (cartItems.length === 0) {
    return (
      <div
        className="glass-card animate-fade-in"
        style={{
          maxWidth: '560px',
          margin: '3rem auto',
          padding: '4rem 2rem',
          textAlign: 'center',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <ShoppingBag size={40} />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '0.75rem' }}>
          Your Cart is Empty
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
          Looks like you haven't added any fresh groceries yet. Explore our farm fresh fruits, crisp vegetables, and organic staples!
        </p>
        <Link to="/products" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
          Start Shopping Now
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)' }}>
            Shopping Cart ({totalItems} items)
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Review your selected groceries before proceeding to express checkout
          </p>
        </div>

        <button
          onClick={clearCart}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--danger)',
            fontWeight: 600,
            fontSize: '0.88rem',
          }}
        >
          <Trash2 size={16} /> Clear Cart
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 360px',
          gap: '2rem',
          alignItems: 'start',
        }}
      >
        <div
          className="glass-card"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            overflow: 'hidden',
          }}
        >
          {cartItems.map((item) => (
            <CartItem key={item.product._id} item={item} />
          ))}
        </div>

        <CartSummary />
      </div>
    </div>
  );
};
