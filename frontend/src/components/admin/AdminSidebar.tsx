import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  FolderTree,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  X,
  ShoppingCart,
  ShieldCheck,
  Headphones,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const mainNavItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Users / Customers', path: '/admin/users', icon: Users },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 140,
          }}
        />
      )}

      <aside
        style={{
          width: '260px',
          backgroundColor: '#ffffff',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.25rem 1rem',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 150,
          transform: isOpen ? 'translateX(0)' : undefined,
          transition: 'transform 0.3s ease',
          boxShadow: 'var(--shadow-sm)',
        }}
        className="admin-sidebar-container"
      >
        <div>
          {/* Top Brand Logo Section */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '1.25rem',
              marginBottom: '1rem',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <Link
              to="/admin/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                textDecoration: 'none',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 4px 10px rgba(225, 27, 34, 0.25)',
                }}
              >
                <ShoppingCart size={20} color="#ffffff" />
              </div>
              <div style={{ lineHeight: 1.1 }}>
                <span
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: '#1f2937',
                    letterSpacing: '-0.02em',
                    display: 'block',
                  }}
                >
                  grocery <span style={{ color: 'var(--primary)' }}>Admin</span>
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Delivery Platform
                </span>
              </div>
            </Link>

            {/* Mobile close icon button */}
            <button
              onClick={onClose}
              className="admin-mobile-close-btn"
              style={{
                padding: '0.35rem',
                color: 'var(--text-muted)',
                borderRadius: '6px',
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* MAIN Navigation Menu */}
          <div style={{ marginBottom: '1.5rem' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                paddingLeft: '0.6rem',
                display: 'block',
                marginBottom: '0.6rem',
              }}
            >
              Main
            </span>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      fontSize: '0.88rem',
                      fontWeight: active ? 700 : 600,
                      color: active ? 'var(--primary)' : 'var(--text-main)',
                      backgroundColor: active ? 'var(--primary-light)' : 'transparent',
                      transition: 'var(--transition)',
                    }}
                  >
                    <Icon size={18} color={active ? 'var(--primary)' : '#6b7280'} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {active && (
                      <div
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--primary)',
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* OTHER Navigation Menu */}
          <div>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                paddingLeft: '0.6rem',
                display: 'block',
                marginBottom: '0.6rem',
              }}
            >
              Other
            </span>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <button
                onClick={() => setShowSettingsModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  width: '100%',
                  textAlign: 'left',
                  transition: 'var(--transition)',
                }}
              >
                <Settings size={18} color="#6b7280" />
                <span>Settings</span>
              </button>

              <button
                onClick={() => setShowHelpModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  width: '100%',
                  textAlign: 'left',
                  transition: 'var(--transition)',
                }}
              >
                <HelpCircle size={18} color="#6b7280" />
                <span>Help / Support</span>
              </button>

              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: 'var(--primary)',
                  width: '100%',
                  textAlign: 'left',
                  transition: 'var(--transition)',
                  marginTop: '0.3rem',
                }}
              >
                <LogOut size={18} color="var(--primary)" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Bottom Support Widget Card matching reference UI */}
        <div
          style={{
            padding: '1rem',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--primary-light) 0%, #ffffff 100%)',
            border: '1px solid #fecdd3',
            marginTop: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Headphones size={15} />
            </div>
            <strong style={{ fontSize: '0.82rem', color: 'var(--secondary)' }}>Need Help?</strong>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '0.75rem' }}>
            Contact administrator support team for assistance.
          </p>
          <button
            onClick={() => setShowHelpModal(true)}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.4rem 0.6rem',
              fontSize: '0.78rem',
              borderRadius: '8px',
              boxShadow: 'none',
            }}
          >
            Get Support
          </button>
        </div>
      </aside>

      {/* Settings Modal */}
      <Modal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} title="Admin Settings">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', lineHeight: 1.6 }}>
          <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.3rem' }}>Store Operational Preferences</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Configure order notification alerts, currency display (₹ INR), and default tax rates for customer checkout.
            </p>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.3rem' }}>Account & Security</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Logged in as: <strong>{user?.name || 'Store Admin'}</strong> ({user?.email || 'admin@freshmart.com'})
            </p>
            <span className="badge badge-green" style={{ marginTop: '0.5rem' }}>
              <ShieldCheck size={12} style={{ marginRight: '3px' }} /> Administrator Role Verified
            </span>
          </div>
        </div>
      </Modal>

      {/* Support Modal */}
      <Modal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} title="Admin Platform Support">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', lineHeight: 1.6 }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
            Need technical assistance or report an issue with the grocery delivery platform? Contact our administrator desk:
          </p>
          <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--primary-light)', borderRadius: '10px', color: 'var(--secondary)' }}>
            <strong style={{ display: 'block', color: 'var(--primary)' }}>Emergency Tech Desk:</strong>
            <span style={{ fontSize: '0.88rem' }}>📞 +91 800-12345-GROCERY</span>
            <br />
            <span style={{ fontSize: '0.88rem' }}>✉️ support@freshmart.com</span>
          </div>
        </div>
      </Modal>
    </>
  );
};
