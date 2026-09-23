import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Leaf, Plus, FolderTree, Package, Edit, Trash2 } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { productService } from '../../services/productService';
import { Category, Product } from '../../types/Product';
import { Modal } from '../../components/common/Modal';

export const AdminCategories: React.FC = () => {
  const location = useLocation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Edit Category State
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatDesc, setEditCatDesc] = useState('');
  const [editCatSlug, setEditCatSlug] = useState('');
  const [updating, setUpdating] = useState(false);
  const [editErrorMsg, setEditErrorMsg] = useState<string | null>(null);

  // Delete Category State
  const [deletingCat, setDeletingCat] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteErrorMsg, setDeleteErrorMsg] = useState<string | null>(null);

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
  }, [location.pathname, location.key]);

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

  const openEditModal = (cat: Category) => {
    setEditingCat(cat);
    setEditCatName(cat.name);
    setEditCatDesc(cat.description || '');
    setEditCatSlug(cat.slug || '');
    setEditErrorMsg(null);
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat || !editCatName.trim()) return;

    setEditErrorMsg(null);
    setUpdating(true);

    try {
      const updated = await productService.updateCategory(editingCat._id, {
        name: editCatName.trim(),
        description: editCatDesc.trim(),
        slug: editCatSlug.trim() || editCatName.trim().toLowerCase().replace(/\s+/g, '-'),
      });

      setCategories((prev) =>
        prev.map((c) => (c._id === editingCat._id ? updated : c))
      );
      setEditingCat(null);
    } catch (err: any) {
      console.error('Failed to update category:', err);
      setEditErrorMsg(err.message || 'Unable to update category. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const openDeleteModal = (cat: Category) => {
    setDeletingCat(cat);
    setDeleteErrorMsg(null);
  };

  const handleDeleteCategory = async () => {
    if (!deletingCat) return;

    const count = getCategoryItemCount(deletingCat.name);
    if (count > 0) {
      setDeleteErrorMsg('Cannot delete this category because products are associated with it.');
      return;
    }

    setDeleteErrorMsg(null);
    setDeleting(true);

    try {
      await productService.deleteCategory(deletingCat._id);
      setCategories((prev) => prev.filter((c) => c._id !== deletingCat._id));
      setDeletingCat(null);
    } catch (err: any) {
      console.error('Failed to delete category:', err);
      setDeleteErrorMsg(err.message || 'Unable to delete category. Please try again.');
    } finally {
      setDeleting(false);
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
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <div>
                    <span>Slug: <code>{cat.slug}</code></span>
                    <span style={{ marginLeft: '0.5rem', color: 'var(--primary)', fontWeight: 700 }}>• Active</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <button
                      onClick={() => openEditModal(cat)}
                      className="btn btn-outline"
                      style={{
                        padding: '0.3rem 0.65rem',
                        fontSize: '0.75rem',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                      title="Edit Category"
                    >
                      <Edit size={14} /> Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(cat)}
                      style={{
                        padding: '0.3rem 0.65rem',
                        fontSize: '0.75rem',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        border: '1px solid #fca5a5',
                        cursor: 'pointer',
                        fontWeight: 600,
                        transition: 'all 0.2s ease',
                      }}
                      title="Delete Category"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
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

        {/* Modal for Editing Existing Category */}
        <Modal
          isOpen={!!editingCat}
          onClose={() => {
            setEditingCat(null);
            setEditErrorMsg(null);
          }}
          title="Edit Category"
        >
          {editErrorMsg && (
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
              {editErrorMsg}
            </div>
          )}
          <form onSubmit={handleUpdateCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label>Category Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Fresh Fruits"
                value={editCatName}
                onChange={(e) => setEditCatName(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Category details and produce info..."
                value={editCatDesc}
                onChange={(e) => setEditCatDesc(e.target.value)}
                className="form-control"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Slug</label>
              <input
                type="text"
                placeholder="e.g. fresh-fruits"
                value={editCatSlug}
                onChange={(e) => setEditCatSlug(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <input
                type="text"
                disabled
                value="Active"
                className="form-control"
                style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => {
                  setEditingCat(null);
                  setEditErrorMsg(null);
                }}
                className="btn btn-outline"
                style={{ padding: '0.65rem 1.2rem' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="btn btn-primary"
                style={{ padding: '0.65rem 1.2rem' }}
              >
                {updating ? 'Updating Category...' : 'Update Category'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Modal for Deleting Category */}
        <Modal
          isOpen={!!deletingCat}
          onClose={() => {
            setDeletingCat(null);
            setDeleteErrorMsg(null);
          }}
          title="Delete Category?"
        >
          {deletingCat && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {deleteErrorMsg && (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: '#fee2e2',
                    color: '#991b1b',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    border: '1px solid #fca5a5',
                  }}
                >
                  {deleteErrorMsg}
                </div>
              )}

              {getCategoryItemCount(deletingCat.name) > 0 ? (
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  <p style={{ fontWeight: 700, color: '#dc2626', marginBottom: '0.5rem' }}>
                    Cannot Delete Category With Active Products
                  </p>
                  <p>
                    The category <strong>"{deletingCat.name}"</strong> currently contains{' '}
                    <strong>{getCategoryItemCount(deletingCat.name)} product(s)</strong>.
                  </p>
                  <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                    Please move or remove the products first before deleting this category.
                  </p>
                </div>
              ) : (
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  <p>
                    Are you sure you want to delete <strong>"{deletingCat.name}"</strong>?
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.25rem' }}>
                    This action cannot be undone.
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setDeletingCat(null);
                    setDeleteErrorMsg(null);
                  }}
                  className="btn btn-outline"
                  style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                {getCategoryItemCount(deletingCat.name) === 0 && (
                  <button
                    type="button"
                    onClick={handleDeleteCategory}
                    disabled={deleting}
                    style={{
                      padding: '0.55rem 1.1rem',
                      fontSize: '0.85rem',
                      backgroundColor: '#dc2626',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 700,
                      cursor: deleting ? 'not-allowed' : 'pointer',
                      opacity: deleting ? 0.7 : 1,
                    }}
                  >
                    {deleting ? 'Deleting...' : 'Delete Category'}
                  </button>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
};
