import React from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import "./Auth.css";

function UserDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || { name: "DriveSphere Member" };

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="auth-page" style={{ alignItems: "center", paddingTop: "80px", overflowY: "auto", minHeight: "100vh" }}>
      <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 10 }}>
        <BackButton />
      </div>

      <div style={{
        width: "100%",
        maxWidth: "1200px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "30px"
      }}>
        
        {/* Header Section */}
        <div className="auth-card" style={{ 
          maxWidth: "100%",
          padding: "30px 40px", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          boxShadow: "0 4px 6px rgba(15, 23, 42, 0.05)"
        }}>
          <div>
            <span style={{ 
              background: "rgba(59, 130, 246, 0.2)", 
              color: "var(--text)", 
              padding: "6px 15px", 
              borderRadius: "20px",
              fontWeight: "700",
              fontSize: "0.8rem",
              textTransform: "uppercase",
              letterSpacing: "1px",
              display: "inline-block",
              marginBottom: "10px"
            }}>
              Verified Member
            </span>
            <h1 style={{ color: "var(--text)", margin: "0 0 5px 0", fontSize: "2.2rem" }}>
              Welcome back, {user.name} 
            </h1>
            <p style={{ color: "var(--text)", margin: 0, fontSize: "1.1rem" }}>
              Manage your rentals, track live trips, and access smart features.
            </p>
          </div>

          <button 
            onClick={logout}
            style={{
              background: "var(--accent-bg)", color: "var(--text)", border: "1px solid rgba(59, 130, 246, 0.3)",
              padding: "10px 20px", borderRadius: "10px", fontWeight: "600", cursor: "pointer", transition: "all 0.3s"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(59, 130, 246, 0.2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--accent-bg)"; }}
          >
            Logout
          </button>
        </div>

        {/* Highlighted Safety Mode Section */}
        <div className="auth-card" style={{ 
          maxWidth: "100%",
          padding: "30px", 
          background: "var(--bg-card)",
          border: "1px solid rgba(59, 130, 246, 0.4)",
          boxShadow: "0 0 40px rgba(59, 130, 246, 0.15)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <h2 style={{ color: "var(--text)", margin: "0 0 10px 0", fontSize: "1.8rem", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "2rem", animation: "pulse-red 2s infinite" }}>🛡️</span> Priority Safety Mode
            </h2>
            <p style={{ color: "var(--text)", margin: 0, fontSize: "1.1rem", maxWidth: "600px" }}>
              Activate enhanced women's safety features, emergency SOS, trusted contact live tracking, and safe-route mapping for your peace of mind.
            </p>
          </div>
          <button 
            onClick={() => navigate("/women-safety")}
            style={{
              background: "var(--accent)",
              color: "var(--text)",
              border: "none",
              padding: "15px 30px",
              borderRadius: "12px",
              fontSize: "1.1rem",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 10px 25px rgba(59, 130, 246, 0.5)",
              transition: "transform 0.3s ease"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            Activate Safety Protocols 
          </button>
        </div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          <div className="auth-card" style={{ maxWidth: "100%", padding: "25px", textAlign: "center", background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <h2 style={{ color: "var(--text)", fontSize: "2.5rem", margin: "0 0 5px 0", fontWeight: "900" }}>3</h2>
            <p style={{ color: "var(--text)", margin: 0, fontSize: "1rem", textTransform: "uppercase", letterSpacing: "1px" }}>Total Bookings</p>
          </div>
          <div className="auth-card" style={{ maxWidth: "100%", padding: "25px", textAlign: "center", background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <h2 style={{ color: "var(--text)", fontSize: "2.5rem", margin: "0 0 5px 0", fontWeight: "900" }}>2</h2>
            <p style={{ color: "var(--text)", margin: 0, fontSize: "1rem", textTransform: "uppercase", letterSpacing: "1px" }}>Saved Favorites</p>
          </div>
          <div className="auth-card" style={{ maxWidth: "100%", padding: "25px", textAlign: "center", background: "var(--bg-card)", border: "1px solid rgba(16, 185, 129, 0.4)" }}>
            <h2 style={{ color: "var(--accent)", fontSize: "2.5rem", margin: "0 0 5px 0", fontWeight: "900" }}>1000</h2>
            <p style={{ color: "var(--text)", margin: 0, fontSize: "1rem", textTransform: "uppercase", letterSpacing: "1px" }}>Green Points</p>
            <p style={{ color: "var(--accent)", margin: "10px 0 0 0", fontSize: "0.85rem", fontWeight: "600" }}>Redeem for 20% Off EV Rides!</p>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "20px",
          marginTop: "10px"
        }}>
          
          <ActionCard icon="" title="Browse Fleet" desc="Find your next ride" onClick={() => navigate("/home")} />
          <ActionCard icon="" title="My Bookings" desc="View active rentals" onClick={() => navigate("/my-bookings")} />
          <ActionCard icon="" title="AI Match" desc="Find the perfect car" onClick={() => navigate("/ai-match")} />
          <ActionCard icon="" title="Live Tracking" desc="Monitor your trip" onClick={() => navigate("/live-tracking")} />
          <ActionCard icon="️" title="Favorites" desc="Saved vehicles" onClick={() => navigate("/favorites")} />
          <ActionCard icon="" title="Pricing" desc="AI Cost Calculator" onClick={() => navigate("/price-calculator")} />
          <ActionCard icon="⭐" title="Reviews" desc="Rate your trips" onClick={() => navigate("/review")} />
          <ActionCard icon="" title="EV Green" desc="Sustainable travel" onClick={() => navigate("/sustainability")} />
          
        </div>
      </div>
      
      <style>{`
        @keyframes pulse-red {
          0% { filter: drop-shadow(0 0 0 rgba(59, 130, 246, 0.7)); transform: scale(1); }
          50% { filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0)); transform: scale(1.1); }
          100% { filter: drop-shadow(0 0 0 rgba(59, 130, 246, 0)); transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

function ActionCard({ icon, title, desc, onClick }) {
  return (
    <div 
      onClick={onClick}
      style={{
        background: "var(--bg-card)",
        border: "1px solid rgba(15, 23, 42, 0.05)",
        borderRadius: "16px",
        padding: "20px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        boxShadow: "0 2px 5px rgba(15, 23, 42, 0.02)"
      }}
      onMouseEnter={(e) => { 
        e.currentTarget.style.transform = "translateY(-5px)"; 
        e.currentTarget.style.background = "var(--bg-card)";
        e.currentTarget.style.borderColor = "var(--accent)";
        e.currentTarget.style.boxShadow = "0 10px 15px rgba(15, 23, 42, 0.05)";
      }}
      onMouseLeave={(e) => { 
        e.currentTarget.style.transform = "translateY(0)"; 
        e.currentTarget.style.background = "var(--bg-card)";
        e.currentTarget.style.borderColor = "rgba(15, 23, 42, 0.05)";
        e.currentTarget.style.boxShadow = "0 2px 5px rgba(15, 23, 42, 0.02)";
      }}
    >
      <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>{icon}</div>
      <h3 style={{ color: "var(--text)", margin: "0 0 5px 0", fontSize: "1.1rem" }}>{title}</h3>
      <p style={{ color: "var(--text)", margin: 0, fontSize: "0.85rem" }}>{desc}</p>
    </div>
  );
}

export default UserDashboard;