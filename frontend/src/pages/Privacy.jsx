import { useNavigate } from "react-router-dom";
import "./Auth.css";
import BackButton from "../components/BackButton";

function Privacy() {
  const navigate = useNavigate();

  const policies = [
    {
      icon: "",
      title: "Information We Collect",
      desc: "We collect user details, booking information, and vehicle listing details to provide you with the best experience."
    },
    {
      icon: "️",
      title: "How We Use Data",
      desc: "Your data is used strictly for secure login, smooth booking, safety measures, verification, and rental management."
    },
    {
      icon: "🪪",
      title: "License Verification",
      desc: "License details are processed securely and used exclusively for rental eligibility verification."
    },
    {
      icon: "",
      title: "Location & Tracking",
      desc: "Location data is utilized only for our advanced safety features, SOS alerts, and live trip tracking."
    },
    {
      icon: "",
      title: "Data Sharing",
      desc: "DriveSphere respects your privacy. We absolutely do not sell or share user data with third-party advertising companies."
    }
  ];

  return (
    <div className="auth-page">
      <div style={{ position: "absolute", top: "20px", left: "20px" }}>
        <BackButton />
      </div>

      <div className="auth-card" style={{ 
        width: "100%", 
        maxWidth: "800px", 
        padding: "50px",
        textAlign: "left"
      }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "2.5rem", color: "var(--text)", marginBottom: "10px" }}>Privacy Policy</h1>
          <p style={{ color: "var(--text)", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase" }}>
            Last updated: January 2026
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "40px" }}>
          {policies.map((policy, index) => (
            <div 
              key={index}
              style={{
                background: "var(--bg-card)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                borderRadius: "16px",
                padding: "25px",
                display: "flex",
                gap: "20px",
                alignItems: "flex-start",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(15, 23, 42, 0.8)";
                e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)";
                e.currentTarget.style.transform = "translateX(5px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--glass-bg)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.05)";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <div style={{ fontSize: "2.5rem", filter: "drop-shadow(0 2px 4px rgba(15, 23, 42, 0.3))" }}>
                {policy.icon}
              </div>
              <div>
                <h3 style={{ fontSize: "1.3rem", color: "var(--text)", marginBottom: "8px" }}>
                  {index + 1}. {policy.title}
                </h3>
                <p style={{ color: "var(--text)", lineHeight: "1.6", margin: 0 }}>
                  {policy.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <button 
            className="auth-btn" 
            onClick={() => navigate("/home")}
            style={{ width: "auto", padding: "14px 40px", fontSize: "1.1rem" }}
          >
            I Understand & Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default Privacy;