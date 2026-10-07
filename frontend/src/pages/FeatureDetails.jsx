import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import "./Auth.css";

function FeatureDetails() {
  const { name } = useParams();
  const navigate = useNavigate();

  // Decode the URL parameter nicely
  const displayName = name ? decodeURIComponent(name).replace(/-/g, " ") : "Feature Overview";

  return (
    <div className="auth-page" style={{ alignItems: "center", paddingTop: "80px", overflowY: "auto", minHeight: "100vh" }}>
      <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 10 }}>
        <BackButton />
      </div>

      <div style={{
        width: "100%",
        maxWidth: "900px",
        padding: "20px",
        textAlign: "center"
      }}>
        <div style={{ marginBottom: "50px" }}>
          <span style={{ 
            background: "rgba(59, 130, 246, 0.2)", 
            color: "var(--text)", 
            padding: "8px 20px", 
            borderRadius: "30px",
            fontWeight: "700",
            fontSize: "0.9rem",
            textTransform: "uppercase",
            letterSpacing: "1px",
            display: "inline-block",
            marginBottom: "15px",
            border: "1px solid var(--border)"
          }}>
            Technology & Innovation
          </span>
          <h1 style={{ 
            fontSize: "3.5rem", 
            fontWeight: "900", 
            color: "var(--text)", 
            marginBottom: "15px",
            lineHeight: "1.2",
            textTransform: "capitalize"
          }}>
            {displayName}
          </h1>
          <p style={{ color: "var(--text)", fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto", lineHeight: "1.6" }}>
            This feature helps users travel safely and confidently using advanced smart systems powered by artificial intelligence and real-time data analysis.
          </p>
        </div>

        <div className="auth-card" style={{ 
          padding: "40px", 
          textAlign: "left",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          boxShadow: "0 4px 6px rgba(15, 23, 42, 0.05)"
        }}>
          <h3 style={{ color: "var(--text)", fontSize: "1.5rem", marginBottom: "30px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "15px" }}>
            Core Capabilities
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "25px" }}>
            
            <div style={{ 
              background: "var(--bg-card)", 
              padding: "20px", 
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              display: "flex",
              alignItems: "flex-start",
              gap: "15px",
              transition: "transform 0.2s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: "2rem", background: "var(--accent-bg)", padding: "10px", borderRadius: "12px", color: "var(--text)" }}></div>
              <div>
                <h4 style={{ color: "var(--text)", margin: "0 0 5px 0", fontSize: "1.1rem" }}>Real-time monitoring</h4>
                <p style={{ color: "var(--text)", margin: 0, fontSize: "0.95rem", lineHeight: "1.4" }}>Continuous tracking and analysis of vehicle diagnostics and surroundings.</p>
              </div>
            </div>

            <div style={{ 
              background: "var(--bg-card)", 
              padding: "20px", 
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              display: "flex",
              alignItems: "flex-start",
              gap: "15px",
              transition: "transform 0.2s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: "2rem", background: "var(--accent-bg)", padding: "10px", borderRadius: "12px", color: "var(--text)" }}></div>
              <div>
                <h4 style={{ color: "var(--text)", margin: "0 0 5px 0", fontSize: "1.1rem" }}>AI-powered protection</h4>
                <p style={{ color: "var(--text)", margin: 0, fontSize: "0.95rem", lineHeight: "1.4" }}>Predictive algorithms that anticipate potential hazards before they occur.</p>
              </div>
            </div>

            <div style={{ 
              background: "var(--bg-card)", 
              padding: "20px", 
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              display: "flex",
              alignItems: "flex-start",
              gap: "15px",
              transition: "transform 0.2s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: "2rem", background: "var(--accent-bg)", padding: "10px", borderRadius: "12px", color: "var(--text)" }}></div>
              <div>
                <h4 style={{ color: "var(--text)", margin: "0 0 5px 0", fontSize: "1.1rem" }}>Instant emergency support</h4>
                <p style={{ color: "var(--text)", margin: 0, fontSize: "0.95rem", lineHeight: "1.4" }}>One-touch connectivity to emergency services and DriveSphere support.</p>
              </div>
            </div>

            <div style={{ 
              background: "var(--bg-card)", 
              padding: "20px", 
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              display: "flex",
              alignItems: "flex-start",
              gap: "15px",
              transition: "transform 0.2s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: "2rem", background: "var(--accent-bg)", padding: "10px", borderRadius: "12px", color: "var(--text)" }}></div>
              <div>
                <h4 style={{ color: "var(--text)", margin: "0 0 5px 0", fontSize: "1.1rem" }}>Fast and secure assistance</h4>
                <p style={{ color: "var(--text)", margin: 0, fontSize: "0.95rem", lineHeight: "1.4" }}>Encrypted data transmission ensuring your privacy and security at all times.</p>
              </div>
            </div>

          </div>
          
          <div style={{ marginTop: "40px", textAlign: "center" }}>
            <button 
              className="auth-btn" 
              onClick={() => navigate("/home")}
              style={{ maxWidth: "300px", background: "var(--text)" }}
            >
              Return to Fleet
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default FeatureDetails;