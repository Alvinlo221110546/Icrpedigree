// src/Components/AnimalForm.jsx
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { getAnimals } from "../Utils/api.js"; // pakai api.js

const MySwal = withReactContent(Swal);

const CLOUDINARY_UPLOAD_PRESET = "animal_upload";
const CLOUDINARY_CLOUD_NAME = "dgl701jmj";

export default function AnimalForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    unique_code: "",
    name: "",
    breed: "",
    gender: "male",
    birth_date: "",
    breeder: "",
    notes: "",
    sire_id: null,
    dam_id: null,
    pedigree_number: "",
    imageUrl: "",
    imagePreview: "",
    uploading: false,
    user_id: null,
  });

  const [allCats, setAllCats] = useState([]);

  // Ambil user dari localStorage
  useEffect(() => {
    const userProfile = localStorage.getItem("userProfile");
    if (userProfile) {
      const user = JSON.parse(userProfile);
      setForm(prev => ({
        ...prev,
        user_id: user.id,
        breeder: user.username
      }));
    }
  }, []);

  // Load semua kucing untuk dropdown
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getAnimals(); // res = { data: [...] }
        setAllCats(res.data);           // <--- ambil array di dalam `data`
      } catch (err) {
        console.error("Gagal mengambil kucing:", err);
        MySwal.fire({ icon: "error", title: "Gagal load daftar kucing" });
      }
    };
    fetchCats();
  }, []);



  // Load data edit
  useEffect(() => {
    if (initial) {
      setForm(prev => ({
        ...prev,
        unique_code: initial.unique_code ?? "",
        name: initial.cat_name ?? "",
        breed: initial.breed ?? "",
        gender: initial.gender ?? "male",
        birth_date: initial.birth_date ?? "",
        breeder: initial.breeder ?? prev.breeder,
        notes: initial.notes ?? "",
        sire_id: initial.sire_id?.toString() ?? null,
        dam_id: initial.dam_id?.toString() ?? null,
        pedigree_number: initial.pedigree_number ?? "",
        imageUrl: initial.scan_image ?? "",
        imagePreview: initial.scan_image ?? "",
      }));
    }
  }, [initial]);

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    update("uploading", true);
    update("imagePreview", URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.secure_url) update("imageUrl", data.secure_url);
      else MySwal.fire({ icon: "error", title: "Upload gagal" });
    } catch {
      MySwal.fire({ icon: "error", title: "Upload error" });
    }

    update("uploading", false);
  };

  const submit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      return MySwal.fire({ icon: "error", title: "Nama wajib diisi" });
    }

    const payload = {
      unique_code: form.unique_code || null,
      cat_name: form.name,
      breed: form.breed || null,
      birth_date: form.birth_date || null,
      gender: form.gender || "male",
      sire_id: form.sire_id ? Number(form.sire_id) : null,
      dam_id: form.dam_id ? Number(form.dam_id) : null,
      breeder: form.breeder || null,
      user_id: form.user_id,
      pedigree_number: form.pedigree_number || null,
      notes: form.notes || null,
      scan_image: form.imageUrl || null,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={submit} className="card p-3" style={{ borderRadius: 8 }}>
      <h5>{initial ? "Edit Hewan" : "Tambah Hewan"}</h5>

      <div className="row g-2">
        <div className="col-12">
          <input
            className="form-control"
            placeholder="Unique Code (opsional)"
            value={form.unique_code}
            onChange={(e) => update("unique_code", e.target.value)}
          />
        </div>

        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Nama Hewan *"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </div>

        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Breed"
            value={form.breed}
            onChange={(e) => update("breed", e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <select
            className="form-control"
            value={form.gender}
            onChange={(e) => update("gender", e.target.value)}
          >
            <option value="male">Jantan</option>
            <option value="female">Betina</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>

        <div className="col-md-4">
          <input
            type="date"
            className="form-control"
            value={form.birth_date || ""}
            onChange={(e) => update("birth_date", e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="Breeder"
            value={form.breeder}
            readOnly
          />
        </div>

        {/* Sire Dropdown */}
        <div className="col-md-6">
          <select
            className="form-control"
            value={form.sire_id ?? ""}
            onChange={(e) => update("sire_id", e.target.value || null)}
          >
            <option value="">-- Pilih Ayah (Sire) --</option>
            {Array.isArray(allCats) &&
              allCats
                .filter(c => c.gender?.toLowerCase() === "male")
                .filter(c => !initial || c.id !== initial.id) // <--- hilangkan kucing yg sedang diedit
                .map(c => (
                  <option key={c.id} value={c.id.toString()}>
                    {c.cat_name} 
                  </option>
                ))}
          </select>
        </div>

        {/* Dam Dropdown */}
        <div className="col-md-6">
          <select
            className="form-control"
            value={form.dam_id ?? ""}
            onChange={(e) => update("dam_id", e.target.value || null)}
          >
            <option value="">-- Pilih Ibu (Dam) --</option>
            {Array.isArray(allCats) &&
              allCats
                .filter(c => c.gender?.toLowerCase() === "female")
                .filter(c => !initial || c.id !== initial.id) // <--- hilangkan kucing yg sedang diedit
                .map(c => (
                  <option key={c.id} value={c.id.toString()}>
                    {c.cat_name} 
                  </option>
                ))}
          </select>
        </div>



        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Pedigree Number"
            value={form.pedigree_number}
            onChange={(e) => update("pedigree_number", e.target.value)}
          />
        </div>

        <div className="col-12">
          <textarea
            className="form-control"
            rows={3}
            placeholder="Catatan"
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
          />
        </div>

        {/* Upload Cloudinary */}
        <div className="col-12 mt-2">
          <label className="form-label">Birth Certificate</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleFileChange}
            disabled={form.uploading}
          />
          {form.uploading && <p className="text-info mt-1">Mengupload...</p>}
        </div>

        {form.imagePreview && (
          <div className="col-12 mt-2">
            <img src={form.imagePreview} alt="preview" className="img-fluid rounded" />
          </div>
        )}
      </div>

      <div className="mt-3 text-end">
        {initial && (
          <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>
            Batal
          </button>
        )}
        <button type="submit" className="btn btn-primary">
          {initial ? "Perbarui" : "Tambah"}
        </button>
      </div>
    </form>
  );
}
