import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import "./Auth.css";

const CAR_SUGGEST = {
  "Family Trip": "Toyota Innova", "Business Trip": "Honda City",
  "Night Travel": "Hyundai Creta", "Adventure Trip": "Mahindra Thar",
};
const WX_DESC = {
  0:"Clear ️",1:"Mostly clear ️",2:"Partly cloudy ",3:"Overcast ️",
  45:"Foggy ️",51:"Drizzle ️",61:"Rainy ️",63:"Heavy rain ️",
  80:"Showers ️",95:"Thunderstorm ️",
};
const getWxDesc = (code) => WX_DESC[code] || (code >= 61 ? "Rainy ️" : code >= 2 ? "Cloudy " : "Clear ️");

export default function TripPlanner() {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [tripType, setTripType] = useState("");
  const [plan, setPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const geocode = async (place) => {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place + ", India")}&format=json&limit=1`,
      { headers: { "Accept-Language": "en" } }
    );
    const d = await r.json();
    if (!d.length) throw new Error(`Location not found: "${place}". Try a city name.`);
    return { lat: +d[0].lat, lon: +d[0].lon, name: d[0].display_name.split(",").slice(0,2).join(", ") };
  };

  const handlePlan = async () => {
    if (!pickup || !destination || !date || !tripType) {
      setError("Please fill in all trip details."); return;
    }
    setError(""); setIsGenerating(true); setPlan(null);

    try {
      const [A, B] = await Promise.all([geocode(pickup), geocode(destination)]);

      // Real route via OSRM
      const osrm = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${A.lon},${A.lat};${B.lon},${B.lat}?overview=false&steps=true`
      );
      const rd = await osrm.json();
      if (rd.code !== "Ok") throw new Error("Could not find a driving route.");
      const leg = rd.routes[0].legs[0];
      const km = (leg.distance / 1000).toFixed(0);
      const totalMin = Math.round(leg.duration / 60);
      const hrs = Math.floor(totalMin / 60), mins = totalMin % 60;

      // True midpoint along the actual road route
      let midLat = (A.lat + B.lat) / 2;
      let midLon = (A.lon + B.lon) / 2;
      
      if (leg.steps && leg.steps.length > 0) {
        // Find the step that is roughly halfway through the journey
        const midStepIndex = Math.floor(leg.steps.length / 2);
        const midStep = leg.steps[midStepIndex];
        if (midStep && midStep.maneuver && midStep.maneuver.location) {
          midLon = midStep.maneuver.location[0];
          midLat = midStep.maneuver.location[1];
        }
      }

      // Weather at origin and destination for the date
      const [wxA, wxB] = await Promise.all([
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${A.lat}&longitude=${A.lon}&daily=weathercode,temperature_2m_max,precipitation_probability_max&forecast_days=7&timezone=Asia/Kolkata`).then(r=>r.json()),
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${B.lat}&longitude=${B.lon}&daily=weathercode,temperature_2m_max,precipitation_probability_max&forecast_days=7&timezone=Asia/Kolkata`).then(r=>r.json()),
      ]);

      // Find the index for selected date (or use day 0 if too far)
      const todayStr = new Date().toISOString().split("T")[0];
      const selectedDate = date || todayStr;
      let dayIdx = wxA.daily?.time?.indexOf(selectedDate) ?? 0;
      if (dayIdx < 0) dayIdx = 0;

      const codeA = wxA.daily?.weathercode?.[dayIdx] ?? 0;
      const codeB = wxB.daily?.weathercode?.[dayIdx] ?? 0;
      const tempA = wxA.daily?.temperature_2m_max?.[dayIdx] ?? "N/A";
      const tempB = wxB.daily?.temperature_2m_max?.[dayIdx] ?? "N/A";
      const precipA = wxA.daily?.precipitation_probability_max?.[dayIdx] ?? 0;
      const precipB = wxB.daily?.precipitation_probability_max?.[dayIdx] ?? 0;

      const isNight = tripType === "Night Travel";
      const isBad = codeA >= 61 || codeB >= 61 || precipA > 60 || precipB > 60;

      let fuelArea = "Highway midpoint";
      try {
        const rev = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${midLat}&lon=${midLon}&format=json`, { headers: { "Accept-Language": "en" } });
        const revD = await rev.json();
        // Prioritize recognizable towns/cities/districts to avoid obscure village name confusion
        fuelArea = revD.address?.city || revD.address?.town || revD.address?.county || revD.address?.state_district || revD.address?.village || "Highway midpoint";
      } catch(_) {}

      const safetyNote = isNight
        ? "Activate Women Safety Mode & share live GPS with a trusted contact."
        : isBad
        ? `Rain expected (${Math.max(precipA,precipB)}% chance). Carry an umbrella, avoid underpasses.`
        : "Conditions look safe. Keep DriveSphere live tracking active.";

      setPlan({
        from: A.name.split(",")[0], to: B.name.split(",")[0],
        km, time: hrs > 0 ? `${hrs} hr ${mins} min` : `${mins} min`,
        bestCar: CAR_SUGGEST[tripType] || "Hyundai Creta",
        fuelStop: km < 50 ? "Not required for short intra-city trips" : `After ~${Math.round(km/2)} km near ${fuelArea}`,
        foodNote: km < 50 ? `Quick ${hrs > 0 ? `${hrs} hr ${mins} min` : `${mins} min`} drive, no dining breaks needed` : `Midpoint food break near ${fuelArea}`,
        wxOrigin: getWxDesc(codeA), wxDest: getWxDesc(codeB),
        tempA, tempB, precipA, precipB, safetyNote, isBad,
        hotel: `Smart hotels available near ${B.name.split(",")[0]}`,
      });
    } catch (e) {
      setError(e.message || "Failed to generate plan. Check your connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="auth-page" style={{ alignItems:"center", paddingTop:"80px", overflowY:"auto", minHeight:"100vh" }}>
      <div style={{ position:"absolute", top:"20px", left:"20px", zIndex:10 }}><BackButton /></div>

      <div style={{ width:"100%", maxWidth:"1150px", padding:"20px", textAlign:"center" }}>
        <div style={{ marginBottom:"35px" }}>
          <span style={{ background:"rgba(59, 130, 246, 0.2)", color:"var(--accent)", padding:"8px 20px", borderRadius:"30px", fontWeight:"700", fontSize:"0.9rem", textTransform:"uppercase", letterSpacing:"1px", display:"inline-block", marginBottom:"15px", border:"1px solid rgba(59, 130, 246, 0.3)" }}>
            AI Travel Assistant
          </span>
          <h1 style={{ fontSize:"3.2rem", fontWeight:"900", color: "var(--text)", marginBottom:"10px" }}>Smart Trip Planner</h1>
          <p style={{ color: "var(--text)", fontSize:"1.1rem", maxWidth:"650px", margin:"0 auto" }}>
            Real driving distances, live weather forecast for your travel date, and AI-powered waypoint suggestions — all in one plan.
          </p>
        </div>

        {error && <div style={{ background:"var(--accent-bg)", color:"var(--accent)", padding:"12px 20px", borderRadius:"10px", border:"1px solid rgba(59, 130, 246, 0.3)", maxWidth:"580px", margin:"0 auto 20px auto" }}>{error}</div>}

        <div style={{ display:"flex", flexWrap:"wrap", gap:"30px", justifyContent:"center" }}>
          {/* Form */}
          <div className="auth-card" style={{ flex:"1 1 400px", maxWidth:"450px", padding:"35px", textAlign:"left" }}>
            <h3 style={{ color: "var(--text)", fontSize:"1.3rem", marginBottom:"22px", borderBottom:"1px solid rgba(255, 255, 255, 0.1)", paddingBottom:"15px" }}>Trip Details</h3>
            {[
              { label:"Starting Point", val:pickup, set:setPickup, ph:"e.g. Bangalore" },
              { label:"Destination", val:destination, set:setDestination, ph:"e.g. Ooty" },
            ].map((f,i)=>(
              <div key={i} style={{ marginBottom:"18px" }}>
                <label style={{ display:"block", color: "var(--text)", marginBottom:"7px", fontSize:"0.9rem" }}>{f.label}</label>
                <input type="text" placeholder={f.ph} value={f.val} onChange={e=>f.set(e.target.value)}
                  style={{ width:"100%", padding:"12px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius:"10px", color: "var(--text)", outline:"none" }} />
              </div>
            ))}
            <div style={{ display:"flex", gap:"15px", marginBottom:"22px" }}>
              <div style={{ flex:1 }}>
                <label style={{ display:"block", color: "var(--text)", marginBottom:"7px", fontSize:"0.9rem" }}>Date</label>
                <input type="date" value={date} min={new Date().toISOString().split("T")[0]} onChange={e=>setDate(e.target.value)}
                  style={{ width:"100%", padding:"12px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius:"10px", color: "var(--text)", outline:"none", colorScheme:"dark" }} />
              </div>
              <div style={{ flex:1 }}>
                <label style={{ display:"block", color: "var(--text)", marginBottom:"7px", fontSize:"0.9rem" }}>Travel Style</label>
                <select value={tripType} onChange={e=>setTripType(e.target.value)}
                  style={{ width:"100%", padding:"12px", background:"rgba(15, 23, 42, 0.9)", border: "1px solid var(--border)", borderRadius:"10px", color: "var(--text)", appearance:"none", outline:"none" }}>
                  <option value="">Select...</option>
                  <option>Family Trip</option><option>Business Trip</option>
                  <option>Night Travel</option><option>Adventure Trip</option>
                </select>
              </div>
            </div>
            <button className="auth-btn" onClick={handlePlan} disabled={isGenerating}
              style={{ background: isGenerating ? "var(--text)" : "linear-gradient(135deg,var(--accent),var(--text))", boxShadow: isGenerating ? "none" : "0 4px 15px rgba(59, 130, 246, 0.4)", maxWidth:"100%" }}>
              {isGenerating ? "Generating Live Itinerary..." : "Generate AI Itinerary "}
            </button>
            <p style={{ color:"var(--text)", fontSize:"0.78rem", marginTop:"10px", textAlign:"center" }}> OSRM · Open-Meteo · OpenStreetMap</p>
          </div>

          {/* Results */}
          <div className="auth-card" style={{ flex:"1 1 500px", maxWidth:"650px", padding:"35px", textAlign:"left", background:"rgba(15, 23, 42, 0.7)", border:`1px solid ${plan && plan.isBad ? "rgba(59, 130, 246, 0.3)" : "rgba(59, 130, 246, 0.2)"}`, display:"flex", flexDirection:"column", justifyContent:"center" }}>
            {isGenerating ? (
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:"3.5rem", animation:"bounce 1.2s infinite", display:"inline-block", marginBottom:"15px" }}></div>
                <h3 style={{ color: "var(--text)" }}>Fetching real route & weather data...</h3>
                <p style={{ color:"var(--accent)" }}>Connecting to live travel APIs</p>
              </div>
            ) : plan ? (
              <div style={{ animation:"fadeInUp 0.4s ease" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px", borderBottom:"1px solid rgba(255, 255, 255, 0.08)", paddingBottom:"15px" }}>
                  <h3 style={{ color: "var(--text)", margin:0, fontSize:"1.4rem" }}>Your Live Itinerary</h3>
                  <span style={{ background:"rgba(59, 130, 246, 0.2)", color:"var(--accent)", padding:"5px 14px", borderRadius:"20px", fontWeight:"700", fontSize:"0.8rem" }}>AI + Live Data</span>
                </div>

                {/* Metrics Row */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"12px", marginBottom:"20px" }}>
                  {[
                    { label:"Route", val:`${plan.from} → ${plan.to}`, color: "var(--text)" },
                    { label:"Distance", val:`${plan.km} km`, color: "var(--text)" },
                    { label:"Est. Time", val:plan.time, color:"var(--accent)" },
                  ].map((m,i)=>(
                    <div key={i} style={{ background: "var(--bg-card)", padding:"13px", borderRadius:"10px", border:"1px solid rgba(255, 255, 255, 0.05)" }}>
                      <p style={{ color:"var(--accent)", fontSize:"0.75rem", textTransform:"uppercase", margin:"0 0 4px 0" }}>{m.label}</p>
                      <p style={{ color:m.color, fontWeight:"700", margin:0, fontSize:i===0?"0.85rem":"1.1rem" }}>{m.val}</p>
                    </div>
                  ))}
                </div>

                {/* Weather on travel date */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"20px" }}>
                  {[
                    { label:`Weather at ${plan.from}`, wx:plan.wxOrigin, temp:plan.tempA, rain:plan.precipA },
                    { label:`Weather at ${plan.to}`, wx:plan.wxDest, temp:plan.tempB, rain:plan.precipB },
                  ].map((w,i)=>(
                    <div key={i} style={{ background: "var(--bg-card)", padding:"13px", borderRadius:"10px", border:`1px solid ${w.rain>60?"rgba(59, 130, 246, 0.3)":"rgba(255, 255, 255, 0.05)"}` }}>
                      <p style={{ color:"var(--accent)", fontSize:"0.75rem", textTransform:"uppercase", margin:"0 0 4px 0" }}>{w.label}</p>
                      <p style={{ color: "var(--text)", fontWeight:"600", margin:"0 0 4px 0", fontSize:"0.9rem" }}>{w.wx}</p>
                      <div style={{ display:"flex", gap:"10px" }}>
                        <span style={{ color: "var(--text)", fontSize:"0.85rem" }}>{w.temp}°C</span>
                        <span style={{ color: w.rain>60?"var(--accent)":"var(--accent)", fontSize:"0.8rem" }}> {w.rain}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Waypoints */}
                <div style={{ display:"flex", flexDirection:"column", gap:"9px", marginBottom:"20px" }}>
                  {[
                    { color: "var(--text)", icon:"", label:"Ideal Vehicle", val:plan.bestCar },
                    { color:"var(--accent)", icon:"", label:"Fuel Stop", val:plan.fuelStop },
                    { color:"var(--accent)", icon:"", label:"Dining Break", val:plan.foodNote },
                    { color:"var(--accent)", icon:"", label:"Accommodation", val:plan.hotel },
                  ].map((r,i)=>(
                    <div key={i} style={{ display:"flex", gap:"12px", alignItems:"flex-start", padding:"11px 14px", borderRadius:"9px", borderLeft:`3px solid ${r.color}`, background:`${r.color}11` }}>
                      <span style={{ fontSize:"1.1rem" }}>{r.icon}</span>
                      <div>
                        <p style={{ color:"var(--accent)", fontSize:"0.75rem", textTransform:"uppercase", margin:0 }}>{r.label}</p>
                        <p style={{ color: "var(--text)", fontWeight:"600", margin:0, fontSize:"0.9rem" }}>{r.val}</p>
                      </div>
                    </div>
                  ))}
                  <div style={{ display:"flex", gap:"12px", alignItems:"flex-start", padding:"11px 14px", borderRadius:"9px", borderLeft:`3px solid ${plan.isBad?"var(--accent)":"var(--accent)"}`, background:plan.isBad?"rgba(59, 130, 246, 0.08)":"rgba(59, 130, 246, 0.08)" }}>
                    <span style={{ fontSize:"1.1rem" }}>️</span>
                    <div>
                      <p style={{ color:"var(--accent)", fontSize:"0.75rem", textTransform:"uppercase", margin:0 }}>Safety Advisory</p>
                      <p style={{ color: "var(--text)", fontWeight:"600", margin:0, fontSize:"0.9rem" }}>{plan.safetyNote}</p>
                    </div>
                  </div>
                </div>

                <button onClick={() => navigate("/ai-match")}
                  style={{ width:"100%", background: "var(--bg-card)", color: "var(--text)", border:"1px solid rgba(255, 255, 255, 0.15)", padding:"12px", borderRadius:"10px", cursor:"pointer", fontWeight:"600", transition:"background 0.3s" }}
                  onMouseEnter={e=>e.target.style.background="rgba(255, 255, 255, 0.12)"}
                  onMouseLeave={e=>e.target.style.background="rgba(255, 255, 255, 0.06)"}>
                  Find {plan.bestCar} for this Trip 
                </button>
              </div>
            ) : (
              <div style={{ textAlign:"center", color:"var(--text)" }}>
                <div style={{ fontSize:"4rem", marginBottom:"15px" }}></div>
                <p>Fill in the details to generate a real AI-powered travel itinerary with live weather data.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(15px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}