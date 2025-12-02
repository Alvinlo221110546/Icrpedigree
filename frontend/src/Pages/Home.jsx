import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import family from "../assets/family.png";
import family2 from "../assets/family2.png";
import family3 from "../assets/family3.png";
import familyBg from "../assets/family-bg.png";

const images = [
  {
    src: family,
    caption:
      "Setiap kucing memiliki garis keturunan unik — kini dapat dicatat dan dijaga secara digital.",
  },
  {
    src: family2,
    caption:
      "ICR Cat Pedigree membantu Anda memahami hubungan induk, kitten, dan generasi berikutnya dengan akurasi tinggi.",
  },
  {
    src: family3,
    caption:
      "Data pedigree terenkripsi memastikan informasi kucing Anda aman, valid, dan tidak mudah dimanipulasi.",
  },
];

export default function HomePage() {
  const [current, setCurrent] = useState(0);

  // 🟦 AUTO SLIDE (setiap 4 detik)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000); // 4 detik

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* HERO */}
      <section
        className="position-relative d-flex flex-column justify-content-center align-items-center text-center"
        style={{ height: "90vh" }}
      >
        <img
          src={familyBg}
          alt="Background"
          className="position-absolute w-100 h-180"
          style={{ objectFit: "cover", opacity: 0.25, zIndex: -1 }}
        />

        <h1 className="display-4 fw-bold text-primary">
          Selamat Datang di <span className="text-dark">ICR Cat Pedigree</span>
        </h1>

        <p className="lead text-primary mt-3">
          Sistem pedigree kucing digital dengan keamanan modern berbasis enkripsi & blockchain.
        </p>
      </section>

      {/* INTRO */}
      <section className="py-5 bg-light text-center">
        <div className="container">
          <h2 className="display-6 text-primary mb-4">
            Kelola Silsilah Kucing Dengan Mudah
          </h2>

          <p className="lead text-secondary mb-3">
            ICR Cat Pedigree dirancang untuk membantu breeder dan pemilik kucing mencatat,
            mengelola, serta memverifikasi garis keturunan secara digital.
          </p>

          <p className="lead text-secondary mb-3">
            Setiap catatan pedigree dienkripsi serta disimpan dengan struktur yang sulit dimanipulasi.
          </p>

          <p className="lead text-secondary mb-3">
            Anda dapat memetakan induk, kitten, silsilah generasi, dan riwayat kesehatan dalam satu sistem.
          </p>

          <p className="lead text-secondary mb-0">
            Menjaga kualitas breed kini lebih sederhana dan terpercaya.
          </p>
        </div>
      </section>

      {/* CAROUSEL */}
      <section className="py-5 d-flex justify-content-center">
        <div
          className="position-relative shadow rounded-3 overflow-hidden"
          style={{ width: "90%", maxWidth: "900px", height: "450px" }}
        >
          {images.map((item, index) => (
            <div
              key={index}
              className={`position-absolute top-0 w-100 h-100 ${
                index === current ? "opacity-100" : "opacity-0"
              }`}
              style={{
                transition: "opacity 0.8s ease-in-out",
              }}
            >
              <img
                src={item.src}
                alt={`Slide ${index}`}
                className="w-100 h-100"
                style={{ objectFit: "cover" }}
              />

              <div
                className="position-absolute bottom-0 w-100 text-white text-center p-3"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                }}
              >
                <p className="fst-italic m-0">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-5 bg-white text-center">
        <div className="container">
          <h2 className="display-5 text-primary mb-3">Tentang ICR Cat Pedigree</h2>
          <p className="text-secondary lead">
            Sistem pedigree kucing digital yang mengutamakan keamanan, keaslian data,
            dan kemudahan penggunaan. Dilengkapi teknologi blockchain untuk menjamin integritas data.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5 text-center text-white" style={{ backgroundColor: "#0d6efd" }}>
        <h3 className="display-6 mb-3">Mulai Bangun Pedigree Kucing Anda</h3>
        <p className="lead mb-4">Kelola silsilah kucing dengan mudah dan aman.</p>

        <a href="/register" className="btn btn-light btn-lg">
          Daftar Sekarang
        </a>
      </section>
    </div>
  );
}
