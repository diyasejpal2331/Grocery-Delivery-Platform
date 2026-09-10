import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  onSearch?: (query: string) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title,
  subtitle,
  onSearch,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        color: 'var(--text-main)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Sidebar Component */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main View Area */}
      <div className="admin-main-viewport">
        {/* Sticky Header */}
        <AdminHeader
          title={title}
          subtitle={subtitle}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onSearch={onSearch}
        />

        {/* Content Outlet */}
        <main
          style={{
            padding: '1.75rem',
            maxWidth: '1400px',
            margin: '0 auto',
            width: '100%',
            flex: 1,
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};
