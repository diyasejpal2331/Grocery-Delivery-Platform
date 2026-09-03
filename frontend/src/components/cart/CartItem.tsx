import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../../types/Cart';
import { useCart } from '../../context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem',
        borderBottom: '1px solid var(--border)',
        gap: '1rem',
      }}
    >
      {/* Product Image & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '12px',
            objectFit: 'cover',
            backgroundColor: '#f8fafc',
          }}
        />
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
            {product.name}
          </h4>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {product.unit} • ₹{product.price} / unit
          </span>
        </div>
      </div>

      {/* Quantity Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: '#f1f5f9',
          padding: '0.25rem 0.5rem',
          borderRadius: '10px',
        }}
      >
        <button
          onClick={() => updateQuantity(product._id, quantity - 1)}
          style={{
            padding: '0.25rem',
            color: 'var(--text-main)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Minus size={14} />
        </button>
        <span style={{ fontSize: '0.9rem', fontWeight: 700, width: '24px', textAlign: 'center' }}>
          {quantity}
        </span>
        <button
          onClick={() => updateQuantity(product._id, quantity + 1)}
          style={{
            padding: '0.25rem',
            color: 'var(--text-main)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Item Total Price */}
      <div style={{ width: '80px', textAlign: 'right' }}>
        <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--secondary)' }}>
          ₹{product.price * quantity}
        </span>
      </div>

      {/* Delete button */}
      <button
        onClick={() => removeFromCart(product._id)}
        style={{
          color: 'var(--danger)',
          padding: '0.35rem',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
        }}
        title="Remove item"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};
