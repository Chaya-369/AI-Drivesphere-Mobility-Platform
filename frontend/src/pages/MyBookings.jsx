import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import "./Auth.css";

function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const savedBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    setBookings(savedBookings);
  }, []);

  return (
    <div className="auth-page" style={{ alignItems: "center", paddingTop: "80px", overflowY: "auto", minHeight: "100vh" }}>
      <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 10 }}>
        <BackButton />
      </div>

      <div style={{ width: "100%", maxWidth: "1200px", padding: "20px" }}>
        
        {/* Header */}
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
            border: "1px solid var(--border)"
          }}>
            Trip History
          </span>
          <h1 style={{ 
            fontSize: "3.5rem", 
            fontWeight: "900", 
            color: "var(--text)", 
            marginBottom: "10px",
            lineHeight: "1.2"
          }}>
            My Bookings
          </h1>
          <p style={{ color: "var(--text)", fontSize: "1.1rem" }}>
            View and manage your upcoming rentals and past trips.
          </p>
        </div>

        {/* Empty State */}
        {bookings.length === 0 ? (
          <div className="auth-card" style={{ maxWidth: "600px", margin: "0 auto", padding: "50px", textAlign: "center", background: "var(--bg-card)" }}>
            <div style={{ fontSize: "5rem", marginBottom: "20px", filter: "drop-shadow(0 4px 10px var(--glass-bg))" }}></div>
            <h2 style={{ color: "var(--text)", fontSize: "2rem", marginBottom: "15px" }}>No Bookings Yet</h2>
            <p style={{ color: "var(--text)", fontSize: "1.1rem", marginBottom: "30px" }}>
              You haven't booked any vehicles. Ready for your next adventure?
            </p>
            <button 
              className="auth-btn" 
              onClick={() => navigate("/home")}
              style={{
                background: "var(--text)",
                boxShadow: "0 4px 6px rgba(15, 23, 42, 0.05)",
                maxWidth: "250px",
                margin: "0 auto"
              }}
            >
              Browse Fleet 
            </button>
          </div>
        ) : (
          /* Bookings Grid */
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "30px"
          }}>
            {bookings.map((booking, index) => (
              <div 
                key={index} 
                className="auth-card" 
                style={{ 
                  maxWidth: "100%", 
                  padding: "0", 
                  background: "var(--bg-card)", 
                  border: "1px solid var(--border)",
                  overflow: "hidden",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                {/* Status Banner */}
                <div style={{ 
                  background: "var(--accent-bg)", 
                  borderBottom: "1px solid var(--border)",
                  padding: "15px 25px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <span style={{ color: "var(--text)", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.95rem" }}>
                    <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 10px var(--accent)" }}></span>
                    Confirmed
                  </span>
                  <span style={{ color: "var(--text)", fontSize: "0.85rem", textTransform: "uppercase" }}>Booking #{1000 + index}</span>
                </div>

                {/* Car & Customer Info */}
                <div style={{ padding: "25px" }}>
                  <h2 style={{ color: "var(--text)", fontSize: "1.6rem", margin: "0 0 5px 0", display: "flex", alignItems: "center", gap: "10px" }}>
                     {booking.carName}
                  </h2>
                  <p style={{ color: "var(--text)", margin: "0 0 20px 0", fontSize: "0.95rem" }}>Booked by {booking.name}</p>

                  {/* Booking Details Grid */}
                  <div style={{ background: "var(--bg-card)", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.05)", padding: "15px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
                    <div>
                      <p style={{ margin: "0 0 5px 0", color: "var(--text)", fontSize: "0.8rem", textTransform: "uppercase" }}>Pickup Location</p>
                      <p style={{ margin: 0, color: "var(--text)", fontWeight: "600", fontSize: "0.95rem" }}>{booking.pickup}</p>
                    </div>
                    <div>
                      <p style={{ margin: "0 0 5px 0", color: "var(--text)", fontSize: "0.8rem", textTransform: "uppercase" }}>Duration</p>
                      <p style={{ margin: 0, color: "var(--text)", fontWeight: "600", fontSize: "0.95rem" }}>
                        {booking.fromDate} <br /> 
                        <span style={{ color: "var(--text)", fontSize: "0.85rem" }}>to</span> <br /> 
                        {booking.toDate}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "10px", marginTop: "auto" }}>
                    <button 
                      onClick={() => navigate("/invoice")}
                      style={{ 
                        flex: 1, padding: "12px", background: "var(--bg-card)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: "8px", cursor: "pointer", fontWeight: "600", transition: "all 0.3s"
                      }}
                      onMouseEnter={(e) => e.target.style.background = "var(--accent-bg)"}
                      onMouseLeave={(e) => e.target.style.background = "var(--bg-card)"}
                    >
                      View Invoice
                    </button>
                    <button 
                      onClick={() => navigate("/live-tracking")}
                      style={{ 
                        flex: 1, padding: "12px", background: "var(--accent-bg)", color: "var(--text)", border: "1px solid rgba(59, 130, 246, 0.3)", borderRadius: "8px", cursor: "pointer", fontWeight: "600", transition: "all 0.3s"
                      }}
                      onMouseEnter={(e) => e.target.style.background = "rgba(59, 130, 246, 0.2)"}
                      onMouseLeave={(e) => e.target.style.background = "var(--accent-bg)"}
                    >
                      Live Tracking
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;