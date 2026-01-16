// src/Components/ScanPedigreeButton.jsx
import React from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { createPedigreeScan } from "../Utils/api";

const MySwal = withReactContent(Swal);

export default function ScanPedigreeButton({ cat, cloudName, uploadPreset }) {
  const handleScanPedigree = async () => {
    console.log("[ScanPedigree] Memulai proses scan untuk:", cat);

    const { value: file } = await MySwal.fire({
      title: `Upload Scan Pedigree: ${cat.cat_name}`,
      input: "file",
      inputAttributes: {
        accept: "image/*",
        "aria-label": "Upload scan pedigree",
      },
      showCancelButton: true,
    });

    console.log("[ScanPedigree] File yang dipilih:", file);

    if (!file) {
      console.warn("[ScanPedigree] Tidak ada file yang dipilih.");
      return;
    }

    MySwal.fire({ title: "Mengupload...", didOpen: () => MySwal.showLoading() });

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      console.log("[ScanPedigree] Mengupload file ke Cloudinary...");

      // Upload ke Cloudinary
      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      );

      if (!uploadRes.ok) {
        throw new Error(`Cloudinary upload gagal, status: ${uploadRes.status}`);
      }

      const data = await uploadRes.json();
      console.log("[ScanPedigree] Respon Cloudinary:", data);

      if (!data.secure_url) throw new Error("Gagal upload ke Cloudinary, secure_url kosong");

      console.log("[ScanPedigree] Menyimpan URL scan ke backend:", data.secure_url);

      // Simpan ke backend
      const result = await createPedigreeScan({
        cat_id: cat.id,
        scan_image: data.secure_url,
        icr_status: "pending",
      });

      console.log("[ScanPedigree] Respon backend:", result);

      MySwal.fire({
        icon: "success",
        title: "Scan berhasil diupload!",
      });
    } catch (err) {
      console.error("[ScanPedigree] Terjadi error:", err);
      MySwal.fire({
        icon: "error",
        title: "Gagal upload scan",
        text: err.message,
      });
    }
  };

  return (
    <button className="btn btn-sm btn-info" onClick={handleScanPedigree}>
      Scan Pedigree Certificate
    </button>
  );
}
