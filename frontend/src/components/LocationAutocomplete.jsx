import React, { useState, useEffect } from "react";

export default function LocationAutocomplete({ placeholder, value, onChange, icon }) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => { setQuery(value); }, [value]);

  const fetchSuggestions = async (text) => {
    if (text.length < 3) { setSuggestions([]); return; }
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(text)}&format=json&limit=5`);
      const data = await res.json();
      setSuggestions(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
    setShowDropdown(true);
    
    clearTimeout(window.autocompTimeout);
    window.autocompTimeout = setTimeout(() => {
      fetchSuggestions(val);
    }, 400);
  };

  const handleSelect = (item) => {
    const parts = item.display_name.split(",");
    const shortName = parts.slice(0, 3).join(",").trim();
    setQuery(shortName);
    onChange(shortName);
    setShowDropdown(false);
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div style={{ position:"absolute", left:"14px", top:"13px", color: icon === "" ? "var(--accent)" : "var(--accent)", zIndex: 2 }}>{icon}</div>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        style={{ width:"100%", padding:"13px 13px 13px 38px", background:"var(--bg-card)", border: "1px solid var(--border)", borderRadius:"10px", color: "var(--text)", outline:"none", position: "relative", zIndex: 1, boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
      />
      {showDropdown && suggestions.length > 0 && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px", marginTop: "5px", zIndex: 1000, maxHeight: "200px", overflowY: "auto", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          {suggestions.map((s, i) => (
            <div 
              key={i} 
              onMouseDown={() => handleSelect(s)} // onMouseDown fires before onBlur
              style={{ padding: "12px 15px", cursor: "pointer", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", color: "var(--text)", fontSize: "0.85rem", textAlign: "left", display:"flex", gap:"10px", alignItems:"center" }}
              onMouseOver={(e) => e.target.style.background = "var(--accent-bg)"}
              onMouseOut={(e) => e.target.style.background = "transparent"}
            >
              <span></span> 
              <span style={{lineHeight:"1.3"}}>{s.display_name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
