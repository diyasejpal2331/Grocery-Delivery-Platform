import React from 'react';
import { Users as UsersIcon, ShieldCheck, User as UserIcon } from 'lucide-react';
import { User } from '../../types/User';

const MOCK_USERS_LIST: User[] = [
  {
    _id: 'user-admin-1',
    name: 'Store Admin',
    email: 'admin@freshmart.com',
    role: 'admin',
    phone: '+91 98765 43210',
    createdAt: '2026-01-15T10:00:00.000Z',
  },
  {
    _id: 'user-regular-1',
    name: 'Alex Johnson',
    email: 'user@freshmart.com',
    role: 'user',
    phone: '+91 91234 56789',
    createdAt: '2026-02-01T14:30:00.000Z',
  },
  {
    _id: 'user-regular-2',
    name: 'Priya Sharma',
    email: 'priya.s@example.com',
    role: 'user',
    phone: '+91 99887 76655',
    createdAt: '2026-02-10T11:15:00.000Z',
  },
  {
    _id: 'user-regular-3',
    name: 'Rahul Verma',
    email: 'rahul.v@example.com',
    role: 'user',
    phone: '+91 97766 55443',
    createdAt: '2026-02-20T09:45:00.000Z',
  },
];

export const AdminUsers: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)' }}>
          User Accounts Management
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Overview of registered customer accounts and administrator roles
        </p>
      </div>

      <div className="glass-card" style={{ borderRadius: '20px', backgroundColor: '#ffffff', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '1rem 1.5rem' }}>User</th>
              <th style={{ padding: '1rem' }}>Role</th>
              <th style={{ padding: '1rem' }}>Contact</th>
              <th style={{ padding: '1rem 1.5rem' }}>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_USERS_LIST.map((u) => (
              <tr key={u._id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--text-main)' }}>{u.name}</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{u.email}</span>
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  {u.role === 'admin' ? (
                    <span className="badge badge-blue"><ShieldCheck size={12} style={{ marginRight: '2px' }} /> Admin</span>
                  ) : (
                    <span className="badge badge-green"><UserIcon size={12} style={{ marginRight: '2px' }} /> Customer</span>
                  )}
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                  {u.phone || 'N/A'}
                </td>
                <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
