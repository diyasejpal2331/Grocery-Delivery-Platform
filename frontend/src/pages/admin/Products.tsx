import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  AlertTriangle,
  Leaf,
  RefreshCw,
  Package,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { productService, INITIAL_CATEGORIES } from '../../services/productService';
import { Product, Category } from '../../types/Product';
import { Loader } from '../../components/common/Loader';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  const loadProductsData = async () => {
    setLoading(true);
    try {
      const [prodData, catData] = await Promise.all([
        productService.getProducts(),
        productService.getCategories(),
      ]);
      setProducts(prodData);
      setCategories(catData);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductsData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await productService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.categoryName?.toLowerCase().includes(search.toLowerCase());

    const matchesCat =
      selectedCat === 'All' ||
      p.category === selectedCat ||
      p.categoryName?.toLowerCase() === selectedCat.toLowerCase();

    return matchesSearch && matchesCat;
  });

  if (loading) {
    return (
      <AdminLayout title="Product Inventory">
        <Loader fullScreen text="Loading Grocery Products Catalog..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Product Inventory"
      subtitle="Manage grocery product offerings, pricing, stock levels, and discounts."
      onSearch={(q) => setSearch(q)}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
          {/* Header Row: Title + Add Product Button */}
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
                Inventory List ({products.length} Products)
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Active produce and packaged grocery items
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={loadProductsData}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}
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
                <Plus size={17} /> Add New Product
              </Link>
            </div>
          </div>

          {/* Search & Category Filter Controls */}
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
            {/* Category Filter Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setSelectedCat('All')}
                style={{
                  padding: '0.4rem 0.9rem',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: selectedCat === 'All' ? 700 : 600,
                  color: selectedCat === 'All' ? 'var(--primary)' : 'var(--text-muted)',
                  backgroundColor: selectedCat === 'All' ? 'var(--primary-light)' : 'transparent',
                  border: selectedCat === 'All' ? '1px solid #fecdd3' : '1px solid transparent',
                }}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCat(cat.name)}
                  style={{
                    padding: '0.4rem 0.9rem',
                    borderRadius: '9999px',
                    fontSize: '0.82rem',
                    fontWeight: selectedCat === cat.name ? 700 : 600,
                    color: selectedCat === cat.name ? 'var(--primary)' : 'var(--text-muted)',
                    backgroundColor: selectedCat === cat.name ? 'var(--primary-light)' : 'transparent',
                    border: selectedCat === cat.name ? '1px solid #fecdd3' : '1px solid transparent',
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Inventory Filter Search Input */}
            <div style={{ position: 'relative', width: '220px' }}>
              <input
                type="text"
                placeholder="Search product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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

          {/* Products Table */}
          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <Package size={40} color="var(--text-muted)" style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
              <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>No products found</p>
              <span style={{ fontSize: '0.8rem' }}>No inventory items match your search filter.</span>
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
                    <th style={{ padding: '0.75rem 1rem' }}>Product Info</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Price & MRP</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Stock Status</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Organic</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => {
                    const isLowStock = p.stock < 20;

                    return (
                      <tr
                        key={p._id}
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid var(--border)',
                          borderRadius: '12px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        }}
                      >
                        {/* Product Image & Title */}
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
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img
                              src={p.image}
                              alt={p.name}
                              style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover' }}
                            />
                            <div>
                              <strong style={{ display: 'block', color: 'var(--secondary)', fontWeight: 700 }}>
                                {p.name}
                              </strong>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                Unit: {p.unit}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Category Badge */}
                        <td
                          style={{
                            padding: '0.85rem 1rem',
                            borderTop: '1px solid var(--border)',
                            borderBottom: '1px solid var(--border)',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              padding: '0.2rem 0.65rem',
                              borderRadius: '6px',
                              backgroundColor: 'var(--primary-light)',
                              color: 'var(--primary)',
                            }}
                          >
                            {p.categoryName || 'Produce'}
                          </span>
                        </td>

                        {/* Price */}
                        <td
                          style={{
                            padding: '0.85rem 1rem',
                            borderTop: '1px solid var(--border)',
                            borderBottom: '1px solid var(--border)',
                          }}
                        >
                          <strong style={{ color: 'var(--secondary)', fontWeight: 800 }}>₹{p.price}</strong>
                          {p.originalPrice && (
                            <span style={{ marginLeft: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                              ₹{p.originalPrice}
                            </span>
                          )}
                        </td>

                        {/* Stock Status */}
                        <td
                          style={{
                            padding: '0.85rem 1rem',
                            borderTop: '1px solid var(--border)',
                            borderBottom: '1px solid var(--border)',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              padding: '0.2rem 0.6rem',
                              borderRadius: '6px',
                              backgroundColor: isLowStock ? '#fee2e2' : '#f0fdf4',
                              color: isLowStock ? '#991b1b' : '#166534',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                            }}
                          >
                            {isLowStock && <AlertTriangle size={12} />}
                            {p.stock} pcs {isLowStock ? '(Low Stock)' : 'In Stock'}
                          </span>
                        </td>

                        {/* Organic Status */}
                        <td
                          style={{
                            padding: '0.85rem 1rem',
                            borderTop: '1px solid var(--border)',
                            borderBottom: '1px solid var(--border)',
                          }}
                        >
                          {p.isOrganic ? (
                            <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                              <Leaf size={14} /> Organic
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Standard</span>
                          )}
                        </td>

                        {/* Action Edit/Delete Buttons */}
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
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                            <Link
                              to={`/admin/add-product?id=${p._id}`}
                              style={{
                                padding: '0.4rem 0.65rem',
                                backgroundColor: '#f3f4f6',
                                color: 'var(--secondary)',
                                borderRadius: '8px',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                              }}
                              title="Edit Item"
                            >
                              <Edit size={14} /> Edit
                            </Link>

                            <button
                              onClick={() => handleDelete(p._id)}
                              style={{
                                padding: '0.4rem 0.65rem',
                                backgroundColor: '#fee2e2',
                                color: '#991b1b',
                                borderRadius: '8px',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                              }}
                              title="Delete Item"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
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
      </div>
    </AdminLayout>
  );
};
