import { useState, useEffect, useRef } from "react";
import BackButton from "../components/BackButton";
import "./Auth.css";

// --- Leaflet Imports ---
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";

// Custom Leaflet Icons (avoiding broken image paths and matching our aesthetic)
const carIcon = new L.DivIcon({
  html: `<div style="font-size: 26px; line-height: 26px; filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.8));"></div>`,
  className: "custom-leaflet-icon",
  iconSize: [26, 26],
  iconAnchor: [13, 13]
});

const deviceIcon = new L.DivIcon({
  html: `<div style="font-size: 26px; line-height: 26px; filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.8));"></div>`,
  className: "custom-leaflet-icon",
  iconSize: [26, 26],
  iconAnchor: [13, 13]
});

const dotIcon = new L.DivIcon({
  html: `<div style="width: 10px; height: 10px; background: var(--accent); border: 2px solid var(--bg-card); border-radius: 50%; box-shadow: 0 0 4px var(--glass-bg);"></div>`,
  className: "custom-leaflet-icon",
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

// Component to dynamically update map view based on the tracked vehicle
function MapUpdater({ pos, waypoints, isTrackingSelected }) {
  const map = useMap();
  
  useEffect(() => {
    // If the vehicle changes or we get new waypoints, fit the bounds to see the whole route
    if (waypoints && waypoints.length > 1) {
      map.fitBounds(waypoints, { padding: [30, 30], maxZoom: 13, animate: true });
    } else if (pos && pos[0] !== 0) {
      map.setView(pos, 14, { animate: true });
    }
  }, [waypoints]); // Only run when waypoints change (e.g. switching vehicles)

  useEffect(() => {
    // If we are actively tracking, smoothly pan the map to follow the car
    if (isTrackingSelected && pos && pos[0] !== 0) {
      map.panTo(pos, { animate: true, duration: 1.5 });
    }
  }, [pos, isTrackingSelected, map]);

  return null;
}

const INITIAL_FLEET = [
  { id: "MY_DEVICE", name: "My Real Device", driver: "You", route: { from: "Current Location", to: "Live Tracking", waypoints: [], labels: ["Real-world Location"] } },
  { id: "KA01AB1234", name: "Hyundai Creta", driver: "Ravi Kumar", route: { from: "Bangalore", to: "Mysore", waypoints: [[12.9716,77.5946],[12.8700,77.4800],[12.7200,77.2100],[12.4500,76.9800],[12.2958,76.6394]], labels: ["Bangalore Central", "Kengeri", "Mandya", "Srirangapatna", "Mysore"] } },
  { id: "KA05CD5678", name: "Toyota Innova", driver: "Suresh Babu", route: { from: "Bangalore", to: "Chennai", waypoints: [[12.9716,77.5946],[12.9500,78.1000],[12.9200,78.9000],[13.0200,79.7000],[13.0827,80.2707]], labels: ["Bangalore", "Krishnagiri", "Vellore", "Kanchipuram", "Chennai"] } },
  { id: "TN09EF9012", name: "BMW X5", driver: "Priya Nair", route: { from: "Chennai", to: "Coimbatore", waypoints: [[13.0827,80.2707],[12.7206,79.9000],[12.1211,79.2500],[11.6643,78.1460],[11.0168,76.9558]], labels: ["Chennai", "Villupuram", "Salem", "Erode", "Coimbatore"] } },
];

function interpolate(wp, t) {
  if (!wp || wp.length < 2) return wp[0] || [0,0];
  const total = wp.length - 1;
  const seg = Math.min(Math.floor(t * total), total - 1);
  const localT = (t * total) - seg;
  const a = wp[seg], b = wp[seg + 1];
  return [a[0] + (b[0]-a[0])*localT, a[1] + (b[1]-a[1])*localT];
}

function getProgress(t, labels) {
  if (!labels || labels.length === 0) return "Unknown";
  if (labels.length === 1) return labels[0];
  const idx = Math.min(Math.floor(t * (labels.length-1)), labels.length-2);
  return labels[idx] || "Unknown";
}

export default function LiveTracking() {
  const [fleet, setFleet] = useState(INITIAL_FLEET);
  const [selected, setSelected] = useState(INITIAL_FLEET[0].id);
  const [progresses, setProgresses] = useState(() => INITIAL_FLEET.reduce((a,v) => ({...a,[v.id]: Math.random()*0.6+0.1}), {}));
  const [speeds, setSpeeds] = useState(() => INITIAL_FLEET.reduce((a,v) => ({...a,[v.id]: Math.floor(Math.random()*25)+45}), {}));
  const [tracking, setTracking] = useState(false);
  
  // Real Device State
  const [myWaypoints, setMyWaypoints] = useState([]);
  const [mySpeed, setMySpeed] = useState(0);
  const [myLocLabel, setMyLocLabel] = useState("Acquiring GPS...");
  const [geoError, setGeoError] = useState("");

  // Custom Trip State
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const intervalRef = useRef(null);
  const watchIdRef = useRef(null);

  useEffect(() => {
    if (tracking) {
      if (selected === "MY_DEVICE") {
        if ("geolocation" in navigator) {
          watchIdRef.current = navigator.geolocation.watchPosition(
            async (pos) => {
              setGeoError("");
              const { latitude, longitude, speed } = pos.coords;
              const newPos = [latitude, longitude];
              
              setMyWaypoints(prev => [...prev.slice(-49), newPos]);
              setMySpeed(speed ? Math.round(speed * 3.6) : 0); // Convert m/s to km/h
              
              // Reverse Geocode
              try {
                const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                const d = await r.json();
                setMyLocLabel(d.address?.suburb || d.address?.city || d.address?.town || d.address?.village || "Unknown Area");
              } catch(_) {}
            },
            (err) => {
              console.error(err);
              setGeoError("GPS Error: Please enable location permissions.");
              setTracking(false);
            },
            { enableHighAccuracy: true, maximumAge: 0 }
          );
        } else {
          setGeoError("Geolocation is not supported by your browser.");
          setTracking(false);
        }
      } else {
        intervalRef.current = setInterval(() => {
          setProgresses(prev => {
            const next = {...prev};
            fleet.forEach(v => {
              if (v.id !== "MY_DEVICE") next[v.id] = Math.min((prev[v.id] || 0) + 0.015, 0.99);
            });
            return next;
          });
          setSpeeds(prev => {
            const next = {...prev};
            fleet.forEach(v => { 
              if (v.id !== "MY_DEVICE") next[v.id] = Math.floor(Math.random()*25)+65; 
            });
            return next;
          });
        }, 1000);
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (watchIdRef.current !== null && "geolocation" in navigator) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [tracking, selected, fleet]);

  const handleCreateCustom = async () => {
    if (!customFrom || !customTo) {
      alert("Please enter both Origin and Destination.");
      return;
    }
    setIsCreating(true);
    setGeoError("");
    try {
      const geocode = async (place) => {
        const r = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place + ", India")}&format=json&limit=1`, { headers: { "Accept-Language": "en" } });
        const d = await r.json();
        if (!d.length) throw new Error(`Location not found: ${place}`);
        return { lat: +d[0].lat, lon: +d[0].lon, name: d[0].display_name.split(",")[0] };
      };
      
      const [A, B] = await Promise.all([geocode(customFrom), geocode(customTo)]);
      
      const osrm = await fetch(`https://router.project-osrm.org/route/v1/driving/${A.lon},${A.lat};${B.lon},${B.lat}?overview=simplified&geometries=geojson`);
      const rd = await osrm.json();
      if (rd.code !== "Ok" || !rd.routes || rd.routes.length === 0) throw new Error("No driving route found between these locations.");
      
      const waypoints = rd.routes[0].geometry.coordinates.map(c => [c[1], c[0]]); // [lat, lon]
      
      const newId = `CUST-${Math.floor(Math.random()*10000)}`;
      const newVehicle = {
        id: newId,
        name: "Custom Fleet Car",
        driver: "AI Driver",
        route: {
          from: A.name,
          to: B.name,
          waypoints: waypoints,
          labels: [A.name, "En Route", B.name]
        }
      };

      setFleet(prev => [prev[0], newVehicle, ...prev.slice(1)]); // Insert right after MY_DEVICE
      setProgresses(prev => ({...prev, [newId]: 0.01}));
      setSpeeds(prev => ({...prev, [newId]: 65}));
      setSelected(newId);
      setCustomFrom("");
      setCustomTo("");
      setTracking(true); // Auto start tracking
    } catch (e) {
      setGeoError(e.message);
    } finally {
      setIsCreating(false);
    }
  };

  const vehicle = fleet.find(v => v.id === selected) || fleet[0];
  const isReal = selected === "MY_DEVICE";
  
  const progress = isReal ? 1 : (progresses[selected] || 0);
  const speed = isReal ? mySpeed : (speeds[selected] || 0);
  
  const wp = isReal ? myWaypoints : vehicle.route.waypoints;
  const pos = isReal ? (myWaypoints[myWaypoints.length - 1] || [0,0]) : interpolate(wp, progress);
  
  const currentArea = isReal ? myLocLabel : getProgress(progress, vehicle.route.labels);
  
  const distCovered = isReal ? (myWaypoints.length > 1 ? (myWaypoints.length * 0.05).toFixed(1) : 0) : +(wp.length * 55 * progress).toFixed(1);
  const eta = isReal ? "N/A" : Math.round(((wp.length * 55) - distCovered) / (speed || 50) * 60);

  return (
    <div className="auth-page" style={{alignItems:"flex-start", paddingTop:"80px", overflowY:"auto", minHeight:"100vh"}}>
      <div style={{position:"absolute", top:"20px", left:"20px", zIndex:10}}><BackButton /></div>

      <div style={{width:"100%", maxWidth:"1300px", padding:"20px", margin:"0 auto"}}>
        {/* Header */}
        <div style={{textAlign:"center", marginBottom:"35px"}}>
          <span style={{background:"rgba(59, 130, 246, 0.2)", color:"var(--accent)", padding:"7px 20px", borderRadius:"30px", fontWeight:"700", fontSize:"0.85rem", textTransform:"uppercase", letterSpacing:"1px", display:"inline-block", marginBottom:"12px", border:"1px solid rgba(59, 130, 246, 0.3)"}}>
            ️ Live Global Map
          </span>
          <h1 style={{fontSize:"2.8rem", fontWeight:"900", color: "var(--text)", marginBottom:"8px"}}>Real-World Fleet Tracking</h1>
          <p style={{color: "var(--text)", fontSize:"1.05rem"}}>Track your real device location, monitor active fleet, or generate a custom live route on an interactive map.</p>
        </div>

        {geoError && <div style={{background:"var(--accent-bg)", color:"var(--accent)", padding:"12px 20px", borderRadius:"10px", border:"1px solid rgba(59, 130, 246, 0.3)", maxWidth:"600px", margin:"0 auto 20px auto", textAlign:"center"}}>{geoError}</div>}

        <div style={{display:"flex", flexWrap:"wrap", gap:"25px", alignItems:"flex-start"}}>
          {/* Fleet List & Custom Trip Creator */}
          <div style={{flex:"0 0 280px", display:"flex", flexDirection:"column", gap:"12px"}}>
            
            {/* Custom Trip Generator */}
            <div style={{background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius:"14px", padding:"16px"}}>
              <div style={{color: "var(--text)", fontSize:"0.85rem", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"10px", fontWeight:"700"}}> Track Custom Route</div>
              <input type="text" placeholder="Origin" value={customFrom} onChange={e=>setCustomFrom(e.target.value)}
                style={{width:"100%", padding:"10px", marginBottom:"8px", background:"rgba(15, 23, 42, 0.3)", border: "1px solid var(--border)", borderRadius:"8px", color: "var(--text)", outline:"none", fontSize:"0.9rem"}} />
              <input type="text" placeholder="Destination" value={customTo} onChange={e=>setCustomTo(e.target.value)}
                style={{width:"100%", padding:"10px", marginBottom:"12px", background:"rgba(15, 23, 42, 0.3)", border: "1px solid var(--border)", borderRadius:"8px", color: "var(--text)", outline:"none", fontSize:"0.9rem"}} />
              <button onClick={handleCreateCustom} disabled={isCreating} style={{
                width:"100%", background: isCreating ? "var(--text)" : "linear-gradient(135deg,var(--accent),var(--accent))", color: "var(--text)", 
                border:"none", padding:"10px", borderRadius:"8px", fontWeight:"700", cursor:"pointer"
              }}>
                {isCreating ? "Generating..." : "Spawn Live Vehicle"}
              </button>
            </div>

            <div style={{color: "var(--text)", fontSize:"0.85rem", textTransform:"uppercase", letterSpacing:"1px", marginTop:"10px", marginBottom:"5px"}}>Active Tracking ({fleet.length})</div>
            
            {fleet.map(v => {
              const isMe = v.id === "MY_DEVICE";
              const isSelected = v.id === selected;
              
              let p = 0, loc = "Unknown";
              if (isMe) {
                p = myWaypoints.length > 0 ? 1 : 0;
                loc = myLocLabel;
              } else {
                p = progresses[v.id] || 0;
                loc = getProgress(p, v.route.labels);
              }

              return (
                <div key={v.id} onClick={() => { setSelected(v.id); setTracking(false); }} style={{
                  background: isSelected ? "rgba(59, 130, 246, 0.12)" : "var(--glass-bg)",
                  border: `1px solid ${isSelected ? "rgba(59, 130, 246, 0.5)" : "rgba(255, 255, 255, 0.07)"}`,
                  borderRadius:"14px", padding:"16px", cursor:"pointer",
                  transition:"all 0.3s", boxShadow: isSelected ? "0 0 20px rgba(59, 130, 246, 0.15)" : "none"
                }}>
                  <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"6px"}}>
                    <span style={{color: isMe ? "var(--accent)" : "var(--bg-card)", fontWeight:"700", fontSize:"0.95rem"}}>
                      {isMe ? " " : ""}{v.name}
                    </span>
                    <span style={{display:"flex", alignItems:"center", gap:"5px", fontSize:"0.8rem", color:"var(--accent)"}}>
                      <span style={{width:"7px", height:"7px", background:"var(--accent)", borderRadius:"50%", boxShadow:"0 0 6px var(--accent)", animation:"pulse-g 2s infinite"}}></span>
                      {isMe ? "Real GPS" : "Live"}
                    </span>
                  </div>
                  <div style={{color:"var(--accent)", fontSize:"0.8rem", marginBottom:"4px"}}>🪪 {v.id}</div>
                  <div style={{color: "var(--text)", fontSize:"0.8rem", marginBottom:"8px"}}> {v.driver}</div>
                  <div style={{fontSize:"0.75rem", color: "var(--text)"}}> {loc}</div>
                  
                  {!isMe && (
                    <div style={{marginTop:"8px", background: "var(--bg-card)", borderRadius:"6px", height:"5px", overflow:"hidden"}}>
                      <div style={{height:"100%", width:`${p*100}%`, background: "var(--text)", transition:"width 1s ease"}}></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Map + Telemetry */}
          <div style={{flex:"1 1 600px", display:"flex", flexDirection:"column", gap:"20px"}}>
            {/* Map Card */}
            <div className="auth-card" style={{maxWidth:"100%", padding:"0", background:"rgba(15, 23, 42, 0.8)", border:"1px solid rgba(59, 130, 246, 0.2)", overflow:"hidden"}}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 25px", borderBottom:"1px solid rgba(255, 255, 255, 0.05)"}}>
                <div>
                  <h3 style={{color: "var(--text)", margin:"0 0 4px 0", fontSize:"1.3rem"}}>{vehicle.name}</h3>
                  <p style={{color: "var(--text)", margin:0, fontSize:"0.9rem"}}>{vehicle.route.from} → {vehicle.route.to}</p>
                </div>
                <button onClick={() => setTracking(t=>!t)} style={{
                  background: tracking ? "var(--accent-bg)" : "linear-gradient(135deg,var(--accent),var(--accent))",
                  color: tracking ? "var(--accent)" : "var(--bg-card)", border: tracking ? "1px solid rgba(59, 130, 246, 0.3)" : "none",
                  padding:"10px 22px", borderRadius:"10px", fontWeight:"700", cursor:"pointer", transition:"all 0.3s",
                  zIndex: 1000
                }}>
                  {tracking ? "⏹ Stop Tracking" : "▶ Start Tracking"}
                </button>
              </div>

              {/* Real World Interactive Leaflet Map */}
              <div style={{ height: "340px", width: "100%", position: "relative", zIndex: 0 }}>
                {wp.length === 0 && tracking && isReal ? (
                  <div style={{width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--accent)", fontSize:"1.2rem", background:"rgba(15, 23, 42, 0.4)"}}>
                     Connecting to satellites...
                  </div>
                ) : wp.length === 0 && !tracking && isReal ? (
                  <div style={{width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--accent)", fontSize:"1.2rem", background:"rgba(15, 23, 42, 0.4)"}}>
                    ▶ Press Start Tracking to access device GPS
                  </div>
                ) : wp.length === 0 ? (
                  <div style={{width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--accent)", fontSize:"1.2rem", background:"rgba(15, 23, 42, 0.4)"}}>
                    ️ No route data available.
                  </div>
                ) : (
                  <MapContainer 
                    center={pos[0] !== 0 ? pos : wp[0]} 
                    zoom={12} 
                    style={{ height: "100%", width: "100%", background: "var(--bg-card)" }}
                    zoomControl={false}
                  >
                    {/* Dark mode real-world tiles from CartoDB */}
                    <TileLayer
                      url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />
                    
                    {/* The Route Line */}
                    {!isReal && (
                      <Polyline 
                        positions={wp} 
                        color="var(--accent)" 
                        weight={4} 
                        opacity={0.6} 
                        dashArray="8, 6"
                      />
                    )}

                    {/* Start and End Dots */}
                    {!isReal && wp.length > 0 && (
                      <>
                        <Marker position={wp[0]} icon={dotIcon} />
                        <Marker position={wp[wp.length - 1]} icon={dotIcon} />
                      </>
                    )}

                    {/* The Moving Vehicle */}
                    <Marker position={pos} icon={isReal ? deviceIcon : carIcon}>
                      <Popup>
                        <div style={{color:"var(--text)", fontWeight:"600"}}>{isReal ? "Your Device" : vehicle.name}</div>
                        <div style={{color:"var(--accent)", fontSize:"0.8rem"}}>{speed} km/h</div>
                      </Popup>
                    </Marker>

                    {/* Invisible component to handle dynamic panning & bounds */}
                    <MapUpdater pos={pos} waypoints={wp} isTrackingSelected={tracking} />
                  </MapContainer>
                )}
                
                {/* Coordinates overlay (custom floating widget) */}
                {wp.length > 0 && (
                  <div style={{position:"absolute", bottom:"15px", right:"15px", background: "var(--bg-card)", padding:"6px 12px", borderRadius:"8px", fontFamily:"monospace", fontSize:"0.85rem", color: "var(--text)", zIndex:1000, border: "1px solid var(--border)", backdropFilter:"blur(5px)"}}>
                    {pos[0].toFixed(5)}°N, {pos[1].toFixed(5)}°E
                  </div>
                )}
              </div>
            </div>

            {/* Telemetry Grid */}
            <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"15px"}}>
              {[
                {label:"Speed",value:`${speed} km/h`,color: "var(--text)",icon:""},
                {label:"Covered",value:`${distCovered} km`,color: "var(--text)",icon:""},
                {label:"ETA",value:eta === "N/A" ? "Live" : `${eta} min`,color:"var(--accent)",icon:"⏱️"},
                {label:"Driver",value:vehicle.driver.split(" ")[0],color:"var(--accent)",icon:""},
              ].map((t,i)=>(
                <div key={i} style={{background: "var(--bg-card)", padding:"18px", borderRadius:"14px", border:"1px solid rgba(255, 255, 255, 0.05)"}}>
                  <div style={{fontSize:"1.3rem", marginBottom:"6px"}}>{t.icon}</div>
                  <div style={{color:"var(--accent)", fontSize:"0.75rem", textTransform:"uppercase", marginBottom:"4px"}}>{t.label}</div>
                  <div style={{color:t.color, fontSize:"1.3rem", fontWeight:"800"}}>{t.value}</div>
                </div>
              ))}
            </div>

            {/* Current location info */}
            <div style={{background: "var(--text)", border:"1px solid rgba(59, 130, 246, 0.3)", borderRadius:"14px", padding:"18px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <div>
                <p style={{color:"var(--accent)", fontSize:"0.8rem", textTransform:"uppercase", margin:"0 0 5px 0"}}>Current Location</p>
                <p style={{color:"var(--accent)", fontSize:"1.2rem", fontWeight:"700", margin:0}}> {currentArea}</p>
              </div>
              {!isReal && (
                <div style={{textAlign:"right"}}>
                  <p style={{color:"var(--accent)", fontSize:"0.8rem", textTransform:"uppercase", margin:"0 0 5px 0"}}>Route Progress</p>
                  <p style={{color: "var(--text)", fontSize:"1.2rem", fontWeight:"700", margin:0}}>{Math.round(progress*100)}%</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .leaflet-container {
          background: var(--text) !important;
        }
        .custom-leaflet-icon {
          background: transparent;
          border: none;
        }
        @keyframes pulse-g { 0%,100%{box-shadow:0 0 0 0 rgba(59, 130, 246, 0.6);} 70%{box-shadow:0 0 0 8px rgba(59, 130, 246, 0);} }
      `}</style>
    </div>
  );
}