import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { 
  getMyProfile, 
  createMyProfile, 
  updateMyProfile 
} from "../Utils/api";

const MySwal = withReactContent(Swal);

// Fungsi untuk membuat huruf pertama setiap kata kapital
const capitalizeWords = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export default function BreederProfileForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    address: "",
    photo_url: "",
  });

  const [preview, setPreview] = useState("");
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");

  const CLOUDINARY_UPLOAD_PRESET = "animal_upload";
  const CLOUDINARY_CLOUD_NAME = "dgl701jmj";

  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Load profile & localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("userProfile");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUserId(user.id || null);
      setUsername(user.username || "");
      setForm(prev => ({
        ...prev,
        full_name: prev.full_name || capitalizeWords(user.username || "")
      }));

      // Fetch profile dari backend
      const fetchProfile = async () => {
        try {
          const res = await getMyProfile(user.id);
          if (res.data) {
            setProfileExists(true);
            setForm(prev => ({
              full_name: capitalizeWords(res.data.full_name || user.username),
              phone_number: res.data.phone_number || "",
              email: res.data.email || "",
              address: res.data.address || "",
              photo_url: res.data.photo_url || "",
            }));
            setPreview(res.data.photo_url || "");
          }
        } catch (err) {
          console.log("Belum ada profile, pakai data localStorage");
        }
      };

      fetchProfile();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === "full_name" ? capitalizeWords(value) : value
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setPreview(URL.createObjectURL(file));

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: data }
      );

      const uploaded = await res.json();
      setForm(prev => ({
        ...prev,
        photo_url: uploaded.secure_url,
      }));

      MySwal.fire({
        icon: "success",
        title: "Gambar berhasil diupload!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      MySwal.fire({
        icon: "error",
        title: "Upload gagal",
        text: err.message,
      });
    }

    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      user_id: userId,
      username: username
    };

    try {
      if (profileExists) {
        await updateMyProfile(userId, payload);
        await MySwal.fire({
          icon: "success",
          title: "Profil berhasil diperbarui!",
        });
      } else {
        await createMyProfile(payload);
        await MySwal.fire({
          icon: "success",
          title: "Profil berhasil dibuat!",
        });
        setProfileExists(true);
      }

      // Update localStorage supaya data terbaru tersimpan
      localStorage.setItem("userProfile", JSON.stringify({
        id: userId,
        username: username,
        ...form
      }));

      navigate("/profile");
    } catch (err) {
      console.error(err);
      MySwal.fire({
        icon: "error",
        title: "Gagal menyimpan",
        text: err.message,
      });
    }

    setLoading(false);
  };

  return (
    <div className="container my-5" style={{ maxWidth: "600px", background: "#ffffff", padding: "30px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <h2 className="mb-4 text-center" style={{ color: "#0d47a1" }}>
        {profileExists ? "Edit Profil Breeder" : "Buat Profil Breeder"}
      </h2>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        {preview ? (
          <img
            src={preview}
            alt="Profil"
            style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover" }}
          />
        ) : (
          <div style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            backgroundColor: "#bbdefb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "50px",
            color: "#0d47a1",
            margin: "0 auto",
          }}>
            {form.full_name ? form.full_name.split(" ").map(w => w.charAt(0)).join("") : "U"}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nama Lengkap</label>
          <input
            type="text"
            className="form-control"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Nomor Telepon</label>
          <input
            type="text"
            className="form-control"
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Alamat</label>
          <textarea
            className="form-control"
            name="address"
            value={form.address}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Foto Profil</label>
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
            accept="image/*"
          />
          {uploading && <small>Mengupload gambar...</small>}
        </div>

        <button className="btn btn-primary w-100" disabled={loading || uploading}>
          {loading ? "Menyimpan..." : profileExists ? "Update Profil" : "Buat Profil"}
        </button>
      </form>
    </div>
  );
}
