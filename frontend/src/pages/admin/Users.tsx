import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Users as UsersIcon, ShieldCheck, User as UserIcon, Search, Mail, Phone, Calendar, RefreshCw } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { authService } from '../../services/authService';
import { User } from '../../types/User';
import { Loader } from '../../components/common/Loader';

export const AdminUsers: React.FC = () => {
  const location = useLocation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<'All' | 'user' | 'admin'>('All');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await authService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [location.pathname, location.key]);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.phone && u.phone.includes(search));
    const matchesRole = selectedRole === 'All' || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <AdminLayout title="Users / Customers">
        <Loader fullScreen text="Loading Registered Customer Accounts..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Users / Customers"
      subtitle="Overview of registered customer accounts and administrator permissions."
      onSearch={(q) => setSearch(q)}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div
          className="glass-card animate-fade-in"
          style={{
            padding: '1.75rem',
            borderRadius: '20px',
            backgroundColor: '#ffffff',
            border: '1px solid var(--border)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
          }}
        >
          {/* Header Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.25rem',
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--secondary)' }}>
                Registered Accounts ({filteredUsers.length})
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Customer profiles and system administrator accounts
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={fetchUsers}
                className="btn btn-secondary"
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
              >
                <RefreshCw size={14} /> Refresh
              </button>

              {(['All', 'user', 'admin'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '9999px',
                    fontSize: '0.82rem',
                    fontWeight: selectedRole === role ? 700 : 600,
                    color: selectedRole === role ? 'var(--primary)' : 'var(--text-muted)',
                    backgroundColor: selectedRole === role ? 'var(--primary-light)' : 'transparent',
                    border: selectedRole === role ? '1px solid #fecdd3' : '1px solid transparent',
                  }}
                >
                  {role === 'All' ? 'All Roles' : role === 'admin' ? 'Admins' : 'Customers'}
                </button>
              ))}
            </div>
          </div>

          {/* User Table */}
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'separate',
                borderSpacing: '0 0.5rem',
                textAlign: 'left',
                fontSize: '0.88rem',
              }}
            >
              <thead>
                <tr
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                  }}
                >
                  <th style={{ padding: '0.75rem 1rem' }}>User Profile</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Role</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Contact Phone</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Registration Date</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Account Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr
                    key={u._id}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    }}
                  >
                    <td
                      style={{
                        padding: '0.85rem 1rem',
                        borderTopLeftRadius: '12px',
                        borderBottomLeftRadius: '12px',
                        borderTop: '1px solid var(--border)',
                        borderBottom: '1px solid var(--border)',
                        borderLeft: '1px solid var(--border)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            backgroundColor: u.role === 'admin' ? 'var(--primary-light)' : '#e2e8f0',
                            color: u.role === 'admin' ? 'var(--primary)' : 'var(--secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '0.9rem',
                          }}
                        >
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <strong style={{ display: 'block', color: 'var(--secondary)', fontWeight: 700 }}>
                            {u.name}
                          </strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</span>
                        </div>
                      </div>
                    </td>

                    <td
                      style={{
                        padding: '0.85rem 1rem',
                        borderTop: '1px solid var(--border)',
                        borderBottom: '1px solid var(--border)',
                      }}
                    >
                      {u.role === 'admin' ? (
                        <span
                          style={{
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.65rem',
                            borderRadius: '6px',
                            backgroundColor: '#f3e8ff',
                            color: '#7e22ce',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          <ShieldCheck size={13} /> Administrator
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.65rem',
                            borderRadius: '6px',
                            backgroundColor: '#f0fdf4',
                            color: '#166534',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          <UserIcon size={13} /> Customer
                        </span>
                      )}
                    </td>

                    <td
                      style={{
                        padding: '0.85rem 1rem',
                        borderTop: '1px solid var(--border)',
                        borderBottom: '1px solid var(--border)',
                        color: 'var(--text-main)',
                      }}
                    >
                      {u.phone || 'N/A'}
                    </td>

                    <td
                      style={{
                        padding: '0.85rem 1rem',
                        borderTop: '1px solid var(--border)',
                        borderBottom: '1px solid var(--border)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                    </td>

                    <td
                      style={{
                        padding: '0.85rem 1rem',
                        textAlign: 'right',
                        borderTopRightRadius: '12px',
                        borderBottomRightRadius: '12px',
                        borderTop: '1px solid var(--border)',
                        borderBottom: '1px solid var(--border)',
                        borderRight: '1px solid var(--border)',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px',
                          backgroundColor: '#dcfce7',
                          color: '#15803d',
                        }}
                      >
                        Active Account
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
