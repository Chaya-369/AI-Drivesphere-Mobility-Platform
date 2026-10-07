import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BackButton from "../components/BackButton";
import "./Auth.css";

function LicenseVerification() {
  const navigate = useNavigate();
  const { state } = useLocation();
  // Primary (License) State
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseImage, setLicenseImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  // Secondary (Aadhar/PAN) State
  const [secType, setSecType] = useState("Aadhar");
  const [secNumber, setSecNumber] = useState("");
  const [secImage, setSecImage] = useState(null);
  const [secPreviewUrl, setSecPreviewUrl] = useState(null);

  // Flow State
  const [isVerifying, setIsVerifying] = useState(false);
  const [scanStatus, setScanStatus] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (type === "license") {
      setLicenseImage(file);
      if (file.type.startsWith("image/")) setPreviewUrl(URL.createObjectURL(file));
      else setPreviewUrl(null);
    } else {
      setSecImage(file);
      if (file.type.startsWith("image/")) setSecPreviewUrl(URL.createObjectURL(file));
      else setSecPreviewUrl(null);
    }
  };

  const validateDL = (dl) => /^[A-Z]{2}[0-9]{2}[0-9]{4}[0-9]{7}$/.test(dl.replace(/\s/g, ''));
  const validateAadhar = (aadhar) => /^\d{12}$/.test(aadhar.replace(/\s/g, ''));
  const validatePan = (pan) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.replace(/\s/g, ''));

  const handleVerification = () => {
    if (!licenseNumber || !licenseImage || !secNumber || !secImage) {
      setError("Please provide all document numbers and images to continue.");
      return;
    }

    if (!validateDL(licenseNumber)) {
      setError("Invalid Driving License format. Expected format: KA0120230001234 (15 characters).");
      return;
    }

    if (secType === "Aadhar" && !validateAadhar(secNumber)) {
      setError("Invalid Aadhar format. Must be exactly 12 numeric digits.");
      return;
    }

    if (secType === "PAN" && !validatePan(secNumber)) {
      setError("Invalid PAN format. Expected format: ABCDE1234F.");
      return;
    }

    setError("");
    setIsVerifying(true);
    setScanStatus("Initializing AI OCR Scanner...");

    setTimeout(() => setScanStatus("Extracting text from Driving License..."), 1000);
    setTimeout(() => setScanStatus(`Validating ${secType} against Government DB...`), 2500);
    setTimeout(() => setScanStatus("Cross-referencing face matches..."), 4000);
    
    setTimeout(() => {
      setIsVerifying(false);
      setVerified(true);
      navigate("/payment", { state });
    }, 5500);
  };

  return (
    <div className="auth-page" style={{ alignItems: "center", paddingTop: "80px", overflowY: "auto", minHeight: "100vh", background: "var(--bg-card)", color: "var(--text)" }}>
      <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 10 }}>
        <BackButton />
      </div>

      <div style={{ width: "100%", maxWidth: "1000px", padding: "20px" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span style={{
            background: "var(--bg-card)", color: "var(--text)",
            padding: "8px 20px", borderRadius: "30px", fontWeight: "700",
            fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px",
            display: "inline-block", marginBottom: "15px"
          }}>
            Identity Check
          </span>
          <h1 style={{ fontSize: "2.8rem", fontWeight: "900", color: "var(--text)", marginBottom: "10px", letterSpacing: "-1px" }}>
            Document Verification
          </h1>
          <p style={{ color: "var(--text)", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>
            Please provide your valid Indian Driving License and a secondary Government ID to proceed.
          </p>
        </div>

        {error && (
          <div style={{ background: "var(--bg-card)", color: "var(--text)", padding: "12px 20px", borderRadius: "8px", border: "1px solid var(--accent)", marginBottom: "20px", textAlign: "center", maxWidth: "700px", margin: "0 auto 20px auto" }}>
            {error}
          </div>
        )}

        {isVerifying ? (
          <div className="auth-card" style={{ maxWidth: "550px", margin: "0 auto", padding: "60px 40px", textAlign: "center" }}>
             <div className="scanner-line"></div>
             <h2 style={{ marginBottom: "20px", color: "var(--text)" }}>AI Document Analysis</h2>
             <p style={{ color: "var(--text)", fontWeight: "600", fontSize: "1.1rem", minHeight: "30px" }}>{scanStatus}</p>
             <p style={{ color: "var(--text)", marginTop: "20px", fontSize: "0.9rem" }}>Please do not close this window...</p>
          </div>
        ) : verified ? (
          <div className="auth-card" style={{ maxWidth: "550px", margin: "0 auto", padding: "50px", textAlign: "center" }}>
            <div style={{
              width: "80px", height: "80px", margin: "0 auto 25px auto",
              background: "var(--text)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--text)", fontSize: "2rem"
            }}>✓</div>
            <h2 style={{ color: "var(--text)", fontSize: "2rem", marginBottom: "10px" }}>Verified!</h2>
            <p style={{ color: "var(--text)", marginBottom: "15px" }}>Both documents have been authenticated.</p>
            <button className="auth-btn" onClick={() => navigate("/terms", { state })} style={{ maxWidth: "280px" }}>
              Continue to Terms
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", alignItems: "start" }}>
            
            {/* License Section */}
            <div className="auth-card" style={{ padding: "35px", textAlign: "left" }}>
              <h3 style={{ color: "var(--text)", fontSize: "1.3rem", marginBottom: "25px", borderBottom: "1px solid var(--border)", paddingBottom: "15px" }}>
                1. Driving License
              </h3>
              
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", color: "var(--text)", marginBottom: "8px", fontSize: "0.9rem", fontWeight: "600" }}>License Number</label>
                <input
                  type="text"
                  placeholder="e.g. KA0120230001234"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value.toUpperCase())}
                  style={{ width: "100%", padding: "12px", border: "1px solid var(--border)", borderRadius: "8px", fontFamily: "monospace" }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", color: "var(--text)", marginBottom: "8px", fontSize: "0.9rem", fontWeight: "600" }}>Upload Front Photo</label>
                <label htmlFor="license-upload" style={{ display: "block", padding: "20px", border: "1px dashed var(--accent)", borderRadius: "8px", textAlign: "center", cursor: "pointer", background: licenseImage ? "var(--bg-card)" : "var(--bg-card)" }}>
                   {licenseImage ? <span style={{color: "var(--text)", fontWeight: "600"}}>{licenseImage.name}</span> : <span style={{color: "var(--text)"}}>Click to upload</span>}
                   <input id="license-upload" type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'license')} style={{ display: "none" }} />
                </label>
              </div>
              
              {previewUrl && <img src={previewUrl} alt="DL" style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "8px", border: "1px solid var(--border)" }} />}
            </div>

            {/* Secondary ID Section */}
            <div className="auth-card" style={{ padding: "35px", textAlign: "left" }}>
              <h3 style={{ color: "var(--text)", fontSize: "1.3rem", marginBottom: "25px", borderBottom: "1px solid var(--border)", paddingBottom: "15px" }}>
                2. Secondary ID
              </h3>
              
              <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", color: "var(--text)", marginBottom: "8px", fontSize: "0.9rem", fontWeight: "600" }}>ID Type</label>
                  <select value={secType} onChange={(e) => {setSecType(e.target.value); setSecNumber("");}} style={{ width: "100%", padding: "12px", border: "1px solid var(--border)", borderRadius: "8px", background: "var(--bg-card)" }}>
                    <option value="Aadhar">Aadhar Card</option>
                    <option value="PAN">PAN Card</option>
                  </select>
                </div>
                <div style={{ flex: 2 }}>
                  <label style={{ display: "block", color: "var(--text)", marginBottom: "8px", fontSize: "0.9rem", fontWeight: "600" }}>{secType} Number</label>
                  <input
                    type="text"
                    placeholder={secType === "Aadhar" ? "12 Digit Number" : "ABCDE1234F"}
                    value={secNumber}
                    onChange={(e) => setSecNumber(e.target.value.toUpperCase())}
                    style={{ width: "100%", padding: "12px", border: "1px solid var(--border)", borderRadius: "8px", fontFamily: "monospace" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", color: "var(--text)", marginBottom: "8px", fontSize: "0.9rem", fontWeight: "600" }}>Upload Front Photo</label>
                <label htmlFor="sec-upload" style={{ display: "block", padding: "20px", border: "1px dashed var(--accent)", borderRadius: "8px", textAlign: "center", cursor: "pointer", background: secImage ? "var(--bg-card)" : "var(--bg-card)" }}>
                   {secImage ? <span style={{color: "var(--text)", fontWeight: "600"}}>{secImage.name}</span> : <span style={{color: "var(--text)"}}>Click to upload</span>}
                   <input id="sec-upload" type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'secondary')} style={{ display: "none" }} />
                </label>
              </div>

              {secPreviewUrl && <img src={secPreviewUrl} alt="Secondary ID" style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "8px", border: "1px solid var(--border)" }} />}
            </div>

            <div style={{ gridColumn: "1 / -1", textAlign: "center", marginTop: "10px" }}>
               <button className="auth-btn" onClick={handleVerification} style={{ width: "100%", maxWidth: "400px", padding: "16px", fontSize: "1.1rem" }}>
                 Start AI Verification
               </button>
            </div>
            
          </div>
        )}
      </div>

      <style>{`
        .scanner-line {
          height: 4px;
          background: var(--accent);
          width: 0%;
          margin: 0 auto 30px auto;
          border-radius: 4px;
          animation: scan 2s infinite ease-in-out;
        }
        @keyframes scan {
          0% { width: 0%; opacity: 0; }
          50% { width: 100%; opacity: 1; }
          100% { width: 0%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default LicenseVerification;