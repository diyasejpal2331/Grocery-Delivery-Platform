import React, { useState } from 'react';
import { Menu, Search, Bell, ShieldCheck, ChevronDown, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
  onToggleSidebar: () => void;
  onSearch?: (query: string) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title = 'Admin Dashboard',
  subtitle = 'Monitor and manage your grocery delivery platform.',
  onToggleSidebar,
  onSearch,
}) => {
  const { user } = useAuth();
  const [searchVal, setSearchVal] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const notificationsList = [
    { id: 1, text: 'New Order #ord-1002 received', time: '10 mins ago', type: 'order' },
    { id: 2, text: 'Product stock low: Alphonso Mangoes (15 pcs remaining)', time: '1 hr ago', type: 'warning' },
    { id: 3, text: 'Customer Alex Johnson placed an order', time: '3 hrs ago', type: 'user' },
  ];

  return (
    <header
      style={{
        height: '74px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.75rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Left Title / Subtitle + Mobile Toggle Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onToggleSidebar}
          className="admin-mobile-toggle-btn"
          style={{
            padding: '0.4rem',
            color: 'var(--text-main)',
            borderRadius: '8px',
            backgroundColor: '#f3f4f6',
          }}
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1f2937', lineHeight: 1.2 }}>
            {title}
          </h1>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right Controls: Search bar + Notification Bell + Admin Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Search Bar matching reference image */}
        <div style={{ position: 'relative', width: '260px' }} className="admin-header-search">
          <input
            type="text"
            placeholder="Search users, orders, products..."
            value={searchVal}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              padding: '0.5rem 1rem 0.5rem 2.4rem',
              borderRadius: '9999px',
              border: '1px solid var(--border)',
              backgroundColor: '#f9fafb',
              fontSize: '0.85rem',
              outline: 'none',
              transition: 'var(--transition)',
            }}
          />
          <Search
            size={16}
            color="var(--text-muted)"
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />
        </div>

        {/* Notifications Icon Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            style={{
              position: 'relative',
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-main)',
              transition: 'var(--transition)',
            }}
            title="Notifications"
          >
            <Bell size={18} />
            <span
              style={{
                position: 'absolute',
                top: '7px',
                right: '7px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
              }}
            />
          </button>

          {showNotifications && (
            <div
              className="glass-card animate-fade-in"
              style={{
                position: 'absolute',
                right: 0,
                top: '50px',
                width: '310px',
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                boxShadow: 'var(--shadow-lg)',
                padding: '1rem',
                zIndex: 200,
                border: '1px solid var(--border)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.75rem',
                  paddingBottom: '0.5rem',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <strong style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>Notifications</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>3 New</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {notificationsList.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      backgroundColor: '#f9fafb',
                      fontSize: '0.82rem',
                    }}
                  >
                    <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.15rem' }}>{n.text}</p>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Pill matching reference design */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.35rem 0.6rem 0.35rem 0.35rem',
              borderRadius: '9999px',
              backgroundColor: '#f9fafb',
              border: '1px solid var(--border)',
              transition: 'var(--transition)',
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.9rem',
                boxShadow: '0 2px 5px rgba(225, 27, 34, 0.15)',
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>

            <div style={{ textAlign: 'left', lineHeight: 1.15 }} className="admin-profile-name-text">
              <strong style={{ fontSize: '0.85rem', color: 'var(--secondary)', display: 'block' }}>
                {user?.name || 'Admin User'}
              </strong>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {user?.email || 'admin@company.com'}
              </span>
            </div>

            <ChevronDown size={14} color="var(--text-muted)" />
          </button>

          {showProfileMenu && (
            <div
              className="glass-card animate-fade-in"
              style={{
                position: 'absolute',
                right: 0,
                top: '52px',
                width: '220px',
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                boxShadow: 'var(--shadow-lg)',
                padding: '0.75rem 0',
                zIndex: 200,
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ padding: '0.5rem 1rem 0.75rem', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>Role</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <ShieldCheck size={14} /> System Administrator
                </span>
              </div>
              <div style={{ padding: '0.5rem 1rem 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--rating-green)', fontWeight: 600 }}>
                  <CheckCircle size={13} /> Active Admin Session
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
