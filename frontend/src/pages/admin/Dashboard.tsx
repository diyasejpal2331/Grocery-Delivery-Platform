import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingBag, Package, Users as UsersIcon, Plus, ArrowUpRight } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';
import { Order } from '../../types/Order';
import { Product } from '../../types/Product';
import { Loader } from '../../components/common/Loader';

export const Dashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminOverview = async () => {
      try {
        const [allOrders, allProducts] = await Promise.all([
          orderService.getAllOrders(),
          productService.getProducts(),
        ]);
        setOrders(allOrders);
        setProducts(allProducts);
      } catch (err) {
        console.error('Failed to load admin overview:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminOverview();
  }, []);

  if (loading) return <Loader fullScreen text="Loading Admin Dashboard..." />;

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)' }}>
            Admin Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Store metrics, product catalog overview, and order processing
          </p>
        </div>

        <Link to="/admin/add-product" className="btn btn-primary" style={{ padding: '0.65rem 1.1rem', fontSize: '0.9rem' }}>
          <Plus size={18} /> Add New Product
        </Link>
      </div>

      {/* Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '20px', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL REVENUE</span>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '10px' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)' }}>₹{totalRevenue}</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--primary-hover)', fontWeight: 600 }}>+18% from last month</span>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '20px', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL ORDERS</span>
            <div style={{ padding: '0.5rem', backgroundColor: '#eff6ff', color: '#1d4ed8', borderRadius: '10px' }}>
              <ShoppingBag size={20} />
            </div>
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)' }}>{orders.length}</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Customer fulfillment active</span>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '20px', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>PRODUCTS IN STOCK</span>
            <div style={{ padding: '0.5rem', backgroundColor: '#fffbeb', color: '#b45309', borderRadius: '10px' }}>
              <Package size={20} />
            </div>
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)' }}>{products.length}</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Catalog active items</span>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '20px', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>REGISTERED USERS</span>
            <div style={{ padding: '0.5rem', backgroundColor: '#f3e8ff', color: '#7e22ce', borderRadius: '10px' }}>
              <UsersIcon size={20} />
            </div>
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)' }}>128</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--primary-hover)', fontWeight: 600 }}>Active shoppers</span>
        </div>
      </div>

      {/* Admin Quick Links Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
        <Link to="/admin/products" className="btn btn-secondary" style={{ padding: '1rem', justifyContent: 'space-between' }}>
          <span>Manage Products</span> <ArrowUpRight size={16} />
        </Link>
        <Link to="/admin/orders" className="btn btn-secondary" style={{ padding: '1rem', justifyContent: 'space-between' }}>
          <span>Manage Orders</span> <ArrowUpRight size={16} />
        </Link>
        <Link to="/admin/users" className="btn btn-secondary" style={{ padding: '1rem', justifyContent: 'space-between' }}>
          <span>Manage Users</span> <ArrowUpRight size={16} />
        </Link>
        <Link to="/admin/categories" className="btn btn-secondary" style={{ padding: '1rem', justifyContent: 'space-between' }}>
          <span>Categories</span> <ArrowUpRight size={16} />
        </Link>
      </div>

      {/* Recent Orders Overview */}
      <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '20px', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--secondary)' }}>Recent Customer Orders</h3>
          <Link to="/admin/orders" style={{ color: 'var(--primary-hover)', fontWeight: 700, fontSize: '0.9rem' }}>View All Orders</Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {orders.slice(0, 4).map((ord) => (
            <div key={ord._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
              <div>
                <strong style={{ color: 'var(--secondary)' }}>#{ord._id}</strong>
                <span style={{ color: 'var(--text-muted)', marginLeft: '0.75rem' }}>
                  {ord.shippingAddress.fullName}
                </span>
              </div>
              <div>
                <span style={{ fontWeight: 700, marginRight: '1.5rem' }}>₹{ord.totalPrice}</span>
                <span className="badge badge-green">{ord.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
