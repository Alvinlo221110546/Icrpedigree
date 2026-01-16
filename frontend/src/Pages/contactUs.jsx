import React, { useState } from 'react';
import Footer from "../Components/Footer.jsx";

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const { name, email, message } = form;
    const text = `Halo! Saya ${name} (${email}).%0A%0A${message}`;
    const whatsappURL = `https://wa.me/628979728413?text=${encodeURIComponent(text)}`;

    setTimeout(() => {
      window.open(whatsappURL, '_blank');
      setLoading(false);
      setSuccess(true);
      setForm({ name: '', email: '', message: '' });
    }, 1200);
  };

  return (
    <div
      style={{
        padding: '80px 20px 40px',
        maxWidth: '700px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.6',
        color: '#333',
      }}
    >
      <h1
        style={{
          color: '#1565c0',
          textAlign: 'center',
          marginBottom: '30px',
        }}
      >
        Contact Us
      </h1>

      <p style={{ textAlign: 'center', marginBottom: '40px' }}>
        Ingin menghubungi <strong>ICR Pedigree</strong>? Isi form di bawah ini,
        lalu pesan Anda akan terkirim langsung ke WhatsApp admin kami.
      </p>

      {success && (
        <p style={{ color: 'green', textAlign: 'center', fontWeight: 600 }}>
          ✅ Terima kasih! WhatsApp Anda telah dibuka.
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nama"
          required
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: '1.5px solid #90caf9',
            outline: 'none',
            color: '#1565c0',
          }}
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: '1.5px solid #90caf9',
            outline: 'none',
            color: '#1565c0',
          }}
        />
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Pesan Anda"
          required
          rows={5}
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: '1.5px solid #90caf9',
            outline: 'none',
            resize: 'vertical',
            color: '#1565c0',
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px',
            backgroundColor: loading ? '#90caf9' : '#1565c0',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s ease',
          }}
        >
          {loading ? 'Mengirim...' : 'Kirim ke WhatsApp'}
        </button>
      </form>
      <div>
        <Footer />
      </div>
    </div>
  );
}
