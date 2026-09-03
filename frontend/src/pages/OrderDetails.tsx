import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, MapPin, CreditCard, Clock, Truck, ShieldCheck } from 'lucide-react';
import { orderService } from '../services/orderService';
import { Order } from '../types/Order';
import { Loader } from '../components/common/Loader';

export const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const justPlaced = (location.state as any)?.orderPlaced;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const data = await orderService.getOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <Loader fullScreen text="Fetching order details..." />;

  if (!order) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2>Order Not Found</h2>
        <Link to="/orders" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Orders
        </Link>
      </div>
    );
  }

  const steps = ['Pending', 'Processing', 'Out for Delivery', 'Delivered'];
  const currentStepIndex = steps.indexOf(order.status) !== -1 ? steps.indexOf(order.status) : 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <Link to="/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontWeight: 600 }}>
        <ArrowLeft size={16} /> Back to My Orders
      </Link>

      {justPlaced && (
        <div
          style={{
            backgroundColor: 'var(--primary-light)',
            border: '1px solid var(--primary)',
            color: 'var(--primary-hover)',
            padding: '1.25rem',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <CheckCircle2 size={32} />
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Order Placed Successfully! 🎉</h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Thank you for shopping with FreshMart. Your order is being packed.</p>
          </div>
        </div>
      )}

      {/* Header Info */}
      <div
        className="glass-card"
        style={{
          padding: '1.75rem',
          borderRadius: '20px',
          backgroundColor: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Order Reference</span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--secondary)' }}>#{order._id}</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Placed on {new Date(order.createdAt).toLocaleString()}
          </span>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>Total Paid</span>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-hover)' }}>₹{order.totalPrice}</span>
        </div>
      </div>

      {/* Order Tracking Progress Bar */}
      <div
        className="glass-card"
        style={{ padding: '2rem 1.5rem', borderRadius: '20px', backgroundColor: '#ffffff' }}
      >
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--secondary)' }}>
          Express Delivery Tracking
        </h3>

        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
          {steps.map((step, idx) => {
            const isPassed = idx <= currentStepIndex;
            return (
              <div key={step} style={{ textAlign: 'center', flex: 1, position: 'relative', zIndex: 2 }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: isPassed ? 'var(--primary)' : '#e2e8f0',
                    color: isPassed ? '#ffffff' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.5rem',
                    fontWeight: 700,
                  }}
                >
                  {idx + 1}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: isPassed ? 700 : 500, color: isPassed ? 'var(--text-main)' : 'var(--text-muted)' }}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Order Items & Delivery/Payment details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>
        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '20px', backgroundColor: '#ffffff' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>Items Ordered</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {order.orderItems.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <img src={item.image} alt={item.name} style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{item.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>₹{item.price} x {item.quantity}</span>
                </div>
                <span style={{ fontWeight: 800, fontSize: '1rem' }}>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '20px', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <MapPin size={18} color="var(--primary)" />
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Delivery Address</h4>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
              <strong>{order.shippingAddress.fullName}</strong><br />
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
              Phone: {order.shippingAddress.phone}
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '20px', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <CreditCard size={18} color="var(--primary)" />
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Payment Info</h4>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
              Method: <strong>{order.paymentMethod}</strong><br />
              Status: <span style={{ color: order.paymentStatus === 'Completed' ? 'var(--primary)' : '#d97706', fontWeight: 700 }}>{order.paymentStatus}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
