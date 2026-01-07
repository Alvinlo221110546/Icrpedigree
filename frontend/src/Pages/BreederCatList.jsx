import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import userDefault from "../assets/cat-default.png";
import { getAnimals, getMyProfile } from "../Utils/api";
import Footer from "../Components/Footer.jsx";

export default function BreederCatList() {
  const [cats, setCats] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedProfile = localStorage.getItem("userProfile");
        if (!storedProfile) throw new Error("Profil belum ada di localStorage");

        const parsedProfile = JSON.parse(storedProfile);
        setMyProfile(parsedProfile);

        const resCats = await getAnimals();
        const catsData = Array.isArray(resCats.data) ? resCats.data : [];
        setCats(catsData);
      } catch (err) {
        console.error("[ERROR] loadData failed:", err);

        await Swal.fire({
          icon: "warning",
          title: "Profil belum dibuat atau fetch error",
          text: err.message,
          confirmButtonText: "Buat Profil",
        });

        window.location.href = "/breeder/profile";
        return;
      }

      setLoading(false);
    };

    loadData();
  }, []);

  const requestBreedingViaWA = async (cat) => {
    if (!myProfile) return;

    if (!cat.user_id) {   // sesuaikan dengan user_id FK ke users
      Swal.fire({ icon: "error", title: "ID breeder tidak tersedia" });
      return;
    }

    setRequestingId(cat.id);

    try {
      const resProfile = await getMyProfile(cat.user_id);
      const breederPhone = resProfile.data?.phone_number;
      if (!breederPhone) {
        Swal.fire({ icon: "error", title: "Nomor WA breeder tidak tersedia" });
        return;
      }

      const cleanNumber = breederPhone.replace(/[^0-9]/g, "");
      const message = `Halo, saya ${myProfile.full_name} ingin melakukan breeding dengan kucing Anda (${cat.cat_name}). Mohon info lebih lanjut.`;
      const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

      window.open(url, "_blank");
    } catch (err) {
      Swal.fire({ icon: "error", title: "Gagal mengambil nomor breeder", text: err.message });
    } finally {
      setRequestingId(null);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center fw-bold">🐱 Daftar Kucing Breeder</h2>
      {cats.length === 0 ? (
        <p className="text-center text-muted">Tidak ada kucing tersedia untuk breed.</p>
      ) : (
        <div className="row">
          {cats.map((cat) => (
            <div key={cat.id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm border-0">
                <img
                  src={cat.profile_image_url || userDefault}
                  className="card-img-top"
                  alt={cat.cat_name || "Kucing"}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{cat.cat_name || "Unnamed Cat"}</h5>
                  <p className="card-text mb-3">Gender : {cat.gender || "Unknown"}</p>
                  <button
                    className="btn btn-success mt-auto"
                    disabled={requestingId === cat.id}
                    onClick={() => requestBreedingViaWA(cat)}
                  >
                    {requestingId === cat.id ? "Mengirim..." : "Request Breeding via WhatsApp"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
}
