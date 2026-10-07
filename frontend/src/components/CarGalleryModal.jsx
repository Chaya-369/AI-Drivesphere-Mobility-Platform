import React, { useState, useEffect, useRef } from "react";

function getViews(image) {
  return [
    { src: image, label: "Side View",   pos: "center center",  scale: 1.0,  rotY: 0   },
    { src: image, label: "Front View",  pos: "left center",    scale: 1.15, rotY: -35 },
    { src: image, label: "Rear View",   pos: "right center",   scale: 1.15, rotY: 35  },
    { src: image, label: "Close-up",    pos: "center 70%",     scale: 1.4,  rotY: 0   },
  ];
}

export default function CarGalleryModal({ car, onClose, onBook }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [animClass, setAnimClass] = useState("view-in");
  const [direction, setDirection] = useState(1); // 1=right, -1=left
  const pendingIdx = useRef(null);

  const image = car.image || car.imageUrl;
  const views = getViews(image);

  const goTo = (nextIdx) => {
    if (nextIdx === activeIdx) return;
    const dir = nextIdx > activeIdx ? 1 : -1;
    setDirection(dir);
    setAnimClass("view-out");
    pendingIdx.current = nextIdx;
  };

  // After "view-out" animation ends, swap image and play "view-in"
  const handleAnimEnd = () => {
    if (animClass === "view-out" && pendingIdx.current !== null) {
      setActiveIdx(pendingIdx.current);
      pendingIdx.current = null;
      setAnimClass("view-in");
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight") goTo((activeIdx + 1) % views.length);
      if (e.key === "ArrowLeft")  goTo((activeIdx - 1 + views.length) % views.length);
      if (e.key === "Escape")     onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeIdx, views.length, onClose]);

  const active = views[activeIdx];

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(15, 23, 42, 0.88)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
    >
      <div onClick={e => e.stopPropagation()} style={{ background: "var(--bg-card)", borderRadius: "16px", overflow: "hidden", width: "100%", maxWidth: "860px", boxShadow: "0 30px 70px var(--glass-bg)" }}>
        
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid var(--border)" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "800", color: "var(--text)" }}>{car.name}</h2>
            <p style={{ margin: "4px 0 0", color: "var(--text)", fontSize: "0.9rem" }}>{car.brand} · {car.fuel} · {car.seats || "5 Seats"} · ₹{car.price}/day</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--text)" }}>✕</button>
        </div>

        {/* Main Image with 3D rotation */}
        <div style={{ position: "relative", background: "var(--bg-card)", height: "400px", overflow: "hidden", perspective: "1200px" }}>
          <div
            className={`car-view ${animClass}`}
            onAnimationEnd={handleAnimEnd}
            style={{
              width: "100%", height: "100%",
              "--rot": `${active.rotY * direction}deg`,
            }}
          >
            <img
              src={active.src}
              alt={`${car.name} – ${active.label}`}
              style={{
                width: "100%", height: "100%",
                objectFit: "cover",
                objectPosition: active.pos,
                transform: `scale(${active.scale}) rotateY(${active.rotY}deg)`,
                transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
            />
          </div>

          {/* Prev / Next */}
          <button onClick={() => goTo((activeIdx - 1 + views.length) % views.length)}
            style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", background: "rgba(255, 255, 255, 0.92)", border: "none", borderRadius: "50%", width: "44px", height: "44px", fontSize: "1.3rem", cursor: "pointer", boxShadow: "0 2px 8px rgba(15, 23, 42, 0.15)", fontWeight: "700" }}>
            ‹
          </button>
          <button onClick={() => goTo((activeIdx + 1) % views.length)}
            style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "rgba(255, 255, 255, 0.92)", border: "none", borderRadius: "50%", width: "44px", height: "44px", fontSize: "1.3rem", cursor: "pointer", boxShadow: "0 2px 8px rgba(15, 23, 42, 0.15)", fontWeight: "700" }}>
            ›
          </button>

          {/* View label */}
          <div style={{ position: "absolute", top: "14px", left: "14px", background: "rgba(15, 23, 42, 0.65)", color: "var(--text)", borderRadius: "6px", padding: "4px 12px", fontSize: "0.8rem", fontWeight: "600" }}>
            {active.label}
          </div>

          {/* Counter */}
          <div style={{ position: "absolute", bottom: "14px", right: "14px", background: "rgba(15, 23, 42, 0.65)", color: "var(--text)", borderRadius: "20px", padding: "4px 12px", fontSize: "0.82rem", fontWeight: "600" }}>
            {activeIdx + 1} / {views.length}
          </div>
        </div>

        {/* Thumbnail Strip */}
        <div style={{ display: "flex", gap: "8px", padding: "12px 16px", borderBottom: "1px solid var(--border)", overflowX: "auto" }}>
          {views.map((v, i) => (
            <div
              key={i}
              onClick={() => goTo(i)}
              style={{
                position: "relative", flexShrink: 0, width: "90px", height: "64px",
                borderRadius: "8px", overflow: "hidden", cursor: "pointer",
                border: i === activeIdx ? "2px solid var(--text)" : "2px solid transparent",
                opacity: i === activeIdx ? 1 : 0.55,
                transition: "all 0.2s",
              }}
            >
              <img src={v.src} alt={v.label} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: v.pos, transform: `scale(${v.scale}) rotateY(${v.rotY * 0.5}deg)` }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(15, 23, 42, 0.6)", color: "var(--text)", fontSize: "0.62rem", textAlign: "center", padding: "2px 0", fontWeight: "600" }}>
                {v.label}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px" }}>
          <div>
            <span style={{ fontSize: "1.6rem", fontWeight: "800", color: "var(--text)" }}>₹{car.price}</span>
            <span style={{ color: "var(--text)", marginLeft: "6px", fontSize: "1rem" }}>/day</span>
            <span style={{ marginLeft: "14px", fontSize: "0.85rem", color: "var(--text)" }}>≈ ₹{Math.round(car.price / 24)}/hr</span>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={onClose} style={{ padding: "11px 22px", border: "1px solid var(--border)", background: "var(--bg-card)", borderRadius: "8px", cursor: "pointer", fontWeight: "600", color: "var(--text)" }}>Close</button>
            <button onClick={() => { onClose(); onBook(car); }} style={{ padding: "11px 26px", background: "var(--bg-card)", color: "var(--text)", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "1rem" }}>Book Now</button>
          </div>
        </div>
      </div>

      <style>{`
        .car-view { width: 100%; height: 100%; }
        .car-view.view-in {
          animation: carViewIn 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .car-view.view-out {
          animation: carViewOut 0.25s cubic-bezier(0.55, 0.06, 0.68, 0.19) forwards;
        }
        @keyframes carViewOut {
          from { opacity: 1; transform: perspective(800px) rotateY(0deg) scale(1); }
          to   { opacity: 0; transform: perspective(800px) rotateY(var(--rot, 40deg)) scale(0.94); }
        }
        @keyframes carViewIn {
          from { opacity: 0; transform: perspective(800px) rotateY(calc(var(--rot, 40deg) * -1)) scale(0.94); }
          to   { opacity: 1; transform: perspective(800px) rotateY(0deg) scale(1); }
        }
      `}</style>
    </div>
  );
}
