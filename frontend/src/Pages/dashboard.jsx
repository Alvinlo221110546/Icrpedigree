import React, { useEffect, useState } from "react";
import {
  getAnimals,
  createAnimal,
  editAnimal,
  removeAnimal,
} from "../Utils/api.js";
import Footer from "../Components/Footer.jsx";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import AnimalForm from "../Components/AdminAnimalForm.jsx";
import AnimalTable from "../Components/AdminAnimalTable.jsx";

const MySwal = withReactContent(Swal);

// SweetAlert Helper
const notify = (icon, title, text = "") =>
  MySwal.fire({ icon, title, text });

export default function Dashboard() {
  const [animals, setAnimals] = useState([]);
  const [editing, setEditing] = useState(null);

  // Load Data
  const loadAnimals = async () => {
    try {
      const data = await getAnimals();
      setAnimals(data || []);
    } catch (e) {
      notify("warning", "Login diperlukan", "Silakan login dahulu");
      window.location = "/login";
    }
  };

  useEffect(() => {
    loadAnimals();
  }, []);

  // CRUD Handlers
  const handleCreate = async (payload) => {
    try {
      await createAnimal(payload);
      await loadAnimals();
      notify("success", "Hewan berhasil ditambah");
    } catch {
      notify("error", "Gagal menambah hewan");
    }
  };

  const handleUpdate = async (payload) => {
    try {
      await editAnimal(editing.id, payload);
      setEditing(null);
      await loadAnimals();
      notify("success", "Data hewan diperbarui");
    } catch {
      notify("error", "Gagal memperbarui hewan");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await MySwal.fire({
      title: "Yakin hapus?",
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      await removeAnimal(id);
      await loadAnimals();
      notify("success", "Berhasil dihapus");
    } catch {
      notify("error", "Gagal menghapus");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2 style={{ marginBottom: 20, color: "#1565c0" }}>
        Dashboard Hewan
      </h2>

      <div style={{ display: "flex", gap: 24 }}>
        {/* FORM */}
        <div style={{ flex: 1 }}>
          <AnimalForm
            initial={editing}
            onSubmit={editing ? handleUpdate : handleCreate}
          />
        </div>

        {/* TABLE */}
        <div style={{ flex: 2 }}>
          <AnimalTable
            animals={animals}
            onEdit={setEditing}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
