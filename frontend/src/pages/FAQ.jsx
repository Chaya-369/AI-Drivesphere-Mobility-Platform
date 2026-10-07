import { useState } from "react";
import "./Auth.css";
import BackButton from "../components/BackButton";

function FAQ() {
  const faqs = [
    {
      icon: "",
      q: "What is DriveSphere?",
      a: "DriveSphere is an advanced AI-powered smart car rental platform built for users, vehicle owners, and platform administrators."
    },
    {
      icon: "",
      q: "How can I book a car?",
      a: "Go to the 'Available Cars' section on the Home Page, click 'View Details', select your dates, and complete the secure payment process."
    },
    {
      icon: "🪪",
      q: "Do I need a driving license?",
      a: "Yes. All users must upload and verify valid driver's license details before renting a car to ensure safety and compliance."
    },
    {
      icon: "",
      q: "Can car owners list their vehicles?",
      a: "Absolutely! Car owners have a dedicated dashboard where they can add cars, set dynamic pricing, and track their total earnings."
    },
    {
      icon: "",
      q: "What AI features are included?",
      a: "The platform features AI Car Match, AI Pricing, an intelligent Chatbot, Damage Detection, and 3D Model Previews."
    },
    {
      icon: "️",
      q: "Is there a safety feature?",
      a: "Yes! DriveSphere includes an exclusive Women Safety Mode featuring SOS alerts, live location tracking, and trusted contacts."
    },
    {
      icon: "",
      q: "Can I rent Electric Vehicles (EV)?",
      a: "Yes! We strongly support sustainability. Renting EVs on DriveSphere calculates your CO₂ savings and grants green rewards."
    },
    {
      icon: "️",
      q: "How does the Admin Dashboard work?",
      a: "Admins have full control to approve or reject new car listings, manage user accounts, and resolve customer support tickets."
    },
    {
      icon: "",
      q: "How do payments work?",
      a: "We offer secure online payment simulation and instantly generate a beautifully formatted, printable invoice after booking."
    },
    {
      icon: "",
      q: "Is this a good academic project?",
      a: "Yes! It integrates modern full-stack technologies like React, Flask, MongoDB, REST APIs, and AI integrations, making it an excellent showcase."
    }
  ];

  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="auth-page" style={{ alignItems: "flex-start", paddingTop: "80px", overflowY: "auto" }}>
      <div style={{ position: "absolute", top: "20px", left: "20px" }}>
        <BackButton />
      </div>

      <div style={{
        width: "100%",
        maxWidth: "900px",
        margin: "0 auto",
        padding: "20px"
      }}>
        
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <h1 style={{ 
            fontSize: "3rem", 
            fontWeight: "800", 
            color: "var(--text)", 
            marginBottom: "15px",
            textShadow: "0 4px 20px var(--glass-bg)"
          }}>
            Frequently Asked Questions
          </h1>
          <p style={{ 
            fontSize: "1.2rem", 
            color: "var(--text)", 
            fontWeight: "500", 
            letterSpacing: "1px" 
          }}>
            Everything you need to know about DriveSphere.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingBottom: "50px" }}>
          {faqs.map((item, index) => (
            <div 
              key={index} 
              style={{
                background: openIndex === index ? "rgba(15, 23, 42, 0.9)" : "rgba(15, 23, 42, 0.6)",
                border: openIndex === index ? "1px solid rgba(59, 130, 246, 0.4)" : "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                overflow: "hidden",
                backdropFilter: "blur(12px)",
                transition: "all 0.3s ease",
                boxShadow: openIndex === index ? "0 10px 30px rgba(15, 23, 42, 0.3)" : "none"
              }}
            >
              <div
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                style={{
                  padding: "20px 25px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  userSelect: "none"
                }}
                onMouseEnter={(e) => {
                  if (openIndex !== index) e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                }}
                onMouseLeave={(e) => {
                  if (openIndex !== index) e.currentTarget.style.background = "transparent";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                  <span style={{ fontSize: "1.5rem" }}>{item.icon}</span>
                  <span style={{ 
                    fontSize: "1.1rem", 
                    fontWeight: openIndex === index ? "700" : "500", 
                    color: openIndex === index ? "var(--accent)" : "var(--bg-card)",
                    transition: "color 0.2s ease"
                  }}>
                    {item.q}
                  </span>
                </div>
                <span style={{ 
                  fontSize: "1.5rem", 
                  color: "var(--text)",
                  transform: openIndex === index ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease"
                }}>
                  ⌄
                </span>
              </div>

              {/* Expanding Answer Section */}
              <div style={{
                maxHeight: openIndex === index ? "200px" : "0",
                opacity: openIndex === index ? 1 : 0,
                transition: "all 0.4s ease",
                padding: openIndex === index ? "0 25px 25px 65px" : "0 25px 0 65px",
                color: "var(--text)",
                fontSize: "1.05rem",
                lineHeight: "1.6"
              }}>
                <div style={{ borderTop: openIndex === index ? "1px solid rgba(255, 255, 255, 0.1)" : "none", paddingTop: openIndex === index ? "15px" : "0" }}>
                  {item.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FAQ;