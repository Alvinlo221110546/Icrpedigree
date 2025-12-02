import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../Utils/api.js';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function Login({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(username, password);
      const userData = res.data;

      // SIMPAN KE LOCAL STORAGE DI SINI !!
      localStorage.setItem("userProfile", JSON.stringify({
        id: userData.id,
        username: userData.username,
        role: userData.role
      }));

      // OPTIONAL: tetap simpan ke state global kalau kamu pakai
      setUser({ ...userData, loggedIn: true });

      // redirect sesuai role
      if (userData.role === 'admin') {
        navigate('/dashboard');
      } else if (userData.role === 'user') {
        navigate('/dashboard-user');
      } else {
        await MySwal.fire({
          icon: 'warning',
          title: 'Role tidak dikenal',
          text: 'Role user tidak valid',
        });
      }
    } catch (err) {
      await MySwal.fire({
        icon: 'error',
        title: 'Login gagal',
        text: err.response?.data?.message || 'Username atau password salah',
      });
    }
  };


  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <form
        onSubmit={submit}
        style={{
          width: '360px',
          backgroundColor: '#fff',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <h2 style={{
          textAlign: 'center',
          marginBottom: '24px',
          color: '#1565c0',
          fontWeight: '600',
          letterSpacing: '1px'
        }}>
          Login
        </h2>

        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            marginBottom: '6px',
            color: '#1565c0',
            fontSize: '14px',
            fontWeight: '500'
          }}>Username</label>
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Masukkan username"
            required
            style={{
              width: '100%',
              height: '42px',
              padding: '0 12px',
              borderRadius: '8px',
              border: '1.5px solid #90caf9',
              outline: 'none',
              fontSize: '14px',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = '#1565c0'}
            onBlur={e => e.target.style.borderColor = '#90caf9'}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '6px',
            color: '#1565c0',
            fontSize: '14px',
            fontWeight: '500'
          }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Masukkan password"
            required
            style={{
              width: '100%',
              height: '42px',
              padding: '0 12px',
              borderRadius: '8px',
              border: '1.5px solid #90caf9',
              outline: 'none',
              fontSize: '14px',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = '#1565c0'}
            onBlur={e => e.target.style.borderColor = '#90caf9'}
          />
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            height: '42px',
            backgroundColor: '#1565c0',
            color: '#fff',
            fontSize: '15px',
            fontWeight: '600',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background 0.3s',
          }}
          onMouseEnter={e => e.target.style.backgroundColor = '#0d47a1'}
          onMouseLeave={e => e.target.style.backgroundColor = '#1565c0'}
        >
          Login
        </button>

        <p style={{
          textAlign: 'center',
          marginTop: '16px',
          fontSize: '14px',
          color: '#555'
        }}>
          Don’t have an account?{' '}
          <Link
            to="/register"
            style={{ color: '#1565c0', cursor: 'pointer', fontWeight: '600', textDecoration: 'none' }}
          >
            Register now
          </Link>
        </p>
      </form>
    </div>
  );
}
