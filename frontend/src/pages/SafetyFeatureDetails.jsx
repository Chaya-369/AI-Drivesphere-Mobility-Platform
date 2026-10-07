import React from "react";
import { useParams, useNavigate } from "react-router-dom";

function SafetyFeatureDetails() {
  const { name } = useParams();
  const navigate = useNavigate();

  const details = {
    "Emergency SOS": {
      icon: "",
      title: "Emergency SOS",
      desc: "Send an instant emergency alert to trusted contacts with your live location.",
      points: ["One-tap SOS alert", "Live location sharing", "Emergency contact notification"],
    },
    "Live Tracking": {
      icon: "",
      title: "Live Tracking",
      desc: "Track your trip in real time and share your journey status with family.",
      points: ["Real-time GPS simulation", "Trip status updates", "Share route with contacts"],
    },
    "Trusted Contacts": {
      icon: "‍‍",
      title: "Trusted Contacts",
      desc: "Save family or friends as emergency contacts for quick alerts.",
      points: ["Add trusted contacts", "Instant emergency messages", "Safer night travel"],
    },
    "Safe Route AI": {
      icon: "️",
      title: "Safe Route AI",
      desc: "AI suggests safer routes based on lighting, traffic, and safety conditions.",
      points: ["Safe route suggestion", "Avoid risky zones", "Night travel support"],
    },
    "Fake Call Feature": {
      icon: "",
      title: "Fake Call Feature",
      desc: "Start a fake incoming call to exit uncomfortable situations safely.",
      points: ["Fake call screen", "Quick activation", "Useful during unsafe situations"],
    },
    "24/7 Support": {
      icon: "",
      title: "24/7 Support",
      desc: "Get quick support assistance anytime during your rental journey.",
      points: ["Emergency assistance", "Customer support", "Quick help response"],
    },
  };

  const feature = details[name] || {
    icon: "️",
    title: name,
    desc: "Safety feature details.",
    points: ["Smart safety support", "User protection", "Emergency assistance"],
  };

  return (
    <div className="safety-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="safety-detail-card">
        <div className="safety-detail-icon">{feature.icon}</div>

        <h1>{feature.title}</h1>
        <p>{feature.desc}</p>

        <div className="safety-points">
          {feature.points.map((point, index) => (
            <div key={index}> {point}</div>
          ))}
        </div>

        <button onClick={() => alert(`${feature.title} Activated`)}>
          Activate {feature.title}
        </button>
      </div>
    </div>
  );
}

export default SafetyFeatureDetails;