import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BackButton from "../components/BackButton";
import "./Auth.css";

function Booking() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const selectedCar = state?.car || {
    name: "",
    price: "",
    image: null
  };

  const [formData, setFormData] = useState({
    name: "",
    carName: selectedCar.name,
    fromDate: "",
    toDate: "",
    pickup: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleBooking = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.carName ||
      !formData.fromDate ||
      !formData.toDate ||
      !formData.pickup
    ) {
      setError("Please fill in all booking details to continue.");
      return;
    }

    const oldBookings = JSON.parse(localStorage.getItem("bookings")) || [];

    localStorage.setItem(
      "bookings",
      JSON.stringify([...oldBookings, formData])
    );

    navigate("/license-verification", { state: { booking: formData, car: selectedCar } });
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
        maxWidth: "1100px",
        padding: "20px",
        justifyContent: "center"
      }}>
        
        {/* Left Side: Info & Summary */}
        <div style={{ flex: "1 1 400px", maxWidth: "500px", textAlign: "left", display: "flex", flexDirection: "column", gap: "25px" }}>
          <div>
            <span style={{ 
              background: "rgba(59, 130, 246, 0.2)", 
              color: "var(--text)", 
              padding: "8px 16px", 
              borderRadius: "20px",
              display: "inline-block",
              fontWeight: "700",
              fontSize: "0.85rem",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "15px",
              border: "1px solid rgba(59, 130, 246, 0.3)"
            }}>
              Step 1 of 4
            </span>
            <h1 style={{ 
              fontSize: "3.5rem", 
              fontWeight: "900", 
              color: "var(--text)", 
              marginBottom: "15px",
              lineHeight: "1.2"
            }}>
              Book Your Car
            </h1>
            <p style={{ 
              fontSize: "1.1rem", 
              color: "var(--text)", 
              lineHeight: "1.6",
            }}>
              Complete your booking details below. After this, you will verify your driving license, accept the rental terms, complete your payment, and instantly receive your receipt.
            </p>
          </div>

          {selectedCar.image && (
            <div style={{
              background: "var(--bg-card)",
              borderRadius: "20px",
              padding: "20px",
              border: "1px solid var(--border)",
              textAlign: "center"
            }}>
              <img src={selectedCar.image} alt="Selected Car" style={{ width: "100%", maxWidth: "300px", filter: "drop-shadow(0 10px 15px var(--glass-bg))" }} />
              <h3 style={{ color: "var(--text)", margin: "15px 0 5px 0", fontSize: "1.5rem" }}>{selectedCar.name}</h3>
              <p style={{ color: "var(--text)", fontWeight: "bold", fontSize: "1.2rem", margin: 0 }}>{selectedCar.price}</p>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px", background: "var(--bg-card)", padding: "12px 20px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
              <span style={{ fontSize: "1.5rem" }}></span>
              <span style={{ color: "var(--text)", fontWeight: "600" }}>Flexible Rentals</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "15px", background: "var(--bg-card)", padding: "12px 20px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
              <span style={{ fontSize: "1.5rem" }}>🪪</span>
              <span style={{ color: "var(--text)", fontWeight: "600" }}>License Verification</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "15px", background: "var(--bg-card)", padding: "12px 20px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
              <span style={{ fontSize: "1.5rem" }}></span>
              <span style={{ color: "var(--text)", fontWeight: "600" }}>Secure Payment</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div style={{ flex: "1 1 400px", maxWidth: "500px" }}>
          <form className="auth-card" onSubmit={handleBooking} style={{ padding: "40px", width: "100%" }}>
            <h2 style={{ color: "var(--text)", marginBottom: "30px", textAlign: "center", fontSize: "1.8rem", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "15px" }}>
              Booking Details
            </h2>

            {error && (
              <div style={{
                background: "var(--accent-bg)",
                color: "var(--text)",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "20px",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                textAlign: "center",
                fontSize: "0.95rem"
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: "20px", textAlign: "left" }}>
              <label style={{ display: "block", color: "var(--text)", marginBottom: "8px", fontSize: "0.95rem", fontWeight: "600" }}>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                style={{
                  width: "100%", padding: "14px", background: "var(--bg-card)",
                  border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text)", outline: "none", fontSize: "1rem"
                }}
              />
            </div>

            <div style={{ marginBottom: "20px", textAlign: "left" }}>
              <label style={{ display: "block", color: "var(--text)", marginBottom: "8px", fontSize: "0.95rem", fontWeight: "600" }}>Selected Car</label>
              <input
                type="text"
                name="carName"
                placeholder="E.g. Hyundai Creta"
                value={formData.carName}
                onChange={handleChange}
                style={{
                  width: "100%", padding: "14px", background: "var(--bg-card)",
                  border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text)", outline: "none", fontSize: "1rem"
                }}
              />
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", marginBottom: "20px" }}>
              <div style={{ flex: "1 1 200px", textAlign: "left" }}>
                <label style={{ display: "block", color: "var(--text)", marginBottom: "8px", fontSize: "0.95rem", fontWeight: "600" }}>From Date & Time</label>
                <input
                  type="datetime-local"
                  name="fromDate"
                  value={formData.fromDate}
                  onChange={handleChange}
                  style={{
                    width: "100%", padding: "14px", background: "var(--bg-card)",
                    border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text)", outline: "none", fontSize: "1rem"
                  }}
                />
              </div>
              <div style={{ flex: "1 1 200px", textAlign: "left" }}>
                <label style={{ display: "block", color: "var(--text)", marginBottom: "8px", fontSize: "0.95rem", fontWeight: "600" }}>To Date & Time</label>
                <input
                  type="datetime-local"
                  name="toDate"
                  value={formData.toDate}
                  onChange={handleChange}
                  style={{
                    width: "100%", padding: "14px", background: "var(--bg-card)",
                    border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text)", outline: "none", fontSize: "1rem"
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "35px", textAlign: "left" }}>
              <label style={{ display: "block", color: "var(--text)", marginBottom: "8px", fontSize: "0.95rem", fontWeight: "600" }}>Pickup Location</label>
              <select
                name="pickup"
                value={formData.pickup}
                onChange={handleChange}
                style={{
                  width: "100%", padding: "14px", background: "var(--bg-card)",
                  border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text)", outline: "none", fontSize: "1rem"
                }}
              >
                <option value="" disabled>Select a pickup center in Bengaluru</option>
                <option value="Yelahanka">Yelahanka</option>
                <option value="Electronic City">Electronic City</option>
                <option value="Indiranagar">Indiranagar</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="auth-btn"
              style={{
                background: "var(--text)",
                boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)",
              }}
            >
              Continue to License Verification 
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Booking;