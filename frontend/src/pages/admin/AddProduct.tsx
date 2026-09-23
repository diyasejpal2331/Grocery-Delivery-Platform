import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, Leaf, Upload, Image as ImageIcon, Trash2, RefreshCw, Link as LinkIcon, Check } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { productService } from '../../services/productService';
import { uploadService } from '../../services/uploadService';
import { getImageUrl } from '../../utils/imageUtils';
import { Category } from '../../types/Product';

export const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('id');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [showUrlOption, setShowUrlOption] = useState(false);
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

  useEffect(() => {
    if (!selectedFile) {
      setFilePreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setFilePreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const validExts = /\.(jpg|jpeg|png|webp)$/i;

    if (!validTypes.includes(file.type.toLowerCase()) && !validExts.test(file.name)) {
      setErrorMsg('Please select a JPG, JPEG, PNG, or WEBP image.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image size must be less than 5 MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedFile(file);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2 || !/[a-zA-Z]/.test(trimmedName)) {
      setErrorMsg('Product name must contain letters and be at least 2 characters long.');
      return;
    }

    if (!category) {
      setErrorMsg('Please select a category.');
      return;
    }

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setErrorMsg('Price must be a valid number greater than ₹0.');
      return;
    }

    if (originalPrice) {
      const numOriginal = Number(originalPrice);
      if (isNaN(numOriginal) || numOriginal < numPrice) {
        setErrorMsg('Original price (MRP) cannot be less than selling price.');
        return;
      }
    }

    const numStock = Number(stock);
    if (isNaN(numStock) || numStock < 0) {
      setErrorMsg('Stock quantity cannot be negative.');
      return;
    }

    if (!unit.trim()) {
      setErrorMsg('Please specify unit measurement (e.g. 1 kg, 500 ml, 1 pack).');
      return;
    }

    let finalImageUrl = image;

    setSubmitting(true);

    try {
      if (selectedFile) {
        finalImageUrl = await uploadService.uploadImage(selectedFile);
      }

      if (!finalImageUrl) {
        setErrorMsg('Please select a product image.');
        setSubmitting(false);
        return;
      }

      const selectedCat = categories.find((c) => c._id === category || c.name === category);

      const productPayload = {
        name,
        description,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        category,
        categoryName: selectedCat?.name || 'Produce',
        image: finalImageUrl,
        stock: Number(stock),
        unit,
        isOrganic,
      };

      if (productId) {
        await productService.updateProduct(productId, productPayload);
      } else {
        await productService.createProduct(productPayload);
      }

      navigate('/admin/products');
    } catch (err: any) {
      console.error('Failed to save product:', err);
      setErrorMsg(err.message || 'Product could not be created. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const displayPreviewSrc = filePreview || (image ? getImageUrl(image) : null);

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

            {/* PRODUCT IMAGE UPLOAD & PREVIEW AREA */}
            <div className="form-group">
              <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--secondary)', display: 'block', marginBottom: '0.4rem' }}>
                Product Image *
              </label>

              <input
                type="file"
                ref={fileInputRef}
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />

              {displayPreviewSrc ? (
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '14px',
                    border: '1.5px solid var(--border)',
                    padding: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <div
                    style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '12px',
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--border)',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={displayPreviewSrc}
                      alt="Product Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Product Image Preview
                    </span>
                    <strong
                      title={selectedFile ? selectedFile.name : image || 'Product Image'}
                      style={{
                        display: 'block',
                        fontSize: '0.95rem',
                        color: 'var(--secondary)',
                        margin: '0.2rem 0',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '100%',
                      }}
                    >
                      {selectedFile
                        ? selectedFile.name
                        : image
                        ? image.split('/').pop()?.split('?')[0] || 'Product Image'
                        : 'Product Image'}
                    </strong>
                    {selectedFile && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.75rem' }}>
                        {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                      </span>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="btn btn-secondary"
                        style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
                      >
                        <Upload size={14} /> Change Image
                      </button>

                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        style={{
                          padding: '0.45rem 0.85rem',
                          borderRadius: '8px',
                          backgroundColor: '#fee2e2',
                          color: '#991b1b',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '16px',
                    border: '2px dashed #cbd5e1',
                    padding: '2rem 1.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.75rem',
                    }}
                  >
                    <Upload size={24} />
                  </div>
                  <strong style={{ fontSize: '1rem', color: 'var(--secondary)', display: 'block', marginBottom: '0.25rem' }}>
                    Upload an image of this product
                  </strong>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', margin: '0.5rem 0 0.75rem' }}
                  >
                    Choose Image
                  </button>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    JPG, JPEG, PNG, WEBP &bull; Maximum size: 5 MB
                  </p>
                </div>
              )}

              {/* Collapsible toggle for external image URL fallback */}
              <div style={{ marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowUrlOption(!showUrlOption)}
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    fontWeight: 600,
                    textDecoration: 'underline',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  {showUrlOption ? 'Hide external Image URL option' : 'Or use an external Image URL (Optional)'}
                </button>

                {showUrlOption && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={image}
                      onChange={(e) => {
                        setImage(e.target.value);
                        setSelectedFile(null);
                      }}
                      className="form-control"
                      style={{ fontSize: '0.85rem' }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '0.375rem', display: 'block' }}>
                Product Description
              </label>
              <textarea
                rows={3}
                placeholder="Freshly harvested organic produce details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-control"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  fontSize: '0.95rem',
                  lineHeight: '1.5',
                  padding: '0.65rem 0.9rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  minHeight: '90px',
                  resize: 'vertical',
                }}
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
