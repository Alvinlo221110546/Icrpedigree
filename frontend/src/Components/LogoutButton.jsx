import React from "react";
import { logout } from "../Utils/api.js";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout gagal:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: "10px 28px",        
        fontSize: "1rem",            
        backgroundColor: "white",
        color: "#1565c0",
        fontWeight: "600",
        marginRight: "100px",
        borderRadius: "9999px",
        border: "none",
        boxShadow: "0 3px 8px rgba(0,0,0,0.1)", 
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e8f1ff")}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "white")}
    >
      Logout
    </button>


  );
};

export default LogoutButton;
