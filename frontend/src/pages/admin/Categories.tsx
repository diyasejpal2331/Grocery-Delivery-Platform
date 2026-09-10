import React, { useEffect, useState } from 'react';
import { Leaf, Plus, FolderTree, Package, Edit, Trash2 } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { productService, INITIAL_CATEGORIES } from '../../services/productService';
import { Category, Product } from '../../types/Product';
import { Modal } from '../../components/common/Modal';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  useEffect(() => {
    const fetchCatsAndProducts = async () => {
      const [list, prods] = await Promise.all([
        productService.getCategories(),
        productService.getProducts(),
      ]);
      setCategories(list);
      setProducts(prods);
    };
    fetchCatsAndProducts();
  }, []);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setErrorMsg(null);
    setSubmitting(true);

    try {
      const categoryPayload = {
        name: newCatName.trim(),
        slug: newCatName.toLowerCase().replace(/\s+/g, '-'),
        description: newCatDesc.trim() || 'Fresh store produce category',
      };

      const created = await productService.createCategory(categoryPayload);

      setCategories((prev) => [...prev, created]);
      setNewCatName('');
      setNewCatDesc('');
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Failed to add category:', err);
      setErrorMsg(err.message || 'Failed to save category to database.');
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryItemCount = (catName: string) => {
    return products.filter((p) => p.categoryName?.toLowerCase() === catName.toLowerCase()).length;
  };

  return (
    <AdminLayout
      title="Category Management"
      subtitle="Organize store offerings into structured grocery categories."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Header Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--secondary)' }}>
              Grocery Categories ({categories.length})
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Browse and configure platform product categories
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
            style={{ padding: '0.55rem 1.1rem', fontSize: '0.88rem', borderRadius: '9999px' }}
          >
            <Plus size={17} /> Add New Category
          </button>
        </div>

        {/* Category Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {categories.map((cat) => {
            const count = getCategoryItemCount(cat.name);

            return (
              <div
                key={cat._id}
                className="glass-card animate-fade-in"
                style={{
                  padding: '1.5rem',
                  borderRadius: '18px',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1rem',
                    }}
                  >
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <FolderTree size={22} color="var(--primary)" />
                    </div>

                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '6px',
                        backgroundColor: '#f3f4f6',
                        color: 'var(--text-main)',
                      }}
                    >
                      {count} {count === 1 ? 'Product' : 'Products'}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      color: 'var(--secondary)',
                      marginBottom: '0.35rem',
                    }}
                  >
                    {cat.name}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.82rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.45,
                    }}
                  >
                    {cat.description || 'Fresh grocery category produce and items.'}
                  </p>
                </div>

                <div
                  style={{
                    marginTop: '1.25rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border)',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>Slug: <code>{cat.slug}</code></span>
                  <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Active</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal for Adding New Category */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setErrorMsg(null);
          }}
          title="Add New Category"
        >
          {errorMsg && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                backgroundColor: '#fee2e2',
                color: '#991b1b',
                fontWeight: 600,
                fontSize: '0.85rem',
                marginBottom: '1rem',
                border: '1px solid #fca5a5',
              }}
            >
              {errorMsg}
            </div>
          )}
          <form onSubmit={handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label>Category Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Organic Beverages"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Category details and produce info..."
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                className="form-control"
                rows={3}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ padding: '0.8rem', marginTop: '0.5rem' }}
            >
              {submitting ? 'Saving Category...' : 'Save Category'}
            </button>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
};
