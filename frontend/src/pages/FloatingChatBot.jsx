import { useState, useRef, useEffect } from "react";

function FloatingChatBot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chats, setChats] = useState([
    { sender: "bot", text: "Hi! I'm Miles, your DriveSphere AI Assistant \nAsk me about bookings, cars, pricing, or safety — I'm here 24/7!" }
  ]);
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chats, isTyping]);

  const suggestions = ["Book a car", "Pricing info", "Luxury cars", "EV options", "Safety features"];

  const getReply = (text) => {
    const msg = text.toLowerCase();
    if (msg.includes("hello") || msg.includes("hi"))
      return "Hello!  I'm your 24/7 DriveSphere assistant. How can I help you today?";
    if (msg.includes("booking") || msg.includes("book"))
      return "To book a car: Browse Cars → View Details → Book This Car → Enter dates & location → Complete Payment. Easy! ";
    if (msg.includes("price") || msg.includes("cost") || msg.includes("pricing"))
      return "Use our AI Pricing tool to calculate your exact rental cost based on demand, day type, and duration. ";
    if (msg.includes("cheap") || msg.includes("budget"))
      return "For budget rentals, I suggest: Maruti Swift, Hyundai i20, WagonR, or Alto. All under ₹2000/day! ️";
    if (msg.includes("family"))
      return "For family trips, Toyota Innova (7-seater), Ertiga, or Kia Seltos are perfect choices. ‍‍‍";
    if (msg.includes("luxury"))
      return "For luxury travel, check out BMW X5, Audi A4, or Mercedes-Benz GLC. Nothing but the best! ";
    if (msg.includes("suv"))
      return "For SUVs, Hyundai Creta, Mahindra Thar, Tata Harrier, or Kia Seltos are excellent choices. ️";
    if (msg.includes("ev") || msg.includes("electric"))
      return "Our EVs include Tata Nexon EV, BYD Atto 3, and MG ZS EV. They reduce emissions and earn you green reward points! ";
    if (msg.includes("safety") || msg.includes("sos") || msg.includes("women"))
      return "Our Women Safety Mode includes SOS alerts, live trip sharing with trusted contacts, and 24/7 monitoring. ️";
    if (msg.includes("damage"))
      return "Our AI Damage Detection lets you upload before/after photos to automatically generate a damage comparison report. ";

    if (msg.includes("payment") || msg.includes("pay"))
      return "We support all major payment methods. After payment, an invoice is instantly generated and available to download. ";
    if (msg.includes("tracking") || msg.includes("location"))
      return "Live Tracking shows your rented vehicle's real-time location on a map, improving trip safety and transparency. ";
    if (msg.includes("cancel") || msg.includes("refund"))
      return "You can cancel your booking anytime before pickup. Check our Cancellation Policy for refund eligibility details. ↩️";
    if (msg.includes("owner") || msg.includes("list"))
      return "Want to list your car? Sign up as a Car Owner and manage your fleet via the Owner Dashboard! ";
    return "I can help with bookings, pricing, car recommendations, EV options, safety, damage detection, and more. What would you like to know? ";
  };

  const sendMessage = (text = message) => {
    const msgText = text.trim();
    if (!msgText) return;

    const userMsg = { sender: "user", text: msgText };
    setChats(prev => [...prev, userMsg]);
    setMessage("");
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = { sender: "bot", text: getReply(msgText) };
      setChats(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div style={{
          position: "fixed",
          bottom: "90px",
          right: "25px",
          width: "370px",
          height: "520px",
          background: "var(--bg-card)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 4px 6px rgba(15, 23, 42, 0.05)",
          zIndex: 9999,
          animation: "popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          overflow: "hidden"
        }}>

          {/* Header */}
          <div style={{
            background: "var(--accent)",
            borderBottom: "1px solid rgba(16, 185, 129, 0.2)",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "40px", height: "40px",
                background: "var(--accent)",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.3rem", boxShadow: "0 4px 6px rgba(15, 23, 42, 0.05)"
              }}></div>
              <div>
                <div style={{ color: "var(--text)", fontWeight: "700", fontSize: "0.95rem" }}>Miles - DriveSphere AI</div>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{ width: "7px", height: "7px", background: "var(--accent)", borderRadius: "50%", display: "inline-block" }}></span>
                  <span style={{ color: "var(--text)", fontSize: "0.75rem" }}>Online • 24/7</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "var(--bg-card)", border: "1px solid var(--border)",
                color: "var(--text)", borderRadius: "8px", width: "30px", height: "30px",
                cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(16, 185, 129, 0.2)"; e.currentTarget.style.color = "var(--accent)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-card)"; e.currentTarget.style.color = "var(--text)"; }}
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div ref={chatBodyRef} style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255, 255, 255, 0.1) transparent"
          }}>
            {chats.map((chat, index) => (
              <div key={index} style={{
                display: "flex",
                justifyContent: chat.sender === "user" ? "flex-end" : "flex-start",
                gap: "8px",
                alignItems: "flex-end"
              }}>
                {chat.sender === "bot" && (
                  <div style={{
                    width: "28px", height: "28px", background: "var(--accent)",
                    borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.8rem", flexShrink: 0
                  }}></div>
                )}
                <div style={{
                  maxWidth: "75%",
                  padding: "10px 14px",
                  borderRadius: chat.sender === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: chat.sender === "user"
                    ? "var(--accent-gradient)"
                    : "var(--accent-bg)",
                  border: chat.sender === "user" ? "none" : "1px solid var(--border)",
                  color: chat.sender === "user" ? "#ffffff" : "var(--text)",
                  fontSize: "0.88rem",
                  lineHeight: "1.5",
                  whiteSpace: "pre-wrap",
                  boxShadow: chat.sender === "user" ? "0 4px 12px rgba(16, 185, 129, 0.3)" : "none"
                }}>
                  {chat.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
                <div style={{ width: "28px", height: "28px", background: "var(--accent)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem" }}></div>
                <div style={{
                  padding: "10px 16px",
                  background: "var(--bg-card)",
                  borderRadius: "16px 16px 16px 4px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex", gap: "5px", alignItems: "center"
                }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{
                      width: "6px", height: "6px", background: "var(--accent)", borderRadius: "50%",
                      animation: `bounce 1.2s ${i * 0.2}s infinite`
                    }}></span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Suggestions */}
          <div style={{
            padding: "8px 14px",
            borderTop: "1px solid rgba(255, 255, 255, 0.05)",
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            flexShrink: 0,
            scrollbarWidth: "none"
          }}>
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => sendMessage(s)} style={{
                background: "var(--accent-bg)",
                border: "1px solid var(--border)",
                color: "var(--text)",
                padding: "5px 12px",
                borderRadius: "20px",
                fontSize: "0.78rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(16, 185, 129, 0.25)"; e.currentTarget.style.color = "var(--bg-card)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--accent-bg)"; e.currentTarget.style.color = "var(--accent)"; }}
              >{s}</button>
            ))}
          </div>

          {/* Input Area */}
          <div style={{
            padding: "12px 16px 16px",
            display: "flex",
            gap: "10px",
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
            flexShrink: 0
          }}>
            <input
              value={message}
              placeholder="Ask me anything..."
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              style={{
                flex: 1,
                padding: "10px 15px",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                color: "var(--text)",
                fontSize: "0.9rem",
                outline: "none",
                transition: "border 0.2s ease"
              }}
              onBlur={(e) => e.currentTarget.style.border = "1px solid var(--border)"}
            />
            <button onClick={() => sendMessage()} style={{
              width: "44px", height: "44px",
              background: "var(--accent)",
              border: "none", borderRadius: "12px",
              color: "var(--bg-card)", fontSize: "1.1rem",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 6px rgba(15, 23, 42, 0.05)",
              transition: "transform 0.2s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.08)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              ↑
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "25px",
          right: "25px",
          width: "58px",
          height: "58px",
          background: "var(--accent)",
          border: "none",
          borderRadius: "50%",
          fontSize: "1.5rem",
          cursor: "pointer",
          zIndex: 9999,
          boxShadow: "0 4px 6px rgba(15, 23, 42, 0.05)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.3s ease",
          animation: "pulse-ring 2.5s infinite"
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      >
        {open ? "" : ""}
      </button>

      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.85) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 8px 25px rgba(16, 185, 129, 0.5), 0 0 0 0 rgba(16, 185, 129, 0.35); }
          70% { box-shadow: 0 8px 25px rgba(16, 185, 129, 0.5), 0 0 0 12px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 8px 25px rgba(16, 185, 129, 0.5), 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      `}</style>
    </>
  );
}

export default FloatingChatBot;