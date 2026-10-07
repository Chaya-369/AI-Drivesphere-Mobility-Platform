import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Intro() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slides = [
    {
      title: "Welcome to DriveSphere",
      description: "Experience the next generation of smart car rentals powered by AI. Seamless, secure, and stylish.",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1920&auto=format&fit=crop",
      icon: ""
    },
    {
      title: "Smart AI Features",
      description: "Unlock the future with AI Match, dynamic pricing, 3D previews, and intelligent route planning.",
      image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1920&auto=format&fit=crop",
      icon: ""
    },
    {
      title: "Safety & Sustainability",
      description: "Travel with peace of mind using our Women Safety Mode, Live Tracking, and Eco-friendly EV fleets.",
      image: "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?q=80&w=1920&auto=format&fit=crop",
      icon: "️"
    }
  ];

  // Auto-advance slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [current]);

  const handleNext = () => {
    setFade(false);
    setTimeout(() => {
      if (current < slides.length - 1) {
        setCurrent(current + 1);
      } else {
        handleExit();
      }
      setFade(true);
    }, 400); // Wait for fade out
  };

  const handleExit = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.log(err));
    }
    navigate("/login");
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
        });
      }
    }
  };

  // Listen for fullscreen changes (e.g. user pressing ESC)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div style={{
      position: "fixed", // Ensure it covers everything
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      backgroundColor: "var(--text)",
      zIndex: 9999
    }}>
      {/* Full Screen Background Image */}
      {slides.map((slide, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: current === index && fade ? 1 : 0,
            transform: current === index && fade ? "scale(1)" : "scale(1.05)",
            transition: "opacity 0.8s ease, transform 6s ease-out",
            zIndex: 1
          }}
        />
      ))}

      {/* Deep Cinematic Gradient Overlay */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, width: "100%", height: "100%",
        background: "radial-gradient(circle at center, rgba(15, 23, 42, 0.3) 0%, rgba(15, 23, 42, 0.9) 100%)",
        zIndex: 2
      }} />

      {/* Top Controls */}
      <div style={{
        position: "absolute",
        top: "30px",
        right: "30px",
        zIndex: 10,
        display: "flex",
        gap: "15px"
      }}>
        {/* Fullscreen Toggle */}
        <button 
          onClick={toggleFullscreen}
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            color: "var(--text)",
            width: "45px",
            height: "45px",
            borderRadius: "50%",
            cursor: "pointer",
            backdropFilter: "blur(10px)",
            fontSize: "1.2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 6px rgba(15, 23, 42, 0.05)"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(59, 130, 246, 0.2)"; e.currentTarget.style.transform = "scale(1.1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(15, 23, 42, 0.4)"; e.currentTarget.style.transform = "scale(1)"; }}
          title="Toggle Fullscreen"
        >
          {isFullscreen ? "" : ""}
        </button>

        {/* Skip Button */}
        <button 
          onClick={handleExit}
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "var(--text)",
            padding: "10px 24px",
            borderRadius: "30px",
            cursor: "pointer",
            backdropFilter: "blur(10px)",
            fontSize: "0.95rem",
            fontWeight: "600",
            transition: "all 0.3s ease",
            textTransform: "uppercase",
            letterSpacing: "1px"
          }}
          onMouseEnter={(e) => { e.target.style.background = "rgba(255, 255, 255, 0.2)"; e.target.style.transform = "scale(1.05)"; }}
          onMouseLeave={(e) => { e.target.style.background = "rgba(255, 255, 255, 0.1)"; e.target.style.transform = "scale(1)"; }}
        >
          Skip Intro
        </button>
      </div>

      {/* Content Overlay */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
      }}>
        
        {/* Glassmorphic Content Card */}
        <div style={{
          background: "var(--bg-card)",
          backdropFilter: "blur(25px)",
          WebkitBackdropFilter: "blur(25px)",
          border: "1px solid var(--border)",
          borderTop: "1px solid rgba(255, 255, 255, 0.2)",
          borderLeft: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "32px",
          padding: "60px 50px",
          maxWidth: "850px",
          width: "90%",
          boxShadow: "0 4px 6px rgba(15, 23, 42, 0.05)",
          opacity: fade ? 1 : 0,
          transform: fade ? "translateY(0) scale(1)" : "translateY(30px) scale(0.98)",
          transition: "opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)"
        }}>
          
          <div style={{ 
            fontSize: "4.5rem", 
            marginBottom: "20px", 
            filter: "drop-shadow(0 10px 15px var(--glass-bg))",
            animation: fade ? "float 3s ease-in-out infinite" : "none"
          }}>
            {slides[current].icon}
          </div>
          
          <h1 style={{ 
            fontSize: "3.5rem", 
            fontWeight: "900", 
            marginBottom: "20px", 
            background: "var(--text)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 10px 30px var(--glass-bg)",
            lineHeight: "1.2"
          }}>
            {slides[current].title}
          </h1>
          
          <p style={{ 
            fontSize: "1.3rem", 
            color: "var(--text)", 
            lineHeight: "1.7", 
            marginBottom: "50px",
            maxWidth: "650px",
            margin: "0 auto 50px auto",
            fontWeight: "400"
          }}>
            {slides[current].description}
          </p>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 10px", marginTop: "20px" }}>
            
            {/* Dots Indicator */}
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              {slides.map((_, index) => (
                <div 
                  key={index}
                  style={{
                    width: current === index ? "40px" : "12px",
                    height: "12px",
                    borderRadius: "6px",
                    background: current === index ? "var(--accent-gradient)" : "rgba(255, 255, 255, 0.2)",
                    transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    boxShadow: current === index ? "0 0 15px rgba(59, 130, 246, 0.6)" : "none",
                    cursor: "pointer"
                  }}
                  onClick={() => {
                    setFade(false);
                    setTimeout(() => { setCurrent(index); setFade(true); }, 400);
                  }}
                />
              ))}
            </div>

            {/* Next / Get Started Button */}
            <button 
              onClick={handleNext}
              style={{
                background: current === slides.length - 1 ? "var(--accent-gradient)" : "rgba(255, 255, 255, 0.1)",
                color: "var(--text)",
                border: current === slides.length - 1 ? "none" : "1px solid rgba(255, 255, 255, 0.3)",
                padding: "16px 40px",
                fontSize: "1.15rem",
                fontWeight: "700",
                borderRadius: "30px",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                boxShadow: current === slides.length - 1 ? "0 10px 25px rgba(59, 130, 246, 0.5)" : "0 4px 15px rgba(15, 23, 42, 0.2)",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                if (current !== slides.length - 1) {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                } else {
                  e.currentTarget.style.boxShadow = "0 15px 35px rgba(59, 130, 246, 0.6)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                if (current !== slides.length - 1) {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                } else {
                  e.currentTarget.style.boxShadow = "0 10px 25px rgba(59, 130, 246, 0.5)";
                }
              }}
            >
              {current === slides.length - 1 ? "Enter DriveSphere" : "Next"} 
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
}

export default Intro;