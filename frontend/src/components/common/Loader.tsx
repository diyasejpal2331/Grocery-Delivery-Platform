import React from 'react';

export const Loader: React.FC<{ fullScreen?: boolean; text?: string }> = ({
  fullScreen = false,
  text = 'Loading fresh groceries...',
}) => {
  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '2rem' }}>
      <div
        style={{
          width: '42px',
          height: '42px',
          border: '4px solid var(--primary-light)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      {text && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>{text}</p>}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {content}
      </div>
    );
  }

  return content;
};
