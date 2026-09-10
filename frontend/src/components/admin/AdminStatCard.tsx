import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AdminStatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
}

export const AdminStatCard: React.FC<AdminStatCardProps> = ({
  title,
  value,
  change,
  changeType = 'positive',
  subtitle,
  icon: Icon,
  iconBgColor = 'var(--primary-light)',
  iconColor = 'var(--primary)',
}) => {
  return (
    <div
      className="glass-card"
      style={{
        padding: '1.25rem 1.5rem',
        borderRadius: '18px',
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid var(--border)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'var(--transition)',
      }}
    >
      <div>
        <span
          style={{
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            fontWeight: 600,
            display: 'block',
            marginBottom: '0.4rem',
          }}
        >
          {title}
        </span>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
          <h3
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: 'var(--secondary)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            {value}
          </h3>

          {change && (
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.15rem 0.5rem',
                borderRadius: '9999px',
                backgroundColor:
                  changeType === 'positive'
                    ? '#dcfce7'
                    : changeType === 'negative'
                    ? '#fee2e2'
                    : '#f3f4f6',
                color:
                  changeType === 'positive'
                    ? '#166534'
                    : changeType === 'negative'
                    ? '#991b1b'
                    : 'var(--text-muted)',
              }}
            >
              {change}
            </span>
          )}
        </div>

        {subtitle && (
          <span
            style={{
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              marginTop: '0.35rem',
              display: 'block',
            }}
          >
            {subtitle}
          </span>
        )}
      </div>

      {/* Icon Badge */}
      <div
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          backgroundColor: iconBgColor,
          color: iconColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={22} color={iconColor} />
      </div>
    </div>
  );
};
