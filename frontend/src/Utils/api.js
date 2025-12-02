import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,
});

/* =======================
   AUTH
======================== */
export const login = (username, password) =>
  API.post("/api/auth/login", { username, password });

export const logout = () => API.post("/api/auth/logout");

export const register = ({ username, password, role = "user" }) =>
  API.post("/api/auth/register",
    { username, password, role },
    { headers: { "Content-Type": "application/json" } }
  );

/* =======================
   ANIMAL CRUD
======================== */
export const getAnimals = async () => {
  const res = await API.get("/api/animal");
  return res.data;
};

export const createAnimal = (payload) =>
  API.post("/api/animal", payload);

export const editAnimal = (id, payload) =>
  API.put(`/api/animal/${id}`, payload);

export const removeAnimal = (id) =>
  API.delete(`/api/animal/${id}`);

/* =======================
   UPDATE PHOTO
======================== */
export const updateAnimalPhoto = (id, payload) =>
  API.put(`/api/animal/update-photo/${id}`, payload);

/* =======================
   PEDIGREE TREE
======================== */
export const getPedigreeTree = (animalId) =>
  API.get(`/api/animal/${animalId}/pedigree`).then((r) => r.data);

/* =======================
   ICR / SCAN PEDIGREE
========================= */
// Buat scan baru
export const createPedigreeScan = async (payload) => {
  console.log("[API] Mengirim payload ke backend:", payload);
  try {
    const res = await API.post("/api/animal/scan", payload); // <== pakai API dan leading slash
    console.log("[API] Respon backend:", res.data);
    return res.data;
  } catch (err) {
    console.error("[API] Terjadi error:", err);
    throw err;
  }
};

// Ambil satu scan
export const getScan = (scanId) =>
  API.get(`/api/animal/scan/${scanId}`).then((r) => r.data);

// Update scan
export const updatePedigreeScan = (scanId, payload) =>
  API.put(`/api/animal/scan/${scanId}`, payload);

// Ambil semua scan milik hewan tertentu
export const getAnimalScans = (animalId) =>
  API.get(`/api/animal/${animalId}/scans`).then((r) => r.data);


/* =======================
   BLOCKCHAIN HASH CHECK
======================== */
export const verifyHashIntegrity = (animalId) =>
  API.get(`/api/animal/${animalId}/check`).then((r) => r.data);


/* =======================
   BREEDER PROFILE (PEDIGREE CONNECT)
======================== */

export const getMyProfile = (userId) =>
  API.get(`/api/pedigree/profile/${userId}`);

export const createMyProfile = (payload) =>
  API.post("/api/pedigree/profile", payload);

export const updateMyProfile = (userId, payload) =>
  API.put(`/api/pedigree/profile/${userId}`, payload);


