import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, Calendar, ChevronRight, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { orderService } from '../services/orderService';
import { Order } from '../types/Order';
import { Loader } from '../components/common/Loader';

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const fetchOrders = async () => {
      try {
        const data = await orderService.getMyOrders();
        if (isMounted) {
          setOrders(data);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, [location.pathname, location.key]);

  if (loading) return <Loader fullScreen text="Loading your orders..." />;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <span className="badge badge-green"><CheckCircle size={12} style={{ marginRight: '4px' }} /> Delivered</span>;
      case 'Out for Delivery':
      case 'Shipped':
        return <span className="badge badge-blue"><Truck size={12} style={{ marginRight: '4px' }} /> {status}</span>;
      case 'Cancelled':
        return <span className="badge badge-amber" style={{ backgroundColor: '#fee2e2', color: 'var(--danger)' }}><XCircle size={12} style={{ marginRight: '4px' }} /> Cancelled</span>;
      default:
        return <span className="badge badge-amber"><Clock size={12} style={{ marginRight: '4px' }} /> {status}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)' }}>
          My Orders History
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Track delivery status and view order details
        </p>
      </div>

      {orders.length === 0 ? (
        <div
          className="glass-card"
          style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '24px' }}
        >
          <Package size={48} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No orders placed yet</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Your past grocery orders will show up here.</p>
          <Link to="/products" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {orders.map((order) => (
            <div
              key={order._id}
              className="glass-card"
              style={{
                padding: '1.5rem',
                borderRadius: '20px',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1.5rem',
                flexWrap: 'wrap',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--secondary)' }}>
                    Order #{order._id}
                  </span>
                  {getStatusBadge(order.status)}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span>• {order.orderItems.length} Items</span>
                  <span>• Payment: <strong>{order.paymentMethod}</strong></span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-hover)' }}>
                  ₹{order.totalPrice}
                </span>

                <Link
                  to={`/orders/${order._id}`}
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}
                >
                  View Details <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
