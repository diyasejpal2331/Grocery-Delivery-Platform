import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartSummary: React.FC = () => {
  const { totalAmount, totalItems } = useCart();
  const navigate = useNavigate();

  const deliveryFee = totalAmount > 500 || totalAmount === 0 ? 0 : 40;
  const tax = Math.round(totalAmount * 0.05); // 5% GST
  const grandTotal = totalAmount + deliveryFee + tax;

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
      </div>

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
