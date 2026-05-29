import SalesCalculator from "./SalesCalculator";
import "./SalesOfficerDashboard.css";

export default function SalesOfficerDashboard() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <div className="sales-officer-dashboard">
      <div className="header">
        <h1>Sales Officer Portal</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="welcome-message">
        <p>Welcome! Use this dashboard to track your car sales and calculate your monthly incentives.</p>
      </div>

      <div className="content">
        <SalesCalculator />
      </div>
    </div>
  );
}
