import { useState } from "react";
import CarInventory from "./CarInventory";
import IncentiveSlabConfig from "./IncentiveSlabConfig";
import "./AdminPanel.css";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("inventory");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <div className="admin-panel">
      <div className="header">
        <h1>Admin Control Panel</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="tabs">
        <button
          className={activeTab === "inventory" ? "active" : ""}
          onClick={() => setActiveTab("inventory")}
        >
          Car Inventory
        </button>
        <button
          className={activeTab === "slabs" ? "active" : ""}
          onClick={() => setActiveTab("slabs")}
        >
          Incentive Slabs
        </button>
      </div>

      <div className="content">
        {activeTab === "inventory" && <CarInventory />}
        {activeTab === "slabs" && <IncentiveSlabConfig />}
      </div>
    </div>
  );
}
