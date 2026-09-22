import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Banknote, MapPin, User, Phone, CheckCircle2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import { ShippingAddress } from '../types/Order';

export const Checkout: React.FC = () => {
  const { cartItems, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || 'Bangalore',
    state: user?.address?.state || 'Karnataka',
    pincode: user?.address?.pincode || '560001',
    landmark: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'Razorpay' | 'COD'>('Razorpay');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const deliveryFee = totalAmount > 500 || totalAmount === 0 ? 0 : 40;
  const tax = Math.round(totalAmount * 0.05);
  const grandTotal = totalAmount + deliveryFee + tax;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameRegex = /^[A-Za-z][A-Za-z\s.'-]{1,49}$/;
    if (!address.fullName.trim() || !nameRegex.test(address.fullName.trim())) {
      setError('Please enter a valid full name (at least 2 characters, starting with a letter).');
      return;
    }

    if (!address.phone.trim() || !/^[0-9]{10}$/.test(address.phone.trim())) {
      setError('Please enter a valid 10-digit mobile phone number.');
      return;
    }

    if (!address.street.trim() || address.street.trim().length < 5) {
      setError('Please enter a complete street address / house no. (at least 5 characters).');
      return;
    }

    if (!address.city.trim()) {
      setError('Please enter your delivery city.');
      return;
    }

    if (!address.pincode.trim() || !/^[0-9]{6}$/.test(address.pincode.trim())) {
      setError('Please enter a valid 6-digit postal pincode.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      if (paymentMethod === 'Razorpay') {
        const razorpayOrder = await paymentService.createRazorpayOrder(grandTotal);
        await paymentService.verifyPayment({
          razorpayOrderId: razorpayOrder.id,
          razorpayPaymentId: `pay_mock_${Date.now()}`,
          razorpaySignature: 'mock_signature_hash',
        });
      }

      const createdOrder = await orderService.createOrder({
        items: cartItems,
        shippingAddress: address,
        paymentMethod,
        itemsPrice: totalAmount,
        taxPrice: tax,
        shippingPrice: deliveryFee,
        totalPrice: grandTotal,
      });

      clearCart();
      navigate(`/orders/${createdOrder._id}`, { state: { orderPlaced: true } });
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2>No items in cart to checkout</h2>
        <button onClick={() => navigate('/products')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Browse Catalog
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)' }}>
          Express Checkout
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Complete your delivery details and payment to receive fresh groceries in 15 mins
        </p>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: '#fee2e2',
            color: 'var(--danger)',
            padding: '0.85rem 1.25rem',
            borderRadius: '12px',
            fontWeight: 600,
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmitOrder}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: '2rem',
          alignItems: 'start',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Shipping Address Box */}
          <div
            className="glass-card"
            style={{
              padding: '1.75rem',
              borderRadius: '20px',
              backgroundColor: '#ffffff',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <MapPin size={22} color="var(--primary)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--secondary)' }}>
                1. Delivery Address
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Street Address / House No. *</label>
                <input
                  type="text"
                  required
                  placeholder="Flat 402, Green Valley Apartments"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Pincode *</label>
                <input
                  type="text"
                  required
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  className="form-control"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div
            className="glass-card"
            style={{
              padding: '1.75rem',
              borderRadius: '20px',
              backgroundColor: '#ffffff',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <CreditCard size={22} color="var(--primary)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--secondary)' }}>
                2. Select Payment Method
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '1.25rem',
                  borderRadius: '16px',
                  border: `2px solid ${paymentMethod === 'Razorpay' ? 'var(--primary)' : 'var(--border)'}`,
                  backgroundColor: paymentMethod === 'Razorpay' ? 'var(--primary-light)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Razorpay'}
                  onChange={() => setPaymentMethod('Razorpay')}
                  style={{ accentColor: 'var(--primary)' }}
                />
                <div>
                  <strong style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)' }}>
                    <CreditCard size={18} color="var(--primary)" /> Razorpay Express
                  </strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>UPI, Cards, NetBanking</span>
                </div>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '1.25rem',
                  borderRadius: '16px',
                  border: `2px solid ${paymentMethod === 'COD' ? 'var(--primary)' : 'var(--border)'}`,
                  backgroundColor: paymentMethod === 'COD' ? 'var(--primary-light)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  style={{ accentColor: 'var(--primary)' }}
                />
                <div>
                  <strong style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)' }}>
                    <Banknote size={18} color="#d97706" /> Cash on Delivery
                  </strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Pay cash at doorstep</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary & Place Order */}
        <div
          className="glass-card"
          style={{
            padding: '1.5rem',
            borderRadius: '20px',
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--secondary)' }}>
            Order Items ({cartItems.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '240px', overflowY: 'auto' }}>
            {cartItems.map((item) => (
              <div key={item.product._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                <span style={{ fontWeight: 600 }}>{item.product.name} (x{item.quantity})</span>
                <span style={{ fontWeight: 700 }}>₹{item.product.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Subtotal</span>
              <span>₹{totalAmount}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Delivery Fee</span>
              <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Tax (5% GST)</span>
              <span>₹{tax}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-hover)', marginTop: '0.5rem' }}>
              <span>Total</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
          >
            {submitting ? 'Placing Order...' : `Place Order (₹${grandTotal})`} <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};
