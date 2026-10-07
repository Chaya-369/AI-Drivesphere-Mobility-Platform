import { useNavigate, useLocation } from "react-router-dom";
import BackButton from "../components/BackButton";
import "./Auth.css";

function CarDetails() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const car = state?.car || {
    name: "Selected Car",
    brand: "DriveSphere",
    fuel: "Petrol",
    price: 1499,
    image: null,
    location: "Bangalore",
    rating: 4.5,
    availability: "Available",
    ownerName: "DriveSphere Partner"
  };

  return (
    <div className="auth-page" style={{ alignItems: "center", paddingTop: "80px", overflowY: "auto" }}>
      <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 10 }}>
        <BackButton />
      </div>

      <div style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "40px",
        width: "100%",
        maxWidth: "1000px",
        padding: "20px",
        justifyContent: "center",
        alignItems: "stretch"
      }}>
        
        {/* Left Side: Car Image & Presentation */}
        <div style={{ flex: "1 1 400px", maxWidth: "500px" }}>
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "24px",
            padding: "30px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 4px 6px rgba(15, 23, 42, 0.05)"
          }}>
            {/* Background Glow */}
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "150px",
              height: "150px",
              background: "var(--accent)",
              filter: "blur(100px)",
              opacity: 0.2,
              zIndex: 0
            }} />

            {car.image ? (
              <img
                src={car.image}
                alt={car.name}
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "contain",
                  filter: "drop-shadow(0 20px 20px rgba(15, 23, 42, 0.6))",
                  position: "relative",
                  zIndex: 1,
                  transform: "scale(1.1)"
                }}
              />
            ) : (
              <div style={{ fontSize: "5rem", color: "var(--text)", zIndex: 1, position: "relative" }}></div>
            )}
            
            <div style={{ position: "relative", zIndex: 1, textAlign: "center", marginTop: "30px" }}>
              <span style={{ 
                background: "rgba(255, 255, 255, 0.1)", 
                color: "var(--text)", 
                padding: "6px 16px", 
                borderRadius: "20px",
                fontSize: "0.85rem",
                textTransform: "uppercase",
                letterSpacing: "2px",
                fontWeight: "700"
              }}>
                {car.brand}
              </span>
              <h1 style={{ color: "var(--text)", fontSize: "2.8rem", margin: "15px 0 5px 0", fontWeight: "900", lineHeight: "1.1" }}>
                {car.name}
              </h1>
            </div>
          </div>
        </div>

        {/* Right Side: Specifications & Booking */}
        <div style={{ flex: "1 1 400px", maxWidth: "500px", display: "flex", flexDirection: "column" }}>
          <div className="auth-card" style={{ padding: "40px", width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
              <h2 style={{ color: "var(--text)", margin: 0, fontSize: "1.8rem" }}>Specifications</h2>
              <span style={{ 
                background: car.availability === "Available" ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.2)", 
                color: car.availability === "Available" ? "var(--accent)" : "var(--accent)", 
                padding: "6px 14px", 
                borderRadius: "20px", 
                fontWeight: "700",
                fontSize: "0.85rem",
                border: car.availability === "Available" ? "1px solid rgba(59, 130, 246, 0.3)" : "1px solid rgba(59, 130, 246, 0.3)"
              }}>
                {car.availability || "Available"}
              </span>
            </div>

            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "1fr 1fr", 
              gap: "20px", 
              marginBottom: "40px",
              flex: 1
            }}>
              <div style={{ background: "var(--bg-card)", padding: "15px", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                <span style={{ fontSize: "1.5rem", display: "block", marginBottom: "5px" }}></span>
                <span style={{ color: "var(--text)", fontSize: "0.85rem", textTransform: "uppercase" }}>Fuel Type</span>
                <p style={{ color: "var(--text)", fontWeight: "600", margin: "5px 0 0 0", fontSize: "1.1rem" }}>{car.fuel}</p>
              </div>

              <div style={{ background: "var(--bg-card)", padding: "15px", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                <span style={{ fontSize: "1.5rem", display: "block", marginBottom: "5px" }}></span>
                <span style={{ color: "var(--text)", fontSize: "0.85rem", textTransform: "uppercase" }}>Location</span>
                <p style={{ color: "var(--text)", fontWeight: "600", margin: "5px 0 0 0", fontSize: "1.1rem" }}>{car.location || "Bangalore"}</p>
              </div>

              <div style={{ background: "var(--bg-card)", padding: "15px", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                <span style={{ fontSize: "1.5rem", display: "block", marginBottom: "5px" }}>⭐</span>
                <span style={{ color: "var(--text)", fontSize: "0.85rem", textTransform: "uppercase" }}>User Rating</span>
                <p style={{ color: "var(--text)", fontWeight: "600", margin: "5px 0 0 0", fontSize: "1.1rem" }}>{car.rating || "4.5"}</p>
              </div>

              <div style={{ background: "var(--bg-card)", padding: "15px", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                <span style={{ fontSize: "1.5rem", display: "block", marginBottom: "5px" }}></span>
                <span style={{ color: "var(--text)", fontSize: "0.85rem", textTransform: "uppercase" }}>Owner</span>
                <p style={{ color: "var(--text)", fontWeight: "600", margin: "5px 0 0 0", fontSize: "1.1rem" }}>{car.ownerName || "Partner"}</p>
              </div>
            </div>

            <div style={{ 
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              padding: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px"
            }}>
              <div>
                <span style={{ color: "var(--text)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Rental Rate</span>
                <h3 style={{ color: "var(--text)", fontSize: "2.2rem", margin: "5px 0 0 0", fontWeight: "900" }}>₹{car.price}<span style={{ fontSize: "1rem", color: "var(--text)", fontWeight: "500" }}> / day</span></h3>
              </div>
            </div>

            <button 
              className="auth-btn"
              onClick={() => navigate("/booking", { state: { car } })} 
              style={{ 
                width: "100%", 
                padding: "16px", 
                fontSize: "1.1rem", 
                fontWeight: "700",
                background: "var(--accent)",
                color: "#ffffff",
                boxShadow: "0 4px 15px var(--accent-border)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px"
              }}
            >
              Proceed to Book 
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

export default CarDetails;