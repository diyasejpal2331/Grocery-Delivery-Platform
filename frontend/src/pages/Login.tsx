import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const loggedInUser = await login({ email, password });
      const isAdminUser = loggedInUser?.role === 'admin';

      if (from && from !== '/' && from !== '/login') {
        if (isAdminUser && from.startsWith('/admin')) {
          navigate(from, { replace: true });
          return;
        }
        if (!isAdminUser && !from.startsWith('/admin')) {
          navigate(from, { replace: true });
          return;
        }
      }

      if (isAdminUser) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = (role: 'user' | 'admin') => {
    if (role === 'admin') {
      setEmail('admin@freshmart.com');
      setPassword('admin123');
    } else {
      setEmail('user@freshmart.com');
      setPassword('user123');
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '3rem auto', width: '100%' }}>
      <div
        className="glass-card animate-fade-in"
        style={{
          padding: '2.5rem 2rem',
          borderRadius: '24px',
          backgroundColor: '#ffffff',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 8px 16px rgba(16, 185, 129, 0.25)',
            }}
          >
            <LogIn size={28} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--secondary)' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Sign in to manage your grocery orders</p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: '#fee2e2',
              color: 'var(--danger)',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              fontSize: '0.88rem',
              marginBottom: '1.25rem',
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '2.5rem', width: '100%' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '2.5rem', width: '100%' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem' }}
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Login Credentials Bar */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.6rem', textAlign: 'center' }}>
            ⚡ QUICK DEMO LOGINS
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              onClick={() => fillDemo('user')}
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', padding: '0.4rem', justifyContent: 'center' }}
            >
              <Sparkles size={14} color="var(--primary)" /> Demo User
            </button>
            <button
              onClick={() => fillDemo('admin')}
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', padding: '0.4rem', justifyContent: 'center' }}
            >
              <ShieldCheck size={14} color="#7c3aed" /> Demo Admin
            </button>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary-hover)', fontWeight: 700 }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};
