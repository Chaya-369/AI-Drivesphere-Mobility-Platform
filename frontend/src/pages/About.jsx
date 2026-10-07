import BackButton from "../components/BackButton";
import "./Auth.css";

function About() {
  const cards = [
    {
      icon: "",
      title: "Our Mission",
      desc: "To seamlessly connect users and car owners through an ultra-secure booking platform, powered by AI recommendations and state-of-the-art smart travel tools.",
      color: "var(--text)" // Pink
    },
    {
      icon: "",
      title: "Smart Features",
      desc: "Experience AI Match, dynamic pricing, intuitive chatbots, 3D car previews, Women Safety Mode, EV tracking, and real-time live map integrations.",
      color: "var(--text)" // Cyan
    },
    {
      icon: "",
      title: "Our Technology",
      desc: "Engineered for speed and scale using React, Python Flask, MongoDB, RESTful APIs, and responsive, premium glassmorphic UI design.",
      color: "var(--text)" // Yellow
    }
  ];

  return (
    <div className="auth-page" style={{ paddingTop: "80px", overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "absolute", top: "20px", left: "20px" }}>
        <BackButton />
      </div>

      <div style={{ 
        width: "100%", 
        maxWidth: "1000px", 
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
            marginBottom: "20px"
          }}>
            Welcome to the future of mobility
          </span>
          <h1 style={{ 
            fontSize: "2.8rem", 
            fontWeight: "900", 
            color: "var(--text)", 
            marginBottom: "20px",
            lineHeight: "1.2"
          }}>
            About DriveSphere
          </h1>
          <p style={{ 
            fontSize: "1.3rem", 
            color: "var(--text)", 
            lineHeight: "1.6",
            maxWidth: "700px",
            margin: "0 auto",
            fontWeight: "400"
          }}>
            An advanced, AI-powered smart car rental platform meticulously designed for safer, smarter, and incredibly seamless vehicle rentals.
          </p>
        </div>

        {/* Feature Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "30px",
          paddingBottom: "50px"
        }}>
          {cards.map((card, index) => (
            <div 
              key={index}
              style={{
                background: "var(--bg-card)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "24px",
                padding: "40px 30px",
                textAlign: "left",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                overflow: "hidden"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-10px)";
                e.currentTarget.style.boxShadow = `0 20px 40px var(--glass-bg), 0 0 20px ${card.color}22`;
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
                top: "-20px",
                right: "-20px",
                width: "100px",
                height: "100px",
                background: card.color,
                filter: "blur(60px)",
                opacity: 0.15,
                zIndex: 0
              }} />

              <div style={{ 
                fontSize: "3.5rem", 
                marginBottom: "25px", 
                position: "relative", 
                zIndex: 1,
                filter: "drop-shadow(0 4px 6px rgba(15, 23, 42, 0.3))"
              }}>
                {card.icon}
              </div>
              <h3 style={{ 
                fontSize: "1.8rem", 
                fontWeight: "700", 
                color: "var(--text)", 
                marginBottom: "15px",
                position: "relative", 
                zIndex: 1 
              }}>
                {card.title}
              </h3>
              <p style={{ 
                color: "var(--text)", 
                fontSize: "1.1rem", 
                lineHeight: "1.7",
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

export default About;