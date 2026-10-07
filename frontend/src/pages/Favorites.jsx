import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import "./Auth.css";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const removeFavorite = (carNameToRemove) => {
    const updatedFavs = favorites.filter(car => car.name !== carNameToRemove);
    setFavorites(updatedFavs);
    localStorage.setItem("favorites", JSON.stringify(updatedFavs));
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
      }}>
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
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
            border: "1px solid rgba(59, 130, 246, 0.3)"
          }}>
            Your Garage
          </span>
          <h1 style={{ 
            fontSize: "3.5rem", 
            fontWeight: "900", 
            color: "var(--text)", 
            marginBottom: "15px",
            lineHeight: "1.2"
          }}>
            Favorite Vehicles
          </h1>
          <p style={{ color: "var(--text)", fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto" }}>
            The cars you've saved for quick access. Pick up right where you left off and complete your booking.
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="auth-card" style={{ 
            maxWidth: "600px", 
            margin: "0 auto", 
            padding: "50px 30px", 
            textAlign: "center",
            border: "1px dashed rgba(255, 255, 255, 0.2)",
            background: "transparent",
            boxShadow: "none"
          }}>
            <span style={{ fontSize: "4rem", display: "block", marginBottom: "20px", opacity: 0.5 }}></span>
            <h2 style={{ color: "var(--text)", marginBottom: "10px", fontSize: "1.8rem" }}>No favorites yet</h2>
            <p style={{ color: "var(--text)", fontSize: "1.1rem", marginBottom: "30px" }}>
              Explore our fleet and click the heart icon on any car to save it here for later.
            </p>
            <button 
              className="auth-btn"
              onClick={() => navigate("/home")}
              style={{ maxWidth: "250px", background: "var(--text)" }}
            >
              Explore Cars
            </button>
          </div>
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
            gap: "30px",
            paddingBottom: "50px"
          }}>
            {favorites.map((car, index) => (
              <div key={index} className="auth-card" style={{ 
                padding: "20px", 
                position: "relative",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 15px 30px var(--glass-bg)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(15, 23, 42, 0.3)'; }}
              >
                
                {/* Heart Icon to Remove */}
                <div 
                  onClick={() => removeFavorite(car.name)}
                  style={{ 
                    position: "absolute", 
                    top: "15px", 
                    right: "15px", 
                    background: "#ffe4e6", 
                    borderRadius: "50%", 
                    width: "40px", 
                    height: "40px", 
                    display: "flex", 
                    justifyContent: "center", 
                    alignItems: "center", 
                    cursor: "pointer",
                    zIndex: 10,
                    backdropFilter: "blur(5px)",
                    border: "1px solid #fecdd3",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#fecdd3"; e.currentTarget.style.transform = "scale(1.1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#ffe4e6"; e.currentTarget.style.transform = "scale(1)"; }}
                  title="Remove from favorites"
                >
                  ️
                </div>

                {/* Car Image */}
                <div style={{
                  background: "var(--text)",
                  borderRadius: "16px",
                  padding: "15px",
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "200px"
                }}>
                  {car.image ? (
                    <img 
                      src={car.image} 
                      alt={car.name} 
                      style={{ width: "100%", maxHeight: "100%", objectFit: "contain", filter: "drop-shadow(0 10px 15px rgba(15, 23, 42, 0.4))" }} 
                    />
                  ) : (
                    <span style={{ fontSize: "4rem" }}></span>
                  )}
                </div>

                {/* Details */}
                <h2 style={{ color: "var(--text)", margin: "0 0 5px 0", fontSize: "1.5rem" }}>{car.name}</h2>
                <div style={{ color: "var(--text)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "15px" }}>
                  {car.brand || "DriveSphere"}
                </div>

                <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
                  <span style={{ background: "var(--bg-card)", padding: "5px 12px", borderRadius: "8px", fontSize: "0.85rem", color: "var(--text)" }}> {car.fuel || "Petrol"}</span>
                  <span style={{ background: "var(--bg-card)", padding: "5px 12px", borderRadius: "8px", fontSize: "0.85rem", color: "var(--text)" }}> {car.location || "Bangalore"}</span>
                </div>

                <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "15px", borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
                  <div>
                    <span style={{ color: "var(--text)", fontSize: "0.8rem", textTransform: "uppercase" }}>Price</span>
                    <h3 style={{ color: "var(--text)", margin: "2px 0 0 0", fontSize: "1.4rem" }}>₹{car.price}<span style={{ fontSize: "0.9rem", color: "var(--text)" }}>/day</span></h3>
                  </div>
                  <button 
                    onClick={() => navigate("/booking", { state: { car } })}
                    style={{
                      background: "var(--accent-bg)",
                      color: "var(--text)",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "10px",
                      fontWeight: "700",
                      cursor: "pointer",
                      boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)"
                    }}
                  >
                    Book 
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;