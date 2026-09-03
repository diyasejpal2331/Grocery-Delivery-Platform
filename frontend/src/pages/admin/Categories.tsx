import React, { useEffect, useState } from 'react';
import { Leaf, Plus } from 'lucide-react';
import { productService, INITIAL_CATEGORIES } from '../../services/productService';
import { Category } from '../../types/Product';
import { Modal } from '../../components/common/Modal';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  useEffect(() => {
    const fetchCats = async () => {
      const list = await productService.getCategories();
      setCategories(list);
    };
    fetchCats();
  }, []);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const created: Category = {
      _id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      slug: newCatName.toLowerCase().replace(/\s+/g, '-'),
      description: newCatDesc.trim() || 'Fresh store produce category',
    };

    setCategories((prev) => [...prev, created]);
    setNewCatName('');
    setNewCatDesc('');
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)' }}>
            Category Management
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Organize store offerings into structured grocery categories
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary" style={{ padding: '0.65rem 1.1rem', fontSize: '0.9rem' }}>
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
        {categories.map((cat) => (
          <div key={cat._id} className="glass-card" style={{ padding: '1.5rem', borderRadius: '20px', backgroundColor: '#ffffff' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Leaf size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '0.4rem' }}>{cat.name}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{cat.description || 'No description provided'}</p>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Category">
        <form onSubmit={handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label>Category Name *</label>
            <input type="text" required placeholder="e.g. Organic Snacks" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} className="form-control" />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea placeholder="Category details..." value={newCatDesc} onChange={(e) => setNewCatDesc(e.target.value)} className="form-control" rows={3} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem', marginTop: '0.5rem' }}>
            Save Category
          </button>
        </form>
      </Modal>
    </div>
  );
};
