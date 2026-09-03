import React, { useEffect, useState } from 'react';
import { orderService } from '../../services/orderService';
import { Order, OrderStatus } from '../../types/Order';
import { Loader } from '../../components/common/Loader';
import { CheckCircle, Clock, Truck } from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id: string, newStatus: OrderStatus) => {
    try {
      const updated = await orderService.updateOrderStatus(id, newStatus);
      setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  if (loading) return <Loader fullScreen text="Loading customer orders..." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)' }}>
          Order Management & Dispatch
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Monitor order status, update dispatch steps, and manage customer deliveries
        </p>
      </div>

      <div className="glass-card" style={{ borderRadius: '20px', backgroundColor: '#ffffff', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '1rem 1.5rem' }}>Order ID</th>
              <th style={{ padding: '1rem' }}>Customer</th>
              <th style={{ padding: '1rem' }}>Date</th>
              <th style={{ padding: '1rem' }}>Total</th>
              <th style={{ padding: '1rem' }}>Payment</th>
              <th style={{ padding: '1rem 1.5rem' }}>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((ord) => (
              <tr key={ord._id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 800, color: 'var(--secondary)' }}>
                  #{ord._id}
                </td>
                <td style={{ padding: '1rem' }}>
                  <strong style={{ display: 'block' }}>{ord.shippingAddress.fullName}</strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{ord.shippingAddress.phone}</span>
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {new Date(ord.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '1rem', fontWeight: 800, color: 'var(--primary-hover)' }}>
                  ₹{ord.totalPrice}
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{ord.paymentMethod}</span>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: ord.paymentStatus === 'Completed' ? 'var(--primary)' : '#d97706' }}>
                    {ord.paymentStatus}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <select
                    value={ord.status}
                    onChange={(e) => handleStatusChange(ord._id, e.target.value as OrderStatus)}
                    className="form-control"
                    style={{ fontSize: '0.85rem', padding: '0.35rem 0.6rem', width: 'auto', fontWeight: 600 }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
