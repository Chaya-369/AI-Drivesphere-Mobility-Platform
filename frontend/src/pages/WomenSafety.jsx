import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

function WomenSafety() {
  const navigate = useNavigate();
  const [sosActive, setSosActive] = useState(false);

  const features = [
    { icon: "", title: "Emergency SOS", desc: "Instant emergency alert support for quick help." },
    { icon: "", title: "Live Tracking", desc: "Share your live location with trusted contacts." },
    { icon: "‍‍", title: "Trusted Contacts", desc: "Add family members for emergency communication." },
    { icon: "️", title: "Safe Route AI", desc: "AI suggests safer and well-lit travel routes." },
    { icon: "", title: "Fake Call Feature", desc: "Receive fake calls during uncomfortable situations." },
    { icon: "", title: "24/7 Support", desc: "Quick customer and emergency support anytime." },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--text)",
      color: "var(--text)",
      fontFamily: "'Inter', sans-serif",
      padding: "40px 20px"
    }}>
      <div style={{ position: "absolute", top: "20px", left: "20px" }}>
        <BackButton />
      </div>

      {/* Hero Section */}
      <div style={{
        maxWidth: "1100px",
        margin: "0 auto 60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "var(--bg-card)",
        backdropFilter: "blur(20px)",
        border: "1px solid var(--border)",
        borderRadius: "24px",
        padding: "50px",
        boxShadow: "0 4px 6px rgba(15, 23, 42, 0.05)",
        gap: "40px",
        flexWrap: "wrap"
      }}>
        <div style={{ flex: 1, minWidth: "300px" }}>
          <span style={{ 
            background: "rgba(59, 130, 246, 0.2)", 
            color: "var(--text)", 
            padding: "8px 16px", 
            borderRadius: "20px",
            fontWeight: "600",
            fontSize: "0.9rem",
            display: "inline-block",
            marginBottom: "20px"
          }}>
            ️ Smart Safety Initiative
          </span>
          <h1 style={{ fontSize: "3rem", fontWeight: "800", marginBottom: "20px", lineHeight: "1.2" }}>
            Women Safety Mode
          </h1>
          <p style={{ fontSize: "1.1rem", color: "var(--text)", lineHeight: "1.6", marginBottom: "30px" }}>
            Travel confidently with AI-driven SOS alerts, live tracking, trusted contacts, and safe route suggestions. Your safety is our absolute priority.
          </p>
          <button
            onClick={() => setSosActive(true)}
            style={{
              background: "var(--text)",
              color: "white",
              border: "none",
              padding: "16px 32px",
              borderRadius: "12px",
              fontSize: "1.1rem",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)",
              transition: "transform 0.2s, box-shadow 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 15px 35px rgba(59, 130, 246, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(59, 130, 246, 0.4)";
            }}
          >
            Activate Safety Mode
          </button>
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3063/3063822.png"
            alt="Women Safety"
            style={{ width: "100%", maxWidth: "350px", filter: "drop-shadow(0 20px 30px var(--glass-bg))" }}
          />
        </div>
      </div>

      {/* Features Grid */}
      <div style={{ maxWidth: "1100px", margin: "0 auto 60px" }}>
        <h2 style={{ textAlign: "center", fontSize: "2.5rem", marginBottom: "40px" }}>Safety Features</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "25px"
        }}>
          {features.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(`/safety-feature/${item.title}`)}
              style={{
                background: "var(--bg-card)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                borderRadius: "20px",
                padding: "30px",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.4)";
                e.currentTarget.style.boxShadow = "0 15px 30px rgba(15, 23, 42, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.05)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "20px" }}>{item.icon}</div>
              <h3 style={{ fontSize: "1.4rem", marginBottom: "10px", color: "var(--text)" }}>{item.title}</h3>
              <p style={{ color: "var(--text)", lineHeight: "1.5" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Helpline */}
      <div style={{
        maxWidth: "1100px",
        margin: "0 auto",
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "24px",
        padding: "40px",
        textAlign: "center"
      }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "30px" }}>Emergency Helpline Numbers</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px"
        }}>
          {[
            { label: "Police", num: "100", icon: "", color: "var(--text)" },
            { label: "Ambulance", num: "108", icon: "", color: "var(--text)" },
            { label: "Women Helpline", num: "1091", icon: "", color: "var(--text)" },
            { label: "Fire Service", num: "101", icon: "", color: "var(--text)" }
          ].map((help, i) => (
            <div key={i} style={{
              background: "var(--bg-card)",
              padding: "20px",
              borderRadius: "16px",
              border: `1px solid ${help.color}40`,
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "10px" }}>{help.icon}</div>
              <div style={{ color: "var(--text)", fontSize: "1.1rem", marginBottom: "5px" }}>{help.label}</div>
              <div style={{ color: help.color, fontSize: "1.8rem", fontWeight: "bold" }}>{help.num}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SOS Popup Modal */}
      {sosActive && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(8px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "var(--text)",
            padding: "50px",
            borderRadius: "24px",
            textAlign: "center",
            maxWidth: "500px",
            width: "90%",
            boxShadow: "0 25px 50px rgba(59, 130, 246, 0.3)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            animation: "pulse 2s infinite"
          }}>
            <h2 style={{ fontSize: "2.5rem", marginBottom: "20px" }}> SOS ACTIVATED</h2>
            <p style={{ fontSize: "1.2rem", marginBottom: "15px", fontWeight: "500" }}>
              Your emergency alert has been broadcasted to all trusted contacts.
            </p>
            <p style={{ fontSize: "1.1rem", background: "rgba(15, 23, 42, 0.3)", padding: "10px", borderRadius: "10px", marginBottom: "30px" }}>
               Live location sharing is now active.
            </p>
            <button 
              onClick={() => setSosActive(false)}
              style={{
                background: "white",
                color: "var(--text)",
                border: "none",
                padding: "14px 40px",
                borderRadius: "30px",
                fontSize: "1.1rem",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 4px 6px rgba(15, 23, 42, 0.05)"
              }}
            >
              Cancel Emergency
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default WomenSafety;