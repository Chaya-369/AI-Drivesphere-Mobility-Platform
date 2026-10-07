import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import "./Auth.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Polyline, useMap, useMapEvents, Popup } from "react-leaflet";
import { carDatabase } from "../data/carDatabase";
import LocationAutocomplete from "../components/LocationAutocomplete";

// Custom Leaflet Markers
const dotIcon = new L.DivIcon({
  html: `<div style="width: 14px; height: 14px; background: var(--accent); border: 2px solid var(--bg-card); border-radius: 50%; box-shadow: 0 0 8px rgba(59, 130, 246, 0.8);"></div>`,
  className: "custom-leaflet-icon",
  iconSize: [18, 18],
  iconAnchor: [9, 9]
});

const destIcon = new L.DivIcon({
  html: `<div style="width: 14px; height: 14px; background: var(--accent); border: 2px solid var(--bg-card); border-radius: 50%; box-shadow: 0 0 8px rgba(59, 130, 246, 0.8);"></div>`,
  className: "custom-leaflet-icon",
  iconSize: [18, 18],
  iconAnchor: [9, 9]
});

const clickIcon = new L.DivIcon({
  html: `<div style="font-size: 24px; filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.8));"></div>`,
  className: "custom-leaflet-icon",
  iconSize: [24, 24],
  iconAnchor: [12, 24]
});

function MapBoundsUpdater({ allWaypoints }) {
  const map = useMap();
  useEffect(() => {
    if (allWaypoints && allWaypoints.length > 0) {
      map.fitBounds(allWaypoints, { padding: [40, 40], maxZoom: 14, animate: true });
    }
  }, [allWaypoints, map]);
  return null;
}

const WX_CODE = (code, wind) => {
  let desc = "Clear & Sunny ️", risk = "Low", color = "var(--accent)";
  if (code >= 95) { desc = "Thunderstorm ️"; risk = "High"; color = "var(--accent)"; }
  else if (code >= 80) { desc = "Heavy Rain ️"; risk = "High"; color = "var(--accent)"; }
  else if (code >= 61) { desc = "Rainy ️"; risk = "Medium"; color = "var(--accent)"; }
  else if (code >= 51) { desc = "Light Drizzle ️"; risk = "Medium"; color = "var(--accent)"; }
  else if (code >= 2) { desc = "Partly Cloudy "; risk = "Low"; color = "var(--accent)"; }
  if (wind > 60) { desc += " + Strong Winds "; risk = "High"; color = "var(--accent)"; }
  const tips = {
    Low: "Perfect conditions — green light for travel!",
    Medium: "Wet roads possible — drive at reduced speed.",
    High: "Hazardous conditions — consider postponing trip.",
  };
  return { desc, risk, color, tip: tips[risk] };
};

export default function RoutePlanning() {
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  
  // New state for multi-routes
  const [routes, setRoutes] = useState([]);
  const [selectedRouteIdx, setSelectedRouteIdx] = useState(0);
  const [destinationIntel, setDestinationIntel] = useState(null);

  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState("");
  const [clickPin, setClickPin] = useState(null); // {lat, lon, address}
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Exact location Geocoding (no forced country limits)
  const geocode = async (place) => {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`,
      { headers: { "Accept-Language": "en" } }
    );
    const d = await r.json();
    if (!d.length) throw new Error(`Location not found: "${place}". Try being more specific.`);
    
    const parts = d[0].display_name.split(",");
    const displayName = parts.slice(0, 3).join(",").trim();
    return { lat: +d[0].lat, lon: +d[0].lon, name: displayName };
  };

  const fetchDestinationIntel = async (lat, lon, address) => {
    try {
      const wx = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&forecast_days=1`
      );
      const wd = await wx.json();
      const cw = wd.current_weather || {};
      const wxInfo = WX_CODE(cw.weathercode ?? 0, cw.windspeed ?? 0);
      
      let safetyScore = 100;
      if (wxInfo.risk === "High") safetyScore -= 35;
      else if (wxInfo.risk === "Medium") safetyScore -= 15;

      setDestinationIntel({
        address,
        wxInfo,
        temp: cw.temperature ?? "N/A",
        safetyScore
      });
    } catch(e) {
      console.error("Intel fetch failed", e);
    }
  };

  const generateRoute = async (start = from, end = to) => {
    if (!start || !end) { setError("Please provide both Origin and Destination."); return; }
    setError(""); setIsCalculating(true); setRoutes([]); setDestinationIntel(null);
    setClickPin(null);
    
    try {
      const [A, B] = await Promise.all([geocode(start), geocode(end)]);

      // Fetch alternative routes via OSRM
      const osrm = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${A.lon},${A.lat};${B.lon},${B.lat}?overview=full&geometries=geojson&steps=true&alternatives=true`
      );
      const rd = await osrm.json();
      if (rd.code !== "Ok" || !rd.routes.length) throw new Error("No route found. Locations may be unreachable by road.");
      
      // Parse all routes
      const parsedRoutes = rd.routes.map((route, index) => {
        const leg = route.legs[0];
        const kmNum = leg.distance / 1000;
        const km = kmNum.toFixed(1);
        const totalMin = Math.round(leg.duration / 60);
        const hrs = Math.floor(totalMin / 60);
        const mins = totalMin % 60;
        const waypoints = route.geometry.coordinates.map(c => [c[1], c[0]]);
        
        let trafficAlert = { status: "Clear Roads", color: "var(--text)", icon: "️", desc: "Flowing traffic, optimal conditions." };
        
        const avgSpeedKmh = kmNum / (leg.duration / 3600);
        if (avgSpeedKmh < 30) {
          trafficAlert = { status: "Severe Traffic", color: "var(--text)", icon: "", desc: "Heavy congestion detected. High delay." };
        } else if (avgSpeedKmh < 50) {
          trafficAlert = { status: "Moderate Traffic", color: "var(--text)", icon: "", desc: "Some congestion in urban zones." };
        }

        // Determine road name from steps if possible
        let via = `Route ${index + 1}`;
        if (leg.steps && leg.steps.length > 0) {
            const majorSteps = leg.steps.filter(s => s.name && s.distance > 500);
            if (majorSteps.length > 0) {
                via = `via ${majorSteps[0].name}`;
            }
        }

        return {
          id: index,
          kmNum,
          km,
          time: hrs > 0 ? `${hrs} hr ${mins} min` : `${mins} min`,
          durationMinutes: totalMin,
          waypoints,
          trafficAlert,
          via,
          steps: leg.steps || []
        };
      });

      // Sort routes by duration
      parsedRoutes.sort((a, b) => a.durationMinutes - b.durationMinutes);

      setRoutes(parsedRoutes);
      setSelectedRouteIdx(0); // Select fastest by default

      // Fetch Intel for Destination
      await fetchDestinationIntel(B.lat, B.lon, B.name);
      
      setFrom(A.name);
      setTo(B.name);

    } catch (e) {
      setError(e.message || "Failed to fetch route. Check your connection.");
    } finally {
      setIsCalculating(false);
    }
  };

  // Map Click Listener to drop pins dynamically
  function MapInteractionHandler() {
    useMapEvents({
      async click(e) {
        if (isCalculating) return;
        const { lat, lng } = e.latlng;
        
        try {
          const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
          const d = await r.json();
          const address = d.display_name.split(",").slice(0,3).join(",").trim() || "Selected Location";
          
          setClickPin({ lat, lon: lng, address });
          setTo(address); 
          
          fetchDestinationIntel(lat, lng, address);

          if (from) {
            generateRoute(from, address);
          }
        } catch (err) {
          console.error("Reverse geocoding failed", err);
        }
      }
    });
    return null;
  }

  useEffect(() => {
    if (!from && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`);
          const d = await r.json();
          const address = d.display_name.split(",").slice(0,3).join(",").trim();
          setFrom(address);
        } catch (_) {}
      });
    }
  }, []);

  // Compute bounding box containing ALL routes
  const allWaypoints = routes.flatMap(r => r.waypoints);

  // Dynamic Car Suggestion based on selected route
  const getCarSuggestion = (route, intel) => {
      if (!route || !intel) return null;
      
      const { kmNum, trafficAlert } = route;
      const { wxInfo } = intel;

      let suitableCars = [];
      
      if (kmNum > 300) {
         suitableCars = ["innova", "safari", "thar", "xuv700", "harrier"];
      } else if (kmNum > 100 || wxInfo.risk === "High") {
         suitableCars = ["creta", "seltos", "nexon", "city", "thar"];
      } else if (trafficAlert.status === "Severe Traffic") {
         suitableCars = ["tiago", "swift", "i20", "nexon_ev", "punch"];
      } else {
         suitableCars = ["tiago", "swift", "i20", "city", "altroz"];
      }
      
      // Pseudo-random selection based on distance so the same route gets the same car, but different routes get different cars
      const index = Math.floor(kmNum * 10) % suitableCars.length;
      let carId = suitableCars[index];
      
      // Fallback to creta if car not found in DB
      let car = carDatabase.find(c => c.id === carId);
      if (!car) {
          const availableCars = carDatabase.filter(c => suitableCars.includes(c.id));
          car = availableCars.length > 0 ? availableCars[0] : carDatabase[0];
      }
      
      return car;
  };

  const selectedRoute = routes[selectedRouteIdx];
  const suggestedCar = getCarSuggestion(selectedRoute, destinationIntel);

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden", background: "var(--bg-card)", fontFamily: "Inter, sans-serif" }}>
      
      {/* Floating Back Button */}
      <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 2000 }}>
        <BackButton />
      </div>

      {/* Sidebar (Left) */}
      <div style={{ 
        width: "420px", 
        height: "100%", 
        background: "var(--bg-card)", 
        backdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(255, 255, 255, 0.1)",
        display: "flex", 
        flexDirection: "column",
        zIndex: 1000,
        boxShadow: "5px 0 25px var(--glass-bg)",
        paddingTop: "70px",
        overflowY: "auto"
      }}>
        
        {/* Search Header */}
        <div style={{ padding: "0 25px 20px 25px", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
            <h2 style={{ color: "var(--text)", fontSize: "1.5rem", fontWeight: "800", marginBottom: "25px" }}>Route Planning</h2>

            {/* Inputs */}
            <div style={{ position: "relative" }}>
                <div style={{ marginBottom: "12px" }}>
                    <LocationAutocomplete placeholder="Starting point..." value={from} onChange={setFrom} icon="" />
                </div>
                <div style={{ marginBottom: "15px" }}>
                    <LocationAutocomplete placeholder="Destination..." value={to} onChange={setTo} icon="" />
                </div>
                
                {/* Swap Button */}
                <button 
                  onClick={() => { const temp = from; setFrom(to); setTo(temp); }}
                  style={{ position: "absolute", right: "20px", top: "35px", background: "var(--text)", border: "1px solid var(--border)", borderRadius: "50%", width: "32px", height: "32px", color: "var(--text)", cursor: "pointer", zIndex: 5, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                  onMouseOver={(e) => e.target.style.background = "var(--text)"}
                  onMouseOut={(e) => e.target.style.background = "var(--text)"}
                >
                  ↑↓
                </button>

                <button 
                  onClick={() => generateRoute()} 
                  disabled={isCalculating}
                  style={{ width: "100%", padding: "14px", background: isCalculating ? "var(--text)" : "var(--accent)", color: "var(--text)", border: "none", borderRadius: "10px", fontWeight: "700", cursor: isCalculating ? "not-allowed" : "pointer", fontSize: "1rem", boxShadow: isCalculating ? "none" : "0 4px 15px rgba(59, 130, 246, 0.3)" }}
                >
                  {isCalculating ? "Calculating Routes..." : "Get Directions"}
                </button>
                {error && <div style={{ color: "var(--text)", fontSize: "0.85rem", marginTop: "10px", background: "var(--accent-bg)", padding: "10px", borderRadius: "6px" }}>{error}</div>}
            </div>
        </div>

        {/* Sidebar Content (Routes & Intel) */}
        <div style={{ padding: "20px 25px", flex: 1, overflowY: "auto" }}>
            
            {/* Route List */}
            {routes.length > 0 && (
                <div style={{ marginBottom: "30px" }}>
                    <h3 style={{ color: "var(--text)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "15px" }}>Alternative Routes ({routes.length})</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {routes.map((rt, idx) => {
                            const isSelected = idx === selectedRouteIdx;
                            const timeColor = rt.trafficAlert.status === "Severe Traffic" ? "var(--accent)" : rt.trafficAlert.status === "Moderate Traffic" ? "var(--accent)" : "var(--accent)";
                            
                            return (
                                <div 
                                    key={idx}
                                    onClick={() => setSelectedRouteIdx(idx)}
                                    style={{ 
                                        padding: "16px 20px", 
                                        background: isSelected ? "rgba(59, 130, 246, 0.08)" : "transparent", 
                                        borderLeft: `4px solid ${isSelected ? "var(--accent)" : "transparent"}`,
                                        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                        display: "flex",
                                        gap: "15px",
                                        alignItems: "flex-start"
                                    }}
                                    onMouseOver={(e) => { if(!isSelected) e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)" }}
                                    onMouseOut={(e) => { if(!isSelected) e.currentTarget.style.background = "transparent" }}
                                >
                                    {/* Left Icon */}
                                    <div style={{ paddingTop: "2px", color: isSelected ? "var(--accent)" : "var(--accent)", fontSize: "1.2rem" }}>
                                        
                                    </div>
                                    
                                    {/* Center Content */}
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: "0 0 6px 0", color: isSelected ? "var(--text)" : "var(--text)", fontWeight: "600", fontSize: "1.05rem" }}>
                                            {rt.via}
                                        </p>
                                        <p style={{ margin: "0 0 8px 0", color: "var(--text)", fontSize: "0.85rem", lineHeight: "1.4" }}>
                                            {idx === 0 ? "Fastest route, based on current traffic" : "Alternative route, similar traffic"}
                                        </p>
                                        
                                        {rt.trafficAlert.status === "Severe Traffic" && (
                                            <p style={{ margin: 0, color: "var(--text)", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px" }}>
                                                ️ {rt.trafficAlert.desc}
                                            </p>
                                        )}
                                        
                                        {isSelected && (
                                            <div style={{ display: "flex", gap: "20px", marginTop: "12px" }}>
                                                <span onClick={(e) => { e.stopPropagation(); setShowDetailsModal(true); }} style={{ color: "var(--text)", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" }}>Details</span>
                                                <span onClick={(e) => { e.stopPropagation(); alert("3D Navigation Preview is coming soon in the next update!"); }} style={{ color: "var(--text)", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" }}>Preview</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Right Content */}
                                    <div style={{ textAlign: "right", minWidth: "65px" }}>
                                        <p style={{ margin: "0 0 4px 0", color: timeColor, fontWeight: "700", fontSize: "1.1rem" }}>
                                            {rt.time}
                                        </p>
                                        <p style={{ margin: 0, color: "var(--text)", fontSize: "0.85rem" }}>
                                            {rt.km} km
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Dynamic Intelligence (Weather & Safety) */}
            {destinationIntel && selectedRoute && (
                <div style={{ animation: "fadeInUp 0.4s ease" }}>
                    <h3 style={{ color: "var(--text)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "15px", borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "20px" }}>Live Intelligence Scan</h3>
                    
                    <div style={{ background: `linear-gradient(90deg, ${destinationIntel.wxInfo.color}15, transparent)`, borderLeft: `4px solid ${destinationIntel.wxInfo.color}`, padding: "15px", borderRadius: "0 8px 8px 0", marginBottom: "15px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                            <span style={{ color: destinationIntel.wxInfo.color, fontWeight: "700", fontSize: "1rem" }}>{destinationIntel.wxInfo.desc}</span>
                            <span style={{ background: "rgba(15, 23, 42, 0.3)", padding: "4px 8px", borderRadius: "12px", fontSize: "0.75rem", color: "var(--text)", fontWeight: "600" }}>{destinationIntel.safetyScore}% Safety Index</span>
                        </div>
                        <p style={{ color: "var(--text)", margin: 0, fontSize: "0.85rem", lineHeight: "1.4" }}>{destinationIntel.wxInfo.tip} (Temp: {destinationIntel.temp}°C at destination)</p>
                    </div>

                    <div style={{ background: `linear-gradient(90deg, ${selectedRoute.trafficAlert.color}15, transparent)`, borderLeft: `4px solid ${selectedRoute.trafficAlert.color}`, padding: "15px", borderRadius: "0 8px 8px 0", marginBottom: "25px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                            <span>{selectedRoute.trafficAlert.icon}</span>
                            <span style={{ color: selectedRoute.trafficAlert.color, fontWeight: "700", fontSize: "1rem" }}>{selectedRoute.trafficAlert.status}</span>
                        </div>
                        <p style={{ color: "var(--text)", margin: 0, fontSize: "0.85rem", lineHeight: "1.4" }}>{selectedRoute.trafficAlert.desc}</p>
                    </div>

                    {suggestedCar && (
                        <div style={{ background: "rgba(59, 130, 246, 0.05)", border: "1px solid rgba(59, 130, 246, 0.3)", borderRadius: "12px", padding: "20px", textAlign: "center", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
                            <p style={{ color: "var(--text)", fontSize: "0.75rem", textTransform: "uppercase", margin: "0 0 15px 0", fontWeight: "700" }}> AI Vehicle Suggestion</p>
                            
                            <img src={suggestedCar.image} alt={suggestedCar.name} style={{ width: "100%", maxWidth: "200px", height: "auto", objectFit: "contain", marginBottom: "15px", dropShadow: "0 10px 15px var(--glass-bg)" }} />
                            
                            <p style={{ color: "var(--text)", fontWeight: "800", margin: "0 0 5px 0", fontSize: "1.2rem" }}>{suggestedCar.name}</p>
                            <p style={{ color: "var(--text)", margin: "0 0 15px 0", fontSize: "0.85rem" }}>Best match for this route & weather.</p>
                            
                            <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
                                <span style={{ background: "var(--bg-card)", border: "1px solid rgba(0,0,0,0.1)", padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem", color: "var(--text)" }}> {suggestedCar.fuel}</span>
                                <span style={{ background: "var(--bg-card)", border: "1px solid rgba(0,0,0,0.1)", padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem", color: "var(--text)" }}> {suggestedCar.seats}</span>
                                <span style={{ background: "var(--bg-card)", border: "1px solid rgba(0,0,0,0.1)", padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem", color: "var(--text)", fontWeight: "600" }}> ₹{suggestedCar.price}/day</span>
                            </div>

                            <button onClick={() => navigate("/booking", { state: { car: suggestedCar } })} style={{ background: "var(--accent)", color: "var(--text)", border: "none", padding: "12px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "0.95rem", width: "100%", boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)", transition: "transform 0.2s" }} onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"} onMouseOut={(e) => e.target.style.transform = "none"}>
                                Book This Match 
                            </button>
                        </div>
                    )}
                </div>
            )}

            {!routes.length && !isCalculating && (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text)" }}>
                    <div style={{ fontSize: "3rem", opacity: 0.5, marginBottom: "15px" }}>️</div>
                    <p style={{ margin: 0, fontSize: "1.1rem" }}>Ready to explore.</p>
                    <p style={{ fontSize: "0.9rem", marginTop: "8px" }}>Enter locations or click the map to generate intelligent routes.</p>
                </div>
            )}

        </div>
      </div>

      {/* Map (Right / Full Screen Behind) */}
      <div style={{ flex: 1, position: "relative", zIndex: 1, height: "100%" }}>
          <MapContainer 
            center={[20.5937, 78.9629]} 
            zoom={5} 
            style={{ height: "100%", width: "100%", cursor: "crosshair" }} 
            zoomControl={false} // Hide default zoom control to not clash with UI
          >
            <TileLayer
              url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
              attribution='&copy; Google Maps'
            />
            
            <MapInteractionHandler />

            {/* Dropped Pin */}
            {clickPin && !routes.length && (
              <Marker position={[clickPin.lat, clickPin.lon]} icon={clickIcon}>
                <Popup><div style={{color:"var(--text)", fontWeight:"600"}}>{clickPin.address}</div></Popup>
              </Marker>
            )}

            {/* All Routes Plotted */}
            {routes.map((rt, idx) => {
                const isSelected = idx === selectedRouteIdx;
                return (
                    <Polyline 
                        key={idx}
                        positions={rt.waypoints} 
                        color={isSelected ? "#3b82f6" : "#94a3b8"} // Vibrant blue for selected, visible grey for others
                        weight={isSelected ? 6 : 4} 
                        opacity={isSelected ? 0.9 : 0.6}
                        zIndexOffset={isSelected ? 1000 : 500}
                        eventHandlers={{
                            click: () => setSelectedRouteIdx(idx), // Click polyline to select route
                        }}
                    >
                        {/* Tooltip on hover/click to show Time */}
                        <Popup><div style={{color:"var(--text)", fontWeight:"700", textAlign: "center"}}>{rt.time}<br/><span style={{fontSize:"0.8rem", color:"var(--accent)"}}>{rt.km} km</span></div></Popup>
                    </Polyline>
                );
            })}

            {/* Start and End Markers */}
            {routes.length > 0 && (
                <>
                    <Marker position={routes[0].waypoints[0]} icon={dotIcon} />
                    <Marker position={routes[0].waypoints[routes[0].waypoints.length - 1]} icon={destIcon} />
                    <MapBoundsUpdater allWaypoints={allWaypoints} />
                </>
            )}
          </MapContainer>
      </div>
      
      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform:translateY(15px); } to { opacity:1; transform:translateY(0); } }
        .leaflet-container { background: var(--text) !important; }
        .custom-leaflet-icon { background: transparent; border: none; }
        
        /* Custom Scrollbar for Sidebar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.1); }
        ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.4); }
      `}</style>
      
      {/* Route Details Modal */}
      {showDetailsModal && selectedRoute && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(15, 23, 42, 0.6)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(5px)" }} onClick={() => setShowDetailsModal(false)}>
              <div style={{ width: "90%", maxWidth: "500px", background: "var(--text)", borderRadius: "16px", padding: "25px", border: "1px solid var(--border)", boxShadow: "0 4px 6px rgba(15, 23, 42, 0.05)", maxHeight: "80vh", display: "flex", flexDirection: "column" }} onClick={e => e.stopPropagation()}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "15px" }}>
                      <h2 style={{ margin: 0, color: "var(--text)", fontSize: "1.3rem" }}>Turn-by-turn Directions</h2>
                      <button onClick={() => setShowDetailsModal(false)} style={{ background: "transparent", border: "none", color: "var(--text)", fontSize: "1.5rem", cursor: "pointer" }}>&times;</button>
                  </div>
                  <div style={{ overflowY: "auto", paddingRight: "10px" }}>
                      {selectedRoute.steps.length > 0 ? selectedRoute.steps.map((step, i) => {
                          const isLeft = step.maneuver.modifier && step.maneuver.modifier.includes("left");
                          const isRight = step.maneuver.modifier && step.maneuver.modifier.includes("right");
                          const icon = step.maneuver.type === "arrive" ? "" : step.maneuver.type === "depart" ? "" : isLeft ? "⬅️" : isRight ? "️" : "⬆️";
                          const instruction = step.name ? `Proceed on ${step.name}` : `Continue ${step.maneuver.modifier || 'straight'}`;
                          
                          return (
                              <div key={i} style={{ padding: "12px 0", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", display: "flex", gap: "15px", alignItems: "center" }}>
                                  <span style={{ fontSize: "1.3rem" }}>{icon}</span>
                                  <div>
                                      <p style={{ margin: "0 0 4px 0", color: "var(--text)", fontSize: "0.95rem" }}>
                                          <span style={{ textTransform: "capitalize", fontWeight: "600", color: "var(--text)" }}>{step.maneuver.type}</span>: {instruction}
                                      </p>
                                      {step.distance > 0 && <span style={{ color: "var(--text)", fontSize: "0.8rem" }}>{Math.round(step.distance)}m</span>}
                                  </div>
                              </div>
                          );
                      }) : <p style={{ color: "var(--text)" }}>No detailed steps available for this route.</p>}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}