import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, Leaf, Image as ImageIcon } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { productService, INITIAL_CATEGORIES } from '../../services/productService';
import { Category } from '../../types/Product';

export const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('id');

  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [stock, setStock] = useState('50');
  const [unit, setUnit] = useState('1 kg');
  const [isOrganic, setIsOrganic] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const initForm = async () => {
      const catList = await productService.getCategories();
      setCategories(catList);

      if (productId) {
        try {
          const prod = await productService.getProductById(productId);
          setName(prod.name);
          setDescription(prod.description);
          setPrice(String(prod.price));
          setOriginalPrice(prod.originalPrice ? String(prod.originalPrice) : '');
          const prodCatId = typeof prod.category === 'object' && prod.category ? (prod.category as any)._id : prod.category;
          setCategory(prodCatId || (catList.length > 0 ? catList[0]._id : ''));
          setImage(prod.image);
          setStock(String(prod.stock));
          setUnit(prod.unit);
          setIsOrganic(prod.isOrganic ?? true);
        } catch (err) {
          console.error('Failed to load product details for edit:', err);
        }
      } else if (catList.length > 0) {
        setCategory(catList[0]._id);
      }
    };
    initForm();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!category) {
      setErrorMsg('Please select a category.');
      return;
    }

    setSubmitting(true);

    const selectedCat = categories.find((c) => c._id === category || c.name === category);

    const productPayload = {
      name,
      description,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      category,
      categoryName: selectedCat?.name || 'Produce',
      image: image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
      stock: Number(stock),
      unit,
      isOrganic,
    };

    try {
      if (productId) {
        await productService.updateProduct(productId, productPayload);
      } else {
        await productService.createProduct(productPayload);
      }
      navigate('/admin/products');
    } catch (err: any) {
      console.error('Failed to save product:', err);
      setErrorMsg(err.message || 'Failed to save product to database.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title={productId ? 'Edit Product' : 'Add New Product'}
      subtitle="Update inventory catalog, pricing, and stock details."
    >
      <div style={{ maxWidth: '720px', margin: '0 auto', width: '100%' }}>
        <button
          onClick={() => navigate('/admin/products')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.88rem',
            marginBottom: '1.25rem',
          }}
        >
          <ArrowLeft size={16} /> Back to Products Inventory
        </button>

        <div
          className="glass-card animate-fade-in"
          style={{
            padding: '2.25rem',
            borderRadius: '20px',
            backgroundColor: '#ffffff',
            border: '1px solid var(--border)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
          }}
        >
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--secondary)',
              marginBottom: '1.5rem',
            }}
          >
            {productId ? 'Edit Grocery Item' : 'New Grocery Item Details'}
          </h2>

          {errorMsg && (
            <div
              style={{
                padding: '0.85rem 1.1rem',
                borderRadius: '10px',
                backgroundColor: '#fee2e2',
                color: '#991b1b',
                fontWeight: 600,
                fontSize: '0.88rem',
                marginBottom: '1.25rem',
                border: '1px solid #fca5a5',
              }}
            >
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label>Product Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Organic Royal Gala Apples"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-control"
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label>Selling Price (₹) *</label>
                <input
                  type="number"
                  required
                  placeholder="180"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>MRP / Original Price (₹)</label>
                <input
                  type="number"
                  placeholder="220"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Stock Quantity *</label>
                <input
                  type="number"
                  required
                  placeholder="50"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Unit Measurement (e.g. 1 kg, 500 ml, 1 pack) *</label>
              <input
                type="text"
                required
                placeholder="1 kg"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Image URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Product Description</label>
              <textarea
                rows={3}
                placeholder="Freshly harvested organic produce details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-control"
              />
            </div>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
                backgroundColor: 'var(--primary-light)',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
              }}
            >
              <input
                type="checkbox"
                checked={isOrganic}
                onChange={(e) => setIsOrganic(e.target.checked)}
                style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }}
              />
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--secondary)' }}>
                <Leaf size={16} color="var(--primary)" /> Mark as 100% Organic Certified Produce
              </span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ padding: '0.85rem', marginTop: '0.5rem' }}
            >
              <Save size={18} /> {submitting ? 'Saving Product...' : productId ? 'Update Product' : 'Create Product'}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};
