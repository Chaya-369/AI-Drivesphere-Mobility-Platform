import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BackButton from "../components/BackButton";
import "./Auth.css";

function Terms() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (!accepted) {
      setError("Please accept the Terms & Conditions before continuing.");
      return;
    }
    navigate("/payment", { state });
  };

  const terms = [
    { icon: "🪪", text: "Driver must carry a valid driver's license at all times." },
    { icon: "", text: "Fuel charges are excluded from the rental price." },
    { icon: "⏳", text: "Late returns may incur additional hourly penalty charges." },
    { icon: "", text: "Vehicle damage or scratches will result in repair charges." },
    { icon: "", text: "Drive safely and strictly follow all local traffic rules." }
  ];

  return (
    <div className="auth-page">
      <div style={{ position: "absolute", top: "20px", left: "20px" }}>
        <BackButton />
      </div>

      <div className="auth-card" style={{ 
        width: "100%", 
        maxWidth: "650px", 
        padding: "40px",
        textAlign: "left"
      }}>
        <h1 style={{ 
          textAlign: "center", 
          marginBottom: "10px", 
          color: "var(--text)", 
          fontSize: "2.2rem" 
        }}>
          Terms & Conditions
        </h1>
        <p style={{ 
          textAlign: "center", 
          color: "var(--text)", 
          marginBottom: "30px" 
        }}>
          Please read and agree to our rental policies.
        </p>

        {error && (
          <div className="error-message" style={{
            background: "var(--accent-bg)",
            borderColor: "rgba(59, 130, 246, 0.3)",
            color: "var(--text)",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}

        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: "15px", 
          marginBottom: "35px" 
        }}>
          {terms.map((term, index) => (
            <div 
              key={index} 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "15px",
                background: "var(--bg-card)",
                padding: "16px 20px",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(15, 23, 42, 0.8)";
                e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--glass-bg)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.05)";
              }}
            >
              <span style={{ fontSize: "1.5rem", filter: "drop-shadow(0 2px 4px rgba(15, 23, 42, 0.3))" }}>
                {term.icon}
              </span>
              <p style={{ margin: 0, color: "var(--text)", fontSize: "1.05rem", lineHeight: "1.5" }}>
                {term.text}
              </p>
            </div>
          ))}
        </div>

        <label style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          gap: "12px", 
          marginBottom: "25px", 
          cursor: "pointer",
          fontSize: "1.1rem",
          color: "var(--text)",
          background: accepted ? "var(--accent-bg)" : "rgba(255, 255, 255, 0.05)",
          padding: "15px",
          borderRadius: "12px",
          border: accepted ? "1px solid rgba(59, 130, 246, 0.4)" : "1px solid transparent",
          transition: "all 0.3s ease"
        }}>
          <input
            type="checkbox"
            checked={accepted}
            onChange={() => {
              setAccepted(!accepted);
              if (error) setError("");
            }}
            style={{ 
              width: "22px", 
              height: "22px", 
              cursor: "pointer",
              accentcolor: "var(--text)"
            }}
          />
          I have read and agree to the Terms & Conditions
        </label>

        <button 
          className="auth-btn" 
          onClick={handleContinue}
          style={{ 
            opacity: accepted ? 1 : 0.7,
            transform: accepted ? "translateY(0)" : "none",
            boxShadow: accepted ? "0 6px 20px rgba(59, 130, 246, 0.6)" : "none",
          }}
        >
          Continue to Payment 
        </button>
      </div>
    </div>
  );
}

export default Terms;