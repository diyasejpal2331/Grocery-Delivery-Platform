import React, { useEffect, useState } from 'react';
import {
  ShoppingBag,
  Search,
  CheckCircle,
  Clock,
  Truck,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { orderService } from '../../services/orderService';
import { Order, OrderStatus } from '../../types/Order';
import { Loader } from '../../components/common/Loader';
import { Modal } from '../../components/common/Modal';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchOrders = async () => {
    setLoading(true);
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
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder(updated);
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesTab =
      activeTab === 'All' || o.status.toLowerCase() === activeTab.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      o._id.toLowerCase().includes(query) ||
      o.shippingAddress?.fullName.toLowerCase().includes(query) ||
      o.shippingAddress?.phone.toLowerCase().includes(query) ||
      o.orderItems.some((item) => item.name.toLowerCase().includes(query));
    return matchesTab && matchesSearch;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadgeStyle = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return { bg: '#dcfce7', color: '#15803d', border: '#bbf7d0' };
      case 'Out for Delivery':
        return { bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' };
      case 'Processing':
        return { bg: '#fef3c7', color: '#b45309', border: '#fde68a' };
      case 'Pending':
        return { bg: '#fff7ed', color: '#c2410c', border: '#ffedd5' };
      case 'Cancelled':
        return { bg: '#fee2e2', color: '#b91c1c', border: '#fca5a5' };
      default:
        return { bg: '#f3f4f6', color: '#4b5563', border: '#e5e7eb' };
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Orders Management">
        <Loader fullScreen text="Loading Customer Deliveries & Orders..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Order Management"
      subtitle="Track, filter, and process all grocery platform orders in real time."
      onSearch={(q) => setSearchQuery(q)}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Main Orders Table Card */}
        <div
          className="glass-card animate-fade-in"
          style={{
            padding: '1.75rem',
            borderRadius: '20px',
            backgroundColor: '#ffffff',
            border: '1px solid var(--border)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
          }}
        >
          {/* Header Row: Title & Action Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.25rem',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: 'var(--secondary)',
                }}
              >
                All Orders ({filteredOrders.length})
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Filter by status or search customer information
              </p>
            </div>

            <button
              onClick={fetchOrders}
              className="btn btn-secondary"
              style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}
            >
              <RefreshCw size={15} /> Refresh List
            </button>
          </div>

          {/* Filter Tabs & Search Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid var(--border)',
              marginBottom: '1rem',
            }}
          >
            {/* Filter Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              {[
                { id: 'All', label: 'All Orders' },
                { id: 'Pending', label: 'Pending' },
                { id: 'Processing', label: 'Processing' },
                { id: 'Out for Delivery', label: 'Out for Delivery' },
                { id: 'Delivered', label: 'Delivered' },
                { id: 'Cancelled', label: 'Cancelled' },
              ].map((tab) => {
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setCurrentPage(1);
                    }}
                    style={{
                      padding: '0.4rem 0.9rem',
                      borderRadius: '9999px',
                      fontSize: '0.82rem',
                      fontWeight: isSelected ? 700 : 600,
                      color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                      backgroundColor: isSelected
                        ? 'var(--primary-light)'
                        : 'transparent',
                      border: isSelected
                        ? '1px solid #fecdd3'
                        : '1px solid transparent',
                      transition: 'var(--transition)',
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Table Search Input */}
            <div style={{ position: 'relative', width: '240px' }}>
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  width: '100%',
                  padding: '0.45rem 0.85rem 0.45rem 2.2rem',
                  borderRadius: '9999px',
                  border: '1px solid var(--border)',
                  backgroundColor: '#f9fafb',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
              <Search
                size={15}
                color="var(--text-muted)"
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              />
            </div>
          </div>

          {/* Orders Data Table */}
          {paginatedOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <ShoppingBag size={40} color="var(--text-muted)" style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
              <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>No orders found</p>
              <span style={{ fontSize: '0.8rem' }}>No matching records for current filters.</span>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'separate',
                  borderSpacing: '0 0.5rem',
                  textAlign: 'left',
                  fontSize: '0.88rem',
                }}
              >
                <thead>
                  <tr
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.03em',
                    }}
                  >
                    <th style={{ padding: '0.75rem 1rem' }}>Order ID</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Customer Details</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Items Summary</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Total Amount</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Payment</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Current Status</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Update Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((ord) => {
                    const firstItem = ord.orderItems[0];
                    const extraItemsCount = ord.orderItems.length - 1;
                    const badgeStyle = getStatusBadgeStyle(ord.status);

                    return (
                      <tr
                        key={ord._id}
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid var(--border)',
                          borderRadius: '12px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        }}
                      >
                        {/* Order ID & Date */}
                        <td
                          style={{
                            padding: '0.85rem 1rem',
                            borderTopLeftRadius: '12px',
                            borderBottomLeftRadius: '12px',
                            borderTop: '1px solid var(--border)',
                            borderBottom: '1px solid var(--border)',
                            borderLeft: '1px solid var(--border)',
                          }}
                        >
                          <strong style={{ color: 'var(--secondary)', fontWeight: 800 }}>#{ord._id}</strong>
                          <span style={{ display: 'block', fontSize: '0.73rem', color: 'var(--text-muted)' }}>
                            {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : 'N/A'}
                          </span>
                        </td>

                        {/* Customer Details */}
                        <td
                          style={{
                            padding: '0.85rem 1rem',
                            borderTop: '1px solid var(--border)',
                            borderBottom: '1px solid var(--border)',
                          }}
                        >
                          <strong style={{ display: 'block', color: 'var(--secondary)', fontSize: '0.88rem' }}>
                            {ord.shippingAddress?.fullName || 'Customer'}
                          </strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {ord.shippingAddress?.phone || 'No Phone'}
                          </span>
                        </td>

                        {/* Items Summary */}
                        <td
                          style={{
                            padding: '0.85rem 1rem',
                            borderTop: '1px solid var(--border)',
                            borderBottom: '1px solid var(--border)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <img
                              src={firstItem?.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=120&q=80'}
                              alt={firstItem?.name || 'Item'}
                              style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }}
                            />
                            <div>
                              <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                                {firstItem?.name || 'Grocery Product'}
                              </span>
                              <span style={{ display: 'block', fontSize: '0.73rem', color: 'var(--text-muted)' }}>
                                {ord.orderItems.length} {ord.orderItems.length === 1 ? 'item' : 'items'} total
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Amount */}
                        <td
                          style={{
                            padding: '0.85rem 1rem',
                            borderTop: '1px solid var(--border)',
                            borderBottom: '1px solid var(--border)',
                            fontWeight: 800,
                            color: 'var(--secondary)',
                          }}
                        >
                          ₹{ord.totalPrice}
                        </td>

                        {/* Payment */}
                        <td
                          style={{
                            padding: '0.85rem 1rem',
                            borderTop: '1px solid var(--border)',
                            borderBottom: '1px solid var(--border)',
                          }}
                        >
                          <span style={{ fontWeight: 600, fontSize: '0.82rem' }}>{ord.paymentMethod}</span>
                          <span style={{ display: 'block', fontSize: '0.73rem', color: ord.paymentStatus === 'Completed' ? '#16a34a' : '#d97706', fontWeight: 600 }}>
                            {ord.paymentStatus}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td
                          style={{
                            padding: '0.85rem 1rem',
                            borderTop: '1px solid var(--border)',
                            borderBottom: '1px solid var(--border)',
                          }}
                        >
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '0.25rem 0.65rem',
                              borderRadius: '9999px',
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              backgroundColor: badgeStyle.bg,
                              color: badgeStyle.color,
                              border: `1px solid ${badgeStyle.border}`,
                            }}
                          >
                            {ord.status}
                          </span>
                        </td>

                        {/* Update Status Action Select & View Button */}
                        <td
                          style={{
                            padding: '0.85rem 1rem',
                            textAlign: 'right',
                            borderTopRightRadius: '12px',
                            borderBottomRightRadius: '12px',
                            borderTop: '1px solid var(--border)',
                            borderBottom: '1px solid var(--border)',
                            borderRight: '1px solid var(--border)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              style={{
                                padding: '0.35rem 0.6rem',
                                borderRadius: '6px',
                                backgroundColor: '#f3f4f6',
                                color: 'var(--text-main)',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                              }}
                              title="View Details"
                            >
                              <Eye size={14} /> View
                            </button>

                            <select
                              value={ord.status}
                              onChange={(e) => handleStatusChange(ord._id, e.target.value as OrderStatus)}
                              className="form-control"
                              style={{
                                fontSize: '0.8rem',
                                padding: '0.3rem 0.5rem',
                                width: 'auto',
                                fontWeight: 700,
                                borderRadius: '8px',
                              }}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls Footer matching reference design */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border)',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: currentPage === 1 ? 'var(--text-muted)' : 'var(--secondary)',
                opacity: currentPage === 1 ? 0.5 : 1,
              }}
            >
              <ChevronLeft size={16} /> Previous
            </button>

            {/* Page Numbers */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: currentPage === pageNum ? 700 : 500,
                    color: currentPage === pageNum ? '#ffffff' : 'var(--text-main)',
                    backgroundColor: currentPage === pageNum ? 'var(--primary)' : 'transparent',
                    border: currentPage === pageNum ? 'none' : '1px solid var(--border)',
                  }}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--secondary)',
                opacity: currentPage === totalPages ? 0.5 : 1,
              }}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Order Details View Modal */}
      {selectedOrder && (
        <Modal
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          title={`Order Details #${selectedOrder._id}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
              <div>
                <strong style={{ fontSize: '0.95rem' }}>Customer: {selectedOrder.shippingAddress?.fullName}</strong>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Phone: {selectedOrder.shippingAddress?.phone}</span>
                <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Delivery Address: {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.pincode}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>₹{selectedOrder.totalPrice}</span>
                <span style={{ display: 'block', fontSize: '0.78rem', color: '#16a34a', fontWeight: 600 }}>
                  Payment: {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})
                </span>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.5rem' }}>Items Ordered:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedOrder.orderItems.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', backgroundColor: '#f9fafb', borderRadius: '8px', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <img src={item.image} alt={item.name} style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }} />
                      <span><strong>{item.name}</strong> x {item.quantity}</span>
                    </div>
                    <strong style={{ color: 'var(--secondary)' }}>₹{item.price * item.quantity}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
};
