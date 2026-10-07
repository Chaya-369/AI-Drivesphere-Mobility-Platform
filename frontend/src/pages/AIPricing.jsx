import { useState } from "react";
import BackButton from "../components/BackButton";
import "./Auth.css";

function AIPricing() {
  const [basePrice, setBasePrice] = useState("");
  const [days, setDays] = useState("");
  const [demand, setDemand] = useState("Normal");
  const [tripDay, setTripDay] = useState("Weekday");
  const [weather, setWeather] = useState("Clear");
  
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateAIPrice = () => {
    if (!basePrice || !days) return;

    setIsCalculating(true);
    setResult(null);

    // Simulate AI processing delay
    setTimeout(() => {
      let price = Number(basePrice) * Number(days);
      let demandMultiplier = demand === "High" ? 0.25 : 0;
      let dayMultiplier = tripDay === "Weekend" ? 0.15 : 0;
      let weatherMultiplier = weather === "Rain" ? 0.10 : weather === "Snow" ? 0.20 : 0;

      const demandSurcharge = price * demandMultiplier;
      const daySurcharge = price * dayMultiplier;
      const weatherSurcharge = price * weatherMultiplier;
      
      const subtotal = price + demandSurcharge + daySurcharge + weatherSurcharge;
      const serviceFee = subtotal * 0.10;
      const finalPrice = subtotal + serviceFee;

      setResult({
        baseTotal: price,
        demandExtra: demandSurcharge,
        dayExtra: daySurcharge,
        weatherExtra: weatherSurcharge,
        serviceFee: serviceFee,
        finalTotal: Math.round(finalPrice)
      });
      setIsCalculating(false);
    }, 800);
  };

  return (
    <div className="auth-page" style={{ alignItems: "flex-start", paddingTop: "80px", overflowY: "auto" }}>
      <div style={{ position: "absolute", top: "20px", left: "20px" }}>
        <BackButton />
      </div>

      <div style={{
        width: "100%",
        maxWidth: "900px",
        margin: "0 auto",
        padding: "20px"
      }}>
        
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
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
            marginBottom: "15px"
          }}>
            Smart Market Analytics
          </span>
          <h1 style={{ 
            fontSize: "3.2rem", 
            fontWeight: "900", 
            color: "var(--text)", 
            marginBottom: "15px",
            lineHeight: "1.2"
          }}>
            Dynamic AI Pricing
          </h1>
          <p style={{ 
            fontSize: "1.2rem", 
            color: "var(--text)", 
            fontWeight: "400",
            maxWidth: "600px",
            margin: "0 auto"
          }}>
            Our AI calculates real-time rental prices based on market demand, availability, and optimal time-frames to ensure fair pricing.
          </p>
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", 
          gap: "30px",
          paddingBottom: "50px"
        }}>
          
          {/* Form Side */}
          <div className="auth-card" style={{ width: "100%", padding: "35px" }}>
            <h3 style={{ color: "var(--text)", marginBottom: "25px", fontSize: "1.4rem", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "15px" }}>
              Configuration
            </h3>

            <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
              <div style={{ flex: 1, textAlign: "left" }}>
                <label style={{ display: "block", color: "var(--text)", marginBottom: "8px", fontSize: "0.95rem" }}>Base Price/Day (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 2000"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  style={{
                    width: "100%", padding: "14px", background: "var(--bg-card)",
                    border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text)", outline: "none"
                  }}
                />
              </div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <label style={{ display: "block", color: "var(--text)", marginBottom: "8px", fontSize: "0.95rem" }}>Duration (Days)</label>
                <input
                  type="number"
                  placeholder="e.g. 3"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  style={{
                    width: "100%", padding: "14px", background: "var(--bg-card)",
                    border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text)", outline: "none"
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "20px", textAlign: "left" }}>
              <label style={{ display: "block", color: "var(--text)", marginBottom: "8px", fontSize: "0.95rem" }}>Market Demand Level</label>
              <select 
                value={demand} 
                onChange={(e) => setDemand(e.target.value)}
                style={{
                  width: "100%", padding: "14px", background: "var(--bg-card)",
                  border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text)", outline: "none",
                  appearance: "none", cursor: "pointer"
                }}
              >
                <option value="Low">Low (Excess Supply)</option>
                <option value="Normal">Normal</option>
                <option value="High">High (Surge Pricing)</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "15px", marginBottom: "30px" }}>
              <div style={{ flex: 1, textAlign: "left" }}>
                <label style={{ display: "block", color: "var(--text)", marginBottom: "8px", fontSize: "0.95rem" }}>Trip Day</label>
                <select 
                  value={tripDay} 
                  onChange={(e) => setTripDay(e.target.value)}
                  style={{
                    width: "100%", padding: "14px", background: "var(--bg-card)",
                    border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text)", outline: "none",
                    appearance: "none", cursor: "pointer"
                  }}
                >
                  <option value="Weekday">Weekday (Mon-Thu)</option>
                  <option value="Weekend">Weekend (Fri-Sun)</option>
                </select>
              </div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <label style={{ display: "block", color: "var(--text)", marginBottom: "8px", fontSize: "0.95rem" }}>Weather Forecast</label>
                <select 
                  value={weather} 
                  onChange={(e) => setWeather(e.target.value)}
                  style={{
                    width: "100%", padding: "14px", background: "var(--bg-card)",
                    border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text)", outline: "none",
                    appearance: "none", cursor: "pointer"
                  }}
                >
                  <option value="Clear">Clear / Sunny</option>
                  <option value="Rain">Heavy Rain</option>
                  <option value="Snow">Snow / Ice</option>
                </select>
              </div>
            </div>

            <button 
              className="auth-btn" 
              onClick={calculateAIPrice}
              disabled={isCalculating || !basePrice || !days}
              style={{
                boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)",
                background: "var(--text)"
              }}
            >
              {isCalculating ? "Running AI Models..." : "Calculate AI Price "}
            </button>
          </div>

          {/* Results Side */}
          <div className="auth-card" style={{ 
            width: "100%", 
            padding: "35px",
            background: "var(--bg-card)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}>
            {!result && !isCalculating ? (
              <div style={{ textAlign: "center", color: "var(--text)" }}>
                <span style={{ fontSize: "3rem", display: "block", marginBottom: "15px" }}></span>
                <p>Configure parameters on the left to generate an AI pricing estimate.</p>
              </div>
            ) : isCalculating ? (
              <div style={{ textAlign: "center", color: "var(--text)" }}>
                <span style={{ fontSize: "3rem", display: "block", marginBottom: "15px", animation: "pulse 1.5s infinite" }}>️</span>
                <p>Calculating optimal rate...</p>
              </div>
            ) : (
              <div style={{ animation: "fadeInUp 0.5s ease forwards" }}>
                <h3 style={{ color: "var(--text)", marginBottom: "25px", fontSize: "1.4rem", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "15px" }}>
                  AI Price Breakdown
                </h3>
                
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", color: "var(--text)" }}>
                  <span>Base Total ({days} Days)</span>
                  <span>₹{Math.round(result.baseTotal)}</span>
                </div>
                
                {result.demandExtra !== 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", color: result.demandExtra > 0 ? "var(--accent)" : "var(--accent)" }}>
                    <span>{result.demandExtra > 0 ? "High Demand Surge" : "Low Demand Discount"}</span>
                    <span>{result.demandExtra > 0 ? "+" : ""} ₹{Math.round(result.demandExtra)}</span>
                  </div>
                )}
                
                {result.dayExtra > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", color: "var(--text)" }}>
                    <span>Weekend Surcharge (+15%)</span>
                    <span style={{ fontWeight: "600" }}>+₹{result.dayExtra.toFixed(2)}</span>
                  </div>
                )}
                {result.weatherExtra > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", color: "var(--text)" }}>
                    <span>Weather Risk Surcharge</span>
                    <span style={{ fontWeight: "600" }}>+₹{result.weatherExtra.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", color: "var(--text)" }}>
                  <span>Platform Service Fee (10%)</span>
                  <span>+ ₹{Math.round(result.serviceFee)}</span>
                </div>

                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  paddingTop: "20px", 
                  borderTop: "1px dashed rgba(255, 255, 255, 0.2)"
                }}>
                  <span style={{ fontSize: "1.2rem", color: "var(--text)", fontWeight: "600" }}>AI Final Price</span>
                  <span style={{ fontSize: "2rem", color: "var(--text)", fontWeight: "900" }}>₹{result.finalTotal}</span>
                </div>
                
                <div style={{ 
                  marginTop: "30px", 
                  background: "var(--accent-bg)", 
                  padding: "15px", 
                  borderRadius: "10px",
                  border: "1px solid rgba(59, 130, 246, 0.2)",
                  color: "var(--text)",
                  fontSize: "0.9rem",
                  textAlign: "center"
                }}>
                   Price optimized for market conditions
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
        @keyframes pulse {
          0% { opacity: 0.6; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 0.6; transform: scale(0.95); }
        }
      `}</style>
    </div>
  );
}

export default AIPricing;