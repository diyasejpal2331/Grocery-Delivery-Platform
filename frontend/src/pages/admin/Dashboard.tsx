import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  IndianRupee,
  ShoppingBag,
  Package,
  Users as UsersIcon,
  Plus,
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminStatCard } from '../../components/admin/AdminStatCard';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';
import { authService } from '../../services/authService';
import { Order, OrderStatus } from '../../types/Order';
import { Product } from '../../types/Product';
import { User } from '../../types/User';
import { Loader } from '../../components/common/Loader';
import { Modal } from '../../components/common/Modal';
import { getImageUrl } from '../../utils/imageUtils';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);

  const fetchAdminOverview = async () => {
    setLoading(true);
    try {
      const [allOrders, allProducts, allUsers] = await Promise.all([
        orderService.getAllOrders(),
        productService.getProducts(),
        authService.getUsers(),
      ]);
      setOrders(allOrders);
      setProducts(allProducts);
      setUsers(allUsers);
    } catch (err) {
      console.error('Failed to load admin overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminOverview();
  }, [location.pathname, location.key]);

  const handleStatusChange = async (id: string, newStatus: OrderStatus) => {
    try {
      const updated = await orderService.updateOrderStatus(id, newStatus);
      setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder(updated);
      }
      setActiveActionMenu(null);
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  // Metrics computation from real API data
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'Pending' || o.status === 'Processing'
  ).length;
  const completedOrdersCount = orders.filter((o) => o.status === 'Delivered').length;
  const cancelledOrdersCount = orders.filter((o) => o.status === 'Cancelled').length;
  const lowStockProductsCount = products.filter((p) => p.stock < 15).length;

  // Filter orders based on active tab and search query
  const filteredOrders = orders.filter((o) => {
    const matchesTab =
      activeTab === 'All' || o.status.toLowerCase() === activeTab.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      o._id.toLowerCase().includes(query) ||
      o.shippingAddress?.fullName.toLowerCase().includes(query) ||
      o.orderItems.some((item) => item.name.toLowerCase().includes(query));
    return matchesTab && matchesSearch;
  });

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
      <AdminLayout title="Admin Dashboard">
        <Loader fullScreen text="Loading Grocery Platform Dashboard..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Order Management"
      subtitle="Track and manage all grocery orders in real time."
      onSearch={(q) => setSearchQuery(q)}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* TOP STATISTICAL METRICS CARDS GRID (Reference UI inspired) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '1.25rem',
          }}
        >
          <AdminStatCard
            title="Total Revenue"
            value={`₹${totalRevenue.toLocaleString()}`}
            change="+18.5%"
            changeType="positive"
            subtitle="Gross sales generated"
            icon={IndianRupee}
            iconBgColor="#fff1f2"
            iconColor="var(--primary)"
          />

          <AdminStatCard
            title="Total Orders"
            value={orders.length}
            change="+12%"
            changeType="positive"
            subtitle="Active customer orders"
            icon={ShoppingBag}
            iconBgColor="#eff6ff"
            iconColor="#2563eb"
          />

          <AdminStatCard
            title="Orders Pending"
            value={pendingOrdersCount}
            change={pendingOrdersCount > 0 ? 'Needs dispatch' : 'All clear'}
            changeType={pendingOrdersCount > 0 ? 'negative' : 'positive'}
            subtitle="Processing & pending"
            icon={Clock}
            iconBgColor="#fffbeb"
            iconColor="#d97706"
          />

          <AdminStatCard
            title="Orders Completed"
            value={completedOrdersCount}
            change={`${Math.round(
              (completedOrdersCount / (orders.length || 1)) * 100
            )}% rate`}
            changeType="positive"
            subtitle="Successfully delivered"
            icon={CheckCircle}
            iconBgColor="#f0fdf4"
            iconColor="#16a34a"
          />
        </div>

        {/* RECENT ORDERS / ORDER LIST MANAGEMENT SECTION (Reference Image Inspired) */}
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
          {/* Header Row: Title + Primary Add Action */}
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
                  letterSpacing: '-0.01em',
                }}
              >
                Orders List
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Real-time stream of customer grocery orders
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={fetchAdminOverview}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}
                title="Refresh Data"
              >
                <RefreshCw size={15} /> Refresh
              </button>

              <Link
                to="/admin/add-product"
                className="btn btn-primary"
                style={{
                  padding: '0.55rem 1.1rem',
                  fontSize: '0.88rem',
                  borderRadius: '9999px',
                }}
              >
                <Plus size={17} /> Add Product
              </Link>
            </div>
          </div>

          {/* Filter Tabs & Search Control Bar */}
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
            {/* Filter Tabs matching reference UI */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                flexWrap: 'wrap',
              }}
            >
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
                    onClick={() => setActiveTab(tab.id)}
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

            {/* In-table Search bar */}
            <div style={{ position: 'relative', width: '220px' }}>
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.4rem 0.85rem 0.4rem 2.2rem',
                  borderRadius: '9999px',
                  border: '1px solid var(--border)',
                  backgroundColor: '#f9fafb',
                  fontSize: '0.82rem',
                  outline: 'none',
                }}
              />
              <Search
                size={14}
                color="var(--text-muted)"
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              />
            </div>
          </div>

          {/* Orders Data Table matching Reference Design */}
          {filteredOrders.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '3rem 1rem',
                color: 'var(--text-muted)',
              }}
            >
              <ShoppingBag
                size={40}
                color="var(--text-muted)"
                style={{ marginBottom: '0.5rem', opacity: 0.5 }}
              />
              <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>No orders found</p>
              <span style={{ fontSize: '0.8rem' }}>
                Try adjusting your search query or tab filter.
              </span>
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
                    <th style={{ padding: '0.75rem 1rem' }}>Product Items</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Customer Name</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Order ID</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Amount</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((ord) => {
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
                        {/* Product Items Thumbnail & Name */}
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
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem',
                            }}
                          >
                            <img
                              src={getImageUrl(firstItem?.image)}
                              alt={firstItem?.name || 'Order product'}
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '8px',
                                objectFit: 'cover',
                                border: '1px solid var(--border)',
                              }}
                            />
                            <div>
                              <strong
                                style={{
                                  display: 'block',
                                  color: 'var(--secondary)',
                                  fontWeight: 700,
                                  fontSize: '0.88rem',
                                }}
                              >
                                {firstItem?.name || 'Grocery Basket'}
                              </strong>
                              <span
                                style={{
                                  fontSize: '0.75rem',
                                  color: 'var(--text-muted)',
                                }}
                              >
                                {firstItem
                                  ? `${firstItem.quantity} x ₹${firstItem.price}`
                                  : 'Items'}
                                {extraItemsCount > 0 &&
                                  ` + ${extraItemsCount} more`}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Customer Name */}
                        <td
                          style={{
                            padding: '0.85rem 1rem',
                            borderTop: '1px solid var(--border)',
                            borderBottom: '1px solid var(--border)',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                            }}
                          >
                            <div
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--primary-light)',
                                color: 'var(--primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '0.75rem',
                              }}
                            >
                              {ord.shippingAddress?.fullName
                                ? ord.shippingAddress.fullName.charAt(0)
                                : 'C'}
                            </div>
                            <div>
                              <strong
                                style={{
                                  display: 'block',
                                  color: 'var(--secondary)',
                                  fontSize: '0.85rem',
                                }}
                              >
                                {ord.shippingAddress?.fullName || 'Customer'}
                              </strong>
                              <span
                                style={{
                                  fontSize: '0.73rem',
                                  color: 'var(--text-muted)',
                                }}
                              >
                                {ord.shippingAddress?.phone || 'No phone'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Order ID & Date */}
                        <td
                          style={{
                            padding: '0.85rem 1rem',
                            borderTop: '1px solid var(--border)',
                            borderBottom: '1px solid var(--border)',
                          }}
                        >
                          <strong
                            style={{
                              display: 'block',
                              color: 'var(--secondary)',
                              fontSize: '0.85rem',
                            }}
                          >
                            #{ord._id}
                          </strong>
                          <span
                            style={{
                              fontSize: '0.73rem',
                              color: 'var(--text-muted)',
                            }}
                          >
                            {ord.createdAt
                              ? new Date(ord.createdAt).toLocaleDateString()
                              : 'Recent'}
                          </span>
                        </td>

                        {/* Amount */}
                        <td
                          style={{
                            padding: '0.85rem 1rem',
                            borderTop: '1px solid var(--border)',
                            borderBottom: '1px solid var(--border)',
                          }}
                        >
                          <strong
                            style={{
                              display: 'block',
                              color: 'var(--secondary)',
                              fontWeight: 800,
                            }}
                          >
                            ₹{ord.totalPrice}
                          </strong>
                          <span
                            style={{
                              fontSize: '0.73rem',
                              color:
                                ord.paymentStatus === 'Completed'
                                  ? '#16a34a'
                                  : '#d97706',
                              fontWeight: 600,
                            }}
                          >
                            Paid via {ord.paymentMethod}
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

                        {/* Action Menu */}
                        <td
                          style={{
                            padding: '0.85rem 1rem',
                            textAlign: 'right',
                            borderTopRightRadius: '12px',
                            borderBottomRightRadius: '12px',
                            borderTop: '1px solid var(--border)',
                            borderBottom: '1px solid var(--border)',
                            borderRight: '1px solid var(--border)',
                            position: 'relative',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              gap: '0.4rem',
                            }}
                          >
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
                              title="View Order Details"
                            >
                              <Eye size={14} /> View
                            </button>

                            <button
                              onClick={() =>
                                setActiveActionMenu(
                                  activeActionMenu === ord._id ? null : ord._id
                                )
                              }
                              style={{
                                padding: '0.35rem',
                                color: 'var(--text-muted)',
                                borderRadius: '6px',
                              }}
                            >
                              <MoreVertical size={16} />
                            </button>

                            {/* Dropdown Action Menu */}
                            {activeActionMenu === ord._id && (
                              <div
                                className="glass-card animate-fade-in"
                                style={{
                                  position: 'absolute',
                                  right: '1rem',
                                  top: '2.5rem',
                                  width: '160px',
                                  backgroundColor: '#ffffff',
                                  borderRadius: '10px',
                                  boxShadow: 'var(--shadow-lg)',
                                  zIndex: 50,
                                  padding: '0.35rem 0',
                                  textAlign: 'left',
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: '0.7rem',
                                    color: 'var(--text-muted)',
                                    fontWeight: 700,
                                    padding: '0.3rem 0.75rem',
                                    display: 'block',
                                    textTransform: 'uppercase',
                                  }}
                                >
                                  Update Status
                                </span>
                                {(
                                  [
                                    'Pending',
                                    'Processing',
                                    'Out for Delivery',
                                    'Delivered',
                                    'Cancelled',
                                  ] as OrderStatus[]
                                ).map((st) => (
                                  <button
                                    key={st}
                                    onClick={() => handleStatusChange(ord._id, st)}
                                    style={{
                                      display: 'block',
                                      width: '100%',
                                      padding: '0.35rem 0.75rem',
                                      fontSize: '0.8rem',
                                      color:
                                        ord.status === st
                                          ? 'var(--primary)'
                                          : 'var(--text-main)',
                                      fontWeight: ord.status === st ? 700 : 500,
                                      textAlign: 'left',
                                      backgroundColor:
                                        ord.status === st ? 'var(--primary-light)' : 'transparent',
                                    }}
                                  >
                                    {st}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* BOTTOM TWO COLUMNS: Low Stock Warning + Quick Catalog Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {/* Low Stock Warning Card */}
          <div
            className="glass-card"
            style={{
              padding: '1.5rem',
              borderRadius: '18px',
              backgroundColor: '#ffffff',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div
                  style={{
                    padding: '0.4rem',
                    borderRadius: '8px',
                    backgroundColor: '#fffbeb',
                    color: '#b45309',
                  }}
                >
                  <AlertTriangle size={18} />
                </div>
                <h3
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: 'var(--secondary)',
                  }}
                >
                  Low Stock Inventory Alert
                </h3>
              </div>

              <Link
                to="/admin/products"
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--primary)',
                }}
              >
                Manage Stock →
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {products
                .filter((p) => p.stock < 35)
                .slice(0, 3)
                .map((p) => (
                  <div
                    key={p._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.6rem 0.85rem',
                      backgroundColor: '#f9fafb',
                      borderRadius: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <img
                        src={p.image}
                        alt={p.name}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          objectFit: 'cover',
                        }}
                      />
                      <div>
                        <strong
                          style={{
                            fontSize: '0.82rem',
                            color: 'var(--text-main)',
                            display: 'block',
                          }}
                        >
                          {p.name}
                        </strong>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {p.categoryName || 'Produce'}
                        </span>
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.5rem',
                        borderRadius: '6px',
                        backgroundColor: '#fee2e2',
                        color: '#991b1b',
                      }}
                    >
                      {p.stock} left
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Platform Performance Overview */}
          <div
            className="glass-card"
            style={{
              padding: '1.5rem',
              borderRadius: '18px',
              backgroundColor: '#ffffff',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}
            >
              <h3
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: 'var(--secondary)',
                }}
              >
                Platform Quick Access
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Grocery Management
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
              }}
            >
              <Link
                to="/admin/orders"
                style={{
                  padding: '0.85rem',
                  borderRadius: '12px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  color: 'var(--secondary)',
                }}
              >
                <span>Orders ({orders.length})</span>
                <ArrowUpRight size={16} color="var(--primary)" />
              </Link>

              <Link
                to="/admin/products"
                style={{
                  padding: '0.85rem',
                  borderRadius: '12px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  color: 'var(--secondary)',
                }}
              >
                <span>Products ({products.length})</span>
                <ArrowUpRight size={16} color="var(--primary)" />
              </Link>

              <Link
                to="/admin/users"
                style={{
                  padding: '0.85rem',
                  borderRadius: '12px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  color: 'var(--secondary)',
                }}
              >
                <span>Users / Customers ({users.length})</span>
                <ArrowUpRight size={16} color="var(--primary)" />
              </Link>

              <Link
                to="/admin/categories"
                style={{
                  padding: '0.85rem',
                  borderRadius: '12px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  color: 'var(--secondary)',
                }}
              >
                <span>Categories</span>
                <ArrowUpRight size={16} color="var(--primary)" />
              </Link>
            </div>
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
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div>
                <strong style={{ fontSize: '0.95rem' }}>
                  Customer: {selectedOrder.shippingAddress?.fullName}
                </strong>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  Phone: {selectedOrder.shippingAddress?.phone}
                </span>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  Delivery Address:{' '}
                  {selectedOrder.shippingAddress?.street},{' '}
                  {selectedOrder.shippingAddress?.city},{' '}
                  {selectedOrder.shippingAddress?.pincode}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: 'var(--primary)',
                  }}
                >
                  ₹{selectedOrder.totalPrice}
                </span>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.78rem',
                    color: '#16a34a',
                    fontWeight: 600,
                  }}
                >
                  Payment: {selectedOrder.paymentMethod} (
                  {selectedOrder.paymentStatus})
                </span>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Items Ordered:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedOrder.orderItems.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem 0.75rem',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          objectFit: 'cover',
                        }}
                      />
                      <span>
                        <strong>{item.name}</strong> x {item.quantity}
                      </span>
                    </div>
                    <strong style={{ color: 'var(--secondary)' }}>
                      ₹{item.price * item.quantity}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border)',
              }}
            >
              <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                Update Status:
              </label>
              <select
                value={selectedOrder.status}
                onChange={(e) =>
                  handleStatusChange(
                    selectedOrder._id,
                    e.target.value as OrderStatus
                  )
                }
                className="form-control"
                style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem', width: 'auto' }}
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
};
