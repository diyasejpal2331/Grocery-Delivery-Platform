import React, { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Phone, MapPin, Save, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Profile: React.FC = () => {
  const { user, updateUser, isAdmin } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [state, setState] = useState(user?.address?.state || '');
  const [pincode, setPincode] = useState(user?.address?.pincode || '');
  const [savedMessage, setSavedMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setStreet(user.address?.street || '');
      setCity(user.address?.city || '');
      setState(user.address?.state || '');
      setPincode(user.address?.pincode || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage('');
    setErrorMessage('');

    const trimmedName = name.trim();
    const nameRegex = /^[A-Za-z][A-Za-z\s.'-]{1,49}$/;
    if (!trimmedName || !nameRegex.test(trimmedName)) {
      setErrorMessage('Please enter a valid full name (at least 2 characters, starting with a letter).');
      return;
    }

    const trimmedPhone = phone.trim();
    if (trimmedPhone && !/^[0-9]{10}$/.test(trimmedPhone)) {
      setErrorMessage('Please enter a valid 10-digit mobile phone number.');
      return;
    }

    const trimmedPincode = pincode.trim();
    if (trimmedPincode && !/^[0-9]{6}$/.test(trimmedPincode)) {
      setErrorMessage('Please enter a valid 6-digit postal pincode.');
      return;
    }

    try {
      await updateUser({
        name: trimmedName,
        phone: trimmedPhone,
        address: { street: street.trim(), city: city.trim(), state: state.trim(), pincode: trimmedPincode },
      });
      setSavedMessage('Profile updated successfully!');
      setTimeout(() => setSavedMessage(''), 3000);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setErrorMessage(err.message || 'Failed to update profile.');
    }
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', width: '100%' }}>
      <div
        className="glass-card"
        style={{
          padding: '2.5rem',
          borderRadius: '24px',
          backgroundColor: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              fontWeight: 800,
            }}
          >
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--secondary)' }}>{user?.name}</h2>
              {isAdmin && <span className="badge badge-blue"><ShieldCheck size={12} style={{ marginRight: '2px' }} /> Admin</span>}
            </div>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{user?.email}</span>
          </div>
        </div>

        {errorMessage && (
          <div
            style={{
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              fontSize: '0.88rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
              border: '1px solid #fca5a5',
            }}
          >
            {errorMessage}
          </div>
        )}

        {savedMessage && (
          <div
            style={{
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary-hover)',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontWeight: 700,
              marginBottom: '1.5rem',
            }}
          >
            {savedMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--secondary)' }}>Personal Details</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control" />
            </div>
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--secondary)', marginTop: '1rem' }}>Delivery Address</h3>

          <div className="form-group">
            <label>Street Address / House No.</label>
            <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} className="form-control" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>City</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">
              <label>State</label>
              <input type="text" value={state} onChange={(e) => setState(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">
              <label>Pincode</label>
              <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} className="form-control" />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem', marginTop: '1rem', width: 'fit-content' }}>
            <Save size={18} /> Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};
