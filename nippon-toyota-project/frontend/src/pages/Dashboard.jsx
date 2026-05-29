import { useEffect, useState } from "react";

export default function Dashboard() {
  const [role] = useState(() => localStorage.getItem("role") || "");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-hero">
        <div>
          <p className="eyebrow">Nippon Toyota</p>
          <h2>Dashboard</h2>
          <p>Welcome, {role === "admin" ? "Admin" : "Sales Person"}.</p>
        </div>
        <button onClick={handleLogout} className="secondary-action">
          Logout
        </button>
      </header>
      
      {role === "admin" && (
        <div className="dashboard-section">
          <h3>Admin Panel</h3>
          <p>Manage users and view reports</p>
        </div>
      )}

      {role === "sales" && (
        <div className="dashboard-section">
          <h3>Sales Panel</h3>
          <p>View and manage your sales</p>
        </div>
      )}
    </div>
  );
}
