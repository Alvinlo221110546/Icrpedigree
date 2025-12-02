// src/Pages/AnimalDashboard.jsx
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { getAnimals, createAnimal, editAnimal, removeAnimal, createPedigreeScan } from "../Utils/api.js";
import AnimalForm from "../Components/AnimalForm.jsx";
import PedigreeTree from "../Components/PedigreeTree.jsx";
import Footer from "../Components/Footer.jsx";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ScanPedigreeButton from "../Components/ScanPedigreeButton.jsx";


const MySwal = withReactContent(Swal);

export default function AnimalDashboard() {
  const [animals, setAnimals] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showTree, setShowTree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState(null);

  const CLOUDINARY_UPLOAD_PRESET = "animal_upload";
  const CLOUDINARY_CLOUD_NAME = "dgl701jmj";

  const pushNotif = (msg, timeout = 2500) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), timeout);
  };

  const load = async () => {
    setLoading(true);
    try {
      const result = await getAnimals();

      const list = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
          ? result.data
          : [];

      setAnimals(list);
    } catch (err) {
      console.error(err);
      pushNotif("Gagal memuat data! Periksa koneksi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (payload) => {
    if (!payload.cat_name || !payload.unique_code) {
      pushNotif("Silakan isi form dengan lengkap!");
      return;
    }

    await createAnimal(payload);
    await load();
    setShowForm(false);
    pushNotif("Hewan berhasil ditambahkan", 2000);
  };

  const handleUpdate = async (payload) => {
    if (!editing) return;

    if (!payload.cat_name) {
      pushNotif("Nama hewan wajib diisi!");
      return;
    }

    await editAnimal(editing.id, payload);
    await load();
    setEditing(null);
    setShowForm(false);
    pushNotif("Data berhasil diperbarui");
  };

  const handleDelete = async (id) => {
    const c = await MySwal.fire({
      title: "Hapus hewan?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
    });

    if (c.isConfirmed) {
      await removeAnimal(id);
      await load();
      pushNotif("Data terhapus.");
    }
  };

  const getNameById = (id) => {
    const a = animals.find((x) => x.id === id);
    return a ? a.cat_name : "-";
  };


  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {notif && (
        <div className="alert alert-warning text-center m-0 py-2">
          {notif}
        </div>
      )}

      <main className="container py-4">
        <div className="d-flex justify-content-between mb-3">
          <h3 className="m-0 text-primary">Dashboard Pedigree Hewan</h3>

          <div>
            <button
              className="btn btn-outline-secondary me-2"
              onClick={() => {
                setEditing(null);
                setShowForm((s) => !s);
              }}
            >
              {showForm ? "Tutup Form" : "Tambah Hewan"}
            </button>

            <button className="btn btn-outline-success" onClick={() => setShowTree((s) => !s)}>
              {showTree ? "Tutup Pedigree" : "Lihat Pedigree"}
            </button>
          </div>
        </div>

        {showForm && (
          <AnimalForm
            initial={editing}
            onSubmit={editing ? handleUpdate : handleCreate}
            onCancel={() => {
              setEditing(null);
              setShowForm(false);
            }}
          />
        )}

        <div className="mt-3">{showTree && <PedigreeTree animals={animals}  />}</div>

        <div className="card mt-3">
          <div className="card-body">
            <h6>Daftar Hewan</h6>

            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-primary">
                  <tr>
                    <th>ID</th>
                    <th>Code</th>
                    <th>Nama</th>
                    <th>Breed</th>
                    <th>Gender</th>
                    <th>Birth</th>
                    <th>Sire</th>
                    <th>Dam</th>
                    <th>Breeder</th>
                    <th>Notes</th>
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={11} className="text-center">
                        Memuat...
                      </td>
                    </tr>
                  ) : animals.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="text-center text-muted">
                        Belum ada data
                      </td>
                    </tr>
                  ) : (
                    animals.map((a) => (
                      <tr key={a.id}>
                        <td>{a.id}</td>
                        <td>{a.unique_code || "-"}</td>
                        <td>{a.cat_name}</td>
                        <td>{a.breed || "-"}</td>
                        <td>{a.gender}</td>
                        <td>{a.birth_date || "-"}</td>
                        <td>{getNameById(a.sire_id)}</td>
                        <td>{getNameById(a.dam_id)}</td>
                        <td>{a.breeder || "-"}</td>
                        <td style={{ maxWidth: 200 }}>{a.notes || "-"}</td>

                        <td>
                          <div className="d-flex gap-2 flex-wrap">
                            <button
                              className="btn btn-sm btn-warning"
                              onClick={() => {
                                setEditing(a);
                                setShowForm(true);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                            >
                              Edit
                            </button>

                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(a.id)}
                            >
                              Hapus
                            </button>

                            <ScanPedigreeButton
                              cat={a}
                              cloudName={CLOUDINARY_CLOUD_NAME}
                              uploadPreset={CLOUDINARY_UPLOAD_PRESET}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-3 text-end">
          <button className="btn btn-outline-primary" onClick={load}>
            Refresh
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
