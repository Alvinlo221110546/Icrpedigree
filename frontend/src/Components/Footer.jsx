import React from 'react';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#1565c0',
        color: '#fff',
        textAlign: 'center',
        padding: '10px',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        fontSize: '14px',
        letterSpacing: '0.3px',
      }}
    >
      © {new Date().getFullYear()} ICR Pedigree | All Rights Reserved
    </footer>
  );
}
