import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Leaf } from 'lucide-react';
import { productService } from '../../services/productService';
import { Product } from '../../types/Product';
import { Loader } from '../../components/common/Loader';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadProducts = async () => {
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await productService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.categoryName?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader fullScreen text="Loading product inventory..." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)' }}>
            Product Inventory Management
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Manage pricing, stock levels, and store offerings ({products.length} products)
          </p>
        </div>

        <Link to="/admin/add-product" className="btn btn-primary" style={{ padding: '0.65rem 1.1rem', fontSize: '0.9rem' }}>
          <Plus size={18} /> Add Product
        </Link>
      </div>

      {/* Search Bar */}
      <div className="glass-card" style={{ padding: '0.75rem 1rem', borderRadius: '14px', backgroundColor: '#ffffff', maxWidth: '400px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Search size={18} color="var(--text-muted)" />
        <input
          type="text"
          placeholder="Filter inventory..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
        />
      </div>

      {/* Products Table */}
      <div className="glass-card" style={{ borderRadius: '20px', backgroundColor: '#ffffff', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '1rem 1.5rem' }}>Product</th>
              <th style={{ padding: '1rem' }}>Category</th>
              <th style={{ padding: '1rem' }}>Price</th>
              <th style={{ padding: '1rem' }}>Stock</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img src={product.image} alt={product.name} style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }} />
                  <div>
                    <strong style={{ display: 'block', color: 'var(--text-main)' }}>{product.name}</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{product.unit}</span>
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span className="badge badge-green">{product.categoryName || 'Produce'}</span>
                </td>
                <td style={{ padding: '1rem', fontWeight: 800, color: 'var(--secondary)' }}>
                  ₹{product.price}
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ color: product.stock < 10 ? 'var(--danger)' : 'var(--text-main)', fontWeight: 700 }}>
                    {product.stock} pcs
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <Link
                      to={`/admin/add-product?id=${product._id}`}
                      style={{ padding: '0.4rem', color: 'var(--text-muted)', borderRadius: '6px' }}
                      title="Edit Product"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      style={{ padding: '0.4rem', color: 'var(--danger)', borderRadius: '6px' }}
                      title="Delete Product"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
