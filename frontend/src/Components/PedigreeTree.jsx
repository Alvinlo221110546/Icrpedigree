// src/Components/PedigreeTree.jsx
import React from "react";
import Swal from "sweetalert2";
import userDefault from "../assets/cat-default.png";
import { updateAnimalPhoto } from "../Utils/api";

const DEFAULT_AVATAR = userDefault;
const CLOUDINARY_UPLOAD_PRESET = "animal_upload";
const CLOUDINARY_CLOUD_NAME = "dgl701jmj";

// Warna per level generasi
const LEVEL_COLORS = ["#ffffff", "#a0d8f1", "#ffd9a0", "#d4f1a0"];

export default function PedigreeTree({ animals, onPhotoUpdated }) {
  const handleUpload = async (catId) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      Swal.fire({
        title: "Mengupload Foto...",
        text: "Mohon tunggu sebentar",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: "POST", body: formData }
        );
        const data = await res.json();

        if (!data.secure_url) throw new Error("Upload Cloudinary gagal");

        await updateAnimalPhoto(catId, {
          photo_url: data.secure_url,
          photo_public_id: data.public_id,
        });

        Swal.fire({
          icon: "success",
          title: "Foto Berhasil Ditambahkan!",
          timer: 1500,
          showConfirmButton: false,
        });

        if (onPhotoUpdated) onPhotoUpdated();
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Gagal Upload Foto",
          text: err.message || "Terjadi kesalahan",
        });
      }
    };

    fileInput.click();
  };

  // Build tree dan tentukan level generasi
  const buildTree = () => {
    const map = {};
    const roots = [];

    animals.forEach((a) => {
      map[a.id] = { ...a, children: [], level: 0 };
    });

    animals.forEach((a) => {
      if (a.sire_id && map[a.sire_id]) {
        const child = map[a.id];
        child.level = map[a.sire_id].level + 1;
        map[a.sire_id].children.push(child);
      } else {
        roots.push(map[a.id]);
      }
    });

    return roots;
  };

  const renderTree = (nodes) => {
    if (!nodes || nodes.length === 0)
      return <p className="text-muted">Belum ada hewan.</p>;

    const levels = {};
    const dfs = (node) => {
      if (!levels[node.level]) levels[node.level] = [];
      levels[node.level].push(node);
      node.children.forEach(dfs);
    };
    nodes.forEach(dfs);

    return Object.keys(levels)
      .sort((a, b) => a - b)
      .map((lvl) => (
        <div
          key={lvl}
          className="d-flex justify-content-center gap-3 mb-3 flex-wrap"
          style={{ alignItems: "flex-start" }}
        >
          {levels[lvl].map((n) => {
            const bgColor = LEVEL_COLORS[n.level % LEVEL_COLORS.length];
            return (
              <div
                key={n.id}
                className="card p-2 text-center"
                style={{
                  minWidth: 160,
                  backgroundColor: bgColor,
                  borderRadius: 12,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                  transition: "all 0.2s",
                }}
              >
                <img
                  src={n.profile_image_url || DEFAULT_AVATAR}
                  alt={n.cat_name}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #ccc",
                    padding: 2,
                    backgroundColor: "#fff",
                  }}
                  className="mx-auto"
                />

                <div className="mt-2">
                  <strong>{n.cat_name}</strong>
                  <div className="text-muted fst-italic">{n.breed || "-"}</div>
                  <div className="small text-secondary">
                    {n.gender}{" "}
                    {n.birth_date
                      ? "• " + new Date(n.birth_date).toLocaleDateString()
                      : ""}
                  </div>
                  {n.notes && (
                    <div
                      className="fst-italic text-truncate"
                      style={{ maxWidth: 140 }}
                    >
                      {n.notes}
                    </div>
                  )}
                </div>

                <button
                  className="btn btn-sm btn-outline-primary mt-2"
                  onClick={() => handleUpload(n.id)}
                >
                  Tambahkan Foto
                </button>
              </div>
            );
          })}
        </div>
      ));
  };

  return (
    <div className="card mb-3 p-3">
      <h5 className="mb-3">Pedigree (Generasi)</h5>
      {renderTree(buildTree())}
    </div>
  );
}
