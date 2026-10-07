import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import CarGalleryModal from "./components/CarGalleryModal";



import Intro from "./pages/Intro";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AIMatch from "./pages/AIMatch";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import CarDetails from "./pages/CarDetails";
import Payment from "./pages/Payment";
import WomenSafety from "./pages/WomenSafety";
import Review from "./pages/Review";
import DamageDetection from "./pages/DamageDetection";
import PriceCalculator from "./pages/PriceCalculator";
import UserDashboard from "./pages/UserDashboard";

import Support from "./pages/Support";
import FAQ from "./pages/FAQ";
import About from "./pages/About";
import Receipt from "./pages/Receipt";
import TripPlanner from "./pages/TripPlanner";
import SafetyFeatureDetails from "./pages/SafetyFeatureDetails";
import Favorites from "./pages/Favorites";
import ProjectInfo from "./pages/ProjectInfo";
import Invoice from "./pages/Invoice";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Car3DPreview from "./pages/Car3DPreview";
import AIPricing from "./pages/AIPricing";

import Sustainability from "./pages/Sustainability";
import TravelExperience from "./pages/TravelExperience";
import LicenseVerification from "./pages/LicenseVerification";
import CancellationPolicy from "./pages/CancellationPolicy";
import LiveTracking from "./pages/LiveTracking";
import FloatingChatBot from "./pages/FloatingChatBot";
import OwnerCars from "./pages/OwnerCars";
import OwnerBookings from "./pages/OwnerBookings";
import OwnerEarnings from "./pages/OwnerEarnings";
import FeatureDetails from "./pages/FeatureDetails";
 import RoutePlanning from "./pages/RoutePlanning";
import SafetyIntelligence from "./pages/SafetyIntelligence";


import alto from "./assets/cars/alto.png";
import audi from "./assets/cars/audi-a4.png";
import bmw from "./assets/cars/bmw-x5.png";
import byd from "./assets/cars/byd-atto3.png";
import grandi10 from "./assets/cars/grandi10.png";
import hero from "./assets/cars/hero.png";
import city from "./assets/cars/honda-city.png";
import creta from "./assets/cars/hyundai-creta.png";
import i20 from "./assets/cars/hyundai-i20.png";
import konaEV from "./assets/cars/hyundai-kona-ev.png";
import seltos from "./assets/cars/kia-seltos.png";
import kwid from "./assets/cars/kwid.png";
import thar from "./assets/cars/mahindra-thar.png";
import xuv400 from "./assets/cars/mahindra-xuv400.png";
import ertiga from "./assets/cars/maruti-ertiga.png";
import swift from "./assets/cars/maruti-swift.png";
import mercedes from "./assets/cars/mercedes-glc.png";
import mgEV from "./assets/cars/mg-zs-ev.png";
import rangeRover from "./assets/cars/range-rover.png";
import superb from "./assets/cars/skoda-superb.png";
import harrier from "./assets/cars/tata-harrier.png";
import nexonEV from "./assets/cars/tata-nexon-ev.png";
import nexon from "./assets/cars/tata-nexon.png";
import tiago from "./assets/cars/tiago.png";
import innova from "./assets/cars/toyota-innova.png";
import wagonr from "./assets/cars/wagonr.png";
import heroCar from "./assets/cars/bmw-x5.png";



const carImages = {
  "Maruti Alto": alto,
  "Alto": alto,
  "Renault Kwid": kwid,
  "WagonR": wagonr,
  "Tata Tiago": tiago,
  "Tiago": tiago,
  "Hyundai Grand i10": grandi10,
  "Hyundai Creta": creta,
  "Toyota Innova": innova,
  "Mahindra Thar": thar,
  "BMW X5": bmw,
  "Audi A4": audi,
  "Honda City": city,
  "Kia Seltos": seltos,
  "Maruti Swift": swift,
  "Hyundai i20": i20,
  "Tata Nexon EV": nexonEV,
  "MG ZS EV": mgEV,
  "Hyundai Kona EV": konaEV,
  "Skoda Superb": superb,
  "Range Rover": rangeRover,
  "Mercedes GLC": mercedes,
  "Mahindra XUV400": xuv400,
  "Maruti Ertiga": ertiga,
  "Tata Harrier": harrier,
  "Tata Nexon": nexon
};
function HomePage() {
  const navigate = useNavigate();
  
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [gallerycar, setGalleryCar] = useState(null);

  const toggleFavorite = (car) => {
    let updatedFavs;
    // Map with correct image immediately
    const carWithImage = { ...car, image: carImages[car.name] || car.image };
    if (favorites.some((fav) => fav.name === car.name)) {
      updatedFavs = favorites.filter((fav) => fav.name !== car.name);
    } else {
      updatedFavs = [...favorites, carWithImage];
    }
    setFavorites(updatedFavs);
    localStorage.setItem("favorites", JSON.stringify(updatedFavs));
  };
  const [cars, setCars] = useState([
  {
    name: "Maruti Alto",
    brand: "Maruti",
    fuel: "Petrol",
    price: 499,
    image: alto,
  },

  {
    name: "Audi A4",
    brand: "Audi",
    fuel: "Petrol",
    price: 3499,
    image: audi,
  },

  {
    name: "BMW X5",
    brand: "BMW",
    fuel: "Diesel",
    price: 4499,
    image: bmw,
  },

  {
    name: "Hyundai Creta",
    brand: "Hyundai",
    fuel: "Petrol",
    price: 1499,
    image: creta,
  },

  {
    name: "Toyota Innova",
    brand: "Toyota",
    fuel: "Diesel",
    price: 1699,
    image: innova,
  },
]);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/cars")
      .then((response) => setCars(response.data))
      .catch((error) => console.log(error));
  }, []);

  const filteredCars = cars.filter((car) =>
    car.name.toLowerCase().includes(search.toLowerCase()) ||
    car.brand.toLowerCase().includes(search.toLowerCase()) ||
    car.location.toLowerCase().includes(search.toLowerCase())
  );

  // Global carImages is used
  return (
    <div className={darkMode ? "app dark" : "app"}>
      <div style={{ background: "linear-gradient(90deg, var(--accent), #8b5cf6, var(--accent))", color: "var(--text)", textAlign: "center", padding: "10px", fontWeight: "700", fontSize: "0.95rem", letterSpacing: "0.5px" }}>
        🎉 LIMITED TIME: Get 50% OFF your first rental! Use code <span style={{ background: "var(--bg-card)", color: "var(--text)", padding: "2px 6px", borderRadius: "4px", marginLeft: "5px" }}>FIRST50</span>
      </div>
      <nav className="navbar">
        <h2 className="logo">🚘 DriveSphere AI</h2>
        

        <button
          className="theme-btn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>

        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>
      </nav>

      <div className={menuOpen ? "sidebar active" : "sidebar"}>
        <Link to="/home">Home</Link>
        <Link to="/user-dashboard">Dashboard</Link>
        <Link to="/favorites">Favorites</Link>
        <Link to="/my-bookings">Bookings</Link>
      </div>
     
      <section className="hero-section">

  <div className="hero-left">
    <h1>AI Powered Smart Car Rental Platform</h1>

    <p>
      Discover premium cars with AI recommendations,
      safety-first features, and smart travel experiences.
    </p>
    <button
  className="explore-btn"
  onClick={() =>
    document.getElementById("cars-section-target")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }
>
  Explore Cars
</button>

  </div>

  <div className="hero-right">
    <img src={heroCar} alt="Car" />
  </div>

</section>

<section className="safety-section">

  <div className="safety-left">
    <img
      src="https://cdn-icons-png.flaticon.com/512/3062/3062634.png"
      alt="Women Safety"
    />
  </div>
  
  

  <div className="safety-right">
    <h2>Women Safety Mode</h2>

    <p>
      DriveSphere provides advanced women safety features
      including SOS emergency alerts, live location sharing,
      trusted contacts, AI route safety suggestions, and
      24/7 support assistance.
    </p>

    <div className="safety-features">
      <div>🛡️ Emergency SOS</div>
      <div>📍 Live Tracking</div>
      <div>👨‍👩‍👧 Trusted Contact Alerts</div>
      <div>🚓 Safe Route Detection</div>
    </div>

    <button
  className="safety-btn"
  onClick={() => navigate("/women-safety")}
>
  Explore Safety Features
</button>
  </div>

</section>
<section className="ai-features-section" style={{ padding: "4rem 2rem" }}>
  <div style={{ textAlign: "center", marginBottom: "3rem" }}>
    <h2 style={{ fontSize: "2.5rem", fontWeight: "900", background: "var(--accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "10px" }}>Smart AI Features</h2>
    <p style={{ color: "var(--text)", fontSize: "1.2rem" }}>
      Experience next-generation intelligent car rental technology
    </p>
  </div>

  <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "2rem",
    maxWidth: "1200px",
    margin: "0 auto"
  }}>
    
    <div style={{
      background: "var(--glass-bg)", backdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "20px", padding: "30px",
      transition: "transform 0.3s ease, box-shadow 0.3s ease", cursor: "pointer"
    }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 15px 30px var(--glass-bg)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    onClick={() => navigate("/ai-match")}>
      <div style={{ fontSize: "3rem", marginBottom: "15px", filter: "drop-shadow(0 4px 6px rgba(15, 23, 42, 0.3))" }}>🤖</div>
      <h3 style={{ color: "var(--text)", fontSize: "1.3rem", marginBottom: "10px" }}>AI Car Recommendation</h3>
      <p style={{ color: "var(--text)", lineHeight: "1.5" }}>Suggests perfect cars based on budget, trip type, and user preferences.</p>
    </div>

    <div style={{
      background: "var(--glass-bg)", backdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "20px", padding: "30px",
      transition: "transform 0.3s ease, box-shadow 0.3s ease", cursor: "pointer"
    }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 15px 30px var(--glass-bg)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    onClick={() => navigate("/route-planning")}>
      <div style={{ fontSize: "3rem", marginBottom: "15px", filter: "drop-shadow(0 4px 6px rgba(15, 23, 42, 0.3))" }}>📍</div>
      <h3 style={{ color: "var(--text)", fontSize: "1.3rem", marginBottom: "10px" }}>Smart Route Planning</h3>
      <p style={{ color: "var(--text)", lineHeight: "1.5" }}>AI recommends safer and faster travel routes with live traffic updates.</p>
    </div>

    <div style={{
      background: "var(--glass-bg)", backdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "20px", padding: "30px",
      transition: "transform 0.3s ease, box-shadow 0.3s ease", cursor: "pointer"
    }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 15px 30px var(--glass-bg)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    onClick={() => navigate("/safety-intelligence")}>
      <div style={{ fontSize: "3rem", marginBottom: "15px", filter: "drop-shadow(0 4px 6px rgba(15, 23, 42, 0.3))" }}>🛡️</div>
      <h3 style={{ color: "var(--text)", fontSize: "1.3rem", marginBottom: "10px" }}>Safety Intelligence</h3>
      <p style={{ color: "var(--text)", lineHeight: "1.5" }}>Detects unsafe zones and alerts users during night travel.</p>
    </div>

    <div style={{
      background: "var(--glass-bg)", backdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "20px", padding: "30px",
      transition: "transform 0.3s ease, box-shadow 0.3s ease", cursor: "pointer"
    }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 15px 30px var(--glass-bg)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    onClick={() => navigate("/trip-planner")}>
      <div style={{ fontSize: "3rem", marginBottom: "15px", filter: "drop-shadow(0 4px 6px rgba(15, 23, 42, 0.3))" }}>🧭</div>
      <h3 style={{ color: "var(--text)", fontSize: "1.3rem", marginBottom: "10px" }}>Smart Trip Planner</h3>
      <p style={{ color: "var(--text)", lineHeight: "1.5" }}>Plan routes, fuel stops, hotels, and safer travel easily.</p>
    </div>

    <div style={{
      background: "var(--glass-bg)", backdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "20px", padding: "30px",
      transition: "transform 0.3s ease, box-shadow 0.3s ease", cursor: "pointer"
    }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 15px 30px var(--glass-bg)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    onClick={() => navigate("/ai-pricing")}>
      <div style={{ fontSize: "3rem", marginBottom: "15px", filter: "drop-shadow(0 4px 6px rgba(15, 23, 42, 0.3))" }}>💰</div>
      <h3 style={{ color: "var(--text)", fontSize: "1.3rem", marginBottom: "10px" }}>Dynamic Pricing</h3>
      <p style={{ color: "var(--text)", lineHeight: "1.5" }}>AI calculates optimized pricing based on demand and availability.</p>
    </div>

    <div style={{
      background: "var(--glass-bg)", backdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "20px", padding: "30px",
      transition: "transform 0.3s ease, box-shadow 0.3s ease", cursor: "pointer"
    }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 15px 30px var(--glass-bg)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    onClick={() => navigate("/damage-detection")}>
      <div style={{ fontSize: "3rem", marginBottom: "15px", filter: "drop-shadow(0 4px 6px rgba(15, 23, 42, 0.3))" }}>📸</div>
      <h3 style={{ color: "var(--text)", fontSize: "1.3rem", marginBottom: "10px" }}>Damage Detection</h3>
      <p style={{ color: "var(--text)", lineHeight: "1.5" }}>Upload photos to let AI scan for scratches and report damages instantly.</p>
    </div>
  </div>
</section>

      <section className="stats-section" style={{ 
        padding: "4rem 2rem", 
        background: "var(--bg-card)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        margin: "2rem 0"
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "2rem",
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "center"
        }}>
          {[
            { icon: "🤝", title: "Growing", desc: "Community", color: "var(--text)" },
            { icon: "🚘", title: "Premium", desc: "Fleet Selection", color: "var(--text)" },
            { icon: "🛡️", title: "100%", desc: "Quality Assured", color: "var(--text)" },
            { icon: "🎧", title: "24/7", desc: "Dedicated Support", color: "var(--text)" }
          ].map((stat, index) => (
            <div key={index} className="stat-card-premium" style={{
              background: "var(--bg-card)",
              border: "1px solid rgba(15, 23, 42, 0.05)",
              borderRadius: "20px",
              padding: "2rem 1rem",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              cursor: "default",
              boxShadow: "0 4px 6px rgba(15, 23, 42, 0.02)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-10px)";
              e.currentTarget.style.boxShadow = `0 15px 30px rgba(15, 23, 42, 0.08), 0 0 20px ${stat.color}15`;
              e.currentTarget.style.borderColor = stat.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(15, 23, 42, 0.02)";
              e.currentTarget.style.borderColor = "rgba(15, 23, 42, 0.05)";
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{stat.icon}</div>
              <h2 style={{ fontSize: "2.5rem", fontWeight: "800", color: stat.color, marginBottom: "0.5rem" }}>{stat.title}</h2>
              <p style={{ fontSize: "1.1rem", color: "var(--text)", fontWeight: "500", textTransform: "uppercase", letterSpacing: "1px" }}>{stat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cars-section" id="cars-section-target">
  <h2>Available Cars</h2>

  <input
    className="search-box"
    type="text"
    placeholder="Search by car, brand, or location..."
    onChange={(e) => setSearch(e.target.value)}
  />

  <div className="cars-grid">
    {filteredCars.map((car, index) => (
      <div className="car-card" key={index} style={{ position: "relative" }}>
        <div 
          onClick={() => toggleFavorite(car)}
          style={{
            position: 'absolute', top: '10px', right: '10px', 
            fontSize: '1.5rem', cursor: 'pointer', 
            background: 'rgba(255, 255, 255, 0.8)', borderRadius: '50%', 
            width: '35px', height: '35px', display: 'flex', 
            alignItems: 'center', justifyContent: 'center', 
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.2)', transition: 'transform 0.2s'
          }}
        >
          {favorites.some(fav => fav.name === car.name) ? '❤️' : '🤍'}
        </div>
      <div 
        onClick={() => setGalleryCar({ ...car, image: carImages[car.name] || car.image })}
        style={{ position: "relative", cursor: "pointer", overflow: "hidden", borderRadius: "12px 12px 0 0" }}
        onMouseOver={e => e.currentTarget.querySelector('img').style.transform = "scale(1.05)"}
        onMouseOut={e => e.currentTarget.querySelector('img').style.transform = "scale(1)"}
      >
        <img
          src={carImages[car.name] || car.image}
          alt={car.name}
          style={{ width: "100%", display: "block", transition: "transform 0.3s ease" }}
        />
        <div style={{ position: "absolute", bottom: "10px", left: "10px", background: "rgba(15, 23, 42, 0.7)", color: "#ffffff", borderRadius: "20px", padding: "4px 12px", fontSize: "0.75rem", fontWeight: "600", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", gap: "4px" }}>
          📸 Tap to view
        </div>
      </div>
        <h3>{car.name}</h3>
        <p>🚘 {car.brand}</p>
        <p>⛽ {car.fuel}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <p style={{ margin: 0, fontWeight: "700", color: "var(--text)", fontSize: "1.1rem" }}>💰 ₹{car.price}/day</p>
          <p style={{ margin: 0, fontWeight: "600", color: "var(--text)", fontSize: "0.9rem" }}>₹{Math.round(car.price / 24)}/hr</p>
        </div>

       <div className="car-btns">

  <button
    onClick={() => navigate("/car-details", { state: { car: { ...car, image: carImages[car.name] || car.image } } })}
  >
    View Details
  </button>

  <button
    className="preview3d-btn"
    onClick={() => navigate("/car-3d-preview")}
  >
    View 3D
  </button>

</div>
      </div>
    ))}
  </div>
</section>

{gallerycar && (
  <CarGalleryModal
    car={gallerycar}
    onClose={() => setGalleryCar(null)}
    onBook={(car) => navigate("/car-details", { state: { car: { ...car, image: carImages[car.name] || car.image } } })}
  />
)}

      <section className="testimonials">
        <h2>What Our Users Say</h2>

        <div className="testimonial-grid">
          <div className="testimonial-card">
            <p>“DriveSphere made my family trip super easy.”</p>
            <h4>- Rahul Sharma</h4>
          </div>

          <div className="testimonial-card">
            <p>“Women Safety Mode gave me confidence during night travel.”</p>
            <h4>- Priya Verma</h4>
          </div>

          <div className="testimonial-card">
            <p>“Best smart car rental platform with premium experience.”</p>
            <h4>- Arjun Mehta</h4>
          </div>
        </div>
      </section>

      <footer className="footer-pro">
  <div className="footer-pro-grid">
    <div>
      <h2>About DriveSphere</h2>
      <p>
        DriveSphere is an AI-powered smart car rental platform that connects
        users, car owners, and admins through secure booking, smart pricing,
        safety features, EV support, and AI recommendations.
      </p>

      <h4>📍 DriveSphere Rentals Pvt. Ltd.</h4>
      <p>Bangalore, Karnataka, India - 560065</p>
    </div>

    <div>
  <h2>Company</h2>
  <Link to="/terms">Terms and Conditions</Link>
  <Link to="/privacy">Privacy Policy</Link>
  <Link to="/cancellation-policy">Cancellation Policy</Link>
  <Link to="/faq">FAQ</Link>
  <Link to="/project-info">Project Info</Link>
  <Link to="/support">Support</Link>
  <Link to="/about">About</Link>
</div>
   
   <div>
  <h2>Our Services</h2>
  <Link to="/booking">Daily Car Rentals</Link>
  <Link to="/ai-match">AI Car Match</Link>
  <Link to="/sustainability">EV Rentals</Link>
  <Link to="/live-tracking">Live Tracking</Link>
</div>
  </div>

  <div className="footer-bottom">
    <p>© 2026 DriveSphere. All rights reserved.</p>
    <p>Follow us: 🔗 📷 ✕ 🌐</p>
  </div>
</footer>

      <FloatingChatBot />
    </div>
  );
  }

function App() {

  // Global carImages is used
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <>
      <button 
        onClick={toggleFullscreen}
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          background: "rgba(15, 23, 42, 0.7)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          color: "var(--text)",
          fontSize: "1.5rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          zIndex: 9999,
          boxShadow: "0 4px 15px var(--glass-bg)",
          transition: "all 0.3s ease"
        }}
        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.background = "rgba(59, 130, 246, 0.8)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "rgba(15, 23, 42, 0.7)"; }}
      >
        {isFullscreen ? "⛶" : "⛶"}
      </button>
      
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/ai-match" element={<AIMatch />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/car-details" element={<CarDetails />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/women-safety" element={<WomenSafety />} />
        <Route path="/review" element={<Review />} />
        <Route path="/damage-detection" element={<DamageDetection />} />
        <Route path="/price-calculator" element={<PriceCalculator />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        
        <Route path="/support" element={<Support />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/about" element={<About />} />
        <Route path="/trip-planner" element={<TripPlanner />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/project-info" element={<ProjectInfo />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/car-3d-preview" element={<Car3DPreview />} />
        <Route path="/ai-pricing" element={<AIPricing />} />

        <Route path="/sustainability" element={<Sustainability />} />
        <Route path="/travel-experience" element={<TravelExperience />} />
        <Route path="/license-verification" element={<LicenseVerification />}/>
        <Route path="/cancellation-policy" element={<CancellationPolicy />} />
        <Route path="/live-tracking" element={<LiveTracking />} />
        <Route path="/owner-cars" element={<OwnerCars />} />
        <Route path="/owner-bookings" element={<OwnerBookings />} />
        <Route path="/owner-earnings" element={<OwnerEarnings />} />
        <Route path="/feature/:name" element={<FeatureDetails />} />
        <Route path="/receipt" element={<Receipt />} />
        <Route path="/safety-feature/:name" element={<SafetyFeatureDetails />} />
        <Route path="/safety-intelligence" element={<SafetyIntelligence />} />
        <Route path="/route-planning" element={<RoutePlanning />} />
      </Routes>
    </>
  );
}

export default App;