import React from 'react';
import Footer from "../Components/Footer.jsx";

export default function AboutUs() {
  return (
    <div
      style={{
        padding: '80px 20px 40px',
        maxWidth: '900px',
        margin: '0 auto',
        fontFamily: 'Inter, Arial, sans-serif',
        lineHeight: '1.8',
        color: '#333',
      }}
    >
      <h1
        style={{
          color: '#1565c0',
          textAlign: 'center',
          marginBottom: '30px',
          fontSize: '2.2rem',
          fontWeight: '700',
        }}
      >
        Tentang Kami
      </h1>

      <p style={{ marginBottom: '20px', textAlign: 'justify' }}>
        <strong>ICR Pedigree</strong> adalah platform modern untuk pengelolaan silsilah hewan
        (animal lineage) yang dirancang untuk memenuhi kebutuhan peternak, breeder, hingga
        organisasi resmi yang mengelola data keturunan hewan seperti kucing, anjing, burung,
        reptil, hingga hewan ternak.
      </p>

      <p style={{ marginBottom: '20px', textAlign: 'justify' }}>
        Sistem ini dilengkapi fitur <strong>ICR (Intelligent Character Recognition)</strong> untuk
        membaca dokumen pedigree fisik dan mengubahnya menjadi data digital, serta mekanisme
        keamanan canggih menggunakan <strong>enkripsi, hashing berantai, dan riwayat immutable</strong>
        agar data silsilah tidak mudah dipalsukan atau dimanipulasi.
      </p>

      <h2
        style={{
          color: '#0d47a1',
          marginTop: '40px',
          marginBottom: '15px',
          fontSize: '1.5rem',
        }}
      >
        Visi Kami
      </h2>

      <p style={{ marginBottom: '20px', textAlign: 'justify' }}>
        Menjadi platform silsilah hewan teraman dan paling akurat yang mendukung perkembangan
        dunia breeding dengan teknologi modern yang dapat dipercaya.
      </p>

      <h2
        style={{
          color: '#0d47a1',
          marginTop: '40px',
          marginBottom: '15px',
          fontSize: '1.5rem',
        }}
      >
        Misi Kami
      </h2>

      <ul style={{ marginLeft: '20px', marginBottom: '20px', listStyleType: 'disc' }}>
        <li>Menyediakan sistem pencatatan silsilah hewan yang aman dan terenkripsi.</li>
        <li>Memudahkan breeder dalam mengelola data keturunan dan riwayat hewan.</li>
        <li>Memastikan integritas pedigree dengan teknologi hash-chain dan audit.</li>
        <li>Mendigitalisasi dokumen pedigree menggunakan teknologi ICR.</li>
      </ul>

      <p style={{ textAlign: 'justify' }}>
        Dengan <strong>ICR Pedigree</strong>, kami berkomitmen membantu komunitas breeder
        menciptakan ekosistem yang transparan, aman, dan terpercaya dalam pengelolaan data
        keturunan hewan, sehingga kualitas breeding dapat terus berkembang ke arah yang lebih baik.
      </p>
      <Footer />
    </div>
    
  );
}
