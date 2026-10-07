import { useState } from "react";
import BackButton from "../components/BackButton";
import "./Auth.css";

function DamageDetection() {
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [afterFile, setAfterFile] = useState(null);
  const [selectedCar, setSelectedCar] = useState("Hyundai Creta"); // Default
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleBeforeUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setBeforeImage(URL.createObjectURL(e.target.files[0]));
      setError("");
    }
  };

  const handleAfterUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAfterFile(e.target.files[0]);
      setAfterImage(URL.createObjectURL(e.target.files[0]));
      setError("");
    }
  };

  const checkDamage = async () => {
    if (!beforeImage || !afterImage || !afterFile) {
      setError("Please upload both 'Before' and 'After' images to run the scan.");
      return;
    }

    setIsScanning(true);
    setResult(null);

    const formData = new FormData();
    formData.append("image", afterFile);
    formData.append("selectedCar", selectedCar);

    try {
      const response = await fetch("http://localhost:5000/api/analyze-damage", {
        method: "POST",
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze image");
      }
      
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Vision AI analysis failed. Ensure backend and Gemini API are configured correctly.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="auth-page" style={{ alignItems: "center", paddingTop: "80px", overflowY: "auto" }}>
      <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 10 }}>
        <BackButton />
      </div>

      <div style={{
        width: "100%",
        maxWidth: "1000px",
        padding: "20px",
        textAlign: "center"
      }}>
        <div style={{ marginBottom: "40px" }}>
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
            AI Vision Intelligence
          </span>
          <h1 style={{ fontSize: "3rem", fontWeight: "900", color: "var(--text)", marginBottom: "15px" }}>Automated Damage Detection</h1>
          <p style={{ color: "var(--text)", fontSize: "1.1rem", maxWidth: "700px", margin: "0 auto" }}>
            Upload before and after photos of your rental. Our advanced AI will analyze the images, identify new damages specific to the car model, and estimate repair costs instantly.
          </p>
        </div>

        {/* Vehicle Selection */}
        <div style={{ marginBottom: "30px", textAlign: "left", maxWidth: "600px", margin: "0 auto 30px auto" }}>
          <label style={{ display: "block", color: "var(--text)", marginBottom: "8px", fontWeight: "600" }}>Select Vehicle being Returned:</label>
          <select 
            value={selectedCar} 
            onChange={(e) => setSelectedCar(e.target.value)}
            style={{
              width: "100%", padding: "14px", background: "var(--bg-card)",
              border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text)", outline: "none",
              fontSize: "1rem", appearance: "none", cursor: "pointer", boxShadow: "0 2px 5px rgba(15, 23, 42, 0.02)"
            }}
          >
            <optgroup label="Budget & Hatchbacks">
              <option value="Maruti Alto">Maruti Alto</option>
              <option value="Renault Kwid">Renault Kwid</option>
              <option value="Tata Tiago">Tata Tiago</option>
            </optgroup>
            <optgroup label="Mid-Range Sedans & SUVs">
              <option value="Hyundai Creta">Hyundai Creta</option>
              <option value="Honda City">Honda City</option>
              <option value="Kia Seltos">Kia Seltos</option>
            </optgroup>
            <optgroup label="Premium & Luxury">
              <option value="Toyota Innova">Toyota Innova</option>
              <option value="Mahindra Thar">Mahindra Thar</option>
              <option value="BMW X5">BMW X5</option>
              <option value="Audi A4">Audi A4</option>
              <option value="Mercedes GLC">Mercedes GLC</option>
              <option value="Range Rover">Range Rover</option>
            </optgroup>
          </select>
        </div>

        {error && (
          <div style={{
            background: "var(--accent-bg)", color: "var(--text)", padding: "12px", 
            borderRadius: "8px", marginBottom: "30px", border: "1px solid rgba(59, 130, 246, 0.3)", maxWidth: "500px", margin: "0 auto 30px auto"
          }}>
            {error}
          </div>
        )}

        <div style={{
          display: "flex",
          gap: "30px",
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: "40px"
        }}>
          {/* Before Upload */}
          <div className="auth-card" style={{ flex: "1 1 300px", maxWidth: "400px", padding: "30px", position: "relative" }}>
            <h3 style={{ color: "var(--text)", marginBottom: "20px", fontSize: "1.4rem" }}>Before Trip</h3>
            <label style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              height: "250px", border: "2px dashed rgba(255, 255, 255, 0.2)", borderRadius: "16px",
              background: beforeImage ? "transparent" : "var(--glass-bg)", cursor: "pointer",
              transition: "all 0.3s ease", position: "relative", overflow: "hidden"
            }}>
              <input type="file" style={{ display: "none" }} accept="image/*" onChange={handleBeforeUpload} />
              {beforeImage ? (
                <img src={beforeImage} alt="Before" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ color: "var(--text)", textAlign: "center" }}>
                  <span style={{ fontSize: "3rem", display: "block", marginBottom: "10px" }}></span>
                  <span>Click to upload original photo</span>
                </div>
              )}
            </label>
          </div>

          {/* After Upload */}
          <div className="auth-card" style={{ flex: "1 1 300px", maxWidth: "400px", padding: "30px", position: "relative" }}>
            <h3 style={{ color: "var(--text)", marginBottom: "20px", fontSize: "1.4rem" }}>After Trip</h3>
            <label style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              height: "250px", border: "2px dashed rgba(255, 255, 255, 0.2)", borderRadius: "16px",
              background: afterImage ? "transparent" : "var(--glass-bg)", cursor: "pointer",
              transition: "all 0.3s ease", position: "relative", overflow: "hidden"
            }}>
              <input type="file" style={{ display: "none" }} accept="image/*" onChange={handleAfterUpload} />
              {afterImage ? (
                <img src={afterImage} alt="After" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ color: "var(--text)", textAlign: "center" }}>
                  <span style={{ fontSize: "3rem", display: "block", marginBottom: "10px" }}></span>
                  <span>Click to upload returning photo</span>
                </div>
              )}
              {isScanning && (
                <div style={{
                  position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                  background: "rgba(59, 130, 246, 0.2)", zIndex: 10, animation: "scan 1.5s infinite linear"
                }} />
              )}
            </label>
          </div>
        </div>

        <button 
          className="auth-btn" 
          onClick={checkDamage}
          disabled={isScanning}
          style={{
            maxWidth: "300px",
            background: isScanning ? "var(--accent)" : "linear-gradient(135deg, var(--accent), var(--text))",
            boxShadow: isScanning ? "none" : "0 4px 15px rgba(59, 130, 246, 0.4)"
          }}
        >
          {isScanning ? "Running AI Scan..." : "Run Damage Analysis "}
        </button>

        {/* Results */}
        {result && (
          <div style={{
            marginTop: "50px",
            background: "var(--bg-card)",
            border: "1px solid rgba(59, 130, 246, 0.4)",
            borderRadius: "20px",
            padding: "30px",
            textAlign: "left",
            maxWidth: "800px",
            margin: "50px auto 0 auto",
            animation: "fadeInUp 0.5s ease forwards",
            boxShadow: "0 4px 6px rgba(15, 23, 42, 0.05)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "15px" }}>
              <h3 style={{ color: "var(--text)", fontSize: "1.8rem", margin: 0 }}>Analysis Report</h3>
              <span style={{ background: "rgba(59, 130, 246, 0.2)", color: "var(--text)", padding: "6px 14px", borderRadius: "20px", fontWeight: "700", border: "1px solid rgba(59, 130, 246, 0.3)" }}>
                {result.status}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "20px" }}>
              <div>
                <p style={{ color: "var(--text)", fontSize: "0.9rem", margin: "0 0 5px 0", textTransform: "uppercase" }}>AI Confidence</p>
                <p style={{ color: "var(--text)", fontSize: "1.5rem", fontWeight: "700", margin: 0 }}>{result.confidence}</p>
              </div>
              <div>
                <p style={{ color: "var(--text)", fontSize: "0.9rem", margin: "0 0 5px 0", textTransform: "uppercase" }}>Severity Level</p>
                <p style={{ color: "var(--text)", fontSize: "1.5rem", fontWeight: "700", margin: 0 }}>{result.severity}</p>
              </div>
              <div>
                <p style={{ color: "var(--text)", fontSize: "0.9rem", margin: "0 0 5px 0", textTransform: "uppercase" }}>Est. Repair Cost</p>
                <p style={{ color: "var(--text)", fontSize: "1.5rem", fontWeight: "700", margin: 0 }}>{result.estimatedCost}</p>
              </div>
            </div>

            <div style={{ background: "var(--bg-card)", padding: "20px", borderRadius: "12px" }}>
              <p style={{ color: "var(--text)", fontSize: "0.9rem", margin: "0 0 8px 0", textTransform: "uppercase" }}>Detection Details</p>
              <p style={{ color: "var(--text)", fontSize: "1.1rem", margin: 0, lineHeight: "1.5" }}>{result.details}</p>
            </div>
          </div>
        )}

      </div>
      
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default DamageDetection;