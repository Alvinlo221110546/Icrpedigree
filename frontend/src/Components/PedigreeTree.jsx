import React from "react";
import Swal from "sweetalert2";
import userDefault from "../assets/cat-default.png";
import { updateAnimalPhoto } from "../Utils/api";

const DEFAULT_AVATAR = userDefault;
const CLOUDINARY_UPLOAD_PRESET = "animal_upload";
const CLOUDINARY_CLOUD_NAME = "dgl701jmj";

export default function PedigreeTree({ animals, onPhotoUpdated }) {
  console.log("📌 ANIMALS DITERIMA:", animals);

  const handleUpload = async (catId) => {
    console.log("➡️ Upload photo untuk Cat ID:", catId);

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      console.log("📁 FILE DIPILIH:", file);

      if (!file) return;

      // Upload ke Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const uploadUrl =
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

      console.log("🚀 UPLOAD KE CLOUDINARY:", uploadUrl);

      Swal.fire({
        title: "Mengupload Foto...",
        text: "Mohon tunggu sebentar",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("☁️ CLOUDINARY RESPONSE:", data);

      if (!data.secure_url) {
        return Swal.fire({
          icon: "error",
          title: "Upload Gagal",
          text: "Cloudinary gagal mengupload foto.",
        });
      }

      console.log("📸 CLOUDINARY URL:", data.secure_url);

      const payload = {
        photo_url: data.secure_url,
        photo_public_id: data.public_id,
      };

      console.log("📤 KIRIM KE BACKEND:", payload);

      try {
        await updateAnimalPhoto(catId, payload);

        Swal.fire({
          icon: "success",
          title: "Foto Berhasil Ditambahkan!",
          text: "Foto berhasil diupload dan disimpan.",
          timer: 1500,
          showConfirmButton: false,
        });

        if (onPhotoUpdated) {
          console.log("🔄 Trigger onPhotoUpdated()");
          onPhotoUpdated();
        }

      } catch (err) {
        console.error("❌ ERROR UPDATE BACKEND:", err);
        Swal.fire({
          icon: "error",
          title: "Gagal Menyimpan Foto",
          text: "Backend menolak permintaan update foto.",
        });
      }
    };

    fileInput.click();
  };

  const build = () => {
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

    console.log("🌳 HASIL BUILD TREE:", roots);
    return roots;
  };

  const render = (nodes) => {
    console.log("🎨 RENDER NODES:", nodes);

    if (!nodes.length) return <p className="text-muted">Belum ada hewan.</p>;

    const levels = {};
    const dfs = (node) => {
      if (!levels[node.level]) levels[node.level] = [];
      levels[node.level].push(node);
      node.children.forEach(dfs);
    };

    nodes.forEach(dfs);

    console.log("📚 LEVELS:", levels);

    return Object.keys(levels)
      .sort((a, b) => a - b)
      .map((lvl) => (
        <div
          key={lvl}
          className="d-flex justify-content-center gap-3 mb-3 flex-wrap"
        >
          {levels[lvl].map((n) => {
            console.log("🐱 NODE:", n.cat_name, "| FOTO:", n.profile_image_url);

            return (
              <div
                key={n.id}
                className="card p-2 text-center"
                style={{ minWidth: 160 }}
              >
                <img
                  src={n.profile_image_url || DEFAULT_AVATAR}
                  alt={n.cat_name}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 99,
                    objectFit: "cover",
                  }}
                  className="mx-auto"
                />

                <div className="mt-2">
                  <strong>{n.cat_name}</strong>
                  <div className="text-muted">{n.breed || "-"}</div>
                  <div className="small text-secondary">
                    {n.gender}{" "}
                    {n.birth_date
                      ? "• " +
                        new Date(n.birth_date).toLocaleDateString()
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
      {render(build())}
    </div>
  );
}