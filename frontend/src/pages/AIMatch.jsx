import { useState } from "react";
import BackButton from "../components/BackButton";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

import { carDatabase } from "../data/carDatabase";

function AIMatch() {
  const [budget, setBudget] = useState("");
  const [trip, setTrip] = useState("Budget");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleMatch = () => {
    setError("");
    const budgetNum = Number(budget);

    if (!budgetNum || budgetNum <= 0) {
      setError("Please enter a valid budget amount.");
      return;
    }

    setIsSearching(true);
    setResult(null);

    setTimeout(() => {
      // 1. Filter by requested trip category
      const categoryCars = carDatabase.filter(c => c.type === trip);
      
      // 2. Enforce strict budget limits (never exceed budget)
      const affordableCars = categoryCars.filter(c => c.price <= budgetNum);

      if (affordableCars.length === 0) {
        // If strict budget is not met, suggest the minimum budget needed
        const cheapestInCat = [...categoryCars].sort((a, b) => a.price - b.price)[0];
        if (cheapestInCat) {
          setError(`Strict Match Failed: No ${trip} vehicles found under ₹${budgetNum}. The cheapest option is the ${cheapestInCat.name} starting at ₹${cheapestInCat.price}/day.`);
        } else {
          setError(`No vehicles available in the ${trip} category.`);
        }
        setIsSearching(false);
        return;
      }

      // 3. Find the best possible match closest to the exact budget (maximize value without exceeding)
      affordableCars.sort((a, b) => b.price - a.price);
      const exactMatch = affordableCars[0];

      setResult({ 
        ...exactMatch, 
        price: `₹${exactMatch.price}/day` 
      });
      
      setIsSearching(false);
    }, 600); // Small artificial delay to simulate AI thought process
  };

  return (
    <div className="auth-page" style={{ alignItems: "center", paddingTop: "80px", overflowY: "auto" }}>
      <div style={{ position: "absolute", top: "20px", left: "20px" }}>
        <BackButton />
      </div>

      <div style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "40px",
        width: "100%",
        maxWidth: "1200px",
        padding: "20px",
        justifyContent: "center"
      }}>
        
        {/* Left Side: Information */}
        <div style={{ flex: "1 1 400px", maxWidth: "500px", textAlign: "left" }}>
          <div style={{
            background: "rgba(59, 130, 246, 0.15)",
            color: "var(--text)",
            padding: "8px 16px",
            borderRadius: "20px",
            display: "inline-block",
            fontWeight: "700",
            fontSize: "0.85rem",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "20px"
          }}>
            Powered by DriveSphere AI
          </div>
          <h1 style={{ 
            fontSize: "3.5rem", 
            fontWeight: "900", 
            color: "var(--text)", 
            marginBottom: "20px",
            lineHeight: "1.2"
          }}>
            Find Your Perfect Match
          </h1>
          <p style={{ 
            fontSize: "1.2rem", 
            color: "var(--text)", 
            lineHeight: "1.6",
            marginBottom: "40px"
          }}>
            Don't waste time scrolling. Let our smart AI engine recommend the exact car you need based on your budget, travel style, and preferences.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <span style={{ fontSize: "2rem", background: "var(--bg-card)", padding: "15px", borderRadius: "15px" }}></span>
              <div>
                <h4 style={{ margin: 0, color: "var(--text)", fontSize: "1.1rem" }}>Smart Analytics</h4>
                <p style={{ margin: 0, color: "var(--text)", fontSize: "0.95rem" }}>Analyzes thousands of vehicles instantly.</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <span style={{ fontSize: "2rem", background: "var(--bg-card)", padding: "15px", borderRadius: "15px" }}></span>
              <div>
                <h4 style={{ margin: 0, color: "var(--text)", fontSize: "1.1rem" }}>Budget Optimized</h4>
                <p style={{ margin: 0, color: "var(--text)", fontSize: "0.95rem" }}>Finds the best value within your price range.</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <span style={{ fontSize: "2rem", background: "var(--bg-card)", padding: "15px", borderRadius: "15px" }}></span>
              <div>
                <h4 style={{ margin: 0, color: "var(--text)", fontSize: "1.1rem" }}>Purpose Driven</h4>
                <p style={{ margin: 0, color: "var(--text)", fontSize: "0.95rem" }}>Matches vehicle capabilities to your trip type.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: AI Tool */}
        <div style={{ flex: "1 1 400px", maxWidth: "500px" }}>
          <div className="auth-card" style={{ padding: "40px", width: "100%", position: "relative" }}>
            <h2 style={{ color: "var(--text)", marginBottom: "30px", textAlign: "center", fontSize: "1.8rem" }}>Configure Search</h2>

            {error && (
              <div style={{
                background: "var(--accent-bg)",
                color: "var(--text)",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "20px",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                textAlign: "center"
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: "20px", textAlign: "left" }}>
              <label style={{ display: "block", color: "var(--text)", marginBottom: "8px", fontWeight: "600" }}>Daily Budget (₹)</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. 4000"
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  color: "var(--text)",
                  fontSize: "1.1rem",
                  outline: "none"
                }}
              />
            </div>

            <div style={{ marginBottom: "30px", textAlign: "left" }}>
              <label style={{ display: "block", color: "var(--text)", marginBottom: "8px", fontWeight: "600" }}>Trip Purpose</label>
              <select
                value={trip}
                onChange={(e) => setTrip(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  color: "var(--text)",
                  fontSize: "1.1rem",
                  outline: "none",
                  cursor: "pointer",
                  appearance: "none"
                }}
              >
                <option value="Budget">Budget / Everyday</option>
                <option value="Family">Family Trip (7-Seater)</option>
                <option value="Adventure">Off-road / Adventure</option>
                <option value="Business">Business / Executive</option>
                <option value="EV">Electric Vehicle (Eco)</option>
                <option value="Luxury">Premium Luxury</option>
              </select>
            </div>

            <button 
              className="auth-btn" 
              onClick={handleMatch}
              disabled={isSearching}
              style={{
                boxShadow: "0 4px 6px rgba(15, 23, 42, 0.05)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px"
              }}
            >
              {isSearching ? "Analyzing..." : "Generate AI Match "}
            </button>

            {/* Result Display */}
            {result && (
              <div style={{
                marginTop: "30px",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                padding: "20px",
                textAlign: "center",
                animation: "fadeInUp 0.5s ease forwards",
                boxShadow: "0 4px 6px rgba(15, 23, 42, 0.05)"
              }}>
                <div style={{ 
                  background: "var(--text)", 
                  borderRadius: "12px", 
                  padding: "10px",
                  marginBottom: "15px"
                }}>
                  <img 
                    src={result.image} 
                    alt={result.name} 
                    style={{ width: "100%", maxWidth: "250px", objectFit: "contain", filter: "drop-shadow(0 10px 10px var(--glass-bg))" }} 
                  />
                </div>
                
                <h3 style={{ fontSize: "1.8rem", color: "var(--text)", margin: "0 0 5px 0" }}>{result.name}</h3>
                <p style={{ color: "var(--text)", fontSize: "1.2rem", fontWeight: "700", margin: "0 0 15px 0" }}>{result.price}</p>

                <div style={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  gap: "10px", 
                  marginBottom: "20px",
                  flexWrap: "wrap"
                }}>
                  <span style={{ background: "rgba(255, 255, 255, 0.1)", padding: "5px 12px", borderRadius: "20px", fontSize: "0.85rem", color: "var(--text)" }}>{result.fuel}</span>
                  <span style={{ background: "rgba(255, 255, 255, 0.1)", padding: "5px 12px", borderRadius: "20px", fontSize: "0.85rem", color: "var(--text)" }}>{result.seats}</span>
                  <span style={{ background: "rgba(255, 255, 255, 0.1)", padding: "5px 12px", borderRadius: "20px", fontSize: "0.85rem", color: "var(--text)" }}>{result.rating}</span>
                </div>

                <button
                  className="auth-btn"
                  onClick={() => navigate("/booking", { state: { car: result } })}
                  style={{ background: "var(--accent)", color: "var(--text)", boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)" }}
                >
                  Book This Match 
                </button>
              </div>
            )}
            
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default AIMatch;