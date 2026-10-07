import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Auth.css";

function Receipt() {
  const navigate = useNavigate();

  const { state } = useLocation();
  const booking = state?.booking || {
    userName: "Guest User",
    carName: "Selected Vehicle",
    pickupLocation: "Bengaluru Center",
    startDate: "N/A",
    endDate: "N/A",
    method: "N/A",
    amountPaid: "₹0",
    totalAmount: "₹0",
    bookingId: "PENDING",
  };

  return (
    <div className="auth-page" style={{ alignItems: "center", paddingTop: "80px", overflowY: "auto", minHeight: "100vh" }}>
      
      <div style={{ width: "100%", maxWidth: "650px", padding: "20px", margin: "0 auto" }}>
        
        <div className="auth-card" style={{ 
          maxWidth: "100%", 
          padding: "50px", 
          textAlign: "center",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          boxShadow: "0 4px 6px rgba(15, 23, 42, 0.05)",
          position: "relative",
          overflow: "hidden",
          animation: "fadeInUp 0.5s ease"
        }}>
          
          {/* Confetti / Glow Background */}
          <div style={{ position: "absolute", top: "-50px", left: "50%", transform: "translateX(-50%)", width: "200px", height: "200px", background: "var(--accent)", filter: "blur(100px)", opacity: 0.2, zIndex: 0 }}></div>

          <div style={{ position: "relative", zIndex: 1 }}>
            
            {/* Success Header */}
            <div style={{ 
              width: "100px", height: "100px", margin: "0 auto 20px auto", 
              background: "var(--bg-card)",
              borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center",
              border: "2px solid rgba(59, 130, 246, 0.5)", boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)"
            }}>
              <span style={{ fontSize: "3.5rem", animation: "bounceIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}></span>
            </div>

            <h1 style={{ color: "var(--text)", fontSize: "2.2rem", margin: "0 0 10px 0" }}>Booking Confirmed!</h1>
            <p style={{ color: "var(--text)", fontSize: "1.1rem", margin: "0 0 40px 0" }}>
              Thank you, {booking.userName}. Your payment was successful and your vehicle is secured.
            </p>

            {/* Receipt Details Ticket */}
            <div style={{ 
              background: "var(--bg)", 
              border: "1px dashed rgba(255, 255, 255, 0.15)", 
              borderRadius: "16px", 
              padding: "30px",
              textAlign: "left",
              marginBottom: "40px"
            }}>
              
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                <div>
                  <p style={{ color: "var(--text)", margin: "0 0 5px 0", fontSize: "0.85rem", textTransform: "uppercase" }}>Booking ID</p>
                  <p style={{ color: "var(--text)", margin: 0, fontWeight: "700", fontSize: "1.1rem", letterSpacing: "1px" }}>{booking.bookingId}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ color: "var(--text)", margin: "0 0 5px 0", fontSize: "0.85rem", textTransform: "uppercase" }}>Method</p>
                  <p style={{ color: "var(--text)", margin: 0, fontWeight: "600", fontSize: "1rem" }}>{booking.method}</p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
                <div>
                  <p style={{ color: "var(--text)", margin: "0 0 5px 0", fontSize: "0.85rem", textTransform: "uppercase" }}>Vehicle</p>
                  <p style={{ color: "var(--text)", margin: 0, fontWeight: "600", fontSize: "1.1rem" }}> {booking.carName}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ color: "var(--text)", margin: "0 0 5px 0", fontSize: "0.85rem", textTransform: "uppercase" }}>Location</p>
                  <p style={{ color: "var(--text)", margin: 0, fontWeight: "600", fontSize: "1.1rem" }}> {booking.pickupLocation}</p>
                </div>
              </div>

              <div style={{ background: "rgba(15, 23, 42, 0.3)", padding: "15px", borderRadius: "10px", marginBottom: "25px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <p style={{ color: "var(--text)", margin: "0 0 5px 0", fontSize: "0.8rem", textTransform: "uppercase" }}>From</p>
                  <p style={{ color: "var(--text)", margin: 0, fontWeight: "600" }}>{booking.startDate}</p>
                </div>
                <div style={{ color: "var(--text)", padding: "0 10px" }}>→</div>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <p style={{ color: "var(--text)", margin: "0 0 5px 0", fontSize: "0.8rem", textTransform: "uppercase" }}>To</p>
                  <p style={{ color: "var(--text)", margin: 0, fontWeight: "600" }}>{booking.endDate}</p>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "20px", borderTop: "1px dashed rgba(255, 255, 255, 0.15)" }}>
                <span style={{ color: "var(--text)", fontSize: "1.2rem", fontWeight: "600" }}>Amount Paid Today</span>
                <span style={{ color: "var(--text)", fontSize: "2rem", fontWeight: "900" }}>{booking.amountPaid}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                <span style={{ color: "var(--text)", fontSize: "0.9rem" }}>Total Booking Value</span>
                <span style={{ color: "var(--text)", fontSize: "1rem", fontWeight: "600" }}>{booking.totalAmount}</span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
              <button 
                onClick={() => navigate("/my-bookings")}
                style={{ 
                  flex: 1, padding: "15px", background: "var(--text)", 
                  color: "var(--text)", border: "none", borderRadius: "10px", cursor: "pointer", 
                  fontWeight: "700", transition: "all 0.3s", boxShadow: "0 4px 6px rgba(15, 23, 42, 0.05)"
                }}
                onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
                onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
              >
                View My Bookings
              </button>
              
              <button 
                onClick={() => navigate("/home")}
                style={{ 
                  flex: 1, padding: "15px", background: "var(--bg-card)", 
                  color: "var(--text)", border: "1px solid rgba(255, 255, 255, 0.2)", borderRadius: "10px", 
                  cursor: "pointer", fontWeight: "700", transition: "all 0.3s"
                }}
                onMouseEnter={(e) => e.target.style.background = "rgba(255, 255, 255, 0.1)"}
                onMouseLeave={(e) => e.target.style.background = "rgba(255, 255, 255, 0.05)"}
              >
                Back to Home
              </button>
            </div>
            
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounceIn {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default Receipt;