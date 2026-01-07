import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile } from "../Utils/api";
import Footer from "../Components/Footer.jsx";

// Fungsi untuk membuat huruf pertama setiap kata menjadi kapital
const capitalizeWords = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("userProfile");
    if (saved) {
      const user = JSON.parse(saved);

      setProfile({
        username: user.username || "User",
        id: user.id || null,
      });

      if (user.id) {
        getMyProfile(user.id)
          .then((res) => {
            const backendProfile = res.data;
            setProfile({
              username: backendProfile.username || user.username,
              full_name: capitalizeWords(backendProfile.full_name || user.username),
              email: backendProfile.email || "",
              phone_number: backendProfile.phone_number || "",
              address: backendProfile.address || "",
              photo_url: backendProfile.photo_url || "",
              id: backendProfile.id || user.id,
            });
          })
          .catch((err) => console.error("Gagal ambil profile:", err))
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;

  if (!profile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "Arial, sans-serif" }}>
        <p style={{ fontSize: "18px", color: "#1565c0" }}>
          Tidak ada data profil. Silakan buat profil terlebih dahulu.
        </p>
        <button 
          onClick={() => navigate("/breeder/profile")} 
          style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer", borderRadius: "8px", border: "none", backgroundColor: "#1565c0", color: "#fff", fontWeight: "600", transition: "background 0.3s" }}
          onMouseEnter={e => e.target.style.backgroundColor = "#0d47a1"}
          onMouseLeave={e => e.target.style.backgroundColor = "#1565c0"}
        >
          Buat Profil
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "50px", fontFamily: "Arial, sans-serif", minHeight: "100vh" }}>
      <div style={{ background: "#fff", borderRadius: "20px", padding: "40px", maxWidth: "400px", width: "100%", boxShadow: "0 15px 30px rgba(0,0,0,0.15)", textAlign: "center" }}>
        
        {/* Foto Profil */}
        <div style={{ width: "130px", height: "130px", borderRadius: "50%", overflow: "hidden", margin: "0 auto 20px auto", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#bbdefb" }}>
          {profile.photo_url ? (
            <img src={profile.photo_url} alt="Profil" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            (profile.full_name || profile.username)?.charAt(0).toUpperCase() || "U"
          )}
        </div>

        {/* Nama */}
        <h2 style={{ margin: "10px 0", color: "#1565c0", fontWeight: "600" }}>
          {capitalizeWords(profile.full_name || profile.username)}
        </h2>

        {/* Info */}
        <div style={{ textAlign: "left", marginTop: "25px", lineHeight: "1.6", color: "#333" }}>
          {profile.email && <p><b>Email:</b> {profile.email}</p>}
          {profile.phone_number && <p><b>No. HP:</b> {profile.phone_number}</p>}
          {profile.address && <p><b>Alamat:</b> {profile.address}</p>}
        </div>

        {/* Tombol Edit */}
        <button 
          onClick={() => navigate("/breeder/profile")} 
          style={{ marginTop: "30px", padding: "12px 30px", cursor: "pointer", borderRadius: "8px", border: "none", backgroundColor: "#1565c0", color: "#fff", fontWeight: "600", transition: "all 0.3s", fontSize: "16px" }}
          onMouseEnter={e => e.target.style.backgroundColor = "#0d47a1"}
          onMouseLeave={e => e.target.style.backgroundColor = "#1565c0"}
        >
          Edit Profil
        </button>
      </div>
      <Footer />
    </div>
  );
}
