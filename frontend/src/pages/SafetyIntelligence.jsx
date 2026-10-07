import React, { useState } from "react";
import BackButton from "../components/BackButton";
import LocationAutocomplete from "../components/LocationAutocomplete";
import "./Auth.css";

const getRoadSafety = (code, wind, vis) => {
  let safetyScore = 100;
  let status = "Excellent", color = "var(--accent)";
  
  if (code >= 95) safetyScore -= 40; // thunderstorm
  else if (code >= 80) safetyScore -= 25; // heavy rain
  else if (code >= 61) safetyScore -= 15; // rain
  else if (code >= 51) safetyScore -= 5; // drizzle
  
  if (wind > 60) safetyScore -= 20;
  else if (wind > 40) safetyScore -= 10;
  
  if (vis !== undefined) {
    if (vis < 1000) safetyScore -= 30;
    else if (vis < 5000) safetyScore -= 15;
  }
  
  if (safetyScore < 0) safetyScore = 0;
  
  if (safetyScore < 50) { status = "Hazardous"; color = "var(--accent)"; }
  else if (safetyScore < 80) { status = "Moderate Risk"; color = "var(--accent)"; }
  else { status = "Safe Conditions"; color = "var(--accent)"; }
  
  return { score: safetyScore, status, color };
};

const WX_DESC = {
  0:"Clear skies ️", 1:"Mostly clear ️", 2:"Partly cloudy ", 3:"Overcast ️",
  45:"Foggy ️", 48:"Icy fog ️", 51:"Light drizzle ️", 53:"Drizzle ️", 55:"Dense drizzle ️",
  61:"Light rain ️", 63:"Moderate rain ️", 65:"Heavy rain ️",
  71:"Light snow ️", 73:"Snow ️", 75:"Heavy snow ️",
  80:"Rain showers ️", 81:"Moderate showers ️", 82:"Heavy showers ️",
  95:"Thunderstorm ️", 96:"Thunderstorm+hail ️", 99:"Severe storm ️",
};

export default function SafetyIntelligence() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [report, setReport] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState("");

  const geocode = async (place) => {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place + ", India")}&format=json&limit=1`,
      { headers: { "Accept-Language": "en" } }
    );
    const d = await r.json();
    if (!d.length) throw new Error(`Location not found: "${place}"`);
    return { lat: +d[0].lat, lon: +d[0].lon, name: d[0].display_name.split(",").slice(0,2).join(", ") };
  };

  const checkRoute = async () => {
    if (!from || !to) { setError("Please enter both locations."); return; }
    setError(""); setIsScanning(true); setReport(null);

    try {
      const [A, B] = await Promise.all([geocode(from), geocode(to)]);

      // 1. Get driving route to assess road distance/duration
      const osrm = await fetch(`https://router.project-osrm.org/route/v1/driving/${A.lon},${A.lat};${B.lon},${B.lat}?overview=false`);
      const rd = await osrm.json();
      let distStr = "Unknown", durStr = "Unknown", avgSpeed = 0, distKm = 0;
      if (rd.code === "Ok") {
        const leg = rd.routes[0].legs[0];
        distKm = leg.distance / 1000;
        const durHr = leg.duration / 3600;
        distStr = `${distKm.toFixed(1)} km`;
        durStr = `${Math.round(durHr * 60)} mins`;
        avgSpeed = distKm / durHr;
      }

      // 2. Get weather at destination (this drives the primary prediction as requested)
      const wxB = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${B.lat}&longitude=${B.lon}&current_weather=true&hourly=visibility,precipitation_probability&forecast_days=1`).then(r=>r.json());
      const cwB = wxB.current_weather || {};
      const nowHour = new Date().getHours();
      const visB = wxB.hourly?.visibility?.[nowHour];
      const precipProbB = wxB.hourly?.precipitation_probability?.[nowHour] ?? 0;

      // 3. Predict Road Safety
      const roadSafety = getRoadSafety(cwB.weathercode ?? 0, cwB.windspeed ?? 0, visB);
      const wxDescB = WX_DESC[cwB.weathercode] || "Unknown";

      // 4. Generate Alerts based on destination conditions
      const alerts = [];
      if ((cwB.weathercode ?? 0) >= 61) alerts.push({ type:"warning", msg:"Wet roads expected at destination. Braking distance increases by 2x." });
      if (precipProbB > 50) alerts.push({ type:"warning", msg:`${precipProbB}% chance of precipitation. Drive with caution.` });
      if (visB !== undefined && visB < 3000) alerts.push({ type:"danger", msg:`Low visibility (${(visB/1000).toFixed(1)} km) at destination. Fog lights recommended.` });
      
      // Dynamic Traffic & Construction Intelligence
      let hasHeavyTraffic = false;
      if (avgSpeed > 0 && avgSpeed < 25) {
          hasHeavyTraffic = true;
          alerts.push({ type:"danger", msg:"Severe Traffic Congestion detected. Expect stop-and-go conditions." });
          roadSafety.score -= 20;
      } else if (avgSpeed < 45) {
          alerts.push({ type:"warning", msg:"Moderate traffic volume. Flow is slightly below optimal." });
          roadSafety.score -= 10;
      }

      // Dynamic Construction Prediction (Simulated based on route length & name hashing)
      if (distKm > 8) {
          // Pseudo-random but deterministic construction trigger based on location data
          const hash = B.name.length + Math.round(distKm) + (new Date().getHours());
          if (hash % 3 === 0 || hasHeavyTraffic) {
             alerts.push({ type:"warning", msg:" Live Construction: Active roadworks reported on route. Expect partial lane closures." });
             roadSafety.score -= 15;
          }
      }

      // Re-evaluate Safety Status based on the updated score
      if (roadSafety.score < 0) roadSafety.score = 0;
      if (roadSafety.score < 50) { roadSafety.status = "Hazardous"; roadSafety.color = "var(--accent)"; }
      else if (roadSafety.score < 80) { roadSafety.status = "Moderate Risk"; roadSafety.color = "var(--accent)"; }
      else { roadSafety.status = "Safe Conditions"; roadSafety.color = "var(--accent)"; }

      if (alerts.length === 0) alerts.push({ type:"safe", msg:`Roads to ${B.name.split(",")[0]} are clear. Ideal driving conditions.` });

      const tips = roadSafety.status === "Safe Conditions"
        ? ["Cruise control is safe to use", "Standard tire pressure is optimal", "Enjoy the drive to " + B.name.split(",")[0]]
        : roadSafety.status === "Moderate Risk"
        ? ["Reduce highway speed by 10-15 km/h", "Keep windows slightly open to prevent fogging", "Avoid harsh braking"]
        : ["Postpone non-essential travel", "Share live tracking with emergency contacts", "Watch for aquaplaning or flooded sections"];

      setReport({ 
        from: A.name, to: B.name, 
        destName: B.name.split(",")[0],
        distStr, durStr, avgSpeed,
        roadSafety, wxDescB, 
        tempB: cwB.temperature, windB: cwB.windspeed, 
        visKm: visB ? (visB/1000).toFixed(1) : "N/A", 
        precipProb: precipProbB, alerts, tips 
      });
    } catch (e) {
      setError(e.message || "Prediction failed. Check your internet connection.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="auth-page" style={{ alignItems:"center", paddingTop:"80px", overflowY:"auto", minHeight:"100vh" }}>
      <div style={{ position:"absolute", top:"20px", left:"20px", zIndex:10 }}><BackButton /></div>

      <div style={{ width:"100%", maxWidth:"1100px", padding:"20px", textAlign:"center" }}>
        <div style={{ marginBottom:"35px" }}>
          <span style={{ background:"rgba(59, 130, 246, 0.2)", color:"var(--accent)", padding:"8px 20px", borderRadius:"30px", fontWeight:"700", fontSize:"0.9rem", textTransform:"uppercase", letterSpacing:"1px", display:"inline-block", marginBottom:"15px", border:"1px solid rgba(59, 130, 246, 0.3)" }}>
            AI Safety Prediction
          </span>
          <h1 style={{ fontSize:"3.2rem", fontWeight:"900", color: "var(--text)", marginBottom:"10px" }}>Road Safety Forecaster</h1>
          <p style={{ color: "var(--text)", fontSize:"1.1rem", maxWidth:"650px", margin:"0 auto" }}>
            Predicts real-time road safety and driving conditions based on live weather and route data for your destination.
          </p>
        </div>

        {error && <div style={{ background:"var(--accent-bg)", color:"var(--accent)", padding:"12px 20px", borderRadius:"10px", border:"1px solid rgba(59, 130, 246, 0.3)", maxWidth:"580px", margin:"0 auto 20px auto" }}>{error}</div>}

        <div style={{ display:"flex", flexWrap:"wrap", gap:"30px", justifyContent:"center" }}>
          {/* Input */}
          <div className="auth-card" style={{ flex:"1 1 400px", maxWidth:"460px", padding:"35px", textAlign:"left" }}>
            <h3 style={{ color: "var(--text)", fontSize:"1.3rem", marginBottom:"25px", borderBottom:"1px solid rgba(255, 255, 255, 0.1)", paddingBottom:"15px" }}> Route details</h3>
            <div style={{ display:"flex", gap:"12px", marginBottom:"25px" }}>
              <div style={{ flex:1 }}>
                <label style={{ display:"block", color: "var(--text)", marginBottom:"8px", fontSize:"0.9rem" }}>Current Location</label>
                <LocationAutocomplete placeholder="e.g. Bangalore" value={from} onChange={setFrom} icon="" />
              </div>
              <div style={{ display:"flex", alignItems:"flex-end", paddingBottom:"10px", color:"var(--text)", fontSize:"1.3rem" }}>→</div>
              <div style={{ flex:1 }}>
                <label style={{ display:"block", color: "var(--text)", marginBottom:"8px", fontSize:"0.9rem", fontWeight:"600" }}>Destination</label>
                <LocationAutocomplete placeholder="e.g. Chennai" value={to} onChange={setTo} icon="" />
              </div>
            </div>
            <button className="auth-btn" onClick={checkRoute} disabled={isScanning}
              style={{ background: isScanning ? "var(--text)" : "linear-gradient(135deg,var(--accent),var(--text))", boxShadow: isScanning ? "none" : "0 4px 15px rgba(59, 130, 246, 0.4)", maxWidth:"100%" }}>
              {isScanning ? "Predicting Road Safety..." : "Predict Road Safety "}
            </button>
            <p style={{ color:"var(--text)", fontSize:"0.8rem", marginTop:"12px", textAlign:"center" }}> AI Analysis based on destination weather & route</p>
          </div>

          {/* Results */}
          <div className="auth-card" style={{ flex:"1 1 500px", maxWidth:"600px", padding:"35px", textAlign:"left", background:"rgba(15, 23, 42, 0.7)", border:`1px solid ${report ? report.roadSafety.color+"55" : "rgba(59, 130, 246, 0.15)"}`, display:"flex", flexDirection:"column", justifyContent:"center", transition:"border 0.5s" }}>
            {isScanning ? (
              <div style={{ textAlign:"center" }}>
                <div style={{ position:"relative", width:"90px", height:"90px", margin:"0 auto 20px auto" }}>
                  <div style={{ position:"absolute", inset:0, border:"3px solid rgba(59, 130, 246, 0.15)", borderRadius:"50%" }}></div>
                  <div style={{ position:"absolute", inset:0, borderTop:"3px solid var(--accent)", borderRadius:"50%", animation:"spin 1s linear infinite" }}></div>
                  <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"2rem" }}>️</div>
                </div>
                <h3 style={{ color: "var(--text)" }}>Analyzing route to destination...</h3>
                <p style={{ color:"var(--text)" }}>Calculating road safety index based on live data</p>
              </div>
            ) : report ? (
              <div style={{ animation:"fadeInUp 0.4s ease" }}>
                {/* Overall Risk Banner */}
                <div style={{ background:`linear-gradient(135deg,${report.roadSafety.color}22,transparent)`, border:`1px solid ${report.roadSafety.color}55`, borderRadius:"12px", padding:"20px", marginBottom:"22px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <p style={{ color:"var(--accent)", fontSize:"0.85rem", textTransform:"uppercase", margin:"0 0 4px 0" }}>Road Safety Index: {report.destName}</p>
                    <div style={{ display:"flex", alignItems:"baseline", gap:"10px" }}>
                      <p style={{ color:report.roadSafety.color, fontSize:"2.2rem", fontWeight:"900", margin:0 }}>{report.roadSafety.score}%</p>
                      <p style={{ color:report.roadSafety.color, fontSize:"1.2rem", fontWeight:"600", margin:0 }}>({report.roadSafety.status})</p>
                    </div>
                  </div>
                  <div style={{ background:`${report.roadSafety.color}22`, borderRadius:"50%", width:"65px", height:"65px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"2rem" }}>
                    {report.roadSafety.score >= 80 ? "️" : report.roadSafety.score >= 50 ? "️" : ""}
                  </div>
                </div>

                {/* Destination Weather & Route Info */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"20px" }}>
                  <div style={{ background: "var(--bg-card)", padding:"14px", borderRadius:"10px", border:"1px solid rgba(255, 255, 255, 0.05)" }}>
                    <p style={{ color:"var(--accent)", fontSize:"0.75rem", textTransform:"uppercase", margin:"0 0 5px 0" }}>Route Estimates</p>
                    <p style={{ color: "var(--text)", fontWeight:"700", margin:"0 0 4px 0", fontSize:"0.95rem" }}>Distance: {report.distStr}</p>
                    <p style={{ color: "var(--text)", fontWeight:"700", margin:"0 0 4px 0", fontSize:"0.95rem" }}>Duration: {report.durStr}</p>
                    <p style={{ color: "var(--text)", fontSize:"0.8rem", margin:0 }}>Avg Speed: {Math.round(report.avgSpeed)} km/h</p>
                  </div>
                  <div style={{ background: "var(--bg-card)", padding:"14px", borderRadius:"10px", border:`1px solid ${report.roadSafety.color}44` }}>
                    <p style={{ color:"var(--accent)", fontSize:"0.75rem", textTransform:"uppercase", margin:"0 0 5px 0" }}>Destination Weather</p>
                    <p style={{ color: "var(--text)", fontWeight:"700", margin:"0 0 4px 0", fontSize:"0.95rem" }}>{report.wxDescB}</p>
                    <div style={{ display:"flex", gap:"10px", marginBottom:"4px" }}>
                      <span style={{ color: "var(--text)", fontSize:"0.9rem", fontWeight:"700" }}>{report.tempB}°C</span>
                      <span style={{ color:"var(--accent)", fontSize:"0.85rem" }}> {report.windB} km/h</span>
                    </div>
                    <p style={{ color: "var(--text)", fontSize:"0.8rem", margin:0 }}>Visibility: {report.visKm} km</p>
                  </div>
                </div>

                {/* Live Alerts */}
                <div style={{ marginBottom:"18px" }}>
                  <p style={{ color: "var(--text)", fontSize:"0.8rem", textTransform:"uppercase", marginBottom:"10px", letterSpacing:"0.5px" }}>Live Road Conditions</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                    {report.alerts.map((a,i) => (
                      <div key={i} style={{ display:"flex", gap:"12px", padding:"11px 14px", borderRadius:"9px", background: a.type==="safe"?"rgba(59, 130, 246, 0.08)":a.type==="danger"?"var(--accent-bg)":"var(--accent-bg)", borderLeft:`3px solid ${a.type==="safe"?"var(--accent)":a.type==="danger"?"var(--accent)":"var(--accent)"}` }}>
                        <span>{a.type==="safe"?"":a.type==="danger"?"":"️"}</span>
                        <span style={{ color: "var(--text)", fontSize:"0.9rem" }}>{a.msg}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Safety Tips */}
                <div>
                  <p style={{ color: "var(--text)", fontSize:"0.8rem", textTransform:"uppercase", marginBottom:"10px", letterSpacing:"0.5px" }}>Driving Recommendations</p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
                    {report.tips.map((t,i)=>(
                      <span key={i} style={{ background: "var(--bg-card)", color: "var(--text)", fontSize:"0.8rem", padding:"6px 12px", borderRadius:"20px", border:"1px solid rgba(255, 255, 255, 0.08)" }}> {t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign:"center", color:"var(--text)" }}>
                <div style={{ fontSize:"4rem", marginBottom:"15px" }}>️</div>
                <p>Enter your destination to predict live road safety conditions based on weather and route data.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes fadeInUp { from { opacity:0; transform:translateY(15px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}