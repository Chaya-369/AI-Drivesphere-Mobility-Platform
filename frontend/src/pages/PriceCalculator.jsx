import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import "./Auth.css";

function PriceCalculator() {
  const navigate = useNavigate();
  const [days, setDays] = useState("");
  const [price, setPrice] = useState("");
  const [hours, setHours] = useState("");
  const [mode, setMode] = useState("daily"); // 'daily' or 'hourly'
  const [result, setResult] = useState(null);

  const calculatePrice = () => {
    let total = 0;
    if (mode === "daily") {
      if (!days || !price) return;
      total = Number(days) * Number(price);
    } else {
      if (!hours || !price) return;
      const hourlyRate = Number(price) / 24;
      total = Number(hours) * hourlyRate;
    }
    const serviceFee = total * 0.10;
    const gst = total * 0.18;
    const finalAmount = total + serviceFee;

    setResult({ base: Math.round(total), serviceFee: Math.round(serviceFee), gst: Math.round(gst), total: Math.round(finalAmount) });
  };

  return (
    <div className="auth-page" style={{ alignItems: "center", paddingTop: "80px", overflowY: "auto", minHeight: "100vh" }}>
      <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 10 }}>
        <BackButton />
      </div>

      <div style={{ width: "100%", maxWidth: "900px", padding: "20px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span style={{
            background: "rgba(59, 130, 246, 0.2)", color: "var(--text)",
            padding: "8px 20px", borderRadius: "30px", fontWeight: "700",
            fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px",
            display: "inline-block", marginBottom: "15px", border: "1px solid var(--border)"
          }}>
            Instant Estimate
          </span>
          <h1 style={{ fontSize: "3rem", fontWeight: "900", color: "var(--text)", marginBottom: "10px" }}>
            Price Calculator
          </h1>
          <p style={{ color: "var(--text)", fontSize: "1.1rem" }}>
            Instantly estimate your rental cost by day or by hour — no surprises.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "30px" }}>

          {/* Input Card */}
          <div className="auth-card" style={{ maxWidth: "100%", padding: "35px", textAlign: "left" }}>
            <h3 style={{ color: "var(--text)", marginBottom: "25px", fontSize: "1.4rem", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "15px" }}>
              Rental Parameters
            </h3>

            {/* Mode Toggle */}
            <div style={{ marginBottom: "25px" }}>
              <label style={{ display: "block", color: "var(--text)", marginBottom: "10px", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Billing Mode</label>
              <div style={{ display: "flex", background: "rgba(15, 23, 42, 0.3)", borderRadius: "12px", padding: "4px" }}>
                <button
                  onClick={() => { setMode("daily"); setResult(null); }}
                  style={{
                    flex: 1, padding: "10px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", transition: "all 0.3s",
                    background: mode === "daily" ? "rgba(59, 130, 246, 0.25)" : "transparent",
                    color: mode === "daily" ? "var(--accent)" : "var(--accent)"
                  }}
                >
                   Daily Rate
                </button>
                <button
                  onClick={() => { setMode("hourly"); setResult(null); }}
                  style={{
                    flex: 1, padding: "10px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", transition: "all 0.3s",
                    background: mode === "hourly" ? "rgba(59, 130, 246, 0.25)" : "transparent",
                    color: mode === "hourly" ? "var(--accent)" : "var(--accent)"
                  }}
                >
                  ⏱️ Hourly Rate
                </button>
              </div>
            </div>

            {/* Price Per Day */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", color: "var(--text)", marginBottom: "8px", fontSize: "0.95rem" }}>Price Per Day (₹)</label>
              <input
                type="number"
                placeholder="e.g. 2500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={{ width: "100%", padding: "14px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text)", outline: "none" }}
              />
            </div>

            {/* Duration */}
            {mode === "daily" ? (
              <div style={{ marginBottom: "30px" }}>
                <label style={{ display: "block", color: "var(--text)", marginBottom: "8px", fontSize: "0.95rem" }}>Number of Days</label>
                <input
                  type="number"
                  placeholder="e.g. 3"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  style={{ width: "100%", padding: "14px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text)", outline: "none" }}
                />
              </div>
            ) : (
              <div style={{ marginBottom: "30px" }}>
                <label style={{ display: "block", color: "var(--text)", marginBottom: "8px", fontSize: "0.95rem" }}>Number of Hours</label>
                <input
                  type="number"
                  placeholder="e.g. 6"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  style={{ width: "100%", padding: "14px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text)", outline: "none" }}
                />
              </div>
            )}

            <button
              className="auth-btn"
              onClick={calculatePrice}
              style={{ background: "var(--text)", boxShadow: "0 4px 6px rgba(15, 23, 42, 0.05)", maxWidth: "100%" }}
            >
              Calculate Cost 
            </button>
          </div>

          {/* Results Card */}
          <div className="auth-card" style={{
            maxWidth: "100%", padding: "35px",
            background: "var(--bg-card)", border: "1px solid var(--border)",
            display: "flex", flexDirection: "column", justifyContent: "center"
          }}>
            {!result ? (
              <div style={{ textAlign: "center", color: "var(--text)" }}>
                <div style={{ fontSize: "4rem", marginBottom: "15px" }}></div>
                <p style={{ color: "var(--text)" }}>Fill in the details on the left to get an instant price breakdown.</p>
              </div>
            ) : (
              <div style={{ animation: "fadeInUp 0.4s ease forwards" }}>
                <h3 style={{ color: "var(--text)", fontSize: "1.4rem", marginBottom: "25px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "15px" }}>
                  Cost Breakdown
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "25px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "15px", background: "var(--bg-card)", borderRadius: "10px" }}>
                    <span style={{ color: "var(--text)" }}>Base Rental Cost</span>
                    <span style={{ color: "var(--text)", fontWeight: "700" }}>₹{result.base}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "15px", background: "var(--bg-card)", borderRadius: "10px" }}>
                    <span style={{ color: "var(--text)" }}>Platform Service Fee (10%)</span>
                    <span style={{ color: "var(--text)", fontWeight: "700" }}>+ ₹{result.serviceFee}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "15px", background: "var(--bg-card)", borderRadius: "10px" }}>
                    <span style={{ color: "var(--text)", fontSize: "0.9rem" }}>GST (18% — included in base)</span>
                    <span style={{ color: "var(--text)", fontSize: "0.9rem" }}>₹{result.gst}</span>
                  </div>
                </div>

                {/* Total */}
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "20px", background: "var(--text)",
                  borderRadius: "12px", border: "1px solid var(--border)"
                }}>
                  <span style={{ color: "var(--text)", fontSize: "1.2rem", fontWeight: "600" }}>Grand Total</span>
                  <span style={{ color: "var(--text)", fontSize: "2.2rem", fontWeight: "900" }}>₹{result.total}</span>
                </div>

                <div style={{ marginTop: "20px", textAlign: "center" }}>
                  <button
                    onClick={() => navigate("/booking")}
                    style={{
                      background: "var(--bg-card)", color: "var(--text)",
                      border: "none", padding: "14px 30px", borderRadius: "10px", cursor: "pointer",
                      fontWeight: "700", transition: "transform 0.3s", boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)"
                    }}
                    onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
                    onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
                  >
                    Book Now at This Price 
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default PriceCalculator;