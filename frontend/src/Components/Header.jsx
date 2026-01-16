import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton.jsx';

export default function Header({ role }) {
  // pastikan role huruf kecil
  const userRole = role?.toLowerCase();

  return (
    <header
      style={{
        backgroundColor: '#1565c0',
        color: '#fff',
        padding: '20px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      <h1
        style={{
          fontSize: '24px',
          fontWeight: '700',
          marginLeft: '40px',
        }}
      >
        ICR Cat Pedigree
      </h1>

      {/* Navigasi hanya untuk user */}
      {userRole === 'user' && (
        <nav style={{ display: 'flex', gap: '20px', marginRight: '40px' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link>
          <Link to="/dashboard-user" style={{ color: '#fff', textDecoration: 'none' }}>Dashboard</Link>
          <Link to="/about" style={{ color: '#fff', textDecoration: 'none' }}>About Us</Link>
          <Link to="/contact" style={{ color: '#fff', textDecoration: 'none' }}>Contact Us</Link>

          {/* 🔥 New Nav Item untuk Cat List */}
          <Link to="/breeder/cats" style={{ color: '#fff', textDecoration: 'none' }}>
            Breeder Cats
          </Link>

          <Link to="/profile" style={{ color: '#fff', textDecoration: 'none' }}>
            Profile
          </Link>

        </nav>
      )}

      <LogoutButton />
    </header>
  );
}
