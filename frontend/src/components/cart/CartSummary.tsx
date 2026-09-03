import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Tag, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartSummary: React.FC = () => {
  const { totalAmount, totalItems } = useCart();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const deliveryFee = totalAmount > 500 || totalAmount === 0 ? 0 : 40;
  const tax = Math.round(totalAmount * 0.05); // 5% GST
  const grandTotal = Math.max(0, totalAmount + deliveryFee + tax - discount);

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.toUpperCase() === 'FRESH50') {
      setDiscount(50);
      setPromoMessage({ text: '₹50 promo discount applied!', isError: false });
    } else if (promoCode.toUpperCase() === 'ORGANIC10') {
      const calcDiscount = Math.round(totalAmount * 0.1);
      setDiscount(calcDiscount);
      setPromoMessage({ text: `10% discount (₹${calcDiscount}) applied!`, isError: false });
    } else {
      setDiscount(0);
      setPromoMessage({ text: 'Invalid promo code. Try FRESH50 or ORGANIC10', isError: true });
    }
  };

  return (
    <div
      className="glass-card"
      style={{
        padding: '1.5rem',
        borderRadius: '16px',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}
    >
      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--secondary)' }}>
        Order Summary
      </h3>

      {/* Breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
          <span>Items ({totalItems})</span>
          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>₹{totalAmount}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
          <span>Delivery Charges</span>
          <span style={{ fontWeight: 600, color: deliveryFee === 0 ? 'var(--primary)' : 'var(--text-main)' }}>
            {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
          <span>Estimated GST (5%)</span>
          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>₹{tax}</span>
        </div>

        {discount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary-hover)' }}>
            <span>Promo Discount</span>
            <span style={{ fontWeight: 700 }}>-₹{discount}</span>
          </div>
        )}
      </div>

      {/* Promo Code Input */}
      <form onSubmit={applyPromo} style={{ display: 'flex', gap: '0.5rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Tag size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Promo code (FRESH50)"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '2.2rem', fontSize: '0.85rem', textTransform: 'uppercase' }}
          />
        </div>
        <button type="submit" className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
          Apply
        </button>
      </form>
      {promoMessage && (
        <span style={{ fontSize: '0.78rem', color: promoMessage.isError ? 'var(--danger)' : 'var(--primary-hover)', fontWeight: 600 }}>
          {promoMessage.text}
        </span>
      )}

      <div style={{ borderTop: '2px dashed var(--border)', paddingTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--secondary)' }}>Total Payable</span>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Inclusive of all taxes</span>
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-hover)' }}>
            ₹{grandTotal}
          </span>
        </div>

        <button
          onClick={() => navigate('/checkout')}
          disabled={totalItems === 0}
          className="btn btn-primary"
          style={{
            width: '100%',
            padding: '0.85rem',
            fontSize: '1rem',
            opacity: totalItems === 0 ? 0.5 : 1,
            cursor: totalItems === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          Proceed to Checkout <ArrowRight size={18} />
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          justifyContent: 'center',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          backgroundColor: '#f8fafc',
          padding: '0.5rem',
          borderRadius: '8px',
        }}
      >
        <ShieldCheck size={16} color="var(--primary)" /> Safe & Secure Express Checkout
      </div>
    </div>
  );
};
