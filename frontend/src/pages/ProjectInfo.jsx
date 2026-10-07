import BackButton from "../components/BackButton";
import "./Auth.css";

function ProjectInfo() {
  const infoCards = [
    {
      icon: "",
      title: "Project Title",
      desc: "DriveSphere – AI Powered Smart Car Rental Platform",
      color: "var(--text)" // Pink
    },
    {
      icon: "",
      title: "Technology Stack",
      desc: "React, Python Flask, MongoDB, JavaScript, HTML, CSS, REST APIs",
      color: "var(--text)" // Cyan
    },
    {
      icon: "",
      title: "Main Modules",
      desc: "User, Owner, Admin, Booking, Payment, AI Features, Safety, Reviews",
      color: "var(--text)" // Yellow
    },
    {
      icon: "",
      title: "AI Features",
      desc: "AI Match, AI Pricing, Chatbot, Damage Detection, 3D Preview",
      color: "var(--text)" // Purple
    },
    {
      icon: "",
      title: "Unique Features",
      desc: "Smart unlock, EV sustainability, live tracking, trip planner, favorites",
      color: "var(--text)" // Green
    },
    {
      icon: "",
      title: "Project Outcome",
      desc: "A modern full-stack rental system with smart and real-world features.",
      color: "var(--text)" // Red
    }
  ];

  return (
    <div className="auth-page" style={{ paddingTop: "80px", overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 10 }}>
        <BackButton />
      </div>

      <div style={{ 
        width: "100%", 
        maxWidth: "1200px", 
        padding: "20px",
        textAlign: "center"
      }}>
        <div style={{ marginBottom: "60px" }}>
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
            marginBottom: "20px",
            border: "1px solid rgba(59, 130, 246, 0.3)"
          }}>
            Technical Overview
          </span>
          <h1 style={{ 
            fontSize: "2.8rem", 
            fontWeight: "900", 
            color: "var(--text)", 
            marginBottom: "20px",
            lineHeight: "1.2"
          }}>
            Project Information
          </h1>
          <p style={{ 
            fontSize: "1.3rem", 
            color: "var(--text)", 
            lineHeight: "1.6",
            maxWidth: "700px",
            margin: "0 auto",
            fontWeight: "400"
          }}>
            A deep dive into the architecture, features, and technology stack behind DriveSphere.
          </p>
        </div>

        {/* Info Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "30px",
          paddingBottom: "50px"
        }}>
          {infoCards.map((card, index) => (
            <div 
              key={index}
              style={{
                background: "var(--bg-card)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "24px",
                padding: "35px 30px",
                textAlign: "left",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                gap: "15px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-10px)";
                e.currentTarget.style.boxShadow = `0 20px 40px rgba(15, 23, 42, 0.4), 0 0 20px ${card.color}22`;
                e.currentTarget.style.borderColor = `${card.color}66`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
              }}
            >
              {/* Subtle Background Glow */}
              <div style={{
                position: "absolute",
                top: "-30px",
                right: "-30px",
                width: "120px",
                height: "120px",
                background: card.color,
                filter: "blur(70px)",
                opacity: 0.15,
                zIndex: 0
              }} />

              <div style={{ 
                fontSize: "3rem", 
                position: "relative", 
                zIndex: 1,
                filter: "drop-shadow(0 4px 6px rgba(15, 23, 42, 0.3))"
              }}>
                {card.icon}
              </div>
              <h3 style={{ 
                fontSize: "1.6rem", 
                fontWeight: "700", 
                color: "var(--text)", 
                margin: 0,
                position: "relative", 
                zIndex: 1 
              }}>
                {card.title}
              </h3>
              <p style={{ 
                color: "var(--text)", 
                fontSize: "1.15rem", 
                lineHeight: "1.6",
                margin: 0,
                position: "relative", 
                zIndex: 1 
              }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectInfo;