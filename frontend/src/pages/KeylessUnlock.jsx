import { useState, useEffect } from "react";
import axios from "axios";
import BackButton from "../components/BackButton";
import "./Auth.css";

function KeylessUnlock() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState("Locked"); // Locked, Generated, Unlocked, Denied
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const generateOtp = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/send-otp", {
        phoneNumber: phoneNumber
      });
      setStatus("Generated");
      if (response.data.message.includes("Twilio not configured")) {
        // Fallback or info for dev
        console.log("OTP printed to backend console.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please check backend connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const unlockCar = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) return;

    setIsVerifying(true);
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/verify-otp", {
        phoneNumber: phoneNumber,
        otp: enteredOtp
      });
      if (response.data.success) {
        setStatus("Unlocked");
      } else {
        setStatus("Denied");
      }
    } catch (error) {
      setStatus("Denied");
    } finally {
      setIsVerifying(false);
    }
  };

  // Helper colors
  const getStatusColor = () => {
    switch (status) {
      case "Unlocked": return "var(--accent)"; // Green
      case "Denied": return "var(--accent)"; // Red
      case "Generated": return "var(--accent)"; // Blue
      default: return "var(--accent)"; // Gray
    }
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
        display: "flex",
        flexWrap: "wrap",
        gap: "50px",
        alignItems: "center",
        justifyContent: "center"
      }}>
        
        {/* Left Info Section */}
        <div style={{ flex: "1 1 400px", maxWidth: "500px" }}>
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
            Smart Access
          </span>
          <h1 style={{ 
            fontSize: "3.5rem", 
            fontWeight: "900", 
            color: "var(--text)", 
            marginBottom: "20px",
            lineHeight: "1.2"
          }}>
            Keyless<br />Unlock
          </h1>
          <p style={{ color: "var(--text)", fontSize: "1.2rem", marginBottom: "40px", lineHeight: "1.6" }}>
            Experience the future of car rentals. Instantly unlock your booked vehicle directly from your smartphone using a secure, time-sensitive OTP. No physical keys required.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px", background: "var(--bg-card)", padding: "15px 20px", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
              <div style={{ fontSize: "1.8rem" }}></div>
              <div style={{ color: "var(--text)", fontWeight: "600", fontSize: "1.1rem" }}>Military-grade encryption</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "15px", background: "var(--bg-card)", padding: "15px 20px", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
              <div style={{ fontSize: "1.8rem" }}></div>
              <div style={{ color: "var(--text)", fontWeight: "600", fontSize: "1.1rem" }}>Zero hardware handoffs</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "15px", background: "var(--bg-card)", padding: "15px 20px", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
              <div style={{ fontSize: "1.8rem" }}></div>
              <div style={{ color: "var(--text)", fontWeight: "600", fontSize: "1.1rem" }}>Instant digital access</div>
            </div>
          </div>
        </div>

        {/* Right Interaction Card */}
        <div className="auth-card" style={{ 
          flex: "1 1 400px", 
          maxWidth: "450px", 
          padding: "40px", 
          textAlign: "center",
          background: "var(--bg-card)",
          border: `1px solid ${getStatusColor()}55`,
          boxShadow: `0 25px 50px -12px var(--glass-bg), 0 0 30px ${getStatusColor()}22`,
          position: "relative",
          overflow: "hidden",
          transition: "all 0.5s ease"
        }}>
          
          {/* Animated Lock Icon */}
          <div style={{
            width: "120px",
            height: "120px",
            margin: "0 auto 30px auto",
            background: `linear-gradient(135deg, ${getStatusColor()}22, transparent)`,
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "4rem",
            border: `2px solid ${getStatusColor()}66`,
            boxShadow: `0 0 40px ${getStatusColor()}44`,
            transition: "all 0.5s ease",
            animation: (isGenerating || isVerifying) ? "pulse 1.5s infinite" : "none"
          }}>
            {status === "Unlocked" ? "" : (status === "Denied" ? "" : "")}
          </div>

          <h2 style={{ color: "var(--text)", fontSize: "1.8rem", marginBottom: "10px", transition: "color 0.3s" }}>
            {status === "Locked" ? "Vehicle Locked" : 
             status === "Generated" ? "Enter OTP to Unlock" : 
             status === "Unlocked" ? "Access Granted" : "Access Denied"}
          </h2>
          
          <p style={{ color: "var(--text)", marginBottom: "40px", fontSize: "1rem" }}>
            {status === "Locked" && "Enter your registered phone number to request a secure OTP for your booked vehicle."}
            {status === "Generated" && `Your unique access code has been securely sent to ${phoneNumber}.`}
            {status === "Unlocked" && "Vehicle is unlocked. Have a safe and pleasant journey!"}
            {status === "Denied" && "The OTP entered was incorrect. Please request a new one."}
          </p>



          {status === "Locked" || status === "Denied" ? (
            <div style={{ width: "100%" }}>
              <input
                type="tel"
                placeholder="Enter Mobile Number (+91)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={{
                  width: "100%", padding: "15px", marginBottom: "20px", fontSize: "1.1rem",
                  borderRadius: "12px", border: "1px solid var(--border)", outline: "none", background: "var(--bg-card)"
                }}
              />
              <button 
                className="auth-btn" 
                onClick={generateOtp}
                disabled={isGenerating || phoneNumber.length < 10}
                style={{
                  background: "var(--text)",
                  boxShadow: "0 4px 6px rgba(15, 23, 42, 0.05)",
                  maxWidth: "100%",
                  opacity: (isGenerating || phoneNumber.length < 10) ? 0.7 : 1,
                  cursor: (isGenerating || phoneNumber.length < 10) ? "not-allowed" : "pointer"
                }}
              >
                {isGenerating ? "Sending OTP..." : "Send OTP"}
              </button>
            </div>
          ) : status === "Unlocked" ? (
            <button 
              className="auth-btn" 
              onClick={() => {
                setStatus("Locked");
                setGeneratedOtp("");
                setOtp(["", "", "", "", "", ""]);
              }}
              style={{
                background: "var(--text)",
                boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)",
                maxWidth: "100%"
              }}
            >
              Lock Vehicle
            </button>
          ) : (
            <div>
              {/* OTP Input Grid */}
              <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "30px" }}>
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onFocus={(e) => e.target.select()}
                    style={{
                      width: "45px",
                      height: "55px",
                      fontSize: "1.5rem",
                      textAlign: "center",
                      background: "var(--bg-card)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "12px",
                      color: "var(--text)",
                      fontWeight: "700",
                      outline: "none",
                      transition: "border 0.3s, box-shadow 0.3s"
                    }}
                    onFocusCapture={(e) => {
                      e.target.style.border = "1px solid var(--accent)";
                      e.target.style.boxShadow = "0 0 10px rgba(59, 130, 246, 0.3)";
                    }}
                    onBlurCapture={(e) => {
                      e.target.style.border = "1px solid rgba(255, 255, 255, 0.2)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                ))}
              </div>

              <button 
                className="auth-btn" 
                onClick={unlockCar}
                disabled={isVerifying}
                style={{
                  background: "var(--text)",
                  boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)",
                  maxWidth: "100%",
                  opacity: isVerifying ? 0.7 : 1
                }}
              >
                {isVerifying ? "Verifying..." : "Verify & Unlock"}
              </button>
            </div>
          )}

          {/* Context Data */}
          <div style={{ 
            marginTop: "30px", 
            paddingTop: "20px", 
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            justifyContent: "space-between",
            textAlign: "left"
          }}>
            <div>
              <p style={{ color: "var(--text)", fontSize: "0.8rem", textTransform: "uppercase", margin: "0 0 5px 0" }}>Target Vehicle</p>
              <p style={{ color: "var(--text)", fontSize: "1rem", fontWeight: "600", margin: 0 }}>Hyundai Creta</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: "var(--text)", fontSize: "0.8rem", textTransform: "uppercase", margin: "0 0 5px 0" }}>Connection</p>
              <p style={{ color: "var(--text)", fontSize: "1rem", fontWeight: "600", margin: 0 }}>● Secure</p>
            </div>
          </div>

        </div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.2); }
          70% { box-shadow: 0 0 0 20px rgba(255, 255, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
        }
      `}</style>
    </div>
  );
}

export default KeylessUnlock;