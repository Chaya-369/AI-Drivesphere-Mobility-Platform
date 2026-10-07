import BackButton from "../components/BackButton";
import "./Auth.css";

function CancellationPolicy() {
  const policies = [
    { icon: "", text: "Free cancellation is allowed up to 24 hours before pickup." },
    { icon: "⏳", text: "Cancellation within 24 hours may include a 20% deduction." },
    { icon: "", text: "No refund will be given after the trip has started." },
    { icon: "️", text: "If the owner cancels, the user receives a full refund." },
    { icon: "", text: "Refund status can be checked from My Bookings." }
  ];

  return (
    <div className="auth-page">
      <BackButton />
      <div className="auth-card" style={{ width: "100%", maxWidth: "600px", textAlign: "left", padding: "40px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "30px", color: "var(--text)", fontSize: "2rem" }}>
          Cancellation Policy
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {policies.map((policy, index) => (
            <div 
              key={index} 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "15px",
                background: "var(--bg-card)",
                padding: "15px 20px",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.05)"
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>{policy.icon}</span>
              <p style={{ margin: 0, color: "var(--text)", fontSize: "1rem", lineHeight: "1.5" }}>
                {policy.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CancellationPolicy;